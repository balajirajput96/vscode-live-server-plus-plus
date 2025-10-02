#!/bin/bash

# 🧪 n8n + Perplexity AI Pro Integration Test Script
# This script validates the integration setup and configuration

echo "🚀 Testing n8n + Perplexity AI Pro Integration Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_env_file() {
    echo -n "📋 Checking .env.example configuration... "
    if [ -f ".env.example" ]; then
        if grep -q "N8N_IMAGE_TAG=1.108.1" .env.example && \
           grep -q "EMAIL=balaji.web.design1@gmail.com" .env.example && \
           grep -q "PERPLEXITY_API_KEY=" .env.example; then
            echo -e "${GREEN}✅ PASS${NC}"
            return 0
        else
            echo -e "${RED}❌ FAIL - Missing required configuration${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ FAIL - .env.example not found${NC}"
        return 1
    fi
}

test_documentation() {
    echo -n "📚 Checking documentation files... "
    if [ -f "n8n-perplexity-integration.md" ] && \
       [ -f "n8n-workflows/README.md" ] && \
       [ -f "README-n8n-setup.md" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL - Missing documentation files${NC}"
        return 1
    fi
}

test_workflows() {
    echo -n "🔄 Checking n8n workflow files... "
    if [ -f "n8n-workflows/perplexity-research-automation.json" ] && \
       [ -f "n8n-workflows/perplexity-content-generator.json" ]; then
        
        # Validate JSON structure
        if command -v python3 &> /dev/null; then
            python3 -m json.tool n8n-workflows/perplexity-research-automation.json > /dev/null 2>&1
            research_valid=$?
            python3 -m json.tool n8n-workflows/perplexity-content-generator.json > /dev/null 2>&1
            content_valid=$?
            
            if [ $research_valid -eq 0 ] && [ $content_valid -eq 0 ]; then
                echo -e "${GREEN}✅ PASS - Valid JSON workflows${NC}"
                return 0
            else
                echo -e "${RED}❌ FAIL - Invalid JSON in workflows${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  PASS - Files exist (JSON validation skipped - python3 not available)${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ FAIL - Missing workflow files${NC}"
        return 1
    fi
}

test_email_configuration() {
    echo -n "📧 Checking email configuration... "
    if grep -q "balaji.web.design1@gmail.com" .env.example && \
       grep -q "balaji.web.design1@gmail.com" n8n-perplexity-integration.md; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL - Email not properly configured${NC}"
        return 1
    fi
}

test_perplexity_references() {
    echo -n "🤖 Checking Perplexity AI references... "
    if grep -q "perplexity" .env.example && \
       grep -q "Perplexity" README-n8n-setup.md && \
       grep -q "perplexity.ai" n8n-perplexity-integration.md; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL - Missing Perplexity AI references${NC}"
        return 1
    fi
}

show_setup_instructions() {
    echo ""
    echo "📋 Next Steps for Complete Setup:"
    echo "================================="
    echo "1. Copy .env.example to .env:"
    echo "   cp .env.example .env"
    echo ""
    echo "2. Get your Perplexity AI Pro API key:"
    echo "   - Login to perplexity.ai with balaji.web.design1@gmail.com"
    echo "   - Navigate to API settings"
    echo "   - Generate and copy your API key"
    echo ""
    echo "3. Update .env file:"
    echo "   - Replace 'your_perplexity_pro_api_key_here' with your actual API key"
    echo "   - Set your domain and other configuration"
    echo ""
    echo "4. Start n8n:"
    echo "   docker compose --env-file .env -f docker-compose.basic.yml up -d"
    echo ""
    echo "5. Import workflows:"
    echo "   - Open http://localhost:5678"
    echo "   - Import n8n-workflows/*.json files"
    echo "   - Configure credentials as described in documentation"
    echo ""
    echo "📖 For detailed instructions, see: n8n-perplexity-integration.md"
}

# Run all tests
echo ""
passed=0
total=0

tests=(
    "test_env_file"
    "test_documentation" 
    "test_workflows"
    "test_email_configuration"
    "test_perplexity_references"
)

for test in "${tests[@]}"; do
    total=$((total + 1))
    if $test; then
        passed=$((passed + 1))
    fi
done

echo ""
echo "=================================================="
echo "🧪 Test Results: $passed/$total tests passed"

if [ $passed -eq $total ]; then
    echo -e "${GREEN}🎉 All tests passed! Integration setup is complete.${NC}"
    show_setup_instructions
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review and fix the issues.${NC}"
    exit 1
fi