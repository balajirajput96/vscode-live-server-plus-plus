'use strict';

import * as vscode from 'vscode';

export const extensionConfig = {
  port: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('port', 5555)
  },
  root: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('root', './')
  },
  timeout: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('timeout', 300)
  },
  indexFile: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('indexFile', 'index.html')
  },
  browser: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('browser', 'default')
  },
  reloadingStrategy: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('reloadingStrategy', 'hot')
  },
  // Performance optimization: New configuration options
  enableCompression: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('enableCompression', true)
  },
  enableCaching: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('enableCaching', true)
  },
  maxConnections: {
    get: () => vscode.workspace.getConfiguration('liveServer++').get('maxConnections', 100)
  }
};

// Performance optimization: Configuration change listener
export const onConfigurationChange = (callback: () => void) => {
  return vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('liveServer++')) {
      callback();
    }
  });
};

// Performance optimization: Get all performance-related settings
export const getPerformanceSettings = () => ({
  port: extensionConfig.port.get(),
  root: extensionConfig.root.get(),
  timeout: extensionConfig.timeout.get(),
  indexFile: extensionConfig.indexFile.get(),
  browser: extensionConfig.browser.get(),
  reloadingStrategy: extensionConfig.reloadingStrategy.get(),
  enableCompression: extensionConfig.enableCompression.get(),
  enableCaching: extensionConfig.enableCaching.get(),
  maxConnections: extensionConfig.maxConnections.get()
});
