'use strict';

import { workspace } from 'vscode';

export type IBrowserList = 'default' | 'chrome' | 'firefox' | 'microsoft-edge' | null;
export type ReloadingStrategy = 'hot' | 'partial-reload' | 'reload';

export const extensionConfig = {
  port: {
    get: () => getConfigurationValue<number>('port'),
    set: (portNo: number) => updateConfigurationValue('port', portNo)
  },
  browser: {
    get: () => getConfigurationValue<IBrowserList>('browser'),
    set: (value: IBrowserList) => updateConfigurationValue('browser', value)
  },
  root: {
    get: () => getConfigurationValue<string>('root') || '/',
    set: (value: string) => updateConfigurationValue('root', value)
  },
  timeout: {
    get: () => getConfigurationValue<number>('timeout'),
    set: (value: number) => updateConfigurationValue('timeout', value)
  },
  indexFile: {
    get: () => getConfigurationValue<string>('indexFile'),
    set: (value: string) => updateConfigurationValue('indexFile', value)
  },
  reloadingStrategy: {
    get: () => getConfigurationValue<ReloadingStrategy>('reloadingStrategy'),
    set: (value: ReloadingStrategy) => updateConfigurationValue('reloadingStrategy', value)
  }
};

function getConfigurationValue<T = any>(settingsName: string) {
  return workspace.getConfiguration('liveServer++').get(settingsName) as T;
}
function updateConfigurationValue<T = any>(settingsName: string, settingsValue: T, isGlobal = false) {
  return workspace
    .getConfiguration('liveServer++')
    .update(settingsName, settingsValue, isGlobal);
}
