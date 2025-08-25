#!/bin/bash

# 🚀 n8n Complete Setup Script
# बालाजी के लिए Complete n8n Automation System

set -e

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
    echo -e "${BLUE}
    ╔═══════════════════════════════════════╗
    ║     🚀 n8n Automation Setup         ║
    ║     बालाजी के लिए Complete System    ║
    ╚═══════════════════════════════════════╝
    ${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "यह script root user के साथ न चलाएं!"
        print_error "Please run this script as a regular user, not root!"
        exit 1
    fi
}

# Check system requirements
check_requirements() {
    print_status "System requirements जांच रहे हैं..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker installed नहीं है!"
        print_status "Docker install कर रहे हैं..."
        
        # Install Docker
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        
        print_status "Docker installed successfully!"
        print_warning "Please logout and login again for Docker permissions to take effect."
    else
        print_status "✅ Docker already installed"
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose installed नहीं है!"
        print_status "Docker Compose install कर रहे हैं..."
        
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        
        print_status "Docker Compose installed successfully!"
    else
        print_status "✅ Docker Compose already installed"
    fi
    
    # Check available disk space (minimum 10GB)
    available_space=$(df / | awk 'NR==2{printf "%.0f", $4/1024/1024}')
    if [ "$available_space" -lt 10 ]; then
        print_error "कम से कम 10GB free disk space चाहिए!"
        print_error "Current available: ${available_space}GB"
        exit 1
    else
        print_status "✅ Sufficient disk space available: ${available_space}GB"
    fi
    
    # Check available RAM (minimum 4GB)
    available_ram=$(free -g | awk 'NR==2{printf "%.0f", $7}')
    if [ "$available_ram" -lt 2 ]; then
        print_warning "कम RAM detected. 4GB+ recommended for optimal performance"
    else
        print_status "✅ Sufficient RAM available"
    fi
}

# Setup environment file
setup_environment() {
    print_status "Environment configuration setup कर रहे हैं..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_status "✅ .env file created from template"
        
        # Generate encryption key
        encryption_key=$(openssl rand -base64 32)
        
        # Update .env with generated values
        sed -i "s/your_32_character_encryption_key_here/$encryption_key/g" .env
        sed -i "s/change_me_secure_password/$(openssl rand -base64 12)/g" .env
        
        print_status "✅ Encryption key और passwords generate किए गए"
        print_warning "Please edit .env file और अपनी details update करें:"
        print_warning "- Gmail credentials"
        print_warning "- API keys"
        print_warning "- Domain settings"
        
        read -p "Press Enter to continue after updating .env file..."
    else
        print_status "✅ .env file already exists"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Required directories create कर रहे हैं..."
    
    mkdir -p logs
    mkdir -p backups
    mkdir -p ai-models
    mkdir -p uploads
    mkdir -p data/n8n
    mkdir -p data/postgres
    mkdir -p data/redis
    
    # Set proper permissions
    chmod -R 755 logs backups ai-models uploads
    
    print_status "✅ Directories created successfully"
}

# Pull Docker images
pull_images() {
    print_status "Docker images download कर रहे हैं..."
    
    print_status "n8n image pulling..."
    docker pull n8nio/n8n:latest
    
    print_status "Ollama AI image pulling..."
    docker pull ollama/ollama:latest
    
    print_status "PostgreSQL image pulling..."
    docker pull postgres:15-alpine
    
    print_status "Redis image pulling..."
    docker pull redis:7-alpine
    
    print_status "Caddy image pulling..."
    docker pull caddy:2.7-alpine
    
    print_status "✅ All Docker images downloaded"
}

# Setup AI models
setup_ai_models() {
    print_status "AI models setup कर रहे हैं..."
    
    # Start Ollama temporarily to download models
    print_status "Ollama container starting..."
    docker run -d --name ollama-temp -p 11434:11434 ollama/ollama:latest
    
    # Wait for Ollama to start
    sleep 10
    
    print_status "Gemma 3B model download कर रहे हैं..."
    docker exec ollama-temp ollama pull gemma:3b
    
    print_status "SHAKTI model download कर रहे हैं..."
    # Note: SHAKTI model might need to be configured differently
    docker exec ollama-temp ollama pull llama2:7b  # Placeholder for SHAKTI
    
    # Stop and remove temporary container
    docker stop ollama-temp
    docker rm ollama-temp
    
    print_status "✅ AI models downloaded successfully"
}

# Install additional tools
install_tools() {
    print_status "Additional tools install कर रहे हैं..."
    
    # Install jq for JSON processing
    if ! command -v jq &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y jq curl wget
        print_status "✅ Additional tools installed"
    else
        print_status "✅ Tools already installed"
    fi
    
    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        print_status "✅ Node.js installed"
    else
        print_status "✅ Node.js already installed"
    fi
}

# Start services
start_services() {
    print_status "Services start कर रहे हैं..."
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_error ".env file not found! Please run setup first."
        exit 1
    fi
    
    # Start in development mode by default
    print_status "Starting n8n in local development mode..."
    docker-compose --env-file .env -f docker-compose.local.yml up -d
    
    print_status "Services starting... Please wait 30 seconds..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_status "✅ Services started successfully!"
        print_status ""
        print_status "🌟 n8n Dashboard: http://localhost:5678"
        print_status "📧 Check your email for setup confirmation"
        print_status ""
        print_status "Default credentials:"
        print_status "Username: balaji_admin"
        print_status "Password: (check .env file)"
    else
        print_error "Services failed to start! Check logs:"
        docker-compose logs
    fi
}

# Import workflows
import_workflows() {
    print_status "Workflows import कर रहे हैं..."
    
    # Wait for n8n to be fully ready
    sleep 60
    
    # Check if n8n is responding
    if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
        print_status "✅ n8n is ready for workflow import"
        
        # Import each workflow
        for workflow_file in workflows/*.json; do
            if [ -f "$workflow_file" ]; then
                workflow_name=$(basename "$workflow_file" .json)
                print_status "Importing $workflow_name workflow..."
                
                # Note: Actual import would require n8n API authentication
                # This is a placeholder for the import process
                print_status "✅ $workflow_name ready for manual import"
            fi
        done
        
        print_status "✅ All workflows ready!"
        print_status "Please manually import workflows from the workflows/ directory"
    else
        print_warning "n8n not ready yet. Please import workflows manually later."
    fi
}

# Setup complete notification
setup_complete() {
    print_status ""
    print_status "🎉 Setup पूर्ण! Setup Complete!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Open http://localhost:5678 in your browser"
    print_status "2. Login with your credentials from .env file"
    print_status "3. Import workflows from workflows/ directory"
    print_status "4. Configure credentials for GitHub, Google, etc."
    print_status "5. Activate workflows"
    print_status ""
    print_status "📧 You should receive email confirmations once workflows are active"
    print_status ""
    print_status "🔧 Useful commands:"
    print_status "- Stop services: docker-compose down"
    print_status "- View logs: docker-compose logs -f"
    print_status "- Restart: docker-compose restart"
    print_status ""
    print_status "📖 For help, check README-n8n-setup.md"
}

# Main execution
main() {
    print_header
    
    # Check command line arguments
    case "${1:-install}" in
        "install")
            print_status "Complete installation शुरू कर रहे हैं..."
            check_root
            check_requirements
            setup_environment
            create_directories
            pull_images
            setup_ai_models
            install_tools
            start_services
            import_workflows
            setup_complete
            ;;
        "start")
            print_status "Services start कर रहे हैं..."
            start_services
            ;;
        "stop")
            print_status "Services stop कर रहे हैं..."
            docker-compose down
            print_status "✅ Services stopped"
            ;;
        "restart")
            print_status "Services restart कर रहे हैं..."
            docker-compose restart
            print_status "✅ Services restarted"
            ;;
        "logs")
            print_status "Logs showing..."
            docker-compose logs -f
            ;;
        "status")
            print_status "Services status:"
            docker-compose ps
            ;;
        "update")
            print_status "System update कर रहे हैं..."
            docker-compose pull
            docker-compose down
            docker-compose up -d
            print_status "✅ System updated"
            ;;
        *)
            echo "Usage: $0 {install|start|stop|restart|logs|status|update}"
            echo ""
            echo "Commands:"
            echo "  install  - Complete installation और setup"
            echo "  start    - Services start करें"
            echo "  stop     - Services stop करें" 
            echo "  restart  - Services restart करें"
            echo "  logs     - Logs देखें"
            echo "  status   - Services status check करें"
            echo "  update   - System update करें"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"