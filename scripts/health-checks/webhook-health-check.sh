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
WEBHOOK_URL="${1:-${N8N_WEBHOOK_URL}}"

if [ -z "$WEBHOOK_URL" ]; then
    echo -e "${RED}❌ Error: N8N_WEBHOOK_URL not provided${NC}"
    echo "Usage: $0 [webhook_url]"
    echo "Or set N8N_WEBHOOK_URL environment variable"
    exit 1
fi

echo -e "${YELLOW}🔍 Testing n8n webhook health...${NC}"
echo "URL: $WEBHOOK_URL"

# Test basic ping
echo -e "\n${YELLOW}📡 Testing basic connectivity...${NC}"
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"type":"health","query":"ping","email":"2203456300001@paruluniversity.ac.in"}' \
    --max-time 10) || {
    echo -e "${RED}❌ Connection failed${NC}"
    exit 1
}

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Webhook responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Webhook returned HTTP $HTTP_CODE${NC}"
    echo "Response: $BODY"
fi

# Test with actual query
echo -e "\n${YELLOW}📝 Testing query processing...${NC}"
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"query":"Scholarship info","email":"2203456300001@paruluniversity.ac.in","type":"test"}' \
    --max-time 30) || {
    echo -e "${RED}❌ Query test failed${NC}"
    exit 1
}

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Query processing working (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED}❌ Query processing failed (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
fi

echo -e "\n${GREEN}✅ Health check completed${NC}"