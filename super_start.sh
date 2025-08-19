#!/bin/bash

# 🚀 Super Start Script - Master Setup for Automation System
# GitHub Setup के बाद complete system initialization

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        warn "Running as root. Some operations may require non-root user."
    fi
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check for required commands
    local required_commands=("git" "docker" "node" "npm" "curl")
    local missing_commands=()
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_commands+=("$cmd")
        fi
    done
    
    if [ ${#missing_commands[@]} -ne 0 ]; then
        error "Missing required commands: ${missing_commands[*]}"
        info "Please install missing dependencies before continuing."
        exit 1
    fi
    
    log "All required commands found ✓"
}

# Create directory structure
create_directories() {
    log "Creating directory structure..."
    
    local directories=(
        "scripts"
        "logs"
        "backups"
        "n8n_backup"
        "config"
        "docs"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            info "Created directory: $dir"
        fi
    done
}

# Setup environment file
setup_environment() {
    log "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.template" ]; then
            cp .env.template .env
            info "Created .env from template"
            warn "Please edit .env file with your actual values before proceeding"
        else
            info "Creating basic .env template"
            cat > .env << EOF
# n8n Configuration
N8N_ENCRYPTION_KEY=
WEBHOOK_URL=
N8N_SECURE_COOKIE=false

# Domain Configuration
DOMAIN=localhost
EMAIL=your-email@example.com

# Database Configuration
DB_TYPE=sqlite
DB_SQLITE_DATABASE=n8n.sqlite

# Security
N8N_TRUST_PROXY=true

# Paths
N8N_USER_FOLDER=/home/n8n/.n8n
EOF
            warn "Please edit .env file with your actual configuration"
        fi
    else
        info ".env file already exists"
    fi
}

# Setup Docker for n8n
setup_docker() {
    log "Setting up Docker environment..."
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Create docker-compose.yml if it doesn't exist
    if [ ! -f "docker-compose.yml" ]; then
        info "Creating docker-compose.yml for n8n"
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
      - N8N_SECURE_COOKIE=${N8N_SECURE_COOKIE}
      - N8N_TRUST_PROXY=${N8N_TRUST_PROXY}
      - DB_TYPE=${DB_TYPE}
      - DB_SQLITE_DATABASE=${DB_SQLITE_DATABASE}
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
      - ./backups:/backups
    command: n8n start

volumes:
  n8n_data:
    external: false
EOF
    fi
}

# Setup GitHub Actions (if in a git repository)
setup_github_actions() {
    if [ -d ".git" ]; then
        log "Setting up GitHub Actions..."
        
        mkdir -p .github/workflows
        
        if [ ! -f ".github/workflows/health-check.yml" ]; then
            cat > .github/workflows/health-check.yml << 'EOF'
name: System Health Check

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Health Check
        run: |
          chmod +x comprehensive_health_check.sh
          ./comprehensive_health_check.sh
          
      - name: Upload Health Report
        uses: actions/upload-artifact@v3
        with:
          name: health-report
          path: logs/health-*.log
EOF
            info "Created GitHub Actions health check workflow"
        fi
    fi
}

# Install Node.js dependencies
setup_nodejs() {
    log "Setting up Node.js dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        info "Node.js dependencies installed"
    else
        info "No package.json found, skipping Node.js setup"
    fi
}

# Create initial backup
create_initial_backup() {
    log "Creating initial backup..."
    
    local backup_dir="backups/initial_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup important configuration files
    local files_to_backup=(".env" "docker-compose.yml" "package.json" "README.md")
    
    for file in "${files_to_backup[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$backup_dir/"
        fi
    done
    
    info "Initial backup created in $backup_dir"
}

# Setup log rotation
setup_logging() {
    log "Setting up logging system..."
    
    # Create logrotate configuration
    if command -v logrotate &> /dev/null; then
        cat > logs/logrotate.conf << 'EOF'
/home/user/automation-system/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
        info "Log rotation configured"
    fi
}

# Main execution
main() {
    log "🚀 Starting Super Start Script - Master Setup"
    log "=========================================="
    
    check_root
    check_requirements
    create_directories
    setup_environment
    setup_docker
    setup_github_actions
    setup_nodejs
    setup_logging
    create_initial_backup
    
    log "=========================================="
    log "✅ Master setup completed successfully!"
    log "=========================================="
    
    info "Next steps:"
    info "1. Edit .env file with your configuration"
    info "2. Run: ./comprehensive_health_check.sh"
    info "3. Start n8n: docker-compose up -d"
    info "4. Visit: http://localhost:5678"
    
    warn "Don't forget to:"
    warn "- Set up your GitHub secrets for Actions"
    warn "- Configure your VPN/Tailscale if needed"
    warn "- Import your n8n workflows"
}

# Run main function
main "$@"