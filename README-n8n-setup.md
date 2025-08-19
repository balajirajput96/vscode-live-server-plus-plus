# n8n Automation Setup (Docker)

## 📋 Overview

यह guide आपको complete n8n automation system setup करने में help करेगा। n8n एक powerful workflow automation tool है जो आपके career automation system का central hub बनेगा।

## 1) Environment Configuration

### Step 1: Prepare .env

Copy `.env.template` to `.env` और अपनी actual values set करें:

```bash
cp .env.template .env
nano .env  # या अपना favorite editor use करें
```

**Required Settings:**
- `DOMAIN`: Your domain name (e.g., n8n.example.com for production or localhost for development)
- `EMAIL`: Your email for SSL certificates (Let's Encrypt)
- `WEBHOOK_URL`: Your public URL (e.g., https://n8n.example.com/ या http://localhost:5678/)
- `N8N_ENCRYPTION_KEY`: Generate करें: `openssl rand -base64 32`

**For Local Development:**
- Set `N8N_SECURE_COOKIE=false`
- Set `WEBHOOK_URL=http://localhost:5678/` या blank छोड़ें

## 2) Local/Development Setup (No HTTPS)

Local development के लिए basic setup:

```bash
# Basic docker-compose file use करें
docker compose --env-file .env -f docker-compose.basic.yml up -d
```

**Access your n8n instance:**
- Open: http://localhost:5678
- Create your admin account
- Start building workflows!

### Development Configuration

```yaml
# docker-compose.basic.yml (auto-created by super_start.sh)
version: '3.8'
services:
  n8n-master:
    image: n8nio/n8n:latest
    container_name: n8n-master
    restart: unless-stopped
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - N8N_SECURE_COOKIE=false
      - WEBHOOK_URL=http://localhost:5678/
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n_backup:/backups
```

## 3) Production Setup with HTTPS + Caddy

Production environment के लिए reverse proxy के साथ:

### Prerequisites

1. **Domain Setup**: आपका DNS A/AAAA record इस host को point करना चाहिए
2. **Port Access**: 80 और 443 ports खुले होने चाहिए
3. **Email**: Valid email address for SSL certificates

### Production Deployment

```bash
# Production docker-compose file use करें
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d
```

**Access your production instance:**
- Open: https://$DOMAIN (जहाँ $DOMAIN आपका actual domain है)

### Production Configuration

```yaml
# docker-compose.reverse-proxy.yml (auto-created by super_start.sh)
version: '3.8'
services:
  caddy:
    image: caddy:2-alpine
    container_name: n8n-caddy
    restart: unless-stopped
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

  n8n-master:
    image: n8nio/n8n:latest
    container_name: n8n-master
    restart: unless-stopped
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - WEBHOOK_URL=https://${DOMAIN}/
      - N8N_TRUST_PROXY=true
      - N8N_SECURE_COOKIE=true
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n_backup:/backups
    depends_on:
      - caddy

volumes:
  n8n_data:
  caddy_data:
  caddy_config:
```

## 4) n8n Workflow Templates

### Daily Career Automation Workflows

#### Workflow 1: LinkedIn Content Generation
```
Trigger: Schedule (Monday 9 AM)
→ HTTP Request: Get trending topics
→ OpenAI: Generate LinkedIn post
→ HTTP Request: Post to LinkedIn
→ Slack: Send notification
```

#### Workflow 2: Job Application Tracking
```
Trigger: Webhook (new application)
→ Google Sheets: Add application data
→ Calendar: Set follow-up reminder
→ Email: Send confirmation
```

#### Workflow 3: GitHub Profile Update
```
Trigger: Schedule (Weekly)
→ GitHub: Get recent commits
→ OpenAI: Generate README update
→ GitHub: Update profile README
→ Social Media: Share update
```

#### Workflow 4: Daily Health Check
```
Trigger: Schedule (Daily 6 AM)
→ Execute Command: Run health check script
→ Email: Send status report
→ Slack: Alert if issues found
```

## 5) Essential n8n Nodes to Install

### Community Nodes

```bash
# Install community nodes through n8n UI:
# Settings → Community Nodes → Install

# Essential nodes:
- n8n-nodes-google-sheets
- n8n-nodes-linkedin
- n8n-nodes-github
- n8n-nodes-openai
- n8n-nodes-telegram
- n8n-nodes-slack-enhanced
```

## 6) Backup and Recovery

### Automated Backup Setup

```bash
# Create backup script
cat > scripts/backup_n8n.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="n8n_backup"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Export all workflows
docker exec n8n-master n8n export:workflow --backup --output="/backups/workflows_$DATE.json"

# Export credentials (encrypted)
docker exec n8n-master n8n export:credentials --backup --output="/backups/credentials_$DATE.json"

# Create database backup
docker exec n8n-master cp /home/node/.n8n/database.sqlite "/backups/database_$DATE.sqlite"

echo "Backup completed: $DATE"
EOF

chmod +x scripts/backup_n8n.sh
```

### Restore from Backup

```bash
# Restore workflows
docker exec n8n-master n8n import:workflow --input="/backups/workflows_YYYYMMDD_HHMMSS.json"

# Restore credentials
docker exec n8n-master n8n import:credentials --input="/backups/credentials_YYYYMMDD_HHMMSS.json"
```

## 7) Monitoring and Maintenance

### Health Monitoring

```bash
# Check n8n health
curl -f http://localhost:5678/healthz

# Check container status
docker ps | grep n8n

# View logs
docker logs n8n-master --tail 100
```

### Performance Optimization

```bash
# Check resource usage
docker stats n8n-master

# Optimize executions data
docker exec n8n-master n8n execute --help

# Clean old executions (if needed)
docker exec n8n-master n8n executioins:prune --deletecount=1000
```

## 8) Security Best Practices

### Access Control

```bash
# Enable user management in .env
N8N_USER_MANAGEMENT_DISABLED=false

# Set strong authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=your_username
N8N_BASIC_AUTH_PASSWORD=strong_password
```

### Network Security

```bash
# Firewall rules (Ubuntu/Debian)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Don't expose n8n port directly in production
# Use reverse proxy (Caddy/Nginx)
```

## 9) Troubleshooting

### Common Issues

**Issue**: n8n container not starting
```bash
# Check logs
docker logs n8n-master

# Check environment variables
docker exec n8n-master env | grep N8N

# Recreate container
docker-compose down
docker-compose up -d
```

**Issue**: Webhooks not working
```bash
# Check WEBHOOK_URL in .env
echo $WEBHOOK_URL

# Test webhook endpoint
curl -X POST http://localhost:5678/webhook-test/test

# Check n8n logs for webhook errors
docker logs n8n-master | grep webhook
```

**Issue**: SSL certificate problems
```bash
# Check Caddy logs
docker logs n8n-caddy

# Verify domain DNS
nslookup $DOMAIN

# Test SSL manually
openssl s_client -connect $DOMAIN:443
```

## 10) Advanced Configuration

### Custom Node Development

```bash
# Create custom node directory
mkdir -p custom_nodes

# Install development dependencies
npm install -g n8n-node-dev

# Create custom node template
n8n-node-dev new
```

### API Integration

```bash
# n8n API examples
curl -X GET http://localhost:5678/rest/workflows \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get executions
curl -X GET http://localhost:5678/rest/executions \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 11) Migration and Scaling

### Moving to New Server

```bash
# 1. Backup current instance
./scripts/backup_n8n.sh

# 2. Copy backup files to new server
scp -r n8n_backup/ user@newserver:/path/to/n8n/

# 3. Setup new instance
./super_start.sh

# 4. Restore data
docker exec n8n-master n8n import:workflow --input="/backups/workflows_latest.json"
```

### Load Balancing (Advanced)

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  n8n-worker-1:
    image: n8nio/n8n:latest
    command: n8n worker
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - DATABASE_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
    depends_on:
      - postgres
      - redis

  n8n-worker-2:
    image: n8nio/n8n:latest
    command: n8n worker
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - DATABASE_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
    depends_on:
      - postgres
      - redis
```

## 12) Notes

- **WEBHOOK_URL** should be your final public URL (especially when behind proxy/tunnel)
- Keep `N8N_TRUST_PROXY=true` when behind Caddy/Nginx/Traefik
- For Execute Command node extra tools, build and use `n8n-extended` image, or run commands on a separate worker host
- Always backup before major updates
- Monitor resource usage in production
- Use environment-specific configurations

## 🚀 Quick Start Commands

```bash
# Complete setup
./super_start.sh

# Start n8n (development)
docker-compose up -d

# Start n8n (production)
docker-compose -f docker-compose.reverse-proxy.yml up -d

# Health check
./comprehensive_health_check.sh

# Backup
./scripts/backup_n8n.sh

# View logs
docker logs n8n-master -f
```

## 📞 Support

For issues:
1. Check logs: `docker logs n8n-master`
2. Run health check: `./comprehensive_health_check.sh`
3. Check n8n documentation: https://docs.n8n.io
4. Community forum: https://community.n8n.io

---

**Happy Automating! 🤖**