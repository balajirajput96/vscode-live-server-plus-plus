#!/bin/bash

# n8n Career Automation Setup Script
# This script sets up the complete n8n automation environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        echo "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "All prerequisites are installed."
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp .env.template .env
        print_warning "Created .env file from template. Please update it with your values."
        print_status "Important environment variables to update:"
        echo "  - NGROK_AUTHTOKEN (for tunnel access)"
        echo "  - SMTP_* (for email notifications)"
        echo "  - API keys for various services"
    else
        print_success "Environment file already exists."
    fi
}

# Create necessary directories
setup_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p workflows
    mkdir -p scripts
    mkdir -p config/ssl
    mkdir -p logs
    
    print_success "Directories created."
}

# Build custom n8n image
build_image() {
    print_status "Building custom n8n Docker image..."
    
    docker build -t n8n-career-automation .
    
    print_success "Custom n8n image built successfully."
}

# Create Docker volume
create_volume() {
    print_status "Creating Docker volume for data persistence..."
    
    docker volume create n8n_data || true
    
    print_success "Docker volume created."
}

# Start n8n service
start_n8n() {
    print_status "Starting n8n automation service..."
    
    docker-compose up -d n8n
    
    print_success "n8n service started."
    print_status "Waiting for n8n to be ready..."
    
    # Wait for n8n to be ready
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:5678/healthz > /dev/null 2>&1; then
            print_success "n8n is ready!"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "n8n failed to start within expected time."
            exit 1
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
}

# Setup basic workflows
setup_workflows() {
    print_status "Setting up basic automation workflows..."
    
    # Create sample workflow files
    cat > workflows/career_automation_webhook.json << 'EOF'
{
  "name": "Career Automation Webhook",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "career-automation",
        "responseMode": "responseNode"
      },
      "id": "webhook-001",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({\"status\": \"success\", \"message\": \"Career automation triggered\", \"timestamp\": new Date().toISOString()}) }}"
      },
      "id": "response-001",
      "name": "Response",
      "type": "n8n-nodes-base.respond",
      "typeVersion": 1,
      "position": [640, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
EOF
    
    print_success "Basic workflows created."
}

# Display access information
display_access_info() {
    print_success "n8n Career Automation Setup Complete!"
    echo ""
    echo "🌐 Access Information:"
    echo "  - n8n Editor: http://localhost:5678"
    echo "  - Health Check: http://localhost:5678/healthz"
    echo ""
    echo "🔧 Management Commands:"
    echo "  - View logs: docker-compose logs -f n8n"
    echo "  - Stop service: docker-compose down"
    echo "  - Restart service: docker-compose restart n8n"
    echo "  - Update: docker-compose pull && docker-compose up -d"
    echo ""
    echo "📚 Next Steps:"
    echo "  1. Open http://localhost:5678 in your browser"
    echo "  2. Complete the n8n setup wizard"
    echo "  3. Import the career automation workflows"
    echo "  4. Configure your API keys in the .env file"
    echo "  5. Test the webhook endpoint: http://localhost:5678/webhook/career-automation"
    echo ""
    echo "📖 Documentation: See README.md for detailed usage instructions"
}

# Main setup function
main() {
    echo "🚀 n8n Career Automation Setup"
    echo "================================"
    echo ""
    
    check_prerequisites
    setup_environment
    setup_directories
    build_image
    create_volume
    start_n8n
    setup_workflows
    display_access_info
}

# Handle script arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "start")
        print_status "Starting n8n services..."
        docker-compose up -d
        print_success "Services started."
        ;;
    "stop")
        print_status "Stopping n8n services..."
        docker-compose down
        print_success "Services stopped."
        ;;
    "restart")
        print_status "Restarting n8n services..."
        docker-compose restart
        print_success "Services restarted."
        ;;
    "logs")
        docker-compose logs -f n8n
        ;;
    "update")
        print_status "Updating n8n..."
        docker-compose pull
        docker-compose up -d
        print_success "Update complete."
        ;;
    "tunnel")
        print_status "Starting tunnel service..."
        docker-compose --profile tunnel up -d ngrok
        print_success "Tunnel service started."
        ;;
    "proxy")
        print_status "Starting proxy service..."
        docker-compose --profile proxy up -d nginx
        print_success "Proxy service started."
        ;;
    "status")
        docker-compose ps
        ;;
    "cli")
        docker exec -u node -it n8n-career-automation /bin/bash
        ;;
    *)
        echo "Usage: $0 {setup|start|stop|restart|logs|update|tunnel|proxy|status|cli}"
        echo ""
        echo "Commands:"
        echo "  setup   - Initial setup (default)"
        echo "  start   - Start all services"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - View service logs"
        echo "  update  - Update n8n to latest version"
        echo "  tunnel  - Start tunnel service for external access"
        echo "  proxy   - Start reverse proxy for HTTPS"
        echo "  status  - Show service status"
        echo "  cli     - Access n8n container CLI"
        exit 1
        ;;
esac