# n8n Automation Setup (Docker)

Complete guide for setting up n8n automation workflows with account migration support.

## 1) Prepare .env

Copy `.env.example` to `.env` and set:
- DOMAIN, EMAIL, WEBHOOK_URL (e.g., https://n8n.example.com/)
- N8N_ENCRYPTION_KEY (generate one: `openssl rand -base64 32`)
- For local dev without HTTPS: set `N8N_SECURE_COOKIE=false`, `WEBHOOK_URL=` blank or http URL.
- Account migration settings for seamless workflow transfer

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

## 4) Account Migration & Setup

### Automated Account Transfer
```bash
# Run the account migration script
npm run migrate-account
```

This will:
- Export workflows from source account (balaji.web.design1@gmail.com)
- Set up Parul University account (22034563001@paruluniversity.ac.in) 
- Import all workflows and configurations
- Maintain pro-level functionality
- Configure high-speed offline capabilities

### Manual Setup Steps
1. **Source Account Export**:
   - Login to source n8n instance
   - Export all workflows as JSON
   - Save credentials and environment variables

2. **Target Account Setup**:
   - Create Parul University n8n instance
   - Configure pro features
   - Set up high-performance settings

3. **Workflow Import**:
   - Import exported workflows
   - Update credentials and connections
   - Test all automation flows

## 5) High-Speed Offline Configuration

### Performance Optimization
```bash
# Enable high-speed mode
export N8N_CACHE_ENABLED=true
export N8N_DISABLE_UI=false
export N8N_LOG_LEVEL=error
export N8N_METRICS=true
```

### Offline Capabilities
- Local workflow execution
- Cached data processing
- Background automation
- Sync when online

## 6) Workflow Templates

### Content Generation Workflow
```json
{
  "name": "Weekly Content Generation",
  "trigger": "cron",
  "schedule": "0 9 * * 1",
  "nodes": [
    "Generate Ideas",
    "Create Posts", 
    "Schedule Publishing",
    "Send Notifications"
  ]
}
```

### Job Application Tracking
```json
{
  "name": "Job Application Tracker",
  "trigger": "webhook",
  "nodes": [
    "Capture Application",
    "Update Sheet",
    "Set Reminders",
    "Analytics Update"
  ]
}
```

## 7) Notes

- WEBHOOK_URL should be your final public URL (esp. behind proxy/tunnel).
- Keep `N8N_TRUST_PROXY=true` when behind Caddy/Nginx/Traefik.
- For Execute Command node extra tools, build and use `n8n-extended` image, or run commands on a separate worker host.
- Account migration preserves all workflows and maintains functionality
- High-speed mode optimizes for performance and offline operation
- Pro features remain active after migration