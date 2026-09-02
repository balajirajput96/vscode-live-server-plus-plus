#!/usr/bin/env bash

# OpenAI API Health Check Script
# Usage: ./openai-health-check.sh [api_key]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_KEY="${1:-${OPENAI_API_KEY:-}}"
MODEL="${OPENAI_HEALTH_MODEL:-gpt-4o-mini}"
TIMEOUT="${OPENAI_HEALTH_TIMEOUT:-30}"
HEALTH_CHECK_LOG="${HEALTH_CHECK_LOG:-openai-health.log}"

if [[ -z "$API_KEY" ]]; then
    echo -e "${RED}❌ Error: OpenAI API key not provided${NC}" >&2
    echo "Usage: $0 [api_key]" >&2
    echo "Or set OPENAI_API_KEY environment variable" >&2
    exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: jq is required for JSON response validation${NC}" >&2
    exit 1
fi

tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT
failed=0

echo -e "${YELLOW}🤖 Testing OpenAI API health...${NC}"

request() {
    local payload="$1"
    local output="$2"
    local status

    if status=$(curl --silent --show-error --output "$output" \
        --write-out '%{http_code}' \
        --connect-timeout 5 --max-time "$TIMEOUT" \
        --request POST 'https://api.openai.com/v1/chat/completions' \
        --header "Authorization: Bearer $API_KEY" \
        --header 'Content-Type: application/json' \
        --data "$payload"); then
        printf '%s' "$status"
    else
        printf '000'
    fi
}

check_response() {
    local label="$1"
    local status="$2"
    local output="$3"
    local content

    if [[ "$status" =~ ^2[0-9][0-9]$ ]] && jq -e '.choices[0].message.content | strings | length > 0' "$output" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $label: PASS (HTTP $status)${NC}"
        content=$(jq -r '.choices[0].message.content' "$output" | tr '\n' ' ' | cut -c1-160)
        echo -e "${GREEN}📝 Response: $content${NC}"
        return 0
    fi

    echo -e "${RED}❌ $label: FAIL (HTTP $status)${NC}" >&2
    jq -r '.error.message // empty' "$output" 2>/dev/null | sed 's/^/Response: /' >&2 || true
    failed=1
    return 1
}

payload='{"model":"'"$MODEL"'","messages":[{"role":"user","content":"Say hi in Hinglish"}],"max_tokens":50}'
echo -e "\n📡 Test 1: API connectivity"
status=$(request "$payload" "$tmp_dir/connectivity.json")
check_response 'API connectivity' "$status" "$tmp_dir/connectivity.json" || true

echo -e "\n🎓 Test 2: University context test"
payload='{"model":"'"$MODEL"'","messages":[{"role":"user","content":"Explain scholarship opportunities in a university setting. Reply in Hindi+English mix."}],"max_tokens":100}'
status=$(request "$payload" "$tmp_dir/context.json")
check_response 'University context' "$status" "$tmp_dir/context.json" || true

usage=$(jq -r '.usage.total_tokens // empty' "$tmp_dir/context.json" 2>/dev/null || true)
echo -e "\n📊 Test 3: Token usage check"
if [[ "$usage" =~ ^[0-9]+$ ]]; then
    if (( usage < 200 )); then
        echo -e "${GREEN}✅ Token usage: EFFICIENT ($usage tokens)${NC}"
    else
        echo -e "${YELLOW}⚠️ Token usage: HIGH ($usage tokens)${NC}"
    fi
else
    echo -e "${RED}❌ Token usage: UNKNOWN${NC}"
    failed=1
fi

echo -e "\n⏱️  Test 4: API response time"
start_time=$(date +%s%3N)
payload='{"model":"'"$MODEL"'","messages":[{"role":"user","content":"Quick test"}],"max_tokens":10}'
status=$(request "$payload" "$tmp_dir/speed.json")
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))
if [[ "$status" =~ ^2[0-9][0-9]$ ]] && jq -e '.choices[0]' "$tmp_dir/speed.json" >/dev/null 2>&1 && (( response_time < 8000 )); then
    echo -e "${GREEN}✅ Response time: PASS (HTTP $status, ${response_time}ms)${NC}"
else
    echo -e "${RED}❌ Response time: FAIL (HTTP $status, ${response_time}ms)${NC}"
    failed=1
fi

if (( failed )); then
    echo -e "\n${RED}❌ OpenAI API health check failed${NC}" >&2
    printf '%s OpenAI API health check failed\n' "$(date -Is)" >> "$HEALTH_CHECK_LOG"
    exit 1
fi

echo -e "\n${GREEN}🎉 OpenAI API health check passed${NC}"
printf '%s OpenAI API health check passed\n' "$(date -Is)" >> "$HEALTH_CHECK_LOG"
