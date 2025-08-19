#!/bin/bash

# Comprehensive Health Check Script
# This script performs various system health checks and generates reports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p logs

# Log file
LOG_FILE="logs/health_check_$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}=== Comprehensive Health Check Started at $(date) ===${NC}" | tee -a $LOG_FILE

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Function to check command exists
check_command() {
    if command -v $1 &> /dev/null; then
        log "✅ $1 is available"
        return 0
    else
        log "❌ $1 is not available"
        return 1
    fi
}

# System Information
log "📊 System Information:"
log "OS: $(uname -a)"
log "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
log "npm: $(npm --version 2>/dev/null || echo 'Not installed')"
log "Git: $(git --version 2>/dev/null || echo 'Not installed')"

# Check environment variables
log "🔧 Environment Variables Check:"
ENV_VARS=("GOOGLE_PRIMARY_EMAIL" "MS_PRIMARY_EMAIL" "TAILSCALE_AUTHKEY" "OPENAI_API_KEY" "YOUTUBE_API_KEY")

for var in "${ENV_VARS[@]}"; do
    if [[ -n "${!var}" ]]; then
        log "✅ $var is set"
    else
        log "❌ $var is not set"
    fi
done

# Check if .env file exists
if [[ -f ".env" ]]; then
    log "✅ .env file exists"
    log "📄 .env file variables:"
    while IFS= read -r line; do
        if [[ $line == *"="* && $line != "#"* ]]; then
            var_name=$(echo "$line" | cut -d'=' -f1)
            log "  - $var_name"
        fi
    done < .env
else
    log "⚠️  .env file not found (using environment variables)"
fi

# Check network connectivity
log "🌐 Network Connectivity Check:"
if ping -c 1 google.com &> /dev/null; then
    log "✅ Internet connectivity: OK"
else
    log "❌ Internet connectivity: FAILED"
fi

# Check API endpoints (if applicable)
log "🔌 API Endpoints Check:"
if [[ -n "$OPENAI_API_KEY" ]]; then
    if curl -s -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models > /dev/null; then
        log "✅ OpenAI API: Accessible"
    else
        log "❌ OpenAI API: Not accessible"
    fi
else
    log "⚠️  OpenAI API key not provided"
fi

# Check disk space
log "💾 Disk Space Check:"
df -h | head -2 | tee -a $LOG_FILE

# Check memory usage
log "🧠 Memory Usage:"
free -h | tee -a $LOG_FILE

# Check running processes (if applicable)
log "🔄 Process Check:"
if pgrep -f "node" > /dev/null; then
    log "✅ Node processes running: $(pgrep -f "node" | wc -l)"
else
    log "ℹ️  No Node processes currently running"
fi

# Project-specific checks
log "📦 Project Health Check:"
if [[ -f "package.json" ]]; then
    log "✅ package.json exists"
    
    # Check if node_modules exists
    if [[ -d "node_modules" ]]; then
        log "✅ node_modules directory exists"
    else
        log "⚠️  node_modules directory not found"
    fi
    
    # Check package integrity
    if npm ls &> /dev/null; then
        log "✅ Package dependencies: OK"
    else
        log "⚠️  Package dependencies: Issues found"
    fi
else
    log "ℹ️  No package.json found (not a Node.js project)"
fi

# Git repository check
log "📋 Git Repository Check:"
if [[ -d ".git" ]]; then
    log "✅ Git repository initialized"
    log "📍 Current branch: $(git branch --show-current)"
    log "📝 Last commit: $(git log -1 --pretty=format:'%h - %s (%an, %ar)')"
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD --; then
        log "✅ Working directory clean"
    else
        log "⚠️  Uncommitted changes detected"
    fi
else
    log "ℹ️  Not a Git repository"
fi

# Generate summary
log "📊 Health Check Summary:"
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Count checks (simplified)
if command -v node &> /dev/null; then ((PASSED_CHECKS++)); fi
((TOTAL_CHECKS++))

if [[ -n "$GOOGLE_PRIMARY_EMAIL" ]]; then ((PASSED_CHECKS++)); fi
((TOTAL_CHECKS++))

if ping -c 1 google.com &> /dev/null; then ((PASSED_CHECKS++)); fi
((TOTAL_CHECKS++))

HEALTH_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

log "🎯 Overall Health Score: $HEALTH_PERCENTAGE% ($PASSED_CHECKS/$TOTAL_CHECKS checks passed)"

if [[ $HEALTH_PERCENTAGE -ge 80 ]]; then
    log "✅ System is HEALTHY"
    exit 0
elif [[ $HEALTH_PERCENTAGE -ge 60 ]]; then
    log "⚠️  System has WARNINGS"
    exit 1
else
    log "❌ System is UNHEALTHY"
    exit 2
fi