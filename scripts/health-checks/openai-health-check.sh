#!/bin/bash

# OpenAI API Health Check Script
# Usage: ./openai-health-check.sh [api_key]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API key (can be provided as argument or environment variable)
API_KEY="${1:-$OPENAI_API_KEY}"

if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ Error: OpenAI API key not provided${NC}"
    echo "Usage: $0 [api_key]"
    echo "Or set OPENAI_API_KEY environment variable"
    exit 1
fi

echo -e "${YELLOW}🤖 Testing OpenAI API health...${NC}"

# Test 1: API Connectivity
echo -e "\n📡 Test 1: API connectivity"
response=$(curl -s https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Say hi in Hinglish"}],
        "max_tokens": 50
    }')

if echo "$response" | grep -q "choices"; then
    echo -e "${GREEN}✅ API connectivity: PASS${NC}"
    
    # Extract and display the response
    content=$(echo "$response" | grep -o '"content":"[^"]*"' | sed 's/"content":"\(.*\)"/\1/')
    echo -e "${GREEN}📝 Response: $content${NC}"
else
    echo -e "${RED}❌ API connectivity: FAIL${NC}"
    echo "Response: $response"
    exit 1
fi

# Test 2: University-specific query
echo -e "\n🎓 Test 2: University context test"
response=$(curl -s https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Explain scholarship opportunities in a university setting. Reply in Hindi+English mix."}],
        "max_tokens": 100
    }')

if echo "$response" | grep -q "choices"; then
    echo -e "${GREEN}✅ University context: PASS${NC}"
else
    echo -e "${RED}❌ University context: FAIL${NC}"
    echo "Response: $response"
fi

# Test 3: Token usage check
echo -e "\n📊 Test 3: Token usage check"
usage=$(echo "$response" | grep -o '"total_tokens":[0-9]*' | sed 's/"total_tokens"://')
if [ -n "$usage" ] && [ "$usage" -lt 200 ]; then
    echo -e "${GREEN}✅ Token usage: EFFICIENT ($usage tokens)${NC}"
elif [ -n "$usage" ]; then
    echo -e "${YELLOW}⚠️  Token usage: HIGH ($usage tokens)${NC}"
else
    echo -e "${RED}❌ Token usage: UNKNOWN${NC}"
fi

# Test 4: Response time
echo -e "\n⏱️  Test 4: API response time"
start_time=$(date +%s%3N)
curl -s -o /dev/null https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Quick test"}],
        "max_tokens": 10
    }'
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))

if [ "$response_time" -lt 3000 ]; then
    echo -e "${GREEN}✅ Response time: FAST (${response_time}ms)${NC}"
elif [ "$response_time" -lt 8000 ]; then
    echo -e "${YELLOW}⚠️  Response time: MODERATE (${response_time}ms)${NC}"
else
    echo -e "${RED}❌ Response time: SLOW (${response_time}ms)${NC}"
fi

echo -e "\n${GREEN}🎉 OpenAI API health check completed!${NC}"
echo "$(date): OpenAI API test passed" >> openai-health.log