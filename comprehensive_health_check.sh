#!/bin/bash

# 🔍 Comprehensive Health Check Script
# This script monitors all components of your automation system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Symbols
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Logging functions
log_pass() {
    echo -e "${GREEN}${CHECK} $1${NC}"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

log_fail() {
    echo -e "${RED}${CROSS} $1${NC}"
    ((FAILED_CHECKS++))
    ((TOTAL_CHECKS++))
}

log_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
    ((WARNING_CHECKS++))
    ((TOTAL_CHECKS++))
}

log_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

log_section() {
    echo -e "\n${PURPLE}${GEAR} $1${NC}"
    echo "----------------------------------------"
}

# Check Docker services
check_docker_services() {
    log_section "Docker Services Health Check"
    
    # Check if Docker is running
    if systemctl is-active --quiet docker 2>/dev/null || pgrep -f docker >/dev/null 2>&1; then
        log_pass "Docker daemon is running"
    else
        log_fail "Docker daemon is not running"
        return 1
    fi
    
    # Check if .env file exists
    if [ -f ".env" ]; then
        log_pass ".env configuration file exists"
    else
        log_fail ".env configuration file missing"
        return 1
    fi
    
    # Check Docker Compose services
    if docker compose ps | grep -q "Up"; then
        log_pass "Docker Compose services are running"
        
        # Check individual services
        if docker compose ps | grep postgres | grep -q "Up"; then
            log_pass "PostgreSQL database is running"
        else
            log_fail "PostgreSQL database is not running"
        fi
        
        if docker compose ps | grep n8n | grep -q "Up"; then
            log_pass "n8n service is running"
        else
            log_fail "n8n service is not running"
        fi
        
        if docker compose ps | grep caddy | grep -q "Up" 2>/dev/null; then
            log_pass "Caddy reverse proxy is running"
        else
            log_info "Caddy reverse proxy not found (normal for basic setup)"
        fi
    else
        log_fail "No Docker Compose services are running"
    fi
}

# Check network connectivity
check_network() {
    log_section "Network Connectivity Check"
    
    # Check internet connectivity
    if ping -c 1 google.com >/dev/null 2>&1; then
        log_pass "Internet connectivity is working"
    else
        log_fail "No internet connectivity"
    fi
    
    # Check n8n web interface
    source .env 2>/dev/null || true
    
    if [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "your-domain.com" ]; then
        # HTTPS setup
        if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200\|401"; then
            log_pass "n8n web interface is accessible via HTTPS"
        else
            log_fail "n8n web interface is not accessible via HTTPS"
        fi
    else
        # HTTP setup
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:5678 | grep -q "200\|401"; then
            log_pass "n8n web interface is accessible via HTTP"
        else
            log_fail "n8n web interface is not accessible via HTTP"
        fi
    fi
}

# Check database connectivity
check_database() {
    log_section "Database Health Check"
    
    # Check PostgreSQL connection
    if docker compose exec postgres pg_isready -U n8n >/dev/null 2>&1; then
        log_pass "PostgreSQL database is accepting connections"
        
        # Check database size
        DB_SIZE=$(docker compose exec postgres psql -U n8n -c "SELECT pg_size_pretty(pg_database_size('n8n'));" -t 2>/dev/null | xargs)
        if [ ! -z "$DB_SIZE" ]; then
            log_pass "Database size: $DB_SIZE"
        fi
        
        # Check number of workflows
        WORKFLOW_COUNT=$(docker compose exec postgres psql -U n8n -c "SELECT COUNT(*) FROM workflow_entity;" -t 2>/dev/null | xargs)
        if [ ! -z "$WORKFLOW_COUNT" ] && [ "$WORKFLOW_COUNT" != "0" ]; then
            log_pass "Workflows in database: $WORKFLOW_COUNT"
        else
            log_warning "No workflows found in database"
        fi
    else
        log_fail "PostgreSQL database is not responding"
    fi
}

# Check VPN status
check_vpn() {
    log_section "VPN Status Check"
    
    # Check ExpressVPN
    if command -v expressvpn >/dev/null 2>&1; then
        if expressvpn status | grep -q "Connected"; then
            VPN_LOCATION=$(expressvpn status | grep "Connected to" | cut -d' ' -f3-)
            log_pass "ExpressVPN is connected ($VPN_LOCATION)"
        else
            log_warning "ExpressVPN is installed but not connected"
        fi
    elif command -v nordvpn >/dev/null 2>&1; then
        if nordvpn status | grep -q "Connected"; then
            VPN_LOCATION=$(nordvpn status | grep "Current server" | cut -d':' -f2 | xargs)
            log_pass "NordVPN is connected ($VPN_LOCATION)"
        else
            log_warning "NordVPN is installed but not connected"
        fi
    else
        log_info "No VPN client detected (optional)"
    fi
}

# Check system resources
check_system_resources() {
    log_section "System Resources Check"
    
    # Check disk space
    DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -lt 80 ]; then
        log_pass "Disk usage: ${DISK_USAGE}% (healthy)"
    elif [ "$DISK_USAGE" -lt 90 ]; then
        log_warning "Disk usage: ${DISK_USAGE}% (getting high)"
    else
        log_fail "Disk usage: ${DISK_USAGE}% (critically high)"
    fi
    
    # Check memory usage
    if command -v free >/dev/null 2>&1; then
        MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
        if [ "$MEM_USAGE" -lt 80 ]; then
            log_pass "Memory usage: ${MEM_USAGE}% (healthy)"
        elif [ "$MEM_USAGE" -lt 90 ]; then
            log_warning "Memory usage: ${MEM_USAGE}% (getting high)"
        else
            log_fail "Memory usage: ${MEM_USAGE}% (critically high)"
        fi
    fi
    
    # Check Docker container resource usage
    log_info "Docker container resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || true
}

# Check backup status
check_backups() {
    log_section "Backup Status Check"
    
    if [ -d "backup" ]; then
        BACKUP_COUNT=$(ls -1 backup/ 2>/dev/null | wc -l)
        if [ "$BACKUP_COUNT" -gt 0 ]; then
            LATEST_BACKUP=$(ls -t backup/ 2>/dev/null | head -1)
            log_pass "Backup directory exists with $BACKUP_COUNT files"
            log_info "Latest backup: $LATEST_BACKUP"
        else
            log_warning "Backup directory exists but is empty"
        fi
    else
        log_warning "Backup directory does not exist"
    fi
    
    # Check if backup script exists
    if [ -f "scripts/backup.sh" ]; then
        log_pass "Backup script is available"
    else
        log_warning "Backup script not found"
    fi
}

# Check log files
check_logs() {
    log_section "Log Files Check"
    
    # Check Docker logs for errors
    ERROR_COUNT=$(docker compose logs --since=24h 2>/dev/null | grep -i error | wc -l)
    if [ "$ERROR_COUNT" -eq 0 ]; then
        log_pass "No errors in Docker logs (last 24h)"
    elif [ "$ERROR_COUNT" -lt 5 ]; then
        log_warning "$ERROR_COUNT errors found in Docker logs (last 24h)"
    else
        log_fail "$ERROR_COUNT errors found in Docker logs (last 24h)"
    fi
    
    # Check for critical issues
    CRITICAL_COUNT=$(docker compose logs --since=24h 2>/dev/null | grep -i "critical\|fatal" | wc -l)
    if [ "$CRITICAL_COUNT" -eq 0 ]; then
        log_pass "No critical issues in logs"
    else
        log_fail "$CRITICAL_COUNT critical issues found in logs"
    fi
}

# Check security
check_security() {
    log_section "Security Check"
    
    source .env 2>/dev/null || true
    
    # Check if default passwords are being used
    if [ "$N8N_BASIC_AUTH_PASSWORD" = "admin" ] || [ "$N8N_BASIC_AUTH_PASSWORD" = "your_strong_n8n_password" ]; then
        log_fail "Using default n8n password (security risk!)"
    else
        log_pass "Custom n8n password is configured"
    fi
    
    if [ "$POSTGRES_PASSWORD" = "n8n" ] || [ "$POSTGRES_PASSWORD" = "your_strong_database_password" ]; then
        log_fail "Using default database password (security risk!)"
    else
        log_pass "Custom database password is configured"
    fi
    
    # Check encryption key
    if [ "$N8N_ENCRYPTION_KEY" = "your_encryption_key_here" ] || [ -z "$N8N_ENCRYPTION_KEY" ]; then
        log_fail "Default or missing encryption key (security risk!)"
    else
        log_pass "Custom encryption key is configured"
    fi
    
    # Check HTTPS
    if [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "your-domain.com" ]; then
        log_pass "HTTPS domain is configured"
    else
        log_warning "No HTTPS domain configured (using HTTP only)"
    fi
}

# Generate recommendations
generate_recommendations() {
    log_section "Recommendations"
    
    if [ "$FAILED_CHECKS" -gt 0 ]; then
        echo -e "${RED}🚨 Critical Issues Found:${NC}"
        echo "• $FAILED_CHECKS critical issues need immediate attention"
        echo "• Review the failed checks above and take corrective action"
        echo ""
    fi
    
    if [ "$WARNING_CHECKS" -gt 0 ]; then
        echo -e "${YELLOW}⚠️ Warnings:${NC}"
        echo "• $WARNING_CHECKS warnings found that should be addressed"
        echo "• Consider fixing these for optimal performance"
        echo ""
    fi
    
    # Specific recommendations
    if docker compose logs --since=24h 2>/dev/null | grep -q "out of memory"; then
        echo -e "${YELLOW}💡 Consider increasing system memory or optimizing Docker containers${NC}"
    fi
    
    if [ ! -f "scripts/backup.sh" ]; then
        echo -e "${YELLOW}💡 Set up automated backups for data protection${NC}"
    fi
    
    source .env 2>/dev/null || true
    if [ "$N8N_BASIC_AUTH_PASSWORD" = "admin" ]; then
        echo -e "${RED}🔒 URGENT: Change default passwords immediately!${NC}"
    fi
}

# Display summary
display_summary() {
    echo ""
    echo "========================================"
    echo "🏥 HEALTH CHECK SUMMARY"
    echo "========================================"
    echo -e "Total Checks: ${BLUE}$TOTAL_CHECKS${NC}"
    echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
    echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"
    echo -e "Warnings: ${YELLOW}$WARNING_CHECKS${NC}"
    echo ""
    
    # Overall health score
    if [ "$TOTAL_CHECKS" -gt 0 ]; then
        HEALTH_SCORE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
        
        if [ "$HEALTH_SCORE" -ge 90 ]; then
            echo -e "Overall Health: ${GREEN}$HEALTH_SCORE% - Excellent! 🎉${NC}"
        elif [ "$HEALTH_SCORE" -ge 75 ]; then
            echo -e "Overall Health: ${YELLOW}$HEALTH_SCORE% - Good ✨${NC}"
        elif [ "$HEALTH_SCORE" -ge 50 ]; then
            echo -e "Overall Health: ${YELLOW}$HEALTH_SCORE% - Needs Attention ⚠️${NC}"
        else
            echo -e "Overall Health: ${RED}$HEALTH_SCORE% - Critical Issues! 🚨${NC}"
        fi
    fi
    
    echo ""
    echo "🔄 Run this check regularly to maintain system health"
    echo "📋 For detailed logs: docker compose logs"
    echo "🛠️ For troubleshooting: check README-n8n-setup.md"
}

# Main execution
main() {
    echo "🔍 AI Career Automation System - Health Check"
    echo "=============================================="
    echo "⏰ Started at: $(date)"
    echo ""
    
    check_docker_services
    check_network
    check_database
    check_vpn
    check_system_resources
    check_backups
    check_logs
    check_security
    
    generate_recommendations
    display_summary
    
    # Exit with error code if there are critical failures
    if [ "$FAILED_CHECKS" -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"