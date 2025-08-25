#!/bin/bash

# n8n Quick Setup Script
# Usage: ./quick_setup.sh

set -e

echo "🚀 n8n Complete Setup - Starting..."
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is required but not installed"
    echo "Please install Docker Compose first"
    exit 1
fi

echo "✅ Docker and Docker Compose are available"
echo ""

# Generate encryption key if not exists
if [ ! -f ".env" ]; then
    echo "🔑 Generating encryption key..."
    ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    
    # Create .env file from template
    cp .env.n8n.example .env
    sed -i "s/CHANGE_ME_TO_STRONG_32_CHAR_KEY/$ENCRYPTION_KEY/g" .env
    
    echo "✅ Environment file created with secure encryption key"
    echo "⚠️  IMPORTANT: Backup your encryption key: $ENCRYPTION_KEY"
else
    echo "✅ Environment file already exists"
fi
echo ""

# Create workflows directory
mkdir -p workflows
echo "✅ Workflows directory ready"
echo ""

# Pull images
echo "📥 Pulling Docker images..."
docker-compose -f docker-compose.n8n.yml pull
echo ""

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.n8n.yml up -d
echo ""

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if n8n is ready
echo "🔍 Checking n8n status..."
for i in {1..12}; do
    if curl -s -f http://localhost:5678/healthz >/dev/null 2>&1; then
        echo "✅ n8n is ready!"
        break
    else
        echo "⏳ Waiting for n8n... (attempt $i/12)"
        sleep 10
    fi
    
    if [ $i -eq 12 ]; then
        echo "❌ n8n failed to start within 2 minutes"
        echo "Check logs: docker-compose -f docker-compose.n8n.yml logs n8n"
        exit 1
    fi
done
echo ""

# Setup Ollama models
echo "🤖 Setting up AI models..."
echo "Pulling Gemma 2B model (this may take a few minutes)..."
docker-compose -f docker-compose.n8n.yml exec ollama ollama pull gemma2:2b-instruct-q4_K_M

echo "Pulling Phi3 model as backup..."
docker-compose -f docker-compose.n8n.yml exec ollama ollama pull phi3:3.8b-mini-instruct-4k-fp16

echo "✅ AI models ready"
echo ""

# Import workflows
echo "📂 Importing sample workflows..."
if [ -f "workflows/complete-test-workflow.json" ]; then
    docker-compose -f docker-compose.n8n.yml exec n8n n8n import:workflow --input=/data/workflows/complete-test-workflow.json || true
fi

if [ -f "workflows/error-handling-workflow.json" ]; then
    docker-compose -f docker-compose.n8n.yml exec n8n n8n import:workflow --input=/data/workflows/error-handling-workflow.json || true
fi

echo "✅ Workflows imported"
echo ""

# Final health check
echo "🏥 Running final health check..."
./scripts/health_check.sh || true
echo ""

echo "🎉 n8n Setup Complete!"
echo ""
echo "📊 Access your n8n dashboard: http://localhost:5678"
echo "🤖 Ollama AI API: http://localhost:11434"
echo "🔒 VPN Proxy: http://localhost:8888"
echo ""
echo "📝 Next steps:"
echo "1. Open http://localhost:5678 in your browser"
echo "2. Create your n8n account"
echo "3. Configure Google OAuth credentials if needed"
echo "4. Test the sample workflows"
echo "5. Set up your VPN credentials in Gluetun service"
echo ""
echo "📚 Documentation: See n8n-complete-setup-guide.md"
echo "🔧 Troubleshooting: Run ./scripts/health_check.sh"
echo ""
echo "⚠️  REMEMBER: Backup your encryption key and .env file!"

# Show encryption key reminder
if [ -f ".env" ]; then
    ENCRYPTION_KEY=$(grep "N8N_ENCRYPTION_KEY=" .env | cut -d'=' -f2)
    echo ""
    echo "🔑 Your encryption key: $ENCRYPTION_KEY"
    echo "   Store this safely - you'll need it for backups/migrations!"
fi