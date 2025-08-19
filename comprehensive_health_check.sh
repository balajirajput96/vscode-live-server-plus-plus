#!/bin/bash

# 🏥 Comprehensive Health Check Script - AI Career Automation System
# बलराज राजपूत द्वारा निर्मित - Complete System Health Monitoring

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Status icons
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
HEALTH="🏥"
CHECK="🔍"

echo -e "${PURPLE}${HEALTH} AI Career Automation System - Comprehensive Health Check${NC}"
echo -e "${CYAN}================================================================${NC}"
echo -e "${BLUE}Performing detailed system analysis and diagnostics...${NC}"
echo ""

# Global counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to print status messages
print_status() {
    local status=$1
    local message=$2
    local icon=""
    
    case $status in
        "success") 
            icon="${SUCCESS}"
            ((PASSED_CHECKS++))
            ;;
        "error") 
            icon="${ERROR}"
            ((FAILED_CHECKS++))
            ;;
        "warning") 
            icon="${WARNING}"
            ((WARNING_CHECKS++))
            ;;
        "info") 
            icon="${INFO}"
            ;;
        *) 
            icon="${CHECK}"
            ;;
    esac
    
    ((TOTAL_CHECKS++))
    echo -e "${icon} ${message}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check file exists and is readable
check_file_health() {
    local file_path="$1"
    local file_description="$2"
    
    if [ -f "$file_path" ]; then
        if [ -r "$file_path" ]; then
            local file_size=$(stat -f%z "$file_path" 2>/dev/null || stat -c%s "$file_path" 2>/dev/null || echo "unknown")
            print_status "success" "$file_description exists and readable (${file_size} bytes)"
            return 0
        else
            print_status "error" "$file_description exists but not readable"
            return 1
        fi
    else
        print_status "error" "$file_description not found: $file_path"
        return 1
    fi
}

# Function to check directory health
check_directory_health() {
    local dir_path="$1"
    local dir_description="$2"
    
    if [ -d "$dir_path" ]; then
        if [ -r "$dir_path" ] && [ -w "$dir_path" ]; then
            local file_count=$(find "$dir_path" -type f 2>/dev/null | wc -l | tr -d ' ')
            print_status "success" "$dir_description accessible with $file_count files"
            return 0
        else
            print_status "warning" "$dir_description has permission issues"
            return 1
        fi
    else
        print_status "error" "$dir_description not found: $dir_path"
        return 1
    fi
}

# Function to validate JSON file
validate_json() {
    local json_file="$1"
    local description="$2"
    
    if [ -f "$json_file" ]; then
        if command_exists python3; then
            if python3 -c "import json; json.load(open('$json_file'))" 2>/dev/null; then
                print_status "success" "$description is valid JSON"
                return 0
            else
                print_status "error" "$description contains invalid JSON"
                return 1
            fi
        else
            print_status "info" "$description exists (JSON validation skipped - no Python)"
            return 0
        fi
    else
        print_status "error" "$description not found"
        return 1
    fi
}

# Function to check HTML file health
check_html_health() {
    local html_file="$1"
    local description="$2"
    
    if [ -f "$html_file" ]; then
        # Basic HTML validation
        if grep -q "<!DOCTYPE html>" "$html_file" && grep -q "</html>" "$html_file"; then
            local line_count=$(wc -l < "$html_file" | tr -d ' ')
            print_status "success" "$description is valid HTML ($line_count lines)"
            return 0
        else
            print_status "warning" "$description may have HTML structure issues"
            return 1
        fi
    else
        print_status "error" "$description not found"
        return 1
    fi
}

# Function to check CSS file health
check_css_health() {
    local css_file="$1"
    local description="$2"
    
    if [ -f "$css_file" ]; then
        # Basic CSS validation - check for common patterns
        if grep -q "{" "$css_file" && grep -q "}" "$css_file"; then
            local rule_count=$(grep -c "{" "$css_file")
            print_status "success" "$description appears valid ($rule_count CSS rules)"
            return 0
        else
            print_status "warning" "$description may have CSS syntax issues"
            return 1
        fi
    else
        print_status "error" "$description not found"
        return 1
    fi
}

# Function to check JavaScript file health
check_js_health() {
    local js_file="$1"
    local description="$2"
    
    if [ -f "$js_file" ]; then
        # Basic JS validation - check for function declarations
        if grep -q "function\|=>" "$js_file"; then
            local func_count=$(grep -c "function\|=>" "$js_file")
            print_status "success" "$description appears valid ($func_count functions found)"
            return 0
        else
            print_status "warning" "$description may have limited functionality"
            return 1
        fi
    else
        print_status "error" "$description not found"
        return 1
    fi
}

# Initialize variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
CAREER_SYSTEM_DIR="$PROJECT_ROOT/career-automation-system"
PORTFOLIO_SYSTEM_DIR="$PROJECT_ROOT/portfolio-automation-system"
LOGS_DIR="$PROJECT_ROOT/logs"

# Create health check log
HEALTH_LOG="$LOGS_DIR/health-check-$(date +%Y%m%d-%H%M%S).log"
mkdir -p "$LOGS_DIR"

echo ""
echo -e "${BLUE}${CHECK} Health Check 1: System Prerequisites${NC}"
echo "----------------------------------------"

# Check operating system
OS_TYPE=$(uname -s)
print_status "info" "Operating System: $OS_TYPE"

# Check available disk space
if command_exists df; then
    DISK_USAGE=$(df -h . 2>/dev/null | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -lt 90 ]; then
        print_status "success" "Disk space healthy (${DISK_USAGE}% used)"
    elif [ "$DISK_USAGE" -lt 95 ]; then
        print_status "warning" "Disk space concerning (${DISK_USAGE}% used)"
    else
        print_status "error" "Disk space critical (${DISK_USAGE}% used)"
    fi
else
    print_status "info" "Disk space check skipped (df command not available)"
fi

# Check memory usage (if available)
if command_exists free; then
    MEMORY_INFO=$(free -h 2>/dev/null | grep "Mem:" | awk '{print $3 "/" $2}')
    print_status "info" "Memory usage: $MEMORY_INFO"
elif command_exists vm_stat; then
    print_status "info" "Memory check available via vm_stat (macOS)"
else
    print_status "info" "Memory check not available on this system"
fi

echo ""
echo -e "${BLUE}${CHECK} Health Check 2: Required Commands${NC}"
echo "----------------------------------------"

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    print_status "success" "Python3 available: $PYTHON_VERSION"
    
    # Check Python modules
    if python3 -c "import json" 2>/dev/null; then
        print_status "success" "Python JSON module available"
    else
        print_status "error" "Python JSON module not available"
    fi
    
    if python3 -c "import os, sys" 2>/dev/null; then
        print_status "success" "Python system modules available"
    else
        print_status "error" "Python system modules not available"
    fi
else
    print_status "warning" "Python3 not found - automation features limited"
fi

# Check Git
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_status "success" "Git available: $GIT_VERSION"
else
    print_status "warning" "Git not found - version control features unavailable"
fi

# Check curl/wget for potential future features
if command_exists curl; then
    print_status "success" "curl available for HTTP operations"
elif command_exists wget; then
    print_status "success" "wget available for HTTP operations"
else
    print_status "info" "No HTTP client found (curl/wget)"
fi

echo ""
echo -e "${BLUE}${CHECK} Health Check 3: Directory Structure${NC}"
echo "----------------------------------------"

check_directory_health "$PROJECT_ROOT" "Project root directory"
check_directory_health "$CAREER_SYSTEM_DIR" "Career automation system directory"
check_directory_health "$PORTFOLIO_SYSTEM_DIR" "Portfolio automation system directory"
check_directory_health "$PORTFOLIO_SYSTEM_DIR/automation" "Automation scripts directory"
check_directory_health "$LOGS_DIR" "Logs directory"

# Check for optional directories
[ -d "$PROJECT_ROOT/backup" ] && check_directory_health "$PROJECT_ROOT/backup" "Backup directory"
[ -d "$PROJECT_ROOT/temp" ] && check_directory_health "$PROJECT_ROOT/temp" "Temporary files directory"

echo ""
echo -e "${BLUE}${CHECK} Health Check 4: Core System Files${NC}"
echo "----------------------------------------"

# Career automation system files
check_html_health "$CAREER_SYSTEM_DIR/index.html" "Career system main page"
check_css_health "$CAREER_SYSTEM_DIR/style.css" "Career system stylesheet"
check_js_health "$CAREER_SYSTEM_DIR/script.js" "Career system JavaScript"
check_file_health "$CAREER_SYSTEM_DIR/QUICK_START.md" "Quick start guide"

# Portfolio automation files
check_file_health "$PORTFOLIO_SYSTEM_DIR/automation/github-documentation-generator.py" "GitHub documentation generator"

# Check if Python script is executable
GITHUB_GENERATOR="$PORTFOLIO_SYSTEM_DIR/automation/github-documentation-generator.py"
if [ -f "$GITHUB_GENERATOR" ]; then
    if [ -x "$GITHUB_GENERATOR" ]; then
        print_status "success" "GitHub documentation generator is executable"
    else
        print_status "warning" "GitHub documentation generator not executable"
    fi
fi

echo ""
echo -e "${BLUE}${CHECK} Health Check 5: Configuration Files${NC}"
echo "----------------------------------------"

# Check system configuration
validate_json "$PROJECT_ROOT/system-config.json" "System configuration"
validate_json "$PROJECT_ROOT/system-status.json" "System status file"

# Check package.json if it exists
[ -f "$PROJECT_ROOT/package.json" ] && validate_json "$PROJECT_ROOT/package.json" "Package configuration"

echo ""
echo -e "${BLUE}${CHECK} Health Check 6: File Permissions${NC}"
echo "----------------------------------------"

# Check if main scripts are executable
if [ -f "$PROJECT_ROOT/super_start.sh" ]; then
    if [ -x "$PROJECT_ROOT/super_start.sh" ]; then
        print_status "success" "super_start.sh is executable"
    else
        print_status "warning" "super_start.sh not executable (may need chmod +x)"
    fi
else
    print_status "info" "super_start.sh not found in current location"
fi

# Check write permissions in key directories
if [ -w "$PROJECT_ROOT" ]; then
    print_status "success" "Project root is writable"
else
    print_status "error" "Project root is not writable"
fi

if [ -w "$LOGS_DIR" ]; then
    print_status "success" "Logs directory is writable"
else
    print_status "error" "Logs directory is not writable"
fi

echo ""
echo -e "${BLUE}${CHECK} Health Check 7: Content Validation${NC}"
echo "----------------------------------------"

# Check HTML content for required elements
if [ -f "$CAREER_SYSTEM_DIR/index.html" ]; then
    if grep -q "Portfolio Builder\|Social Media Generator\|Resume Optimizer" "$CAREER_SYSTEM_DIR/index.html"; then
        print_status "success" "Career system contains expected modules"
    else
        print_status "warning" "Career system may be missing key modules"
    fi
fi

# Check JavaScript for key functions
if [ -f "$CAREER_SYSTEM_DIR/script.js" ]; then
    if grep -q "generatePortfolioContent\|generateSocialPost\|optimizeContent" "$CAREER_SYSTEM_DIR/script.js"; then
        print_status "success" "JavaScript contains expected functions"
    else
        print_status "warning" "JavaScript may be missing key functions"
    fi
fi

echo ""
echo -e "${BLUE}${CHECK} Health Check 8: System Integration${NC}"
echo "----------------------------------------"

# Test Python script execution
if [ -f "$GITHUB_GENERATOR" ] && command_exists python3; then
    if python3 "$GITHUB_GENERATOR" --help >/dev/null 2>&1; then
        print_status "success" "GitHub documentation generator is functional"
    else
        print_status "warning" "GitHub documentation generator may have issues"
    fi
else
    print_status "info" "GitHub documentation generator test skipped"
fi

# Check if system can create files
TEST_FILE="$PROJECT_ROOT/temp/health-check-test.tmp"
mkdir -p "$PROJECT_ROOT/temp"
if echo "test" > "$TEST_FILE" 2>/dev/null; then
    rm -f "$TEST_FILE" 2>/dev/null
    print_status "success" "File creation test passed"
else
    print_status "error" "Cannot create files in project directory"
fi

echo ""
echo -e "${BLUE}${CHECK} Health Check 9: Log System${NC}"
echo "----------------------------------------"

# Check if we can write to log files
if echo "[$(date -Iseconds)] HEALTH_CHECK: System health check performed" >> "$HEALTH_LOG" 2>/dev/null; then
    print_status "success" "Log system is functional"
else
    print_status "error" "Cannot write to log files"
fi

# Check existing log files
LOG_COUNT=$(find "$LOGS_DIR" -name "*.log" 2>/dev/null | wc -l | tr -d ' ')
if [ "$LOG_COUNT" -gt 0 ]; then
    print_status "success" "Found $LOG_COUNT log files"
else
    print_status "info" "No existing log files found"
fi

echo ""
echo -e "${BLUE}${CHECK} Health Check 10: Performance Metrics${NC}"
echo "----------------------------------------"

# Calculate response time for file operations
START_TIME=$(date +%s.%N 2>/dev/null || date +%s)
for i in {1..10}; do
    [ -f "$CAREER_SYSTEM_DIR/index.html" ] && cat "$CAREER_SYSTEM_DIR/index.html" > /dev/null 2>&1
done
END_TIME=$(date +%s.%N 2>/dev/null || date +%s)

if command_exists bc; then
    RESPONSE_TIME=$(echo "scale=3; ($END_TIME - $START_TIME) / 10" | bc 2>/dev/null)
    print_status "success" "Average file access time: ${RESPONSE_TIME}s"
else
    print_status "info" "Performance timing not available (bc command missing)"
fi

# Check file sizes
MAIN_HTML_SIZE=$(stat -f%z "$CAREER_SYSTEM_DIR/index.html" 2>/dev/null || stat -c%s "$CAREER_SYSTEM_DIR/index.html" 2>/dev/null || echo "0")
MAIN_CSS_SIZE=$(stat -f%z "$CAREER_SYSTEM_DIR/style.css" 2>/dev/null || stat -c%s "$CAREER_SYSTEM_DIR/style.css" 2>/dev/null || echo "0")
MAIN_JS_SIZE=$(stat -f%z "$CAREER_SYSTEM_DIR/script.js" 2>/dev/null || stat -c%s "$CAREER_SYSTEM_DIR/script.js" 2>/dev/null || echo "0")

TOTAL_SIZE=$((MAIN_HTML_SIZE + MAIN_CSS_SIZE + MAIN_JS_SIZE))
if [ "$TOTAL_SIZE" -gt 1000 ]; then
    print_status "success" "Core system files total size: $TOTAL_SIZE bytes"
else
    print_status "warning" "Core system files seem unusually small"
fi

echo ""
echo -e "${CYAN}================================================================${NC}"
echo -e "${PURPLE}${HEALTH} COMPREHENSIVE HEALTH CHECK RESULTS${NC}"
echo -e "${CYAN}================================================================${NC}"

# Calculate health score
if [ "$TOTAL_CHECKS" -gt 0 ]; then
    HEALTH_SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
else
    HEALTH_SCORE=0
fi

echo -e "${BLUE}Total Checks Performed: ${TOTAL_CHECKS}${NC}"
echo -e "${GREEN}Passed: ${PASSED_CHECKS} ${SUCCESS}${NC}"
echo -e "${YELLOW}Warnings: ${WARNING_CHECKS} ${WARNING}${NC}"
echo -e "${RED}Failed: ${FAILED_CHECKS} ${ERROR}${NC}"
echo ""

# Overall health assessment
if [ "$HEALTH_SCORE" -ge 90 ]; then
    echo -e "${GREEN}${SUCCESS} OVERALL SYSTEM HEALTH: EXCELLENT (${HEALTH_SCORE}%)${NC}"
    echo -e "${GREEN}${SUCCESS} Your AI Career Automation System is fully operational!${NC}"
    OVERALL_STATUS="EXCELLENT"
elif [ "$HEALTH_SCORE" -ge 75 ]; then
    echo -e "${YELLOW}${WARNING} OVERALL SYSTEM HEALTH: GOOD (${HEALTH_SCORE}%)${NC}"
    echo -e "${YELLOW}${WARNING} System is functional with minor issues${NC}"
    OVERALL_STATUS="GOOD"
elif [ "$HEALTH_SCORE" -ge 50 ]; then
    echo -e "${YELLOW}${WARNING} OVERALL SYSTEM HEALTH: FAIR (${HEALTH_SCORE}%)${NC}"
    echo -e "${YELLOW}${WARNING} System has several issues that should be addressed${NC}"
    OVERALL_STATUS="FAIR"
else
    echo -e "${RED}${ERROR} OVERALL SYSTEM HEALTH: POOR (${HEALTH_SCORE}%)${NC}"
    echo -e "${RED}${ERROR} System requires immediate attention${NC}"
    OVERALL_STATUS="POOR"
fi

echo ""
if [ "$FAILED_CHECKS" -eq 0 ] && [ "$WARNING_CHECKS" -eq 0 ]; then
    echo -e "${GREEN}${SUCCESS} Perfect! All systems are go for career transformation!${NC}"
elif [ "$FAILED_CHECKS" -eq 0 ]; then
    echo -e "${YELLOW}${WARNING} System is ready with minor notes to review${NC}"
else
    echo -e "${RED}${ERROR} Please address the failed checks before proceeding${NC}"
fi

echo ""
echo -e "${BLUE}Next Steps:${NC}"
if [ "$HEALTH_SCORE" -ge 75 ]; then
    echo -e "${GREEN}  ✓ ${NC}System is ready for use"
    echo -e "${GREEN}  ✓ ${NC}Open career-automation-system/index.html in your browser"
    echo -e "${GREEN}  ✓ ${NC}Start creating your portfolio projects"
else
    echo -e "${YELLOW}  ! ${NC}Review and fix any failed checks"
    echo -e "${YELLOW}  ! ${NC}Re-run this health check after fixes"
    echo -e "${YELLOW}  ! ${NC}Contact support if issues persist"
fi

echo ""
echo -e "${CYAN}Health check log saved to: ${HEALTH_LOG}${NC}"

# Write health check summary to log
{
    echo ""
    echo "HEALTH CHECK SUMMARY - $(date)"
    echo "=============================="
    echo "Total Checks: $TOTAL_CHECKS"
    echo "Passed: $PASSED_CHECKS"
    echo "Warnings: $WARNING_CHECKS"
    echo "Failed: $FAILED_CHECKS"
    echo "Health Score: $HEALTH_SCORE%"
    echo "Overall Status: $OVERALL_STATUS"
    echo "=============================="
} >> "$HEALTH_LOG"

# Exit with appropriate code
if [ "$FAILED_CHECKS" -eq 0 ]; then
    exit 0
else
    exit 1
fi