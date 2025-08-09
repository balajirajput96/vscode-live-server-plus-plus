import * as fs from 'fs';
import * as vscode from 'vscode';
import { Readable } from 'stream';
import { Buffer } from 'buffer';
import { isSupportedFile } from './utils/index';

// File cache for better performance
const fileCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds cache TTL

// Stream version with caching
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

  // Check cache first
  const cached = fileCache.get(filePath);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('[Stream]Reading from cache:', filePath);
    const stream = new Readable({ encoding });
    setImmediate(() => {
      stream.emit('open');
      stream.push(cached.content);
      stream.push(null);
    });
    return stream;
  }

  console.log('[Stream]Reading file from disk: ', filePath);
  const stream = fs.createReadStream(filePath, { encoding });
  
  // Cache the file content for future reads
  let content = '';
  stream.on('data', (chunk) => {
    content += chunk;
  });
  
  stream.on('end', () => {
    fileCache.set(filePath, { content, timestamp: Date.now() });
  });

  return stream;
};

// Promise version with caching
export const readFile = (filePath: string): Promise<Buffer> => {
  const dirtyFile = getDirtyFileFromVscode(filePath);

  if (dirtyFile) {
    console.log('[Promise]Reading Dirty file: ', filePath);
    return readFileFromVscodeWorkspace(dirtyFile);
  }

  // Check cache first
  const cached = fileCache.get(filePath);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('[Promise]Reading from cache:', filePath);
    return Promise.resolve(Buffer.from(cached.content));
  }

  console.log('[Promise]Reading file from disk: ', filePath);
  return readFileFromFileSystem(filePath).then(buffer => {
    // Cache the result
    fileCache.set(filePath, { 
      content: buffer.toString(), 
      timestamp: Date.now() 
    });
    return buffer;
  });
};

// Async file reading with better error handling
export const readFileAsync = async (filePath: string): Promise<string> => {
  try {
    const dirtyFile = getDirtyFileFromVscode(filePath);
    if (dirtyFile) {
      return dirtyFile.getText();
    }

    // Check cache
    const cached = fileCache.get(filePath);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.content;
    }

    // Read from disk
    const content = await fs.promises.readFile(filePath, 'utf8');
    fileCache.set(filePath, { content, timestamp: Date.now() });
    return content;
  } catch (error) {
    console.error('Error reading file:', filePath, error);
    throw error;
  }
};

// Cache management utilities
export const clearFileCache = () => {
  fileCache.clear();
};

export const removeFromCache = (filePath: string) => {
  fileCache.delete(filePath);
};

export const getCacheStats = () => {
  return {
    size: fileCache.size,
    entries: Array.from(fileCache.keys())
  };
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

const readFileFromFileSystem = (filePath: string) => {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(filePath, function(err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

// Private Utils

const getDirtyFileFromVscode = (filePath: string) => {
  return vscode.workspace.textDocuments.find(
    doc => doc.isDirty && doc.fileName === filePath && isSupportedFile(filePath)
  );
};
