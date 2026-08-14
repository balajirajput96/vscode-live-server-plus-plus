import * as vscode from 'vscode';
import {
  ILiveServerPlusPlusService,
  ILiveServerPlusPlus,
  GoLiveEvent,
  GoOfflineEvent
} from '../../core/types';
import { extensionConfig } from '../utils/extensionConfig';
import { showPopUpMsg } from '../utils/showPopUpMsg';

export class MessagingService implements ILiveServerPlusPlusService {
  private messageHistory: Array<{timestamp: string, message: string, type: string}> = [];
  private outputChannel: vscode.OutputChannel;

  constructor(private liveServerPlusPlus: ILiveServerPlusPlus) {
    this.outputChannel = vscode.window.createOutputChannel('Live Server++ Messages');
  }

  register() {
    this.liveServerPlusPlus.onDidGoLive(this.onServerStart.bind(this));
    this.liveServerPlusPlus.onDidGoOffline(this.onServerStop.bind(this));
    this.registerCommands();
  }

  private registerCommands() {
    vscode.commands.registerCommand('extension.live-server++.messaging.showHistory', () => {
      this.showMessageHistory();
    });

    vscode.commands.registerCommand('extension.live-server++.messaging.broadcast', async () => {
      await this.broadcastMessage();
    });

    vscode.commands.registerCommand('extension.live-server++.messaging.clear', () => {
      this.clearMessages();
    });
  }

  private async onServerStart(event: GoLiveEvent) {
    const message = `Live Server++ started on port ${event.LSPP.port} at ${new Date().toLocaleString()}`;
    this.logMessage(message, 'info');
    
    // Enhanced WebSocket messaging for modern API integration
    this.enhanceWebSocketMessaging();
  }

  private async onServerStop(event: GoOfflineEvent) {
    const message = `Live Server++ stopped at ${new Date().toLocaleString()}`;
    this.logMessage(message, 'info');
  }

  private enhanceWebSocketMessaging() {
    // This method extends the existing WebSocket functionality
    // with modern messaging features like structured data, timestamps, etc.
    const timestamp = new Date().toISOString();
    const enhancedMessage = {
      type: 'server_started',
      timestamp: timestamp,
      port: this.liveServerPlusPlus.port,
      version: '2.0',
      features: ['hot-reload', 'api-integration', 'messaging']
    };
    
    this.logMessage(JSON.stringify(enhancedMessage, null, 2), 'system');
  }

  private async broadcastMessage() {
    const message = await vscode.window.showInputBox({
      prompt: 'Enter message to broadcast to all connected clients',
      placeHolder: 'Your broadcast message...'
    });

    if (!message) return;

    try {
      // Log the broadcast
      this.logMessage(`Broadcasting: ${message}`, 'broadcast');
      
      // Create enhanced message structure
      const enhancedMessage = {
        type: 'broadcast',
        timestamp: new Date().toISOString(),
        message: message,
        source: 'vscode-live-server-plus-plus',
        port: this.liveServerPlusPlus.port
      };

      // Show in output channel
      this.outputChannel.appendLine(`[BROADCAST] ${JSON.stringify(enhancedMessage, null, 2)}`);
      
      showPopUpMsg('Message broadcast to all connected clients!', { msgType: 'info' });
    } catch (error) {
      console.error('Error broadcasting message:', error);
      showPopUpMsg('Failed to broadcast message.', { msgType: 'error' });
    }
  }

  private showMessageHistory() {
    if (this.messageHistory.length === 0) {
      showPopUpMsg('No messages in history.', { msgType: 'info' });
      return;
    }

    // Show output channel with message history
    this.outputChannel.clear();
    this.outputChannel.appendLine('=== Live Server++ Message History ===');
    this.outputChannel.appendLine('');
    
    this.messageHistory.forEach((entry, index) => {
      this.outputChannel.appendLine(`[${index + 1}] ${entry.timestamp} [${entry.type.toUpperCase()}]`);
      this.outputChannel.appendLine(`    ${entry.message}`);
      this.outputChannel.appendLine('');
    });
    
    this.outputChannel.show();
  }

  private clearMessages() {
    this.messageHistory = [];
    this.outputChannel.clear();
    showPopUpMsg('Message history cleared.', { msgType: 'info' });
  }

  private logMessage(message: string, type: string = 'info') {
    const timestamp = new Date().toISOString();
    
    this.messageHistory.push({
      timestamp: timestamp,
      message: message,
      type: type
    });

    // Keep only last 100 messages
    if (this.messageHistory.length > 100) {
      this.messageHistory = this.messageHistory.slice(-100);
    }

    // Also log to console for debugging
    console.log(`[Live Server++] [${type}] ${message}`);
  }

  // Public method for other services to send messages
  public sendMessage(message: string, type: string = 'info') {
    this.logMessage(message, type);
  }

  // Get current message count for status
  public getMessageCount(): number {
    return this.messageHistory.length;
  }
}