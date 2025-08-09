# Live Server++ 
## A truly live server for VS Code with advanced reloading strategies

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/ritwickdey.vscode-live-server-plus-plus)]()
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/ritwickdey.vscode-live-server-plus-plus)]()
[![GitHub](https://img.shields.io/github/license/balajirajput96/vscode-live-server-plus-plus)](./LICENCE)

---

## 📋 Overview

Live Server++ is an advanced VS Code extension that provides a truly live development server for your static HTML, CSS, and JavaScript projects. Unlike traditional live servers that only reload the entire page, Live Server++ offers intelligent reloading strategies including hot reloading, partial DOM updates, and CSS injection without page refresh.

Perfect for front-end developers who want instant feedback while coding without losing their browser state or form data.

---

## 🌟 Key Features

### 🔥 Advanced Reloading Strategies
- **Hot Reload**: In-place DOM updates without page refresh (experimental)
- **Partial Reload**: Reload DOM content without losing browser state
- **Full Reload**: Traditional page refresh when needed
- **CSS Injection**: Live CSS updates without page refresh

### ⚡ Real-time Development
- Instant file change detection with configurable debounce timeout
- WebSocket-based communication for minimal latency
- Smart file watching that targets only the files you're working on
- No manual save required - updates happen as you type

### 🛠️ Highly Configurable
- **Custom Port**: Use any port (0 for random port assignment)
- **Root Directory**: Serve from any subfolder in your workspace
- **Index File**: Configurable default file (default: index.html)
- **Browser Choice**: Support for Chrome, Firefox, Edge, or system default
- **Timeout Settings**: Configurable debounce timeout for file changes

### 🎯 Developer Experience
- Simple command-based operation
- Status bar integration showing server status
- Automatic browser opening when server starts
- Graceful error handling and user notifications

---

## 🚀 Quick Start

### Installation
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Live Server++"
4. Click Install

### Basic Usage
1. **Start Server**: 
   - Open Command Palette (Ctrl+Shift+P)
   - Type "Live Server++ : Open Server"
   - Or use the status bar button

2. **Stop Server**:
   - Open Command Palette (Ctrl+Shift+P)
   - Type "Live Server++ : Close Server"
   - Or use the status bar button

### First Project
1. Create a new HTML file or open an existing project
2. Start Live Server++ 
3. Your default browser will open showing your project
4. Start editing your files and see instant updates!

📚 **[Complete Getting Started Guide](./docs/getting-started.md)** - Detailed setup instructions with examples

---

## ⚙️ Configuration

Live Server++ can be configured through VS Code settings. Go to File > Preferences > Settings and search for "Live Server++".

### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `liveServer++.port` | number | 5555 | Port number for the server (use 0 for random port) |
| `liveServer++.browser` | string | "default" | Browser to open: "default", "chrome", "firefox", "microsoft-edge", or null |
| `liveServer++.root` | string | "./" | Root directory to serve files from |
| `liveServer++.timeout` | number | 300 | Debounce timeout in milliseconds |
| `liveServer++.indexFile` | string | "index.html" | Default index file |
| `liveServer++.reloadingStrategy` | string | "hot" | Reloading strategy: "hot", "partial-reload", or "reload" |

### Example Configuration
```json
{
  "liveServer++.port": 3000,
  "liveServer++.browser": "chrome",
  "liveServer++.root": "./dist",
  "liveServer++.timeout": 500,
  "liveServer++.reloadingStrategy": "partial-reload"
}
```

---

## 🔄 Reloading Strategies Explained

### Hot Reload (Experimental)
- Updates DOM elements in-place without page refresh
- Preserves form data, scroll position, and JavaScript state
- Best for: Development with forms, single-page applications
- Note: Still experimental, may not work with all content types

### Partial Reload
- Reloads page content without full browser refresh
- Faster than full reload, preserves some browser state
- Best for: General development when hot reload isn't suitable

### Full Reload
- Traditional page refresh
- Most compatible but slower
- Best for: Complex applications or when other methods fail

### CSS Injection
- Automatically applied for .css files regardless of strategy
- Updates styles without any page refresh
- Preserves all application state

---

## 📁 Project Structure

Live Server++ works with any static web project:

```
your-project/
├── index.html
├── styles/
│   ├── main.css
│   └── components.css
├── scripts/
│   ├── app.js
│   └── utils.js
├── images/
│   └── logo.png
└── pages/
    ├── about.html
    └── contact.html
```

---

## 🎯 Use Cases

### Front-end Development
- HTML/CSS/JavaScript projects
- Static site development
- Prototyping and mockups
- CSS framework testing

### Learning and Education
- Web development tutorials
- Code examples and demos
- Student projects
- Workshop materials

### Testing and Debugging
- Cross-browser testing
- Responsive design testing
- Performance optimization
- User experience testing

---

## 🔧 Advanced Usage

### Custom Root Directory
Serve files from a specific subdirectory:
```json
{
  "liveServer++.root": "./build"
}
```

### Multiple Projects
Use different ports for different projects:
```json
{
  "liveServer++.port": 0  // Automatic port assignment
}
```

### Browser-specific Development
Target specific browsers for testing:
```json
{
  "liveServer++.browser": "firefox"
}
```

---

## 🐛 Troubleshooting

### Common Issues

**Server won't start**
- Check if the port is already in use
- Try using port 0 for automatic assignment
- Verify workspace has appropriate permissions

**Files not updating**
- Check if file is being saved (auto-save should be enabled)
- Verify the file is within the configured root directory
- Check if file type is supported for hot reload

**Browser not opening**
- Verify browser setting is correct
- Check if default browser is set in your system
- Try setting `liveServer++.browser` to null to disable auto-open

**Performance Issues**
- Increase the timeout setting for slower systems
- Use "reload" strategy instead of "hot" for better compatibility
- Exclude large directories from workspace if possible

---

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs through GitHub issues
- Suggest new features
- Submit pull requests
- Improve documentation

### Development Setup
```bash
# Clone the repository
git clone https://github.com/balajirajput96/vscode-live-server-plus-plus.git

# Install dependencies
npm install

# Compile the extension
npm run compile

# Run tests
npm test
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENCE](./LICENCE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the original Live Server extension
- Built with TypeScript and VS Code Extension API
- Uses WebSocket for real-time communication

---

**Ready to supercharge your web development workflow? Install Live Server++ and experience truly live development!**
