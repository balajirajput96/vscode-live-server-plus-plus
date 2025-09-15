#!/bin/bash

# 📱 rclone Setup Script for Cloud-Only Android Automation
# This script installs and configures rclone for cloud storage mounting

set -e  # Exit on any error

echo "☁️ Starting rclone setup for Cloud-Only Android automation..."

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

# Check if we're in Termux
if [ ! -d "/data/data/com.termux" ]; then
    print_error "This script is designed for Termux environment"
    exit 1
fi

# Install rclone
print_status "Installing rclone..."
pkg install rclone -y
print_success "rclone installed successfully"

# Create rclone config directory
mkdir -p ~/.config/rclone

# Check if rclone config already exists
if [ -f ~/.config/rclone/rclone.conf ]; then
    print_warning "rclone configuration already exists"
    read -p "Do you want to reconfigure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Skipping rclone configuration"
        exit 0
    fi
fi

# Interactive rclone configuration
print_status "Starting rclone configuration..."
print_warning "You'll need to configure your cloud storage provider"
echo ""
echo "🔧 Configuration Options:"
echo "1. Google Drive (recommended)"
echo "2. OneDrive"
echo "3. Dropbox"
echo "4. Other (manual configuration)"
echo ""

read -p "Select cloud provider (1-4): " provider_choice

case $provider_choice in
    1)
        print_status "Configuring Google Drive..."
        cat > ~/.config/rclone/rclone.conf << 'EOF'
[mydrive]
type = drive
client_id = 
client_secret = 
scope = drive
root_folder_id = 
service_account_file = 
EOF
        print_status "Google Drive template created"
        print_warning "You need to complete the OAuth setup manually"
        echo "Run: rclone config to complete Google Drive setup"
        ;;
    2)
        print_status "Configuring OneDrive..."
        cat > ~/.config/rclone/rclone.conf << 'EOF'
[mydrive]
type = onedrive
client_id = 
client_secret = 
region = global
EOF
        print_status "OneDrive template created"
        print_warning "You need to complete the OAuth setup manually"
        echo "Run: rclone config to complete OneDrive setup"
        ;;
    3)
        print_status "Configuring Dropbox..."
        cat > ~/.config/rclone/rclone.conf << 'EOF'
[mydrive]
type = dropbox
client_id = 
client_secret = 
EOF
        print_status "Dropbox template created"
        print_warning "You need to complete the OAuth setup manually"
        echo "Run: rclone config to complete Dropbox setup"
        ;;
    4)
        print_status "Starting manual rclone configuration..."
        rclone config
        ;;
    *)
        print_error "Invalid selection"
        exit 1
        ;;
esac

# Create mount directory
print_status "Creating mount directories..."
mkdir -p ~/cloud-mount
mkdir -p /data/data/com.termux/files/home/storage/shared/Cloud

print_success "Mount directories created"

# Create mount script
print_status "Creating mount script..."
cat > ~/automation/scripts/mount-cloud.sh << 'EOF'
#!/bin/bash

# Cloud storage mount script
source ~/automation/config/android-config.env

MOUNT_POINT="/data/data/com.termux/files/home/storage/shared/Cloud"
RCLONE_REMOTE="${RCLONE_CONFIG_NAME:-mydrive}:"

echo "🔗 Mounting cloud storage..."

# Check if already mounted
if mountpoint -q "$MOUNT_POINT" 2>/dev/null; then
    echo "⚠️ Cloud storage already mounted at $MOUNT_POINT"
    exit 0
fi

# Create mount point if it doesn't exist
mkdir -p "$MOUNT_POINT"

# Mount with optimized settings for mobile
rclone mount "$RCLONE_REMOTE" "$MOUNT_POINT" \
    --vfs-cache-mode writes \
    --vfs-cache-max-age 24h \
    --vfs-cache-max-size 1G \
    --vfs-read-chunk-size 64M \
    --vfs-read-chunk-size-limit 1G \
    --buffer-size 64M \
    --dir-cache-time 24h \
    --poll-interval 1m \
    --daemon \
    --allow-other \
    --allow-non-empty

if [ $? -eq 0 ]; then
    echo "✅ Cloud storage mounted successfully at $MOUNT_POINT"
    
    # Create symlink for easier access
    ln -sf "$MOUNT_POINT" ~/cloud
    echo "🔗 Symlink created: ~/cloud -> $MOUNT_POINT"
else
    echo "❌ Failed to mount cloud storage"
    exit 1
fi
EOF

chmod +x ~/automation/scripts/mount-cloud.sh
print_success "Mount script created"

# Create unmount script
print_status "Creating unmount script..."
cat > ~/automation/scripts/unmount-cloud.sh << 'EOF'
#!/bin/bash

# Cloud storage unmount script
MOUNT_POINT="/data/data/com.termux/files/home/storage/shared/Cloud"

echo "📤 Unmounting cloud storage..."

if mountpoint -q "$MOUNT_POINT" 2>/dev/null; then
    fusermount -u "$MOUNT_POINT"
    if [ $? -eq 0 ]; then
        echo "✅ Cloud storage unmounted successfully"
        # Remove symlink
        rm -f ~/cloud
    else
        echo "❌ Failed to unmount cloud storage"
        exit 1
    fi
else
    echo "⚠️ Cloud storage not mounted"
fi
EOF

chmod +x ~/automation/scripts/unmount-cloud.sh
print_success "Unmount script created"

# Create sync script for manual sync
print_status "Creating sync script..."
cat > ~/automation/scripts/sync-to-cloud.sh << 'EOF'
#!/bin/bash

# Manual sync script for important directories
source ~/automation/config/android-config.env

RCLONE_REMOTE="${RCLONE_CONFIG_NAME:-mydrive}:"

# Directories to sync
SYNC_DIRS=(
    "/sdcard/DCIM/Camera:Photos/Camera"
    "/sdcard/Screenshots:Photos/Screenshots"
    "/sdcard/Download:Downloads"
    "/sdcard/Documents:Documents"
)

echo "🔄 Starting manual sync to cloud..."

for sync_pair in "${SYNC_DIRS[@]}"; do
    local_dir=$(echo "$sync_pair" | cut -d':' -f1)
    remote_dir=$(echo "$sync_pair" | cut -d':' -f2)
    
    if [ -d "$local_dir" ]; then
        echo "📂 Syncing $local_dir to $remote_dir..."
        rclone sync "$local_dir" "$RCLONE_REMOTE$remote_dir" \
            --progress \
            --transfers 4 \
            --checkers 8 \
            --exclude ".*" \
            --exclude "*.tmp"
        
        if [ $? -eq 0 ]; then
            echo "✅ Synced $local_dir"
        else
            echo "❌ Failed to sync $local_dir"
        fi
    else
        echo "⚠️ Directory not found: $local_dir"
    fi
done

echo "🎉 Manual sync completed!"
EOF

chmod +x ~/automation/scripts/sync-to-cloud.sh
print_success "Sync script created"

# Test rclone installation
print_status "Testing rclone installation..."
if command -v rclone &> /dev/null; then
    rclone_version=$(rclone version | head -1)
    print_success "rclone is working: $rclone_version"
else
    print_error "rclone installation failed"
    exit 1
fi

# Add aliases to bashrc
print_status "Adding convenience aliases..."
cat >> ~/.bashrc << 'EOF'

# Cloud automation aliases
alias mount-cloud='~/automation/scripts/mount-cloud.sh'
alias unmount-cloud='~/automation/scripts/unmount-cloud.sh'
alias sync-cloud='~/automation/scripts/sync-to-cloud.sh'
alias cloud-status='df -h ~/cloud 2>/dev/null || echo "Cloud not mounted"'
EOF

print_success "Aliases added to ~/.bashrc"

# Display completion message
echo ""
echo "🎉 rclone setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Complete OAuth setup: rclone config"
echo "2. Test connection: rclone lsd mydrive:"
echo "3. Mount cloud storage: mount-cloud"
echo "4. Configure n8n workflows with your webhook URLs"
echo ""
echo "💡 Quick Commands:"
echo "• Mount cloud: mount-cloud"
echo "• Unmount cloud: unmount-cloud"
echo "• Manual sync: sync-cloud"
echo "• Check status: cloud-status"
echo "• Test connection: rclone lsd mydrive:"
echo ""
echo "🔧 Configuration Files:"
echo "• rclone config: ~/.config/rclone/rclone.conf"
echo "• Mount scripts: ~/automation/scripts/"
echo ""
echo "⚠️ Important Notes:"
echo "• Complete OAuth setup with: rclone config"
echo "• Test your connection before mounting"
echo "• Cloud files will appear at ~/cloud when mounted"

print_success "rclone setup complete! ☁️"