# ✅ Pre-Deployment Checklist

**Complete this checklist before deploying your AI-Powered Career Automation System**

---

## 🎯 Overview

This checklist ensures you have everything ready for a smooth deployment. Complete each section before running the deployment scripts.

**Estimated Time:** 15-30 minutes  
**Required for:** All deployment modes (local, production, cloud)

---

## 📋 Section 1: System Requirements

### Hardware Requirements
- [ ] **CPU**: 2+ cores available
- [ ] **RAM**: 4GB+ available (8GB recommended)
- [ ] **Storage**: 10GB+ free disk space
- [ ] **Network**: Stable internet connection (5+ Mbps)

**Verification Commands:**
```bash
# Check CPU
lscpu | grep "CPU(s)"

# Check RAM
free -h

# Check disk space
df -h

# Check internet
ping -c 3 google.com
```

### Software Requirements
- [ ] **Operating System**: Linux, macOS, or Windows with WSL2
- [ ] **Docker**: Version 20.10.0 or higher
- [ ] **Docker Compose**: Version 1.27.0 or higher
- [ ] **Git**: Version 2.0 or higher (optional but recommended)
- [ ] **Text Editor**: nano, vim, or VS Code for editing files

**Verification Commands:**
```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check Git
git --version

# Check Docker daemon
docker info
```

**Installation Help:**
- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/
- Git: https://git-scm.com/downloads

---

## 🔐 Section 2: Account Setup

### Required Accounts
- [ ] **GitHub Account**: For repository access and Pages hosting
- [ ] **OpenAI Account**: For AI content generation (required)
- [ ] **Docker Hub Account**: For pulling Docker images (optional)

### Optional Accounts (for full features)
- [ ] **Google Cloud Account**: For Gmail/Drive integration
- [ ] **Buffer Account**: For social media automation
- [ ] **Slack Account**: For notifications (optional)
- [ ] **Discord Account**: For notifications (optional)

**Account URLs:**
- GitHub: https://github.com/join
- OpenAI: https://platform.openai.com/signup
- Google Cloud: https://console.cloud.google.com/
- Buffer: https://buffer.com/signup

---

## 🔑 Section 3: API Keys & Credentials

### Must Have
- [ ] **OpenAI API Key**
  - Get from: https://platform.openai.com/api-keys
  - Requires: Payment method added
  - Cost: ~$5-20/month (typical usage)
  - Format: `sk-...`

### Nice to Have
- [ ] **Google OAuth Credentials**
  - Get from: https://console.cloud.google.com/apis/credentials
  - Enable: Gmail API, Google Drive API
  - Type: OAuth 2.0 Client ID
  
- [ ] **Buffer API Token**
  - Get from: https://buffer.com/developers/api
  - Requires: Buffer account with connected social profiles
  
- [ ] **GitHub Personal Access Token**
  - Get from: https://github.com/settings/tokens
  - Scopes: `repo`, `workflow`, `read:org`
  
- [ ] **Gemini API Key** (optional)
  - Get from: https://makersuite.google.com/app/apikey
  - Google's alternative to OpenAI

**Security Notes:**
- ⚠️ Never commit API keys to git
- ⚠️ Store keys in .env file only
- ⚠️ Use environment variables in production
- ⚠️ Rotate keys regularly

---

## 📂 Section 4: Repository Setup

### Local Repository
- [ ] Repository cloned to local machine
- [ ] Current directory is repository root
- [ ] All files present (run `ls -la`)
- [ ] Read access to all files
- [ ] Write access for creating .env file

**Verification Commands:**
```bash
# Check current directory
pwd

# List files
ls -la

# Verify key files exist
test -f README.md && echo "✅ README.md exists"
test -f package.json && echo "✅ package.json exists"
test -f index.html && echo "✅ index.html exists"
```

### Git Configuration (Optional)
- [ ] Git initialized (`.git` directory exists)
- [ ] Remote repository configured
- [ ] User name configured: `git config user.name`
- [ ] User email configured: `git config user.email`
- [ ] SSH key or HTTPS credentials set up

**Git Setup Commands:**
```bash
# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Check remote
git remote -v

# Test git access
git fetch
```

---

## ⚙️ Section 5: Configuration Files

### Environment File
- [ ] `.env.example` file exists
- [ ] Create `.env` from example: `cp .env.example .env`
- [ ] Edit `.env` file with your values
- [ ] Set strong password for `N8N_BASIC_AUTH_PASSWORD`
- [ ] Configure timezone (e.g., `Asia/Kolkata`, `America/New_York`)
- [ ] Verify all required variables are set

**Key Variables to Configure:**
```bash
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_strong_password_here
GENERIC_TIMEZONE=Asia/Kolkata
TZ=Asia/Kolkata
```

### Docker Compose Files
- [ ] `docker-compose.basic.yml` exists (for local development)
- [ ] `docker-compose.reverse-proxy.yml` exists (for production)
- [ ] Choose which compose file to use
- [ ] Verify ports are not already in use (5678)

**Check Port Availability:**
```bash
# Check if port 5678 is free
sudo netstat -tulpn | grep 5678
# OR
sudo lsof -i :5678

# Should return nothing if port is free
```

### Optional Configuration
- [ ] `Caddyfile` configured (if using reverse proxy)
- [ ] Domain name ready (if deploying to production)
- [ ] DNS records configured (if using custom domain)
- [ ] SSL/TLS certificates ready (if not using Caddy auto-SSL)

---

## 🌐 Section 6: Network Configuration

### Local Network
- [ ] Port 5678 available (for n8n)
- [ ] No firewall blocking Docker
- [ ] Docker can access internet
- [ ] DNS resolution working

### Production Network (if applicable)
- [ ] Domain name registered and owned
- [ ] DNS A record pointing to server IP
- [ ] Server has public IP address
- [ ] Firewall allows HTTP (80) and HTTPS (443)
- [ ] SSL certificate ready or Caddy configured

**Network Test Commands:**
```bash
# Test DNS
nslookup your-domain.com

# Test connectivity
curl -I https://google.com

# Check firewall (Ubuntu/Debian)
sudo ufw status

# Check open ports
sudo netstat -tulpn
```

---

## 📦 Section 7: Docker Setup

### Docker Installation
- [ ] Docker installed and version verified
- [ ] Docker daemon running
- [ ] Current user in `docker` group (or using sudo)
- [ ] Docker Compose installed
- [ ] Can pull images: `docker pull hello-world`
- [ ] Can run containers: `docker run hello-world`

**Docker Setup Commands:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Restart session (logout/login) or use:
newgrp docker

# Test Docker
docker run hello-world

# Test Docker Compose
docker-compose --version
```

### Docker Resources
- [ ] Docker has enough disk space allocated
- [ ] Docker memory limit sufficient (4GB+)
- [ ] Docker CPU limit not too restrictive
- [ ] No resource constraints in Docker settings

**Check Docker Resources:**
```bash
# View Docker disk usage
docker system df

# Check Docker info
docker info | grep -E "CPUs|Total Memory"
```

---

## 🚀 Section 8: Deployment Preparation

### Backup & Safety
- [ ] Current work backed up (if any)
- [ ] Important data saved elsewhere
- [ ] Ready to troubleshoot if issues arise
- [ ] Time allocated for deployment (30-60 min)

### Documentation Review
- [ ] Read [DEPLOYMENT.md](./DEPLOYMENT.md) overview
- [ ] Reviewed [QUICK-DEPLOY.md](./QUICK-DEPLOY.md)
- [ ] Understand basic Docker commands
- [ ] Know how to check logs: `docker-compose logs`

### Permissions & Access
- [ ] Can create files in repository directory
- [ ] Can execute shell scripts
- [ ] Can access Docker commands
- [ ] Can edit configuration files

**Test Permissions:**
```bash
# Test file creation
touch test_permission.txt && rm test_permission.txt && echo "✅ Can create files"

# Test script execution
test -x deploy-complete.sh || chmod +x deploy-complete.sh
```

---

## 🎯 Section 9: Deployment Mode Selection

Choose your deployment mode:

### Option A: Local Development (Easiest)
- [ ] Use `docker-compose.basic.yml`
- [ ] Access via `http://localhost:5678`
- [ ] No domain or SSL needed
- [ ] Perfect for testing and development

**Requirements:**
- Docker and Docker Compose
- .env file configured
- Port 5678 available

### Option B: Production with HTTPS (Recommended)
- [ ] Use `docker-compose.reverse-proxy.yml`
- [ ] Domain name configured
- [ ] DNS pointing to server
- [ ] Caddy configured in `Caddyfile`
- [ ] Ports 80, 443, 5678 available

**Requirements:**
- All Local Development requirements
- Public domain name
- Public server IP
- Firewall configuration

### Option C: Cloud Deployment (Advanced)
- [ ] Cloud provider account (AWS/Azure/GCP)
- [ ] Cloud CLI tools installed
- [ ] Cloud credentials configured
- [ ] Terraform or deployment scripts ready

**Requirements:**
- Cloud account with billing
- Cloud CLI configured
- Understanding of cloud services
- Budget for cloud resources

---

## ✅ Section 10: Final Pre-Flight Check

### Critical Items (Must Have)
- [ ] ✅ Docker running
- [ ] ✅ .env file configured
- [ ] ✅ OpenAI API key ready
- [ ] ✅ Port 5678 available
- [ ] ✅ Internet connection stable

### Important Items (Should Have)
- [ ] ✅ All documentation reviewed
- [ ] ✅ Backup of important data
- [ ] ✅ Time allocated for setup
- [ ] ✅ Basic troubleshooting knowledge

### Optional Items (Nice to Have)
- [ ] Additional API keys configured
- [ ] Domain name ready
- [ ] GitHub Pages configured
- [ ] Monitoring tools ready

---

## 🎬 Ready to Deploy?

**If you've checked all critical items above, you're ready!**

### Start Deployment:
```bash
# Make script executable
chmod +x deploy-complete.sh

# Run deployment
./deploy-complete.sh
```

### After Deployment:
```bash
# Verify everything
./verify-deployment.sh

# Monitor status
./monitor-automation.sh
```

---

## 📞 Need Help?

### Before Deployment
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- Check [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) for quick reference
- Ensure all prerequisites are met

### During Deployment
- Watch for error messages
- Check Docker logs if issues arise
- Refer to troubleshooting sections

### After Deployment
- Run verification script
- Check deployment status
- Review [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md)

---

## 📊 Checklist Summary

**Print this page and check off items as you complete them!**

```
Prerequisites:    [ ] System [ ] Software [ ] Accounts
Configuration:    [ ] API Keys [ ] .env File [ ] Docker
Network:          [ ] Ports [ ] Firewall [ ] Domain (if prod)
Preparation:      [ ] Docs Read [ ] Backup [ ] Time Allocated
Mode Selected:    [ ] Local [ ] Production [ ] Cloud
Ready to Deploy:  [ ] YES!
```

---

**Pre-Deployment Checklist v1.0**  
**Last Updated:** December 2024  
**Estimated Completion Time:** 15-30 minutes

**Good luck with your deployment! 🚀**
