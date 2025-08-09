# Change Log

## v0.0.1 (2025-01-09)

### Initial Release
- **Live Server Functionality**: Static server for HTML, CSS, and JavaScript projects
- **Advanced Reloading Strategies**:
  - Hot Reload: In-place DOM updates without page refresh (experimental)
  - Partial Reload: DOM updates without full page refresh
  - Full Reload: Traditional page refresh
  - CSS Injection: Live CSS updates without any page refresh
- **Real-time Communication**: WebSocket-based live updates
- **Configurable Settings**:
  - Custom port selection (including random port with 0)
  - Browser choice (Chrome, Firefox, Edge, or system default)
  - Root directory configuration
  - Index file specification
  - Debounce timeout adjustment
- **Developer Experience**:
  - Command palette integration
  - Status bar indicators
  - Automatic browser opening
  - Error handling and notifications
- **File System Monitoring**: Real-time file change detection with smart watching
- **Cross-platform Support**: Works on Windows, macOS, and Linux
