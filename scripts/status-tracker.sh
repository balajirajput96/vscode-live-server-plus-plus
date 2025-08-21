#!/bin/bash

# 📊 Automation Setup Status Tracker
# Usage: ./status-tracker.sh [update|check|report]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Status file
STATUS_FILE="automation-status.json"

# Initialize status tracking
init_status() {
    cat > "$STATUS_FILE" <<EOF
{
  "last_updated": "$(date -Iseconds)",
  "overall_progress": 0,
  "components": {
    "n8n_webhook": {
      "status": "pending",
      "progress": 0,
      "url": "",
      "last_test": "",
      "notes": ""
    },
    "n8n_workflow": {
      "status": "pending", 
      "progress": 0,
      "credentials_configured": false,
      "workflow_active": false,
      "notes": ""
    },
    "github_actions": {
      "status": "pending",
      "progress": 0,
      "secrets_configured": false,
      "workflow_running": false,
      "notes": ""
    },
    "api_keys": {
      "status": "pending",
      "progress": 0,
      "openai_configured": false,
      "gmail_configured": false,
      "drive_configured": false,
      "notes": ""
    },
    "security": {
      "status": "pending",
      "progress": 0,
      "two_factor_enabled": false,
      "keys_rotated": false,
      "monitoring_active": false,
      "notes": ""
    },
    "google_play": {
      "status": "pending",
      "progress": 0,
      "duns_approved": false,
      "account_created": false,
      "documents_verified": false,
      "notes": ""
    },
    "browser_optimization": {
      "status": "pending",
      "progress": 0,
      "chrome_configured": false,
      "edge_configured": false,
      "performance_tested": false,
      "notes": ""
    }
  }
}
EOF
    echo -e "${GREEN}✅ Status tracking initialized${NC}"
}

# Update component status
update_status() {
    local component="$1"
    local field="$2"
    local value="$3"
    
    if [ ! -f "$STATUS_FILE" ]; then
        init_status
    fi
    
    # Update using jq (install if not available)
    if command -v jq >/dev/null; then
        jq ".components.$component.$field = \"$value\" | .last_updated = \"$(date -Iseconds)\"" "$STATUS_FILE" > temp.json && mv temp.json "$STATUS_FILE"
        echo -e "${GREEN}✅ Updated $component.$field = $value${NC}"
    else
        echo -e "${YELLOW}⚠️ jq not installed. Manual update required${NC}"
    fi
}

# Check overall status
check_status() {
    if [ ! -f "$STATUS_FILE" ]; then
        echo -e "${RED}❌ Status file not found. Run: $0 init${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📊 Current Automation Setup Status${NC}"
    echo "=================================="
    
    # Parse and display status
    if command -v jq >/dev/null; then
        local last_updated=$(jq -r '.last_updated' "$STATUS_FILE")
        echo -e "Last Updated: ${YELLOW}$last_updated${NC}\n"
        
        # Check each component
        echo -e "${BLUE}Component Status:${NC}"
        
        # n8n Webhook
        local webhook_status=$(jq -r '.components.n8n_webhook.status' "$STATUS_FILE")
        local webhook_url=$(jq -r '.components.n8n_webhook.url' "$STATUS_FILE")
        echo -e "🔗 n8n Webhook: $(format_status $webhook_status) $webhook_url"
        
        # n8n Workflow  
        local workflow_status=$(jq -r '.components.n8n_workflow.status' "$STATUS_FILE")
        local workflow_active=$(jq -r '.components.n8n_workflow.workflow_active' "$STATUS_FILE")
        echo -e "⚡ n8n Workflow: $(format_status $workflow_status) (Active: $workflow_active)"
        
        # GitHub Actions
        local github_status=$(jq -r '.components.github_actions.status' "$STATUS_FILE")
        local secrets_configured=$(jq -r '.components.github_actions.secrets_configured' "$STATUS_FILE")
        echo -e "🔄 GitHub Actions: $(format_status $github_status) (Secrets: $secrets_configured)"
        
        # API Keys
        local api_status=$(jq -r '.components.api_keys.status' "$STATUS_FILE")
        local openai_configured=$(jq -r '.components.api_keys.openai_configured' "$STATUS_FILE")
        echo -e "🔑 API Keys: $(format_status $api_status) (OpenAI: $openai_configured)"
        
        # Security
        local security_status=$(jq -r '.components.security.status' "$STATUS_FILE")
        local two_factor=$(jq -r '.components.security.two_factor_enabled' "$STATUS_FILE")
        echo -e "🔐 Security: $(format_status $security_status) (2FA: $two_factor)"
        
        # Google Play Console
        local play_status=$(jq -r '.components.google_play.status' "$STATUS_FILE")
        local duns_approved=$(jq -r '.components.google_play.duns_approved' "$STATUS_FILE")
        echo -e "📱 Google Play: $(format_status $play_status) (D-U-N-S: $duns_approved)"
        
        # Browser Optimization
        local browser_status=$(jq -r '.components.browser_optimization.status' "$STATUS_FILE")
        local chrome_configured=$(jq -r '.components.browser_optimization.chrome_configured' "$STATUS_FILE")
        echo -e "🌐 Browser Optimization: $(format_status $browser_status) (Chrome: $chrome_configured)"
        
    else
        cat "$STATUS_FILE"
    fi
}

# Format status with colors
format_status() {
    local status="$1"
    case "$status" in
        "completed") echo -e "${GREEN}✅ Completed${NC}" ;;
        "in_progress") echo -e "${YELLOW}🔄 In Progress${NC}" ;;
        "pending") echo -e "${RED}⏳ Pending${NC}" ;;
        "blocked") echo -e "${RED}❌ Blocked${NC}" ;;
        *) echo -e "${YELLOW}❓ Unknown${NC}" ;;
    esac
}

# Generate status report
generate_report() {
    if [ ! -f "$STATUS_FILE" ]; then
        echo -e "${RED}❌ Status file not found${NC}"
        return 1
    fi
    
    echo -e "${BLUE}📋 Automation Setup Progress Report${NC}"
    echo "===================================="
    echo ""
    
    # Overall progress calculation
    local total_components=7
    local completed_count=0
    
    if command -v jq >/dev/null; then
        # Count completed components
        completed_count=$(jq '[.components[] | select(.status == "completed")] | length' "$STATUS_FILE")
        local progress=$((completed_count * 100 / total_components))
        
        echo -e "📊 Overall Progress: ${YELLOW}$progress%${NC} ($completed_count/$total_components completed)"
        echo ""
        
        # Detailed component status
        echo -e "${BLUE}Detailed Status:${NC}"
        
        # Ready components
        echo -e "\n${GREEN}✅ Ready Components:${NC}"
        jq -r '.components | to_entries[] | select(.value.status == "completed") | "  - " + .key' "$STATUS_FILE" | sed 's/_/ /g'
        
        # In progress components  
        echo -e "\n${YELLOW}🔄 In Progress:${NC}"
        jq -r '.components | to_entries[] | select(.value.status == "in_progress") | "  - " + .key' "$STATUS_FILE" | sed 's/_/ /g'
        
        # Pending components
        echo -e "\n${RED}⏳ Pending:${NC}"
        jq -r '.components | to_entries[] | select(.value.status == "pending") | "  - " + .key' "$STATUS_FILE" | sed 's/_/ /g'
        
        # Blocked components
        echo -e "\n${RED}❌ Blocked:${NC}"
        jq -r '.components | to_entries[] | select(.value.status == "blocked") | "  - " + .key' "$STATUS_FILE" | sed 's/_/ /g'
        
        # Next steps recommendations
        echo -e "\n${BLUE}🎯 Recommended Next Steps:${NC}"
        
        if jq -e '.components.n8n_webhook.status == "pending"' "$STATUS_FILE" >/dev/null; then
            echo "  1. Set up n8n webhook and test connectivity"
        elif jq -e '.components.n8n_workflow.status == "pending"' "$STATUS_FILE" >/dev/null; then
            echo "  1. Import n8n workflow and configure credentials"
        elif jq -e '.components.github_actions.status == "pending"' "$STATUS_FILE" >/dev/null; then
            echo "  1. Configure GitHub repository secrets"
        elif jq -e '.components.api_keys.status == "pending"' "$STATUS_FILE" >/dev/null; then
            echo "  1. Set up API keys for OpenAI, Gmail, and Google Drive"
        elif jq -e '.components.security.status == "pending"' "$STATUS_FILE" >/dev/null; then
            echo "  1. Enable 2FA on all accounts and implement security measures"
        elif jq -e '.components.google_play.status == "pending"' "$STATUS_FILE" >/dev/null; then
            echo "  1. Complete D-U-N-S registration and Google Play Console setup"
        else
            echo "  1. All major components completed! Focus on optimization and monitoring"
        fi
        
    else
        echo -e "${YELLOW}⚠️ jq not installed. Install for detailed reporting${NC}"
    fi
}

# Health check integration
run_health_checks() {
    echo -e "${BLUE}🔍 Running Health Checks${NC}"
    
    # Check if webhook is configured
    if [ -n "$N8N_WEBHOOK_URL" ]; then
        echo -e "\n${YELLOW}Testing n8n webhook...${NC}"
        if ./scripts/health-checks/webhook-health-check.sh; then
            update_status "n8n_webhook" "status" "completed"
        else
            update_status "n8n_webhook" "status" "blocked"
        fi
    fi
    
    # Check if OpenAI API key is configured
    if [ -n "$OPENAI_API_KEY" ]; then
        echo -e "\n${YELLOW}Testing OpenAI API...${NC}"
        if ./scripts/health-checks/openai-health-check.sh; then
            update_status "api_keys" "openai_configured" "true"
        fi
    fi
    
    # Check GitHub Actions
    if [ -d ".github/workflows" ]; then
        echo -e "\n${GREEN}✅ GitHub Actions workflows found${NC}"
        update_status "github_actions" "progress" "50"
    fi
}

# Main command handler
case "${1:-check}" in
    "init")
        init_status
        ;;
    "update")
        if [ $# -lt 4 ]; then
            echo "Usage: $0 update <component> <field> <value>"
            echo "Example: $0 update n8n_webhook status completed"
            exit 1
        fi
        update_status "$2" "$3" "$4"
        ;;
    "check")
        check_status
        ;;
    "report")
        generate_report
        ;;
    "health")
        run_health_checks
        ;;
    "help")
        echo "Automation Setup Status Tracker"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  init     - Initialize status tracking"
        echo "  check    - Display current status"
        echo "  report   - Generate detailed progress report"
        echo "  health   - Run health checks and update status"
        echo "  update   - Update component status"
        echo "  help     - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 check"
        echo "  $0 update n8n_webhook status completed"
        echo "  $0 update n8n_webhook url 'https://example.com/webhook'"
        echo "  $0 report"
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac