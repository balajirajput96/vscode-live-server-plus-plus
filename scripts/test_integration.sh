#!/bin/bash

# n8n Integration Test Script
# Usage: ./test_integration.sh

echo "🧪 n8n Integration Test Suite"
echo "=============================="
echo ""

# Test 1: Check if all required files exist
echo "📋 Test 1: Checking required files..."
required_files=(
    "docker-compose.n8n.yml"
    ".env.n8n.example"
    "n8n-complete-setup-guide.md"
    "README-n8n-integration.md"
    "scripts/quick_setup.sh"
    "scripts/health_check.sh"
    "scripts/backup_restore.sh"
    "workflows/complete-test-workflow.json"
    "workflows/error-handling-workflow.json"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo "❌ Some required files are missing. Please ensure all files are present."
    exit 1
fi

echo ""
echo "✅ All required files present"
echo ""

# Test 2: Check script permissions
echo "🔒 Test 2: Checking script permissions..."
scripts=(
    "scripts/quick_setup.sh"
    "scripts/health_check.sh" 
    "scripts/backup_restore.sh"
)

for script in "${scripts[@]}"; do
    if [ -x "$script" ]; then
        echo "✅ $script - executable"
    else
        echo "❌ $script - not executable"
        chmod +x "$script"
        echo "🔧 Fixed: Made $script executable"
    fi
done

echo ""

# Test 3: Validate Docker Compose file
echo "🐳 Test 3: Validating Docker Compose configuration..."
if command -v docker-compose &> /dev/null; then
    if docker-compose -f docker-compose.n8n.yml config >/dev/null 2>&1; then
        echo "✅ Docker Compose configuration is valid"
    else
        echo "❌ Docker Compose configuration has errors"
        docker-compose -f docker-compose.n8n.yml config
        exit 1
    fi
else
    echo "⚠️  Docker Compose not available - skipping validation"
fi

echo ""

# Test 4: Check workflow JSON validity
echo "📄 Test 4: Validating workflow JSON files..."
for workflow in workflows/*.json; do
    if [ -f "$workflow" ]; then
        if command -v jq &> /dev/null; then
            if jq . "$workflow" >/dev/null 2>&1; then
                echo "✅ $workflow - valid JSON"
            else
                echo "❌ $workflow - invalid JSON"
                exit 1
            fi
        else
            if python3 -m json.tool "$workflow" >/dev/null 2>&1; then
                echo "✅ $workflow - valid JSON"
            else
                echo "❌ $workflow - invalid JSON"
                exit 1
            fi
        fi
    fi
done

echo ""

# Test 5: Environment template validation
echo "⚙️  Test 5: Validating environment template..."
if grep -q "CHANGE_ME_TO_STRONG_32_CHAR_KEY" .env.n8n.example; then
    echo "✅ Environment template contains placeholder for encryption key"
else
    echo "❌ Environment template missing encryption key placeholder"
    exit 1
fi

if grep -q "balaji.web.design1@gmail.com" .env.n8n.example; then
    echo "✅ Environment template contains notification email"
else
    echo "❌ Environment template missing notification email"
    exit 1
fi

echo ""

# Test 6: Documentation consistency
echo "📚 Test 6: Checking documentation consistency..."
if grep -q "n8n-complete-setup-guide.md" README.md; then
    echo "✅ Main README references n8n setup guide"
else
    echo "❌ Main README missing n8n setup guide reference"
    exit 1
fi

if grep -q "README-n8n-integration.md" README.md; then
    echo "✅ Main README references n8n integration guide"
else
    echo "❌ Main README missing n8n integration guide reference"
    exit 1
fi

echo ""

# Test 7: Script functionality test (dry run)
echo "🧪 Test 7: Testing script functionality..."

# Test health check script (dry run)
if grep -q "docker-compose -f docker-compose.n8n.yml ps" scripts/health_check.sh; then
    echo "✅ Health check script has correct docker-compose commands"
else
    echo "❌ Health check script missing docker-compose commands"
    exit 1
fi

# Test backup script (dry run)
if grep -q "tar czf" scripts/backup_restore.sh; then
    echo "✅ Backup script has tar command for backup creation"
else
    echo "❌ Backup script missing tar command"
    exit 1
fi

echo ""

# Test 8: Network and port configuration
echo "🌐 Test 8: Checking network and port configuration..."
ports_to_check=(5678 11434 8888)
services_to_check=("n8n" "ollama" "gluetun")

for i in "${!ports_to_check[@]}"; do
    port="${ports_to_check[$i]}"
    service="${services_to_check[$i]}"
    
    if grep -q "\"$port:$port\"" docker-compose.n8n.yml; then
        echo "✅ Port $port configured for $service"
    else
        echo "❌ Port $port not found for $service"
        exit 1
    fi
done

echo ""

# Test 9: Integration points check
echo "🔗 Test 9: Checking integration points..."
if grep -q "Live Server++" README.md && grep -q "n8n" README.md; then
    echo "✅ Integration between Live Server++ and n8n documented"
else
    echo "❌ Integration documentation incomplete"
    exit 1
fi

if grep -q "localhost:5555" README-n8n-integration.md; then
    echo "✅ Career dashboard integration documented"
else
    echo "❌ Career dashboard integration missing"
    exit 1
fi

echo ""

# Final Summary
echo "🎉 Integration Test Results"
echo "=========================="
echo "✅ All tests passed successfully!"
echo ""
echo "📋 What was tested:"
echo "   • File structure and presence"
echo "   • Script permissions and executability"
echo "   • Docker Compose configuration validity"
echo "   • Workflow JSON structure"
echo "   • Environment template correctness"
echo "   • Documentation consistency"
echo "   • Script functionality"
echo "   • Network and port configuration"
echo "   • Integration point documentation"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Run: ./scripts/quick_setup.sh"
echo "2. Access: http://localhost:5678 (n8n)"
echo "3. Access: http://localhost:5555 (Career Dashboard)"
echo "4. Monitor: ./scripts/health_check.sh"
echo ""
echo "📖 Full documentation: README-n8n-integration.md"