#!/bin/bash

# 🔄 n8n Backup Script
# बालाजी के n8n system का complete backup

set -e

# Configuration
BACKUP_DIR="/home/node/.n8n/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="n8n_backup_${DATE}"
RETENTION_DAYS=30

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[BACKUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
create_backup_dir() {
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"
    print_status "Backup directory created: ${BACKUP_DIR}/${BACKUP_NAME}"
}

# Backup n8n data
backup_n8n_data() {
    print_status "n8n data backup कर रहे हैं..."
    
    # Stop n8n temporarily for consistent backup
    docker-compose pause n8n
    
    # Backup n8n data directory
    if [ -d "/home/node/.n8n" ]; then
        tar -czf "${BACKUP_DIR}/${BACKUP_NAME}/n8n_data.tar.gz" \
            -C /home/node/.n8n \
            --exclude=logs \
            --exclude=temp \
            --exclude=cache \
            .
        print_status "✅ n8n data backed up"
    else
        print_warning "n8n data directory not found"
    fi
    
    # Resume n8n
    docker-compose unpause n8n
}

# Backup database
backup_database() {
    print_status "Database backup कर रहे हैं..."
    
    # Get database credentials from environment
    DB_NAME=${DB_POSTGRESDB_DATABASE:-n8n}
    DB_USER=${DB_POSTGRESDB_USER:-n8n_user}
    DB_PASSWORD=${DB_POSTGRESDB_PASSWORD:-secure_db_password}
    
    # Backup PostgreSQL if it's running
    if docker-compose ps postgres | grep -q "Up"; then
        docker exec n8n-postgres-prod pg_dump \
            -U "${DB_USER}" \
            -d "${DB_NAME}" \
            --clean \
            --create \
            --verbose \
            > "${BACKUP_DIR}/${BACKUP_NAME}/database.sql"
        print_status "✅ Database backed up"
    else
        print_warning "PostgreSQL container not running, skipping database backup"
    fi
}

# Backup workflows
backup_workflows() {
    print_status "Workflows backup कर रहे हैं..."
    
    # Export workflows via n8n API
    if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
        curl -s -X GET \
            -H "Authorization: Basic $(echo -n ${N8N_USER}:${N8N_PASSWORD} | base64)" \
            "http://localhost:5678/api/v1/workflows" \
            > "${BACKUP_DIR}/${BACKUP_NAME}/workflows.json"
        print_status "✅ Workflows exported"
    else
        print_warning "n8n API not accessible, copying workflow files"
        cp -r workflows/ "${BACKUP_DIR}/${BACKUP_NAME}/" 2>/dev/null || true
    fi
}

# Backup configurations
backup_configurations() {
    print_status "Configurations backup कर रहे हैं..."
    
    # Backup environment file (without sensitive data)
    if [ -f ".env" ]; then
        grep -v -E "(PASSWORD|SECRET|KEY|TOKEN)" .env > "${BACKUP_DIR}/${BACKUP_NAME}/env_template.txt"
        print_status "✅ Environment template backed up"
    fi
    
    # Backup docker-compose files
    cp docker-compose*.yml "${BACKUP_DIR}/${BACKUP_NAME}/" 2>/dev/null || true
    
    # Backup configuration files
    cp -r configs/ "${BACKUP_DIR}/${BACKUP_NAME}/" 2>/dev/null || true
    
    print_status "✅ Configurations backed up"
}

# Backup AI models
backup_ai_models() {
    print_status "AI models backup कर रहे हैं..."
    
    # Backup Ollama models
    if docker-compose ps ollama | grep -q "Up"; then
        docker exec ollama-ai-prod ollama list > "${BACKUP_DIR}/${BACKUP_NAME}/ai_models_list.txt"
        print_status "✅ AI models list backed up"
    else
        print_warning "Ollama container not running"
    fi
}

# Create backup metadata
create_metadata() {
    print_status "Backup metadata create कर रहे हैं..."
    
    cat > "${BACKUP_DIR}/${BACKUP_NAME}/backup_info.txt" << EOF
n8n Backup Information
=====================

Backup Date: $(date)
Backup Name: ${BACKUP_NAME}
System Info: $(uname -a)
Docker Version: $(docker --version)
n8n Version: $(docker exec n8n-automation n8n --version 2>/dev/null || echo "Unknown")

Contents:
- n8n data directory
- Database dump
- Workflows export
- Configuration files
- AI models list

Restore Instructions:
1. Stop n8n services: docker-compose down
2. Extract n8n_data.tar.gz to /home/node/.n8n/
3. Restore database: docker exec -i postgres psql -U user -d db < database.sql
4. Import workflows via n8n UI or API
5. Update configurations as needed
6. Start services: docker-compose up -d

Notes:
- Sensitive credentials not included in backup
- Update .env file with actual values after restore
- Verify all services are working after restore
EOF

    print_status "✅ Metadata created"
}

# Compress backup
compress_backup() {
    print_status "Backup compress कर रहे हैं..."
    
    cd "${BACKUP_DIR}"
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}/"
    rm -rf "${BACKUP_NAME}/"
    
    # Calculate backup size
    backup_size=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
    print_status "✅ Backup compressed: ${backup_size}"
}

# Clean old backups
cleanup_old_backups() {
    print_status "Old backups cleanup कर रहे हैं..."
    
    # Delete backups older than retention period
    find "${BACKUP_DIR}" -name "n8n_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    
    # Count remaining backups
    backup_count=$(find "${BACKUP_DIR}" -name "n8n_backup_*.tar.gz" | wc -l)
    print_status "✅ Cleanup complete. ${backup_count} backups retained"
}

# Send backup notification
send_notification() {
    print_status "Backup notification भेज रहे हैं..."
    
    # Get backup file size
    backup_file="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    if [ -f "$backup_file" ]; then
        backup_size=$(du -h "$backup_file" | cut -f1)
        
        # Send email notification (if configured)
        if command -v mail &> /dev/null; then
            echo "n8n Backup completed successfully!

Backup Details:
- Date: $(date)
- File: ${BACKUP_NAME}.tar.gz
- Size: ${backup_size}
- Location: ${BACKUP_DIR}

System Status:
- All services backed up
- Database exported
- Workflows saved
- Configurations preserved

Next scheduled backup: $(date -d '+1 day')

This is an automated message from your n8n backup system." | \
            mail -s "✅ n8n Backup Complete - $(date +%Y-%m-%d)" \
                 -r "22034563001@paruluniversity.ac.in" \
                 "balaji.web.design1@gmail.com"
            
            print_status "✅ Email notification sent"
        else
            print_warning "Mail command not available, skipping email notification"
        fi
    else
        print_error "Backup file not found!"
        exit 1
    fi
}

# Main backup function
perform_backup() {
    print_status "🔄 n8n Backup शुरू कर रहे हैं..."
    print_status "Backup name: ${BACKUP_NAME}"
    
    create_backup_dir
    backup_n8n_data
    backup_database
    backup_workflows
    backup_configurations
    backup_ai_models
    create_metadata
    compress_backup
    cleanup_old_backups
    send_notification
    
    print_status "🎉 Backup completed successfully!"
    print_status "Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
}

# Restore function
perform_restore() {
    local restore_file="$1"
    
    if [ -z "$restore_file" ]; then
        print_error "Please specify backup file to restore"
        echo "Usage: $0 restore <backup_file.tar.gz>"
        exit 1
    fi
    
    if [ ! -f "$restore_file" ]; then
        print_error "Backup file not found: $restore_file"
        exit 1
    fi
    
    print_status "🔄 Restore शुरू कर रहे हैं..."
    print_warning "यह existing data को replace कर देगा!"
    
    read -p "Continue with restore? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Restore cancelled"
        exit 0
    fi
    
    # Stop services
    docker-compose down
    
    # Extract backup
    restore_dir="/tmp/n8n_restore_$(date +%s)"
    mkdir -p "$restore_dir"
    tar -xzf "$restore_file" -C "$restore_dir"
    
    # Find the backup directory inside
    backup_content_dir=$(find "$restore_dir" -type d -name "n8n_backup_*" | head -1)
    
    if [ -z "$backup_content_dir" ]; then
        print_error "Invalid backup file format"
        rm -rf "$restore_dir"
        exit 1
    fi
    
    # Restore n8n data
    if [ -f "$backup_content_dir/n8n_data.tar.gz" ]; then
        print_status "n8n data restore कर रहे हैं..."
        rm -rf /home/node/.n8n/*
        tar -xzf "$backup_content_dir/n8n_data.tar.gz" -C /home/node/.n8n/
        print_status "✅ n8n data restored"
    fi
    
    # Restore configurations
    if [ -d "$backup_content_dir/configs" ]; then
        cp -r "$backup_content_dir/configs/"* configs/ 2>/dev/null || true
        print_status "✅ Configurations restored"
    fi
    
    # Start services
    docker-compose up -d
    
    # Wait for services to start
    sleep 30
    
    # Restore database
    if [ -f "$backup_content_dir/database.sql" ]; then
        print_status "Database restore कर रहे हैं..."
        docker exec -i n8n-postgres-prod psql -U "${DB_USER}" -d "${DB_NAME}" < "$backup_content_dir/database.sql"
        print_status "✅ Database restored"
    fi
    
    # Cleanup
    rm -rf "$restore_dir"
    
    print_status "🎉 Restore completed successfully!"
    print_status "Please verify all services are working properly"
}

# List available backups
list_backups() {
    print_status "Available backups:"
    
    if [ -d "$BACKUP_DIR" ]; then
        ls -lh "$BACKUP_DIR"/n8n_backup_*.tar.gz 2>/dev/null | while read line; do
            echo "  $line"
        done
    else
        print_warning "No backups found in $BACKUP_DIR"
    fi
}

# Main script logic
case "${1:-backup}" in
    "backup")
        perform_backup
        ;;
    "restore")
        perform_restore "$2"
        ;;
    "list")
        list_backups
        ;;
    *)
        echo "Usage: $0 {backup|restore|list}"
        echo ""
        echo "Commands:"
        echo "  backup           - Create complete system backup"
        echo "  restore <file>   - Restore from backup file"
        echo "  list             - List available backups"
        echo ""
        echo "Examples:"
        echo "  $0 backup"
        echo "  $0 restore /path/to/n8n_backup_20240115_120000.tar.gz"
        echo "  $0 list"
        exit 1
        ;;
esac