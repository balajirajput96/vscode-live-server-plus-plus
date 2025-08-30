# 📱 FolderSync Pro Configuration Guide

FolderSync Pro is an excellent app for automated file synchronization between your Android device and cloud storage. This guide will help you set up rules that work perfectly with the n8n automation workflows.

## 🚀 Quick Setup

### Step 1: Install FolderSync Pro
- Download from Google Play Store
- Purchase the Pro version for full automation features
- Grant necessary permissions (Storage, Network)

### Step 2: Add Cloud Account
1. Open FolderSync Pro
2. Tap **Accounts** → **Add Account**
3. Select your cloud provider:
   - **Google Drive** (recommended)
   - **OneDrive**
   - **Dropbox**
4. Complete OAuth authentication
5. Test connection

## 📋 Recommended Sync Rules

### Rule 1: Camera Photos Auto-Backup
```
Name: Camera Backup
Local Folder: /DCIM/Camera/
Remote Folder: /AndroidBackup/Photos/Camera/
Sync Type: To remote folder
Sync Options:
  ✅ Sync new files
  ✅ Delete files in destination folder
  ✅ Only sync via WiFi
  ✅ Delete source file after successful sync
Schedule: Immediate (when file changes)
File Age: Immediately
File Size: All sizes
File Types: jpg, jpeg, png, heic, dng, raw
```

### Rule 2: Screenshots Backup
```
Name: Screenshots Backup
Local Folder: /Pictures/Screenshots/
Remote Folder: /AndroidBackup/Screenshots/
Sync Type: To remote folder
Sync Options:
  ✅ Sync new files
  ✅ Delete source file after successful sync
  ✅ Only sync via WiFi
Schedule: Every 30 minutes
File Types: jpg, jpeg, png
```

### Rule 3: WhatsApp Media Backup
```
Name: WhatsApp Media
Local Folder: /WhatsApp/Media/
Remote Folder: /AndroidBackup/WhatsApp/
Sync Type: To remote folder
Sync Options:
  ✅ Sync new files
  ✅ Delete source file after successful sync
  ✅ Only sync via WiFi
  ✅ Sync subfolders
Schedule: Every 1 hour
File Types: jpg, jpeg, png, mp4, pdf, doc, docx
Filters:
  ❌ Exclude: *.opus (voice notes - too frequent)
  ❌ Exclude: .nomedia files
```

### Rule 4: Downloads Cleanup
```
Name: Downloads Cleanup
Local Folder: /Download/
Remote Folder: /AndroidBackup/Downloads/
Sync Type: To remote folder
Sync Options:
  ✅ Sync new files
  ✅ Delete source file after successful sync
  ✅ Only sync via WiFi
Schedule: Daily at 2 AM
File Age: Older than 1 day
File Size: Larger than 1 MB
Filters:
  ❌ Exclude: *.apk (keep installers local temporarily)
  ❌ Exclude: *.tmp
```

### Rule 5: Documents Backup
```
Name: Documents Backup
Local Folder: /Documents/
Remote Folder: /AndroidBackup/Documents/
Sync Type: To remote folder
Sync Options:
  ✅ Sync new files
  ✅ Sync modified files
  ✅ Only sync via WiFi
Schedule: Every 6 hours
File Types: pdf, doc, docx, txt, xlsx, pptx
```

## ⚙️ Advanced Configuration

### Global Settings
```
Power Management:
  ✅ Keep device awake during sync
  ✅ Use persistent notification
  ❌ Sync when battery low (<20%)

Network Settings:
  ✅ WiFi only
  ✅ Unmetered networks only
  ❌ Allow roaming
  Retry failed transfers: 3 times

Notification Settings:
  ✅ Show sync progress
  ✅ Show sync completion
  ✅ Show sync errors
  ❌ Show all file transfers (too noisy)
```

### Folder Filters
```
Global Exclude Patterns:
- .*              (hidden files)
- *.tmp           (temporary files)
- *.log           (log files)
- *.cache         (cache files)
- .thumbnails/    (thumbnail directories)
- .nomedia        (Android media scanner exclusions)
```

## 🔄 Integration with n8n Workflows

### How FolderSync Works with n8n
1. **FolderSync** handles the heavy lifting of file transfers
2. **n8n workflows** provide intelligent automation and notifications
3. **Perfect combination** for zero-maintenance cloud storage

### Recommended Setup
```
FolderSync Rules → Upload to Cloud
     ↓
n8n Workflows → Monitor & Notify
     ↓
Telegram Notifications → Keep you informed
```

## 📊 Monitoring & Optimization

### Performance Tips
1. **Stagger sync schedules** to avoid conflicts
2. **Use WiFi-only** to save mobile data
3. **Set appropriate file age limits** to avoid syncing temporary files
4. **Monitor storage usage** regularly

### Troubleshooting
```
Common Issues:
❌ Sync fails → Check network connection
❌ Files not uploading → Verify cloud account permissions
❌ Battery drain → Adjust sync frequency
❌ Storage full → Enable auto-delete after sync
```

## 🎯 Pro Tips

### Optimization Strategies
1. **Photo Quality**: Consider enabling "Upload in reduced quality" for photos to save cloud storage
2. **Batch Processing**: Use n8n workflows for bulk operations
3. **Smart Scheduling**: Sync during charging hours (2-6 AM)
4. **Selective Sync**: Don't sync everything - be selective about what needs cloud backup

### Security Considerations
```
Best Practices:
✅ Use strong cloud account passwords
✅ Enable 2FA on cloud accounts
✅ Regularly review synced content
✅ Use encrypted cloud storage when possible
❌ Don't sync sensitive documents without encryption
```

## 📱 Mobile Data Management

### Data-Saving Setup
```
For Limited Mobile Data:
- Set all rules to "WiFi only"
- Use "Sync on charging" option
- Enable "Reduce photo quality"
- Set file size limits (e.g., <50MB)
```

### Unlimited Data Setup
```
For Unlimited Mobile Data:
- Allow mobile data for important folders only
- Set bandwidth limits during peak hours
- Use "Intelligent sync" features
```

## 🔔 Notification Setup

### Recommended Notification Settings
```
Enable Notifications For:
✅ Sync completion (summary only)
✅ Sync errors
✅ Network connectivity issues
✅ Storage space warnings

Disable Notifications For:
❌ Individual file transfers
❌ Sync start notifications
❌ Background sync status
```

---

**💡 Remember**: FolderSync handles the file transfers, while n8n workflows provide intelligent automation, monitoring, and notifications. Together, they create a powerful cloud-first mobile experience!

**🚀 Quick Start Command**: After setting up these rules, your phone will automatically become a cloud-first device with near-zero local storage usage.