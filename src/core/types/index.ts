import * as vscode from 'vscode';
import { ServerResponse, IncomingMessage } from 'http';
import { WebSocket } from 'ws';

// Export the reloading strategy type
export type ReloadingStrategy = 'hot' | 'partial-reload' | 'reload';

// Export browser list interface
export interface IBrowserList {
  [key: string]: string;
}

// Export LSPP server error codes
export enum LSPPServerErrorCodes {
  PORT_IN_USE = 'PORT_IN_USE',
  INVALID_PORT = 'INVALID_PORT',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ILiveServerPlusPlus {
  port: number;
  isServerRunning: boolean;
  onDidGoLive: vscode.Event<GoLiveEvent>;
  onDidGoOffline: vscode.Event<GoOfflineEvent>;
  onServerError: vscode.Event<ServerErrorEvent>;
  goLive(): Promise<void>;
  shutdown(): Promise<void>;
  reloadConfig(config: ILiveServerPlusPlusConfig): void;
  useMiddleware(...fns: IMiddlewareTypes[]): void;
  useService(...fns: ILiveServerPlusPlusServiceCtor[]): void;
}

export interface GoLiveEvent {
  LSPP: ILiveServerPlusPlus;
}

export interface GoOfflineEvent {
  LSPP: ILiveServerPlusPlus;
}

export interface ServerErrorEvent {
  LSPP: ILiveServerPlusPlus;
  code: LSPPServerErrorCodes;
  message: string;
}

export interface IMiddlewareTypes {
  (req: any, res: ServerResponse): void;
}

export interface ILiveServerPlusPlusServiceCtor {
  new (lspp: ILiveServerPlusPlus): ILiveServerPlusPlusService;
}

export interface ILiveServerPlusPlusService {
  register(): void;
}

export interface ILSPPIncomingMessage extends IncomingMessage {
  url?: string;
  file?: string;
  contentType?: string;
}

// Performance optimization: Enhanced configuration interface
export interface ILiveServerPlusPlusConfig {
  cwd: string;
  port?: number;
  subpath?: string;
  debounceTimeout?: number;
  indexFile?: string;
  reloadingStrategy?: ReloadingStrategy;
  enableCompression?: boolean;
  enableCaching?: boolean;
  maxConnections?: number;
}

// Performance optimization: Cache entry interface
export interface ICacheEntry {
  content: Buffer | string;
  etag: string;
  lastModified: Date;
  contentType: string;
}

// Performance optimization: Connection pool interface
export interface IConnectionPool {
  maxConnections: number;
  currentConnections: number;
  connections: Set<WebSocket>;
}

// Performance optimization: File stats cache interface
export interface IFileStatsCache {
  stat: any;
  timestamp: number;
}

// Performance optimization: Performance metrics interface
export interface IPerformanceMetrics {
  requestCount: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  activeConnections: number;
  memoryUsage: number;
}
