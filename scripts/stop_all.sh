#!/bin/bash

# 🛑 Stop All Services Script
# Safely stops all running services

set -e

echo "🛑 Stopping AI Career Automation System"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✅ SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️  WARNING]${NC} $1"
}

print_info() {
    echo -e "${RED}[🛑 STOPPING]${NC} $1"
}

# Stop Docker services
if command -v docker-compose &> /dev/null; then
    print_info "Stopping Docker services..."
    
    if [ -f "docker-compose.yml" ]; then
        docker-compose down
    fi
    
    if [ -f "docker-compose.basic.yml" ]; then
        docker-compose -f docker-compose.basic.yml down
    fi
    
    if [ -f "docker-compose.reverse-proxy.yml" ]; then
        docker-compose -f docker-compose.reverse-proxy.yml down
    fi
    
    print_status "Docker services stopped"
fi

# Stop web server
if [ -f "server.pid" ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null 2>&1; then
        print_info "Stopping web server (PID: $PID)..."
        kill $PID
        rm server.pid
        print_status "Web server stopped"
    else
        print_warning "Web server PID file found but process not running"
        rm server.pid
    fi
fi

# Stop job monitor
if [ -f "job_monitor.pid" ]; then
    PID=$(cat job_monitor.pid)
    if ps -p $PID > /dev/null 2>&1; then
        print_info "Stopping job monitor (PID: $PID)..."
        kill $PID
        rm job_monitor.pid
        print_status "Job monitor stopped"
    else
        print_warning "Job monitor PID file found but process not running"
        rm job_monitor.pid
    fi
fi

# Stop social media automation
if [ -f "social_media.pid" ]; then
    PID=$(cat social_media.pid)
    if ps -p $PID > /dev/null 2>&1; then
        print_info "Stopping social media automation (PID: $PID)..."
        kill $PID
        rm social_media.pid
        print_status "Social media automation stopped"
    else
        print_warning "Social media automation PID file found but process not running"
        rm social_media.pid
    fi
fi

# Clean up log files (optional)
read -p "Do you want to clean up log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Cleaning up log files..."
    rm -f *.log
    print_status "Log files cleaned"
fi

echo ""
print_status "🎉 All services stopped successfully!"
print_info "To restart the system, run: ./super_start.sh"