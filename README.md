<p align="center">
  <img width="128" height="128" src="https://raw.githubusercontent.com/ritwickdey/vscode-live-server-plus-plus/master/images/vscode-live-server-plus-plus.png">
</p>
<h3 align="center">Vscode Live Server++ (BETA) + n8n Automation System</h3>
<p align="center">It's Truly Live + Complete Workflow Automation<p>


[![VSCode Marketplace](https://img.shields.io/vscode-marketplace/v/ritwickdey.vscode-live-server-plus-plus.svg?style=flat-square&label=vscode%20marketplace)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.vscode-live-server-plus-plus) [![Total Installs](https://img.shields.io/vscode-marketplace/d/ritwickdey.vscode-live-server-plus-plus.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.vscode-live-server-plus-plus) [![Avarage Rating](https://img.shields.io/vscode-marketplace/r/ritwickdey.vscode-live-server-plus-plus.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.vscode-live-server-plus-plus) [![Travis branch](https://img.shields.io/travis/com/ritwickdey/vscode-live-server-plus-plus/master.svg?style=flat-square&label=travis%20branch)](https://travis-ci.com/ritwickdey/vscode-live-server-plus-plus) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ritwickdey/vscode-live-server-plus-plus/)

---

![VSCode Live Server++](./images/vscode-live-server-plus-plus_preview1.gif)

---

## 🚀 New: Complete n8n Automation System

This repository now includes **Balaji's Complete n8n Automation System** with:

### ✨ Key Features
- **🔄 Complete Workflow Automation**: GitHub, Google Docs, Email, VPN, Local AI integration
- **📧 Dual Account Support**: balaji.web.design1@gmail.com ↔ 22034563001@paruluniversity.ac.in
- **🤖 Local AI Integration**: Gemma 3n and SHAKTI models for offline processing
- **🌐 VPN Switching**: Multi-country access for global opportunities
- **⚡ High-Speed Execution**: Pro-level performance with offline capabilities
- **🔒 Enterprise Security**: End-to-end encryption and secure credential management

### 📋 Workflow Components
1. **Test Command Node** - System validation and health checks
2. **Sample Test Payload Node** - Data validation and test parameters
3. **VPN Switch Node** - Multi-region access (India, USA, UK, Germany, Singapore, Japan, Australia)
4. **Local AI Node** - Gemma 3n & SHAKTI models for offline AI processing
5. **Execution Validation Node** - Comprehensive performance monitoring
6. **Summary Node** - Detailed execution reporting and analytics
7. **Email Node** - Professional notifications to both accounts
8. **Execution Guide Node** - Step-by-step automation guidance

### 🎯 Quick Start for n8n Automation

```bash
# 1. Clone repository
git clone https://github.com/balajirajput96/vscode-live-server-plus-plus.git
cd vscode-live-server-plus-plus

# 2. Run automated setup
./setup-n8n.sh

# 3. Verify installation
./verify-n8n.sh

# 4. Access n8n dashboard
open http://localhost:5678
```

### 📚 Documentation
- **[Complete n8n Setup Guide](N8N_AUTOMATION_README.md)** - Full system overview
- **[7-Day Quick Start](portfolio-automation-system/QUICK_START_GUIDE.md)** - Step-by-step setup
- **[n8n Technical Setup](README-n8n-setup.md)** - Docker configuration
- **[AI Prompts Library](portfolio-automation-system/prompts/)** - GitHub documentation automation

---

## VSCode Live Server++ Features

- **No Need to save HTML, CSS, JS** :smile:
- **No Browser full reload** (for HTML & CSS)
- Customizable Server Root
- Customizable Server Port
- Customizable reloading time
- Customizable index file (e.g `index.html`)
- Auto Browser open (Mozila, Chrome & Edge)
- Control from statusbar

---

## Downside

- `Live Server++` will work well if your project only contents `css` & `html` and minimal `JavaScript`. If you do lot of DOM Manupulation with JavaScript, `Live Server++` is not recommended.

--- 
## How to Start/Stop Server ?

1. Open a project and click to `Go Live++` from the status bar to turn the server on/off.

2. Open the Command Pallete by pressing `F1` or `ctrl+shift+P` and type `Live Server++: Open Server` to start a server or type `Live Server++: Close Server` to stop a server.

---

## Settings

[Click here to read settings Docs](./docs/settings.md).

## What's new ?

- ### v0.0.1 (##DATE##)
  - Initial release
  - hot Reload supported
  - No need to save
  - 5 settings are added (Port, Root, indexFile, timeout, browser)
  - **NEW**: Complete n8n automation system integration
  - **NEW**: Portfolio automation tools
  - **NEW**: AI-powered documentation generation

---

## Changelog

To check full changelog [click here](CHANGELOG.md).

---

## Repository Structure

```
├── src/                             # VSCode extension source
├── career-automation-system/        # Career automation tools
├── portfolio-automation-system/     # Portfolio automation tools
│   ├── automation/                  # Automation scripts
│   ├── templates/                   # Workflow templates
│   ├── prompts/                     # AI prompts library
│   └── config/                      # Configuration files
├── workflows/                       # n8n workflow files
├── credentials/                     # Credential templates
├── docker-compose.*.yml             # Docker configurations
├── setup-n8n.sh                    # Automated setup script
├── verify-n8n.sh                   # Verification script
└── README-n8n-setup.md             # n8n setup documentation
```

---

## Why `Live Server++` when there is a `Live Server` ?

Actually, I was receiving a lot of emails, PR, comments (and also there was few issue request, e.g. [#12080](https://github.com/Microsoft/vscode/issues/12080)) - `why auto reload only happens when we save the file`? - `why it's not realtime?`... blah blah....

Well, in Live Server Extension, I'm using a popular npm module (named `live-server`) and it's the core library of Live Server. _(yaa! too many "Live Server" 😜)_. In the way it's working - it never possible auto reload without saving the file.

And yaa, to be honest, when I made (in mid of `2017`) the live server extension, I didn't know Node.js or JavaScript well _(Hold on! I still don't know `Node.js` but I'm now confident)_. I even didn't know `promise`/`callback` well. I understood the `callback` _(& `callback hell` too)_ while making the extension. And `Promise`? Only I knew how to use it like `.then().then().then()` and `IIFE`? or `closure`? - I didn't even hear about those names at that time. 😬

Okay, now coming to the point, Code of the `Live Server` can't be migrated with `Live Server++`. `Live Server++` is not depended on `live-server`(the npm module) - I've written the server side code from scratch & it has minimal dependency (still under development).

---

## LICENSE

This extension is licensed under the [MIT License](LICENSE)
