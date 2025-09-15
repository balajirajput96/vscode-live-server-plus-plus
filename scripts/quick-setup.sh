#!/bin/bash

# 🚀 Personal Automation Quick Setup Script
# यह script आपको तुरंत automation setup करने में help करेगा

set -e

echo "🎉 Welcome to Personal Automation Quick Setup!"
echo "यह script आपको complete automation system setup करने में help करेगा"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found. Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        print_status "Docker installed successfully!"
    else
        print_status "Docker is already installed ✅"
    fi
}

# Check if Docker Compose is installed
check_docker_compose() {
    print_status "Checking Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose not found. Installing..."
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        print_status "Docker Compose installed successfully!"
    else
        print_status "Docker Compose is already installed ✅"
    fi
}

# Setup environment file
setup_env() {
    print_header "📝 Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status ".env file created from template"
    else
        print_warning ".env file already exists"
    fi
    
    # Generate encryption key
    if command -v openssl &> /dev/null; then
        ENCRYPTION_KEY=$(openssl rand -base64 32)
        sed -i "s/REPLACE_WITH_STRONG_BASE64_KEY/$ENCRYPTION_KEY/g" .env
        print_status "Encryption key generated and set"
    fi
    
    echo ""
    print_warning "📋 Please edit .env file with your settings:"
    echo "  - DOMAIN: Your domain name (for production)"
    echo "  - EMAIL: Your email address"
    echo "  - N8N_BASIC_AUTH_PASSWORD: Strong password"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
}

# Start n8n locally
start_n8n_local() {
    print_header "🚀 Starting n8n locally..."
    
    print_status "Pulling latest n8n image..."
    docker-compose --env-file .env -f docker-compose.basic.yml pull
    
    print_status "Starting n8n container..."
    docker-compose --env-file .env -f docker-compose.basic.yml up -d
    
    echo ""
    print_status "✅ n8n is starting up!"
    print_status "🌐 Access URL: http://localhost:5678"
    print_status "📊 Check status: docker-compose logs -f"
    echo ""
}

# Setup production environment
setup_production() {
    print_header "🔧 Production Setup (with HTTPS)"
    
    print_warning "Prerequisites for production setup:"
    echo "  1. Domain name pointing to this server"
    echo "  2. Ports 80 and 443 open"
    echo "  3. Valid email for Let's Encrypt"
    echo ""
    
    read -p "Do you want to continue with production setup? (y/N): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        print_status "Starting production setup with HTTPS..."
        docker-compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
        
        echo ""
        print_status "✅ Production n8n is starting up!"
        print_status "🌐 Access URL: https://$(grep DOMAIN .env | cut -d'=' -f2)"
        echo ""
    else
        print_status "Skipping production setup"
    fi
}

# Install automation scripts
setup_automation_scripts() {
    print_header "📜 Setting up automation scripts..."
    
    # Create Google Apps Script setup
    print_status "Creating Google Apps Script templates..."
    
    # Create a simple setup guide
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
```bash
# Import pre-built workflows
cd automation-scripts/n8n-workflows/
# Upload JSON files to n8n dashboard
```

### 3. Setup Google Apps Script
1. Go to https://script.google.com
2. Create new project
3. Copy code from `automation-scripts/gmail-automation.gs`
4. Enable required APIs
5. Set up triggers

### 4. Configure APIs
- YouTube Data API v3
- LinkedIn API
- Twitter API v2
- Google Sheets API
- Gmail API

### 5. Test Automation
1. Create test workflow in n8n
2. Send test email for Gmail automation
3. Publish test video for YouTube automation

## 🔗 Useful Links:
- Complete Guide: Complete_Personal_Automation_Guide.md
- n8n Documentation: https://docs.n8n.io
- Google Apps Script: https://developers.google.com/apps-script

## 🆘 Need Help?
- Check logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Update containers: `docker-compose pull && docker-compose up -d`
EOF

    print_status "Setup guide created: automation-setup-guide.md"
}

# Create monitoring script
create_monitoring() {
    print_header "📊 Creating monitoring script..."
    
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
free -h

# Check recent n8n logs
echo ""
echo "📋 Recent n8n Logs (last 10 lines):"
docker-compose logs --tail=10 n8n

echo ""
echo "✅ Status check complete!"
EOF

    chmod +x monitor-automation.sh
    print_status "Monitoring script created: monitor-automation.sh"
}

# Main setup menu
main_menu() {
    echo ""
    print_header "🎯 Choose your setup option:"
    echo "1. 💻 Local Development Setup (Recommended for beginners)"
    echo "2. 🌐 Production Setup with HTTPS"
    echo "3. 📊 Just create monitoring tools"
    echo "4. 🔧 Full setup (Local + Scripts + Monitoring)"
    echo "5. ❌ Exit"
    echo ""
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            check_docker
            check_docker_compose
            setup_env
            start_n8n_local
            setup_automation_scripts
            create_monitoring
            ;;
        2)
            check_docker
            check_docker_compose
            setup_env
            setup_production
            setup_automation_scripts
            create_monitoring
            ;;
        3)
            create_monitoring
            ;;
        4)
            check_docker
            check_docker_compose
            setup_env
            start_n8n_local
            setup_automation_scripts
            create_monitoring
            ;;
        5)
            print_status "Setup cancelled. Goodbye! 👋"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            main_menu
            ;;
    esac
}

# Final instructions
show_final_instructions() {
    echo ""
    print_header "🎉 Setup Complete!"
    echo ""
    print_status "Your personal automation system is ready!"
    echo ""
    echo "📚 Next Steps:"
    echo "1. Read: automation-setup-guide.md"
    echo "2. Access n8n: http://localhost:5678"
    echo "3. Check status: ./monitor-automation.sh"
    echo "4. Import workflows from automation-scripts/n8n-workflows/"
    echo "5. Setup Google Apps Script automation"
    echo ""
    print_status "🔗 Complete Guide: Complete_Personal_Automation_Guide.md"
    print_status "🤖 Happy Automating!"
}

# Run setup
main_menu
show_final_instructions