import { ServerResponse } from 'http';
import path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import { ILSPPIncomingMessage } from '../../core/types';
import { extensionConfig } from '../utils/extensionConfig';

const LIVE_SERVER_ASSETS = path.join(__dirname, '../../core/assets');

export const fileSelector = (req: ILSPPIncomingMessage, res: ServerResponse) => {
  let fileUrl = getReqFileUrl(req);

  if (fileUrl.startsWith('/_live-server_/')) {
    fileUrl = path.join(LIVE_SERVER_ASSETS, fileUrl.replace('/_live-server_/', ''));
    res.setHeader('cache-control', 'public, max-age=30672000');
  } else if (fileUrl.startsWith('/')) {
    fileUrl = `.${fileUrl}`;
  }

  req.file = fileUrl;
};

function getReqFileUrl(req: ILSPPIncomingMessage): string {
  const { pathname = '/' } = url.parse(req.url || '/');

  if (!path.extname(pathname)) {
    // Check if path is a directory and if index file exists in it
    const indexFileName = extensionConfig.indexFile.get();
    const indexFilePath = `.${path.join(pathname, indexFileName)}`;
    
    // Check if the index file exists on disk
    try {
      const stats = fs.statSync(indexFilePath);
      if (stats.isFile()) {
        return indexFilePath;
      }
    } catch (error) {
      // File doesn't exist, check if it's a directory without index file
      try {
        const dirPath = `.${pathname}`;
        const dirStats = fs.statSync(dirPath);
        if (dirStats.isDirectory()) {
          // Directory exists but no index file - return the directory path
          // Let the main handler decide what to do (may result in 404)
          return dirPath;
        }
      } catch (dirError) {
        // Neither file nor directory exists
      }
    }
    
    // Fallback to original behavior for backwards compatibility
    return indexFilePath;
  }
  return pathname;
}
