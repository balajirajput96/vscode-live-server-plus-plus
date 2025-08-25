#!/bin/bash

# Career Automation Setup Script
# This script sets up the n8n career automation system

set -e

echo "🚀 Career Automation System Setup"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker is installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate encryption key
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    sed -i.bak "s/your-encryption-key-here/$ENCRYPTION_KEY/" .env
    rm .env.bak 2>/dev/null || true
    
    echo "🔑 Generated encryption key"
    echo "📝 Please edit .env file and configure your email and other settings"
else
    echo "✅ .env file already exists"
fi

# Create workflows directory if it doesn't exist
if [ ! -d workflows ]; then
    mkdir -p workflows
    echo "📁 Created workflows directory"
fi

# Start the system
echo "🚀 Starting n8n automation system..."
docker compose --env-file .env -f docker-compose.basic.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if n8n is running
if curl -s http://localhost:5678 > /dev/null; then
    echo "✅ n8n is running successfully!"
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo "📱 Access n8n: http://localhost:5678"
    echo "📚 Setup Guide: CAREER_AUTOMATION_SETUP.md"
    echo "📋 Action Plan: career-automation-system/ACTION_PLAN.md"
    echo ""
    echo "Next Steps:"
    echo "1. Open http://localhost:5678 in your browser"
    echo "2. Create your admin account"
    echo "3. Import workflows from the workflows/ directory"
    echo "4. Configure Google Sheets integration"
    echo "5. Start automating your career development!"
else
    echo "❌ n8n failed to start. Check logs with:"
    echo "docker compose logs n8n"
fi