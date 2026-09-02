# Live Server++ Extension

A enhanced version of the Live Server extension for VS Code with modern API integration capabilities.

## Features

### Core Live Server Features
- ✅ Launch a development local Server with live reload feature for static & dynamic pages
- ✅ Support for multiple root paths  
- ✅ Customizable Port Number, Browser choice, and other settings
- ✅ Hot reload, partial reload, and full page reload strategies

### 🆕 New API Integration Features
- 🔗 **GitHub API Integration**: Connect with GitHub, create gists, sync repositories
- 💬 **Real-time Messaging**: Enhanced WebSocket communication with message history
- 📡 **API Endpoint Integration**: Send messages to external APIs
- 🔐 **Secure Token Management**: Safe storage of API credentials
- 📊 **Message History**: Track and review all communication

## Installation

1. Install the extension from VS Code marketplace
2. Open a project folder in VS Code
3. Right-click on HTML file and select "Open with Live Server++"

## Configuration

### Basic Settings
- `liveServer++.port`: Port number (default: 5555)
- `liveServer++.browser`: Browser choice (default, chrome, firefox, microsoft-edge)
- `liveServer++.root`: Change root path (default: "./")
- `liveServer++.timeout`: Request timeout in milliseconds (default: 300)
- `liveServer++.indexFile`: Default index file (default: "index.html")
- `liveServer++.reloadingStrategy`: hot, partial-reload, or reload (default: "hot")

### 🆕 API Integration Settings
- `liveServer++.github.enabled`: Enable GitHub API integration (default: false)
- `liveServer++.github.token`: GitHub Personal Access Token
- `liveServer++.api.messageEndpoint`: API endpoint for messaging features

## Usage

### Live Server Commands
- **Live Server++: Open Server** - Start the live server
- **Live Server++: Close Server** - Stop the live server

### 🆕 GitHub Integration Commands
- **Live Server++: Sync with GitHub** - Test GitHub connection
- **Live Server++: Create Gist from Active File** - Create a gist from current file

### 🆕 Messaging Commands  
- **Live Server++: Show Message History** - View all messages
- **Live Server++: Broadcast Message** - Send message to all clients
- **Live Server++: Send API Message** - Send message to external API
- **Live Server++: Clear Messages** - Clear message history

## Setup GitHub Integration

1. **Generate GitHub Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create token with `gist` and optionally `repo` permissions

2. **Configure in VS Code:**
   - Open Settings (Ctrl/Cmd + ,)
   - Search for "liveServer++"
   - Enable GitHub integration
   - Add your token securely

3. **Test Connection:**
   - Run "Live Server++: Sync with GitHub" command
   - You should see your GitHub username in the notification

## API Message Integration

Configure an API endpoint to receive messages from the extension:

```json
{
  "message": "Your message text",
  "timestamp": "2024-01-15T10:30:00.000Z", 
  "source": "vscode-live-server-plus-plus",
  "port": 5555
}
```

## Security Notes

- 🔒 Store GitHub tokens securely in VS Code settings
- 🔒 Never commit tokens to source control  
- 🔒 Use HTTPS endpoints for API integration
- 🔒 Review token permissions regularly

## Troubleshooting

### GitHub Connection Issues
- Verify token permissions and expiration
- Check network connectivity to GitHub API
- Review the output channel for detailed errors

### Server Issues  
- Check if port is already in use
- Verify workspace folder is open
- Check file permissions for the root directory

### Message/API Issues
- Verify API endpoint is accessible
- Check endpoint accepts POST requests with JSON
- Review message history for error details

## Documentation

- [API Integration Guide](./API_INTEGRATION_GUIDE.md) - Detailed setup and usage guide
- [Original Live Server Documentation](https://github.com/ritwickdey/vscode-live-server) - Core functionality reference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see [LICENSE](./LICENCE) file for details

## Changelog

### v0.0.1 (Latest)
- ✅ Enhanced with GitHub API integration
- ✅ Added real-time messaging capabilities  
- ✅ Improved WebSocket communication
- ✅ Added message history tracking
- ✅ Secure token management
- ✅ API endpoint integration

---

**Built with ❤️ for modern web development**