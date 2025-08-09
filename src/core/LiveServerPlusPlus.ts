import * as vscode from 'vscode';
import type * as http from 'http';
import type * as WebSocket from 'ws';
import * as path from 'path';
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

// Lazy-loaded modules for better startup performance
let httpModule: typeof http;
let wsModule: typeof WebSocket;

async function loadHttpModule() {
  if (!httpModule) {
    httpModule = await import('http');
  }
  return httpModule;
}

async function loadWebSocketModule() {
  if (!wsModule) {
    wsModule = await import('ws');
  }
  return wsModule;
}

// Debounce utility for file watching
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export class LiveServerPlusPlus implements ILiveServerPlusPlus {
  port!: number;
  private cwd: string | undefined;
  private server: http.Server | undefined;
  private ws: WebSocket.Server | undefined;
  private indexFile!: string;
  private debounceTimeout!: number;
  private reloadingStrategy!: ReloadingStrategy;
  private goLiveEvent: vscode.EventEmitter<GoLiveEvent>;
  private goOfflineEvent: vscode.EventEmitter<GoOfflineEvent>;
  private serverErrorEvent: vscode.EventEmitter<ServerErrorEvent>;
  private middlewares: IMiddlewareTypes[] = [];
  private wsWatcherList: IWsWatcher[] = [];
  
  // Performance monitoring
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly performanceMetrics = {
    totalRequests: 0,
    averageResponseTime: 0,
    errorCount: 0,
    startTime: Date.now()
  };

  // Debounced broadcast function
  private debouncedBroadcast = debounce(this.broadcast.bind(this), 50);

  constructor(config: ILiveServerPlusPlusConfig) {
    this.init(config);
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

  get metrics() {
    return {
      ...this.performanceMetrics,
      uptime: Date.now() - this.performanceMetrics.startTime,
      requestsPerSecond: this.performanceMetrics.totalRequests / ((Date.now() - this.performanceMetrics.startTime) / 1000)
    };
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
      this.performanceMetrics.startTime = Date.now();
    } catch (error: any) {
      this.performanceMetrics.errorCount++;
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
      return this.serverErrorEvent.fire({
        LSPP: this,
        code: 'serverIsNotRunning',
        message: `Server is not running`
      });
    }

    return new Promise<void>((resolve, reject) => {
      this.server!.close((err: any) => {
        if (this.ws) {
          this.ws.close();
        }
        if (err) {
          reject(err);
        } else {
          this.goOfflineEvent.fire({ LSPP: this });
          resolve();
        }
      });
    });
  }

  useMiddleware(...middlewares: IMiddlewareTypes[]) {
    this.middlewares.push(...middlewares);
  }

  useService(...services: ILiveServerPlusPlusServiceCtor[]) {
    services.forEach(service => {
      service.bindServer(this);
    });
  }

  private init(config: ILiveServerPlusPlusConfig) {
    this.cwd = config.cwd;
    this.port = config.port || 0;
    this.indexFile = config.indexFile || 'index.html';
    this.debounceTimeout = config.debounceTimeout || 300;
    this.reloadingStrategy = config.reloadingStrategy || 'hot';
  }

  private async listenServer(): Promise<void> {
    const http = await loadHttpModule();
    const WebSocket = await loadWebSocketModule();
    
    this.server = http.createServer();
    this.server.on('request', this.handleRequest.bind(this));

    return new Promise((resolve, reject) => {
      this.server!.listen(this.port, (err: any) => {
        if (err) {
          reject(err);
        } else {
          this.port = (this.server!.address() as any)?.port || this.port;
          
          // Initialize WebSocket server lazily
          this.ws = new WebSocket.Server({ server: this.server });
          this.ws.on('connection', this.handleWebSocketConnection.bind(this));
          
          resolve();
        }
      });
    });
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse) {
    const startTime = Date.now();
    this.performanceMetrics.totalRequests++;
    
    const lsppReq = req as ILSPPIncomingMessage;
    
    // Performance optimization: cache static file headers
    if (this.isStaticFileRequest(lsppReq.url || '')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }

    try {
      this.applyMiddlewares(lsppReq, res);
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.performanceMetrics.averageResponseTime = 
        (this.performanceMetrics.averageResponseTime + responseTime) / 2;
    } catch (error) {
      this.performanceMetrics.errorCount++;
      console.error('Request handling error:', error);
    }
  }

  private isStaticFileRequest(url: string): boolean {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => url.endsWith(ext));
  }

  private handleWebSocketConnection(client: WebSocket) {
    client.on('message', (msg: string) => {
      try {
        const data = JSON.parse(msg);
        if (data.watchList) {
          this.addWsWatcher(data.watchList, client);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    });

    client.on('close', () => {
      this.removeWsWatcher(client);
    });
  }

  private addWsWatcher(watchingPaths: string[], client: WebSocket) {
    // Remove existing watcher for this client
    this.removeWsWatcher(client);
    
    this.wsWatcherList.push({
      watchingPaths,
      client
    });
  }

  private removeWsWatcher(client: WebSocket) {
    this.wsWatcherList = this.wsWatcherList.filter(watcher => watcher.client !== client);
  }

  private registerOnChangeReload() {
    if (!this.cwd) return;

    const fileWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(this.cwd, '**/*'),
      false, // do not ignore create events  
      false, // do not ignore change events
      false  // do not ignore delete events
    );

    // Debounced file change handler
    const handleFileChange = debounce((uri: vscode.Uri) => {
      this.onFileChange(uri);
    }, this.debounceTimeout);

    fileWatcher.onDidChange(handleFileChange);
    fileWatcher.onDidCreate(handleFileChange);
    fileWatcher.onDidDelete(handleFileChange);
  }

  private async onFileChange(uri: vscode.Uri) {
    const relativePath = path.relative(this.cwd!, uri.fsPath);
    
    // Performance optimization: only process relevant files
    if (this.shouldIgnoreFile(relativePath)) {
      return;
    }

    if (this.isCSSFile(relativePath)) {
      this.debouncedBroadcast('refreshcss', { file: relativePath });
    } else if (isInjectableFile(relativePath)) {
      try {
        const dom = await this.getUpdatedDOM(uri);
        const action = this.reloadingStrategy === 'reload' ? 'reload' : 
                     this.reloadingStrategy === 'partial-reload' ? 'partial-reload' : 'hot';
        this.debouncedBroadcast(action, { dom, file: relativePath });
      } catch (error) {
        console.error('File processing error:', error);
        this.debouncedBroadcast('reload', { file: relativePath });
      }
    }
  }

  private shouldIgnoreFile(relativePath: string): boolean {
    const ignoredPatterns = [
      /node_modules/,
      /\.git/,
      /\.vscode/,
      /\.DS_Store/,
      /\.map$/,
      /\.tmp$/,
      /\.swp$/
    ];
    
    return ignoredPatterns.some(pattern => pattern.test(relativePath));
  }

  private isCSSFile(relativePath: string): boolean {
    return relativePath.endsWith('.css');
  }

  private async getUpdatedDOM(uri: vscode.Uri): Promise<string> {
    const document = await vscode.workspace.openTextDocument(uri);
    return document.getText();
  }

  private broadcast(action: BroadcastActions, data?: any) {
    if (!this.ws) return;

    const message = JSON.stringify({ action, data });
    
    this.wsWatcherList.forEach(watcher => {
      if (watcher.client.readyState === 1) { // WebSocket.OPEN
        try {
          watcher.client.send(message);
        } catch (error) {
          console.error('WebSocket send error:', error);
          this.removeWsWatcher(watcher.client);
        }
      }
    });
  }

  private applyMiddlewares(req: ILSPPIncomingMessage, res: ServerResponse) {
    // Apply middlewares in sequence with error handling
    let index = 0;
    
    const next = () => {
      if (index >= this.middlewares.length) return;
      
      const middleware = this.middlewares[index++];
      try {
        middleware(req, res, next);
      } catch (error) {
        console.error('Middleware error:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    };

    next();
  }
}
