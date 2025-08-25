#!/bin/bash

# n8n Backup and Recovery Script
# Usage: ./backup_restore.sh [backup|restore] [backup_file]

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="n8n_backup_$TIMESTAMP.tar.gz"

show_usage() {
    echo "Usage: $0 [backup|restore] [backup_file]"
    echo ""
    echo "Commands:"
    echo "  backup                    - Create a new backup"
    echo "  restore <backup_file>     - Restore from backup file"
    echo "  list                      - List available backups"
    echo ""
    echo "Examples:"
    echo "  $0 backup"
    echo "  $0 restore n8n_backup_20240125_143022.tar.gz"
    echo "  $0 list"
}

create_backup() {
    echo "🗄️  Creating n8n backup..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Stop services for consistent backup
    echo "⏸️  Stopping services..."
    docker-compose -f docker-compose.n8n.yml stop
    
    # Backup volumes
    echo "📦 Backing up data volumes..."
    docker run --rm \
        -v n8n_n8n_data:/data/n8n \
        -v n8n_postgres_data:/data/postgres \
        -v n8n_ollama_data:/data/ollama \
        -v $(pwd)/$BACKUP_DIR:/backup \
        ubuntu tar czf /backup/$BACKUP_FILE \
        -C /data .
    
    # Backup configuration files
    echo "📋 Backing up configuration..."
    cd "$BACKUP_DIR"
    tar -rf "${BACKUP_FILE%.tar.gz}.tar" -C .. \
        docker-compose.n8n.yml \
        .env 2>/dev/null || true
    gzip "${BACKUP_FILE%.tar.gz}.tar" -f
    
    # Restart services
    echo "▶️  Restarting services..."
    docker-compose -f docker-compose.n8n.yml up -d
    
    # Wait for services
    sleep 15
    
    echo "✅ Backup created: $BACKUP_DIR/$BACKUP_FILE"
    echo "📊 Backup size: $(du -h $BACKUP_DIR/$BACKUP_FILE | cut -f1)"
    
    # Cleanup old backups (keep last 5)
    cd "$BACKUP_DIR"
    ls -t n8n_backup_*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null || true
    
    echo "🧹 Old backups cleaned up (keeping last 5)"
}

restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        echo "❌ Please specify backup file to restore"
        show_usage
        return 1
    fi
    
    if [ ! -f "$BACKUP_DIR/$backup_file" ]; then
        echo "❌ Backup file not found: $BACKUP_DIR/$backup_file"
        return 1
    fi
    
    echo "🔄 Restoring from backup: $backup_file"
    echo "⚠️  This will overwrite current data. Continue? (y/N)"
    read -r confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "❌ Restore cancelled"
        return 1
    fi
    
    # Stop services
    echo "⏸️  Stopping services..."
    docker-compose -f docker-compose.n8n.yml down
    
    # Remove existing volumes
    echo "🗑️  Removing existing data..."
    docker volume rm n8n_n8n_data n8n_postgres_data n8n_ollama_data 2>/dev/null || true
    
    # Restore data
    echo "📦 Restoring data volumes..."
    docker run --rm \
        -v n8n_n8n_data:/data/n8n \
        -v n8n_postgres_data:/data/postgres \
        -v n8n_ollama_data:/data/ollama \
        -v $(pwd)/$BACKUP_DIR:/backup \
        ubuntu tar xzf /backup/$backup_file -C /data
    
    # Restore configuration (if available in backup)
    echo "📋 Restoring configuration..."
    cd "$BACKUP_DIR"
    tar -tf "$backup_file" | grep -E "(docker-compose|\.env)" && {
        tar -xzf "$backup_file" docker-compose.n8n.yml .env 2>/dev/null || true
        mv docker-compose.n8n.yml .env .. 2>/dev/null || true
    }
    cd ..
    
    # Start services
    echo "▶️  Starting services..."
    docker-compose -f docker-compose.n8n.yml up -d
    
    # Wait for services
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Health check
    if curl -s -f http://localhost:5678/healthz >/dev/null 2>&1; then
        echo "✅ Restore completed successfully!"
        echo "📊 n8n is accessible at: http://localhost:5678"
    else
        echo "⚠️  Restore completed but n8n may need more time to start"
        echo "🔍 Check status: ./scripts/health_check.sh"
    fi
}

list_backups() {
    echo "📋 Available backups:"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        echo "No backups found"
        return 0
    fi
    
    cd "$BACKUP_DIR"
    ls -la n8n_backup_*.tar.gz 2>/dev/null | while read -r line; do
        file=$(echo "$line" | awk '{print $9}')
        size=$(echo "$line" | awk '{print $5}')
        date=$(echo "$line" | awk '{print $6, $7, $8}')
        echo "📦 $file - $size bytes - $date"
    done
}

# Main script
case "$1" in
    "backup")
        create_backup
        ;;
    "restore")
        restore_backup "$2"
        ;;
    "list")
        list_backups
        ;;
    *)
        show_usage
        exit 1
        ;;
esac