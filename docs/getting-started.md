# Getting Started with Live Server++

This guide will help you set up and use Live Server++ for your web development projects.

## Quick Setup for New Projects

### 1. Create a Basic HTML Project

```bash
mkdir my-web-project
cd my-web-project
```

Create an `index.html` file:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello, Live Server++!</h1>
    <p>Start editing to see live updates.</p>
    <script src="script.js"></script>
</body>
</html>
```

Create a `style.css` file:
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    font-size: 1.2em;
    text-align: center;
    margin-top: 30px;
}
```

Create a `script.js` file:
```javascript
console.log('Live Server++ is working!');
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded with Live Server++');
});
```

### 2. Open in VS Code

```bash
code .
```

### 3. Start Live Server++

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Live Server++ : Open Server"
3. Press Enter

Your browser will open automatically and show your project!

## Testing Live Features

### Test Hot Reload
1. Edit the `<h1>` text in `index.html`
2. See it update instantly without page refresh

### Test CSS Injection
1. Change the `background-color` in `style.css`
2. Watch the background change instantly

### Test JavaScript Updates
1. Add a new `console.log()` to `script.js`
2. Check the browser console for the update

## Configuration Examples

### Development with Build Tools
If you're using a build tool that outputs to a `dist` folder:

```json
{
  "liveServer++.root": "./dist",
  "liveServer++.port": 3000
}
```

### Multi-page Application
For projects with multiple HTML files:

```json
{
  "liveServer++.indexFile": "home.html",
  "liveServer++.reloadingStrategy": "partial-reload"
}
```

### React/Vue Development
For single-page applications where you want to preserve state:

```json
{
  "liveServer++.reloadingStrategy": "hot",
  "liveServer++.timeout": 100
}
```

## Troubleshooting Common Issues

### Port Already in Use
```json
{
  "liveServer++.port": 0  // Use random port
}
```

### Slow Updates
```json
{
  "liveServer++.timeout": 500  // Increase debounce timeout
}
```

### Compatibility Issues
```json
{
  "liveServer++.reloadingStrategy": "reload"  // Use full page reload
}
```

## Best Practices

1. **Use version control**: Always commit your changes regularly
2. **Test in multiple browsers**: Use the browser setting to test different browsers
3. **Optimize for development**: Use appropriate reloading strategies for your workflow
4. **Keep files organized**: Use proper folder structure for better performance

## Next Steps

- Explore the [full documentation](README.md)
- Check out the [configuration options](README.md#configuration)
- Learn about [reloading strategies](README.md#reloading-strategies-explained)
- Report issues or contribute on [GitHub](https://github.com/balajirajput96/vscode-live-server-plus-plus)

Happy coding with Live Server++! 🚀