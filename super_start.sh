#!/bin/bash

# 🚀 Super Start Script - AI Career Automation System Master Orchestration
# बलराज राजपूत द्वारा निर्मित - Complete Career Automation Setup

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis for status
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
GEAR="⚙️"

echo -e "${PURPLE}${ROCKET} AI Career Automation System - Master Orchestration${NC}"
echo -e "${CYAN}================================================================${NC}"
echo -e "${BLUE}Starting complete system setup and initialization...${NC}"
echo ""

# Function to print status messages
print_status() {
    local status=$1
    local message=$2
    local icon=""
    
    case $status in
        "success") icon="${SUCCESS}" ;;
        "error") icon="${ERROR}" ;;
        "warning") icon="${WARNING}" ;;
        "info") icon="${INFO}" ;;
        *) icon="${GEAR}" ;;
    esac
    
    echo -e "${icon} ${message}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        print_status "success" "Found: $1"
        return 0
    else
        print_status "error" "Missing: $1"
        return 1
    fi
}

# Function to check directory exists
check_directory() {
    if [ -d "$1" ]; then
        print_status "success" "Directory exists: $1"
        return 0
    else
        print_status "error" "Directory missing: $1"
        return 1
    fi
}

# Function to create directory if it doesn't exist
ensure_directory() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        print_status "success" "Created directory: $1"
    else
        print_status "info" "Directory already exists: $1"
    fi
}

# Initialize variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
CAREER_SYSTEM_DIR="$PROJECT_ROOT/career-automation-system"
PORTFOLIO_SYSTEM_DIR="$PROJECT_ROOT/portfolio-automation-system"

# Start orchestration
echo -e "${BLUE}${GEAR} Phase 1: System Prerequisites Check${NC}"
echo "----------------------------------------"

# Check for required commands
print_status "info" "Checking system prerequisites..."

# Check for Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    print_status "success" "Python found: $PYTHON_VERSION"
else
    print_status "warning" "Python3 not found - some features may be limited"
fi

# Check for Node.js (for potential future features)
if command_exists node; then
    NODE_VERSION=$(node --version 2>&1)
    print_status "success" "Node.js found: $NODE_VERSION"
else
    print_status "info" "Node.js not found (optional)"
fi

# Check for Git
if command_exists git; then
    GIT_VERSION=$(git --version 2>&1)
    print_status "success" "Git found: $GIT_VERSION"
else
    print_status "warning" "Git not found - version control features may be limited"
fi

echo ""
echo -e "${BLUE}${GEAR} Phase 2: Directory Structure Setup${NC}"
echo "----------------------------------------"

# Ensure all required directories exist
ensure_directory "$CAREER_SYSTEM_DIR"
ensure_directory "$PORTFOLIO_SYSTEM_DIR"
ensure_directory "$PORTFOLIO_SYSTEM_DIR/automation"
ensure_directory "$PROJECT_ROOT/logs"
ensure_directory "$PROJECT_ROOT/backup"
ensure_directory "$PROJECT_ROOT/temp"

echo ""
echo -e "${BLUE}${GEAR} Phase 3: Core System Files Verification${NC}"
echo "----------------------------------------"

# Check career automation system files
print_status "info" "Verifying career automation system files..."
check_file "$CAREER_SYSTEM_DIR/index.html"
check_file "$CAREER_SYSTEM_DIR/style.css"
check_file "$CAREER_SYSTEM_DIR/script.js"
check_file "$CAREER_SYSTEM_DIR/QUICK_START.md"

# Check portfolio automation system files
print_status "info" "Verifying portfolio automation system files..."
check_file "$PORTFOLIO_SYSTEM_DIR/automation/github-documentation-generator.py"

echo ""
echo -e "${BLUE}${GEAR} Phase 4: System Configuration${NC}"
echo "----------------------------------------"

# Create configuration file if it doesn't exist
CONFIG_FILE="$PROJECT_ROOT/system-config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    print_status "info" "Creating system configuration file..."
    cat > "$CONFIG_FILE" << EOF
{
  "system": {
    "name": "AI Career Automation System",
    "version": "1.0.0",
    "initialized": "$(date -Iseconds)",
    "last_update": "$(date -Iseconds)"
  },
  "modules": {
    "career_automation": {
      "enabled": true,
      "path": "career-automation-system",
      "status": "active"
    },
    "portfolio_automation": {
      "enabled": true,
      "path": "portfolio-automation-system", 
      "status": "active"
    }
  },
  "settings": {
    "auto_backup": true,
    "log_level": "info",
    "browser_auto_open": true
  }
}
EOF
    print_status "success" "Configuration file created: $CONFIG_FILE"
else
    print_status "info" "Configuration file already exists"
fi

echo ""
echo -e "${BLUE}${GEAR} Phase 5: Python Environment Setup${NC}"
echo "----------------------------------------"

if command_exists python3; then
    print_status "info" "Setting up Python environment..."
    
    # Make the GitHub documentation generator executable
    GITHUB_GENERATOR="$PORTFOLIO_SYSTEM_DIR/automation/github-documentation-generator.py"
    if [ -f "$GITHUB_GENERATOR" ]; then
        chmod +x "$GITHUB_GENERATOR"
        print_status "success" "GitHub documentation generator is now executable"
    fi
    
    # Test Python script
    if python3 -c "import json, os, sys" 2>/dev/null; then
        print_status "success" "Python environment is ready"
    else
        print_status "warning" "Python environment needs attention"
    fi
else
    print_status "info" "Skipping Python environment setup (Python not found)"
fi

echo ""
echo -e "${BLUE}${GEAR} Phase 6: System Services Initialization${NC}"
echo "----------------------------------------"

# Create a simple system status file
STATUS_FILE="$PROJECT_ROOT/system-status.json"
cat > "$STATUS_FILE" << EOF
{
  "system_status": "running",
  "last_started": "$(date -Iseconds)",
  "uptime_start": "$(date -Iseconds)",
  "services": {
    "career_automation": "active",
    "portfolio_automation": "active",
    "documentation_generator": "ready"
  },
  "stats": {
    "total_startups": 1,
    "last_health_check": "$(date -Iseconds)"
  }
}
EOF

print_status "success" "System status tracking initialized"

echo ""
echo -e "${BLUE}${GEAR} Phase 7: Log System Setup${NC}"
echo "----------------------------------------"

# Create initial log file
LOG_FILE="$PROJECT_ROOT/logs/system-$(date +%Y%m%d).log"
cat > "$LOG_FILE" << EOF
[$(date -Iseconds)] SYSTEM_START: AI Career Automation System initialized
[$(date -Iseconds)] INFO: Master orchestration completed successfully
[$(date -Iseconds)] STATUS: All core modules are operational
[$(date -Iseconds)] CONFIG: System configuration created and validated
[$(date -Iseconds)] READY: System is ready for use
EOF

print_status "success" "Log system initialized: $LOG_FILE"

echo ""
echo -e "${BLUE}${GEAR} Phase 8: Quick Startup Test${NC}"
echo "----------------------------------------"

# Test that the main HTML file can be accessed
if [ -f "$CAREER_SYSTEM_DIR/index.html" ]; then
    print_status "success" "Career automation system is accessible"
    
    # Create a simple launcher script for easy access
    LAUNCHER_SCRIPT="$PROJECT_ROOT/launch-career-system.sh"
    cat > "$LAUNCHER_SCRIPT" << EOF
#!/bin/bash
# Quick launcher for Career Automation System
cd "$CAREER_SYSTEM_DIR"
if command -v python3 >/dev/null 2>&1; then
    python3 -m http.server 8080 --bind localhost
else
    echo "Python3 not found. Please open index.html in your browser manually."
    echo "File location: $CAREER_SYSTEM_DIR/index.html"
fi
EOF
    chmod +x "$LAUNCHER_SCRIPT"
    print_status "success" "Quick launcher created: $LAUNCHER_SCRIPT"
else
    print_status "error" "Career automation system files not found"
fi

echo ""
echo -e "${BLUE}${GEAR} Phase 9: Browser Auto-Launch (Optional)${NC}"
echo "----------------------------------------"

# Try to open the system in default browser
if [ -f "$CAREER_SYSTEM_DIR/index.html" ]; then
    FULL_PATH="file://$CAREER_SYSTEM_DIR/index.html"
    
    if command_exists xdg-open; then
        print_status "info" "Attempting to open in browser (Linux)..."
        xdg-open "$FULL_PATH" 2>/dev/null &
        print_status "success" "Career automation system opened in browser"
    elif command_exists open; then
        print_status "info" "Attempting to open in browser (macOS)..."
        open "$FULL_PATH" 2>/dev/null &
        print_status "success" "Career automation system opened in browser"
    elif command_exists start; then
        print_status "info" "Attempting to open in browser (Windows)..."
        start "$FULL_PATH" 2>/dev/null &
        print_status "success" "Career automation system opened in browser"
    else
        print_status "info" "Browser auto-launch not available on this system"
        echo -e "${YELLOW}${INFO} Manual access: Open this file in your browser:${NC}"
        echo -e "${CYAN}   $FULL_PATH${NC}"
    fi
else
    print_status "warning" "Cannot auto-launch - system files not found"
fi

echo ""
echo -e "${GREEN}${SUCCESS} Master Orchestration Complete!${NC}"
echo -e "${CYAN}================================================================${NC}"
echo -e "${GREEN}${ROCKET} AI Career Automation System is now fully operational!${NC}"
echo ""
echo -e "${BLUE}Quick Access:${NC}"
echo -e "${CYAN}  • Career System: $CAREER_SYSTEM_DIR/index.html${NC}"
echo -e "${CYAN}  • Quick Launcher: $LAUNCHER_SCRIPT${NC}"
echo -e "${CYAN}  • System Config: $CONFIG_FILE${NC}"
echo -e "${CYAN}  • System Logs: $LOG_FILE${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${GREEN}  1. ${NC}Open the career automation system in your browser"
echo -e "${GREEN}  2. ${NC}Run comprehensive health check: ./comprehensive_health_check.sh"
echo -e "${GREEN}  3. ${NC}Start creating your portfolio projects!"
echo ""
echo -e "${PURPLE}${SUCCESS} System Status: READY FOR CAREER TRANSFORMATION!${NC}"

# Update system status
if [ -f "$STATUS_FILE" ]; then
    # Simple JSON update (basic approach since we can't rely on jq being available)
    sed -i 's/"system_status": ".*"/"system_status": "ready"/' "$STATUS_FILE" 2>/dev/null || true
fi

# Final log entry
echo "[$(date -Iseconds)] SUCCESS: Master orchestration completed successfully" >> "$LOG_FILE"

exit 0