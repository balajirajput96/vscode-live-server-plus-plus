#!/bin/bash

# 🏥 Comprehensive Health Check Script
# Complete system monitoring and diagnostics

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
LOG_DIR="logs"
HEALTH_LOG="$LOG_DIR/health-$(date +%Y%m%d_%H%M%S).log"
SUMMARY_LOG="$LOG_DIR/health-summary.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO] $1${NC}" | tee -a "$HEALTH_LOG"
}

log_warn() {
    echo -e "${YELLOW}[WARN] $1${NC}" | tee -a "$HEALTH_LOG"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$HEALTH_LOG"
}

log_debug() {
    echo -e "${BLUE}[DEBUG] $1${NC}" | tee -a "$HEALTH_LOG"
}

log_header() {
    echo -e "${PURPLE}========== $1 ==========${NC}" | tee -a "$HEALTH_LOG"
}

# Health check counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Record check result
record_check() {
    local status=$1
    local message=$2
    
    case $status in
        "PASS")
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
            log_info "✅ $message"
            ;;
        "FAIL")
            CHECKS_FAILED=$((CHECKS_FAILED + 1))
            log_error "❌ $message"
            ;;
        "WARN")
            CHECKS_WARNING=$((CHECKS_WARNING + 1))
            log_warn "⚠️ $message"
            ;;
    esac
}

# System resource checks
check_system_resources() {
    log_header "System Resources"
    
    # Check disk space
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 80 ]; then
        record_check "PASS" "Disk usage: ${disk_usage}%"
    elif [ "$disk_usage" -lt 90 ]; then
        record_check "WARN" "Disk usage high: ${disk_usage}%"
    else
        record_check "FAIL" "Disk usage critical: ${disk_usage}%"
    fi
    
    # Check memory usage
    local mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [ "$mem_usage" -lt 80 ]; then
        record_check "PASS" "Memory usage: ${mem_usage}%"
    elif [ "$mem_usage" -lt 90 ]; then
        record_check "WARN" "Memory usage high: ${mem_usage}%"
    else
        record_check "FAIL" "Memory usage critical: ${mem_usage}%"
    fi
    
    # Check CPU load
    local cpu_load=$(uptime | awk -F'load average:' '{print $2}' | cut -d, -f1 | sed 's/^ *//')
    local cpu_cores=$(nproc)
    local cpu_percent=$(echo "$cpu_load * 100 / $cpu_cores" | bc -l | cut -d. -f1)
    
    if [ "$cpu_percent" -lt 70 ]; then
        record_check "PASS" "CPU load: ${cpu_load} (${cpu_percent}%)"
    elif [ "$cpu_percent" -lt 90 ]; then
        record_check "WARN" "CPU load high: ${cpu_load} (${cpu_percent}%)"
    else
        record_check "FAIL" "CPU load critical: ${cpu_load} (${cpu_percent}%)"
    fi
}

# Docker health checks
check_docker() {
    log_header "Docker Services"
    
    # Check if Docker is running
    if docker info &> /dev/null; then
        record_check "PASS" "Docker daemon is running"
        
        # Check n8n container
        if docker ps | grep -q "n8n-master"; then
            record_check "PASS" "n8n-master container is running"
            
            # Check n8n health endpoint
            if curl -f -s http://localhost:5678/healthz &> /dev/null; then
                record_check "PASS" "n8n health endpoint responding"
            else
                record_check "WARN" "n8n health endpoint not responding"
            fi
        else
            record_check "FAIL" "n8n-master container not running"
        fi
        
        # Check Docker resource usage
        local container_count=$(docker ps -q | wc -l)
        record_check "PASS" "Active containers: $container_count"
        
    else
        record_check "FAIL" "Docker daemon not running"
    fi
}

# Network connectivity checks
check_network() {
    log_header "Network Connectivity"
    
    # Check internet connectivity
    if ping -c 1 8.8.8.8 &> /dev/null; then
        record_check "PASS" "Internet connectivity available"
    else
        record_check "FAIL" "No internet connectivity"
    fi
    
    # Check GitHub connectivity
    if curl -f -s https://api.github.com &> /dev/null; then
        record_check "PASS" "GitHub API accessible"
    else
        record_check "WARN" "GitHub API not accessible"
    fi
    
    # Check if VPN/Tailscale is configured
    if command -v tailscale &> /dev/null; then
        local tailscale_status=$(tailscale status --json 2>/dev/null | jq -r '.BackendState' 2>/dev/null || echo "unknown")
        if [ "$tailscale_status" = "Running" ]; then
            record_check "PASS" "Tailscale VPN is running"
        else
            record_check "WARN" "Tailscale VPN not running (status: $tailscale_status)"
        fi
    else
        record_check "WARN" "Tailscale not installed"
    fi
}

# File system checks
check_filesystem() {
    log_header "File System"
    
    # Check important directories
    local required_dirs=("scripts" "logs" "backups" "config")
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            record_check "PASS" "Directory exists: $dir"
        else
            record_check "WARN" "Directory missing: $dir"
        fi
    done
    
    # Check important files
    local required_files=(".env" "docker-compose.yml" "super_start.sh")
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            record_check "PASS" "File exists: $file"
        else
            record_check "WARN" "File missing: $file"
        fi
    done
    
    # Check script permissions
    local scripts=("super_start.sh" "comprehensive_health_check.sh")
    for script in "${scripts[@]}"; do
        if [ -f "$script" ] && [ -x "$script" ]; then
            record_check "PASS" "Script executable: $script"
        elif [ -f "$script" ]; then
            record_check "WARN" "Script not executable: $script"
        fi
    done
}

# Configuration checks
check_configuration() {
    log_header "Configuration"
    
    # Check .env file
    if [ -f ".env" ]; then
        record_check "PASS" ".env file exists"
        
        # Check required environment variables
        local required_vars=("N8N_ENCRYPTION_KEY" "WEBHOOK_URL" "DOMAIN")
        for var in "${required_vars[@]}"; do
            if grep -q "^${var}=" .env && ! grep -q "^${var}=$" .env; then
                record_check "PASS" "Environment variable set: $var"
            else
                record_check "WARN" "Environment variable empty or missing: $var"
            fi
        done
    else
        record_check "FAIL" ".env file missing"
    fi
    
    # Check Git configuration
    if [ -d ".git" ]; then
        record_check "PASS" "Git repository initialized"
        
        local git_status=$(git status --porcelain 2>/dev/null | wc -l)
        if [ "$git_status" -eq 0 ]; then
            record_check "PASS" "Git working directory clean"
        else
            record_check "WARN" "Git working directory has $git_status uncommitted changes"
        fi
    else
        record_check "WARN" "Not a Git repository"
    fi
}

# Security checks
check_security() {
    log_header "Security"
    
    # Check file permissions
    local sensitive_files=(".env" "config/")
    for file in "${sensitive_files[@]}"; do
        if [ -e "$file" ]; then
            local perms=$(stat -c "%a" "$file" 2>/dev/null || echo "unknown")
            if [[ "$perms" =~ ^[67][0-4][0-4]$ ]]; then
                record_check "PASS" "File permissions secure: $file ($perms)"
            else
                record_check "WARN" "File permissions may be too open: $file ($perms)"
            fi
        fi
    done
    
    # Check for exposed secrets
    if [ -f ".env" ]; then
        if grep -q "password\|secret\|key" .env | grep -qv "^#"; then
            local secret_count=$(grep -c "password\|secret\|key" .env | grep -v "^#" || echo "0")
            record_check "PASS" "Found $secret_count configured secrets"
        else
            record_check "WARN" "No secrets found in .env file"
        fi
    fi
}

# Backup checks
check_backups() {
    log_header "Backup System"
    
    if [ -d "backups" ]; then
        local backup_count=$(find backups -type f -name "*.tar.gz" -o -name "*.zip" 2>/dev/null | wc -l)
        if [ "$backup_count" -gt 0 ]; then
            record_check "PASS" "Found $backup_count backup files"
            
            # Check recent backups (last 7 days)
            local recent_backups=$(find backups -type f -mtime -7 2>/dev/null | wc -l)
            if [ "$recent_backups" -gt 0 ]; then
                record_check "PASS" "Recent backups found: $recent_backups"
            else
                record_check "WARN" "No recent backups (last 7 days)"
            fi
        else
            record_check "WARN" "No backup files found"
        fi
    else
        record_check "WARN" "Backup directory not found"
    fi
    
    # Check n8n backup
    if [ -d "n8n_backup" ]; then
        local n8n_backup_count=$(find n8n_backup -type f -name "*.json" 2>/dev/null | wc -l)
        if [ "$n8n_backup_count" -gt 0 ]; then
            record_check "PASS" "n8n workflow backups found: $n8n_backup_count"
        else
            record_check "WARN" "No n8n workflow backups found"
        fi
    fi
}

# GitHub Actions checks
check_github_actions() {
    log_header "GitHub Actions"
    
    if [ -d ".github/workflows" ]; then
        local workflow_count=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
        record_check "PASS" "Found $workflow_count GitHub Action workflows"
        
        # Check if workflows are valid YAML
        for workflow in .github/workflows/*.yml .github/workflows/*.yaml; do
            [ -f "$workflow" ] || continue
            if command -v yq &> /dev/null; then
                if yq eval . "$workflow" &> /dev/null; then
                    record_check "PASS" "Valid YAML: $(basename "$workflow")"
                else
                    record_check "FAIL" "Invalid YAML: $(basename "$workflow")"
                fi
            fi
        done
    else
        record_check "WARN" "No GitHub Actions workflows found"
    fi
}

# Generate summary report
generate_summary() {
    log_header "Health Check Summary"
    
    local total_checks=$((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNING))
    
    echo "=== HEALTH CHECK SUMMARY ===" | tee -a "$SUMMARY_LOG"
    echo "Date: $(date)" | tee -a "$SUMMARY_LOG"
    echo "Total Checks: $total_checks" | tee -a "$SUMMARY_LOG"
    echo "Passed: $CHECKS_PASSED" | tee -a "$SUMMARY_LOG"
    echo "Warnings: $CHECKS_WARNING" | tee -a "$SUMMARY_LOG"
    echo "Failed: $CHECKS_FAILED" | tee -a "$SUMMARY_LOG"
    
    local health_score=$((CHECKS_PASSED * 100 / total_checks))
    echo "Health Score: $health_score%" | tee -a "$SUMMARY_LOG"
    echo "=========================" | tee -a "$SUMMARY_LOG"
    
    if [ "$CHECKS_FAILED" -gt 0 ]; then
        log_error "Health check completed with $CHECKS_FAILED failures"
        exit 1
    elif [ "$CHECKS_WARNING" -gt 0 ]; then
        log_warn "Health check completed with $CHECKS_WARNING warnings"
        exit 2
    else
        log_info "All health checks passed! ✅"
        exit 0
    fi
}

# Main execution
main() {
    echo "🏥 Starting Comprehensive Health Check..." | tee "$HEALTH_LOG"
    echo "Health check started at: $(date)" >> "$HEALTH_LOG"
    echo "========================================" | tee -a "$HEALTH_LOG"
    
    check_system_resources
    check_docker
    check_network
    check_filesystem
    check_configuration
    check_security
    check_backups
    check_github_actions
    
    generate_summary
}

# Handle script interruption
trap 'log_error "Health check interrupted"; exit 130' INT TERM

# Run main function
main "$@"