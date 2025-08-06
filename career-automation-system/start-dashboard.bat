@echo off
title AI Career Automation Dashboard
color 0A

echo.
echo ========================================
echo    AI Career Automation Dashboard
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Check if index.html exists
if not exist "index.html" (
    echo ❌ Error: index.html not found!
    echo.
    echo Please make sure you're running this script from the career-automation-system folder
    echo.
    pause
    exit /b 1
)

echo ✅ Dashboard files found
echo.

echo 🚀 Starting AI Career Automation Dashboard...
echo.
echo 📋 Available Features:
echo    • Portfolio Builder
echo    • Social Media Generator  
echo    • Resume Optimizer
echo    • Job Tracker
echo    • AI Prompt Library
echo    • Analytics Dashboard
echo.
echo 💡 Tips:
echo    • The dashboard will open automatically in your browser
echo    • Keep this window open while using the dashboard
echo    • Press Ctrl+C to stop the server
echo.

REM Start the Python server
python server.py

echo.
echo 👋 Dashboard stopped. Press any key to exit...
pause >nul