# n8n Docker Setup (Postgres + Redis + Queue Workers + Optional HTTPS via Caddy)

## Quick start

### 1) Prepare environment file
```bash
cp .env.example .env
```

Choose your configuration scenario:

#### For Local Development (HTTP only):
Edit `.env` and uncomment/set:
```env
N8N_HOST=localhost
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678/
N8N_TRUST_PROXY=false
N8N_SECURE_COOKIE=false
```

#### For Production with Domain + HTTPS:
Edit `.env` and set:
```env
DOMAIN=your-actual-domain.com
ACME_EMAIL=your-email@domain.com
N8N_HOST=your-actual-domain.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-actual-domain.com/
N8N_TRUST_PROXY=true
N8N_SECURE_COOKIE=true
```

### 2) Generate security credentials
```bash
# Generate encryption key (REQUIRED - keep this secure!)
openssl rand -base64 48

# Copy the output and paste it as N8N_ENCRYPTION_KEY in your .env file
# Choose a strong password for POSTGRES_PASSWORD as well
```

**Important Security Note**: 
- The `N8N_ENCRYPTION_KEY` encrypts sensitive data like passwords in workflows
- **Never change this key after setup** - it will make existing workflows inaccessible
- Keep this key secure and backed up for disaster recovery

### 3) Start the services
#### For Local Development:
```bash
docker compose up -d
```
Then open: http://localhost:5678

#### For Production with HTTPS:
```bash
# Ensure your domain's DNS A/AAAA records point to this server
docker compose up -d
```
Then open: https://your-domain.com (Caddy will automatically get SSL certificate)

### 4) Initial Setup
1. Open n8n in your browser
2. Create your admin account (first user becomes admin)
3. Configure your workflows and integrations

## Workflow Migration & Backup

### Exporting Workflows from Existing n8n Instance

#### Method 1: Export via Web Interface
1. Login to your existing n8n instance
2. Go to **Workflows** page
3. Select the workflows you want to export
4. Click **Export** button and download the JSON file
5. Keep this file secure as it may contain sensitive information

#### Method 2: Database Backup (Complete Migration)
If you have database access to your existing n8n instance:
```bash
# Export all workflows from existing PostgreSQL database
pg_dump -h old-db-host -U n8n -d n8n --table=workflow_entity --data-only > workflows_backup.sql

# Export credentials (handle with extreme care - contains encrypted passwords)
pg_dump -h old-db-host -U n8n -d n8n --table=credentials_entity --data-only > credentials_backup.sql
```

### Importing Workflows to New n8n Instance

#### Method 1: Import via Web Interface
1. Login to your new n8n instance
2. Go to **Workflows** page  
3. Click **Import** button
4. Upload your JSON workflow file
5. Review and activate imported workflows

#### Method 2: Database Import (Complete Migration)
```bash
# Import workflows to new database (ensure new instance is stopped)
docker compose stop n8n n8n-worker
psql -h localhost -U n8n -d n8n < workflows_backup.sql

# Import credentials (requires same encryption key!)
psql -h localhost -U n8n -d n8n < credentials_backup.sql

# Restart services
docker compose up -d
```

### Important Migration Notes

1. **Encryption Key Compatibility**: 
   - If migrating credentials, use the **same `N8N_ENCRYPTION_KEY`** in both instances
   - Without the same key, encrypted credentials will be unreadable

2. **Webhook URLs**: 
   - Update webhook URLs in workflows if your domain changed
   - Test all external integrations after migration

3. **Environment Variables**: 
   - Review and update any environment-specific settings
   - Update email configurations, API endpoints, etc.

4. **Testing After Migration**:
   - Test all workflows manually first
   - Verify external API connections work
   - Check scheduled workflows are running correctly

## Queue workers (scaling)
- Default brings up 1 worker. Scale as needed:
  ```bash
  docker compose up -d --scale n8n-worker=3
  ```
- Adjust WORKER_CONCURRENCY in .env to tune per-worker throughput.

## Email Configuration for Workflows

### Gmail SMTP Setup
To send emails from your workflows using Gmail:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Create a new app password for "n8n"

3. **Configure in .env**:
```env
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.gmail.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=your-email@gmail.com
N8N_SMTP_PASS=your-16-digit-app-password
N8N_SMTP_SENDER=your-email@gmail.com
```

### Using Different Email Providers

#### Outlook/Hotmail:
```env
N8N_SMTP_HOST=smtp-mail.outlook.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=your-email@outlook.com
```

#### Custom SMTP Server:
```env
N8N_SMTP_HOST=your-smtp-server.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=your-username
N8N_SMTP_PASS=your-password
```

### Email Workflow Examples

#### 1. Notification Workflow
Create workflows that send email notifications when:
- New form submissions received
- System errors occur
- Scheduled reports are ready
- External API status changes

#### 2. Account Management Automation
- Send welcome emails to new users
- Password reset notifications
- Account expiry warnings
- Subscription renewal reminders

## Operational tips
- **Webhook URL:**
  - Local: WEBHOOK_URL=http://localhost:5678/
  - HTTPS domain: WEBHOOK_URL=https://your-domain/
  - Behind proxy, keep N8N_TRUST_PROXY=true

- **Timezone:** set GENERIC_TIMEZONE/TZ (e.g., Asia/Kolkata)

- **Data retention:**
  - Success executions: none (recommended)
  - Error executions: all
  - Pruning: enabled, 14 days (tweak in .env)

- **Basic auth (optional):**
  - Uncomment N8N_BASIC_AUTH_* in .env for an extra protection layer.

- **Metrics:**
  - Set N8N_METRICS=true to expose /metrics (behind your proxy).

- **Updating:**
  ```bash
  docker compose pull && docker compose up -d
  ```

- **Logs:**
  ```bash
  docker compose logs -f n8n n8n-worker caddy
  ```

- **Health:**
  - n8n: GET /healthz is used for healthcheck
  - Postgres/Redis healthchecks are built-in in compose

## Troubleshooting Common Issues

### Issue: Cannot access n8n web interface
**Symptoms**: Browser shows "connection refused" or timeout
**Solutions**:
1. Check if containers are running: `docker compose ps`
2. Check if port 5678 is accessible: `curl http://localhost:5678/healthz`
3. Check Docker logs: `docker compose logs n8n`
4. Ensure `.env` configuration is correct

### Issue: Workflows not executing
**Symptoms**: Workflows appear stuck or don't run
**Solutions**:
1. Check worker status: `docker compose logs n8n-worker`
2. Check Redis connection: `docker compose logs redis`
3. Verify queue settings in `.env`
4. Restart services: `docker compose restart`

### Issue: "Encryption key is not set" error
**Symptoms**: Error message about missing encryption key
**Solutions**:
1. Ensure `N8N_ENCRYPTION_KEY` is set in `.env`
2. Generate new key: `openssl rand -base64 48`
3. **Never change the key after initial setup**

### Issue: Database connection failed
**Symptoms**: n8n can't connect to PostgreSQL
**Solutions**:
1. Check PostgreSQL status: `docker compose logs postgres`
2. Verify database credentials in `.env`
3. Ensure PostgreSQL is healthy: `docker compose ps postgres`

### Issue: SSL certificate problems (HTTPS setup)
**Symptoms**: Browser security warnings, SSL errors
**Solutions**:
1. Verify DNS points to your server
2. Check Caddy logs: `docker compose logs caddy`
3. Ensure port 80 and 443 are open
4. Verify `DOMAIN` and `ACME_EMAIL` in `.env`

### Issue: High memory usage
**Symptoms**: Server running out of memory
**Solutions**:
1. Reduce `WORKER_CONCURRENCY` in `.env`
2. Enable execution data pruning
3. Scale down workers: `docker compose up -d --scale n8n-worker=1`
4. Monitor with: `docker stats`

### Getting Help
1. Check container logs: `docker compose logs [service-name]`
2. Verify configuration: `cat .env`
3. Check system resources: `docker stats`
4. Review n8n documentation: https://docs.n8n.io/

## Execute Command node
- Commands run inside the n8n container. If you need extra tools (curl/ssh/python), create a small custom image based on n8nio/n8n and install packages, or mount tools via volumes.

## Reverse proxy notes
- Prefer setting WEBHOOK_URL to the final public URL to avoid wrong webhook links.
- Keep N8N_SECURE_COOKIE=true when using HTTPS.