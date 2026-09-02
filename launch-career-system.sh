#!/bin/bash
# Quick launcher for Career Automation System
cd "/home/runner/work/vscode-live-server-plus-plus/vscode-live-server-plus-plus/career-automation-system"
if command -v python3 >/dev/null 2>&1; then
    python3 -m http.server 8080 --bind localhost
else
    echo "Python3 not found. Please open index.html in your browser manually."
    echo "File location: /home/runner/work/vscode-live-server-plus-plus/vscode-live-server-plus-plus/career-automation-system/index.html"
fi
