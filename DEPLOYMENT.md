# 🚀 Complete Deployment Guide

**Complete step-by-step guide for deploying the AI-Powered Career Automation System**

---

## 🎯 What Will Be Deployed

### 1. **n8n Automation Platform** ✅
- **Location**: Docker containers
- **Access**: http://localhost:5678 (local) or https://your-domain.com (production)
- **Purpose**: Workflow automation, AI integrations, webhook processing

### 2. **Career Automation System** ✅
- **Location**: GitHub Pages or static hosting
- **Access**: https://username.github.io/repo-name
- **Purpose**: Portfolio builder, job tracker, resume optimizer

### 3. **Portfolio Website** ✅
- **Location**: GitHub Pages or custom domain
- **Access**: https://your-domain.com
- **Purpose**: Professional portfolio showcase

### 4. **AI Agent Automation** ✅
- **Location**: n8n workflows
- **Purpose**: Social media automation, content generation

### 5. **GitHub Actions** ✅
- **Status**: Active
- **Purpose**: CI/CD, n8n notifications, health checks

---

## 📦 Component 1: n8n Automation Platform

### Prerequisites
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose (if not included)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Local Development Deployment
```bash
# 1. Navigate to project directory
cd /path/to/vscode-live-server-plus-plus

# 2. Create environment file
cp .env.example .env

# 3. Edit environment variables
nano .env
# Add:
# N8N_BASIC_AUTH_ACTIVE=true
# N8N_BASIC_AUTH_USER=admin
# N8N_BASIC_AUTH_PASSWORD=your_secure_password

# 4. Start n8n with Docker Compose
docker-compose -f docker-compose.basic.yml up -d

# 5. Check status
docker-compose -f docker-compose.basic.yml ps

# 6. View logs
docker-compose -f docker-compose.basic.yml logs -f n8n
```

### Production Deployment (with HTTPS)
```bash
# 1. Set up domain and DNS
# Point your domain to your server IP

# 2. Install Caddy (for automatic HTTPS)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# 3. Configure Caddyfile
sudo nano /etc/caddy/Caddyfile
# Add:
# your-domain.com {
#     reverse_proxy localhost:5678
# }

# 4. Start Caddy
sudo systemctl enable caddy
sudo systemctl start caddy

# 5. Deploy n8n with reverse proxy
docker-compose -f docker-compose.reverse-proxy.yml up -d

# 6. Access n8n
# https://your-domain.com
```

### Import Workflows
```bash
# 1. Access n8n at http://localhost:5678

# 2. Navigate to Workflows → Import from File

# 3. Import workflows from:
# - automation-scripts/n8n-workflows/
# - n8n-workflows/
# - ai-agent-automation-pack/workflows/

# 4. Activate each workflow after configuration
```

### Configure Credentials
```bash
# In n8n web interface:

# 1. OpenAI API
#    - Go to Credentials → Add Credential → OpenAI API
#    - Add your API key from https://platform.openai.com/api-keys

# 2. Gmail
#    - Credentials → Add Credential → Gmail OAuth2
#    - Follow OAuth2 setup wizard

# 3. Google Drive
#    - Credentials → Add Credential → Google Drive OAuth2
#    - Follow OAuth2 setup wizard

# 4. Buffer (Social Media)
#    - Credentials → Add Credential → Buffer API
#    - Get token from https://buffer.com/developers

# 5. GitHub
#    - Credentials → Add Credential → GitHub API
#    - Create personal access token at https://github.com/settings/tokens
```

---

## 🌐 Component 2: GitHub Pages Deployment

### Deploy Career Automation System
```bash
# 1. Enable GitHub Pages
# Settings → Pages → Source: main branch / root

# 2. Configure custom domain (optional)
# Settings → Pages → Custom domain: your-domain.com

# 3. Access your site
# https://username.github.io/vscode-live-server-plus-plus
```

### Files Deployed
- ✅ `index.html` - Main dashboard
- ✅ `career-automation-system/` - Career tools
- ✅ `portfolio-website/` - Portfolio templates
- ✅ `Job_Tracking_System.html` - Job tracker
- ✅ `sonar-api-quickstart.html` - API guide

---

## 🔧 Component 3: GitHub Actions & CI/CD

### Setup GitHub Secrets
```bash
# Go to Settings → Secrets and variables → Actions
# Add the following secrets:
```

**Required Secrets:**
- `N8N_WEBHOOK_URL` - Your n8n webhook URL
- `OPENAI_API_KEY` - OpenAI API key
- `GEMINI_API_KEY` - Google Gemini API key (optional)
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` - Azure publish profile (if using Azure)

### Verify Workflows
1. **Notify n8n Workflow** (`.github/workflows/notify-n8n.yml`)
   - ✅ Triggers on push to main/master
   - ✅ Sends notifications to n8n
   - ✅ Performs health checks

2. **Azure Functions Deployment** (`.github/workflows/azure-functions-app-nodejs.yml`)
   - ⏸️ Disabled until Azure configured
   - Update `AZURE_FUNCTIONAPP_NAME` in workflow file

---

## ☁️ Component 4: Multi-Cloud Deployment (Optional)

### AWS Deployment
```bash
# 1. Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 2. Configure AWS
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output: json

# 3. Deploy to AWS ECS (Elastic Container Service)
# Create ECR repository
aws ecr create-repository --repository-name n8n-automation

# 4. Build and push Docker image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -f Dockerfile.n8n-extended -t n8n-automation .
docker tag n8n-automation:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/n8n-automation:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/n8n-automation:latest

# 5. Create ECS cluster and service
aws ecs create-cluster --cluster-name automation-cluster
```

### Azure Deployment
```bash
# 1. Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# 2. Login to Azure
az login

# 3. Create resource group
az group create --name automation-rg --location eastus

# 4. Create Azure Container Registry
az acr create --resource-group automation-rg --name automationacr --sku Basic

# 5. Build and push to ACR
az acr build --registry automationacr --image n8n-automation:latest -f Dockerfile.n8n-extended .

# 6. Create App Service
az appservice plan create --name automation-plan --resource-group automation-rg --is-linux --sku B1
az webapp create --resource-group automation-rg --plan automation-plan --name automation-app --deployment-container-image-name automationacr.azurecr.io/n8n-automation:latest
```

### Google Cloud Deployment
```bash
# 1. Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# 2. Create project
gcloud projects create automation-project --name="Automation Project"
gcloud config set project automation-project

# 3. Enable required APIs
gcloud services enable containerregistry.googleapis.com
gcloud services enable run.googleapis.com

# 4. Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/automation-project/n8n-automation -f Dockerfile.n8n-extended

# 5. Deploy to Cloud Run
gcloud run deploy automation-service \
  --image gcr.io/automation-project/n8n-automation \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🧪 Component 5: Testing & Verification

### Health Check Script
```bash
#!/bin/bash

echo "🔍 System Health Check"
echo "======================"

# Check Docker containers
if docker ps | grep -q n8n; then
    echo "✅ n8n container running"
else
    echo "❌ n8n container not running"
fi

# Check n8n API
if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
    echo "✅ n8n API responding"
else
    echo "❌ n8n API not responding"
fi

# Check GitHub Pages
if curl -f https://username.github.io/vscode-live-server-plus-plus > /dev/null 2>&1; then
    echo "✅ GitHub Pages accessible"
else
    echo "⚠️ GitHub Pages not accessible or not configured"
fi

echo ""
echo "Health check complete!"
```

### Run Tests
```bash
# 1. Test n8n workflows
curl -X GET http://localhost:5678/workflows

# 2. Test webhook endpoints
curl -X POST http://localhost:5678/webhook/test -H "Content-Type: application/json" -d '{"test": "data"}'

# 3. Test GitHub Actions
git commit --allow-empty -m "Test GitHub Actions"
git push origin main
```

---

## 📊 Component 6: Monitoring & Analytics

### Setup Monitoring
```bash
# 1. n8n Metrics
# Access at: http://localhost:5678/metrics

# 2. Docker Stats
docker stats

# 3. System Logs
docker-compose logs -f --tail=100

# 4. Error Tracking
docker-compose logs | grep -i error
```

### Analytics Dashboard
```bash
# Track key metrics:
# - Workflow executions
# - Success/failure rates
# - API usage
# - Response times
# - User activity
```

---

## 🔒 Security Best Practices

### Secure n8n Deployment
```bash
# 1. Enable basic authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<strong-password>

# 2. Use HTTPS in production
# Always use reverse proxy with SSL/TLS

# 3. Secure API keys
# Never commit .env files
# Use secrets management

# 4. Regular updates
docker-compose pull
docker-compose up -d
```

### Backup Strategy
```bash
# 1. Backup n8n data
docker-compose exec n8n n8n export:workflow --all --output=/backup/workflows.json
docker-compose exec n8n n8n export:credentials --all --output=/backup/credentials.json

# 2. Backup to cloud
aws s3 cp /backup s3://my-backup-bucket/ --recursive

# 3. Automated backups
# Add to crontab:
# 0 2 * * * /path/to/backup-script.sh
```

---

## 🚀 Quick Start Commands

### One-Line Deployment (Local)
```bash
curl -fsSL https://raw.githubusercontent.com/balajirajput96/vscode-live-server-plus-plus/main/deploy-complete.sh | bash
```

### Manual Step-by-Step
```bash
# 1. Clone repository
git clone https://github.com/balajirajput96/vscode-live-server-plus-plus.git
cd vscode-live-server-plus-plus

# 2. Run deployment script
chmod +x deploy-complete.sh
./deploy-complete.sh

# 3. Verify deployment
chmod +x verify-deployment.sh
./verify-deployment.sh
```

---

## 📚 Additional Resources

### Documentation
- [README](./README.md) - Project overview
- [n8n Setup Guide](./README-n8n-setup.md) - Detailed n8n configuration
- [Complete Action Plan](./complete-action-plan.md) - Step-by-step action plan
- [Deployment Summary](./DEPLOYMENT-SUMMARY.md) - Quick reference
- [Deployment Status](./DEPLOYMENT-STATUS.md) - Track your progress

### Support
- **GitHub Issues**: https://github.com/balajirajput96/vscode-live-server-plus-plus/issues
- **n8n Community**: https://community.n8n.io/
- **Docker Documentation**: https://docs.docker.com/

---

## ✅ Post-Deployment Checklist

- [ ] n8n accessible at configured URL
- [ ] All workflows imported successfully
- [ ] API credentials configured
- [ ] GitHub Pages deployed
- [ ] GitHub Actions running
- [ ] Health checks passing
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Security measures in place
- [ ] Documentation updated

---

## 🎉 Success!

Your complete AI-Powered Career Automation System is now deployed and ready to use!

**Next Steps:**
1. Import and configure workflows
2. Set up API credentials
3. Test all automation workflows
4. Monitor system health
5. Start automating your career success!

---

**Created:** December 2024  
**Last Updated:** December 2024  
**Version:** 1.0.0
