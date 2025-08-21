#!/bin/bash
# 🚀 Personal Automation Quick Setup Script
# This script sets up the complete automation environment

echo "🚀 Personal Automation System - Quick Setup"
echo "==========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python 3 found"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip first."
    exit 1
fi

echo "✅ pip3 found"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv automation_env

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source automation_env/bin/activate

# Install required packages
echo "📥 Installing required packages..."
pip install schedule requests python-dotenv

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p scheduled_posts
mkdir -p schedules
mkdir -p reports
mkdir -p plans
mkdir -p backups

# Create requirements.txt
echo "📄 Creating requirements.txt..."
cat > requirements.txt << EOF
schedule==1.2.0
requests==2.31.0
python-dotenv==1.0.0
openai>=1.0.0
notion-client>=2.0.0
EOF

# Create default config
echo "⚙️ Creating default configuration..."
cat > config.json << EOF
{
  "api_keys": {
    "openai": "",
    "notion": "",
    "gmail": "",
    "slack": "",
    "github": ""
  },
  "settings": {
    "morning_routine_time": "09:00",
    "evening_routine_time": "18:00",
    "backup_time": "23:00",
    "social_media_posting": true,
    "email_processing": true,
    "file_organization": true
  },
  "platforms": {
    "make_com": {
      "enabled": false,
      "api_key": ""
    },
    "zapier": {
      "enabled": false,
      "api_key": ""
    },
    "n8n": {
      "enabled": true,
      "url": "http://localhost:5678",
      "api_key": ""
    }
  }
}
EOF

# Create environment file template
echo "🔐 Creating environment template..."
cat > .env.example << EOF
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
NOTION_API_KEY=your_notion_api_key_here
GMAIL_API_KEY=your_gmail_api_key_here
SLACK_BOT_TOKEN=your_slack_bot_token_here
GITHUB_TOKEN=your_github_token_here

# Make.com
MAKE_API_KEY=your_make_api_key_here
MAKE_WEBHOOK_URL=your_make_webhook_url_here

# Zapier
ZAPIER_API_KEY=your_zapier_api_key_here

# n8n
N8N_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here

# Notification Settings
EMAIL_FROM=your_email@example.com
EMAIL_TO=your_email@example.com
SLACK_CHANNEL=#automation
EOF

# Create startup script
echo "🚀 Creating startup script..."
cat > start_automation.sh << 'EOF'
#!/bin/bash
# Automation startup script

echo "🚀 Starting Personal Automation System..."

# Activate virtual environment
if [ -d "automation_env" ]; then
    source automation_env/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "❌ Virtual environment not found. Run setup.sh first."
    exit 1
fi

# Check if config exists
if [ ! -f "config.json" ]; then
    echo "❌ config.json not found. Run setup.sh first."
    exit 1
fi

# Start automation
python automation_manager.py
EOF

chmod +x start_automation.sh

# Create stop script
echo "🛑 Creating stop script..."
cat > stop_automation.sh << 'EOF'
#!/bin/bash
# Stop automation script

echo "🛑 Stopping Personal Automation System..."

# Find and kill the automation process
pkill -f "automation_manager.py"

echo "✅ Automation system stopped"
EOF

chmod +x stop_automation.sh

# Create manual run script for testing
echo "🧪 Creating test script..."
cat > test_automation.py << 'EOF'
#!/usr/bin/env python3
"""
Test script for personal automation functions
"""

from automation_manager import PersonalAutomationManager
import sys

def test_morning_routine():
    """Test morning routine"""
    print("🧪 Testing morning routine...")
    automation = PersonalAutomationManager()
    automation.morning_routine()
    print("✅ Morning routine test completed")

def test_evening_routine():
    """Test evening routine"""
    print("🧪 Testing evening routine...")
    automation = PersonalAutomationManager()
    automation.evening_routine()
    print("✅ Evening routine test completed")

def test_file_organization():
    """Test file organization"""
    print("🧪 Testing file organization...")
    automation = PersonalAutomationManager()
    automation.organize_files()
    print("✅ File organization test completed")

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_automation.py [morning|evening|files]")
        return
    
    test_type = sys.argv[1].lower()
    
    if test_type == "morning":
        test_morning_routine()
    elif test_type == "evening":
        test_evening_routine()
    elif test_type == "files":
        test_file_organization()
    else:
        print("Invalid test type. Use: morning, evening, or files")

if __name__ == "__main__":
    main()
EOF

# Create .gitignore
echo "📝 Creating .gitignore..."
cat > .gitignore << EOF
# Environment
automation_env/
.env
*.log

# Generated files
scheduled_posts/
schedules/
reports/
plans/
backups/
progress_tracking.json
portfolio_updates_*.txt

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit config.json with your API keys and preferences"
echo "2. Copy .env.example to .env and add your credentials"
echo "3. Run: ./start_automation.sh"
echo ""
echo "🔧 Useful commands:"
echo "• Test morning routine: python test_automation.py morning"
echo "• Test evening routine: python test_automation.py evening"
echo "• Test file organization: python test_automation.py files"
echo "• Start automation: ./start_automation.sh"
echo "• Stop automation: ./stop_automation.sh"
echo ""
echo "📚 Documentation:"
echo "• See COMPREHENSIVE_AI_AUTOMATION_GUIDE.md for detailed instructions"
echo "• Check automation.log for system logs"
echo ""
echo "🚀 Happy automating!"