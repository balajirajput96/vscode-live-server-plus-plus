import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
import * as vscode from 'vscode';
import {
  ILiveServerPlusPlusService,
  ILiveServerPlusPlus,
  GoLiveEvent,
  GoOfflineEvent
} from '../../core/types';
import { extensionConfig } from '../utils/extensionConfig';
import { workspaceUtils } from '../utils/workSpaceUtils';
import { showPopUpMsg } from '../utils/showPopUpMsg';

interface GitHubApiResponse {
  login?: string;
  html_url?: string;
  message?: string;
}

export class GitHubApiService implements ILiveServerPlusPlusService {
  private isGitHubEnabled = false;
  private githubToken = '';

  constructor(private liveServerPlusPlus: ILiveServerPlusPlus) {}

  register() {
    this.initializeGitHubApi();
    this.liveServerPlusPlus.onDidGoLive(this.onServerStart.bind(this));
    this.liveServerPlusPlus.onDidGoOffline(this.onServerStop.bind(this));
    this.registerCommands();
  }

  private initializeGitHubApi() {
    this.isGitHubEnabled = extensionConfig.github.enabled.get();
    this.githubToken = extensionConfig.github.token.get();
    
    if (this.isGitHubEnabled && this.githubToken) {
      console.log('GitHub API initialized successfully');
    }
  }

  private registerCommands() {
    // Register GitHub-related commands
    vscode.commands.registerCommand('extension.live-server++.github.sync', async () => {
      await this.syncWithGitHub();
    });

    vscode.commands.registerCommand('extension.live-server++.github.createGist', async () => {
      await this.createGistFromActiveFile();
    });

    vscode.commands.registerCommand('extension.live-server++.api.sendMessage', async () => {
      await this.sendMessage();
    });
  }

  private async onServerStart(event: GoLiveEvent) {
    if (!this.isGitHubEnabled || !this.githubToken) return;

    try {
      const workspaceName = workspaceUtils.getWorkspaceName();
      console.log(`Live Server started for ${workspaceName} on port ${event.LSPP.port}`);
      
      // Create a status notification
      await this.createServerStatusGist(event.LSPP.port, 'started');
    } catch (error) {
      console.error('Error notifying GitHub about server start:', error);
    }
  }

  private async onServerStop(event: GoOfflineEvent) {
    if (!this.isGitHubEnabled || !this.githubToken) return;

    try {
      console.log('Live Server stopped');
      await this.createServerStatusGist(0, 'stopped');
    } catch (error) {
      console.error('Error notifying GitHub about server stop:', error);
    }
  }

  private async syncWithGitHub() {
    if (!this.githubToken) {
      showPopUpMsg('GitHub API is not initialized. Please check your settings.', { msgType: 'error' });
      return;
    }

    try {
      const user = await this.makeGitHubRequest('/user');
      if (user && user.login) {
        showPopUpMsg(`Connected to GitHub as ${user.login}`, { msgType: 'info' });
      } else {
        throw new Error('Invalid response from GitHub API');
      }
    } catch (error) {
      console.error('GitHub sync error:', error);
      showPopUpMsg('Failed to sync with GitHub. Check your token permissions.', { msgType: 'error' });
    }
  }

  private async createGistFromActiveFile() {
    if (!this.githubToken) {
      showPopUpMsg('GitHub API is not initialized.', { msgType: 'error' });
      return;
    }

    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      showPopUpMsg('No active file to create gist from.', { msgType: 'error' });
      return;
    }

    try {
      const fileName = activeEditor.document.fileName.split('/').pop() || 'untitled';
      const content = activeEditor.document.getText();

      const gistData = {
        description: `Live Server++ file: ${fileName}`,
        public: false,
        files: {
          [fileName]: {
            content: content
          }
        }
      };

      const gist = await this.makeGitHubRequest('/gists', 'POST', gistData);
      
      if (gist && gist.html_url) {
        showPopUpMsg(`Gist created: ${gist.html_url}`, { msgType: 'info' });
        vscode.env.clipboard.writeText(gist.html_url);
      } else {
        throw new Error('Failed to create gist');
      }
    } catch (error) {
      console.error('Error creating gist:', error);
      showPopUpMsg('Failed to create gist.', { msgType: 'error' });
    }
  }

  private async sendMessage() {
    const messageEndpoint = extensionConfig.api.messageEndpoint.get();
    
    if (!messageEndpoint) {
      showPopUpMsg('No message endpoint configured.', { msgType: 'error' });
      return;
    }

    const message = await vscode.window.showInputBox({
      prompt: 'Enter message to send',
      placeHolder: 'Your message here...'
    });

    if (!message) return;

    try {
      const messageData = {
        message: message,
        timestamp: new Date().toISOString(),
        source: 'vscode-live-server-plus-plus',
        port: this.liveServerPlusPlus.port
      };

      await this.makeHttpRequest(messageEndpoint, 'POST', messageData);
      showPopUpMsg('Message sent successfully!', { msgType: 'info' });
    } catch (error) {
      console.error('Error sending message:', error);
      showPopUpMsg('Failed to send message.', { msgType: 'error' });
    }
  }

  private async createServerStatusGist(port: number, status: 'started' | 'stopped') {
    if (!this.githubToken) return;

    try {
      const workspaceName = workspaceUtils.getWorkspaceName() || 'Unknown';
      const timestamp = new Date().toISOString();
      
      const statusContent = JSON.stringify({
        workspace: workspaceName,
        port: port,
        status: status,
        timestamp: timestamp,
        server: 'Live Server++'
      }, null, 2);

      const gistData = {
        description: `Live Server++ Status: ${status}`,
        public: false,
        files: {
          'live-server-status.json': {
            content: statusContent
          }
        }
      };

      await this.makeGitHubRequest('/gists', 'POST', gistData);
    } catch (error) {
      console.error('Error creating status gist:', error);
    }
  }

  private makeGitHubRequest(path: string, method: string = 'GET', data?: any): Promise<GitHubApiResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        port: 443,
        path: path,
        method: method,
        headers: {
          'User-Agent': 'vscode-live-server-plus-plus',
          'Authorization': `token ${this.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`GitHub API error: ${res.statusCode} - ${parsed.message || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  private makeHttpRequest(url: string, method: string = 'GET', data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const lib = isHttps ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'vscode-live-server-plus-plus'
        }
      };

      const req = lib.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(responseData ? JSON.parse(responseData) : {});
            } else {
              reject(new Error(`HTTP error: ${res.statusCode} - ${res.statusMessage}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }
}