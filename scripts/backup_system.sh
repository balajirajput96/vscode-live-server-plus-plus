#!/bin/bash

# 💾 System Backup Script
# Creates backups of important data and configurations

set -e

echo "💾 Creating System Backup"
echo "========================="

# Load environment variables
if [ -f ".env" ]; then
    source .env
fi

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

# Configuration
BACKUP_DIR=${BACKUP_LOCATION:-./backups}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="automation_system_backup_$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

# Create backup directory
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_PATH"

print_info "Creating backup at: $BACKUP_PATH"

# 1. Backup configuration files
print_info "Backing up configuration files..."
cp .env "$BACKUP_PATH/" 2>/dev/null || echo "# .env file not found" > "$BACKUP_PATH/.env"
cp .env.template "$BACKUP_PATH/" 2>/dev/null || print_info ".env.template not found"
cp docker-compose*.yml "$BACKUP_PATH/" 2>/dev/null || print_info "No docker-compose files found"
cp Caddyfile "$BACKUP_PATH/" 2>/dev/null || print_info "Caddyfile not found"
print_status "Configuration files backed up"

# 2. Backup scripts
print_info "Backing up scripts..."
cp -r scripts "$BACKUP_PATH/" 2>/dev/null || print_info "Scripts directory not found"
cp *.sh "$BACKUP_PATH/" 2>/dev/null || print_info "No shell scripts found"
print_status "Scripts backed up"

# 3. Backup career automation data
print_info "Backing up career automation data..."
mkdir -p "$BACKUP_PATH/career-data"
cp -r career-automation-system "$BACKUP_PATH/career-data/" 2>/dev/null || print_info "Career automation system not found"
cp -r portfolio-automation-system "$BACKUP_PATH/career-data/" 2>/dev/null || print_info "Portfolio automation system not found"
cp *.html "$BACKUP_PATH/career-data/" 2>/dev/null || print_info "No HTML files found"
cp *.md "$BACKUP_PATH/career-data/" 2>/dev/null || print_info "No markdown files found"
print_status "Career automation data backed up"

# 4. Backup n8n data (if available)
print_info "Backing up n8n data..."
mkdir -p "$BACKUP_PATH/n8n-data"

# Backup n8n workflows and credentials
if [ -d "workflows" ]; then
    cp -r workflows "$BACKUP_PATH/n8n-data/"
    print_status "n8n workflows backed up"
fi

if [ -d "credentials" ]; then
    cp -r credentials "$BACKUP_PATH/n8n-data/"
    print_status "n8n credentials backed up"
fi

# Backup n8n database (if Docker volume exists)
if command -v docker &> /dev/null; then
    if docker volume ls | grep -q n8n_data; then
        docker run --rm -v n8n_data:/data -v "$PWD/$BACKUP_PATH/n8n-data":/backup alpine sh -c "cp -r /data/* /backup/" 2>/dev/null || print_info "Could not backup n8n database"
        print_status "n8n database backed up"
    fi
fi

# 5. Backup logs
print_info "Backing up logs..."
mkdir -p "$BACKUP_PATH/logs"
cp *.log "$BACKUP_PATH/logs/" 2>/dev/null || print_info "No log files found"
print_status "Logs backed up"

# 6. Create backup metadata
cat > "$BACKUP_PATH/backup_info.txt" << EOF
Automation System Backup
========================

Backup Created: $(date)
Backup Location: $BACKUP_PATH
System: $(uname -a)
User: $(whoami)

Contents:
- Configuration files (.env, docker-compose.yml, etc.)
- Scripts and automation tools
- Career automation data
- n8n workflows and data
- System logs

To restore:
1. Extract backup to desired location
2. Copy .env file and configure as needed
3. Run ./super_start.sh to start system
4. Import n8n workflows if needed

EOF

print_status "Backup metadata created"

# 7. Create compressed archive
print_info "Creating compressed archive..."
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"
print_status "Compressed backup created: ${BACKUP_NAME}.tar.gz"

# 8. Cloud backup (if configured)
if [ -n "$AWS_S3_BUCKET" ] && [ -n "$AWS_ACCESS_KEY_ID" ]; then
    print_info "Uploading to AWS S3..."
    if command -v aws &> /dev/null; then
        aws s3 cp "${BACKUP_NAME}.tar.gz" "s3://$AWS_S3_BUCKET/backups/"
        print_status "Backup uploaded to S3"
    else
        print_info "AWS CLI not found, skipping S3 upload"
    fi
fi

# 9. Cleanup old backups (keep last 7 days)
print_info "Cleaning up old backups..."
find "$BACKUP_DIR" -name "automation_system_backup_*.tar.gz" -mtime +7 -delete 2>/dev/null || print_info "No old backups to clean"
print_status "Old backups cleaned up"

echo ""
print_status "🎉 Backup completed successfully!"
print_info "Backup file: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
print_info "Backup size: $(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)"

echo ""
print_info "To restore this backup:"
print_info "1. Extract: tar -xzf ${BACKUP_NAME}.tar.gz"
print_info "2. Copy files to desired location"
print_info "3. Configure .env file"
print_info "4. Run ./super_start.sh"