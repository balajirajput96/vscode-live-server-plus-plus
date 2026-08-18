# 🤖 Career Automation System Integration

## Quick Setup

### 1. n8n Webhook URL
```bash
# Import workflow: n8n-workflows/career-automation-webhook.json
# Get webhook URL and update GitHub secrets
```

### 2. GitHub Secrets
Add these in repository Settings → Secrets → Actions:
- `N8N_WEBHOOK_URL` - Your n8n webhook URL
- `OPENAI_API_KEY` - Optional AI integration  
- `GEMINI_API_KEY` - Optional AI integration
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` - Optional deployment

### 3. Test System
```bash
# Check status
node automation/webhook-integration.js status

# Test webhook
node automation/webhook-integration.js test

# Test portfolio update
node automation/webhook-integration.js portfolio "Test Project" "Description"
```

### 4. Use Web Interface
1. Open `career-automation-system/index.html`
2. Click "Webhook Setup" to configure
3. Use "Test" button to verify connection
4. Create projects and social media posts

## Workflow Triggers

- **Portfolio Update**: Automatic LinkedIn post + Google Sheets entry
- **Social Media**: Schedule posts across platforms  
- **GitHub Actions**: Auto-deploy on code push
- **Weekly Content**: Automated content generation

## Status Indicators

- ✅ Configured and working
- ⚠️ Optional/not configured  
- ❌ Required but missing

Ready to automate your career growth! 🚀