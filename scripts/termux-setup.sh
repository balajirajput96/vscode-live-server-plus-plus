#!/bin/bash

# 📱 Termux Setup Script for Cloud-Only Android Automation
# This script sets up the basic Termux environment

set -e  # Exit on any error

echo "🚀 Starting Termux setup for Cloud-Only Android automation..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update packages
print_status "Updating package lists..."
pkg update -y
print_success "Package lists updated"

# Install essential packages
print_status "Installing essential packages..."
pkg install -y \
    curl \
    wget \
    git \
    python \
    nodejs \
    openssh \
    rsync \
    termux-api \
    storage \
    jq

print_success "Essential packages installed"

# Setup storage access
print_status "Setting up storage access..."
termux-setup-storage
print_success "Storage access configured"

# Create directories for automation
print_status "Creating automation directories..."
mkdir -p ~/automation/{logs,config,scripts,tmp}
mkdir -p ~/cloud-mount
mkdir -p ~/automation/webhooks

print_success "Directory structure created"

# Create basic configuration file
print_status "Creating configuration template..."
cat > ~/automation/config/android-config.env << 'EOF'
# 📱 Cloud-Only Android Configuration

# n8n Configuration
N8N_WEBHOOK_URL=""
N8N_API_KEY=""

# Cloud Storage
CLOUD_PROVIDER="google_drive"  # or "onedrive"
RCLONE_CONFIG_NAME="mydrive"

# Telegram Bot (for notifications)
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# Google Drive Configuration
GOOGLE_DRIVE_ROOT_FOLDER="AndroidBackup"

# Automation Settings
AUTO_DELETE_AFTER_UPLOAD="true"
NOTIFICATION_ENABLED="true"
MAX_FILE_SIZE_MB="500"

# Monitoring
STORAGE_ALERT_THRESHOLD="10"  # Alert when less than 10% available
CLEANUP_SCHEDULE="0 2 * * 0"  # Every Sunday at 2 AM

# Debug mode
DEBUG_MODE="false"
EOF

print_success "Configuration template created at ~/automation/config/android-config.env"

# Create webhook handler script
print_status "Creating webhook handler..."
cat > ~/automation/scripts/webhook-handler.sh << 'EOF'
#!/bin/bash

# Webhook handler for file uploads
source ~/automation/config/android-config.env

WEBHOOK_URL="${N8N_WEBHOOK_URL}/webhook/android-upload"

upload_file() {
    local file_path="$1"
    local file_name=$(basename "$file_path")
    local file_size=$(stat -c%s "$file_path" 2>/dev/null || echo "0")
    
    if [ ! -f "$file_path" ]; then
        echo "Error: File not found: $file_path"
        return 1
    fi
    
    echo "Uploading $file_name..."
    
    # Send to n8n webhook
    curl -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"file_path\": \"$file_path\",
            \"file_name\": \"$file_name\",
            \"file_size\": $file_size,
            \"source\": \"manual\",
            \"timestamp\": \"$(date -Iseconds)\"
        }"
}

# Check if file path is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <file_path>"
    exit 1
fi

upload_file "$1"
EOF

chmod +x ~/automation/scripts/webhook-handler.sh
print_success "Webhook handler script created"

# Create file watcher script
print_status "Creating file watcher..."
cat > ~/automation/scripts/file-watcher.sh << 'EOF'
#!/bin/bash

# File watcher for automatic uploads
source ~/automation/config/android-config.env

WATCH_DIRS=(
    "/sdcard/DCIM/Camera"
    "/sdcard/Download"
    "/sdcard/Screenshots"
)

WEBHOOK_URL="${N8N_WEBHOOK_URL}/webhook/android-upload"

watch_and_upload() {
    echo "Starting file watcher..."
    echo "Watching directories: ${WATCH_DIRS[@]}"
    
    while true; do
        for watch_dir in "${WATCH_DIRS[@]}"; do
            if [ -d "$watch_dir" ]; then
                # Find files newer than 5 minutes
                find "$watch_dir" -type f -mmin -5 -exec ~/automation/scripts/webhook-handler.sh {} \;
            fi
        done
        
        # Wait 5 minutes before next check
        sleep 300
    done
}

# Start watching in background
watch_and_upload &
echo $! > ~/automation/tmp/file-watcher.pid
echo "File watcher started with PID: $(cat ~/automation/tmp/file-watcher.pid)"
EOF

chmod +x ~/automation/scripts/file-watcher.sh
print_success "File watcher script created"

# Create startup script
print_status "Creating startup script..."
cat > ~/automation/scripts/start-automation.sh << 'EOF'
#!/bin/bash

# Start all automation services
echo "🚀 Starting Cloud-Only Android Automation..."

# Source configuration
source ~/automation/config/android-config.env

# Start file watcher
echo "Starting file watcher..."
~/automation/scripts/file-watcher.sh

echo "✅ Automation services started!"
echo "📝 Logs: ~/automation/logs/"
echo "⚙️ Config: ~/automation/config/android-config.env"
echo "🛑 To stop: killall file-watcher.sh"
EOF

chmod +x ~/automation/scripts/start-automation.sh
print_success "Startup script created"

# Create alias for easier access
echo "alias cloud-automation='~/automation/scripts/start-automation.sh'" >> ~/.bashrc
echo "alias cloud-upload='~/automation/scripts/webhook-handler.sh'" >> ~/.bashrc

print_success "Command aliases created"

# Display next steps
echo ""
echo "🎉 Termux setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit configuration: nano ~/automation/config/android-config.env"
echo "2. Run rclone setup: ./rclone-setup.sh"
echo "3. Configure n8n webhooks in your n8n instance"
echo "4. Start automation: cloud-automation"
echo ""
echo "💡 Quick Commands:"
echo "• Upload file: cloud-upload /path/to/file"
echo "• Start automation: cloud-automation"
echo "• View logs: tail -f ~/automation/logs/automation.log"
echo ""
echo "🔗 Important Files:"
echo "• Config: ~/automation/config/android-config.env"
echo "• Scripts: ~/automation/scripts/"
echo "• Logs: ~/automation/logs/"

print_success "Termux setup complete! 🎉"