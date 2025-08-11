# 🚀 VSCode Live Server++

**Enhanced Live Server Extension for Visual Studio Code**

---

## 📋 Overview

VSCode Live Server++ is an enhanced version of the popular Live Server extension that provides a local development server with live reload capability for static & dynamic pages. It's designed to make web development faster and more efficient.

## 🎯 Key Features

### 1. 🔄 Live Reload
- Automatic browser refresh on file changes
- Hot reloading for CSS changes
- Partial DOM updates (experimental)

### 2. 🌐 Static Server
- Serve HTML, CSS, JavaScript files locally
- Support for custom root directories
- Configurable port settings

### 3. ⚙️ Customizable Settings
- Multiple reloading strategies
- Browser selection options
- Timeout configurations
- Index file customization

---

## 🚀 Quick Start Guide

### Step 1: Install the Extension
Install from the VSCode marketplace or build from source

### Step 2: Open Your Project
1. Open a folder with your HTML files in VSCode
2. Right-click on an HTML file
3. Select "Live Server++: Open Server"

### Step 3: Start Development
- Your default browser will open with your site
- Make changes to your files
- See them reflected automatically in the browser

---

## ⚙️ Configuration

Configure the extension through VSCode settings:

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `liveServer++.port` | number | 5555 | Port for the server (0 for random) |
| `liveServer++.browser` | string | "default" | Browser to open ("default", "chrome", "firefox", "microsoft-edge", null) |
| `liveServer++.root` | string | "./" | Root directory for the server |
| `liveServer++.timeout` | number | 300 | Debounce timeout in milliseconds |
| `liveServer++.indexFile` | string | "index.html" | Default index file |
| `liveServer++.reloadingStrategy` | string | "hot" | Reload strategy ("hot", "partial-reload", "reload") |

### Example Configuration

```json
{
  "liveServer++.port": 3000,
  "liveServer++.browser": "chrome",
  "liveServer++.root": "./dist",
  "liveServer++.reloadingStrategy": "partial-reload"
}
```

---

## 🚀 Commands

- **Live Server++: Open Server** - Start the live server
- **Live Server++: Close Server** - Stop the live server

---

## 🔧 Development

### Building from Source

1. Clone the repository
2. Install dependencies: `npm install`
3. Compile TypeScript: `npm run compile`
4. Package the extension: `vsce package`

### Project Structure

```
📦 vscode-live-server-plus-plus
├── 📁 src/
│   ├── 📁 core/           # Core server logic
│   ├── 📁 extension/      # VSCode extension code
│   └── 📁 test/          # Test files
├── 📄 package.json       # Extension manifest
├── 📄 tsconfig.json      # TypeScript config
└── 📄 README.md          # This file
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENCE) file for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 🐛 Issues & Support

- Report bugs on [GitHub Issues](https://github.com/balajirajput96/vscode-live-server-plus-plus/issues)
- For questions, check the documentation or open an issue

---

## 📈 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.