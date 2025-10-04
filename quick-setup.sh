#!/bin/bash

# 🚀 Quick Setup Script
# Interactive setup wizard for AI-Powered Career Automation System

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Functions
print_status() { echo -e "${GREEN}[✅]${NC} $1"; }
print_error() { echo -e "${RED}[❌]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[⚠️]${NC} $1"; }
print_info() { echo -e "${BLUE}[ℹ️]${NC} $1"; }
print_header() { echo -e "${PURPLE}$1${NC}"; }

show_banner() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          🚀 Quick Setup Wizard                              ║
║     AI-Powered Career Automation System                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo ""
    echo "This wizard will guide you through the setup process."
    echo ""
}

check_docker() {
    print_header "Checking Prerequisites..."
    echo ""
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        echo ""
        echo "Install Docker from: https://docs.docker.com/get-docker/"
        echo ""
        read -p "Press Enter to exit..."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        echo ""
        echo "Start Docker and try again"
        exit 1
    fi
    
    print_status "Docker is installed and running"
    echo ""
}

setup_env_file() {
    print_header "Setting Up Environment..."
    echo ""
    
    if [ -f .env ]; then
        print_info ".env file already exists"
        read -p "Do you want to overwrite it? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Keeping existing .env file"
            return
        fi
    fi
    
    print_info "Creating .env file..."
    
    # Get user input
    echo ""
    read -p "Enter n8n admin username (default: admin): " N8N_USER
    N8N_USER=${N8N_USER:-admin}
    
    echo ""
    read -sp "Enter n8n admin password (or press Enter for random): " N8N_PASS
    echo ""
    
    if [ -z "$N8N_PASS" ]; then
        N8N_PASS=$(openssl rand -base64 16 2>/dev/null || date +%s | sha256sum | base64 | head -c 16)
        print_info "Generated random password: $N8N_PASS"
        echo ""
    fi
    
    echo ""
    echo "Available timezones:"
    echo "1. Asia/Kolkata (India)"
    echo "2. America/New_York (US East)"
    echo "3. America/Los_Angeles (US West)"
    echo "4. Europe/London (UK)"
    echo "5. Custom"
    echo ""
    read -p "Select timezone (1-5): " TZ_CHOICE
    
    case $TZ_CHOICE in
        1) TIMEZONE="Asia/Kolkata" ;;
        2) TIMEZONE="America/New_York" ;;
        3) TIMEZONE="America/Los_Angeles" ;;
        4) TIMEZONE="Europe/London" ;;
        5) 
            read -p "Enter custom timezone: " TIMEZONE
            ;;
        *) 
            TIMEZONE="Asia/Kolkata"
            print_warning "Invalid choice, using Asia/Kolkata"
            ;;
    esac
    
    # Create .env file
    cat > .env << EOF
# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=$N8N_USER
N8N_BASIC_AUTH_PASSWORD=$N8N_PASS
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678

# Database
DB_TYPE=sqlite

# Timezone
GENERIC_TIMEZONE=$TIMEZONE
TZ=$TIMEZONE

# Execution
EXECUTIONS_PROCESS=main
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
EOF
    
    print_status ".env file created!"
    echo ""
    print_info "Username: $N8N_USER"
    print_info "Password: $N8N_PASS"
    print_info "Timezone: $TIMEZONE"
    echo ""
    print_warning "Save these credentials in a secure location!"
    echo ""
    read -p "Press Enter to continue..."
}

select_compose_file() {
    print_header "Select Deployment Mode"
    echo ""
    echo "1. Local Development (http://localhost:5678)"
    echo "2. Production with HTTPS (requires domain)"
    echo ""
    read -p "Select mode (1-2): " MODE_CHOICE
    
    case $MODE_CHOICE in
        1)
            COMPOSE_FILE="docker-compose.basic.yml"
            print_status "Selected: Local Development"
            ;;
        2)
            COMPOSE_FILE="docker-compose.reverse-proxy.yml"
            print_status "Selected: Production with HTTPS"
            echo ""
            read -p "Enter your domain name: " DOMAIN
            print_info "Make sure DNS is configured to point to this server"
            read -p "Press Enter to continue..."
            ;;
        *)
            COMPOSE_FILE="docker-compose.basic.yml"
            print_warning "Invalid choice, using Local Development"
            ;;
    esac
    
    echo ""
    
    # Check if compose file exists, create if not
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_info "Creating $COMPOSE_FILE..."
        
        if [ "$COMPOSE_FILE" = "docker-compose.basic.yml" ]; then
            cat > docker-compose.basic.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=${N8N_BASIC_AUTH_ACTIVE}
      - N8N_BASIC_AUTH_USER=${N8N_BASIC_AUTH_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_BASIC_AUTH_PASSWORD}
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=${N8N_PROTOCOL}
      - WEBHOOK_URL=${WEBHOOK_URL}
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - TZ=${TZ}
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
EOF
        fi
        print_status "Created $COMPOSE_FILE"
    fi
}

deploy_n8n() {
    print_header "Deploying n8n..."
    echo ""
    
    print_info "Pulling latest n8n image..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    print_info "Starting n8n container..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_status "n8n deployment started!"
    echo ""
    print_info "Waiting for n8n to be ready (30 seconds)..."
    
    # Wait with progress
    for i in {1..30}; do
        echo -n "."
        sleep 1
    done
    echo ""
    echo ""
    
    # Check if running
    if docker ps | grep -q n8n; then
        print_status "n8n is running!"
    else
        print_error "n8n failed to start"
        print_info "Check logs: docker-compose -f $COMPOSE_FILE logs n8n"
        exit 1
    fi
}

show_summary() {
    print_header "Setup Complete! 🎉"
    echo ""
    
    print_status "n8n is now running"
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📍 Access n8n at: ${CYAN}http://localhost:5678${NC}"
    echo ""
    echo "🔐 Login Credentials:"
    echo "   Username: ${CYAN}$N8N_USER${NC}"
    echo "   Password: ${CYAN}$N8N_PASS${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    print_header "Next Steps:"
    echo ""
    echo "1. Open n8n in your browser"
    echo "   ${CYAN}http://localhost:5678${NC}"
    echo ""
    echo "2. Login with the credentials above"
    echo ""
    echo "3. Import workflows"
    echo "   Workflows → Import from File"
    echo "   Look in: automation-scripts/n8n-workflows/"
    echo ""
    echo "4. Configure API credentials"
    echo "   Credentials → Add Credential"
    echo "   Required: OpenAI API key"
    echo ""
    echo "5. Test and activate workflows"
    echo ""
    
    print_header "Useful Commands:"
    echo ""
    echo "View logs:"
    echo "  ${CYAN}docker-compose -f $COMPOSE_FILE logs -f n8n${NC}"
    echo ""
    echo "Stop n8n:"
    echo "  ${CYAN}docker-compose -f $COMPOSE_FILE down${NC}"
    echo ""
    echo "Restart n8n:"
    echo "  ${CYAN}docker-compose -f $COMPOSE_FILE restart n8n${NC}"
    echo ""
    echo "Verify deployment:"
    echo "  ${CYAN}./verify-deployment.sh${NC}"
    echo ""
    
    print_header "Documentation:"
    echo ""
    echo "- README.md - Project overview"
    echo "- DEPLOYMENT.md - Complete deployment guide"
    echo "- DEPLOYMENT-SUMMARY.md - Quick reference"
    echo "- QUICK-DEPLOY.md - Quick deploy card"
    echo ""
    
    print_status "Setup complete! Happy automating! 🚀"
    echo ""
}

# Main execution
main() {
    show_banner
    check_docker
    setup_env_file
    select_compose_file
    deploy_n8n
    show_summary
}

# Run main
main
