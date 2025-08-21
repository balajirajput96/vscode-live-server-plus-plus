#!/bin/bash

# OpenAI API Health Check Script
# Usage: ./openai-health-check.sh [api_key]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Key (can be overridden)
API_KEY="${1:-${OPENAI_API_KEY}}"

if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ Error: OPENAI_API_KEY not provided${NC}"
    echo "Usage: $0 [api_key]"
    echo "Or set OPENAI_API_KEY environment variable"
    exit 1
fi

echo -e "${YELLOW}🔍 Testing OpenAI API health...${NC}"
echo "Using API key: ${API_KEY:0:8}***"

# Test API connectivity
echo -e "\n${YELLOW}📡 Testing API connectivity...${NC}"
RESPONSE=$(curl -s -w "%{http_code}" https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Say hi in Hinglish in exactly 5 words"
            }
        ],
        "max_tokens": 20
    }' \
    --max-time 30) || {
    echo -e "${RED}❌ API request failed${NC}"
    exit 1
}

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ OpenAI API responding (HTTP $HTTP_CODE)${NC}"
    
    # Extract the response content
    CONTENT=$(echo "$BODY" | grep -o '"content":"[^"]*"' | sed 's/"content":"//' | sed 's/"$//')
    if [ -n "$CONTENT" ]; then
        echo -e "${GREEN}📝 AI Response: $CONTENT${NC}"
    else
        echo -e "${YELLOW}⚠️ Response received but no content extracted${NC}"
        echo "Full response: $BODY"
    fi
else
    echo -e "${RED}❌ OpenAI API failed (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
    
    # Check for common error codes
    if [ "$HTTP_CODE" = "401" ]; then
        echo -e "${RED}🔑 Authentication failed - check your API key${NC}"
    elif [ "$HTTP_CODE" = "429" ]; then
        echo -e "${YELLOW}⏳ Rate limit exceeded - try again later${NC}"
    elif [ "$HTTP_CODE" = "402" ]; then
        echo -e "${RED}💳 Insufficient credits - check your OpenAI billing${NC}"
    fi
    exit 1
fi

echo -e "\n${GREEN}✅ OpenAI health check completed${NC}"