# Live Server++

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-server-plus-plus)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Static Server for your HTML CSS Project. It's Truly Live**

Live Server++ is a VS Code extension that creates a local development server with live reload capability for static web projects. Perfect for front-end development with HTML, CSS, and JavaScript.

## Features

- 🚀 **Live Reload**: Automatic page refresh when files change
- ⚡ **Hot Reload**: Experimental in-place DOM updates without full page refresh
- 🌐 **Multiple Browser Support**: Open in Chrome, Firefox, Edge, or default browser
- 🔧 **Configurable**: Customizable port, root directory, and reload strategies
- 📁 **Workspace Integration**: Works seamlessly with VS Code workspaces

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Live Server++"
4. Click Install

## Usage

### Starting the Server

1. Open your HTML project in VS Code
2. Open Command Palette (`Ctrl+Shift+P`)
3. Type "Live Server++: Open Server" and press Enter
4. Your default browser will open with your project

### Stopping the Server


## Configuration

Configure Live Server++ through VS Code settings:

```json
{
  "liveServer++.port": 5555,
  "liveServer++.browser": "default",
  "liveServer++.root": "./",
  "liveServer++.timeout": 300,
  "liveServer++.indexFile": "index.html",
  "liveServer++.reloadingStrategy": "hot"
}
```

### Settings Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `liveServer++.port` | number | 5555 | Port number for the server (0 for random) |
| `liveServer++.browser` | string | "default" | Browser to open: "default", "chrome", "firefox", "microsoft-edge", or null |
| `liveServer++.root` | string | "./" | Root directory for the server |
| `liveServer++.timeout` | number | 300 | Debounce timeout in milliseconds |
| `liveServer++.indexFile` | string | "index.html" | Default index file |
| `liveServer++.reloadingStrategy` | string | "hot" | Reload strategy: "hot", "partial-reload", or "reload" |

### Reload Strategies

- **hot**: Experimental in-place DOM updates (fastest)
- **partial-reload**: Reload DOM without refreshing the page
- **reload**: Full page reload (most compatible)

## Commands

- `Live Server++ : Open Server` - Start the development server
- `Live Server++ : Close Server` - Stop the development server

## Requirements

- VS Code 1.33.0 or higher
- A workspace with HTML files

## Known Issues

- Hot reload is experimental and may not work with all projects
- Some browsers may cache files aggressively

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Ritwick Dey**
- Email: ritwickdey@outlook.com
- GitHub: [@ritwickdey](https://github.com/ritwickdey)
- Website: https://ritwickdey.github.io

---

**Enjoy coding with Live Server++!** 🚀
