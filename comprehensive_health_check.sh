#!/bin/bash

# 🏥 Comprehensive Health Check Script - AI Career Automation System
# यह script आपके system की सभी services की health check करता है

set -e  # Exit on any error

echo "🏥 AI Career Automation System - Health Check"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to print colored output
print_success() {
    echo -e "${GREEN}[✅ PASS]${NC} $1"
    ((PASSED_CHECKS++))
}

print_fail() {
    echo -e "${RED}[❌ FAIL]${NC} $1"
    ((FAILED_CHECKS++))
}

print_warning() {
    echo -e "${YELLOW}[⚠️  WARN]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ️  INFO]${NC} $1"
}

run_check() {
    ((TOTAL_CHECKS++))
    if eval "$1" > /dev/null 2>&1; then
        print_success "$2"
        return 0
    else
        print_fail "$2"
        if [ -n "$3" ]; then
            print_info "  Solution: $3"
        fi
        return 1
    fi
}

echo ""
print_info "Starting comprehensive health check..."
echo ""

# 1. System Requirements Check
echo "🔧 System Requirements"
echo "======================"

run_check "command -v bash" "Bash shell available" "Install bash shell"
run_check "command -v curl" "curl command available" "Install curl: sudo apt install curl"
run_check "command -v wget" "wget command available" "Install wget: sudo apt install wget"

# Check if .env file exists
if [ -f ".env" ]; then
    print_success ".env configuration file exists"
    ((PASSED_CHECKS++))
    source .env
else
    print_fail ".env configuration file missing"
    print_info "  Solution: cp .env.template .env && nano .env"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

echo ""

# 2. Docker and Container Services
echo "🐳 Docker Services"
echo "=================="

run_check "command -v docker" "Docker installed" "Install Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
run_check "command -v docker-compose" "Docker Compose installed" "Install Docker Compose: sudo curl -L \"https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose"

if command -v docker &> /dev/null; then
    run_check "docker ps" "Docker daemon running" "Start Docker: sudo systemctl start docker"
    
    # Check n8n container
    if docker ps | grep -q n8n; then
        print_success "n8n container running"
        ((PASSED_CHECKS++))
    else
        print_fail "n8n container not running"
        print_info "  Solution: Run ./super_start.sh to start n8n"
        ((FAILED_CHECKS++))
    fi
    ((TOTAL_CHECKS++))
fi

echo ""

# 3. Web Services Health Check
echo "🌐 Web Services"
echo "==============="

# Check n8n service
run_check "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:5678 | grep -q \"200\\|302\"" "n8n web interface (port 5678)" "Start n8n: ./super_start.sh"

# Check career dashboard
run_check "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:3000 | grep -q \"200\"" "Career dashboard (port 3000)" "Start web server: ./super_start.sh"

# Check if index.html exists
run_check "[ -f \"index.html\" ]" "Main dashboard file (index.html)" "File should exist in repository"

# Check if Job_Tracking_System.html exists
run_check "[ -f \"Job_Tracking_System.html\" ]" "Job tracking system file" "File should exist in repository"

echo ""

# 4. Background Services
echo "🔄 Background Services"
echo "======================"

# Check if server is running
if [ -f "server.pid" ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null 2>&1; then
        print_success "Web server process running (PID: $PID)"
        ((PASSED_CHECKS++))
    else
        print_fail "Web server process not found"
        print_info "  Solution: Run ./super_start.sh to restart services"
        ((FAILED_CHECKS++))
    fi
else
    print_fail "Web server PID file not found"
    print_info "  Solution: Run ./super_start.sh to start services"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

# Check job monitor
if [ -f "job_monitor.pid" ]; then
    PID=$(cat job_monitor.pid)
    if ps -p $PID > /dev/null 2>&1; then
        print_success "Job monitoring service running (PID: $PID)"
        ((PASSED_CHECKS++))
    else
        print_fail "Job monitoring service not running"
        ((FAILED_CHECKS++))
    fi
else
    print_warning "Job monitoring service not configured"
fi
((TOTAL_CHECKS++))

echo ""

# 5. File System Health
echo "📁 File System"
echo "=============="

# Check important directories
run_check "[ -d \"scripts\" ]" "Scripts directory exists" "Create directory: mkdir scripts"
run_check "[ -d \"career-automation-system\" ]" "Career automation directory exists" "Directory should exist in repository"
run_check "[ -d \"portfolio-automation-system\" ]" "Portfolio automation directory exists" "Directory should exist in repository"

# Check script permissions
run_check "[ -x \"super_start.sh\" ]" "super_start.sh is executable" "chmod +x super_start.sh"
run_check "[ -x \"comprehensive_health_check.sh\" ]" "comprehensive_health_check.sh is executable" "chmod +x comprehensive_health_check.sh"

# Check important files
run_check "[ -f \"README.md\" ]" "README.md exists" "File should exist in repository"
run_check "[ -f \"package.json\" ]" "package.json exists" "File should exist in repository"

echo ""

# 6. Network Connectivity
echo "🌍 Network Connectivity"
echo "======================="

run_check "ping -c 1 google.com" "Internet connectivity" "Check your internet connection"
run_check "curl -s https://api.github.com" "GitHub API access" "Check firewall and internet connection"

# Check if VPN is configured
if [ -n "$VPN_CONFIG" ] && [ -f "$VPN_CONFIG" ]; then
    print_success "VPN configuration found"
    ((PASSED_CHECKS++))
else
    print_warning "VPN not configured (optional)"
fi
((TOTAL_CHECKS++))

echo ""

# 7. Environment Variables
echo "🔐 Environment Configuration"
echo "============================"

if [ -f ".env" ]; then
    # Check critical environment variables
    if [ -n "$N8N_ENCRYPTION_KEY" ]; then
        print_success "N8N_ENCRYPTION_KEY is configured"
        ((PASSED_CHECKS++))
    else
        print_fail "N8N_ENCRYPTION_KEY not set"
        print_info "  Solution: Add N8N_ENCRYPTION_KEY to .env file"
        ((FAILED_CHECKS++))
    fi
    ((TOTAL_CHECKS++))
    
    if [ -n "$DOMAIN" ]; then
        print_success "DOMAIN is configured"
        ((PASSED_CHECKS++))
    else
        print_warning "DOMAIN not set (required for production)"
    fi
    ((TOTAL_CHECKS++))
    
    if [ -n "$EMAIL" ]; then
        print_success "EMAIL is configured"
        ((PASSED_CHECKS++))
    else
        print_warning "EMAIL not set (required for SSL certificates)"
    fi
    ((TOTAL_CHECKS++))
fi

echo ""

# 8. Performance Check
echo "⚡ Performance"
echo "=============="

# Check available disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    print_success "Disk space usage: ${DISK_USAGE}% (Good)"
    ((PASSED_CHECKS++))
elif [ "$DISK_USAGE" -lt 90 ]; then
    print_warning "Disk space usage: ${DISK_USAGE}% (Warning)"
else
    print_fail "Disk space usage: ${DISK_USAGE}% (Critical)"
    print_info "  Solution: Free up disk space"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

# Check available memory
MEMORY_USAGE=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2*100}')
if [ "$MEMORY_USAGE" -lt 80 ]; then
    print_success "Memory usage: ${MEMORY_USAGE}% (Good)"
    ((PASSED_CHECKS++))
elif [ "$MEMORY_USAGE" -lt 90 ]; then
    print_warning "Memory usage: ${MEMORY_USAGE}% (Warning)"
else
    print_fail "Memory usage: ${MEMORY_USAGE}% (High)"
    print_info "  Solution: Restart services or add more memory"
    ((FAILED_CHECKS++))
fi
((TOTAL_CHECKS++))

echo ""

# Summary
echo "📊 Health Check Summary"
echo "======================="
echo "Total Checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"

HEALTH_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo "Overall Health: $HEALTH_PERCENTAGE%"

echo ""

if [ $HEALTH_PERCENTAGE -ge 80 ]; then
    print_success "🎉 System is healthy and ready to use!"
    echo ""
    print_info "Next steps:"
    echo "  1. Open http://localhost:3000 for career dashboard"
    echo "  2. Open http://localhost:5678 for n8n automation"
    echo "  3. Check logs: tail -f *.log"
elif [ $HEALTH_PERCENTAGE -ge 60 ]; then
    print_warning "⚠️  System has some issues but is mostly functional"
    echo ""
    print_info "Recommended actions:"
    echo "  1. Fix the failed checks above"
    echo "  2. Run ./super_start.sh to restart services"
    echo "  3. Run this health check again"
else
    print_fail "❌ System has significant issues and may not work properly"
    echo ""
    print_info "Required actions:"
    echo "  1. Fix all failed checks above"
    echo "  2. Ensure .env file is properly configured"
    echo "  3. Run ./super_start.sh"
    echo "  4. Run this health check again"
fi

echo ""
print_info "Health check completed at $(date)"

# Return appropriate exit code
if [ $HEALTH_PERCENTAGE -ge 80 ]; then
    exit 0
else
    exit 1
fi