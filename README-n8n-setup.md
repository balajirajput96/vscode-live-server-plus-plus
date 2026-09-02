# n8n Automation Setup (Docker) + Perplexity AI Pro Integration

## 🚀 Quick Start

### 1) Prepare .env
Copy `.env.example` to `.env` and set:
- DOMAIN, EMAIL (now configured for balaji.web.design1@gmail.com), WEBHOOK_URL (e.g., https://n8n.example.com/)
- N8N_ENCRYPTION_KEY (generate one: `openssl rand -base64 32`)
- PERPLEXITY_API_KEY (get from your Perplexity AI Pro account)
- For local dev without HTTPS: set `N8N_SECURE_COOKIE=false`, `WEBHOOK_URL=` blank or http URL.

### 2) Local/dev (no HTTPS)
```bash
docker compose --env-file .env -f docker-compose.basic.yml up -d
```
Open http://localhost:5678

### 3) With HTTPS + Caddy
Point your DNS A/AAAA to this host, then:
```bash
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
```
Open https://$DOMAIN

## 🔧 Production Webhook Setup

### Step 1: Create Webhook Endpoint
1. **Workflows** → **+ New** → **Webhook node**
   - Path: `balaji-automation`
   - Method: `POST`
   - Response: `On received`
2. **Save** → Copy production URL

### Step 2: Test Webhook
```bash
# Test basic connectivity (mobile/PC Terminal or Postman)
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"query":"Scholarship info","email":"2203456300001@paruluniversity.ac.in"}'
```

### Step 3: Import Full Workflow
- **Workflows** → **Import from JSON** 
- Use workflow file: `n8n-workflows/parul-auto-response-workflow.json`
- Configure credentials:
  - OpenAI API key
  - Gmail OAuth  
  - Google Drive OAuth
  - Drive folder ID

## 🔗 GitHub Integration

### Required Secrets
Add to **Repository Settings** → **Secrets** → **Actions**:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
N8N_WEBHOOK_URL=https://your-webhook-url
GEMINI_API_KEY=xxxxxxxxxxxxxxx (optional)
AZURE_PUBLISH_PROFILE=<profile> (if using Azure)
```

### Automated Notifications
- GitHub Actions automatically notify n8n on code pushes
- Workflow file: `.github/workflows/notify-n8n.yml`
- Includes health checks and error reporting

## 🩺 Health Monitoring

### Webhook Health Check
```bash
# Run health check script
./scripts/health-checks/webhook-health-check.sh YOUR_WEBHOOK_URL

# Quick test command
curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"type":"health","query":"ping","email":"2203456300001@paruluniversity.ac.in"}'
```

### OpenAI API Health Check
```bash
# Test OpenAI connectivity
./scripts/health-checks/openai-health-check.sh

# Manual test
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Say hi in Hinglish"}]}'
```

## 📚 Additional Setup Guides

- **🔐 Security Configuration**: `docs/setup-guides/security-configuration.md`
- **📱 Google Play Console**: `docs/setup-guides/google-play-console-setup.md`  
- **🚀 DevTools Optimization**: `docs/setup-guides/devtools-optimization.md`
- **📊 Status Update Templates**: `docs/setup-guides/status-update-templates.md`

## 📊 Status Update Format

When completing setup steps, report progress using this format:
```
- Webhook: Ready ✅ (URL: https://your-url)
- Credentials: OpenAI + Gmail + Drive added ✅
- GitHub: Secrets added, Action running ✅
- D-U-N-S: Submitted ⏳ / Approved ✅
```

## 🔧 Technical Notes
- WEBHOOK_URL should be your final public URL (esp. behind proxy/tunnel).
- Keep `N8N_TRUST_PROXY=true` when behind Caddy/Nginx/Traefik.
- For Execute Command node extra tools, build and use `n8n-extended` image, or run commands on a separate worker host.

## 5) Perplexity AI Pro Integration
After n8n is running:

1. **Get Perplexity API Key**:
   - Login to [perplexity.ai](https://perplexity.ai) with balaji.web.design1@gmail.com
   - Navigate to API settings and generate an API key
   - Add to your `.env` file: `PERPLEXITY_API_KEY=your_api_key_here`

2. **Import Workflows**:
   ```bash
   # Import the provided workflow templates
   cp n8n-workflows/*.json /path/to/your/n8n/data/workflows/
   ```

3. **Configure Credentials**:
   - In n8n web interface, go to Settings → Credentials
   - Add "HTTP Header Auth" credential for Perplexity API
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_PERPLEXITY_API_KEY`

4. **Test Integration**:
   - Import `perplexity-content-generator.json` workflow
   - Test with webhook: `POST /webhook/generate-content`
   - Payload: `{"topic": "Bioinformatics trends", "content_type": "linkedin_post"}`

See `n8n-perplexity-integration.md` for detailed setup instructions and workflow examples.