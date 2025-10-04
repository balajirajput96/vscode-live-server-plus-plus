#!/bin/bash

# 🚀 Complete Deployment Script
# यह script सभी components को deploy करने के लिए है

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
GEAR="⚙️"
PACKAGE="📦"
GLOBE="🌐"
ROBOT="🤖"
CHART="📊"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[${CHECK}]${NC} $1"
}

print_error() {
    echo -e "${RED}[${CROSS}]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[${WARNING}]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[${INFO}]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}[${GEAR}]${NC} $1"
}

# Banner
show_banner() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🚀 AI-Powered Career Automation System                  ║
║        Complete Deployment Script                           ║
║                                                              ║
║     Deploy your entire automation platform in minutes!      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites..."
    echo ""
    
    # Check for Docker
    if command -v docker &> /dev/null; then
        print_status "Docker is installed"
        docker --version
    else
        print_error "Docker is not installed"
        print_info "Install Docker from: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check for Docker Compose
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose is installed"
        docker-compose --version
    else
        print_warning "Docker Compose is not installed"
        print_info "Install Docker Compose from: https://docs.docker.com/compose/install/"
        read -p "Continue without Docker Compose? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Check for Git
    if command -v git &> /dev/null; then
        print_status "Git is installed"
    else
        print_warning "Git is not installed"
    fi
    
    # Check Docker daemon
    if docker info &> /dev/null; then
        print_status "Docker daemon is running"
    else
        print_error "Docker daemon is not running"
        print_info "Start Docker service and try again"
        exit 1
    fi
    
    echo ""
    print_status "All prerequisites checked!"
    echo ""
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment..."
    echo ""
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_info "Creating .env file..."
        
        if [ -f .env.example ]; then
            cp .env.example .env
            print_status ".env file created from .env.example"
        else
            print_info "Creating default .env file..."
            cat > .env << EOF
# n8n Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=change_this_password
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678

# Database
DB_TYPE=sqlite

# Timezone
GENERIC_TIMEZONE=Asia/Kolkata
TZ=Asia/Kolkata

# Execution
EXECUTIONS_PROCESS=main
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
EOF
            print_status "Default .env file created"
        fi
        
        print_warning "Please update the password in .env file!"
        print_info "Edit .env and change N8N_BASIC_AUTH_PASSWORD"
        echo ""
        read -p "Press Enter to continue after updating .env file..."
    else
        print_status ".env file already exists"
    fi
    
    echo ""
}

# Select deployment mode
select_deployment_mode() {
    print_header "Select Deployment Mode"
    echo ""
    echo "1) Local Development (docker-compose.basic.yml)"
    echo "2) Production with HTTPS (docker-compose.reverse-proxy.yml)"
    echo "3) Custom Configuration"
    echo ""
    read -p "Select mode (1-3): " mode_choice
    
    case $mode_choice in
        1)
            DEPLOYMENT_MODE="local"
            COMPOSE_FILE="docker-compose.basic.yml"
            print_status "Selected: Local Development"
            ;;
        2)
            DEPLOYMENT_MODE="production"
            COMPOSE_FILE="docker-compose.reverse-proxy.yml"
            print_status "Selected: Production with HTTPS"
            print_warning "Make sure you have configured Caddyfile with your domain!"
            ;;
        3)
            DEPLOYMENT_MODE="custom"
            read -p "Enter docker-compose file name: " COMPOSE_FILE
            print_status "Selected: Custom ($COMPOSE_FILE)"
            ;;
        *)
            print_error "Invalid selection. Using Local Development mode."
            DEPLOYMENT_MODE="local"
            COMPOSE_FILE="docker-compose.basic.yml"
            ;;
    esac
    
    echo ""
}

# Deploy n8n
deploy_n8n() {
    print_header "Deploying n8n Automation Platform..."
    echo ""
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "Docker Compose file not found: $COMPOSE_FILE"
        print_info "Creating basic docker-compose.basic.yml..."
        
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
        COMPOSE_FILE="docker-compose.basic.yml"
        print_status "Created docker-compose.basic.yml"
    fi
    
    print_info "Starting n8n with $COMPOSE_FILE..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    echo ""
    print_status "n8n deployment initiated!"
    print_info "Waiting for n8n to be ready..."
    sleep 10
    
    # Check if n8n is running
    if docker ps | grep -q n8n; then
        print_status "n8n container is running!"
        echo ""
        print_info "Access n8n at: ${CYAN}http://localhost:5678${NC}"
        print_info "Login with credentials from .env file"
    else
        print_error "n8n container failed to start"
        print_info "Check logs with: docker-compose -f $COMPOSE_FILE logs n8n"
    fi
    
    echo ""
}

# Setup automation scripts
setup_automation_scripts() {
    print_header "Setting Up Automation Scripts..."
    echo ""
    
    # Create automation guide
    if [ ! -f automation-setup-guide.md ]; then
        print_info "Creating automation setup guide..."
        cat > automation-setup-guide.md << 'EOF'
# 🤖 Automation Setup Guide

## 📦 Workflow Directories

### 1. Main Workflows
- `automation-scripts/n8n-workflows/` - Core automation workflows
- `n8n-workflows/` - Additional workflows
- `ai-agent-automation-pack/workflows/` - AI-powered workflows

### 2. Import Process
1. Access n8n at http://localhost:5678
2. Click "Workflows" → "Import from File"
3. Navigate to workflow directories:
  - `automation-scripts/n8n-workflows/`
  - `ai-agent-automation-pack/workflows/`
  - `n8n-workflows/`

### 3. Configure Credentials
- OpenAI API key
- Gmail OAuth
- Google Drive OAuth
- Buffer API token

### 4. Test Workflows
- Run each workflow manually
- Verify webhook endpoints
- Check API integrations

## 📚 Documentation
- [Complete Guide](./Complete_Personal_Automation_Guide.md)
- [n8n Setup](./README-n8n-setup.md)
- [Deployment Guide](./DEPLOYMENT.md)
EOF
        print_status "Automation setup guide created"
    fi
    
    # Create monitoring script if it doesn't exist
    if [ ! -f monitor-automation.sh ]; then
        print_info "Creating monitoring script..."
        cat > monitor-automation.sh << 'EOF'
#!/bin/bash

# Automation System Monitor

echo "🔍 Automation System Status Check"
echo "=================================="

# Check Docker containers
echo ""
echo "📦 Docker Containers:"
docker-compose ps

# Check n8n health
echo ""
echo "🏥 n8n Health Check:"
if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
    echo "✅ n8n is healthy"
else
    echo "❌ n8n is not responding"
fi

# Show recent logs
echo ""
echo "📋 Recent n8n Logs (last 20 lines):"
docker-compose logs --tail=20 n8n

# Resource usage
echo ""
echo "💻 Resource Usage:"
docker stats --no-stream n8n

echo ""
echo "Status check complete!"
EOF
        chmod +x monitor-automation.sh
        print_status "Monitoring script created"
    fi
    
    echo ""
    print_status "Automation scripts setup complete!"
}

# Setup GitHub Pages
setup_github_pages() {
    print_header "GitHub Pages Setup Instructions"
    echo ""
    
    print_info "To deploy to GitHub Pages:"
    echo ""
    echo "1. Go to your repository on GitHub"
    echo "2. Navigate to Settings → Pages"
    echo "3. Select Source: main/master branch"
    echo "4. Choose folder: root"
    echo "5. Save and wait for deployment"
    echo ""
    print_info "Your site will be available at:"
    echo "   ${CYAN}https://username.github.io/vscode-live-server-plus-plus${NC}"
    echo ""
    
    read -p "Have you configured GitHub Pages? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "GitHub Pages configured!"
    else
        print_warning "Remember to configure GitHub Pages later"
    fi
    
    echo ""
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment..."
    echo ""
    
    # Check Docker containers
    print_info "Checking Docker containers..."
    if docker ps | grep -q n8n; then
        print_status "n8n container is running"
    else
        print_error "n8n container is not running"
    fi
    
    # Check n8n API
    print_info "Checking n8n API..."
    sleep 5
    if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
        print_status "n8n API is responding"
    else
        print_warning "n8n API is not responding yet (may need more time)"
    fi
    
    # Check port availability
    print_info "Checking port 5678..."
    if netstat -tuln 2>/dev/null | grep -q 5678 || ss -tuln 2>/dev/null | grep -q 5678; then
        print_status "Port 5678 is listening"
    else
        print_warning "Port 5678 check inconclusive"
    fi
    
    echo ""
    print_status "Verification complete!"
    echo ""
}

# Show deployment summary
show_deployment_summary() {
    echo ""
    echo -e "${GREEN}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🎉 DEPLOYMENT COMPLETE! 🎉                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo ""
    
    print_header "📋 Deployment Summary"
    echo ""
    echo "✅ n8n Automation Platform deployed"
    echo "✅ Environment configured"
    echo "✅ Monitoring scripts created"
    echo "✅ Documentation available"
    echo ""
    
    print_header "🚀 Next Steps"
    echo ""
    echo "1. Access n8n Dashboard:"
    echo "   ${CYAN}http://localhost:5678${NC}"
    echo ""
    echo "2. Login Credentials:"
    echo "   Username: ${CYAN}admin${NC} (or check .env file)"
    echo "   Password: ${CYAN}(check .env file)${NC}"
    echo ""
    echo "3. Import Workflows:"
    echo "   - Go to Workflows → Import from File"
    echo "   - Import from automation directories"
    echo ""
    echo "4. Configure API Keys:"
    echo "   - Go to Credentials"
    echo "   - Add OpenAI, Gmail, Google Drive, Buffer"
    echo ""
    echo "5. Monitor System:"
    echo "   ${CYAN}./monitor-automation.sh${NC}"
    echo ""
    echo "6. View Logs:"
    echo "   ${CYAN}docker-compose -f $COMPOSE_FILE logs -f n8n${NC}"
    echo ""
    
    print_header "📚 Documentation"
    echo ""
    echo "- DEPLOYMENT.md - Complete deployment guide"
    echo "- DEPLOYMENT-SUMMARY.md - Quick reference"
    echo "- DEPLOYMENT-STATUS.md - Track your progress"
    echo "- README.md - Project overview"
    echo "- README-n8n-setup.md - n8n specific setup"
    echo ""
    
    print_header "🆘 Troubleshooting"
    echo ""
    echo "- Check logs: ${CYAN}docker-compose logs n8n${NC}"
    echo "- Restart: ${CYAN}docker-compose restart n8n${NC}"
    echo "- Stop all: ${CYAN}docker-compose down${NC}"
    echo "- Monitor: ${CYAN}./monitor-automation.sh${NC}"
    echo "- Verify: ${CYAN}./verify-deployment.sh${NC}"
    echo ""
    
    print_header "💡 Pro Tips"
    echo ""
    echo "- Start with sample workflows to understand the system"
    echo "- Configure credentials before activating workflows"
    echo "- Test each workflow individually before automation"
    echo "- Monitor resource usage regularly"
    echo "- Backup workflows regularly (export from n8n)"
    echo ""
    
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    print_status "Happy Automating! 🚀"
    echo ""
}

# Main execution
main() {
    show_banner
    
    # Check if running with root
    if [ "$EUID" -eq 0 ]; then 
        print_warning "Running as root. Some operations may require non-root user."
    fi
    
    # Run deployment steps
    check_prerequisites
    setup_environment
    
    read -p "Press Enter to continue with deployment configuration..."
    
    select_deployment_mode
    
    echo ""
    print_info "Starting deployment with mode: ${CYAN}$DEPLOYMENT_MODE${NC}"
    sleep 2
    
    deploy_n8n
    setup_automation_scripts
    setup_github_pages
    verify_deployment
    show_deployment_summary
}

# Run main function
main
