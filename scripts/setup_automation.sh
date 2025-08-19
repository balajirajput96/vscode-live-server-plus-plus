#!/bin/bash

# 🔄 Automation Setup Script
# Sets up automated tasks and cron jobs

set -e

echo "🔄 Setting up automation tasks"
echo "=============================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✅ SUCCESS]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ️  INFO]${NC} $1"
}

# Create cron jobs for automation
print_info "Setting up automated tasks..."

# Create cron script for health checks
cat > scripts/cron_health_check.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/.."
./comprehensive_health_check.sh >> health_check.log 2>&1
EOF

# Create cron script for backups
cat > scripts/cron_backup.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/.."
./scripts/backup_system.sh >> backup.log 2>&1
EOF

# Make cron scripts executable
chmod +x scripts/cron_health_check.sh
chmod +x scripts/cron_backup.sh

# Add cron jobs
print_info "Adding cron jobs..."

# Create temporary cron file
crontab -l > mycron 2>/dev/null || echo "" > mycron

# Health check every 30 minutes
echo "*/30 * * * * $(pwd)/scripts/cron_health_check.sh" >> mycron

# Backup daily at 2 AM
echo "0 2 * * * $(pwd)/scripts/cron_backup.sh" >> mycron

# Install new cron file
crontab mycron
rm mycron

print_status "Automated tasks configured"
print_info "Tasks scheduled:"
print_info "  - Health check: Every 30 minutes"
print_info "  - System backup: Daily at 2 AM"