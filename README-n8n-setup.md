# n8n Automation Setup (Docker) - Enhanced Guide

## 🚀 Quick Start for Career Automation

This enhanced setup guide helps you deploy n8n for career automation workflows with better offline support and data management.

## 1) Prepare .env
Copy `.env.example` to `.env` and set:
- DOMAIN, EMAIL, WEBHOOK_URL (e.g., https://n8n.example.com/)
- N8N_ENCRYPTION_KEY (generate one: `openssl rand -base64 32`)
- For local dev without HTTPS: set `N8N_SECURE_COOKIE=false`, `WEBHOOK_URL=` blank or http URL.

### Enhanced Configuration for Career Automation:
```bash
# Additional settings for career automation
N8N_LOG_LEVEL=info
N8N_PAYLOAD_SIZE_MAX=64
TZ=Asia/Kolkata
N8N_BASIC_AUTH=true
N8N_BASIC_AUTH_USERNAME=career-admin
N8N_BASIC_AUTH_PASSWORD=strong-password-here
```

## 2) Local/dev (no HTTPS)
```bash
docker compose --env-file .env -f docker-compose.basic.yml up -d
```
Open http://localhost:5678

## 3) With HTTPS + Caddy
Point your DNS A/AAAA to this host, then:
```bash
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
```
Open https://$DOMAIN

## 4) Career Automation Workflows

### Pre-built Workflow Templates:

#### Workflow 1: Daily Career Content Generation
```json
{
  "name": "Daily Career Content",
  "trigger": "Schedule Trigger",
  "schedule": "0 9 * * 1-5",
  "nodes": [
    {
      "name": "Get Projects Data",
      "type": "HTTP Request",
      "url": "http://localhost:8000/api/projects"
    },
    {
      "name": "Generate LinkedIn Post",
      "type": "OpenAI",
      "prompt": "Create a professional LinkedIn post about: {{$json.project}}"
    },
    {
      "name": "Post to LinkedIn",
      "type": "LinkedIn",
      "content": "{{$json.post}}"
    }
  ]
}
```

#### Workflow 2: Job Application Tracker
```json
{
  "name": "Job Application Tracker",
  "trigger": "Webhook",
  "nodes": [
    {
      "name": "Parse Application Data",
      "type": "Code",
      "code": "return [{ company: $input.company, role: $input.role, date: new Date() }];"
    },
    {
      "name": "Save to Database",
      "type": "HTTP Request",
      "method": "POST",
      "url": "http://localhost:8000/api/applications"
    },
    {
      "name": "Send Follow-up Reminder",
      "type": "Schedule Trigger",
      "delay": "7 days"
    }
  ]
}
```

#### Workflow 3: Portfolio Backup
```json
{
  "name": "Portfolio Data Backup",
  "trigger": "Schedule Trigger",
  "schedule": "0 0 * * 0",
  "nodes": [
    {
      "name": "Get Portfolio Data",
      "type": "HTTP Request",
      "url": "http://localhost:8000/api/export"
    },
    {
      "name": "Upload to Cloud",
      "type": "Google Drive",
      "file": "{{$json.data}}"
    },
    {
      "name": "Send Backup Confirmation",
      "type": "Email",
      "to": "your-email@example.com"
    }
  ]
}
```

## 5) Integration with Career Dashboard

### API Endpoints to Connect:
```javascript
// In your career dashboard (script.js), add n8n integration:

// Trigger n8n workflow when saving project
function saveProjectToN8N(projectData) {
    if (navigator.onLine) {
        fetch('http://localhost:5678/webhook/save-project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        }).catch(err => {
            // Store for later sync
            const pending = JSON.parse(localStorage.getItem('pendingSync') || '[]');
            pending.push({ type: 'project', data: projectData });
            localStorage.setItem('pendingSync', JSON.stringify(pending));
        });
    }
}
```

## 6) Notes
- WEBHOOK_URL should be your final public URL (esp. behind proxy/tunnel).
- Keep `N8N_TRUST_PROXY=true` when behind Caddy/Nginx/Traefik.
- For Execute Command node extra tools, build and use `n8n-extended` image, or run commands on a separate worker host.

### Enhanced Features:
- Automatic backup workflows
- LinkedIn posting automation
- Job application tracking
- Portfolio synchronization
- Offline data queue management

## 7) Troubleshooting

### Common Issues:

**Issue**: Workflows not triggering
**Solution**: Check timezone settings and webhook URLs

**Issue**: Authentication failures
**Solution**: Verify N8N_BASIC_AUTH credentials and HTTPS settings

**Issue**: Large payloads failing
**Solution**: Increase N8N_PAYLOAD_SIZE_MAX in .env file

### Performance Optimization:
- Use specific triggers instead of polling
- Implement error handling in all workflows
- Set appropriate timeouts for external APIs
- Monitor workflow execution logs

## 8) Security Best Practices

- Use strong passwords for N8N_BASIC_AUTH
- Regenerate N8N_ENCRYPTION_KEY periodically
- Implement webhook authentication
- Use HTTPS in production
- Regularly backup workflow configurations