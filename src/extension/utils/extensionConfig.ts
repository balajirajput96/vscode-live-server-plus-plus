'use strict';

import { workspace } from 'vscode';

export type IBrowserList = 'default' | 'chrome' | 'firefox' | 'microsoft-edge' | null;
export type ReloadingStrategy = 'hot' | 'partial-reload' | 'reload';

export const extensionConfig = {
  port: {
    get: () => getExtensionSetting<number>('port'),
    set: (portNo: number) => setExtensionSetting('port', portNo)
  },
  browser: {
    get: () => getExtensionSetting<IBrowserList>('browser'),
    set: (value: IBrowserList) => setExtensionSetting('browser', value)
  },
  root: {
    get: () => getExtensionSetting<string>('root') || '/',
    set: (value: string) => setExtensionSetting('root', value)
  },
  timeout: {
    get: () => getExtensionSetting<number>('timeout'),
    set: (value: number) => setExtensionSetting('timeout', value)
  },
  indexFile: {
    get: () => getExtensionSetting<string>('indexFile'),
    set: (value: string) => setExtensionSetting('indexFile', value)
  },
  reloadingStrategy: {
    get: () => getExtensionSetting<ReloadingStrategy>('reloadingStrategy'),
    set: (value: ReloadingStrategy) => setExtensionSetting('reloadingStrategy', value)
  }
};

function getExtensionSetting<T = any>(settingKey: string) {
  return workspace.getConfiguration('liveServer++').get(settingKey) as T;
}
function setExtensionSetting<T = any>(settingKey: string, value: T, isGlobalConfiguration = false) {
  return workspace
    .getConfiguration('liveServer++')
    .update(settingKey, value, isGlobalConfiguration);
}
