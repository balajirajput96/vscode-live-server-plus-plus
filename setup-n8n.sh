#!/bin/bash

# 🚀 n8n Career Automation Setup Script
# This script helps you quickly set up the n8n automation system

set -e

echo "🚀 AI Career Automation System Setup"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    
    # Generate a random encryption key
    if command -v openssl &> /dev/null; then
        ENCRYPTION_KEY=$(openssl rand -base64 32)
        # Escape special characters for sed
        ENCRYPTION_KEY_ESCAPED=$(echo "$ENCRYPTION_KEY" | sed 's/[[\.*^$()+?{|]/\\&/g')
        sed -i "s/CHANGE_ME_TO_STRONG_32_CHAR_KEY/$ENCRYPTION_KEY_ESCAPED/" .env
        echo "✅ Generated encryption key automatically"
    else
        echo "⚠️  Please manually set N8N_ENCRYPTION_KEY in .env file"
    fi
    
    echo "📝 Please edit .env file to configure:"
    echo "   - VPN credentials (if using VPN features)"
    echo "   - Database passwords"
    echo "   - Other service settings"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Ask user if they want to start the system
read -p "🚀 Start the automation system now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting AI Career Automation System..."
    echo ""
    
    # Pull latest images
    echo "📦 Pulling latest Docker images..."
    docker compose pull
    
    # Start the system
    echo "🚀 Starting all services..."
    docker compose up -d
    
    echo ""
    echo "⏳ Waiting for services to start..."
    sleep 10
    
    # Check status
    echo "📊 Service Status:"
    docker compose ps
    
    echo ""
    echo "✅ Setup Complete!"
    echo ""
    echo "🌐 Access Points:"
    echo "   - n8n Interface: http://localhost:5678"
    echo "   - Ollama AI API: http://localhost:11434"
    echo "   - HTTP Proxy: http://localhost:8888 (if VPN enabled)"
    echo ""
    echo "📚 Next Steps:"
    echo "   1. Open http://localhost:5678 to access n8n"
    echo "   2. Create your first workflow"
    echo "   3. Import sample workflows from ./workflows/ directory"
    echo "   4. Configure API connections for your services"
    echo ""
    echo "📖 For detailed setup instructions, see: README-n8n-setup.md"
    echo ""
    
    # Ask if user wants to open n8n
    read -p "🌐 Open n8n in browser now? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:5678
        elif command -v open &> /dev/null; then
            open http://localhost:5678
        else
            echo "Please open http://localhost:5678 in your browser"
        fi
    fi
    
else
    echo "📝 Configuration complete. Run 'docker compose up -d' when ready to start."
fi

echo ""
echo "🎯 Happy Automating! 🎯"