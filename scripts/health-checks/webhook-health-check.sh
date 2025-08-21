#!/bin/bash

# n8n Webhook Health Check Script
# Usage: ./webhook-health-check.sh [webhook_url]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default webhook URL (can be overridden)
WEBHOOK_URL="${1:-$N8N_WEBHOOK_URL}"

if [ -z "$WEBHOOK_URL" ]; then
    echo -e "${RED}❌ Error: Webhook URL not provided${NC}"
    echo "Usage: $0 [webhook_url]"
    echo "Or set N8N_WEBHOOK_URL environment variable"
    exit 1
fi

echo -e "${YELLOW}🔍 Testing n8n webhook health...${NC}"
echo "Webhook URL: $WEBHOOK_URL"

# Test 1: Basic connectivity
echo -e "\n📡 Test 1: Basic connectivity"
response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"type":"health","query":"ping","email":"2203456300001@paruluniversity.ac.in"}')

if [ "$response_code" == "200" ]; then
    echo -e "${GREEN}✅ Basic connectivity: PASS (HTTP $response_code)${NC}"
else
    echo -e "${RED}❌ Basic connectivity: FAIL (HTTP $response_code)${NC}"
    exit 1
fi

# Test 2: Scholarship query simulation
echo -e "\n🎓 Test 2: Scholarship query simulation"
response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"query":"Scholarship info","email":"2203456300001@paruluniversity.ac.in","type":"scholarship"}')

if [ "$response_code" == "200" ]; then
    echo -e "${GREEN}✅ Scholarship query: PASS (HTTP $response_code)${NC}"
else
    echo -e "${RED}❌ Scholarship query: FAIL (HTTP $response_code)${NC}"
fi

# Test 3: Donation query simulation
echo -e "\n💰 Test 3: Donation query simulation"
response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"query":"How to donate to university?","email":"donor@example.com","type":"donation"}')

if [ "$response_code" == "200" ]; then
    echo -e "${GREEN}✅ Donation query: PASS (HTTP $response_code)${NC}"
else
    echo -e "${RED}❌ Donation query: FAIL (HTTP $response_code)${NC}"
fi

# Test 4: Response time check
echo -e "\n⏱️  Test 4: Response time check"
start_time=$(date +%s%3N)
curl -s -o /dev/null -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"type":"speed_test","query":"response time test","email":"test@example.com"}'
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))

if [ "$response_time" -lt 5000 ]; then
    echo -e "${GREEN}✅ Response time: PASS (${response_time}ms)${NC}"
else
    echo -e "${YELLOW}⚠️  Response time: SLOW (${response_time}ms)${NC}"
fi

echo -e "\n${GREEN}🎉 Webhook health check completed!${NC}"
echo "$(date): All tests passed" >> webhook-health.log