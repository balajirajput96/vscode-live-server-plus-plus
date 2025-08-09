import * as fs from 'fs';
import * as vscode from 'vscode';
import { Readable } from 'stream';
import { Buffer } from 'buffer';
import { promisify } from 'util';
import { isSupportedFile } from './utils/index';

// Promisified fs operations for better performance
const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);

// Performance optimization: Cache for file stats
const fileStatsCache = new Map<string, { stat: fs.Stats; timestamp: number }>();
const STATS_CACHE_TTL = 5000; // 5 seconds

// Stream version with performance improvements
export const readFileStream = (filePath: string, encoding?: string) => {
  const dirtyFile = getDirtyFileFromVscode(filePath);

  if (dirtyFile) {
    console.log('[Stream]Reading Dirty file:', filePath);
    const stream = new Readable({ encoding });
    setImmediate(() => {
      stream.emit('open');
      stream.push(dirtyFile.getText());
      stream.push(null);
    });
    return stream;
  }

  console.log('[Stream]Reading file from disk: ', filePath);
  return fs.createReadStream(filePath, { 
    encoding,
    highWaterMark: 64 * 1024, // 64KB chunks for better performance
    flags: 'r'
  });
};

// Promise version with performance optimizations
export const readFile = async (filePath: string): Promise<Buffer> => {
  const dirtyFile = getDirtyFileFromVscode(filePath);

  if (dirtyFile) {
    console.log('[Promise]Reading Dirty file: ', filePath);
    return readFileFromVscodeWorkspace(dirtyFile);
  }

  console.log('[Promise]Reading file from disk: ', filePath);
  return readFileFromFileSystem(filePath);
};

// Performance optimization: Batch file operations
export const readMultipleFiles = async (filePaths: string[]): Promise<Map<string, Buffer>> => {
  const results = new Map<string, Buffer>();
  const promises = filePaths.map(async (filePath) => {
    try {
      const content = await readFile(filePath);
      results.set(filePath, content);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  });

  await Promise.all(promises);
  return results;
};

// Performance optimization: Get file stats with caching
export const getFileStats = async (filePath: string): Promise<fs.Stats> => {
  const now = Date.now();
  const cached = fileStatsCache.get(filePath);
  
  if (cached && (now - cached.timestamp) < STATS_CACHE_TTL) {
    return cached.stat;
  }

  try {
    const stat = await statAsync(filePath);
    fileStatsCache.set(filePath, { stat, timestamp: now });
    return stat;
  } catch (error) {
    throw error;
  }
};

// Performance optimization: Check if file exists without throwing
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await statAsync(filePath);
    return true;
  } catch {
    return false;
  }
};

// Performance optimization: Directory listing with filtering
export const readDirectory = async (dirPath: string, filter?: (name: string) => boolean): Promise<string[]> => {
  try {
    const files = await promisify(fs.readdir)(dirPath);
    return filter ? files.filter(filter) : files;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
};

const readFileFromVscodeWorkspace = (filePath: string | vscode.TextDocument) => {
  return new Promise<Buffer>(async (resolve, reject) => {
    let doc: vscode.TextDocument;
    try {
      if (typeof filePath === 'string') {
        doc = await vscode.workspace.openTextDocument(filePath);
      } else {
        doc = filePath;
      }
      const text = doc.getText();
      return resolve(Buffer.from(text));
    } catch (error) {
      reject(error);
    }
  });
};

const readFileFromFileSystem = async (filePath: string) => {
  try {
    return await readFileAsync(filePath);
  } catch (error) {
    throw error;
  }
};

// Private Utils with performance improvements

const getDirtyFileFromVscode = (filePath: string) => {
  // Performance optimization: Use find instead of filter for early termination
  return vscode.workspace.textDocuments.find(
    doc => doc.isDirty && doc.fileName === filePath && isSupportedFile(filePath)
  );
};

// Performance optimization: Clear cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of fileStatsCache.entries()) {
    if (now - value.timestamp > STATS_CACHE_TTL) {
      fileStatsCache.delete(key);
    }
  }
}, STATS_CACHE_TTL);

// Performance optimization: Cleanup on extension deactivation
export const cleanupFileSystem = () => {
  fileStatsCache.clear();
};
