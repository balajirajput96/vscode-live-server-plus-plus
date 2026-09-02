# 🚀 Unified API & Radial Integration System

## 📋 Overview

यह system एक centralized API endpoint प्रदान करता है जो विभिन्न services (OpenAI, GitHub, Gmail, Telegram, Google Drive/Sheets) को n8n के माध्यम से integrate करता है। एक single endpoint से आप multiple operations perform कर सकते हैं।

## 🎯 Key Features

### 🔄 Radial API Architecture
- **Single Endpoint**: `/unified-api` - सभी requests के लिए एक ही URL
- **Type-Based Routing**: Request में `type` parameter के base पर automatic routing
- **Unified Response**: Consistent response format सभी operations के लिए
- **Error Handling**: Robust error handling और logging

### 🔗 Integrated Services
- **OpenAI**: AI responses with Hinglish support
- **Telegram**: Real-time notifications
- **Gmail**: Email automation
- **GitHub**: Issue creation और automation
- **Google Drive**: Document management
- **Google Sheets**: Data logging और analytics

### 🤖 Automation Features
- **GitHub Actions**: Automated health checks और triggers
- **Scheduled Tasks**: Daily monitoring और maintenance
- **Error Reporting**: Automatic issue creation on failures
- **Status Monitoring**: Real-time API health tracking

## 🚀 Quick Setup Guide

### Step 1: Prepare Environment

```bash
# Copy the configuration template
cp .env.unified-api .env

# Generate encryption key
openssl rand -base64 32
```

### Step 2: Update Configuration

Edit `.env` file और replace करें:
- `REPLACE_TELEGRAM_CHAT_ID` → Your Telegram chat ID
- `REPLACE_GITHUB_OWNER` → Your GitHub username
- `REPLACE_GITHUB_REPO` → Repository name
- `REPLACE_GOOGLE_DRIVE_FILE_ID` → Google Drive file ID
- `REPLACE_GOOGLE_SHEETS_ID` → Google Sheets document ID
- `N8N_ENCRYPTION_KEY` → Generated encryption key

### Step 3: Start n8n

```bash
# For local development
docker compose --env-file .env -f docker-compose.basic.yml up -d

# For production with HTTPS
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
```

### Step 4: Import Workflow

1. Open n8n (http://localhost:5678 या your domain)
2. Go to **Workflows** → **Import from JSON**
3. Copy content from `n8n-workflows/unified-api-router.json`
4. Paste और **Import** करें
5. **Save** और **Activate** करें

### Step 5: Configure Credentials

n8n में निम्नलिखित credentials setup करें:

#### OpenAI API
- Type: `OpenAI`
- API Key: Your OpenAI API key

#### Gmail OAuth
- Type: `Gmail OAuth2`
- Setup OAuth connection

#### Google Drive/Sheets
- Type: `Google Drive OAuth2` या `Google Service Account`
- Setup appropriate authentication

#### Telegram Bot
- Type: `Telegram`
- Bot Token: Your Telegram bot token

#### GitHub
- Personal Access Token with `repo` permissions

### Step 6: GitHub Integration

Repository Secrets में add करें:
```
N8N_UNIFIED_API_URL=https://your-n8n-instance.com/webhook/unified-api
```

## 📖 API Usage

### Endpoint
```
POST https://your-n8n-instance.com/webhook/unified-api
Content-Type: application/json
```

### Request Types

#### 1. AI Assistant (`type: "ai"`)
```json
{
  "type": "ai",
  "query": "Biotechnology में career opportunities कैसे हैं?",
  "email": "user@example.com",
  "context": "Career guidance"
}
```

**Response:**
```json
{
  "success": true,
  "type": "ai",
  "requestId": "abc123",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "aiResponse": "Biotechnology में excellent career opportunities हैं...",
  "message": "AI response generated and notifications sent"
}
```

#### 2. GitHub Integration (`type: "github"`)
```json
{
  "type": "github",
  "title": "New Feature Request",
  "description": "Add new automation feature",
  "github_token": "your-token",
  "labels": ["enhancement", "automation"]
}
```

**Response:**
```json
{
  "success": true,
  "type": "github",
  "requestId": "def456",
  "githubIssue": {
    "url": "https://github.com/user/repo/issues/123",
    "number": 123
  },
  "message": "GitHub issue created successfully"
}
```

#### 3. Document Access (`type: "docs"`)
```json
{
  "type": "docs",
  "file_id": "google-drive-file-id",
  "operation": "download"
}
```

#### 4. Data Logging (`type: "log"`)
```json
{
  "type": "log",
  "message": "User completed profile setup",
  "email": "user@example.com",
  "category": "user-activity"
}
```

## 🔄 Automation Workflows

### GitHub Actions Integration

The system includes automated workflows:

#### Daily Health Check
- **Schedule**: Every day at 3:00 AM IST
- **Function**: Tests API endpoints
- **Response**: Creates issues on failures

#### Push Triggers
- **Trigger**: Code commits to main branch
- **Function**: Tests unified API
- **Logging**: Records activity in sheets

#### Manual Testing
```bash
# Trigger manual workflow
gh workflow run unified-api-health-check.yml \
  -f api_type=ai \
  -f test_message="Manual test from CLI"
```

### Monitoring & Analytics

#### Health Monitoring
- API response time tracking
- Error rate monitoring
- Service availability checks
- Automated alerting

#### Usage Analytics
- Request type distribution
- User activity patterns
- Performance metrics
- Success/failure rates

## 🛠️ Advanced Configuration

### Custom Request Types

Add new request types by:

1. **Update Router Function** in n8n workflow:
```javascript
case 'custom-type':
  // Custom processing logic
  break;
```

2. **Add New Node** for processing
3. **Connect to Response Formatter**
4. **Update Documentation**

### Webhooks Integration

External services can trigger the API:
```bash
# From external service
curl -X POST "$N8N_UNIFIED_API_URL" \
  -H "Content-Type: application/json" \
  -d '{"type":"log","source":"external-app","data":"..."}'
```

### Batch Operations

Process multiple requests:
```json
{
  "type": "batch",
  "operations": [
    {"type": "log", "message": "Batch operation 1"},
    {"type": "ai", "query": "Quick question"},
    {"type": "github", "title": "Batch issue"}
  ]
}
```

## 📊 Testing & Validation

### Local Testing

```bash
# Test AI endpoint
curl -X POST "http://localhost:5678/webhook/unified-api" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ai",
    "query": "Test query",
    "email": "test@example.com"
  }'

# Test logging
curl -X POST "http://localhost:5678/webhook/unified-api" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "log",
    "message": "Test log entry",
    "email": "test@example.com"
  }'
```

### Production Testing

```bash
# Test production endpoint
curl -X POST "$N8N_UNIFIED_API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ai",
    "query": "Production test",
    "email": "admin@example.com"
  }'
```

## 🔧 Troubleshooting

### Common Issues

#### 1. API Not Responding
```bash
# Check n8n status
docker ps | grep n8n

# Check logs
docker logs n8n

# Test webhook URL
curl -I "$N8N_UNIFIED_API_URL"
```

#### 2. Credential Errors
- Verify all credentials in n8n
- Check API key validity
- Ensure OAuth tokens are fresh

#### 3. GitHub Actions Failing
- Check repository secrets
- Verify webhook URL
- Review workflow logs

### Debug Mode

Enable debug logging in n8n:
```bash
# Add to .env
N8N_LOG_LEVEL=debug
```

### Performance Optimization

#### Async Processing
Large operations को background में process करने के लिए:
```json
{
  "type": "ai",
  "query": "Complex analysis request",
  "async": true,
  "callback_url": "https://your-app.com/webhook"
}
```

#### Rate Limiting
Heavy usage के लिए rate limiting implement करें:
```javascript
// In n8n function node
const requestCount = await getRequestCount(userId);
if (requestCount > RATE_LIMIT) {
  throw new Error('Rate limit exceeded');
}
```

## 📈 Future Enhancements

### Planned Features
- [ ] GraphQL endpoint support
- [ ] WebSocket real-time updates
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support
- [ ] Custom plugin system

### Integration Roadmap
- [ ] Slack integration
- [ ] WhatsApp Business API
- [ ] Azure Services
- [ ] AWS Lambda functions
- [ ] Database integrations

## 🛡️ Security Best Practices

### API Security
- Use HTTPS for all communications
- Implement API key authentication
- Regular credential rotation
- Input validation और sanitization

### Data Protection
- Encrypt sensitive data
- Secure credential storage
- Audit logging
- GDPR compliance considerations

### Network Security
- Use VPN for sensitive operations
- Firewall configuration
- Rate limiting
- DDoS protection

## 📞 Support & Maintenance

### Regular Maintenance
- Weekly credential checks
- Monthly usage reviews
- Quarterly security audits
- Annual architecture reviews

### Getting Help
1. Check troubleshooting section
2. Review n8n documentation
3. Check GitHub issues
4. Contact system administrator

### Updates & Patches
- Subscribe to n8n updates
- Monitor service provider announcements
- Regular dependency updates
- Security patch management

---

## ✅ Success Checklist

### Initial Setup
- [ ] n8n instance running
- [ ] Workflow imported और active
- [ ] All credentials configured
- [ ] GitHub secrets added
- [ ] Basic API test successful

### Production Readiness
- [ ] HTTPS configured
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Documentation complete
- [ ] Team training completed

### Ongoing Operations
- [ ] Regular health checks
- [ ] Performance monitoring
- [ ] Security reviews
- [ ] Usage analytics
- [ ] Continuous improvements

---

**🎉 आपका Unified API System ready है! अब आप एक single endpoint से multiple services का उपयोग कर सकते हैं।**

*Last Updated: January 2024*  
*Version: 1.0*  
*Compatibility: n8n 1.82.1+*