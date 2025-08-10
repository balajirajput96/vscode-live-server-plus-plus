# 🚀 Complete n8n Automation Setup Guide
## Docker, Webhooks, Tunnel, CLI — Step-by-Step Implementation

यह गाइड आपके अपलोड किए गए स्क्रीनशॉट्स और n8n डॉक्यूमेंटेशन के आधार पर complete automation setup प्रदान करता है।

---

## 📋 Overview

This comprehensive automation system integrates:
- **n8n Workflow Automation** with Docker containerization
- **Career Management System** for biotech professionals  
- **Webhook Endpoints** for external integrations
- **Tunnel Services** for public access
- **CLI Tools** for management and control

## 🎯 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Career        │    │   n8n Docker     │    │   External      │
│   Automation    │───▶│   Container      │◀───│   Services      │
│   System        │    │   (Port 5678)    │    │   (APIs/Hooks)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐             │
         └─────────────▶│   Webhooks &     │◀────────────┘
                        │   Tunnel Service │
                        └──────────────────┘
```

## 🚀 Quick Start (एक कमांड से पूरा सेटअप)

### 1) तुरंत चालू करें
```bash
cd n8n-automation
./setup.sh
```

यह automatically करेगा:
- ✅ Docker और dependencies check
- ✅ Environment configuration setup  
- ✅ Custom n8n image build (Python + bioinformatics tools)
- ✅ Service start with data persistence
- ✅ Webhook endpoints configuration
- ✅ Basic automation workflows setup

### 2) Access Points
```bash
# n8n Editor
open http://localhost:5678

# Health Check
curl http://localhost:5678/healthz

# Webhook Test
curl -X POST http://localhost:5678/webhook/career-automation
```

---

## 🐳 Docker Configuration (आपके स्क्रीनशॉट्स के अनुसार)

### Custom n8n Image
```dockerfile
FROM docker.n8n.io/n8nio/n8n:latest
USER root

# Bioinformatics tools installation
RUN apk --update add \
    curl wget git python3 py3-pip \
    nodejs npm bash openssh-client

# Python scientific packages
RUN pip3 install pandas numpy matplotlib seaborn requests

USER node
EXPOSE 5678
```

### Docker Compose Setup
```yaml
version: '3.8'
services:
  n8n:
    build: .
    container_name: n8n-career-automation
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=${N8N_HOST:-localhost}
      - N8N_PROTOCOL=${N8N_PROTOCOL:-http}
      - WEBHOOK_URL=${WEBHOOK_URL:-http://localhost:5678/}
      - GENERIC_TIMEZONE=Asia/Kolkata
      - N8N_TRUST_PROXY=true
    volumes:
      - n8n_data:/home/node/.n8n
```

---

## 🔗 Webhook Configuration (External Access के लिए)

### Environment Variables Setup
```bash
# Basic Configuration
N8N_HOST=localhost
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678/

# For Public Domain
N8N_HOST=n8n.yourdomain.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.yourdomain.com/
N8N_TRUST_PROXY=true
```

### Available Webhook Endpoints
```bash
# LinkedIn Post Generation
POST http://localhost:5678/webhook/linkedin-post
{
  "project_name": "Gene Expression Analysis",
  "skills": "Python, Bioinformatics, Data Analysis",
  "description": "Analyzed breast cancer data"
}

# Job Search Automation  
POST http://localhost:5678/webhook/job-search
{
  "keywords": "bioinformatics,data scientist",
  "companies": "Sun Pharma,Biocon,Cipla",
  "location": "Bangalore"
}

# Portfolio Update
POST http://localhost:5678/webhook/portfolio-update
{
  "action": "add_project",
  "project": {
    "name": "COVID-19 Analysis",
    "tools": ["Python", "BioPython"]
  }
}
```

---

## 🌐 Tunnel Setup (External Access के लिए)

### Option 1: Ngrok Integration
```bash
# .env में add करें
NGROK_AUTHTOKEN=your_ngrok_token_here

# Tunnel start करें
./setup.sh tunnel

# Public URL मिलेगा
https://abc123.ngrok.io → http://localhost:5678
```

### Option 2: Manual Ngrok
```bash
# Install ngrok
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip

# Setup and run
./ngrok authtoken your_token
./ngrok http 5678

# Update webhook URL
export WEBHOOK_URL=https://your-ngrok-url.ngrok.io/
```

### Option 3: Reverse Proxy (Production)
```bash
# Enable proxy service
./setup.sh proxy

# Configure domain in nginx.conf
server_name your-domain.com;
ssl_certificate /etc/nginx/ssl/cert.pem;
```

---

## 🛠️ CLI Management (Complete Control)

### Python CLI Tool
```bash
# Check status
./scripts/n8n-cli.py status

# List all workflows  
./scripts/n8n-cli.py workflows

# Activate specific workflow
./scripts/n8n-cli.py activate workflow-id

# Trigger career automation
./scripts/n8n-cli.py career linkedin_post "My Project"

# View execution history
./scripts/n8n-cli.py executions --limit 10
```

### Docker CLI Access
```bash
# Access n8n container shell
./setup.sh cli

# Inside container - n8n CLI commands
n8n export:workflow --backup --output=/tmp/
n8n import:workflow --input=/tmp/workflow.json
n8n execute --id=workflow-id
```

---

## 📊 Automation Workflows (Ready-to-Use)

### 1) LinkedIn Post Automation
**File**: `workflows/linkedin_post_automation.json`
```json
{
  "trigger": "webhook",
  "path": "/webhook/linkedin-post", 
  "nodes": [
    "Webhook → Set Variables → Generate Post → Response"
  ],
  "output": "Professional LinkedIn post with hashtags"
}
```

### 2) Job Search Automation  
**File**: `workflows/job_search_automation.json`
```json
{
  "trigger": "webhook",
  "path": "/webhook/job-search",
  "nodes": [
    "Webhook → Set Params → Search Jobs → Generate Applications → Response"
  ],
  "output": "Job listings with application templates"
}
```

### 3) Portfolio Update Automation
**File**: `workflows/portfolio_automation.json` 
```json
{
  "trigger": "webhook", 
  "path": "/webhook/portfolio-update",
  "nodes": [
    "Webhook → Check Action → Add/Update Project → Promote → Response"
  ],
  "output": "Updated GitHub README and social posts"
}
```

---

## 🔧 Integration with Existing Career System

### Automatic Integration
```bash
# Run integration script
./scripts/integration.py --action sync

# यह करेगा:
# ✅ Existing projects को n8n में sync
# ✅ Automation workflows setup  
# ✅ Scheduled executions configure
# ✅ Integration report generate
```

### Manual Integration Points
```javascript
// From existing HTML/JS system
async function triggerLinkedInPost(projectData) {
  const response = await fetch('http://localhost:5678/webhook/linkedin-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  return response.json();
}
```

---

## ⚙️ Advanced Configuration

### Database Configuration (Production)
```bash
# PostgreSQL setup
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=secure_password
```

### Email Notifications
```bash
# SMTP configuration
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.gmail.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=your_email@gmail.com
N8N_SMTP_PASS=your_app_password
```

### API Keys Management
```bash
# Add to .env file
OPENAI_API_KEY=sk-...
LINKEDIN_API_KEY=your_linkedin_key
GITHUB_TOKEN=ghp_...
TARGET_COMPANIES=Sun Pharma,Zydus Cadila,Dr. Reddy's
```

---

## 🚨 Troubleshooting (Common Issues)

### 1) Tunnel 504 Gateway Timeout
```bash
# Solution: Use external tunnel service
./setup.sh tunnel

# Or manual ngrok
ngrok http 5678
# Update WEBHOOK_URL in .env
```

### 2) Container Permission Issues
```bash
# Fix data volume permissions
docker exec -it n8n-career-automation chown -R node:node /home/node/.n8n

# Or recreate volume
docker volume rm n8n_data
./setup.sh
```

### 3) Webhook Not Triggering
```bash
# Test webhook endpoint
curl -X POST http://localhost:5678/webhook/test

# Check workflow is active
./scripts/n8n-cli.py workflows

# View logs
docker-compose logs -f n8n
```

### 4) Execute Command Node Issues
```bash
# Install missing tools in container
docker exec -it n8n-career-automation apk add curl

# Or rebuild custom image
docker-compose build --no-cache n8n
```

---

## 📈 Production Deployment

### 1) Domain Setup
```bash
# Update environment
N8N_HOST=n8n.yourdomain.com
N8N_PROTOCOL=https  
WEBHOOK_URL=https://n8n.yourdomain.com/

# Enable reverse proxy
./setup.sh proxy
```

### 2) SSL Certificate
```bash
# Add SSL certificates to config/ssl/
cp your_cert.pem config/ssl/cert.pem
cp your_key.pem config/ssl/key.pem

# Update nginx.conf
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
```

### 3) Security Setup
```bash
# Enable authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password

# Configure firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 5678/tcp  # Direct access blocked
```

---

## 📊 Success Metrics & Analytics

### KPI Tracking through n8n
- **LinkedIn Engagement**: Post reach, likes, comments
- **Job Applications**: Applications sent, response rate
- **Portfolio Updates**: GitHub views, website traffic
- **Automation Efficiency**: Execution time, success rate

### Monitoring Dashboard
```bash
# View execution statistics
./scripts/n8n-cli.py executions --limit 50

# Check webhook performance
curl http://localhost:5678/healthz

# Monitor Docker resources
docker stats n8n-career-automation
```

---

## 🎯 Next Steps & Scaling

### Phase 1: Basic Automation (Completed)
- ✅ Docker setup with n8n
- ✅ Webhook endpoints configured
- ✅ CLI management tools  
- ✅ Basic career workflows

### Phase 2: Advanced Features
- [ ] Machine learning integration for job matching
- [ ] Advanced LinkedIn analytics
- [ ] Multi-platform social media automation
- [ ] Interview scheduling automation

### Phase 3: Enterprise Features  
- [ ] Multi-user support
- [ ] Advanced security (OAuth, LDAP)
- [ ] Horizontal scaling with Kubernetes
- [ ] Advanced monitoring and alerting

---

## 📚 Additional Resources

### Documentation Links
- [n8n Official Documentation](https://docs.n8n.io/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Webhook Development Guide](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

### Video Tutorials
- [Self-Hosting n8n with Docker](https://www.youtube.com/watch?v=dC2Q_cyzgjg)
- [n8n Webhook Automation](https://www.youtube.com/n8n-webhook-tutorial)

### Community Support
- [n8n Community Forum](https://community.n8n.io/)
- [Discord Server](https://discord.gg/n8n)
- [GitHub Repository](https://github.com/n8n-io/n8n)

---

## 🎉 Summary

आपका complete n8n automation system अब ready है:

### ✅ Completed Setup
- **Docker Environment**: Custom n8n container with bioinformatics tools
- **Webhook Integration**: 3 main automation endpoints  
- **Tunnel Access**: Ngrok और reverse proxy options
- **CLI Management**: Python-based management tools
- **Career Workflows**: LinkedIn, job search, portfolio automation

### 🚀 Ready for Use
```bash
# Start everything
./setup.sh

# Test automation
curl -X POST http://localhost:5678/webhook/linkedin-post \
  -H "Content-Type: application/json" \
  -d '{"project_name": "Test Project"}'

# Access editor
open http://localhost:5678
```

### 📞 Support
किसी भी issue के लिए:
1. Check troubleshooting section
2. View logs: `./setup.sh logs`  
3. Test individual components
4. Review integration report

**🎯 Your biotech career automation is now fully powered by n8n!**