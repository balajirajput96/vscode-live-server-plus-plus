# n8n Workflow Migration Guide

This guide helps you migrate workflows and data between different n8n instances, such as moving from one email account setup to another or transferring from a trial to a production environment.

## 🚀 Quick Migration Steps

### Step 1: Export from Source n8n Instance

#### Option A: Web Interface Export (Recommended)
1. **Login** to your source n8n instance (e.g., balaji.web.design1@gmail.com account)
2. **Navigate** to Workflows → Select All Workflows
3. **Export** workflows as JSON file
4. **Download** and save the file securely

#### Option B: Database Export (Advanced)
```bash
# Connect to source database and export
docker exec -i source-n8n-postgres pg_dump -U n8n n8n > n8n_full_backup.sql

# Or export just workflows
docker exec -i source-n8n-postgres pg_dump -U n8n -d n8n -t workflow_entity > workflows_only.sql
```

### Step 2: Prepare Target n8n Instance

#### Set up new n8n instance (e.g., for 22034563001@paruluniversity.ac.in)
```bash
# Clone this repository
git clone https://github.com/balajirajput96/vscode-live-server-plus-plus.git
cd vscode-live-server-plus-plus

# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

#### Configure for your domain/email:
```env
# Set your domain and email
DOMAIN=n8n.paruluniversity.ac.in
ACME_EMAIL=22034563001@paruluniversity.ac.in

# Generate new encryption key (IMPORTANT!)
N8N_ENCRYPTION_KEY=your-new-encryption-key-here

# Configure for production
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.paruluniversity.ac.in/
N8N_TRUST_PROXY=true
```

### Step 3: Start New n8n Instance
```bash
# Generate encryption key
openssl rand -base64 48

# Start services
docker compose up -d

# Check status
docker compose ps
```

### Step 4: Import Workflows

#### Option A: Web Interface Import
1. **Open** your new n8n instance
2. **Create** admin account with university email
3. **Go to** Workflows → Import
4. **Upload** the JSON file exported earlier
5. **Review** and activate workflows

#### Option B: Database Import (Use same encryption key)
```bash
# Stop n8n services
docker compose stop n8n n8n-worker

# Import database (requires same encryption key!)
docker exec -i new-n8n-postgres psql -U n8n -d n8n < n8n_full_backup.sql

# Restart services
docker compose up -d
```

## 🔧 Post-Migration Configuration

### Update Email Settings
Configure SMTP for the new account in `.env`:
```env
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.gmail.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=22034563001@paruluniversity.ac.in
N8N_SMTP_PASS=your-app-password
N8N_SMTP_SENDER=22034563001@paruluniversity.ac.in
```

### Update Webhook URLs
1. **Review** all workflows with webhooks
2. **Update** webhook URLs to new domain
3. **Test** all external integrations
4. **Update** any hardcoded URLs in workflows

### Configure User Access
1. **Create** user account with university email
2. **Set** appropriate permissions
3. **Remove** old account access if needed
4. **Configure** team access if required

## 📊 Pro Version Features Setup

### Enable Advanced Features
Configure these settings for pro-level functionality:
```env
# Enable all available features
N8N_TEMPLATES_ENABLED=true
N8N_PERSONALIZATION_ENABLED=true
N8N_METRICS=true
N8N_USER_MANAGEMENT_DISABLED=false

# Performance optimization
WORKER_CONCURRENCY=10
EXECUTIONS_DATA_MAX_AGE=720  # 30 days
```

### Advanced Workflow Templates
The repository includes automation templates for:
- **Career automation workflows**
- **Social media posting automation**
- **Email marketing campaigns**
- **Data processing pipelines**
- **Notification systems**

## 🔒 Security & Backup

### Regular Backups
Set up automated backups:
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec n8n-postgres pg_dump -U n8n n8n > "backup_n8n_${DATE}.sql"
# Upload to cloud storage or secure location
EOF

chmod +x backup.sh

# Run weekly via cron
echo "0 2 * * 0 /path/to/backup.sh" | crontab -
```

### Access Control
1. **Change** default passwords
2. **Enable** 2FA if available
3. **Review** user permissions
4. **Monitor** access logs

## 🚨 Important Notes

### Encryption Key Warning
- **NEVER** change `N8N_ENCRYPTION_KEY` after initial setup
- Keep the key backed up securely
- Same key required for importing encrypted credentials

### University Account Setup
- Ensure university email has necessary permissions
- Check if institutional firewall allows webhook access
- Verify domain pointing and SSL certificate setup
- Test all external API connections

### Performance Optimization
- Monitor resource usage with `docker stats`
- Scale workers based on workload: `docker compose up -d --scale n8n-worker=3`
- Adjust pruning settings for data retention needs

## 🆘 Troubleshooting

### Common Issues After Migration
1. **Workflows not working**: Check webhook URLs and credentials
2. **Email not sending**: Verify SMTP configuration
3. **Database errors**: Ensure same encryption key used
4. **SSL issues**: Check domain DNS and certificate

### Getting Help
- Check logs: `docker compose logs -f`
- Test connectivity: `curl https://your-domain/healthz`
- Review configuration: `cat .env`
- Validate workflows manually before automation

## 📞 Support Resources
- n8n Documentation: https://docs.n8n.io/
- Docker Compose Reference: https://docs.docker.com/compose/
- SSL Setup Guide: https://caddyserver.com/docs/
- PostgreSQL Backup: https://www.postgresql.org/docs/current/backup.html

---

**Success Checklist:**
- [ ] Source workflows exported successfully
- [ ] New n8n instance running with university domain
- [ ] All workflows imported and tested
- [ ] Email configuration working
- [ ] Webhook URLs updated
- [ ] Security settings configured
- [ ] Backup system in place
- [ ] University account has admin access
- [ ] All automation working as expected

**🎉 Your n8n automation system is now successfully migrated and running with pro-level functionality!**