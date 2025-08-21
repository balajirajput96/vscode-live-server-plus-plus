# 🚀 Automation Setup Guide - Complete Instructions

यह गाइड आपको step-by-step automation system setup करने में मदद करेगी।

## 📋 Pre-Setup Checklist

### ✅ Required Items
- [ ] GitHub account with repository access
- [ ] n8n account (cloud या self-hosted)
- [ ] Google account (for Sheets integration)
- [ ] LinkedIn account (for social media automation)
- [ ] Azure account (optional, for hosting)

---

## 🔗 Step 1: n8n Webhook URL Setup

### 1.1 n8n Workflow Creation
```bash
1. Login to your n8n instance
2. Click "+ New Workflow"
3. Add "Webhook" node
4. Configure webhook:
   - HTTP Method: POST
   - Path: balaji-automation
   - Authentication: None (for testing)
5. Save workflow
6. Copy Production URL
```

### 1.2 Import Ready-to-Use Workflow
```bash
# Import the pre-built workflow
1. Download: n8n-workflows/career-automation-webhook.json
2. Go to n8n → Import → Upload file
3. Select the downloaded JSON file
4. Configure credentials:
   - LinkedIn OAuth (for social media)
   - Google Sheets (for tracking)
5. Activate workflow
6. Copy webhook URL
```

### 1.3 Test Webhook
```bash
# Test the webhook URL
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "message": "Testing webhook connectivity"
  }'

# Expected response: 200 OK
```

**📋 Copy your webhook URL here:**
```
https://your-n8n-instance.com/webhook/balaji-automation
```

---

## 🏢 Step 2: DUNS Application (Parul University)

### 2.1 DUNS Application Process
```bash
1. Visit: https://dnb.co.in/duns/get-a-duns
2. Fill organization details:
   - Organization Name: Parul University
   - Address: Complete university address
   - Contact Information: Official contact details
   - Business Type: Educational Institution
3. Submit application
4. Save reference number
```

### 2.2 Required Documents
- [ ] University registration certificate
- [ ] Official address proof
- [ ] Contact person authorization
- [ ] PAN/Tax identification

### 2.3 Status Check
```bash
# After submission, you'll receive:
- Reference Number: [SAVE THIS]
- Expected processing time: 5-7 business days
- Status check URL: [BOOKMARK THIS]
```

**📋 DUNS Application Status:**
```
Reference Number: _______________
Submission Date: _______________
Status: [ ] Submitted [ ] In Progress [ ] Completed
```

---

## 🔐 Step 3: GitHub Actions Secrets Setup

### 3.1 Add Required Secrets
```bash
1. Go to your repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets one by one:
```

### 3.2 Required Secrets List

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `N8N_WEBHOOK_URL` | Your n8n webhook URL | `https://n8n.example.com/webhook/balaji-automation` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | `sk-...` |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | `AIza...` |
| `AZURE_FUNCTIONAPP_NAME` | Azure app name (optional) | `career-automation-app` |
| `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` | Azure publish profile (optional) | `<publishData>...` |

### 3.3 Setup Script
```bash
# Run this script to validate your setup
cd automation
node webhook-integration.js status

# Test webhook connectivity
node webhook-integration.js test

# Generate configuration template
node webhook-integration.js config
```

---

## 🧪 Step 4: Testing & Validation

### 4.1 Test Portfolio Update
```bash
# Test portfolio automation
node automation/webhook-integration.js portfolio "Test Project" "Testing automation system"
```

### 4.2 Test Social Media Integration
```bash
# Test social media automation
node automation/webhook-integration.js social "Testing automation system integration"
```

### 4.3 Test GitHub Actions
```bash
# Push a change to trigger the workflow
git add .
git commit -m "Test automation workflow"
git push origin main

# Check Actions tab for workflow execution
```

---

## 📊 Step 5: Automation Workflows Overview

### 5.1 Available Workflows

| Workflow | Trigger | Action |
|----------|---------|--------|
| Portfolio Update | Manual/API call | Updates LinkedIn, Google Sheets |
| Social Media Post | Schedule/Manual | Posts to social platforms |
| GitHub Actions CI/CD | Code push | Tests, builds, deploys |
| Weekly Content | Schedule (Monday 9 AM) | Generates weekly content |

### 5.2 Monitoring & Analytics
```bash
# View automation status
node automation/webhook-integration.js status

# Check n8n execution logs
# Go to n8n → Executions → View logs

# Monitor GitHub Actions
# Go to GitHub → Actions → View workflow runs
```

---

## 🎯 Step 6: Next Actions

### 6.1 Ready Confirmations
Send these confirmations when completed:

| Task | Status | Confirmation Message |
|------|--------|---------------------|
| n8n Webhook | ✅ | "Webhook Ready" |
| DUNS Application | ✅ | "DUNS Submitted" |
| GitHub Secrets | ✅ | "Secrets Added" |

### 6.2 Pre-filled Integration JSON
```json
{
  "n8n_webhook_url": "YOUR_WEBHOOK_URL_HERE",
  "duns_reference": "YOUR_DUNS_REFERENCE_HERE",
  "github_secrets": {
    "configured": true,
    "total_secrets": 5,
    "status": "ready"
  },
  "automation_status": "configured",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 6.3 Support Commands
```bash
# If stuck, run these for help:
node automation/webhook-integration.js --help
cat README-n8n-setup.md
cat automation/TROUBLESHOOTING.md
```

---

## 🆘 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Webhook URL not working | Check n8n workflow is activated |
| GitHub Actions failing | Verify all secrets are configured |
| DUNS application rejected | Ensure all documents are valid |
| n8n workflow not triggering | Check webhook path and method |

### Quick Fixes
```bash
# Reset automation system
git checkout main
git pull origin main
npm install
node automation/webhook-integration.js config

# Test connectivity
curl -I YOUR_WEBHOOK_URL
```

---

## 📞 Quick Status Update Format

**Copy and send this when ready:**

```
🎯 Automation System Status Update

✅ n8n Webhook: [Ready/Pending]
✅ DUNS Application: [Submitted/Pending]
✅ GitHub Secrets: [Added/Pending]

Webhook URL: [YOUR_URL_HERE]
Next Step: [WHAT_YOU_NEED_HELP_WITH]

Ready for next phase: [Yes/No]
```

---

## 🚀 Final Checklist

- [ ] n8n workflow imported and activated
- [ ] Webhook URL copied and tested
- [ ] DUNS application submitted with reference number
- [ ] All GitHub secrets configured
- [ ] Automation scripts tested successfully
- [ ] Ready for production deployment

**🎉 Once all items are checked, your automation system is ready!**