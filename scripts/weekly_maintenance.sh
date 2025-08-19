#!/bin/bash

# 🗓️ Weekly Cleanup and Maintenance Script
# Automated weekly system maintenance

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_RETENTION_DAYS=30
LOG_RETENTION_DAYS=30
REPORT_DIR="reports"

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# Create reports directory
mkdir -p "$REPORT_DIR"

log "🗓️ Starting Weekly Maintenance..."
log "=================================="

# 1. System Updates (commented out for safety in automation)
log "📦 Checking for system updates..."
# Uncomment the following line if you want automatic updates
# sudo apt update && sudo apt list --upgradable

# 2. Docker Cleanup
log "🐳 Cleaning Docker system..."
docker system prune -f
docker volume prune -f
docker image prune -f

# Get disk space saved
info "Docker cleanup completed"

# 3. Backup Rotation
log "💾 Managing backup rotation..."
if [ -d "backups" ]; then
    # Clean old backups
    old_backups=$(find backups -type f -mtime +$BACKUP_RETENTION_DAYS 2>/dev/null | wc -l)
    find backups -type f -mtime +$BACKUP_RETENTION_DAYS -delete 2>/dev/null || true
    info "Removed $old_backups old backup files"
    
    # Count remaining backups
    remaining_backups=$(find backups -type f 2>/dev/null | wc -l)
    info "Remaining backup files: $remaining_backups"
fi

# 4. Log Cleanup
log "📋 Cleaning old logs..."
if [ -d "logs" ]; then
    old_logs=$(find logs -name "*.log" -mtime +$LOG_RETENTION_DAYS 2>/dev/null | wc -l)
    find logs -name "*.log" -mtime +$LOG_RETENTION_DAYS -delete 2>/dev/null || true
    info "Removed $old_logs old log files"
fi

# 5. n8n Backup
log "💾 Creating weekly n8n backup..."
if [ -f "scripts/backup_n8n.sh" ]; then
    ./scripts/backup_n8n.sh
else
    warn "n8n backup script not found"
fi

# 6. System Health Check
log "🏥 Running comprehensive health check..."
if [ -f "comprehensive_health_check.sh" ]; then
    ./comprehensive_health_check.sh > "$REPORT_DIR/weekly_health_$(date +%Y%m%d).log" 2>&1 || true
    info "Health check report saved"
else
    warn "Health check script not found"
fi

# 7. Performance Analysis
log "📊 Analyzing system performance..."

# Disk usage
echo "=== Weekly Performance Report $(date) ===" > "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
echo "" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"

echo "Disk Usage:" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
df -h >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
echo "" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"

echo "Memory Usage:" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
free -h >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
echo "" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"

# Docker container stats (if n8n is running)
if docker ps | grep -q "n8n-master"; then
    echo "n8n Container Stats:" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
    docker stats n8n-master --no-stream >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt" 2>/dev/null || true
    echo "" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
fi

# Directory sizes
echo "Directory Sizes:" >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"
du -sh */ 2>/dev/null | sort -hr >> "$REPORT_DIR/weekly_performance_$(date +%Y%m%d).txt"

info "Performance report saved"

# 8. Security Check
log "🔒 Running security checks..."

security_report="$REPORT_DIR/weekly_security_$(date +%Y%m%d).txt"
echo "=== Weekly Security Report $(date) ===" > "$security_report"
echo "" >> "$security_report"

# Check file permissions
echo "File Permissions Check:" >> "$security_report"
find . -type f -perm /o+w -exec ls -la {} \; 2>/dev/null | head -10 >> "$security_report"
echo "" >> "$security_report"

# Check for potential security issues
echo "Potential Security Issues:" >> "$security_report"
grep -r "password\|secret\|key" . --include="*.sh" --include="*.js" --include="*.py" 2>/dev/null | grep -v ".git" | head -5 >> "$security_report" || echo "No obvious security issues found" >> "$security_report"
echo "" >> "$security_report"

# Environment file check
if [ -f ".env" ]; then
    echo ".env File Security:" >> "$security_report"
    ls -la .env >> "$security_report"
    echo "Contains $(grep -c "=" .env) configuration variables" >> "$security_report"
fi

info "Security report saved"

# 9. GitHub Repository Status
log "📱 Checking GitHub status..."
if [ -d ".git" ]; then
    git_report="$REPORT_DIR/weekly_git_$(date +%Y%m%d).txt"
    echo "=== Weekly Git Report $(date) ===" > "$git_report"
    echo "" >> "$git_report"
    
    echo "Git Status:" >> "$git_report"
    git status --short >> "$git_report" 2>/dev/null || true
    echo "" >> "$git_report"
    
    echo "Recent Commits (last 7 days):" >> "$git_report"
    git log --oneline --since="7 days ago" >> "$git_report" 2>/dev/null || true
    echo "" >> "$git_report"
    
    echo "Branch Information:" >> "$git_report"
    git branch -v >> "$git_report" 2>/dev/null || true
    
    info "Git status report saved"
fi

# 10. Generate Summary
log "📋 Generating weekly summary..."

summary_file="$REPORT_DIR/weekly_summary_$(date +%Y%m%d).txt"
echo "=== Weekly Maintenance Summary $(date) ===" > "$summary_file"
echo "" >> "$summary_file"

echo "Tasks Completed:" >> "$summary_file"
echo "- Docker system cleanup" >> "$summary_file"
echo "- Backup rotation ($old_backups old backups removed)" >> "$summary_file"
echo "- Log cleanup ($old_logs old logs removed)" >> "$summary_file"
echo "- System health check" >> "$summary_file"
echo "- Performance analysis" >> "$summary_file"
echo "- Security audit" >> "$summary_file"
echo "- Git status review" >> "$summary_file"
echo "" >> "$summary_file"

echo "System Status:" >> "$summary_file"
echo "- Disk Usage: $(df -h / | awk 'NR==2 {print $5}')" >> "$summary_file"
echo "- Memory Usage: $(free | grep Mem | awk '{printf "%.0f%%", $3/$2 * 100.0}')" >> "$summary_file"
echo "- Docker Status: $(docker info > /dev/null 2>&1 && echo "Running" || echo "Not Running")" >> "$summary_file"
echo "- n8n Status: $(docker ps | grep -q "n8n-master" && echo "Running" || echo "Stopped")" >> "$summary_file"
echo "" >> "$summary_file"

echo "Reports Generated:" >> "$summary_file"
ls -la "$REPORT_DIR"/*_$(date +%Y%m%d).* 2>/dev/null >> "$summary_file" || echo "No reports found" >> "$summary_file"

info "Weekly summary saved: $summary_file"

# 11. Optional Notifications
if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    log "📱 Sending notification..."
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"Weekly maintenance completed successfully at '"$(date)"'. Check reports for details."}' \
        "$SLACK_WEBHOOK_URL" 2>/dev/null || warn "Failed to send Slack notification"
fi

log "=================================="
log "✅ Weekly maintenance completed!"
log "=================================="

info "Summary:"
info "- Old backups removed: $old_backups"
info "- Old logs removed: $old_logs"
info "- Reports generated in: $REPORT_DIR"
info "- Next maintenance: $(date -d '+7 days')"

# Show quick status
if [ -f "scripts/quick_status.sh" ]; then
    echo ""
    info "Current system status:"
    ./scripts/quick_status.sh
fi