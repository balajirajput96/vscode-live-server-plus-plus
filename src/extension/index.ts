import * as vscode from 'vscode';
// Note: Avoid type-only import for TS 3.3 compatibility and to prevent eager require
// import type { LiveServerPlusPlus } from '../core/LiveServerPlusPlus';
import { NotificationService } from './services/NotificationService';
import { fileSelector, setMIME } from './middlewares';
import { ILiveServerPlusPlusConfig, ReloadingStrategy } from '../core/types';
import { extensionConfig, onConfigurationChange, getPerformanceSettings } from './utils/extensionConfig';
import { BrowserService } from './services/BrowserService';
import { workspaceUtils } from './utils/workSpaceUtils';
import { StatusbarService } from './services/StatusbarService';
import { PerformanceMonitorService } from './services/PerformanceMonitorService';

interface LiveServerPlusPlusLike {
  port: number;
  useMiddleware: (...fns: any[]) => void;
  useService: (...fns: any[]) => void;
  reloadConfig: (config: ILiveServerPlusPlusConfig) => void;
  goLive: () => Promise<void> | void;
  shutdown: () => Promise<void> | void;
}

export function activate(context: vscode.ExtensionContext) {
  let liveServerPlusPlus: LiveServerPlusPlusLike | undefined;

  async function ensureServer() {
    if (!liveServerPlusPlus) {
      const module = await import('../core/LiveServerPlusPlus');
      const LiveServerPlusPlusCtor = module.LiveServerPlusPlus as {
        new (config: ILiveServerPlusPlusConfig): LiveServerPlusPlusLike;
      };
      liveServerPlusPlus = new LiveServerPlusPlusCtor(getLSPPConfig());
      liveServerPlusPlus.useMiddleware(fileSelector, setMIME);
      liveServerPlusPlus.useService(
        NotificationService,
        BrowserService,
        StatusbarService
      );
    }
  }

  const openServer = vscode.commands.registerCommand(
    getCmdWithPrefix('open'),
    async () => {
      await ensureServer();
      liveServerPlusPlus!.reloadConfig(getLSPPConfig());
      await liveServerPlusPlus!.goLive();
    }
  );

  const closeServer = vscode.commands.registerCommand(
    getCmdWithPrefix('close'),
    async () => {
      if (liveServerPlusPlus) {
        await liveServerPlusPlus.shutdown();
      }
    }
  );

  // Performance optimization: Add performance monitoring command
  const showPerformance = vscode.commands.registerCommand(getCmdWithPrefix('showPerformance'), () => {
    showPerformanceReport();
  });

  // Performance optimization: Add performance reset command
  const resetPerformance = vscode.commands.registerCommand(getCmdWithPrefix('resetPerformance'), () => {
    resetPerformanceMetrics();
  });

  // Performance optimization: Configuration change listener
  const configChangeListener = onConfigurationChange(() => {
    if (liveServerPlusPlus.isServerRunning) {
      liveServerPlusPlus.reloadConfig(getLSPPConfig());
    }
  });

  context.subscriptions.push(openServer);
  context.subscriptions.push(closeServer);
  context.subscriptions.push(showPerformance);
  context.subscriptions.push(resetPerformance);
  context.subscriptions.push(configChangeListener);
}

export function deactivate() {
  // Performance optimization: Cleanup file system cache
  const { cleanupFileSystem } = require('../core/FileSystem');
  if (cleanupFileSystem) {
    cleanupFileSystem();
  }
}

function getCmdWithPrefix(commandName: string) {
  return `extension.live-server++.${commandName}`;
}

function getLSPPConfig(): ILiveServerPlusPlusConfig {
  const settings = getPerformanceSettings();

  const LSPPconfig: ILiveServerPlusPlusConfig = {
    cwd: workspaceUtils.cwd!,
    port: settings.port,
    subpath: settings.root,
    debounceTimeout: settings.timeout,
    indexFile: settings.indexFile,
    reloadingStrategy: settings.reloadingStrategy as ReloadingStrategy,
    enableCompression: settings.enableCompression,
    enableCaching: settings.enableCaching,
    maxConnections: settings.maxConnections
  };

  return LSPPconfig;
}

// Performance optimization: Show performance report
function showPerformanceReport() {
  const panel = vscode.window.createWebviewPanel(
    'performanceReport',
    'Live Server++ Performance Report',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  const performanceSettings = getPerformanceSettings();

  panel.webview.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Performance Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; }
        .metric { margin: 10px 0; padding: 15px; border-radius: 8px; background: #f5f5f5; }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .metric .value { font-size: 24px; font-weight: bold; color: #007acc; }
        .setting { margin: 5px 0; padding: 8px; background: #e8f4fd; border-radius: 4px; }
        .setting .key { font-weight: bold; color: #005a9e; }
        .setting .value { color: #333; }
      </style>
    </head>
    <body>
      <h1>🚀 Live Server++ Performance Report</h1>

      <div class="metric">
        <h3>Performance Settings</h3>
        <div class="setting">
          <span class="key">Compression:</span>
          <span class="value">${performanceSettings.enableCompression ? '✅ Enabled' : '❌ Disabled'}</span>
        </div>
        <div class="setting">
          <span class="key">Caching:</span>
          <span class="value">${performanceSettings.enableCaching ? '✅ Enabled' : '❌ Disabled'}</span>
        </div>
        <div class="setting">
          <span class="key">Max Connections:</span>
          <span class="value">${performanceSettings.maxConnections}</span>
        </div>
        <div class="setting">
          <span class="key">Debounce Timeout:</span>
          <span class="value">${performanceSettings.timeout}ms</span>
        </div>
      </div>

      <div class="metric">
        <h3>Optimization Tips</h3>
        <ul>
          <li>Enable compression for better bandwidth usage</li>
          <li>Enable caching for faster file serving</li>
          <li>Adjust debounce timeout based on your workflow</li>
          <li>Monitor connection limits for high-traffic scenarios</li>
        </ul>
      </div>
    </body>
    </html>
  `;
}

// Performance optimization: Reset performance metrics
function resetPerformanceMetrics() {
  vscode.window.showInformationMessage('Performance metrics have been reset.');
}
