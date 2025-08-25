#!/bin/bash

# Balaji's n8n Complete Setup Script
# This script sets up the complete n8n automation system

echo "🚀 Starting Balaji's n8n Complete Setup..."
echo "📧 Primary Email: balaji.web.design1@gmail.com"
echo "🎓 University Email: 22034563001@paruluniversity.ac.in"
echo "🆔 Instance ID: 8f75859920be976c80a11c1dd4be8852c698c893b1073cb8716ee93cd8d6a3c9"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p {workflows,credentials,custom-nodes,models,backups,vpn-config}

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment configuration..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your specific settings before continuing."
    echo "🔑 Generate encryption key with: openssl rand -base64 32"
    read -p "Press Enter after configuring .env file..."
fi

# Check if .env is configured
if grep -q "your-encryption-key-here" .env; then
    echo "❌ Please configure .env file first!"
    exit 1
fi

# Start the services
echo "🐳 Starting Docker services..."

# Ask user for deployment type
echo "📋 Choose deployment type:"
echo "1) Local development (no HTTPS)"
echo "2) Production with HTTPS and Caddy"
read -p "Enter choice (1 or 2): " deployment_choice

case $deployment_choice in
    1)
        echo "🔧 Starting local development environment..."
        docker-compose --env-file .env -f docker-compose.basic.yml up -d
        ENDPOINT="http://localhost:5678"
        ;;
    2)
        echo "🔧 Starting production environment with HTTPS..."
        docker-compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
        ENDPOINT="https://$(grep DOMAIN .env | cut -d '=' -f2)"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check if n8n is running
echo "🔍 Checking n8n status..."
if docker ps | grep -q "n8n"; then
    echo "✅ n8n container is running"
else
    echo "❌ n8n container failed to start"
    docker logs n8n
    exit 1
fi

# Check if PostgreSQL is running
if docker ps | grep -q "n8n-postgres"; then
    echo "✅ PostgreSQL container is running"
else
    echo "❌ PostgreSQL container failed to start"
    docker logs n8n-postgres
    exit 1
fi

# Import workflow
echo "📥 Importing Balaji's complete automation workflow..."
if [ -f "workflows/balaji-complete-automation.json" ]; then
    echo "✅ Workflow file found"
    echo "📋 Please import workflow manually from n8n web interface:"
    echo "   1. Go to $ENDPOINT"
    echo "   2. Login with balaji.web.design1@gmail.com"
    echo "   3. Go to Workflows → Import"
    echo "   4. Upload workflows/balaji-complete-automation.json"
else
    echo "❌ Workflow file not found"
fi

# Setup AI models
echo "🤖 Setting up Local AI models..."
if [ -d "models" ]; then
    echo "📁 Models directory exists"
    echo "📥 Please download AI models manually:"
    echo "   - Gemma 3n model → models/gemma-3n/"
    echo "   - SHAKTI model → models/shakti/"
else
    echo "❌ Models directory not found"
fi

# VPN Configuration
echo "🔒 Setting up VPN configuration..."
if [ -d "vpn-config" ]; then
    echo "📁 VPN config directory exists"
    echo "⚙️  Please configure VPN settings in .env file"
else
    echo "❌ VPN config directory not found"
fi

# Display final information
echo ""
echo "🎉 Setup Complete!"
echo "════════════════════════════════════════════"
echo "📊 n8n Dashboard: $ENDPOINT"
echo "📧 Primary Email: balaji.web.design1@gmail.com"
echo "🎓 University Email: 22034563001@paruluniversity.ac.in"
echo "🆔 Instance ID: 8f75859920be976c80a11c1dd4be8852c698c893b1073cb8716ee93cd8d6a3c9"
echo "🔧 Version: 1.108.1"
echo ""
echo "📋 Next Steps:"
echo "1. Access $ENDPOINT"
echo "2. Create account with balaji.web.design1@gmail.com"
echo "3. Import workflow from workflows/balaji-complete-automation.json"
echo "4. Configure credentials for Gmail accounts"
echo "5. Download and install AI models"
echo "6. Test all workflow components"
echo "7. Verify email notifications"
echo ""
echo "📚 Documentation:"
echo "- Setup Guide: portfolio-automation-system/QUICK_START_GUIDE.md"
echo "- n8n Documentation: README-n8n-setup.md"
echo "- GitHub Automation: portfolio-automation-system/prompts/"
echo ""
echo "🔧 Useful Commands:"
echo "- View logs: docker logs n8n"
echo "- Stop services: docker-compose down"
echo "- Restart services: docker-compose restart"
echo "- Check status: docker ps"
echo ""
echo "🎯 Success! Your n8n automation system is ready!"
echo "📧 You will receive email confirmations once workflows are active."