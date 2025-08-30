# 🔧 Troubleshooting Guide

Common issues and solutions for the Cloud-Only Android Automation system.

## 🚨 Quick Diagnostics

### Health Check Commands
```bash
# Check n8n workflow status
curl -X POST "YOUR_WEBHOOK_URL/health" -H "Content-Type: application/json" -d '{"test":"ping"}'

# Check cloud connectivity (Termux)
rclone lsd mydrive:

# Check storage status
df -h /sdcard

# Check automation services
ps aux | grep -E "(file-watcher|rclone)"
```

---

## 📱 FolderSync Issues

### ❌ "Sync Not Starting"
**Symptoms:**
- Files remain in local folders
- No sync activity in FolderSync logs
- Cloud storage not updating

**Solutions:**
```bash
1. Check Network Connection:
   - Ensure WiFi is connected
   - Test internet connectivity
   - Check if cloud service is accessible

2. Verify Account Authentication:
   - Go to Accounts → Test Connection
   - Re-authenticate if needed
   - Check OAuth token expiry

3. Check Sync Rules:
   - Verify rules are enabled (green icon)
   - Check folder paths are correct
   - Ensure sync direction is set properly

4. Review Filters:
   - Check file type filters
   - Verify file size limits
   - Review exclude patterns
```

### ❌ "Files Not Deleting After Upload"
**Symptoms:**
- Files upload successfully but remain locally
- Local storage continues to fill up

**Solutions:**
```bash
1. Check Sync Settings:
   - Enable "Delete source file after sync"
   - Verify "Sync completion confirmation" is enabled
   - Check "Retry failed operations"

2. Permissions:
   - Grant all storage permissions to FolderSync
   - Enable "Modify system settings" if needed
   - Check file access permissions

3. Error Logs:
   - Review FolderSync error logs
   - Look for permission denied errors
   - Check for file-in-use conflicts
```

### ❌ "Sync Fails on Mobile Data"
**Symptoms:**
- Sync works on WiFi but fails on mobile data
- "Network error" messages

**Solutions:**
```bash
1. Data Settings:
   - Disable "WiFi only" mode temporarily
   - Check mobile data permissions for FolderSync
   - Verify data limit settings

2. Network Configuration:
   - Enable "Allow background data usage"
   - Disable data saver for FolderSync
   - Check APN settings

3. Carrier Restrictions:
   - Some carriers block large uploads
   - Try uploading smaller files first
   - Consider VPN if carrier is restrictive
```

---

## 🔗 n8n Workflow Issues

### ❌ "Webhook Not Triggering"
**Symptoms:**
- Manual workflow execution works
- Webhook calls return errors
- No execution history for webhook triggers

**Solutions:**
```bash
1. Check Webhook URL:
   curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'

2. Verify Webhook Configuration:
   - Check webhook path in n8n workflow
   - Verify HTTP method (GET/POST)
   - Review authentication settings

3. Network Connectivity:
   - Test from different networks
   - Check firewall/proxy settings
   - Verify SSL certificate validity

4. n8n Instance Health:
   - Check n8n server logs
   - Verify instance is running
   - Review resource usage (CPU/memory)
```

### ❌ "Google Drive Upload Fails"
**Symptoms:**
- "Authentication failed" errors
- "Quota exceeded" messages
- "Permission denied" errors

**Solutions:**
```bash
1. Re-authenticate Google Drive:
   - Go to n8n Credentials → Google Drive
   - Re-run OAuth flow
   - Verify all required scopes are granted

2. Check Storage Quota:
   - Visit drive.google.com
   - Check available storage space
   - Clean up or purchase additional storage

3. API Limits:
   - Check Google Drive API quota
   - Implement rate limiting in workflows
   - Consider using service account for higher limits

4. Permissions:
   - Verify folder permissions in Google Drive
   - Check parent folder access
   - Ensure write permissions are granted
```

### ❌ "Telegram Notifications Not Working"
**Symptoms:**
- No notifications received
- Bot responds but messages don't arrive
- "Chat not found" errors

**Solutions:**
```bash
1. Bot Configuration:
   - Send /start to your bot
   - Verify bot token is correct
   - Check chat ID is accurate

2. Test Bot Manually:
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{"chat_id": "YOUR_CHAT_ID", "text": "Test message"}'

3. Permissions:
   - Ensure bot isn't blocked
   - Check bot privacy settings
   - Verify bot has permission to send messages

4. Rate Limits:
   - Telegram has message rate limits
   - Implement delays between messages
   - Batch notifications when possible
```

---

## 📲 Termux & rclone Issues

### ❌ "rclone Mount Fails"
**Symptoms:**
- "Mount failed" errors
- Cloud folder appears empty
- "Permission denied" when accessing mount

**Solutions:**
```bash
1. Check rclone Configuration:
   rclone config show
   rclone lsd mydrive:  # Test connectivity

2. Mount Point Issues:
   - Ensure mount directory exists
   - Check permissions on mount point
   - Try different mount location

3. Termux Permissions:
   - Grant storage permission to Termux
   - Run termux-setup-storage
   - Check if SELinux is blocking

4. Alternative Mount Commands:
   # Basic mount without advanced options
   rclone mount mydrive: ~/cloud-mount --daemon

   # With reduced permissions
   rclone mount mydrive: ~/cloud-mount --allow-other --daemon
```

### ❌ "Storage Permission Denied"
**Symptoms:**
- "Permission denied" when accessing /sdcard
- Scripts fail to read/write files
- Mount operations fail

**Solutions:**
```bash
1. Grant Permissions:
   - Run termux-setup-storage again
   - Grant all requested permissions
   - Restart Termux after granting permissions

2. Check Scoped Storage:
   # Android 10+ has scoped storage restrictions
   # Use termux-storage-get for file access
   termux-storage-get /path/to/file

3. Alternative Paths:
   # Use Termux internal storage paths
   ~/storage/shared/  # Instead of /sdcard/
   ~/storage/dcim/    # Instead of /sdcard/DCIM/
```

### ❌ "High Battery Usage"
**Symptoms:**
- Termux appears in battery usage statistics
- Phone heating up
- Battery draining quickly

**Solutions:**
```bash
1. Optimize Scripts:
   - Add sleep intervals in loops
   - Reduce file checking frequency
   - Use efficient file operations

2. Battery Optimization:
   - Exclude Termux from battery optimization
   - Settings → Battery → App optimization
   - Set Termux to "Don't optimize"

3. Resource Monitoring:
   top  # Check CPU usage
   free  # Check memory usage
   # Kill resource-heavy processes if needed
```

---

## 📊 Storage Issues

### ❌ "Storage Still Filling Up"
**Symptoms:**
- Local storage usage above 80%
- Files not being cleaned up
- Cache accumulating

**Solutions:**
```bash
1. Identify Storage Users:
   # Check largest directories
   du -sh /sdcard/* | sort -hr | head -10
   
   # Check app data usage
   du -sh /sdcard/Android/data/* | sort -hr | head -10

2. Manual Cleanup:
   # Clear thumbnails
   rm -rf /sdcard/DCIM/.thumbnails/*
   rm -rf /sdcard/Pictures/.thumbnails/*
   
   # Clear downloads older than 7 days
   find /sdcard/Download -type f -mtime +7 -delete
   
   # Clear temp files
   find /sdcard -name "*.tmp" -delete
   find /sdcard -name "*.log" -delete

3. App Cache Cleanup:
   # Clear browser cache
   rm -rf /sdcard/Android/data/com.android.chrome/cache/*
   
   # Clear app caches (requires root)
   pm clear com.instagram.android
   pm clear com.facebook.katana
```

### ❌ "Duplicate Files in Cloud"
**Symptoms:**
- Same files appearing multiple times in cloud storage
- Cloud storage usage higher than expected
- Sync conflicts

**Solutions:**
```bash
1. Enable Duplicate Detection:
   # In FolderSync: Enable "Skip duplicates"
   # In rclone: Use --skip-existing flag
   
2. Manual Duplicate Cleanup:
   # Find duplicates in cloud (using rclone)
   rclone dedupe mydrive:AndroidBackup
   
3. Prevent Future Duplicates:
   # Ensure only one sync method per folder
   # Don't overlap FolderSync and n8n workflows
   # Use unique naming conventions
```

---

## 🔄 Performance Issues

### ❌ "Slow Upload Speeds"
**Symptoms:**
- Files take hours to upload
- Sync operations timeout
- Poor network performance

**Solutions:**
```bash
1. Network Optimization:
   # Use 5GHz WiFi if available
   # Check bandwidth limits in apps
   # Test upload speed: speedtest-cli

2. Upload Settings:
   # Reduce concurrent uploads
   # Increase chunk size for large files
   # Enable resumable uploads

3. rclone Optimization:
   rclone mount mydrive: ~/cloud \
     --buffer-size 64M \
     --vfs-read-chunk-size 128M \
     --transfers 4

4. FolderSync Optimization:
   # Reduce "Max concurrent transfers"
   # Increase "Transfer timeout"
   # Enable "Resume interrupted transfers"
```

### ❌ "High Data Usage"
**Symptoms:**
- Unexpected mobile data consumption
- Data plan exhausted quickly
- Uploads happening on mobile data

**Solutions:**
```bash
1. WiFi-Only Settings:
   # FolderSync: Enable "WiFi only"
   # n8n workflows: Add WiFi check conditions
   
2. Data Monitoring:
   # Check data usage per app
   # Set data warnings and limits
   # Monitor background data usage

3. Compression:
   # Enable photo compression in FolderSync
   # Use rclone compression for uploads
   # Reduce video quality settings
```

---

## 🛠️ Advanced Troubleshooting

### Debug Mode
```bash
# Enable debug logging
echo "DEBUG_MODE=true" >> ~/automation/config/android-config.env

# Check detailed logs
tail -f ~/automation/logs/debug.log

# n8n workflow debugging
# Add "Set" nodes to inspect data flow
# Enable "Save execution progress" in workflow settings
```

### Log Analysis
```bash
# Search for errors in logs
grep -i error ~/automation/logs/*.log

# Check workflow execution times
grep "execution" ~/automation/logs/*.log | tail -20

# Monitor resource usage
top -p $(pgrep -f "file-watcher\|rclone")
```

### Network Diagnostics
```bash
# Test connectivity to various services
ping google.com
nslookup drive.google.com
curl -I https://api.telegram.org

# Check port connectivity
nc -zv your-n8n-instance.com 443
```

### Reset Procedures
```bash
# Reset FolderSync
# Uninstall and reinstall app
# Reconfigure all sync rules

# Reset n8n workflows
# Re-import workflow JSON files
# Reconfigure all credentials

# Reset Termux environment
# Clear Termux data in Android settings
# Re-run setup scripts
```

---

## 📞 Getting Help

### Before Seeking Help
1. Check this troubleshooting guide
2. Review workflow execution logs in n8n
3. Test individual components separately
4. Document exact error messages

### Information to Provide
- Android version and device model
- n8n version and hosting method
- Exact error messages
- Steps to reproduce the issue
- Recent changes to configuration

### Support Resources
- n8n Community Forum
- FolderSync Pro Support
- Termux Wiki and Community
- rclone Documentation

---

**💡 Pro Tip**: Most issues are resolved by checking logs, verifying credentials, and ensuring proper permissions. Start with the basics before diving into complex solutions!