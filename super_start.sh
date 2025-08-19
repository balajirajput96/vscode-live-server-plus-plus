#!/bin/bash

# 🚀 Super Start Script - Complete System Launcher
# This script starts your entire automation system

set -e

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

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        error ".env file not found!"
        info "Please copy .env.template to .env and configure your settings"
        info "Command: cp .env.template .env"
        exit 1
    fi
    log "✅ .env file found"
}

# Check Docker and Docker Compose
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed!"
        info "Please install Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed!"
        info "Please install Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    log "✅ Docker and Docker Compose are available"
}

# Check if VPN is configured (optional)
check_vpn() {
    source .env
    
    if [ ! -z "$EXPRESS_VPN_ACTIVATION_CODE" ] || [ ! -z "$NORD_VPN_USERNAME" ]; then
        info "VPN configuration detected"
        
        # Check for ExpressVPN
        if command -v expressvpn &> /dev/null; then
            log "✅ ExpressVPN CLI found"
            if expressvpn status | grep -q "Connected"; then
                log "✅ ExpressVPN is connected"
            else
                warning "ExpressVPN is not connected, attempting to connect..."
                expressvpn connect smart || warning "Failed to connect ExpressVPN"
            fi
        fi
        
        # Check for NordVPN
        if command -v nordvpn &> /dev/null; then
            log "✅ NordVPN CLI found"
            if nordvpn status | grep -q "Connected"; then
                log "✅ NordVPN is connected"
            else
                warning "NordVPN is not connected, attempting to connect..."
                nordvpn connect || warning "Failed to connect NordVPN"
            fi
        fi
    else
        info "No VPN configuration found (optional)"
    fi
}

# Create necessary directories
setup_directories() {
    log "Creating necessary directories..."
    
    mkdir -p backup
    mkdir -p workflows
    mkdir -p logs
    mkdir -p scripts
    
    log "✅ Directories created"
}

# Generate encryption key if not set
setup_encryption() {
    source .env
    
    if [ -z "$N8N_ENCRYPTION_KEY" ] || [ "$N8N_ENCRYPTION_KEY" = "your_encryption_key_here" ]; then
        warning "N8N_ENCRYPTION_KEY not set or using default"
        
        # Generate new key
        NEW_KEY=$(openssl rand -base64 32)
        
        # Update .env file
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/N8N_ENCRYPTION_KEY=.*/N8N_ENCRYPTION_KEY=$NEW_KEY/" .env
        else
            # Linux
            sed -i "s/N8N_ENCRYPTION_KEY=.*/N8N_ENCRYPTION_KEY=$NEW_KEY/" .env
        fi
        
        log "✅ Generated new encryption key"
    else
        log "✅ Encryption key is configured"
    fi
}

# Start the system
start_system() {
    log "🚀 Starting automation system..."
    
    # Check if we should use HTTPS or basic setup
    source .env
    
    if [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "your-domain.com" ]; then
        info "Starting with HTTPS and reverse proxy..."
        docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
        
        log "✅ System started with HTTPS"
        log "📱 Access your n8n at: https://$DOMAIN"
    else
        info "Starting with basic HTTP setup..."
        docker compose --env-file .env -f docker-compose.basic.yml up -d
        
        log "✅ System started with HTTP"
        log "📱 Access your n8n at: http://localhost:5678"
    fi
}

# Wait for services to be ready
wait_for_services() {
    log "⏳ Waiting for services to be ready..."
    
    # Wait for postgres
    info "Waiting for PostgreSQL..."
    until docker compose --env-file .env -f docker-compose.basic.yml exec postgres pg_isready -U n8n &> /dev/null; do
        echo -n "."
        sleep 2
    done
    echo ""
    log "✅ PostgreSQL is ready"
    
    # Wait for n8n
    info "Waiting for n8n..."
    until curl -s http://localhost:5678 &> /dev/null; do
        echo -n "."
        sleep 2
    done
    echo ""
    log "✅ n8n is ready"
}

# Display system information
display_info() {
    echo ""
    echo "🎉 Sistema iniciado com sucesso!"
    echo "=================================="
    
    source .env
    
    if [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "your-domain.com" ]; then
        echo "🌐 n8n URL: https://$DOMAIN"
    else
        echo "🌐 n8n URL: http://localhost:5678"
    fi
    
    echo "👤 Username: ${N8N_BASIC_AUTH_USER:-admin}"
    echo "🔑 Password: ${N8N_BASIC_AUTH_PASSWORD:-admin}"
    echo ""
    echo "📊 Para verificar o status do sistema:"
    echo "   ./comprehensive_health_check.sh"
    echo ""
    echo "📋 Para ver logs:"
    echo "   docker compose logs -f"
    echo ""
    echo "🛑 Para parar o sistema:"
    echo "   docker compose down"
    echo ""
}

# Main execution
main() {
    echo "🚀 AI Career Automation System - Super Start"
    echo "============================================="
    echo ""
    
    log "Starting system checks..."
    
    check_env_file
    check_docker
    check_vpn
    setup_directories
    setup_encryption
    start_system
    wait_for_services
    display_info
    
    log "🎉 System successfully started!"
}

# Run main function
main "$@"