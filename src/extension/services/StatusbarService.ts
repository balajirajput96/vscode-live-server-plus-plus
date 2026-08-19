import * as vscode from 'vscode';
import {
  ILiveServerPlusPlus,
  ILiveServerPlusPlusService,
  GoLiveEvent,
  GoOfflineEvent
} from '../../core/types';

export class StatusbarService implements ILiveServerPlusPlusService, vscode.Disposable {
  private statusbar: vscode.StatusBarItem;

  constructor(private liveServerPlusPlus: ILiveServerPlusPlus) {
    this.statusbar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      200
    );
  }

  register() {
    this.init();
    this.liveServerPlusPlus.onDidGoLive(this.showLiveStatusbar.bind(this));
    this.liveServerPlusPlus.onDidGoOffline(this.showOfflineStatusbar.bind(this));
  }

  private init() {
    this.placeStatusbar();
    this.showOfflineStatusbar();
  }

  private placeStatusbar(workingMsg: string = 'loading...') {
    this.statusbar.text = `$(pulse) ${workingMsg}`;
    this.statusbar.tooltip =
      'In case if it takes long time, try to close all browser window.';
    this.statusbar.command = undefined;
    this.statusbar.show();
  }

  private showOfflineStatusbar(event?: GoOfflineEvent) {
    this.statusbar.text = '$(radio-tower) Go Live++';
    this.statusbar.command = 'extension.live-server++.open';
    this.statusbar.tooltip = 'Click to run live server++';
  }

  private showLiveStatusbar(event: GoLiveEvent) {
    this.statusbar.text = `$(x) Port : ${event.LSPP.port}`;
    this.statusbar.command = 'extension.live-server++.close';
    this.statusbar.tooltip = 'Click to close server++';
  }

  dispose() {
    this.statusbar.dispose();
  }
}
