#!/bin/bash

# 🔍 Deployment Verification Script
# Comprehensive health check for the AI-Powered Career Automation System

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✅]${NC} $1"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_error() {
    echo -e "${RED}[❌]${NC} $1"
    ((FAILED_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_warning() {
    echo -e "${YELLOW}[⚠️]${NC} $1"
    ((WARNING_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_info() {
    echo -e "${BLUE}[ℹ️]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Banner
show_banner() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🔍 Deployment Verification & Health Check            ║
║           AI-Powered Career Automation System               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Check system requirements
check_system_requirements() {
    print_header "1️⃣  SYSTEM REQUIREMENTS"
    
    # Check Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | tr -d ',')
        print_status "Docker installed: $DOCKER_VERSION"
    else
        print_error "Docker is not installed"
    fi
    
    # Check Docker Compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d ' ' -f3 | tr -d ',')
        print_status "Docker Compose installed: $COMPOSE_VERSION"
    else
        print_warning "Docker Compose is not installed"
    fi
    
    # Check Docker daemon
    if docker info &> /dev/null; then
        print_status "Docker daemon is running"
    else
        print_error "Docker daemon is not running"
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version | cut -d ' ' -f3)
        print_status "Git installed: $GIT_VERSION"
    else
        print_warning "Git is not installed"
    fi
    
    # Check disk space
    DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}')
    print_info "Available disk space: $DISK_SPACE"
    
    # Check memory
    if command -v free &> /dev/null; then
        FREE_MEM=$(free -h | awk 'NR==2 {print $7}')
        print_info "Available memory: $FREE_MEM"
    fi
}

# Check Docker containers
check_docker_containers() {
    print_header "2️⃣  DOCKER CONTAINERS"
    
    # Check if n8n container exists
    if docker ps -a | grep -q n8n; then
        # Check if n8n is running
        if docker ps | grep -q n8n; then
            print_status "n8n container is running"
            
            # Get container details
            CONTAINER_STATUS=$(docker ps --filter "name=n8n" --format "{{.Status}}")
            print_info "Container status: $CONTAINER_STATUS"
            
            # Check container health
            if docker inspect --format='{{.State.Health.Status}}' n8n 2>/dev/null | grep -q healthy; then
                print_status "n8n container is healthy"
            else
                print_info "Health check not configured or pending"
            fi
        else
            print_error "n8n container exists but is not running"
            print_info "Start with: docker-compose up -d"
        fi
    else
        print_error "n8n container not found"
        print_info "Deploy with: ./deploy-complete.sh"
    fi
    
    # List all containers
    echo ""
    print_info "All running containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Unable to list containers"
}

# Check n8n service
check_n8n_service() {
    print_header "3️⃣  N8N SERVICE"
    
    # Check if n8n is accessible
    print_info "Testing n8n accessibility..."
    
    # Wait a moment for n8n to be ready
    sleep 2
    
    # Check health endpoint
    if curl -f -s http://localhost:5678/healthz > /dev/null 2>&1; then
        print_status "n8n health endpoint responding"
    else
        print_error "n8n health endpoint not responding"
        print_info "n8n may still be starting up. Wait 30 seconds and try again."
    fi
    
    # Check if port 5678 is listening
    if netstat -tuln 2>/dev/null | grep -q ':5678' || ss -tuln 2>/dev/null | grep -q ':5678'; then
        print_status "Port 5678 is listening"
    else
        print_warning "Port 5678 may not be accessible"
    fi
    
    # Check n8n web interface
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5678 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
        print_status "n8n web interface is accessible (HTTP $HTTP_CODE)"
        print_info "Access at: http://localhost:5678"
    else
        print_error "n8n web interface not accessible (HTTP $HTTP_CODE)"
    fi
}

# Check configuration files
check_configuration() {
    print_header "4️⃣  CONFIGURATION FILES"
    
    # Check .env file
    if [ -f .env ]; then
        print_status ".env file exists"
        
        # Check important variables
        if grep -q "N8N_BASIC_AUTH_PASSWORD" .env; then
            if grep "N8N_BASIC_AUTH_PASSWORD=change_this_password" .env > /dev/null; then
                print_warning "Default password detected - please change it!"
            else
                print_status "Custom password configured"
            fi
        fi
    else
        print_error ".env file not found"
        print_info "Create from: cp .env.example .env"
    fi
    
    # Check docker-compose files
    if [ -f docker-compose.basic.yml ]; then
        print_status "docker-compose.basic.yml exists"
    else
        print_warning "docker-compose.basic.yml not found"
    fi
    
    if [ -f docker-compose.reverse-proxy.yml ]; then
        print_status "docker-compose.reverse-proxy.yml exists"
    else
        print_info "docker-compose.reverse-proxy.yml not found (optional)"
    fi
    
    # Check Dockerfile
    if [ -f Dockerfile.n8n-extended ]; then
        print_status "Dockerfile.n8n-extended exists"
    else
        print_info "Dockerfile.n8n-extended not found (optional)"
    fi
}

# Check web components
check_web_components() {
    print_header "5️⃣  WEB COMPONENTS"
    
    # Check main HTML files
    if [ -f index.html ]; then
        print_status "index.html exists"
    else
        print_error "index.html not found"
    fi
    
    if [ -f Job_Tracking_System.html ]; then
        print_status "Job_Tracking_System.html exists"
    else
        print_warning "Job_Tracking_System.html not found"
    fi
    
    # Check directories
    if [ -d career-automation-system ]; then
        print_status "career-automation-system directory exists"
    else
        print_warning "career-automation-system directory not found"
    fi
    
    if [ -d portfolio-website ]; then
        print_status "portfolio-website directory exists"
    else
        print_warning "portfolio-website directory not found"
    fi
}

# Check workflow directories
check_workflows() {
    print_header "6️⃣  WORKFLOW DIRECTORIES"
    
    WORKFLOW_FOUND=false
    
    # Check automation-scripts
    if [ -d automation-scripts/n8n-workflows ]; then
        WORKFLOW_COUNT=$(find automation-scripts/n8n-workflows -name "*.json" 2>/dev/null | wc -l)
        print_status "automation-scripts/n8n-workflows found ($WORKFLOW_COUNT workflows)"
        WORKFLOW_FOUND=true
    else
        print_info "automation-scripts/n8n-workflows not found"
    fi
    
    # Check n8n-workflows
    if [ -d n8n-workflows ]; then
        WORKFLOW_COUNT=$(find n8n-workflows -name "*.json" 2>/dev/null | wc -l)
        print_status "n8n-workflows directory found ($WORKFLOW_COUNT workflows)"
        WORKFLOW_FOUND=true
    else
        print_info "n8n-workflows directory not found"
    fi
    
    # Check ai-agent-automation-pack
    if [ -d ai-agent-automation-pack/workflows ]; then
        WORKFLOW_COUNT=$(find ai-agent-automation-pack/workflows -name "*.json" 2>/dev/null | wc -l)
        print_status "ai-agent-automation-pack/workflows found ($WORKFLOW_COUNT workflows)"
        WORKFLOW_FOUND=true
    else
        print_info "ai-agent-automation-pack/workflows not found"
    fi
    
    if [ "$WORKFLOW_FOUND" = false ]; then
        print_warning "No workflow directories found"
        print_info "Create workflows in n8n and export them"
    fi
}

# Check documentation
check_documentation() {
    print_header "7️⃣  DOCUMENTATION"
    
    DOC_FILES=(
        "README.md"
        "DEPLOYMENT.md"
        "DEPLOYMENT-SUMMARY.md"
        "DEPLOYMENT-STATUS.md"
        "README-n8n-setup.md"
        "complete-action-plan.md"
    )
    
    for doc in "${DOC_FILES[@]}"; do
        if [ -f "$doc" ]; then
            print_status "$doc exists"
        else
            print_warning "$doc not found"
        fi
    done
}

# Check scripts
check_scripts() {
    print_header "8️⃣  DEPLOYMENT SCRIPTS"
    
    SCRIPT_FILES=(
        "deploy-complete.sh"
        "verify-deployment.sh"
        "quick-setup.sh"
        "monitor-automation.sh"
    )
    
    for script in "${SCRIPT_FILES[@]}"; do
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                print_status "$script exists and is executable"
            else
                print_warning "$script exists but is not executable"
                print_info "Fix with: chmod +x $script"
            fi
        else
            print_info "$script not found (may be optional)"
        fi
    done
}

# Check GitHub configuration
check_github_config() {
    print_header "9️⃣  GITHUB CONFIGURATION"
    
    # Check if we're in a git repository
    if [ -d .git ]; then
        print_status "Git repository initialized"
        
        # Check remote
        if git remote -v | grep -q origin; then
            REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "unknown")
            print_status "Git remote configured: $REMOTE_URL"
        else
            print_warning "No git remote configured"
        fi
    else
        print_warning "Not a git repository"
    fi
    
    # Check GitHub Actions
    if [ -d .github/workflows ]; then
        WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null | wc -l)
        print_status "GitHub Actions workflows found ($WORKFLOW_COUNT)"
    else
        print_info "No GitHub Actions workflows found"
    fi
    
    # Check .gitignore
    if [ -f .gitignore ]; then
        print_status ".gitignore exists"
    else
        print_warning ".gitignore not found"
    fi
}

# Security check
check_security() {
    print_header "🔒 SECURITY CHECKS"
    
    # Check if .env is in .gitignore
    if [ -f .gitignore ] && grep -q ".env" .gitignore; then
        print_status ".env is in .gitignore"
    else
        print_warning ".env may not be in .gitignore"
        print_info "Add .env to .gitignore to protect secrets"
    fi
    
    # Check for exposed secrets in git history
    if [ -d .git ]; then
        if git log --all --full-history --source -- .env 2>/dev/null | grep -q commit; then
            print_error ".env file found in git history!"
            print_info "SECURITY RISK: Remove .env from git history"
        else
            print_status "No .env file in git history"
        fi
    fi
    
    # Check for default passwords
    if [ -f .env ] && grep -q "change_this_password" .env; then
        print_error "Default password still in use!"
        print_info "Change N8N_BASIC_AUTH_PASSWORD in .env"
    fi
}

# Generate report
generate_report() {
    print_header "📊 VERIFICATION SUMMARY"
    
    echo ""
    echo "Total Checks: $TOTAL_CHECKS"
    echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
    echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
    echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
    echo ""
    
    # Calculate percentage
    if [ $TOTAL_CHECKS -gt 0 ]; then
        PASS_PERCENT=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
        echo "Success Rate: $PASS_PERCENT%"
    fi
    
    echo ""
    
    # Overall status
    if [ $FAILED_CHECKS -eq 0 ]; then
        if [ $WARNING_CHECKS -eq 0 ]; then
            echo -e "${GREEN}✅ ALL CHECKS PASSED! System is ready!${NC}"
        else
            echo -e "${YELLOW}⚠️ System functional with warnings${NC}"
            echo "Review warnings above and address if needed"
        fi
    else
        echo -e "${RED}❌ Some checks failed${NC}"
        echo "Review failures above and fix issues"
    fi
    
    echo ""
}

# Show next steps
show_next_steps() {
    print_header "🚀 NEXT STEPS"
    
    echo "1. Access n8n Dashboard:"
    echo "   ${CYAN}http://localhost:5678${NC}"
    echo ""
    echo "2. Import Workflows:"
    echo "   - Go to Workflows → Import from File"
    echo "   - Import from workflow directories"
    echo ""
    echo "3. Configure Credentials:"
    echo "   - Go to Credentials → Add Credential"
    echo "   - Add OpenAI, Gmail, Google Drive, Buffer"
    echo ""
    echo "4. Test Workflows:"
    echo "   - Execute workflows manually"
    echo "   - Verify outputs"
    echo "   - Activate for automation"
    echo ""
    echo "5. Monitor System:"
    echo "   ${CYAN}./monitor-automation.sh${NC}"
    echo ""
    echo "6. View Logs:"
    echo "   ${CYAN}docker-compose logs -f n8n${NC}"
    echo ""
    
    print_header "📚 DOCUMENTATION"
    echo ""
    echo "- DEPLOYMENT.md - Complete deployment guide"
    echo "- DEPLOYMENT-SUMMARY.md - Quick reference"
    echo "- DEPLOYMENT-STATUS.md - Progress tracker"
    echo "- README.md - Project overview"
    echo ""
}

# Main execution
main() {
    show_banner
    
    echo "Starting comprehensive verification..."
    echo ""
    sleep 1
    
    check_system_requirements
    check_docker_containers
    check_n8n_service
    check_configuration
    check_web_components
    check_workflows
    check_documentation
    check_scripts
    check_github_config
    check_security
    
    generate_report
    show_next_steps
    
    echo "Verification complete!"
    echo ""
}

# Run main function
main
