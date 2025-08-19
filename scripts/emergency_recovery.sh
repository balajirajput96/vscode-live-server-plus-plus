#!/bin/bash

# 🚨 Emergency Recovery Script
# System recovery procedures for critical failures

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
LOG_FILE="logs/emergency_recovery_$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="backups/emergency_$(date +%Y%m%d_%H%M%S)"

# Create necessary directories
mkdir -p logs backups

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

header() {
    echo -e "${PURPLE}========== $1 ==========${NC}" | tee -a "$LOG_FILE"
}

# Emergency backup function
emergency_backup() {
    header "Creating Emergency Backup"
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical files
    local critical_files=(".env" "docker-compose.yml" "package.json" "README.md")
    
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$BACKUP_DIR/"
            log "Backed up: $file"
        fi
    done
    
    # Backup n8n data if container exists
    if docker ps -a | grep -q "n8n-master"; then
        log "Backing up n8n data..."
        docker exec n8n-master sh -c 'tar czf /tmp/n8n_emergency_backup.tar.gz /home/node/.n8n' || true
        docker cp n8n-master:/tmp/n8n_emergency_backup.tar.gz "$BACKUP_DIR/" || true
    fi
    
    # Backup custom scripts
    if [ -d "scripts" ]; then
        cp -r scripts "$BACKUP_DIR/"
        log "Backed up scripts directory"
    fi
    
    log "Emergency backup completed in: $BACKUP_DIR"
}

# Docker recovery
recover_docker() {
    header "Docker Recovery"
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        error "Docker is not running!"
        info "Attempting to start Docker..."
        
        # Try different methods to start Docker
        if command -v systemctl &> /dev/null; then
            sudo systemctl start docker || warn "Failed to start Docker via systemctl"
        elif command -v service &> /dev/null; then
            sudo service docker start || warn "Failed to start Docker via service"
        fi
        
        # Wait a moment and check again
        sleep 5
        if docker info &> /dev/null; then
            log "Docker started successfully"
        else
            error "Could not start Docker. Manual intervention required."
            return 1
        fi
    fi
    
    # Stop all containers
    log "Stopping all containers..."
    docker stop $(docker ps -aq) 2>/dev/null || true
    
    # Remove problematic containers
    log "Removing stopped containers..."
    docker container prune -f
    
    # Clean up Docker system
    log "Cleaning Docker system..."
    docker system prune -f
    
    # Restart n8n container
    if [ -f "docker-compose.yml" ]; then
        log "Restarting n8n with docker-compose..."
        docker-compose down || true
        sleep 3
        docker-compose up -d
        
        # Wait for container to be ready
        log "Waiting for n8n to be ready..."
        for i in {1..30}; do
            if curl -f -s http://localhost:5678/healthz &> /dev/null; then
                log "n8n is responding"
                break
            fi
            sleep 2
            echo -n "."
        done
    fi
}

# File system recovery
recover_filesystem() {
    header "File System Recovery"
    
    # Check and create missing directories
    local required_dirs=("scripts" "logs" "backups" "config" "n8n_backup")
    
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log "Created missing directory: $dir"
        fi
    done
    
    # Fix script permissions
    local scripts=("super_start.sh" "comprehensive_health_check.sh" "scripts/emergency_recovery.sh")
    
    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            chmod +x "$script"
            log "Fixed permissions for: $script"
        fi
    done
    
    # Restore .env if missing
    if [ ! -f ".env" ] && [ -f ".env.template" ]; then
        cp .env.template .env
        warn ".env file was missing. Restored from template. Please configure!"
    fi
}

# Network recovery
recover_network() {
    header "Network Recovery"
    
    # Check internet connectivity
    if ! ping -c 1 8.8.8.8 &> /dev/null; then
        warn "No internet connectivity detected"
        
        # Try to restart networking
        if command -v systemctl &> /dev/null; then
            sudo systemctl restart networking || true
        fi
        
        # Wait and check again
        sleep 5
        if ping -c 1 8.8.8.8 &> /dev/null; then
            log "Network connectivity restored"
        else
            error "Network connectivity issue persists"
        fi
    else
        log "Network connectivity is working"
    fi
    
    # Check VPN status if available
    if command -v tailscale &> /dev/null; then
        local ts_status=$(tailscale status 2>/dev/null | head -1 | awk '{print $2}' || echo "unknown")
        if [ "$ts_status" != "logged" ]; then
            warn "Tailscale VPN not connected"
            info "Attempting to reconnect Tailscale..."
            sudo tailscale down
            sleep 2
            sudo tailscale up --ssh --accept-routes || warn "Tailscale reconnection failed"
        fi
    fi
}

# Configuration recovery
recover_configuration() {
    header "Configuration Recovery"
    
    # Validate .env file
    if [ -f ".env" ]; then
        log "Validating .env configuration..."
        
        # Check for critical missing values
        local critical_vars=("N8N_ENCRYPTION_KEY" "WEBHOOK_URL")
        local missing_vars=()
        
        for var in "${critical_vars[@]}"; do
            if ! grep -q "^${var}=" .env || grep -q "^${var}=$" .env; then
                missing_vars+=("$var")
            fi
        done
        
        if [ ${#missing_vars[@]} -ne 0 ]; then
            warn "Critical environment variables missing: ${missing_vars[*]}"
            
            # Generate missing encryption key
            if [[ " ${missing_vars[*]} " =~ " N8N_ENCRYPTION_KEY " ]]; then
                local new_key=$(openssl rand -base64 32)
                sed -i "s/^N8N_ENCRYPTION_KEY=$/N8N_ENCRYPTION_KEY=$new_key/" .env
                log "Generated new N8N_ENCRYPTION_KEY"
            fi
        fi
    fi
    
    # Recreate docker-compose.yml if missing
    if [ ! -f "docker-compose.yml" ]; then
        warn "docker-compose.yml missing. Creating basic version..."
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n-master:
    image: n8nio/n8n:latest
    container_name: n8n-master
    restart: unless-stopped
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - WEBHOOK_URL=${WEBHOOK_URL}
      - N8N_SECURE_COOKIE=${N8N_SECURE_COOKIE:-false}
      - N8N_TRUST_PROXY=${N8N_TRUST_PROXY:-true}
      - DB_TYPE=${DB_TYPE:-sqlite}
      - DB_SQLITE_DATABASE=${DB_SQLITE_DATABASE:-n8n.sqlite}
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n_backup:/backups
    command: n8n start

volumes:
  n8n_data:
    external: false
EOF
        log "Created basic docker-compose.yml"
    fi
}

# Service recovery
recover_services() {
    header "Service Recovery"
    
    # GitHub Actions check
    if [ -d ".git" ]; then
        log "Checking Git repository status..."
        
        # Check for uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            warn "Uncommitted changes detected"
            
            # Stash changes for safety
            git stash push -m "Emergency recovery stash $(date)"
            log "Changes stashed for safety"
        fi
        
        # Check remote connectivity
        if git ls-remote origin &> /dev/null; then
            log "Git remote connectivity working"
        else
            warn "Cannot reach Git remote"
        fi
    fi
}

# System cleanup
cleanup_system() {
    header "System Cleanup"
    
    # Clean temporary files
    log "Cleaning temporary files..."
    rm -rf /tmp/n8n_* /tmp/docker_* 2>/dev/null || true
    
    # Clean old log files (keep last 30 days)
    find logs -name "*.log" -mtime +30 -delete 2>/dev/null || true
    log "Cleaned old log files"
    
    # Clean old backups (keep last 7 emergency backups)
    if [ -d "backups" ]; then
        local backup_count=$(find backups -maxdepth 1 -name "emergency_*" -type d | wc -l)
        if [ "$backup_count" -gt 7 ]; then
            find backups -maxdepth 1 -name "emergency_*" -type d | sort | head -n $((backup_count - 7)) | xargs rm -rf
            log "Cleaned old emergency backups"
        fi
    fi
}

# Verify recovery
verify_recovery() {
    header "Verifying Recovery"
    
    local errors=0
    
    # Check Docker
    if docker info &> /dev/null; then
        log "✅ Docker is running"
    else
        error "❌ Docker is not running"
        errors=$((errors + 1))
    fi
    
    # Check n8n
    if docker ps | grep -q "n8n-master"; then
        log "✅ n8n container is running"
        
        # Check n8n health
        if curl -f -s http://localhost:5678/healthz &> /dev/null; then
            log "✅ n8n is responding"
        else
            warn "⚠️ n8n container running but not responding"
        fi
    else
        error "❌ n8n container not running"
        errors=$((errors + 1))
    fi
    
    # Check files
    local critical_files=(".env" "docker-compose.yml")
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            log "✅ $file exists"
        else
            error "❌ $file missing"
            errors=$((errors + 1))
        fi
    done
    
    return $errors
}

# Main recovery function
main() {
    header "🚨 Emergency Recovery Started"
    log "Recovery started at: $(date)"
    log "Log file: $LOG_FILE"
    
    # Create emergency backup first
    emergency_backup
    
    # Run recovery procedures
    recover_filesystem
    recover_configuration
    recover_docker
    recover_network
    recover_services
    cleanup_system
    
    # Verify everything is working
    if verify_recovery; then
        header "✅ Emergency Recovery Completed Successfully"
        log "All systems recovered successfully!"
        
        info "Next steps:"
        info "1. Check your .env configuration"
        info "2. Verify n8n workflows at http://localhost:5678"
        info "3. Run comprehensive health check: ./comprehensive_health_check.sh"
        
        exit 0
    else
        header "⚠️ Emergency Recovery Completed with Issues"
        error "Some systems could not be fully recovered"
        
        info "Manual intervention may be required:"
        info "1. Check the log file: $LOG_FILE"
        info "2. Review Docker status: docker ps"
        info "3. Check n8n logs: docker logs n8n-master"
        
        exit 1
    fi
}

# Show usage if requested
show_usage() {
    echo "🚨 Emergency Recovery Script"
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h        Show this help message"
    echo "  --backup-only     Only create emergency backup"
    echo "  --docker-only     Only recover Docker services"
    echo "  --network-only    Only recover network connectivity"
    echo "  --verify-only     Only verify system status"
    echo ""
    echo "This script will:"
    echo "1. Create emergency backup"
    echo "2. Recover Docker services"
    echo "3. Fix file system issues"
    echo "4. Restore network connectivity"
    echo "5. Verify all systems"
    echo ""
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        show_usage
        exit 0
        ;;
    --backup-only)
        emergency_backup
        exit 0
        ;;
    --docker-only)
        recover_docker
        exit 0
        ;;
    --network-only)
        recover_network
        exit 0
        ;;
    --verify-only)
        verify_recovery
        exit $?
        ;;
    "")
        # Run full recovery
        main "$@"
        ;;
    *)
        error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac