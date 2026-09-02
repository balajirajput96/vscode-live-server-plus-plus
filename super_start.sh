#!/bin/bash

# 🚀 Super Start Script - AI Career Automation System
# यह script आपके पूरे automation system को start करता है

set -e  # Exit on any error

echo "🚀 AI Career Automation System - Super Start"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✅ SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️  WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌ ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ️  INFO]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    print_info "Please copy .env.template to .env and configure your settings:"
    print_info "cp .env.template .env"
    print_info "nano .env"
    exit 1
fi

print_info "Loading environment variables from .env..."
source .env

# Check required environment variables
required_vars=("N8N_ENCRYPTION_KEY" "DOMAIN" "EMAIL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_warning "$var is not set in .env file"
    fi
done

print_info "Starting AI Career Automation System components..."

# 1. Start Docker services if available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    print_info "Starting Docker services..."
    
    # Check if n8n docker-compose file exists
    if [ -f "docker-compose.yml" ] || [ -f "docker-compose.basic.yml" ]; then
        print_info "Starting n8n automation platform..."
        
        # Use appropriate docker-compose file
        if [ -f "docker-compose.yml" ]; then
            docker-compose --env-file .env up -d
        elif [ -f "docker-compose.basic.yml" ]; then
            docker-compose --env-file .env -f docker-compose.basic.yml up -d
        fi
        
        print_status "n8n is starting... Please wait 30 seconds for full initialization"
        sleep 10
        
        # Wait for n8n to be ready
        max_attempts=30
        attempt=1
        while [ $attempt -le $max_attempts ]; do
            if curl -s http://localhost:5678 > /dev/null 2>&1; then
                print_status "n8n is ready at http://localhost:5678"
                break
            fi
            echo -n "."
            sleep 2
            ((attempt++))
        done
        
        if [ $attempt -gt $max_attempts ]; then
            print_warning "n8n is taking longer than expected to start"
        fi
    else
        print_warning "No docker-compose files found. Creating basic n8n setup..."
        ./scripts/setup_n8n.sh
    fi
else
    print_warning "Docker not found. Skipping Docker services..."
fi

# 2. Start local development server for career automation
print_info "Starting local development server..."
if [ -f "index.html" ]; then
    # Start a simple HTTP server for the career automation dashboard
    if command -v python3 &> /dev/null; then
        print_info "Starting Python HTTP server on port 3000..."
        nohup python3 -m http.server 3000 > server.log 2>&1 &
        echo $! > server.pid
        print_status "Career automation dashboard available at http://localhost:3000"
    elif command -v node &> /dev/null; then
        print_info "Starting Node.js HTTP server..."
        if [ ! -f "package.json" ]; then
            npm init -y > /dev/null 2>&1
            npm install http-server --save-dev > /dev/null 2>&1
        fi
        nohup npx http-server -p 3000 > server.log 2>&1 &
        echo $! > server.pid
        print_status "Career automation dashboard available at http://localhost:3000"
    else
        print_warning "No web server available. Please open index.html manually in browser"
    fi
fi

# 3. Start background services
print_info "Starting background automation services..."

# Start job monitoring service
if [ -f "scripts/job_monitor.sh" ]; then
    print_info "Starting job monitoring service..."
    nohup ./scripts/job_monitor.sh > job_monitor.log 2>&1 &
    echo $! > job_monitor.pid
    print_status "Job monitoring service started"
fi

# Start social media automation
if [ -f "scripts/social_media_automation.sh" ]; then
    print_info "Starting social media automation..."
    nohup ./scripts/social_media_automation.sh > social_media.log 2>&1 &
    echo $! > social_media.pid
    print_status "Social media automation started"
fi

# 4. Start VPN if configured
if [ -n "$VPN_CONFIG" ] && [ -f "$VPN_CONFIG" ]; then
    print_info "Starting VPN connection..."
    if command -v openvpn &> /dev/null; then
        sudo openvpn --config "$VPN_CONFIG" --daemon
        print_status "VPN connection started"
    else
        print_warning "OpenVPN not found. Please install OpenVPN to use VPN features"
    fi
fi

# 5. Schedule automated tasks
print_info "Setting up automated tasks..."
./scripts/setup_automation.sh

echo ""
echo "🎉 AI Career Automation System Started Successfully!"
echo "=================================================="
echo ""
print_status "Services running:"
echo "  📊 Career Dashboard: http://localhost:3000"
echo "  🤖 n8n Automation: http://localhost:5678"
echo "  📈 Job Tracking: http://localhost:3000/Job_Tracking_System.html"
echo ""
print_info "Next steps:"
echo "  1. Open http://localhost:5678 to setup n8n workflows"
echo "  2. Open http://localhost:3000 to access career dashboard"
echo "  3. Run './comprehensive_health_check.sh' to verify system health"
echo ""
print_info "Logs are available in:"
echo "  - server.log (web server)"
echo "  - job_monitor.log (job monitoring)"
echo "  - social_media.log (social media automation)"
echo ""
print_warning "To stop all services, run: ./scripts/stop_all.sh"