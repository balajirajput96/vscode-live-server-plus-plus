#!/bin/bash

# 🔍 Cloud-Only Android Automation Validator
# This script validates the setup and tests all components

# set -e  # Don't exit on errors, we want to collect all test results

echo "🔍 Cloud-Only Android Automation Validator"
echo "=========================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
total_tests=0
passed_tests=0
failed_tests=0

# Test functions
test_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((passed_tests++))
    ((total_tests++))
}

test_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((failed_tests++))
    ((total_tests++))
}

test_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((total_tests++))
}

test_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Start validation
echo ""
test_info "Starting validation of Cloud-Only Android Automation setup..."
echo ""

# Test 1: Check if we're in the right directory
echo "📁 Checking directory structure..."
if [ -d "cloud-android-automation" ]; then
    test_pass "Cloud-Android-Automation directory exists"
else
    test_fail "Cloud-Android-Automation directory not found"
    exit 1
fi

# Test 2: Check required files
echo ""
echo "📄 Checking required files..."

required_files=(
    "cloud-android-automation/README.md"
    "cloud-android-automation/n8n-workflows/auto-upload-files.json"
    "cloud-android-automation/n8n-workflows/whatsapp-media-handler.json"
    "cloud-android-automation/n8n-workflows/cache-cleaner.json"
    "cloud-android-automation/n8n-workflows/low-storage-alert.json"
    "cloud-android-automation/scripts/termux-setup.sh"
    "cloud-android-automation/scripts/rclone-setup.sh"
    "cloud-android-automation/scripts/foldersync-rules.md"
    "cloud-android-automation/config/android-env.template"
    "cloud-android-automation/config/automation-config.json"
    "cloud-android-automation/docs/setup-guide.md"
    "cloud-android-automation/docs/troubleshooting.md"
    "cloud-android-automation/docs/advanced-features.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        test_pass "Found: $(basename "$file")"
    else
        test_fail "Missing: $file"
    fi
done

# Test 3: Check script permissions
echo ""
echo "🔐 Checking script permissions..."

script_files=(
    "cloud-android-automation/scripts/termux-setup.sh"
    "cloud-android-automation/scripts/rclone-setup.sh"
)

for script in "${script_files[@]}"; do
    if [ -x "$script" ]; then
        test_pass "Executable: $(basename "$script")"
    else
        test_fail "Not executable: $script"
    fi
done

# Test 4: Validate JSON files
echo ""
echo "🔍 Validating JSON workflow files..."

json_files=(
    "cloud-android-automation/n8n-workflows/auto-upload-files.json"
    "cloud-android-automation/n8n-workflows/whatsapp-media-handler.json"
    "cloud-android-automation/n8n-workflows/cache-cleaner.json"
    "cloud-android-automation/n8n-workflows/low-storage-alert.json"
    "cloud-android-automation/config/automation-config.json"
)

for json_file in "${json_files[@]}"; do
    if command -v jq &> /dev/null; then
        if jq empty "$json_file" 2>/dev/null; then
            test_pass "Valid JSON: $(basename "$json_file")"
        else
            test_fail "Invalid JSON: $(basename "$json_file")"
        fi
    else
        if python3 -m json.tool "$json_file" &> /dev/null; then
            test_pass "Valid JSON: $(basename "$json_file")"
        else
            test_fail "Invalid JSON: $(basename "$json_file")"
        fi
    fi
done

# Test 5: Check file sizes (ensure files are not empty)
echo ""
echo "📊 Checking file sizes..."

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
        if [ "$size" -gt 100 ]; then
            test_pass "Non-empty: $(basename "$file") (${size} bytes)"
        else
            test_warn "Small file: $(basename "$file") (${size} bytes)"
        fi
    fi
done

# Test 6: Check for placeholder values that need to be replaced
echo ""
echo "🔧 Checking for configuration placeholders..."

placeholder_checks=(
    "YOUR_WEBHOOK_URL:n8n-workflows/auto-upload-files.json"
    "YOUR_TELEGRAM_CHAT_ID:n8n-workflows/auto-upload-files.json"
    "your-n8n-instance.com:config/android-env.template"
    "your-bot-token:config/android-env.template"
)

for check in "${placeholder_checks[@]}"; do
    placeholder=$(echo "$check" | cut -d: -f1)
    file=$(echo "$check" | cut -d: -f2)
    
    if grep -q "$placeholder" "cloud-android-automation/$file" 2>/dev/null; then
        test_warn "Placeholder found in $file: $placeholder (needs configuration)"
    else
        test_pass "No placeholder in $file for: $placeholder"
    fi
done

# Test 7: Documentation completeness
echo ""
echo "📚 Checking documentation completeness..."

doc_sections=(
    "Quick Start:docs/setup-guide.md"
    "Troubleshooting:docs/troubleshooting.md"
    "Prerequisites:docs/setup-guide.md"
    "FolderSync:scripts/foldersync-rules.md"
)

for section in "${doc_sections[@]}"; do
    section_name=$(echo "$section" | cut -d: -f1)
    doc_file=$(echo "$section" | cut -d: -f2)
    
    if grep -qi "$section_name" "cloud-android-automation/$doc_file" 2>/dev/null; then
        test_pass "Documentation section found: $section_name"
    else
        test_warn "Documentation section missing: $section_name in $doc_file"
    fi
done

# Summary
echo ""
echo "📊 Validation Summary"
echo "===================="
echo -e "Total tests: ${BLUE}$total_tests${NC}"
echo -e "Passed: ${GREEN}$passed_tests${NC}"
echo -e "Failed: ${RED}$failed_tests${NC}"
echo -e "Warnings: ${YELLOW}$((total_tests - passed_tests - failed_tests))${NC}"

echo ""
if [ $failed_tests -eq 0 ]; then
    echo -e "${GREEN}✅ Validation completed successfully!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Read cloud-android-automation/README.md for overview"
    echo "2. Follow cloud-android-automation/docs/setup-guide.md for setup"
    echo "3. Import n8n workflows from cloud-android-automation/n8n-workflows/"
    echo "4. Configure your credentials and webhook URLs"
    echo "5. Test with a small file upload first"
    echo ""
    echo "💡 Pro tip: Start with Option A (Simple Setup) in the setup guide"
    exit 0
else
    echo -e "${RED}❌ Validation failed with $failed_tests errors${NC}"
    echo ""
    echo "🔧 Please fix the failed tests before proceeding with setup"
    exit 1
fi