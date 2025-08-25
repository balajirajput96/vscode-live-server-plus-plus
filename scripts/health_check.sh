#!/bin/bash

# n8n Health Check Script
# Usage: ./health_check.sh

echo "=== n8n Health Check - $(date) ==="
echo ""

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker daemon is not running"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose file exists
if [ ! -f "docker-compose.n8n.yml" ]; then
    echo "❌ docker-compose.n8n.yml not found"
    exit 1
fi

echo "✅ Docker Compose file found"
echo ""

echo "=== Services Status ==="
docker-compose -f docker-compose.n8n.yml ps
echo ""

echo "=== n8n API Health Check ==="
if curl -s -f http://localhost:5678/healthz >/dev/null; then
    echo "✅ n8n API is responding"
    curl -s http://localhost:5678/healthz | jq . 2>/dev/null || echo "Response received but not JSON"
else
    echo "❌ n8n API is not responding"
fi
echo ""

echo "=== Ollama Health Check ==="
if curl -s -f http://localhost:11434/api/tags >/dev/null; then
    echo "✅ Ollama is responding"
    echo "Available models:"
    curl -s http://localhost:11434/api/tags | jq -r '.models[].name' 2>/dev/null || echo "Could not parse models list"
else
    echo "❌ Ollama is not responding"
fi
echo ""

echo "=== VPN Status Check ==="
VPN_IP=$(docker exec $(docker-compose -f docker-compose.n8n.yml ps -q gluetun) curl -s ifconfig.me 2>/dev/null)
if [ $? -eq 0 ] && [ ! -z "$VPN_IP" ]; then
    echo "✅ VPN is active - Current IP: $VPN_IP"
else
    echo "❌ VPN check failed"
fi
echo ""

echo "=== Database Status ==="
DB_STATUS=$(docker-compose -f docker-compose.n8n.yml exec -T postgres pg_isready -U n8n 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi
echo ""

echo "=== Redis Status ==="
REDIS_STATUS=$(docker-compose -f docker-compose.n8n.yml exec -T redis redis-cli ping 2>/dev/null)
if [ "$REDIS_STATUS" = "PONG" ]; then
    echo "✅ Redis is responding"
else
    echo "❌ Redis is not responding"
fi
echo ""

echo "=== Memory Usage ==="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" $(docker-compose -f docker-compose.n8n.yml ps -q)
echo ""

echo "=== Recent Logs (Last 10 lines) ==="
echo "--- n8n logs ---"
docker-compose -f docker-compose.n8n.yml logs --tail=10 n8n
echo ""

echo "=== Test Webhook ==="
if curl -s -X POST http://localhost:5678/webhook/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"test":"health-check","timestamp":"'$(date -Iseconds)'"}' >/dev/null; then
    echo "✅ Test webhook is working"
else
    echo "❌ Test webhook failed"
fi
echo ""

echo "=== Summary ==="
echo "Health check completed at $(date)"
echo "Dashboard: http://localhost:5678"
echo "For detailed logs: docker-compose -f docker-compose.n8n.yml logs -f"