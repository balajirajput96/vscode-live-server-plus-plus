#!/bin/bash

# 📊 Quick Status Check Script
# Fast overview of system health

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=== Quick Status Check ==="
echo "Time: $(date)"
echo ""

# Docker Status
echo -n "Docker: "
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not Running${NC}"
fi

# n8n Status
echo -n "n8n: "
if curl -f -s http://localhost:5678/healthz > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Responding${NC}"
else
    echo -e "${RED}❌ Not Responding${NC}"
fi

# Container Status
echo -n "n8n Container: "
if docker ps | grep -q "n8n-master"; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Stopped${NC}"
fi

# VPN Status (if available)
echo -n "VPN: "
if command -v tailscale > /dev/null 2>&1; then
    if tailscale status | grep -q "100\."; then
        echo -e "${GREEN}✅ Connected${NC}"
    else
        echo -e "${YELLOW}⚠️ Disconnected${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Not Installed${NC}"
fi

# Disk Usage
echo -n "Disk Usage: "
disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -lt 80 ]; then
    echo -e "${GREEN}${disk_usage}%${NC}"
elif [ "$disk_usage" -lt 90 ]; then
    echo -e "${YELLOW}${disk_usage}%${NC}"
else
    echo -e "${RED}${disk_usage}%${NC}"
fi

# Memory Usage
echo -n "Memory Usage: "
mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$mem_usage" -lt 80 ]; then
    echo -e "${GREEN}${mem_usage}%${NC}"
elif [ "$mem_usage" -lt 90 ]; then
    echo -e "${YELLOW}${mem_usage}%${NC}"
else
    echo -e "${RED}${mem_usage}%${NC}"
fi

# Recent Health Check
echo -n "Last Health Check: "
if [ -f "logs/health-summary.log" ]; then
    last_check=$(tail -n 20 logs/health-summary.log | grep "Date:" | tail -1 | cut -d' ' -f2-)
    echo "$last_check"
else
    echo -e "${YELLOW}Never run${NC}"
fi

echo ""
echo "=== Quick Actions ==="
echo "Run full health check: ./comprehensive_health_check.sh"
echo "View n8n logs: docker logs n8n-master -f"
echo "Emergency recovery: ./scripts/emergency_recovery.sh"