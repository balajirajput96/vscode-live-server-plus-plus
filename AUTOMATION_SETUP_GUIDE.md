# 🚀 Complete Automation Setup Guide

## 1) n8n: Production Webhook + Test Payload

### Step 1: Create Webhook in n8n
1. Open n8n → Workflows → + New
2. Add **Webhook node**:
   - Path: `balaji-automation`
   - Method: `POST`
   - Response: `On received`
3. Save workflow
4. Copy the Production URL (looks like: `https://your-domain.com/webhook/balaji-automation`)

### Step 2: Test the Webhook
Use terminal or Postman to test:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"query":"Scholarship info","email":"2203456300001@paruluniversity.ac.in"}'
```

Expected response: `OK` or `200 status`

---

## 2) n8n: Full Auto-Reply Workflow Import

### Import the Workflow
1. Copy the JSON from `n8n-workflows/parul-auto-response-workflow.json`
2. n8n → Workflows → Import from JSON → Paste the JSON
3. Save the workflow

### Required Credentials Setup
Before activating, add these credentials in n8n:

#### OpenAI Credential
- Type: `OpenAI`
- Name: `openaiApi`
- API Key: Your OpenAI API key

#### Gmail Credential
- Type: `Gmail OAuth2`
- Follow OAuth setup process
- Update node: Replace `REPLACE_FROM_EMAIL` with your email

#### Google Drive Credential
- Type: `Google Drive OAuth2`
- Follow OAuth setup process
- Update node: Replace `REPLACE_DRIVE_FOLDER_ID` with your folder ID

### Get Google Drive Folder ID
1. Create a folder in Google Drive
2. Open the folder
3. Copy ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

---

## 3) GitHub: Secrets and Actions Setup

### Add Repository Secrets
Go to: `Repo → Settings → Secrets → Actions → New repository secret`

Required secrets:
```
OPENAI_API_KEY=your_openai_api_key
N8N_WEBHOOK_URL=https://your-domain.com/webhook/balaji-automation
GEMINI_API_KEY=your_gemini_api_key (optional)
AZURE_PUBLISH_PROFILE=your_azure_profile (if using Azure)
```

### GitHub Action is Ready
The file `.github/workflows/notify.yml` is already created and will:
- Trigger on every push to main/master
- Send notification to n8n webhook
- Perform health checks

---

## 4) Google Play Console: Post D-U-N-S Setup

### Business Information
```
Business Type: Educational Institution/Nonprofit
Legal Name: Parul University
Address: P.O. Limda, Waghodia, Vadodara 391760
GST Number: 24AADAP4952C2ZS
D-U-N-S Number: [9-digit number from D&B approval]
```

### Required Documents
1. **Identity Verification**: Authorized representative's government ID
2. **University Verification**: Use university email domain
3. **Bank Verification**: Cancelled cheque or bank letter PDF

### Steps After D-U-N-S Approval
1. Google Play Console → Create Developer Account
2. Upload required documents
3. Pay registration fee ($25 one-time)
4. Wait for verification (1-3 days)
5. Create first app listing

---

## 5) Browser DevTools Optimizations

### Chrome Optimizations
```bash
# Enable in chrome://flags
WebGPU developer features → Enable → Relaunch
```

**DevTools Usage:**
1. Open DevTools (F12)
2. Lighthouse tab → Generate report
3. Check Performance score
4. Apply "View Trace" recommendations

### Edge Optimizations
```bash
# Enable in edge://flags
Copilot in DevTools → Enable → Relaunch
```

**DevTools Usage:**
1. Open DevTools (F12)
2. Copilot tab → Ask "Why is LCP slow?"
3. Apply suggested optimizations

---

## 6) Health Check Scripts

### Webhook Health Check
```bash
# Make script executable
chmod +x scripts/health-checks/webhook-health-check.sh

# Run test
./scripts/health-checks/webhook-health-check.sh YOUR_WEBHOOK_URL

# Or use environment variable
export N8N_WEBHOOK_URL="your_webhook_url"
./scripts/health-checks/webhook-health-check.sh
```

### OpenAI Health Check
```bash
# Make script executable
chmod +x scripts/health-checks/openai-health-check.sh

# Run test
./scripts/health-checks/openai-health-check.sh YOUR_API_KEY

# Or use environment variable
export OPENAI_API_KEY="your_api_key"
./scripts/health-checks/openai-health-check.sh
```

### Mobile-Friendly Health Check
```bash
# Quick webhook test (mobile terminal)
curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"type":"health","query":"ping","email":"2203456300001@paruluniversity.ac.in"}'
```

---

## 7) Security Configuration

### Essential Security Steps
1. **Enable 2FA** on all accounts:
   - GitHub
   - Google (Gmail, Drive)
   - OpenAI
   - n8n instance

2. **API Key Management**:
   - Store all keys in n8n credentials vault
   - Never put keys in workflow nodes as plain text
   - Use GitHub Secrets for repository automation

3. **GitHub Security**:
   - Revoke any public Personal Access Tokens
   - Create new short-lived PATs when needed
   - Use repository secrets for sensitive data

4. **Monthly Security Rotation**:
   - Set calendar reminders for key rotation
   - Audit active API keys
   - Review access permissions

### n8n Security Best Practices
```bash
# .env security settings
N8N_BASIC_AUTH=true
N8N_BASIC_AUTH_USERNAME=strong_username
N8N_BASIC_AUTH_PASSWORD=strong_password_here
N8N_SECURE_COOKIE=true  # only for HTTPS
N8N_TRUST_PROXY=true    # when behind proxy
```

---

## 8) Status Update Format

### Progress Tracking Template
When completing each step, update status:

```
✅ Webhook: Ready (URL: https://example.com/webhook/balaji-automation)
✅ Credentials: OpenAI + Gmail + Drive added
🔄 GitHub: Secrets added, Action testing
⏳ D-U-N-S: Submitted (waiting for approval)
⏳ Play Console: Pending D-U-N-S approval
```

### Status Indicators
- ✅ **Completed**
- 🔄 **In Progress**  
- ⏳ **Waiting/Pending**
- ❌ **Failed/Blocked**
- 📝 **Documentation Ready**

### Next Steps Communication
Format for requesting next steps:
```
Current Status:
- Webhook: ✅ Ready
- Credentials: ✅ Configured  
- GitHub Actions: 🔄 Testing
- D-U-N-S: ⏳ Submitted

Ready for: [Next specific step]
Blocked on: [Any blockers]
Need help with: [Specific assistance needed]
```

---

## 9) Quick Reference Commands

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env  # or your preferred editor
```

### Docker n8n Startup
```bash
# Basic setup (HTTP)
docker compose --env-file .env -f docker-compose.basic.yml up -d

# Production setup (HTTPS + Caddy)
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
```

### Testing Commands
```bash
# Test all health checks
./scripts/health-checks/webhook-health-check.sh
./scripts/health-checks/openai-health-check.sh

# Manual webhook test
curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"query":"Test message","email":"test@paruluniversity.ac.in"}'
```

---

## 📞 Support

For issues or questions:
1. Check logs: `docker logs n8n`
2. Review health check outputs
3. Verify environment variables
4. Check GitHub Actions logs for automation issues

The system is designed to be **copy-paste ready** - follow each section in order for complete setup.