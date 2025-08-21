# 🔐 Security Configuration Guide

## 🎯 Overview
Comprehensive security setup for all automation systems, including 2FA, key management, and credential rotation procedures.

## 🔒 Two-Factor Authentication (2FA) Setup

### Priority Accounts for 2FA
```
🚨 CRITICAL - Enable 2FA Immediately:
✅ Google Workspace (Gmail, Drive, etc.)
✅ GitHub (repository access)
✅ OpenAI (API access)
✅ n8n instance admin
✅ Domain/DNS provider
✅ Cloud hosting provider
✅ Bank/financial accounts
```

### Google Workspace 2FA
1. **Admin Console**: [admin.google.com](https://admin.google.com)
2. **Security → 2-Step Verification**
3. **Enforcement**: Make mandatory for all university accounts
4. **Backup Codes**: Generate and store securely

```bash
# Google 2FA Setup Commands
# Admin enforcement via Admin Console:
Security > 2-Step Verification > Turn on enforcement
```

### GitHub 2FA Setup
1. **Settings**: Go to GitHub Settings → Security
2. **Enable 2FA**: Choose authenticator app or SMS
3. **Backup Codes**: Download and store safely
4. **Organization Policy**: Require 2FA for all org members

```bash
# GitHub CLI 2FA check
gh auth status
gh auth refresh --scopes admin:org
```

### OpenAI 2FA  
1. **Account Settings**: [platform.openai.com](https://platform.openai.com)
2. **Security**: Enable two-factor authentication
3. **API Keys**: Review and rotate regularly
4. **Usage Monitoring**: Set up alerts for unusual activity

## 🔑 API Key Management

### Current API Keys Inventory
```
📋 API Keys to Secure:
• OpenAI API Key (GPT-4o-mini access)
• Google Workspace API credentials
• GitHub Personal Access Tokens  
• n8n webhook URLs
• Azure service credentials (if applicable)
• Domain provider API keys
```

### Secure Storage Locations
```
🏦 Credential Storage Hierarchy:
1. 🥇 Production: n8n credentials vault
2. 🥈 Development: GitHub Secrets (encrypted)
3. 🥉 Local: .env files (gitignored)
4. ❌ Never: Plain text in code repositories
```

### GitHub Secrets Configuration
```bash
# Required GitHub Secrets
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/balaji-automation
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxx (optional)
AZURE_PUBLISH_PROFILE=<base64-encoded-profile> (if using Azure)
AZURE_CREDENTIALS={"clientId":"xxx","clientSecret":"xxx"} (alternative)
```

#### Adding Secrets to GitHub:
1. **Repository Settings**: Go to Settings → Secrets and variables → Actions
2. **New Secret**: Click "New repository secret"
3. **Add Each Key**: Name and value pairs
4. **Verification**: Test in workflows

### n8n Credentials Vault
```
🔐 n8n Credential Types:
• OpenAI API (for AI responses)
• Gmail OAuth (for email sending)
• Google Drive OAuth (for file storage)
• Custom webhook authentication
```

#### n8n Credential Setup:
1. **Credentials Menu**: Go to n8n → Credentials
2. **Add Credential**: Select service type
3. **OAuth Flow**: Complete authentication
4. **Test Connection**: Verify functionality
5. **Secure Storage**: Credentials encrypted at rest

## 🔄 Key Rotation Schedule

### Monthly Rotation (High Priority)
```
📅 Monthly Tasks (1st of each month):
✅ GitHub Personal Access Tokens
✅ OpenAI API keys (if usage is high)
✅ n8n admin passwords
✅ Webhook URLs (if compromised)
```

### Quarterly Rotation (Medium Priority)
```
📅 Quarterly Tasks (Every 3 months):
✅ Google Workspace service account keys
✅ Cloud provider credentials
✅ Domain provider API keys
✅ Database passwords (if applicable)
```

### Annual Rotation (Standard)
```
📅 Annual Tasks (January 1st):
✅ All OAuth applications re-authorization
✅ SSL/TLS certificates
✅ Backup encryption keys
✅ Master passwords
```

### Rotation Automation Script
```bash
#!/bin/bash
# Key rotation reminder script

echo "🔄 Security Key Rotation Checklist"
echo "=================================="

# Check last rotation dates
LAST_ROTATION_FILE="~/.security_rotation_log"

if [ -f "$LAST_ROTATION_FILE" ]; then
    echo "📅 Last rotation: $(cat $LAST_ROTATION_FILE)"
else
    echo "⚠️  No rotation history found"
fi

# Current date
CURRENT_DATE=$(date +%Y-%m-%d)
echo "📅 Current date: $CURRENT_DATE"

# Rotation reminders
echo ""
echo "🔑 Keys to rotate this month:"
echo "• GitHub PAT (if > 30 days)"
echo "• OpenAI API key (if high usage)"
echo "• n8n admin password"

# Log current check
echo "$CURRENT_DATE - Rotation check completed" >> "$LAST_ROTATION_FILE"
```

## 🚨 Security Incident Response

### Compromised API Key Response
```bash
# Emergency API key rotation
1. 🚨 Immediately revoke compromised key
2. 🔄 Generate new API key
3. 📝 Update all services using the key
4. 🔍 Review access logs for unauthorized usage
5. 📧 Notify team of security incident
```

### GitHub Token Compromise
```bash
# If GitHub PAT was exposed publicly:
1. 🚨 Revoke token immediately (GitHub Settings → Personal access tokens)
2. 🔍 Check "Security" tab for unauthorized access
3. 🔄 Create new token with minimal required scopes
4. 📝 Update GitHub Secrets in all repositories
5. 🔐 Enable alerts for future token exposure
```

### Webhook URL Exposure
```bash
# If n8n webhook URL was leaked:
1. 🚨 Disable current webhook endpoint
2. 🔄 Create new webhook path
3. 📝 Update GitHub Actions with new URL
4. 🔍 Monitor n8n logs for unauthorized requests
5. 🔐 Add IP restrictions if possible
```

## 📊 Security Monitoring

### GitHub Security Alerts
```
🔍 Enable GitHub Security Features:
✅ Dependabot alerts
✅ Secret scanning
✅ Code scanning (if available)
✅ Dependency review
✅ Security advisories
```

### API Usage Monitoring
```javascript
// OpenAI usage monitoring
function checkAPIUsage() {
    // Monitor via OpenAI dashboard
    // Set up alerts for:
    // - Unusual usage spikes
    // - API calls from unknown IPs
    // - Rate limit approaches
    console.log("📊 Check OpenAI usage dashboard weekly");
}

// n8n activity monitoring  
function monitorN8nActivity() {
    // Check n8n execution logs
    // Monitor for:
    // - Failed webhook calls
    // - Unusual execution patterns
    // - Error rate increases
    console.log("📈 Review n8n execution logs");
}
```

### Security Audit Checklist
```
🔍 Weekly Security Audit:
□ Review GitHub repository access logs
□ Check OpenAI API usage patterns
□ Monitor n8n workflow execution logs
□ Verify 2FA is active on critical accounts
□ Check for any failed login attempts
□ Review webhook endpoint security
□ Validate SSL certificate expiry dates
```

## 🛡️ Access Control

### GitHub Repository Permissions
```
👥 Repository Access Levels:
• Admin: University IT admin only
• Write: Authorized developers
• Read: Team members, stakeholders
• No access: External users
```

### n8n User Management
```
👤 n8n Access Control:
• Owner: Primary administrator
• Admin: Secondary administrators  
• Editor: Workflow creators
• Viewer: Read-only access
```

### Service Account Principles
```
🔐 Service Account Security:
• Principle of least privilege
• Regular access reviews
• Automated deprovisioning
• Activity logging
• Multi-factor authentication
```

## 📋 Security Compliance

### Educational Institution Requirements
```
🎓 University Security Standards:
✅ Student data protection (FERPA compliance)
✅ Financial data security (if handling payments)
✅ Email security (educational communications)
✅ API rate limiting (cost control)
✅ Data retention policies
```

### Backup and Recovery
```
💾 Backup Strategy:
• n8n workflows: Export monthly
• GitHub repositories: Automatic backups
• Credentials: Secure encrypted storage
• Configuration files: Version controlled
• Execution logs: 90-day retention
```

## 📞 Emergency Contacts

### Security Incident Response Team
```
🚨 Emergency Contacts:
• IT Security Officer: [phone/email]
• Lead Developer: [phone/email]  
• University IT Helpdesk: [phone/email]
• Cloud Provider Support: [support links]
```

### Vendor Support
```
📞 Vendor Emergency Support:
• GitHub: https://support.github.com
• OpenAI: https://help.openai.com
• Google Workspace: admin.google.com/support
• n8n Community: https://community.n8n.io
```

---

**🔄 Review Schedule**: Monthly security review meeting
**📝 Documentation**: Keep incident response logs
**🎯 Compliance**: Annual security audit required