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
    echo -e "${CYAN}[${INFO}]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo ""
}

# Banner
show_banner() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Complete Automation System Deployment                   ║
║                                                               ║
║   डिप्लॉयमेंट शुरू करने के लिए तैयार हैं?                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    print_header "${GEAR} Checking Prerequisites"
    
    local all_ok=true
    
    # Check Docker
    print_section "Checking Docker..."
    if command -v docker &> /dev/null; then
        print_status "Docker is installed $(docker --version | cut -d' ' -f3)"
    else
        print_error "Docker is not installed"
        all_ok=false
    fi
    
    # Check Docker Compose
    print_section "Checking Docker Compose..."
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose is installed $(docker-compose --version | cut -d' ' -f4)"
    else
        print_error "Docker Compose is not installed"
        all_ok=false
    fi
    
    # Check Git
    print_section "Checking Git..."
    if command -v git &> /dev/null; then
        print_status "Git is installed $(git --version | cut -d' ' -f3)"
    else
        print_warning "Git is not installed (optional for deployment)"
    fi
    
    # Check OpenSSL
    print_section "Checking OpenSSL..."
    if command -v openssl &> /dev/null; then
        print_status "OpenSSL is installed"
    else
        print_warning "OpenSSL is not installed (needed for encryption key generation)"
    fi
    
    # Check curl
    print_section "Checking curl..."
    if command -v curl &> /dev/null; then
        print_status "curl is installed"
    else
        print_warning "curl is not installed (needed for health checks)"
    fi
    
    if [ "$all_ok" = false ]; then
        print_error "Some prerequisites are missing. Please install them first."
        echo ""
        print_info "Run: ./quick-setup.sh to install missing dependencies"
        exit 1
    fi
    
    print_status "All prerequisites are satisfied!"
    sleep 2
}

# Environment setup
setup_environment() {
    print_header "${PACKAGE} Environment Configuration"
    
    if [ -f .env ]; then
        print_warning ".env file already exists"
        read -p "Do you want to recreate it? (y/N): " recreate
        if [[ $recreate =~ ^[Yy]$ ]]; then
            cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
            print_status "Backed up existing .env file"
            cp .env.example .env
        fi
    else
        cp .env.example .env
        print_status "Created .env from template"
    fi
    
    # Generate encryption key if needed
    if command -v openssl &> /dev/null; then
        if grep -q "REPLACE_WITH_STRONG_BASE64_KEY" .env; then
            ENCRYPTION_KEY=$(openssl rand -base64 32)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|REPLACE_WITH_STRONG_BASE64_KEY|$ENCRYPTION_KEY|g" .env
            else
                sed -i "s|REPLACE_WITH_STRONG_BASE64_KEY|$ENCRYPTION_KEY|g" .env
            fi
            print_status "Generated encryption key"
        fi
    fi
    
    echo ""
    print_info "Please review and update the .env file with your configuration:"
    echo "  • DOMAIN - Your domain name (for production)"
    echo "  • EMAIL - Your email address"
    echo "  • N8N_BASIC_AUTH_PASSWORD - Strong password"
    echo "  • WEBHOOK_URL - Your webhook URL"
    echo ""
}

# Deployment mode selection
select_deployment_mode() {
    print_header "${ROCKET} Select Deployment Mode"
    
    echo "Choose your deployment mode:"
    echo ""
    echo "  1) ${BLUE}Local Development${NC} - Run on localhost (http://localhost:5678)"
    echo "  2) ${GREEN}Production with HTTPS${NC} - Run with domain and SSL (https://your-domain.com)"
    echo "  3) ${CYAN}Custom Configuration${NC} - Manual setup"
    echo "  4) ${YELLOW}Skip n8n Deployment${NC} - Deploy other components only"
    echo ""
    
    read -p "Enter your choice (1-4): " deployment_choice
    
    case $deployment_choice in
        1) DEPLOYMENT_MODE="local" ;;
        2) DEPLOYMENT_MODE="production" ;;
        3) DEPLOYMENT_MODE="custom" ;;
        4) DEPLOYMENT_MODE="skip" ;;
        *) 
            print_error "Invalid choice"
            select_deployment_mode
            ;;
    esac
}

# Deploy n8n
deploy_n8n() {
    print_header "${ROBOT} Deploying n8n Automation Platform"
    
    if [ "$DEPLOYMENT_MODE" = "skip" ]; then
        print_warning "Skipping n8n deployment as requested"
        return
    fi
    
    case $DEPLOYMENT_MODE in
        local)
            print_section "Deploying n8n locally..."
            
            # Update .env for local deployment
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' 's/N8N_SECURE_COOKIE=true/N8N_SECURE_COOKIE=false/' .env
                sed -i '' 's/N8N_PROTOCOL=https/N8N_PROTOCOL=http/' .env
            else
                sed -i 's/N8N_SECURE_COOKIE=true/N8N_SECURE_COOKIE=false/' .env
                sed -i 's/N8N_PROTOCOL=https/N8N_PROTOCOL=http/' .env
            fi
            
            print_info "Pulling latest n8n image..."
            docker-compose --env-file .env -f docker-compose.basic.yml pull
            
            print_info "Starting n8n container..."
            docker-compose --env-file .env -f docker-compose.basic.yml up -d
            
            echo ""
            print_status "n8n is starting up!"
            print_info "Access URL: ${GREEN}http://localhost:5678${NC}"
            print_info "Check status: ${CYAN}docker-compose logs -f${NC}"
            ;;
            
        production)
            print_section "Deploying n8n with HTTPS..."
            
            # Check domain configuration
            DOMAIN=$(grep "^DOMAIN=" .env | cut -d'=' -f2)
            if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "n8n.example.com" ]; then
                print_error "Please set DOMAIN in .env file first"
                echo ""
                read -p "Enter your domain name: " user_domain
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i '' "s/DOMAIN=.*/DOMAIN=$user_domain/" .env
                else
                    sed -i "s/DOMAIN=.*/DOMAIN=$user_domain/" .env
                fi
                DOMAIN=$user_domain
            fi
            
            print_warning "Prerequisites for production deployment:"
            echo "  1. DNS A record for $DOMAIN pointing to this server"
            echo "  2. Ports 80 and 443 open in firewall"
            echo "  3. Valid email for Let's Encrypt"
            echo ""
            
            read -p "Are these prerequisites met? (y/N): " confirm
            if [[ ! $confirm =~ ^[Yy]$ ]]; then
                print_error "Please meet the prerequisites first"
                exit 1
            fi
            
            print_info "Pulling latest images..."
            docker-compose --env-file .env -f docker-compose.reverse-proxy.yml pull
            
            print_info "Starting n8n with Caddy reverse proxy..."
            docker-compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
            
            echo ""
            print_status "Production n8n is starting up!"
            print_info "Access URL: ${GREEN}https://$DOMAIN${NC}"
            print_warning "SSL certificate generation may take a few minutes"
            ;;
            
        custom)
            print_section "Custom deployment mode selected"
            print_info "Please run docker-compose commands manually"
            echo ""
            echo "Local:      docker-compose --env-file .env -f docker-compose.basic.yml up -d"
            echo "Production: docker-compose --env-file .env -f docker-compose.reverse-proxy.yml up -d"
            return
            ;;
    esac
    
    # Wait for n8n to be ready
    if [ "$DEPLOYMENT_MODE" != "custom" ]; then
        print_section "Waiting for n8n to be ready..."
        sleep 5
        
        local max_attempts=30
        local attempt=0
        
        if [ "$DEPLOYMENT_MODE" = "local" ]; then
            health_url="http://localhost:5678/healthz"
        else
            health_url="https://$DOMAIN/healthz"
        fi
        
        while [ $attempt -lt $max_attempts ]; do
            if curl -f -s "$health_url" > /dev/null 2>&1; then
                print_status "n8n is ready!"
                break
            fi
            attempt=$((attempt + 1))
            echo -n "."
            sleep 2
        done
        
        if [ $attempt -eq $max_attempts ]; then
            print_warning "n8n health check timeout, but it might still be starting"
            print_info "Check manually: ${CYAN}docker-compose logs -f${NC}"
        fi
    fi
}

# Setup automation scripts
setup_automation_scripts() {
    print_header "${PACKAGE} Setting Up Automation Scripts"
    
    # Create automation setup guide if it doesn't exist
    if [ ! -f automation-setup-guide.md ]; then
        print_info "Creating automation setup guide..."
        cat > automation-setup-guide.md << 'EOF'
# 🤖 Automation Setup Complete!

## What's installed:
1. ✅ n8n automation platform
2. ✅ Google Apps Script templates
3. ✅ YouTube automation workflows
4. ✅ Social media cross-posting templates

## Next Steps:

### 1. Access n8n Dashboard
- **Local**: http://localhost:5678
- **Production**: https://your-domain.com

### 2. Import Workflows
- Navigate to Workflows → Import from file
- Import JSON files from:
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
echo "🤖 n8n Health Check:"
if curl -f http://localhost:5678/healthz >/dev/null 2>&1; then
    echo "✅ n8n is running and healthy"
else
    echo "❌ n8n is not responding"
fi

# Check disk space
echo ""
echo "💾 Disk Usage:"
df -h | grep -E '^/dev|^overlay'

# Check memory usage
echo ""
echo "🧠 Memory Usage:"
free -h 2>/dev/null || vm_stat

# Check recent n8n logs
echo ""
echo "📋 Recent n8n Logs (last 10 lines):"
docker-compose logs --tail=10 n8n 2>/dev/null || echo "n8n container not running"

echo ""
echo "✅ Status check complete!"
EOF
        chmod +x monitor-automation.sh
        print_status "Monitoring script created"
    fi
}

# Setup GitHub Pages
setup_github_pages() {
    print_header "${GLOBE} GitHub Pages Configuration"
    
    print_info "To enable GitHub Pages:"
    echo ""
    echo "  1. Go to: Repository Settings → Pages"
    echo "  2. Source: Deploy from a branch"
    echo "  3. Branch: main (or master) / root"
    echo "  4. Save"
    echo ""
    echo "Your site will be available at:"
    echo "  ${GREEN}https://username.github.io/repository-name${NC}"
    echo ""
    
    print_info "Components available on GitHub Pages:"
    echo "  • Career Automation System (index.html)"
    echo "  • Job Tracking System (Job_Tracking_System.html)"
    echo "  • Sonar API Guide (sonar-api-quickstart.html)"
    echo "  • Portfolio Templates"
    echo ""
}

# Verify deployment
verify_deployment() {
    print_header "${CHART} Verifying Deployment"
    
    local issues=0
    
    # Check n8n
    if [ "$DEPLOYMENT_MODE" != "skip" ]; then
        print_section "Checking n8n..."
        if docker ps | grep -q "n8n"; then
            print_status "n8n container is running"
        else
            print_error "n8n container is not running"
            issues=$((issues + 1))
        fi
    fi
    
    # Check files
    print_section "Checking files..."
    
    local required_files=(
        ".env"
        "docker-compose.basic.yml"
        "docker-compose.reverse-proxy.yml"
        "automation-setup-guide.md"
        "monitor-automation.sh"
        "DEPLOYMENT.md"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            print_status "$file exists"
        else
            print_error "$file is missing"
            issues=$((issues + 1))
        fi
    done
    
    # Check directories
    print_section "Checking directories..."
    
    local required_dirs=(
        "automation-scripts"
        "career-automation-system"
        "scripts"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            print_status "$dir/ exists"
        else
            print_warning "$dir/ is missing (optional)"
        fi
    done
    
    echo ""
    if [ $issues -eq 0 ]; then
        print_status "All checks passed! Deployment successful! 🎉"
    else
        print_warning "Deployment completed with $issues issues"
        print_info "Review the errors above and fix them"
    fi
}

# Show deployment summary
show_deployment_summary() {
    print_header "${CHECK} Deployment Summary"
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo -e "  ${GREEN}✅ Deployment Complete!${NC}"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    
    if [ "$DEPLOYMENT_MODE" = "local" ]; then
        echo "  🌐 n8n Access: ${GREEN}http://localhost:5678${NC}"
    elif [ "$DEPLOYMENT_MODE" = "production" ]; then
        DOMAIN=$(grep "^DOMAIN=" .env | cut -d'=' -f2)
        echo "  🌐 n8n Access: ${GREEN}https://$DOMAIN${NC}"
    fi
    
    echo ""
    echo "  📚 Next Steps:"
    echo ""
    echo "    1. Read: ${CYAN}automation-setup-guide.md${NC}"
    echo "    2. Read: ${CYAN}DEPLOYMENT.md${NC}"
    echo "    3. Access n8n and complete first-time setup"
    echo "    4. Import workflows from automation-scripts/"
    echo "    5. Configure API credentials"
    echo "    6. Test workflows"
    echo "    7. Setup GitHub Actions secrets"
    echo "    8. Enable GitHub Pages"
    echo "    9. Run monitoring: ${CYAN}./monitor-automation.sh${NC}"
    echo ""
    echo "  🔧 Useful Commands:"
    echo ""
    echo "    • Check status:  ${CYAN}docker-compose ps${NC}"
    echo "    • View logs:     ${CYAN}docker-compose logs -f${NC}"
    echo "    • Restart:       ${CYAN}docker-compose restart${NC}"
    echo "    • Stop:          ${CYAN}docker-compose down${NC}"
    echo "    • Monitor:       ${CYAN}./monitor-automation.sh${NC}"
    echo ""
    echo "  📖 Documentation:"
    echo ""
    echo "    • Complete Guide: ${CYAN}Complete_Personal_Automation_Guide.md${NC}"
    echo "    • n8n Setup:      ${CYAN}README-n8n-setup.md${NC}"
    echo "    • Deployment:     ${CYAN}DEPLOYMENT.md${NC}"
    echo "    • Commands:       ${CYAN}COPY-PASTE-COMMANDS.md${NC}"
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
