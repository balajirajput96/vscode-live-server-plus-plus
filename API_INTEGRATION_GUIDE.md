# Live Server++ API Integration Guide

## Overview

Live Server++ has been enhanced with modern API integration capabilities including GitHub API integration and real-time messaging features. This guide explains how to configure and use these new features.

## Features Added

### 1. GitHub API Integration
- Connect to GitHub using personal access tokens
- Create gists from active files
- Sync with GitHub repositories
- Automatic status notifications

### 2. Real-time Messaging
- Broadcast messages to connected clients
- Message history tracking
- Enhanced WebSocket communication
- API endpoint integration

### 3. Configuration Settings
- Secure token management
- Flexible API endpoint configuration
- Enable/disable features as needed

## Configuration

### GitHub API Setup

1. **Generate a GitHub Personal Access Token:**
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Click "Generate new token"
   - Select appropriate scopes (at minimum: `gist`, `repo` if you want repository access)
   - Copy the generated token

2. **Configure in VS Code:**
   - Open VS Code Settings (Ctrl/Cmd + ,)
   - Search for "liveServer++"
   - Set the following:
     - `liveServer++.github.enabled`: `true`
     - `liveServer++.github.token`: Your GitHub token (keep this secure!)

### API Messaging Setup

1. **Configure API Endpoint (Optional):**
   - Set `liveServer++.api.messageEndpoint` to your API endpoint URL
   - This enables sending messages to external APIs

## Usage

### GitHub Commands

Access these commands via the Command Palette (Ctrl/Cmd + Shift + P):

1. **Live Server++: Sync with GitHub**
   - Verifies your GitHub connection
   - Shows authenticated user information

2. **Live Server++: Create Gist from Active File**
   - Creates a private gist from the currently open file
   - Copies the gist URL to clipboard

### Messaging Commands

1. **Live Server++: Show Message History**
   - Opens the output channel showing all messages
   - Includes timestamps and message types

2. **Live Server++: Broadcast Message**
   - Sends a message to all connected clients
   - Useful for real-time communication

3. **Live Server++: Clear Messages**
   - Clears the message history

4. **Live Server++: Send API Message**
   - Sends a message to the configured API endpoint
   - Useful for integration with external systems

## Automatic Features

### Server Status Notifications
When GitHub integration is enabled, the extension automatically:
- Creates status gists when the server starts/stops
- Logs server events with timestamps
- Maintains connection status

### Enhanced WebSocket Communication
The extension now provides:
- Structured message format with timestamps
- Enhanced client communication
- Modern API-style messaging

## Security Considerations

1. **Token Security:**
   - Never share your GitHub personal access token
   - Store tokens securely in VS Code settings
   - Revoke tokens if compromised

2. **API Endpoints:**
   - Only configure trusted API endpoints
   - Use HTTPS endpoints when possible
   - Validate API responses

## Troubleshooting

### GitHub Connection Issues
- Verify your token has the correct permissions
- Check if the token has expired
- Ensure GitHub API is accessible from your network

### API Message Failures
- Verify the API endpoint is accessible
- Check the endpoint accepts POST requests with JSON data
- Review the output channel for error details

### Message History Issues
- Message history is limited to 100 entries
- Clear history if experiencing performance issues
- Check the output channel for detailed logs

## Example API Integration

Here's an example of how to integrate with an external API:

1. Set up a webhook endpoint that accepts JSON POST requests
2. Configure the endpoint in VS Code settings
3. Use "Send API Message" to test the integration
4. Messages will be sent in this format:

```json
{
  "message": "Your message text",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "vscode-live-server-plus-plus",
  "port": 5555
}
```

## Advanced Usage

### Programmatic Integration
Other VS Code extensions can integrate with Live Server++ by:
- Listening to the extension's events
- Using the messaging service to send notifications
- Accessing GitHub API functionality

### Custom Webhooks
Set up custom webhooks to receive notifications when:
- Server starts or stops
- Files are created or modified
- Custom events are triggered

## Support

For issues or questions:
1. Check the output channel for error messages
2. Review the configuration settings
3. Test with minimal configuration first
4. Report issues with detailed error information

---

**Note**: This extension enhances the original Live Server functionality with modern API integration capabilities while maintaining backward compatibility.