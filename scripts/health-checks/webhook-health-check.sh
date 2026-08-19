#!/usr/bin/env bash

# n8n Webhook Health Check Script
# Usage: ./webhook-health-check.sh [webhook_url]

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

WEBHOOK_URL="${1:-${N8N_WEBHOOK_URL:-}}"
HEALTH_CHECK_EMAIL="${HEALTH_CHECK_EMAIL:-health-check@example.com}"
HEALTH_CHECK_TIMEOUT="${HEALTH_CHECK_TIMEOUT:-15}"
HEALTH_CHECK_LOG="${HEALTH_CHECK_LOG:-webhook-health.log}"

if [[ -z "$WEBHOOK_URL" ]]; then
    echo -e "${RED}❌ Error: Webhook URL not provided${NC}" >&2
    echo "Usage: $0 [webhook_url]" >&2
    echo "Or set N8N_WEBHOOK_URL environment variable" >&2
    exit 1
fi

# Never print the full URL: n8n webhook URLs may contain a secret token.
echo -e "${YELLOW}🔍 Testing n8n webhook health...${NC}"

post_json() {
    local payload="$1"
    curl --silent --show-error --output /dev/null \
        --write-out '%{http_code}' \
        --connect-timeout 5 --max-time "$HEALTH_CHECK_TIMEOUT" \
        --request POST "$WEBHOOK_URL" \
        --header 'Content-Type: application/json' \
        --data "$payload"
}

is_success() {
    [[ "$1" =~ ^2[0-9][0-9]$ ]]
}

failed=0

run_case() {
    local label="$1"
    local payload="$2"
    local response_code

    echo -e "\n${YELLOW}$label${NC}"
    if response_code=$(post_json "$payload"); then
        :
    else
        response_code=000
    fi

    if is_success "$response_code"; then
        echo -e "${GREEN}✅ PASS (HTTP $response_code)${NC}"
    else
        echo -e "${RED}❌ FAIL (HTTP $response_code)${NC}"
        failed=1
    fi
}

run_case '📡 Test 1: Basic connectivity' \
    "{\"type\":\"health\",\"query\":\"ping\",\"email\":\"$HEALTH_CHECK_EMAIL\"}"
run_case '🎓 Test 2: Scholarship query simulation' \
    "{\"query\":\"Scholarship info\",\"email\":\"$HEALTH_CHECK_EMAIL\",\"type\":\"scholarship\"}"
run_case '💰 Test 3: Donation query simulation' \
    "{\"query\":\"How to donate to university?\",\"email\":\"$HEALTH_CHECK_EMAIL\",\"type\":\"donation\"}"

echo -e "\n⏱️  Test 4: Response time check"
start_time=$(date +%s%3N)
if response_code=$(post_json "{\"type\":\"speed_test\",\"query\":\"response time test\",\"email\":\"$HEALTH_CHECK_EMAIL\"}"); then
    :
else
    response_code=000
fi
end_time=$(date +%s%3N)
response_time=$((end_time - start_time))

if ! is_success "$response_code"; then
    echo -e "${RED}❌ FAIL (HTTP $response_code, ${response_time}ms)${NC}"
    failed=1
elif (( response_time < 5000 )); then
    echo -e "${GREEN}✅ PASS (HTTP $response_code, ${response_time}ms)${NC}"
else
    echo -e "${RED}❌ FAIL: response too slow (HTTP $response_code, ${response_time}ms)${NC}"
    failed=1
fi

if (( failed )); then
    echo -e "\n${RED}❌ Webhook health check failed${NC}" >&2
    printf '%s webhook health check failed\n' "$(date -Is)" >> "$HEALTH_CHECK_LOG"
    exit 1
fi

echo -e "\n${GREEN}🎉 Webhook health check passed${NC}"
printf '%s webhook health check passed\n' "$(date -Is)" >> "$HEALTH_CHECK_LOG"
