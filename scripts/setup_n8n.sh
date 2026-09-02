#!/bin/bash

# 🐳 n8n Setup Script - Docker-based automation platform
# This script sets up n8n for automation workflows

set -e

echo "🐳 Setting up n8n Automation Platform"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✅ SUCCESS]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ️  INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️  WARNING]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_warning "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    print_status "Docker installed. Please log out and back in for changes to take effect."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose not found. Installing..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed"
fi

# Create docker-compose file for n8n
print_info "Creating docker-compose configuration for n8n..."

cat > docker-compose.basic.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n_automation
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=false
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY:-defaultkey123}
      - N8N_USER_MANAGEMENT_DISABLED=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_VERSION_NOTIFICATIONS_ENABLED=false
      - N8N_TEMPLATES_ENABLED=true
      - N8N_PUBLIC_API_DISABLED=false
      - N8N_PERSONALIZATION_ENABLED=false
      - WEBHOOK_URL=${WEBHOOK_URL:-http://localhost:5678/}
      - N8N_METRICS=false
      - N8N_LOG_LEVEL=${LOG_LEVEL:-info}
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/home/node/.n8n/workflows
      - ./credentials:/home/node/.n8n/credentials
    networks:
      - n8n_network

volumes:
  n8n_data:
    external: false

networks:
  n8n_network:
    driver: bridge
EOF

# Create docker-compose file with reverse proxy for production
cat > docker-compose.reverse-proxy.yml << 'EOF'
version: '3.8'

services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy_reverse_proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    environment:
      - DOMAIN=${DOMAIN}
      - EMAIL=${EMAIL}
    networks:
      - n8n_network

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n_automation
    restart: unless-stopped
    expose:
      - "5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=false
      - N8N_HOST=${DOMAIN}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - N8N_USER_MANAGEMENT_DISABLED=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_VERSION_NOTIFICATIONS_ENABLED=false
      - N8N_TEMPLATES_ENABLED=true
      - N8N_PUBLIC_API_DISABLED=false
      - N8N_PERSONALIZATION_ENABLED=false
      - WEBHOOK_URL=https://${DOMAIN}/
      - N8N_METRICS=false
      - N8N_LOG_LEVEL=${LOG_LEVEL:-info}
      - N8N_TRUST_PROXY=true
    volumes:
      - n8n_data:/home/node/.n8n
      - ./workflows:/home/node/.n8n/workflows
      - ./credentials:/home/node/.n8n/credentials
    networks:
      - n8n_network
    depends_on:
      - caddy

volumes:
  n8n_data:
    external: false
  caddy_data:
    external: false
  caddy_config:
    external: false

networks:
  n8n_network:
    driver: bridge
EOF

# Create Caddyfile for reverse proxy
cat > Caddyfile << 'EOF'
{$DOMAIN} {
    tls {$EMAIL}
    
    # Handle n8n webhooks
    handle_path /webhook/* {
        reverse_proxy n8n:5678
    }
    
    # Handle n8n API
    handle_path /api/* {
        reverse_proxy n8n:5678
    }
    
    # Handle n8n static files
    handle_path /static/* {
        reverse_proxy n8n:5678
    }
    
    # Default to n8n
    handle {
        reverse_proxy n8n:5678
    }
    
    # Enable compression
    encode gzip
    
    # Security headers
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
EOF

# Create directories for workflows and credentials
mkdir -p workflows credentials

print_status "n8n Docker configuration created"
print_info "Files created:"
print_info "  - docker-compose.basic.yml (for local development)"
print_info "  - docker-compose.reverse-proxy.yml (for production with HTTPS)"
print_info "  - Caddyfile (reverse proxy configuration)"
print_info "  - workflows/ (directory for n8n workflows)"
print_info "  - credentials/ (directory for n8n credentials)"

echo ""
print_info "Next steps:"
print_info "1. Configure your .env file with N8N_ENCRYPTION_KEY"
print_info "2. For local development: docker-compose -f docker-compose.basic.yml up -d"
print_info "3. For production: docker-compose -f docker-compose.reverse-proxy.yml up -d"
print_info "4. Access n8n at http://localhost:5678 (local) or https://yourdomain.com (production)"

print_status "n8n setup completed!"