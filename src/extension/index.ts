import * as vscode from 'vscode';
// Note: Avoid type-only import for TS 3.3 compatibility and to prevent eager require
// import type { LiveServerPlusPlus } from '../core/LiveServerPlusPlus';
import { NotificationService } from './services/NotificationService';
import { fileSelector, setMIME } from './middlewares';
import { ILiveServerPlusPlusConfig } from '../core/types';
import { extensionConfig } from './utils/extensionConfig';
import { BrowserService } from './services/BrowserService';
import { workspaceUtils } from './utils/workSpaceUtils';
import { StatusbarService } from './services/StatusbarService';

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

  context.subscriptions.push(openServer);
  context.subscriptions.push(closeServer);
}

export function deactivate() {}

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
