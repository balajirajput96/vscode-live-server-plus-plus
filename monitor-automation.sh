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
free -h 2>/dev/null || vm_stat

# Check recent n8n logs
echo ""
echo "📋 Recent n8n Logs (last 10 lines):"
docker-compose logs --tail=10 n8n 2>/dev/null || echo "n8n container not running"

echo ""
echo "✅ Status check complete!"