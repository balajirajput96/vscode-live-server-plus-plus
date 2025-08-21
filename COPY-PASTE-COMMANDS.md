# 🚀 Copy-Paste Commands for Testing

## 🔗 n8n Webhook Testing

### Test Basic Connectivity
```bash
# Replace YOUR_WEBHOOK_URL with your actual n8n webhook URL
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"query":"Scholarship info","email":"2203456300001@paruluniversity.ac.in"}'
```

### Health Check Test
```bash
curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"type":"health","query":"ping","email":"2203456300001@paruluniversity.ac.in"}'
```

## 🤖 OpenAI API Testing

### Quick API Test
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Say hi in Hinglish"}]}'
```

### University Context Test
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Reply in Hindi+English. User query: How to apply for scholarship at Parul University? Be concise, helpful, university tone."}],
    "max_tokens": 180
  }'
```

## 🩺 Health Check Scripts

### Run Webhook Health Check
```bash
# Make executable (if needed)
chmod +x scripts/health-checks/webhook-health-check.sh

# Run test
./scripts/health-checks/webhook-health-check.sh YOUR_WEBHOOK_URL
```

### Run OpenAI Health Check
```bash
# Make executable (if needed)
chmod +x scripts/health-checks/openai-health-check.sh

# Run test
./scripts/health-checks/openai-health-check.sh YOUR_API_KEY
```

## ⚙️ GitHub Actions Testing

### Trigger Manual Workflow
```bash
# Go to GitHub repository → Actions tab → Select "Notify n8n on Push"
# Click "Run workflow" → Select branch → Run workflow
```

### Add GitHub Secrets
```bash
# Repository → Settings → Secrets and variables → Actions → New repository secret
Name: OPENAI_API_KEY
Value: sk-xxxxxxxxxxxxxxxxxxxxx

Name: N8N_WEBHOOK_URL  
Value: https://your-n8n-instance.com/webhook/balaji-automation

Name: GEMINI_API_KEY (optional)
Value: xxxxxxxxxxxxxxxxxxxxx
```

## 🌐 Chrome DevTools Optimization

### Enable Chrome Flags
```
Copy-paste in Chrome address bar:

chrome://flags/#enable-webgpu-developer-features
chrome://flags/#enable-devtools-experiments
chrome://flags/#enable-parallel-downloading
```

### DevTools Performance Script
```javascript
// Paste in DevTools Console
(function() {
    performance.mark('audit-start');
    const perfData = {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
    };
    console.log('🚀 Performance Metrics:', perfData);
    if (perfData.loadTime > 3000) {
        console.warn('⚠️ Page load time > 3s. Consider optimization.');
    }
    performance.mark('audit-end');
})();
```

## 🌐 Edge DevTools with Copilot

### Enable Edge Flags
```
Copy-paste in Edge address bar:

edge://flags/#edge-copilot-devtools
edge://flags/#experimental-web-platform-features
```

### AI Debugging Queries
```
Type in Edge DevTools Console:

"Why is LCP slow?"
"Analyze this performance bottleneck"
"Suggest accessibility improvements"
"Explain this JavaScript error"
"Optimize this CSS for mobile"
```

## 📱 Google Play Console Info

### University Business Details
```
Legal Name: Parul University
Business Type: Educational Institution
Address: P.O. Limda, Waghodia, Vadodara 391760
GST: 24AADAP4952C2ZS
D-U-N-S: [To be obtained from D&B]
```

### D-U-N-S Application
```
1. Visit: https://www.dnb.com
2. Business Name: Parul University
3. Address: P.O. Limda, Waghodia, Vadodara 391760
4. Upload: University registration + GST certificate
5. Processing Time: 7-14 business days
```

## 📊 Status Update Format

### Copy-Paste Status Template
```
📅 Status Update: [Current Date]
========================

- Webhook: Ready ✅ (URL: https://your-webhook-url)
- Credentials: OpenAI + Gmail + Drive added ✅
- GitHub: Secrets added, Action running ✅
- D-U-N-S: Submitted ⏳ / Approved ✅
- Google Play Console: Setup complete ✅
- DevTools: Optimization enabled ✅
- Security: 2FA enabled on all accounts ✅

🎯 Next Steps:
- [List immediate actions needed]
- [Expected completion dates]
```

## 🔧 Environment Configuration

### Copy .env Template
```bash
# Copy configuration template
cp automation-config.env .env.local

# Edit with your specific values
nano .env.local
```

### n8n Docker Startup
```bash
# Basic setup (no HTTPS)
docker compose --env-file .env -f docker-compose.basic.yml up -d

# Production setup (with HTTPS)
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
```

---

**💡 Pro Tip**: Save these commands in a text file for quick access during setup!
**🔒 Security**: Never commit actual API keys or webhook URLs to version control!