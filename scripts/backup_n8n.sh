#!/bin/bash

# 💾 n8n Backup Script
# Automated backup of n8n workflows and data

set -e

# Configuration
BACKUP_DIR="n8n_backup"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

log "Starting n8n backup process..."

# Check if n8n container is running
if ! docker ps | grep -q "n8n-master"; then
    warn "n8n container is not running. Starting it first..."
    docker-compose up -d n8n-master
    sleep 10
fi

# Export workflows
log "Exporting workflows..."
if docker exec n8n-master n8n export:workflow --backup --output="/backups/workflows_$DATE.json" 2>/dev/null; then
    info "Workflows exported successfully"
else
    warn "Workflow export failed or no workflows found"
fi

# Export credentials (encrypted)
log "Exporting credentials..."
if docker exec n8n-master n8n export:credentials --backup --output="/backups/credentials_$DATE.json" 2>/dev/null; then
    info "Credentials exported successfully"
else
    warn "Credentials export failed or no credentials found"
fi

# Backup database
log "Backing up database..."
if docker exec n8n-master cp /home/node/.n8n/database.sqlite "/backups/database_$DATE.sqlite" 2>/dev/null; then
    info "Database backed up successfully"
else
    warn "Database backup failed"
fi

# Create compressed archive
log "Creating compressed backup archive..."
if [ -f "$BACKUP_DIR/workflows_$DATE.json" ] || [ -f "$BACKUP_DIR/database_$DATE.sqlite" ]; then
    tar -czf "$BACKUP_DIR/n8n_backup_$DATE.tar.gz" -C "$BACKUP_DIR" \
        $(ls "$BACKUP_DIR" | grep "$DATE" | tr '\n' ' ') 2>/dev/null || true
    
    # Clean up individual files
    rm -f "$BACKUP_DIR"/*_"$DATE".json "$BACKUP_DIR"/*_"$DATE".sqlite 2>/dev/null || true
    
    info "Backup archive created: n8n_backup_$DATE.tar.gz"
else
    warn "No backup files to archive"
fi

# Clean old backups
log "Cleaning old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "n8n_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# Backup summary
backup_count=$(ls -1 "$BACKUP_DIR"/n8n_backup_*.tar.gz 2>/dev/null | wc -l)
latest_backup=$(ls -t "$BACKUP_DIR"/n8n_backup_*.tar.gz 2>/dev/null | head -1)

log "Backup completed successfully!"
info "Total backups: $backup_count"
info "Latest backup: $(basename "$latest_backup" 2>/dev/null || echo "None")"
info "Backup directory: $BACKUP_DIR"

# Optional: Send notification (if configured)
if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"n8n backup completed successfully at '"$(date)"'"}' \
        "$SLACK_WEBHOOK_URL" 2>/dev/null || true
fi