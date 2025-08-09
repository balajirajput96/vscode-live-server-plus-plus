import * as vscode from 'vscode';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as path from 'path';
import * as compression from 'compression';
import * as etag from 'etag';
import * as fresh from 'fresh';
import { IncomingMessage, ServerResponse } from 'http';
import { readFileStream } from './FileSystem';
import { INJECTED_TEXT, isInjectableFile } from './utils';
import {
  ILiveServerPlusPlus,
  GoOfflineEvent,
  GoLiveEvent,
  ServerErrorEvent,
  IMiddlewareTypes,
  ILiveServerPlusPlusServiceCtor,
  ILSPPIncomingMessage,
  ILiveServerPlusPlusConfig
} from './types';
import { LSPPError } from './LSPPError';
import { urlJoin } from '../extension/utils/urlJoin';
import { ReloadingStrategy } from '../extension/utils/extensionConfig';

interface IWsWatcher {
  watchingPaths: string[]; //relative paths
  client: WebSocket;
}

type BroadcastActions = 'hot' | 'partial-reload' | 'reload' | 'refreshcss';

// Performance optimization: Add connection pooling and caching
interface IConnectionPool {
  maxConnections: number;
  currentConnections: number;
  connections: Set<WebSocket>;
}

interface ICacheEntry {
  content: Buffer | string;
  etag: string;
  lastModified: Date;
  contentType: string;
}

export class LiveServerPlusPlus implements ILiveServerPlusPlus {
  port!: number;
  private cwd: string | undefined;
  private server: http.Server | undefined;
  private ws: WebSocket.Server | undefined;
  private indexFile!: string;
  private debounceTimeout!: number;
  private reloadingStrategy!: ReloadingStrategy;
  private enableCompression!: boolean;
  private enableCaching!: boolean;
  private maxConnections!: number;
  
  // Performance optimizations
  private connectionPool: IConnectionPool;
  private fileCache: Map<string, ICacheEntry> = new Map();
  private cacheMaxAge = 5 * 60 * 1000; // 5 minutes
  private compressionMiddleware: any;
  
  private goLiveEvent: vscode.EventEmitter<GoLiveEvent>;
  private goOfflineEvent: vscode.EventEmitter<GoOfflineEvent>;
  private serverErrorEvent: vscode.EventEmitter<ServerErrorEvent>;
  private middlewares: IMiddlewareTypes[] = [];
  private wsWatcherList: IWsWatcher[] = [];

  constructor(config: ILiveServerPlusPlusConfig) {
    this.init(config);
    this.connectionPool = {
      maxConnections: config.maxConnections || 100,
      currentConnections: 0,
      connections: new Set()
    };
    
    // Initialize compression middleware
    this.compressionMiddleware = compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      }
    });
    
    this.goLiveEvent = new vscode.EventEmitter();
    this.goOfflineEvent = new vscode.EventEmitter();
    this.serverErrorEvent = new vscode.EventEmitter();
  }

  get onDidGoLive() {
    return this.goLiveEvent.event;
  }

  get onDidGoOffline() {
    return this.goOfflineEvent.event;
  }

  get onServerError() {
    return this.serverErrorEvent.event;
  }

  get isServerRunning() {
    return this.server ? this.server!.listening : false;
  }

  reloadConfig(config: ILiveServerPlusPlusConfig) {
    this.init(config);
  }

  async goLive() {
    if (this.isServerRunning) {
      return this.serverErrorEvent.fire({
        LSPP: this,
        code: 'serverIsAlreadyRunning',
        message: 'Server is already running'
      });
    }
    try {
      await this.listenServer();
      this.registerOnChangeReload();
      this.goLiveEvent.fire({ LSPP: this });
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        return this.serverErrorEvent.fire({
          LSPP: this,
          code: 'portAlreadyInUse',
          message: `${this.port} is already in use!`
        });
      }

      return this.serverErrorEvent.fire({
        LSPP: this,
        code: error.code,
        message: error.message
      });
    }
  }

  async shutdown() {
    if (!this.isServerRunning) {
      return;
    }

    // Clean up WebSocket connections
    this.cleanupWebSocketConnections();
    
    // Clear cache
    this.fileCache.clear();
    
    await this.closeServer();
    await this.closeWs();
    this.goOfflineEvent.fire({ LSPP: this });
  }

  useMiddleware(...fns: IMiddlewareTypes[]) {
    this.middlewares.push(...fns);
  }

  useService(...fns: ILiveServerPlusPlusServiceCtor[]) {
    fns.forEach(Service => {
      new Service(this);
    });
  }

  private init(config: ILiveServerPlusPlusConfig) {
    this.port = config.port || 5555;
    this.cwd = config.cwd;
    this.indexFile = config.indexFile || 'index.html';
    this.debounceTimeout = config.debounceTimeout || 300;
    this.reloadingStrategy = config.reloadingStrategy || 'hot';
    this.enableCompression = config.enableCompression !== false;
    this.enableCaching = config.enableCaching !== false;
    this.maxConnections = config.maxConnections || 100;
  }

  private registerOnChangeReload() {
    if (!this.cwd) return;

    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(this.cwd, '**/*')
    );

    let debounceTimer: NodeJS.Timeout;
    watcher.onDidChange(uri => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.handleFileChange(uri);
      }, this.debounceTimeout);
    });

    watcher.onDidCreate(uri => {
      this.handleFileChange(uri);
    });

    watcher.onDidDelete(uri => {
      this.handleFileChange(uri);
    });
  }

  private async handleFileChange(uri: vscode.Uri) {
    const filePath = uri.fsPath;
    const relativePath = path.relative(this.cwd!, filePath);

    if (this.isInWatchingList(relativePath)) {
      // Clear cache for changed file
      if (this.enableCaching) {
        this.fileCache.delete(relativePath);
      }

      // Broadcast update to all connected clients
      this.broadcastWs({
        type: 'reload',
        file: relativePath,
        action: this.getReloadingActionType(filePath)
      });
    }
  }

  private getReloadingActionType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.css', '.scss', '.less'].includes(ext)) {
      return 'css';
    } else if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
      return 'js';
    } else if (['.html', '.htm', '.xml', '.svg'].includes(ext)) {
      return 'reload';
    } else {
      return 'reload';
    }
  }

  private listenServer() {
    if (!this.server) return;

    this.server.on('request', (req: ILSPPIncomingMessage, res: ServerResponse) => {
      this.handleRequest(req, res);
    });

    this.server.on('upgrade', (request, socket, head) => {
      this.handleWebSocketUpgrade(request, socket, head);
    });

    this.server.listen(this.port, () => {
      console.log(`Live Server++ is running on port ${this.port}`);
      this.isServerRunning = true;
    });
  }

  private handleRequest(req: ILSPPIncomingMessage, res: ServerResponse) {
    try {
      this.processRequest(req, res);
    } catch (error) {
      console.error('Request handling error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }

  private async processRequest(req: ILSPPIncomingMessage, res: ServerResponse) {
    // Apply compression middleware
    if (this.enableCompression && this.compressionMiddleware) {
      this.compressionMiddleware(req, res, () => {
        this.routesHandler(req, res);
      });
    } else {
      await this.routesHandler(req, res);
    }
  }

  private async closeServer() {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) return resolve();
      this.server.close(err => (err ? reject(err) : resolve()));
    });
  }

  private async closeWs() {
    return new Promise((resolve, reject) => {
      if (!this.ws) return resolve();
      this.ws.close(err => (err ? reject(err) : resolve()));
    });
  }

  private cleanupWebSocketConnections() {
    this.connectionPool.connections.forEach(ws => {
      try {
        ws.close();
      } catch (error) {
        console.error('Error closing WebSocket:', error);
      }
    });
    this.connectionPool.connections.clear();
    this.connectionPool.currentConnections = 0;
  }

  private broadcastWs(message: any) {
    if (this.connectionPool.connections.size === 0) return;

    const messageStr = JSON.stringify(message);
    this.connectionPool.connections.forEach(ws => {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(messageStr);
        }
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    });
  }

  private isInWatchingList(filePath: string): boolean {
    const normalizedPath = this.normalizePath(filePath);
    return this.wsWatcherList.some(watcher => watcher.watchingPaths.some(path => this.normalizePath(path) === normalizedPath));
  }

  private normalizePath(filePath: string): string {
    return path.normalize(filePath).replace(/\\/g, '/');
  }

  private attachWSListeners() {
    if (!this.server) throw new Error('Server is not defined');

    this.ws = new WebSocket.Server({ 
      noServer: true,
      maxPayload: 1024 * 1024, // 1MB max payload
      perMessageDeflate: false // Disable for better performance
    });

    this.ws.on('connection', (ws, req) => {
      // Connection pooling
      if (this.connectionPool.currentConnections >= this.connectionPool.maxConnections) {
        ws.close(1013, 'Too many connections');
        return;
      }
      
      this.attachWSListeners(ws);
      
      ws.send(JSON.stringify({ action: 'connected' }));
      
      ws.on('message', (_data: string) => {
        try {
          const { watchList } = JSON.parse(_data);
          if (watchList) {
            this.addToWsWatcherList(ws as any, watchList);
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      });
      
      ws.on('close', () => {
        this.removeFromWsWatcherList(ws as any);
        this.connectionPool.connections.delete(ws);
        this.connectionPool.currentConnections--;
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.connectionPool.connections.delete(ws);
        this.connectionPool.currentConnections--;
      });
    });

    this.ws.on('close', () => {
      console.log('WebSocket server disconnected');
    });

    this.server.on('upgrade', (request, socket, head) => {
      if (request.url === '/_ws_lspp') {
        this.ws!.handleUpgrade(request, socket, head, ws => {
          this.ws!.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }

  private removeFromWsWatcherList(client: WebSocket) {
    const index = this.wsWatcherList.findIndex(e => e.client === client);
    if (index !== -1) {
      this.wsWatcherList.splice(index, 1);
    }
  }

  private addToWsWatcherList(client: WebSocket, watchDirs: string | string[]) {
    const _watchDirs = Array.isArray(watchDirs) ? watchDirs : [watchDirs];
    this.wsWatcherList.push({ client, watchingPaths: _watchDirs });
  }

  private applyMiddlware(req: ILSPPIncomingMessage, res: ServerResponse) {
    this.middlewares.forEach(middleware => {
      try {
        middleware(req, res);
      } catch (error) {
        console.error('Middleware error:', error);
      }
    });
  }

  private async routesHandler(req: ILSPPIncomingMessage, res: ServerResponse) {
    const cwd = this.cwd;
    if (!cwd) return res.end('Root Path is missing');

    this.applyMiddlware(req, res);

    const file = req.file!;
    const filePath = path.isAbsolute(file) ? file : path.join(cwd!, file);
    const relativePath = path.relative(cwd!, filePath);
    
    // Check cache first
    if (this.enableCaching) {
      const cached = this.fileCache.get(relativePath);
      if (cached && this.isCacheValid(cached)) {
        this.serveCachedFile(res, cached);
        return;
      }
    }

    // Serve file with caching
    await this.serveFile(filePath, relativePath, res);
  }

  private isCacheValid(cached: ICacheEntry): boolean {
    const now = Date.now();
    const cacheAge = now - cached.lastModified.getTime();
    return cacheAge < this.cacheMaxAge;
  }

  private serveCachedFile(res: ServerResponse, cached: ICacheEntry) {
    res.setHeader('ETag', cached.etag);
    res.setHeader('Last-Modified', cached.lastModified.toUTCString());
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Content-Type', cached.contentType);
    res.end(cached.content);
  }

  private async serveFile(filePath: string, relativePath: string, res: ServerResponse) {
    try {
      const contentType = this.getContentType(filePath);
      const fileStream = readFileStream(
        filePath,
        contentType.indexOf('image') !== -1 ? undefined : 'utf8'
      );

      fileStream.on('open', () => {
        // Inject live reload script for HTML files
        if (isInjectableFile(filePath)) {
          res.write(INJECTED_TEXT);
        }
        
        // Cache the file content
        if (this.enableCaching && contentType.indexOf('text/') !== -1) {
          let content = '';
          fileStream.on('data', (chunk) => {
            content += chunk;
          });
          
          fileStream.on('end', () => {
            const etagValue = etag(content);
            const lastModified = new Date();
            
            this.fileCache.set(relativePath, {
              content,
              etag: etagValue,
              lastModified,
              contentType
            });
            
            res.setHeader('ETag', etagValue);
            res.setHeader('Last-Modified', lastModified.toUTCString());
            res.setHeader('Cache-Control', 'public, max-age=300');
            res.setHeader('Content-Type', contentType);
            res.end(content);
          });
        } else {
          res.setHeader('Content-Type', contentType);
          fileStream.pipe(res);
        }
      });

      fileStream.on('error', (err: any) => {
        console.error('File serving error:', err);
        res.statusCode = err.code === 'ENOENT' ? 404 : 500;
        res.end(null);
      });
    } catch (error) {
      console.error('File serving error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }

  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.html': 'text/html',
      '.htm': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    return mimeTypes[ext] || 'text/plain';
  }
}
