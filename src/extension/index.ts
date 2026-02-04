import * as vscode from 'vscode';
import { LiveServerPlusPlus } from '../core/LiveServerPlusPlus';
import { NotificationService } from './services/NotificationService';
import { fileSelector, setMIME } from './middlewares';
import { ILiveServerPlusPlusConfig } from '../core/types';
import { extensionConfig } from './utils/extensionConfig';
import { BrowserService } from './services/BrowserService';
import { workspaceUtils } from './utils/workSpaceUtils';
import { StatusbarService } from './services/StatusbarService';

export function activate(context: vscode.ExtensionContext) {
  const liveServerPlusPlus = new LiveServerPlusPlus(buildLiveServerConfig());

  liveServerPlusPlus.useMiddleware(fileSelector, setMIME);
  liveServerPlusPlus.useService(NotificationService, BrowserService, StatusbarService);

  const openServer = vscode.commands.registerCommand(getExtensionCommand('open'), () => {
    liveServerPlusPlus.reloadConfig(buildLiveServerConfig());
    liveServerPlusPlus.goLive();
  });

  const closeServer = vscode.commands.registerCommand(getExtensionCommand('close'), () => {
    liveServerPlusPlus.shutdown();
  });

  context.subscriptions.push(openServer);
  context.subscriptions.push(closeServer);
}

export function deactivate() {}

function getExtensionCommand(commandName: string) {
  return `extension.live-server++.${commandName}`;
}

function buildLiveServerConfig(): ILiveServerPlusPlusConfig {
  const LSPPconfig: ILiveServerPlusPlusConfig = { cwd: workspaceUtils.cwd! };
  LSPPconfig.port = extensionConfig.port.get();
  LSPPconfig.subpath = extensionConfig.root.get();
  LSPPconfig.debounceTimeout = extensionConfig.timeout.get();
  LSPPconfig.indexFile = extensionConfig.indexFile.get();
  LSPPconfig.reloadingStrategy = extensionConfig.reloadingStrategy.get();
  return LSPPconfig;
}
