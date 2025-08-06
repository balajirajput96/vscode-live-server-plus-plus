#!/bin/bash

# AI Career Automation Dashboard - Startup Script
# For Linux and macOS users

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Clear screen and show header
clear
echo -e "${BLUE}"
echo "========================================"
echo "    AI Career Automation Dashboard"
echo "========================================"
echo -e "${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        print_error "Python is not installed!"
        echo
        echo "Please install Python:"
        echo "  • Ubuntu/Debian: sudo apt install python3"
        echo "  • macOS: brew install python3"
        echo "  • Or download from: https://www.python.org/downloads/"
        echo
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

print_status "Python found ($PYTHON_CMD)"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    print_error "index.html not found!"
    echo
    echo "Please make sure you're running this script from the career-automation-system folder"
    echo
    exit 1
fi

print_status "Dashboard files found"

# Make server.py executable
chmod +x server.py 2>/dev/null

echo
echo -e "${BLUE}🚀 Starting AI Career Automation Dashboard...${NC}"
echo
echo -e "${YELLOW}📋 Available Features:${NC}"
echo "   • Portfolio Builder"
echo "   • Social Media Generator"
echo "   • Resume Optimizer"
echo "   • Job Tracker"
echo "   • AI Prompt Library"
echo "   • Analytics Dashboard"
echo
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   • The dashboard will open automatically in your browser"
echo "   • Keep this terminal open while using the dashboard"
echo "   • Press Ctrl+C to stop the server"
echo

# Start the Python server
$PYTHON_CMD server.py

echo
echo -e "${GREEN}👋 Dashboard stopped.${NC}"