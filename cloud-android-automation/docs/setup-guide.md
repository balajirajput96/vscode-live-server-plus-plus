# 📱 Cloud-Only Android Setup Guide

Complete step-by-step guide to transform your Android phone into a cloud-first device.

## 🎯 Overview

This setup will:
- ✅ Keep your phone's storage always empty (only apps + minimal cache)
- ✅ Automatically backup all photos, videos, and documents to cloud
- ✅ Sync WhatsApp/Telegram media to cloud and delete local copies
- ✅ Clean cache-heavy apps weekly
- ✅ Monitor storage and alert when low
- ✅ Provide complete automation with minimal manual intervention

## 📋 Prerequisites

### Required
- Android phone (Android 7+ recommended)
- n8n instance running (see main repository setup guide)
- Google Drive or OneDrive account with sufficient storage
- Telegram account (for notifications)

### Recommended
- FolderSync Pro app (for advanced sync features)
- Termux app (for advanced automation)
- 2GB+ cloud storage (depends on your usage)

## 🚀 Quick Start (5 minutes)

### Option A: Simple Setup (No root required)
1. **Import n8n workflows** (2 minutes)
2. **Configure FolderSync Pro** (2 minutes)  
3. **Test and activate** (1 minute)

### Option B: Advanced Setup (With Termux)
1. **Setup Termux environment** (5 minutes)
2. **Configure rclone mounting** (5 minutes)
3. **Import and configure n8n workflows** (5 minutes)
4. **Test complete automation** (5 minutes)

---

## 📱 Option A: Simple Setup (Recommended for most users)

### Step 1: n8n Workflow Import

1. **Open your n8n instance**
   ```
   https://your-n8n-instance.com
   ```

2. **Import workflows**
   - Go to **Workflows** → **Import from JSON**
   - Import these files one by one:
     - `auto-upload-files.json`
     - `whatsapp-media-handler.json` 
     - `cache-cleaner.json`
     - `low-storage-alert.json`

3. **Configure credentials**
   - **Google Drive OAuth2**: Complete authentication flow
   - **Telegram API**: Add your bot token and chat ID
   - **Webhook Auth**: Set authentication if needed

4. **Update webhook URLs**
   - Note your webhook URLs for each workflow
   - Update any hardcoded URLs in the workflows

5. **Activate workflows**
   - Enable all 4 workflows
   - Test each webhook with a sample request

### Step 2: Configure FolderSync Pro

1. **Install FolderSync Pro**
   - Download from Google Play Store
   - Purchase Pro version for full features

2. **Add cloud account**
   - Open FolderSync Pro
   - **Accounts** → **Add Account**
   - Select **Google Drive** or **OneDrive**
   - Complete authentication

3. **Create sync rules** (follow the detailed guide in `scripts/foldersync-rules.md`)
   
   **Quick Rules:**
   ```
   Camera Photos: /DCIM/Camera/ → /AndroidBackup/Photos/
   Screenshots: /Pictures/Screenshots/ → /AndroidBackup/Screenshots/
   WhatsApp Media: /WhatsApp/Media/ → /AndroidBackup/WhatsApp/
   Downloads: /Download/ → /AndroidBackup/Downloads/
   ```

4. **Configure sync options**
   - ✅ Delete source after sync
   - ✅ WiFi only
   - ✅ Auto-sync when files change
   - ✅ Show notifications for errors only

### Step 3: Test & Activate

1. **Test photo upload**
   - Take a test photo
   - Wait 1-2 minutes
   - Check if it appears in cloud storage
   - Verify local copy is deleted

2. **Test n8n notifications**
   - Check Telegram for upload notifications
   - Verify workflow execution logs in n8n

3. **Activate all automation**
   - Enable all FolderSync rules
   - Confirm all n8n workflows are active
   - Monitor for first few hours

---

## 🔧 Option B: Advanced Setup (With Termux)

### Step 1: Termux Environment Setup

1. **Install Termux**
   ```bash
   # Download from F-Droid (recommended) or Google Play Store
   # Grant storage permissions when prompted
   ```

2. **Run setup script**
   ```bash
   # Copy termux-setup.sh to your device
   chmod +x termux-setup.sh
   ./termux-setup.sh
   ```

3. **Configure environment**
   ```bash
   # Edit configuration
   nano ~/automation/config/android-config.env
   
   # Add your settings:
   N8N_WEBHOOK_URL="https://your-n8n-instance.com"
   TELEGRAM_BOT_TOKEN="your-bot-token"
   TELEGRAM_CHAT_ID="your-chat-id"
   ```

### Step 2: rclone Setup

1. **Run rclone setup**
   ```bash
   ./rclone-setup.sh
   ```

2. **Complete OAuth configuration**
   ```bash
   rclone config
   # Follow prompts to setup Google Drive/OneDrive
   ```

3. **Test cloud connection**
   ```bash
   rclone lsd mydrive:
   # Should list your cloud storage contents
   ```

4. **Mount cloud storage**
   ```bash
   mount-cloud
   # Cloud storage now accessible at ~/cloud
   ```

### Step 3: n8n Workflow Configuration

1. **Import workflows** (same as Option A)

2. **Configure webhook integration**
   ```bash
   # Test webhook connectivity
   curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"test": "connection"}'
   ```

3. **Setup automated file watching**
   ```bash
   # Start automation services
   cloud-automation
   ```

### Step 4: Complete Testing

1. **Test file upload automation**
   ```bash
   # Upload a test file
   cloud-upload /path/to/test/file.jpg
   ```

2. **Test storage monitoring**
   ```bash
   # Check storage status
   cloud-status
   ```

3. **Monitor automation logs**
   ```bash
   # View real-time logs
   tail -f ~/automation/logs/automation.log
   ```

---

## ⚙️ Configuration Customization

### Webhook URLs
Update these in your workflows:
```
Auto Upload: https://your-n8n.com/webhook/android-upload
WhatsApp Media: https://your-n8n.com/webhook/whatsapp-media
Cache Cleaner: https://your-n8n.com/webhook/cache-clean
Storage Alert: https://your-n8n.com/webhook/storage-alert
```

### Telegram Bot Setup
1. Create bot with @BotFather
2. Get bot token
3. Find your chat ID (send message to @userinfobot)
4. Update workflows with your credentials

### Cloud Storage Folders
Customize folder structure in workflows:
```json
{
  "photos": "/AndroidBackup/Photos/",
  "videos": "/AndroidBackup/Videos/", 
  "documents": "/AndroidBackup/Documents/",
  "whatsapp": "/AndroidBackup/WhatsApp/",
  "downloads": "/AndroidBackup/Downloads/"
}
```

## 🔍 Verification & Monitoring

### Daily Checks (First Week)
- [ ] Photos automatically uploaded and deleted locally
- [ ] WhatsApp media synced to cloud  
- [ ] Storage remains below 80% usage
- [ ] Telegram notifications working
- [ ] No failed workflow executions

### Weekly Checks (Ongoing)
- [ ] Cache cleaner running on schedule
- [ ] Storage alerts functioning
- [ ] Cloud storage organized properly
- [ ] No duplicate files accumulating

### Monthly Checks
- [ ] Review cloud storage usage
- [ ] Check workflow execution statistics
- [ ] Update automation rules if needed
- [ ] Verify backup integrity

## 🚨 Troubleshooting

### Common Issues

**Photos not uploading:**
- Check WiFi connection
- Verify FolderSync rules are enabled
- Check n8n workflow execution logs
- Confirm cloud storage permissions

**Storage still filling up:**
- Check which apps/folders are using space
- Verify auto-delete settings are enabled
- Run manual cache cleanup
- Review excluded file types

**Notifications not working:**
- Verify Telegram bot token and chat ID
- Check n8n workflow credentials
- Test bot manually with @BotFather

**Workflows failing:**
- Check n8n execution logs
- Verify all credentials are valid
- Test webhook connectivity
- Review error messages in Telegram

### Quick Fixes
```bash
# Restart automation
killall file-watcher.sh
cloud-automation

# Manual cleanup
sync-cloud
rm -rf /sdcard/DCIM/.thumbnails/*

# Check logs
tail -f ~/automation/logs/automation.log
```

## 📊 Expected Results

### Storage Usage
- **Before:** 80-90% storage used
- **After:** 10-20% storage used (apps + minimal cache only)

### Daily Automation
- **Photos:** Uploaded within 5 minutes of capture
- **WhatsApp:** Synced every 30 minutes
- **Downloads:** Cleaned up daily
- **Cache:** Cleared weekly

### Notifications
- Upload confirmations
- Storage warnings
- Weekly cleanup summaries
- Error alerts (rare)

## 🎉 Success Indicators

✅ **Local storage consistently below 20%**  
✅ **All photos appear in cloud storage**  
✅ **WhatsApp media folder stays small**  
✅ **Regular Telegram notifications**  
✅ **Phone feels faster and more responsive**  

---

**🎯 Goal Achieved:** Your Android phone is now a cloud-first device with automatic storage management!