import * as vscode from 'vscode';
import type { LiveServerPlusPlus } from '@core/LiveServerPlusPlus';
import type { NotificationService } from './services/NotificationService';
import type { fileSelector, setMIME } from './middlewares';
import type { ILiveServerPlusPlusConfig } from '@core/types';
import { extensionConfig } from './utils/extensionConfig';
import type { BrowserService } from './services/BrowserService';
import { workspaceUtils } from './utils/workSpaceUtils';
import type { StatusbarService } from './services/StatusbarService';

// Lazy-loaded modules for better startup performance
let liveServerModule: typeof import('@core/LiveServerPlusPlus');
let servicesModule: {
  NotificationService: typeof NotificationService;
  BrowserService: typeof BrowserService;
  StatusbarService: typeof StatusbarService;
};
let middlewareModule: {
  fileSelector: typeof fileSelector;
  setMIME: typeof setMIME;
};

// Performance monitoring
const performanceLog = {
  activationTime: 0,
  commandExecutions: 0,
  lastCommandTime: 0
};

async function loadLiveServer() {
  if (!liveServerModule) {
    liveServerModule = await import('@core/LiveServerPlusPlus');
  }
  return liveServerModule;
}

async function loadServices() {
  if (!servicesModule) {
    const [notificationService, browserService, statusbarService] = await Promise.all([
      import('./services/NotificationService'),
      import('./services/BrowserService'),
      import('./services/StatusbarService')
    ]);
    
    servicesModule = {
      NotificationService: notificationService.NotificationService,
      BrowserService: browserService.BrowserService,
      StatusbarService: statusbarService.StatusbarService
    };
  }
  return servicesModule;
}

async function loadMiddlewares() {
  if (!middlewareModule) {
    const middlewares = await import('./middlewares');
    middlewareModule = {
      fileSelector: middlewares.fileSelector,
      setMIME: middlewares.setMIME
    };
  }
  return middlewareModule;
}

let liveServerInstance: LiveServerPlusPlus | undefined;

export async function activate(context: vscode.ExtensionContext) {
  const startTime = Date.now();
  
  try {
    // Register commands immediately but load modules lazily
    const openServer = vscode.commands.registerCommand(getCmdWithPrefix('open'), async () => {
      performanceLog.commandExecutions++;
      performanceLog.lastCommandTime = Date.now();
      
      try {
        if (!liveServerInstance) {
          await initializeLiveServer();
        }
        
        liveServerInstance!.reloadConfig(getLSPPConfig());
        await liveServerInstance!.goLive();
      } catch (error) {
        console.error('Failed to start Live Server:', error);
        vscode.window.showErrorMessage(`Failed to start Live Server: ${error}`);
      }
    });

    const closeServer = vscode.commands.registerCommand(getCmdWithPrefix('close'), async () => {
      performanceLog.commandExecutions++;
      performanceLog.lastCommandTime = Date.now();
      
      try {
        if (liveServerInstance) {
          await liveServerInstance.shutdown();
        }
      } catch (error) {
        console.error('Failed to stop Live Server:', error);
        vscode.window.showErrorMessage(`Failed to stop Live Server: ${error}`);
      }
    });

    // Performance monitoring command
    const showMetrics = vscode.commands.registerCommand(getCmdWithPrefix('metrics'), () => {
      if (liveServerInstance) {
        const metrics = (liveServerInstance as any).metrics;
        const info = [
          `Uptime: ${Math.round(metrics.uptime / 1000)}s`,
          `Total Requests: ${metrics.totalRequests}`,
          `Requests/Second: ${metrics.requestsPerSecond.toFixed(2)}`,
          `Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`,
          `Error Count: ${metrics.errorCount}`,
          `Command Executions: ${performanceLog.commandExecutions}`
        ].join('\n');
        
        vscode.window.showInformationMessage(`Live Server++ Metrics:\n${info}`);
      } else {
        vscode.window.showInformationMessage('Live Server is not running');
      }
    });

    context.subscriptions.push(openServer, closeServer, showMetrics);
    
    performanceLog.activationTime = Date.now() - startTime;
    console.log(`Live Server++ activated in ${performanceLog.activationTime}ms`);
    
  } catch (error) {
    console.error('Extension activation failed:', error);
    vscode.window.showErrorMessage(`Live Server++ activation failed: ${error}`);
  }
}

async function initializeLiveServer() {
  try {
    // Load all required modules in parallel
    const [liveServerMod, servicesMod, middlewareMod] = await Promise.all([
      loadLiveServer(),
      loadServices(),
      loadMiddlewares()
    ]);

    // Initialize LiveServer with configuration
    liveServerInstance = new liveServerMod.LiveServerPlusPlus(getLSPPConfig());

    // Configure middlewares and services
    liveServerInstance.useMiddleware(
      middlewareMod.fileSelector, 
      middlewareMod.setMIME
    );
    
    liveServerInstance.useService(
      servicesMod.NotificationService,
      servicesMod.BrowserService,
      servicesMod.StatusbarService
    );

  } catch (error) {
    console.error('Failed to initialize Live Server:', error);
    throw error;
  }
}

export function deactivate() {
  // Cleanup resources
  if (liveServerInstance) {
    liveServerInstance.shutdown().catch(console.error);
  }
  
  // Log performance metrics
  console.log('Live Server++ Performance Summary:', {
    activationTime: performanceLog.activationTime,
    commandExecutions: performanceLog.commandExecutions,
    totalUptime: performanceLog.lastCommandTime ? 
      performanceLog.lastCommandTime - performanceLog.activationTime : 0
  });
}

function getCmdWithPrefix(commandName: string) {
  return `extension.live-server++.${commandName}`;
}

function getLSPPConfig(): ILiveServerPlusPlusConfig {
  const LSPPconfig: ILiveServerPlusPlusConfig = { cwd: workspaceUtils.cwd! };
  LSPPconfig.port = extensionConfig.port.get();
  LSPPconfig.subpath = extensionConfig.root.get();
  LSPPconfig.debounceTimeout = extensionConfig.timeout.get();
  LSPPconfig.indexFile = extensionConfig.indexFile.get();
  LSPPconfig.reloadingStrategy = extensionConfig.reloadingStrategy.get();
  return LSPPconfig;
}
