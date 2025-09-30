#!/bin/bash

# 🔍 Deployment Verification Script
# यह script deployment को verify करता है और status report generate करता है

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Status counters
PASSED=0
FAILED=0
WARNINGS=0

# Print functions
print_check() {
    echo -e "${GREEN}✅${NC} $1"
    PASSED=$((PASSED + 1))
}

print_fail() {
    echo -e "${RED}❌${NC} $1"
    FAILED=$((FAILED + 1))
}

print_warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

print_info() {
    echo -e "${CYAN}ℹ️${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Banner
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                    ║${NC}"
echo -e "${CYAN}║   🔍 Deployment Verification                       ║${NC}"
echo -e "${CYAN}║      Complete Status Check                         ║${NC}"
echo -e "${CYAN}║                                                    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Check Prerequisites
print_header "1️⃣  Checking Prerequisites"

# Docker
if command -v docker &> /dev/null; then
    print_check "Docker installed: $(docker --version | cut -d' ' -f3)"
else
    print_fail "Docker is not installed"
fi

# Docker Compose
if command -v docker-compose &> /dev/null; then
    print_check "Docker Compose installed: $(docker-compose --version | cut -d' ' -f4)"
else
    print_fail "Docker Compose is not installed"
fi

# Git
if command -v git &> /dev/null; then
    print_check "Git installed: $(git --version | cut -d' ' -f3)"
else
    print_warn "Git is not installed (optional)"
fi

# Curl
if command -v curl &> /dev/null; then
    print_check "curl installed"
else
    print_warn "curl is not installed (needed for health checks)"
fi

# OpenSSL
if command -v openssl &> /dev/null; then
    print_check "OpenSSL installed"
else
    print_warn "OpenSSL is not installed (needed for key generation)"
fi

# 2. Check Configuration Files
print_header "2️⃣  Checking Configuration Files"

# .env file
if [ -f .env ]; then
    print_check ".env file exists"
    
    # Check if encryption key is set
    if grep -q "REPLACE_WITH_STRONG_BASE64_KEY" .env; then
        print_warn "Encryption key not generated in .env"
    else
        print_check "Encryption key is set"
    fi
    
    # Check domain configuration
    DOMAIN=$(grep "^DOMAIN=" .env | cut -d'=' -f2)
    if [ -z "$DOMAIN" ]; then
        print_warn "DOMAIN not set in .env"
    else
        print_check "DOMAIN configured: $DOMAIN"
    fi
else
    print_fail ".env file not found"
fi

# Docker Compose files
if [ -f docker-compose.basic.yml ]; then
    print_check "docker-compose.basic.yml exists"
else
    print_fail "docker-compose.basic.yml not found"
fi

if [ -f docker-compose.reverse-proxy.yml ]; then
    print_check "docker-compose.reverse-proxy.yml exists"
else
    print_fail "docker-compose.reverse-proxy.yml not found"
fi

# Caddyfile
if [ -f Caddyfile ]; then
    print_check "Caddyfile exists"
else
    print_warn "Caddyfile not found (needed for HTTPS)"
fi

# 3. Check Docker Containers
print_header "3️⃣  Checking Docker Containers"

if command -v docker &> /dev/null; then
    # Check n8n container
    if docker ps | grep -q "n8n"; then
        print_check "n8n container is running"
        
        # Get container status
        container_status=$(docker inspect -f '{{.State.Status}}' n8n 2>/dev/null)
        if [ "$container_status" = "running" ]; then
            print_check "n8n container status: running"
        else
            print_warn "n8n container status: $container_status"
        fi
        
        # Check uptime
        uptime=$(docker ps --filter "name=n8n" --format "{{.Status}}")
        print_info "n8n uptime: $uptime"
    else
        print_warn "n8n container is not running"
    fi
    
    # Check Caddy container (if production)
    if docker ps | grep -q "caddy"; then
        print_check "Caddy container is running"
    else
        print_info "Caddy container not running (production mode only)"
    fi
else
    print_fail "Docker is not available"
fi

# 4. Check n8n Health
print_header "4️⃣  Checking n8n Health"

if [ -f .env ]; then
    # Try local endpoint first
    if curl -f -s http://localhost:5678/healthz > /dev/null 2>&1; then
        print_check "n8n health check: PASSED (localhost)"
        print_info "n8n is accessible at: http://localhost:5678"
    else
        # Try production endpoint if configured
        DOMAIN=$(grep "^DOMAIN=" .env | cut -d'=' -f2)
        if [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "n8n.example.com" ]; then
            if curl -f -s "https://$DOMAIN/healthz" > /dev/null 2>&1; then
                print_check "n8n health check: PASSED (production)"
                print_info "n8n is accessible at: https://$DOMAIN"
            else
                print_warn "n8n health check failed on both endpoints"
            fi
        else
            print_warn "n8n not responding (may still be starting)"
        fi
    fi
else
    print_fail "Cannot check n8n health: .env not found"
fi

# 5. Check Files & Directories
print_header "5️⃣  Checking Required Files & Directories"

# Required files
files=(
    "DEPLOYMENT.md"
    "README.md"
    "README-n8n-setup.md"
    "package.json"
    "quick-setup.sh"
    "deploy-complete.sh"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_check "$file exists"
    else
        print_fail "$file not found"
    fi
done

# Check if scripts are executable
scripts=(
    "quick-setup.sh"
    "deploy-complete.sh"
    "verify-deployment.sh"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            print_check "$script is executable"
        else
            print_warn "$script exists but is not executable (run: chmod +x $script)"
        fi
    fi
done

# Optional files
optional_files=(
    "automation-setup-guide.md"
    "monitor-automation.sh"
)

for file in "${optional_files[@]}"; do
    if [ -f "$file" ]; then
        print_check "$file exists (optional)"
    else
        print_info "$file not found (will be created during setup)"
    fi
done

# Required directories
directories=(
    "automation-scripts"
    "career-automation-system"
    "scripts"
    "docs"
    ".github/workflows"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        print_check "$dir/ exists"
    else
        print_warn "$dir/ not found"
    fi
done

# 6. Check GitHub Actions
print_header "6️⃣  Checking GitHub Actions"

if [ -d ".github/workflows" ]; then
    print_check ".github/workflows directory exists"
    
    # Check workflow files
    if [ -f ".github/workflows/notify-n8n.yml" ]; then
        print_check "notify-n8n.yml workflow exists"
    else
        print_warn "notify-n8n.yml workflow not found"
    fi
    
    if [ -f ".github/workflows/azure-functions-app-nodejs.yml" ]; then
        print_check "azure-functions-app-nodejs.yml workflow exists"
    else
        print_info "Azure Functions workflow not configured"
    fi
else
    print_warn ".github/workflows directory not found"
fi

# 7. Check Web Components
print_header "7️⃣  Checking Web Components"

web_files=(
    "index.html"
    "Job_Tracking_System.html"
    "sonar-api-quickstart.html"
)

for file in "${web_files[@]}"; do
    if [ -f "$file" ]; then
        print_check "$file exists"
    else
        print_warn "$file not found"
    fi
done

# 8. Check Workflow Files
print_header "8️⃣  Checking Workflow Files"

workflow_dirs=(
    "automation-scripts/n8n-workflows"
    "n8n-workflows"
    "ai-agent-automation-pack/workflows"
)

workflow_found=false
for dir in "${workflow_dirs[@]}"; do
    if [ -d "$dir" ]; then
        workflow_count=$(find "$dir" -name "*.json" 2>/dev/null | wc -l)
        if [ $workflow_count -gt 0 ]; then
            print_check "$dir/ exists with $workflow_count workflow(s)"
            workflow_found=true
        else
            print_warn "$dir/ exists but no workflows found"
        fi
    else
        print_info "$dir/ not found"
    fi
done

if [ "$workflow_found" = false ]; then
    print_warn "No workflow files found in expected locations"
fi

# 9. Check Docker Volumes
print_header "9️⃣  Checking Docker Volumes"

if command -v docker &> /dev/null; then
    if docker volume ls | grep -q "n8n_data"; then
        print_check "n8n_data volume exists"
        
        # Check volume size
        volume_size=$(docker volume inspect n8n_data -f '{{ .CreatedAt }}' 2>/dev/null)
        if [ ! -z "$volume_size" ]; then
            print_info "n8n_data created: $volume_size"
        fi
    else
        print_info "n8n_data volume not created yet (will be created on first run)"
    fi
else
    print_fail "Docker not available"
fi

# 10. Generate Summary Report
print_header "📊 Summary Report"

echo ""
echo "  Total Checks:"
echo "    ✅ Passed:   $PASSED"
echo "    ❌ Failed:   $FAILED"
echo "    ⚠️  Warnings: $WARNINGS"
echo ""

# Calculate percentage
total=$((PASSED + FAILED + WARNINGS))
if [ $total -gt 0 ]; then
    percentage=$((PASSED * 100 / total))
    echo "  Success Rate: $percentage%"
    echo ""
fi

# Overall status
if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "  ${GREEN}✅ All checks passed! Deployment is complete and healthy.${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Deployment is functional but has $WARNINGS warning(s).${NC}"
        echo "     Review warnings above and address if needed."
    fi
else
    echo -e "  ${RED}❌ Deployment has $FAILED critical issue(s).${NC}"
    echo "     Fix the failed checks before proceeding."
fi

echo ""

# Next steps
print_header "📚 Next Steps"

if [ $FAILED -eq 0 ]; then
    echo "  1. Access n8n dashboard and complete initial setup"
    echo "  2. Import workflows from automation-scripts/"
    echo "  3. Configure API credentials (OpenAI, Gmail, etc.)"
    echo "  4. Setup GitHub Actions secrets"
    echo "  5. Enable GitHub Pages"
    echo "  6. Test webhooks and workflows"
    echo "  7. Setup monitoring: ./monitor-automation.sh"
else
    echo "  1. Fix the failed checks listed above"
    echo "  2. Re-run this verification: ./verify-deployment.sh"
    echo "  3. Check Docker logs: docker-compose logs -f"
    echo "  4. Review deployment guide: cat DEPLOYMENT.md"
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
