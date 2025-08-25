# n8n Automation Setup (Docker)

## 1) Prepare .env
Copy `.env.example` to `.env` and set:
- DOMAIN, EMAIL, WEBHOOK_URL (e.g., https://n8n.example.com/)
- N8N_ENCRYPTION_KEY (generate one: `openssl rand -base64 32`)
- For local dev without HTTPS: set `N8N_SECURE_COOKIE=false`, `WEBHOOK_URL=` blank or http URL.

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

## 4) Notes
- WEBHOOK_URL should be your final public URL (esp. behind proxy/tunnel).
- Keep `N8N_TRUST_PROXY=true` when behind Caddy/Nginx/Traefik.
- For Execute Command node extra tools, build and use `n8n-extended` image, or run commands on a separate worker host.

## 5) Account Management Workflows

### Email Account Integration Setup

For managing workflows between multiple accounts (balaji.web.design1@gmail.com ↔ 22034563001@paruluniversity.ac.in):

#### Step 1: Create Workflow Export/Import System
```javascript
// Workflow: Account Migration Helper
// Trigger: Manual/Webhook
// Actions:
1. Export all workflows from source account
2. Clean/modify workflow configurations
3. Import to target account
4. Update credentials and connections
5. Test workflows functionality
6. Send completion notification
```

#### Step 2: Pro Features Migration
```javascript
// Workflow: Pro Features Sync
// Purpose: Migrate pro functionality to new account
1. List active executions and workflows
2. Export execution history (if needed)
3. Backup credential configurations
4. Transfer custom nodes and configurations
5. Setup monitoring and alerts
6. Verify all features working
```

#### Step 3: Automated Backup System
```javascript
// Workflow: Daily Backup
// Trigger: Cron - Daily at 2 AM
1. Export all workflows
2. Save to cloud storage (Google Drive/Dropbox)
3. Send backup status email
4. Clean old backups (keep last 30 days)
```

## 6) Docker Compose Configuration

### Basic Setup (docker-compose.basic.yml)
```yaml
version: '3.8'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER:-admin}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD:-changeme}
      - N8N_HOST=${DOMAIN:-localhost}
      - N8N_PORT=5678
      - N8N_PROTOCOL=${PROTOCOL:-http}
      - NODE_ENV=production
      - WEBHOOK_URL=${WEBHOOK_URL}
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - N8N_USER_MANAGEMENT_DISABLED=false
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=${SMTP_HOST}
      - N8N_SMTP_PORT=${SMTP_PORT:-587}
      - N8N_SMTP_USER=${SMTP_USER}
      - N8N_SMTP_PASS=${SMTP_PASS}
      - N8N_SMTP_SENDER=${SMTP_SENDER}
    volumes:
      - n8n_data:/home/node/.n8n
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  n8n_data:
```

### Production Setup with Reverse Proxy (docker-compose.reverse-proxy.yml)
```yaml
version: '3.8'

services:
  caddy:
    image: caddy:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    environment:
      - DOMAIN=${DOMAIN}
      - EMAIL=${EMAIL}

  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    environment:
      - N8N_HOST=${DOMAIN}
      - N8N_PROTOCOL=https
      - N8N_TRUST_PROXY=true
      - NODE_ENV=production
      - WEBHOOK_URL=https://${DOMAIN}/
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - N8N_USER_MANAGEMENT_DISABLED=false
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=${SMTP_HOST}
      - N8N_SMTP_PORT=${SMTP_PORT:-587}
      - N8N_SMTP_USER=${SMTP_USER}
      - N8N_SMTP_PASS=${SMTP_PASS}
      - N8N_SMTP_SENDER=${SMTP_SENDER}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - caddy

volumes:
  n8n_data:
  caddy_data:
  caddy_config:
```

## 7) Environment Variables (.env.example)

```bash
# Domain Configuration
DOMAIN=your-domain.com
EMAIL=your-email@domain.com
WEBHOOK_URL=https://your-domain.com/

# n8n Configuration
N8N_ENCRYPTION_KEY=your-32-char-encryption-key-here
N8N_USER=admin
N8N_PASSWORD=secure-password-here

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SENDER=your-email@gmail.com

# Security
N8N_SECURE_COOKIE=true
N8N_TRUST_PROXY=true
PROTOCOL=https
```

## 8) Caddyfile Configuration

```
{$DOMAIN} {
    reverse_proxy n8n:5678
    
    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
    }
    
    # Email configuration
    tls {$EMAIL}
}
```

## 9) Career Automation Workflows

### Weekly Content Generation Workflow
```javascript
// Name: Weekly Content Creator
// Trigger: Cron - Every Monday 9 AM
// Description: Generates weekly social media content

1. HTTP Request Node → Get industry trends from APIs
2. Code Node → Process and format content
3. AI Node (OpenAI) → Generate LinkedIn posts
4. Gmail Node → Send content to user
5. Google Sheets → Log generated content
6. Slack/Discord → Send notification
```

### Job Application Tracker
```javascript
// Name: Job Application Monitor
// Trigger: Webhook (when applying to jobs)
// Description: Tracks job applications and follow-ups

1. Webhook → Receive job application data
2. Google Sheets → Add to tracking spreadsheet
3. Code Node → Calculate follow-up dates
4. Schedule Trigger → Set follow-up reminders
5. Gmail → Send follow-up emails
6. Analytics → Update job search metrics
```

### Portfolio Auto-Update
```javascript
// Name: Portfolio Content Sync
// Trigger: GitHub webhook or scheduled
// Description: Updates portfolio when new projects added

1. GitHub Trigger → New repository created
2. Code Node → Extract project information
3. HTTP Request → Update portfolio website
4. Social Media Nodes → Share new project
5. Email → Notify about updates
```

### LinkedIn Engagement Bot
```javascript
// Name: LinkedIn Network Builder
// Trigger: Schedule - Daily
// Description: Automates LinkedIn networking

1. LinkedIn API → Get industry professionals
2. Filter Node → Remove existing connections
3. Code Node → Generate personalized messages
4. LinkedIn → Send connection requests
5. Google Sheets → Track sent requests
6. Wait Node → Schedule follow-ups
```

## 10) Account Migration Commands

### Export Workflows from Source Account
```bash
# Export all workflows
curl -X GET \
  "https://source-n8n-instance.com/api/v1/workflows" \
  -H "X-N8N-API-KEY: your-api-key" \
  -o workflows-backup.json

# Export credentials
curl -X GET \
  "https://source-n8n-instance.com/api/v1/credentials" \
  -H "X-N8N-API-KEY: your-api-key" \
  -o credentials-backup.json
```

### Import to Target Account
```bash
# Import workflows
curl -X POST \
  "https://target-n8n-instance.com/api/v1/workflows/import" \
  -H "X-N8N-API-KEY: your-target-api-key" \
  -H "Content-Type: application/json" \
  -d @workflows-backup.json

# Import credentials (requires manual setup for security)
```

## 11) Monitoring and Alerts

### Health Check Workflow
```javascript
// Name: System Health Monitor
// Trigger: Cron - Every 15 minutes
// Description: Monitors n8n instance health

1. HTTP Request → Check n8n API status
2. IF Node → Check if response is healthy
3. Gmail/Slack → Send alert if unhealthy
4. Webhook → Log health status
5. Recovery Actions → Restart services if needed
```

### Usage Analytics
```javascript
// Name: Usage Analytics Collector
// Trigger: Cron - Daily
// Description: Collects usage statistics

1. n8n API → Get execution statistics
2. Code Node → Process metrics
3. Google Sheets → Store daily metrics
4. Chart Generation → Create visual reports
5. Email → Send weekly reports
```

## 12) Troubleshooting

### Common Issues and Solutions

1. **n8n not accessible**
   - Check Docker container status: `docker ps`
   - Check logs: `docker logs container_name`
   - Verify environment variables

2. **Webhook not working**
   - Ensure WEBHOOK_URL is correctly set
   - Check firewall settings
   - Verify SSL certificates

3. **High resource usage**
   - Monitor with: `docker stats`
   - Optimize workflows
   - Consider scaling horizontally

4. **Data persistence issues**
   - Verify volume mounts
   - Check file permissions
   - Backup data regularly

### Performance Optimization

```bash
# Increase memory limits
echo "NODE_OPTIONS=--max-old-space-size=4096" >> .env

# Enable workflow optimization
echo "N8N_WORKFLOW_OPTIMIZATION=true" >> .env

# Configure queue mode for high volume
echo "QUEUE_BULL_REDIS_HOST=redis" >> .env
```

## 13) Security Best Practices

1. **Use strong passwords and API keys**
2. **Enable SSL/TLS encryption**
3. **Regularly update n8n version**
4. **Limit network access with firewalls**
5. **Regular backups and testing**
6. **Monitor for unusual activity**
7. **Use environment variables for secrets**

---

**🚀 Quick Start**: Copy this guide, set up your `.env` file, and run `docker compose up -d` to get started with your automated career management system!