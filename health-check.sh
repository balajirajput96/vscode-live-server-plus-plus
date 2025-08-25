#!/bin/bash

# 🔍 n8n Career Automation Health Check Script
# This script checks the status of all automation services

echo "🔍 AI Career Automation - Health Check"
echo "======================================"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check service status
echo "📊 Service Status:"
echo "------------------"
docker compose ps

echo ""

# Check individual service health
services=("postgres" "redis" "ollama" "n8n" "gluetun")

for service in "${services[@]}"; do
    if docker compose ps --services --filter "status=running" | grep -q "^${service}$"; then
        echo "✅ $service: Running"
    else
        echo "❌ $service: Not running"
    fi
done

echo ""

# Check ports
echo "🌐 Port Accessibility:"
echo "---------------------"

ports=("5678:n8n Interface" "11434:Ollama AI" "8888:HTTP Proxy")

for port_info in "${ports[@]}"; do
    port=$(echo $port_info | cut -d: -f1)
    service=$(echo $port_info | cut -d: -f2)
    
    if nc -z localhost $port 2>/dev/null; then
        echo "✅ $service (port $port): Accessible"
    else
        echo "❌ $service (port $port): Not accessible"
    fi
done

echo ""

# Check database connection
echo "🗄️  Database Health:"
echo "-------------------"
if docker compose exec -T postgres pg_isready -U n8n &> /dev/null; then
    echo "✅ PostgreSQL: Ready for connections"
else
    echo "❌ PostgreSQL: Not ready"
fi

# Check Redis
if docker compose exec -T redis redis-cli ping &> /dev/null; then
    echo "✅ Redis: Responding to ping"
else
    echo "❌ Redis: Not responding"
fi

echo ""

# Check disk usage
echo "💾 Storage Usage:"
echo "-----------------"
docker system df

echo ""

# Check logs for errors (last 10 lines)
echo "📋 Recent Error Logs:"
echo "--------------------"
if docker compose logs --tail=10 2>&1 | grep -i error | head -5; then
    echo "⚠️  Found recent errors (check full logs with: docker compose logs)"
else
    echo "✅ No recent errors found"
fi

echo ""
echo "🔗 Quick Access Links:"
echo "---------------------"
echo "n8n Interface: http://localhost:5678"
echo "Ollama AI API: http://localhost:11434"
echo "HTTP Proxy: http://localhost:8888"

echo ""
echo "📝 Useful Commands:"
echo "-------------------"
echo "View logs: docker compose logs -f [service]"
echo "Restart service: docker compose restart [service]"
echo "Stop all: docker compose down"
echo "Update all: docker compose pull && docker compose up -d"

echo ""
echo "Health check complete! 🏥"