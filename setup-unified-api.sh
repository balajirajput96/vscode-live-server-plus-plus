#!/bin/bash

# 🚀 Unified API Setup Script
# Automates the configuration of n8n and unified API system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "🚀 Unified API & Radial Integration System Setup"
echo "=================================================="
echo -e "${NC}"

# Check requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check openssl for key generation
    if ! command -v openssl &> /dev/null; then
        log_warning "OpenSSL not found. Will skip encryption key generation."
    fi
    
    log_success "System requirements check passed"
}

# Generate encryption key
generate_encryption_key() {
    if command -v openssl &> /dev/null; then
        log_info "Generating encryption key..."
        ENCRYPTION_KEY=$(openssl rand -base64 32)
        echo "N8N_ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env
        log_success "Encryption key generated and added to .env"
    else
        log_warning "Please generate encryption key manually: openssl rand -base64 32"
    fi
}

# Setup environment file
setup_environment() {
    log_info "Setting up environment configuration..."
    
    if [ -f .env ]; then
        log_warning ".env file already exists. Creating backup..."
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # Copy template
    if [ -f .env.unified-api ]; then
        cp .env.unified-api .env
        log_success "Environment template copied to .env"
    else
        log_error ".env.unified-api template not found"
        exit 1
    fi
    
    # Generate encryption key
    generate_encryption_key
    
    log_warning "Please edit .env file and replace the following placeholders:"
    echo "  - REPLACE_TELEGRAM_CHAT_ID"
    echo "  - REPLACE_GITHUB_OWNER"
    echo "  - REPLACE_GITHUB_REPO"
    echo "  - REPLACE_GOOGLE_DRIVE_FILE_ID"
    echo "  - REPLACE_GOOGLE_SHEETS_ID"
    echo "  - N8N_BASIC_AUTH_PASSWORD"
    echo "  - DOMAIN (for production)"
    echo "  - EMAIL (for production)"
}

# Start n8n
start_n8n() {
    local mode=${1:-"local"}
    
    log_info "Starting n8n in $mode mode..."
    
    if [ "$mode" = "production" ]; then
        if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "your-domain.com" ]; then
            log_error "Please set DOMAIN in .env for production mode"
            exit 1
        fi
        docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
        log_success "n8n started in production mode with HTTPS"
        log_info "Access n8n at: https://$DOMAIN"
    else
        docker compose --env-file .env -f docker-compose.basic.yml up -d
        log_success "n8n started in local development mode"
        log_info "Access n8n at: http://localhost:5678"
    fi
}

# Import workflow
import_workflow() {
    log_info "Workflow import instructions:"
    echo "1. Open n8n web interface"
    echo "2. Go to Workflows → Import from JSON"
    echo "3. Copy content from: n8n-workflows/unified-api-router.json"
    echo "4. Paste and click Import"
    echo "5. Save and Activate the workflow"
    echo ""
    log_warning "Don't forget to configure credentials in n8n!"
}

# Setup GitHub secrets
setup_github_secrets() {
    log_info "GitHub integration setup:"
    echo "Add these secrets to your GitHub repository:"
    echo ""
    echo "Secret Name: N8N_UNIFIED_API_URL"
    echo "Secret Value: https://your-n8n-instance.com/webhook/unified-api"
    echo ""
    echo "You can add secrets at:"
    echo "https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
}

# Test API
test_api() {
    local api_url=${1:-"http://localhost:5678/webhook/unified-api"}
    
    log_info "Testing Unified API..."
    
    # Test log endpoint (safest to test)
    local test_data='{
        "type": "log",
        "message": "Setup script test",
        "email": "setup@example.com",
        "category": "setup-test"
    }'
    
    if command -v curl &> /dev/null; then
        echo "Testing API endpoint: $api_url"
        
        if curl -s -f -X POST "$api_url" \
           -H "Content-Type: application/json" \
           -d "$test_data" > /dev/null 2>&1; then
            log_success "API test successful!"
        else
            log_warning "API test failed. This might be normal if credentials are not configured yet."
        fi
    else
        log_warning "curl not found. Please test API manually:"
        echo "curl -X POST '$api_url' -H 'Content-Type: application/json' -d '$test_data'"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo "1. Complete setup (recommended for first-time users)"
    echo "2. Setup environment only"
    echo "3. Start n8n (local development)"
    echo "4. Start n8n (production with HTTPS)"
    echo "5. Show workflow import instructions"
    echo "6. Show GitHub secrets setup"
    echo "7. Test API"
    echo "8. Stop n8n"
    echo "9. View logs"
    echo "0. Exit"
    echo ""
    read -p "Enter your choice [1-9, 0]: " choice
}

# Stop n8n
stop_n8n() {
    log_info "Stopping n8n..."
    docker compose --env-file .env -f docker-compose.basic.yml down 2>/dev/null || true
    docker compose --env-file .env -f docker-compose.reverse-proxy.yml down 2>/dev/null || true
    log_success "n8n stopped"
}

# View logs
view_logs() {
    log_info "Showing n8n logs (press Ctrl+C to exit)..."
    docker logs -f n8n 2>/dev/null || log_error "n8n container not running"
}

# Complete setup
complete_setup() {
    log_info "Starting complete setup..."
    
    check_requirements
    setup_environment
    
    echo ""
    read -p "Have you edited the .env file with your credentials? (y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        start_n8n "local"
        echo ""
        import_workflow
        echo ""
        setup_github_secrets
        echo ""
        test_api
        
        log_success "Setup completed! Next steps:"
        echo "1. Configure credentials in n8n web interface"
        echo "2. Import the workflow"
        echo "3. Add GitHub secrets"
        echo "4. Test the API endpoints"
    else
        log_warning "Please edit .env file first, then run this script again."
    fi
}

# Handle command line arguments
case ${1:-""} in
    "complete")
        complete_setup
        ;;
    "env")
        setup_environment
        ;;
    "start")
        start_n8n ${2:-"local"}
        ;;
    "stop")
        stop_n8n
        ;;
    "test")
        test_api ${2:-"http://localhost:5678/webhook/unified-api"}
        ;;
    "logs")
        view_logs
        ;;
    *)
        # Interactive mode
        while true; do
            show_menu
            case $choice in
                1)
                    complete_setup
                    ;;
                2)
                    setup_environment
                    ;;
                3)
                    start_n8n "local"
                    ;;
                4)
                    start_n8n "production"
                    ;;
                5)
                    import_workflow
                    ;;
                6)
                    setup_github_secrets
                    ;;
                7)
                    read -p "Enter API URL (default: http://localhost:5678/webhook/unified-api): " api_url
                    test_api ${api_url:-"http://localhost:5678/webhook/unified-api"}
                    ;;
                8)
                    stop_n8n
                    ;;
                9)
                    view_logs
                    ;;
                0)
                    log_info "Goodbye!"
                    exit 0
                    ;;
                *)
                    log_error "Invalid option. Please try again."
                    ;;
            esac
            
            echo ""
            read -p "Press Enter to continue..."
        done
        ;;
esac