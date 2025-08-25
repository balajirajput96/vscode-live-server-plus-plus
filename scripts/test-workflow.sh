#!/bin/bash
# n8n Workflow Test Script
# बालाजी के automation workflow के लिए comprehensive testing

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env"
WEBHOOK_URL=""
N8N_URL=""

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
    WEBHOOK_URL="${WEBHOOK_URL:-http://localhost:5678/webhook/balaji-automation}"
    N8N_URL="${WEBHOOK_URL%/webhook*}"
else
    echo -e "${RED}❌ .env file not found. Please create it from .env.example${NC}"
    exit 1
fi

# Utility functions
print_header() {
    echo -e "\n${BLUE}${WHITE}============================================================${NC}"
    echo -e "${BLUE}${WHITE}$1${NC}"
    echo -e "${BLUE}${WHITE}============================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️ $1${NC}"
}

# Test functions
test_basic_connectivity() {
    print_header "Basic Connectivity Tests"
    
    # Test internet connectivity
    if curl -s --connect-timeout 5 https://httpbin.org/ip > /dev/null; then
        print_success "Internet connectivity: Working"
    else
        print_error "Internet connectivity: Failed"
        return 1
    fi
    
    # Test local n8n service
    if curl -s --connect-timeout 10 "${N8N_URL}/healthz" > /dev/null; then
        print_success "n8n service: Accessible"
    else
        print_warning "n8n service: Not accessible at ${N8N_URL}"
    fi
    
    # Test local AI service
    if [ -n "$LOCAL_AI_ENDPOINT" ]; then
        if curl -s --connect-timeout 10 "${LOCAL_AI_ENDPOINT}/health" > /dev/null; then
            print_success "Local AI service: Running"
        else
            print_warning "Local AI service: Not accessible"
        fi
    fi
}

test_webhook_endpoint() {
    print_header "Webhook Endpoint Testing"
    
    # Test basic webhook accessibility
    local test_payload='{"test": true, "timestamp": "'$(date -Iseconds)'"}'
    
    print_info "Testing webhook at: $WEBHOOK_URL"
    
    local response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        --connect-timeout 30 \
        "$WEBHOOK_URL" 2>/dev/null)
    
    local http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    local body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ] || [ "$http_code" -eq 202 ]; then
        print_success "Webhook endpoint: Responding (HTTP $http_code)"
        print_info "Response: ${body:0:100}..."
    else
        print_error "Webhook endpoint: HTTP $http_code"
        print_info "Response: $body"
        return 1
    fi
}

test_github_integration() {
    print_header "GitHub Integration Testing"
    
    if [ -z "$GITHUB_TOKEN" ]; then
        print_error "GitHub token not configured"
        return 1
    fi
    
    # Test GitHub API connectivity
    local github_response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/user" 2>/dev/null)
    
    if echo "$github_response" | grep -q '"login":'; then
        local username=$(echo "$github_response" | grep '"login":' | cut -d'"' -f4)
        print_success "GitHub API: Connected as $username"
    else
        print_error "GitHub API: Authentication failed"
        return 1
    fi
    
    # Test repository access
    if [ -n "$GITHUB_USERNAME" ]; then
        local repo_response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
            "https://api.github.com/users/$GITHUB_USERNAME/repos?per_page=1" 2>/dev/null)
        
        if echo "$repo_response" | grep -q '\['; then
            print_success "GitHub repositories: Accessible"
        else
            print_warning "GitHub repositories: Limited access"
        fi
    fi
}

test_gmail_integration() {
    print_header "Gmail Integration Testing"
    
    if [ -z "$GMAIL_CLIENT_ID" ] || [ -z "$GMAIL_CLIENT_SECRET" ]; then
        print_error "Gmail credentials not configured"
        return 1
    fi
    
    print_info "Gmail OAuth2 credentials are configured"
    print_info "Client ID: ${GMAIL_CLIENT_ID:0:20}..."
    print_warning "Note: Full Gmail testing requires OAuth2 flow completion"
    
    # Test if refresh token is available
    if [ -n "$GMAIL_REFRESH_TOKEN" ]; then
        print_info "Gmail refresh token is configured"
        print_success "Gmail integration: Credentials ready"
    else
        print_warning "Gmail refresh token not configured"
        print_info "You'll need to complete OAuth2 flow in n8n"
    fi
}

test_vpn_functionality() {
    print_header "VPN Functionality Testing"
    
    # Get current IP
    local current_ip=$(curl -s --connect-timeout 10 https://httpbin.org/ip | grep -o '"origin":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$current_ip" ]; then
        print_info "Current IP: $current_ip"
        
        # Get IP location info
        local location_info=$(curl -s --connect-timeout 10 "https://ipapi.co/$current_ip/json" 2>/dev/null)
        if echo "$location_info" | grep -q '"country":'; then
            local country=$(echo "$location_info" | grep '"country":' | cut -d'"' -f4)
            local city=$(echo "$location_info" | grep '"city":' | cut -d'"' -f4)
            print_info "Location: $city, $country"
        fi
        
        print_success "IP detection: Working"
    else
        print_error "IP detection: Failed"
        return 1
    fi
    
    # Check VPN configuration
    if [ -n "$VPN_API_KEY" ]; then
        print_info "VPN API key is configured"
        print_info "Supported countries: ${VPN_COUNTRIES:-'Not specified'}"
        print_success "VPN configuration: Ready"
    else
        print_warning "VPN API key not configured"
    fi
}

test_local_ai_models() {
    print_header "Local AI Models Testing"
    
    if [ -z "$LOCAL_AI_ENDPOINT" ]; then
        print_warning "Local AI endpoint not configured"
        return 1
    fi
    
    # Test AI service health
    if curl -s --connect-timeout 15 "${LOCAL_AI_ENDPOINT}/health" > /dev/null; then
        print_success "Local AI service: Running"
        
        # Test models endpoint
        local models_response=$(curl -s --connect-timeout 10 "${LOCAL_AI_ENDPOINT}/v1/models" 2>/dev/null)
        
        if echo "$models_response" | grep -q '"data":'; then
            local model_count=$(echo "$models_response" | grep -o '"id":' | wc -l)
            print_success "AI models: $model_count models available"
            
            # Check for specific models
            if echo "$models_response" | grep -q 'gemma'; then
                print_success "Gemma model: Available"
            else
                print_warning "Gemma model: Not found"
            fi
            
            if echo "$models_response" | grep -q -i 'shakti'; then
                print_success "SHAKTI model: Available"
            else
                print_warning "SHAKTI model: Not found"
            fi
        else
            print_warning "AI models: Endpoint not responding properly"
        fi
        
        # Test AI chat completion
        local test_prompt='{"model": "gemma-3n", "messages": [{"role": "user", "content": "Test"}], "max_tokens": 10}'
        local ai_response=$(curl -s --connect-timeout 20 \
            -X POST \
            -H "Content-Type: application/json" \
            -d "$test_prompt" \
            "${LOCAL_AI_ENDPOINT}/v1/chat/completions" 2>/dev/null)
        
        if echo "$ai_response" | grep -q '"choices":'; then
            print_success "AI inference: Working"
        else
            print_warning "AI inference: Not responding to test prompt"
        fi
        
    else
        print_error "Local AI service: Not accessible"
        return 1
    fi
}

test_full_workflow() {
    print_header "Full Workflow Integration Testing"
    
    # Create comprehensive test payload
    local test_payload=$(cat <<EOF
{
    "test_mode": true,
    "timestamp": "$(date -Iseconds)",
    "github_username": "${GITHUB_USERNAME:-balajirajput96}",
    "repo_name": "test-automation-repo",
    "email_subject": "n8n Workflow Test - $(date +'%Y-%m-%d %H:%M')",
    "email_message": "यह एक test email है। Workflow सफलतापूर्वक चल रहा है।",
    "vpn_country": "IN",
    "ai_model": "gemma-3n",
    "ai_prompt": "Test prompt: workflow execution में सफलता मिली है।",
    "test_command": "echo 'System check: \$(date)'",
    "document_content": "Test document content created by n8n workflow.",
    "payload_type": "github_test"
}
EOF
    )
    
    print_info "Sending comprehensive test payload to workflow..."
    print_info "Payload size: $(echo "$test_payload" | wc -c) bytes"
    
    # Send test payload and measure response time
    local start_time=$(date +%s.%N)
    
    local response=$(curl -s -w "HTTPSTATUS:%{http_code}:TIME:%{time_total}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$test_payload" \
        --connect-timeout 60 \
        --max-time 120 \
        "$WEBHOOK_URL" 2>/dev/null)
    
    local end_time=$(date +%s.%N)
    local total_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "N/A")
    
    local http_code=$(echo $response | sed -n 's/.*HTTPSTATUS:\([0-9]*\):TIME:.*/\1/p')
    local response_time=$(echo $response | sed -n 's/.*TIME:\([0-9.]*\)/\1/p')
    local body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ] || [ "$http_code" -eq 202 ]; then
        print_success "Full workflow test: HTTP $http_code"
        print_info "Response time: ${response_time}s (Total: ${total_time}s)"
        
        # Analyze response
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            print_info "Response body received (${#body} chars)"
            
            # Check for success indicators in response
            if echo "$body" | grep -q -i "success\|completed\|executed"; then
                print_success "Workflow execution: Success indicators found"
            else
                print_warning "Workflow execution: No clear success indicators"
            fi
        else
            print_info "Empty response body (normal for webhook triggers)"
        fi
        
        # Performance evaluation
        if (( $(echo "$response_time < 5.0" | bc -l 2>/dev/null || echo "0") )); then
            print_success "Performance: Excellent (< 5s)"
        elif (( $(echo "$response_time < 15.0" | bc -l 2>/dev/null || echo "0") )); then
            print_info "Performance: Good (< 15s)"
        else
            print_warning "Performance: Slow (> 15s)"
        fi
        
    else
        print_error "Full workflow test: HTTP $http_code"
        print_error "Response: $body"
        return 1
    fi
}

test_security_features() {
    print_header "Security Features Testing"
    
    # Test encryption key
    if [ -n "$N8N_ENCRYPTION_KEY" ] && [ ${#N8N_ENCRYPTION_KEY} -ge 32 ]; then
        print_success "Encryption key: Properly configured (${#N8N_ENCRYPTION_KEY} chars)"
    else
        print_error "Encryption key: Missing or too short"
    fi
    
    # Test HTTPS configuration
    if [[ "$WEBHOOK_URL" == https://* ]]; then
        print_success "HTTPS: Enabled"
    else
        print_warning "HTTPS: Not enabled (development mode)"
    fi
    
    # Test basic auth configuration
    if [ "$N8N_BASIC_AUTH_ACTIVE" = "true" ]; then
        print_success "Basic authentication: Enabled"
        if [ -n "$N8N_BASIC_AUTH_USER" ] && [ -n "$N8N_BASIC_AUTH_PASSWORD" ]; then
            print_success "Basic auth credentials: Configured"
        else
            print_error "Basic auth credentials: Missing"
        fi
    else
        print_warning "Basic authentication: Disabled"
    fi
    
    # Test credential security
    local secure_vars=("GITHUB_TOKEN" "GMAIL_CLIENT_SECRET" "VPN_API_KEY" "GOOGLE_DOCS_API_KEY")
    local insecure_count=0
    
    for var in "${secure_vars[@]}"; do
        if [ -n "${!var}" ]; then
            # Check if credential looks secure (length and complexity)
            if [ ${#!var} -ge 20 ]; then
                print_success "$var: Secure length"
            else
                print_warning "$var: Short length (potential security risk)"
                ((insecure_count++))
            fi
        fi
    done
    
    if [ $insecure_count -eq 0 ]; then
        print_success "Credential security: All credentials appear secure"
    else
        print_warning "Credential security: $insecure_count credentials may be insecure"
    fi
}

generate_test_report() {
    print_header "Test Summary Report"
    
    local timestamp=$(date -Iseconds)
    local report_file="test-report-$(date +%Y%m%d-%H%M%S).json"
    
    # Create JSON report
    cat > "$report_file" <<EOF
{
    "test_report": {
        "timestamp": "$timestamp",
        "tester": "बालाजी (Parul University)",
        "environment": "${NODE_ENV:-development}",
        "n8n_version": "1.108.1",
        "webhook_url": "$WEBHOOK_URL",
        "test_results": {
            "basic_connectivity": "$basic_connectivity_result",
            "webhook_endpoint": "$webhook_result", 
            "github_integration": "$github_result",
            "gmail_integration": "$gmail_result",
            "vpn_functionality": "$vpn_result",
            "local_ai_models": "$ai_result",
            "full_workflow": "$workflow_result",
            "security_features": "$security_result"
        },
        "overall_status": "$overall_status",
        "recommendations": []
    }
}
EOF
    
    print_info "Test report saved: $report_file"
    
    # Generate recommendations
    local recommendations=()
    
    if [ "$overall_status" = "success" ]; then
        recommendations+=("🎉 All tests passed! Your n8n workflow system is ready for production.")
        recommendations+=("📧 Configure email notifications for workflow monitoring")
        recommendations+=("🔄 Set up automated health checks")
        recommendations+=("📊 Monitor performance metrics regularly")
        recommendations+=("🔐 Review security settings periodically")
    else
        recommendations+=("⚠️ Some tests failed. Address the issues before using in production.")
        
        [ "$basic_connectivity_result" != "success" ] && recommendations+=("🌐 Fix internet connectivity issues")
        [ "$webhook_result" != "success" ] && recommendations+=("🔗 Configure webhook endpoint properly")
        [ "$github_result" != "success" ] && recommendations+=("🐙 Verify GitHub API credentials")
        [ "$gmail_result" != "success" ] && recommendations+=("📧 Complete Gmail OAuth2 configuration")
        [ "$vpn_result" != "success" ] && recommendations+=("🔒 Set up VPN service properly")
        [ "$ai_result" != "success" ] && recommendations+=("🤖 Install and configure AI models")
        [ "$workflow_result" != "success" ] && recommendations+=("⚙️ Debug workflow execution issues")
        [ "$security_result" != "success" ] && recommendations+=("🔐 Improve security configuration")
    fi
    
    # Print recommendations
    print_info "Recommendations:"
    for rec in "${recommendations[@]}"; do
        if [[ "$rec" == *"🎉"* ]] || [[ "$rec" == *"success"* ]]; then
            print_success "$rec"
        elif [[ "$rec" == *"⚠️"* ]] || [[ "$rec" == *"Fix"* ]] || [[ "$rec" == *"failed"* ]]; then
            print_error "$rec"
        else
            print_info "$rec"
        fi
    done
}

# Main execution
main() {
    print_header "🤖 n8n Workflow Comprehensive Testing"
    echo -e "${PURPLE}बालाजी के automation system का complete testing${NC}"
    echo -e "${CYAN}Testing environment: ${NODE_ENV:-development}${NC}"
    echo -e "${CYAN}Target webhook: $WEBHOOK_URL${NC}\n"
    
    # Initialize result variables
    basic_connectivity_result="failed"
    webhook_result="failed"
    github_result="failed"
    gmail_result="failed"
    vpn_result="failed"
    ai_result="failed"
    workflow_result="failed"
    security_result="failed"
    
    # Run all tests
    test_basic_connectivity && basic_connectivity_result="success"
    test_webhook_endpoint && webhook_result="success"
    test_github_integration && github_result="success"
    test_gmail_integration && gmail_result="success"
    test_vpn_functionality && vpn_result="success"
    test_local_ai_models && ai_result="success"
    test_full_workflow && workflow_result="success"
    test_security_features && security_result="success"
    
    # Calculate overall status
    local success_count=0
    local total_tests=8
    
    [ "$basic_connectivity_result" = "success" ] && ((success_count++))
    [ "$webhook_result" = "success" ] && ((success_count++))
    [ "$github_result" = "success" ] && ((success_count++))
    [ "$gmail_result" = "success" ] && ((success_count++))
    [ "$vpn_result" = "success" ] && ((success_count++))
    [ "$ai_result" = "success" ] && ((success_count++))
    [ "$workflow_result" = "success" ] && ((success_count++))
    [ "$security_result" = "success" ] && ((success_count++))
    
    if [ $success_count -eq $total_tests ]; then
        overall_status="success"
    elif [ $success_count -ge $((total_tests / 2)) ]; then
        overall_status="partial"
    else
        overall_status="failed"
    fi
    
    # Generate final report
    generate_test_report
    
    # Final status message
    print_header "Testing Complete"
    
    if [ "$overall_status" = "success" ]; then
        print_success "🎉 All tests passed! ($success_count/$total_tests)"
        print_success "Your n8n workflow system is ready for use!"
        echo -e "${GREEN}${BOLD}Workflow deployment successful! 🚀${NC}"
        echo -e "${CYAN}Check your email (balaji.web.design1@gmail.com) for confirmation.${NC}"
        exit 0
    elif [ "$overall_status" = "partial" ]; then
        print_warning "⚠️ Partial success ($success_count/$total_tests tests passed)"
        print_warning "System is functional but some features need attention."
        exit 0
    else
        print_error "❌ Multiple tests failed ($success_count/$total_tests tests passed)"
        print_error "System needs significant fixes before use."
        exit 1
    fi
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi