#!/bin/bash

# 💾 Automated Backup Script for n8n System
# This script creates backups of your workflows, database, and configuration

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
BACKUP_DIR="backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="n8n_backup_$DATE"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Create backup directory
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

log "🚀 Starting backup process..."

# Backup database
log "📊 Backing up PostgreSQL database..."
docker compose exec postgres pg_dump -U n8n n8n > "$BACKUP_DIR/$BACKUP_NAME/database.sql"

# Backup n8n data directory
log "📁 Backing up n8n data..."
docker compose exec n8n tar -czf /backup/n8n_data_$DATE.tar.gz -C /home/node/.n8n .
docker cp $(docker compose ps -q n8n):/backup/n8n_data_$DATE.tar.gz "$BACKUP_DIR/$BACKUP_NAME/"

# Backup configuration files
log "⚙️ Backing up configuration files..."
cp .env "$BACKUP_DIR/$BACKUP_NAME/.env.backup" 2>/dev/null || warning "No .env file found"
cp docker-compose*.yml "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null
cp Caddyfile "$BACKUP_DIR/$BACKUP_NAME/" 2>/dev/null || true

# Create backup info
cat > "$BACKUP_DIR/$BACKUP_NAME/backup_info.txt" << EOF
Backup created: $(date)
System: n8n Automation System
Backup type: Full system backup
Files included:
- database.sql (PostgreSQL dump)
- n8n_data_$DATE.tar.gz (n8n user data)
- .env.backup (environment configuration)
- docker-compose*.yml (Docker configuration)
- Caddyfile (Caddy configuration)

To restore:
1. Stop current system: docker compose down
2. Restore database: docker compose exec postgres psql -U n8n n8n < database.sql
3. Restore n8n data: docker cp n8n_data_$DATE.tar.gz container:/backup/
4. Extract data: docker compose exec n8n tar -xzf /backup/n8n_data_$DATE.tar.gz -C /home/node/.n8n
5. Restart system: docker compose up -d
EOF

# Compress entire backup
log "🗜️ Compressing backup..."
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"
cd ..

# Cleanup old backups (keep last 30 days)
log "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "n8n_backup_*.tar.gz" -mtime +30 -delete 2>/dev/null || true

# Calculate backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)

log "✅ Backup completed successfully!"
log "📦 Backup file: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
log "📏 Backup size: $BACKUP_SIZE"

# Send notification (if configured)
source .env 2>/dev/null || true
if [ ! -z "$ALERT_EMAIL" ]; then
    echo "n8n backup completed successfully at $(date). Backup size: $BACKUP_SIZE" | \
    mail -s "n8n Backup Success" "$ALERT_EMAIL" 2>/dev/null || warning "Failed to send email notification"
fi