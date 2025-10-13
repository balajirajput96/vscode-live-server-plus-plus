# 🛫 Pre-Deployment Checklist

## ✅ Before You Deploy

Run through this checklist before starting deployment to ensure smooth setup.

---

## 📋 System Requirements

### Required Software
- [ ] **Docker** installed and running
  ```bash
  docker --version
  # Expected: Docker version 20.x or higher
  ```

- [ ] **Docker Compose** installed
  ```bash
  docker-compose --version
  # Expected: docker-compose version 1.29.x or higher
  ```

### Optional Software
- [ ] **Git** (for version control)
  ```bash
  git --version
  ```

- [ ] **OpenSSL** (for encryption key generation)
  ```bash
  openssl version
  ```

- [ ] **curl** (for health checks)
  ```bash
  curl --version
  ```

---

## 🔐 Credentials & API Keys

### Required for Basic Setup
- [ ] **OpenAI API Key**
  - Get from: https://platform.openai.com/api-keys
  - Cost: Pay-as-you-go or $20/month for Plus
  - Test: Can make API calls successfully

### Required for Full Automation
- [ ] **Gmail OAuth Credentials**
  - Get from: https://console.cloud.google.com/
  - Enable Gmail API
  - Create OAuth 2.0 credentials

- [ ] **Google Drive OAuth Credentials**
  - Same as Gmail (can use same project)
  - Enable Google Drive API

### Optional Services
- [ ] **Buffer API Token** (for social media posting)
  - Get from: https://buffer.com/developers/api
  - Free plan available

- [ ] **Gemini API Key** (alternative to OpenAI)
  - Get from: https://makersuite.google.com/app/apikey
  - Free tier available

---

## 🌐 Domain & Hosting (Production Only)

### For Production Deployment with HTTPS
- [ ] **Domain name registered**
  - Provider: GoDaddy, Namecheap, etc.
  - Domain: _________________

- [ ] **DNS configured**
  - A record pointing to server IP
  - Verify: `dig your-domain.com`

- [ ] **Server requirements**
  - Min 1GB RAM
  - Min 10GB storage
  - Ports 80 and 443 open
  - Static IP address

- [ ] **Email for Let's Encrypt**
  - Valid email: _________________

---

## 📝 Configuration Preparation

### Environment Variables to Set
- [ ] **DOMAIN** (production only)
  - Your domain: _________________

- [ ] **EMAIL**
  - Your email: _________________

- [ ] **N8N_BASIC_AUTH_PASSWORD**
  - Strong password: _________________
  - (Don't use default!)

- [ ] **WEBHOOK_URL**
  - Will be: http://localhost:5678/ (local)
  - Or: https://your-domain.com/ (production)

---

## 📦 GitHub Configuration

### Repository Setup
- [ ] **Repository cloned/downloaded**
  ```bash
  git clone https://github.com/your-username/ai-career-automation-system.git
  ```

- [ ] **In correct directory**
  ```bash
  cd ai-career-automation-system
  pwd  # Should show full path to repo
  ```

### GitHub Secrets (for Actions)
- [ ] **N8N_WEBHOOK_URL** secret added
  - Go to: Settings → Secrets and variables → Actions
  - Add new secret

- [ ] **OPENAI_API_KEY** secret added
  - Same location as above

- [ ] **GEMINI_API_KEY** secret added (optional)
  - Same location as above

### GitHub Pages (for Web Components)
- [ ] Plan to enable GitHub Pages?
  - [ ] Yes - I'll enable after deployment
  - [ ] No - I'll host elsewhere

---

## 💾 Backup & Recovery

### Before Starting
- [ ] **Backup existing data** (if re-deploying)
  - n8n workflows exported
  - Database backed up
  - Configuration files saved

- [ ] **Recovery plan**
  - Know how to restore from backup
  - Documented rollback procedure

---

## 🔧 Technical Verification

### Port Availability
Check if required ports are available:

```bash
# Check if port 5678 is free (for n8n)
lsof -i :5678
# Should show nothing if available

# For production, check 80 and 443
sudo lsof -i :80
sudo lsof -i :443
```

- [ ] Port 5678 available (local)
- [ ] Port 80 available (production)
- [ ] Port 443 available (production)

### Disk Space
```bash
df -h
# Ensure at least 10GB free
```

- [ ] Sufficient disk space (min 10GB free)

### Memory
```bash
free -h
# Ensure at least 1GB free
```

- [ ] Sufficient memory (min 1GB free)

---

## 📚 Documentation Review

### Read Before Deploying
- [ ] [DEPLOYMENT.md](./DEPLOYMENT.md) - Main deployment guide
- [ ] [README-n8n-setup.md](./README-n8n-setup.md) - n8n specific setup
- [ ] [QUICK-DEPLOY.md](./QUICK-DEPLOY.md) - Quick reference

### Have Handy
- [ ] [COPY-PASTE-COMMANDS.md](./COPY-PASTE-COMMANDS.md) - Command reference
- [ ] [DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md) - Status tracker

---

## 🎯 Deployment Mode Decision

### Choose Your Deployment Type

**Option 1: Local Development** (Recommended for testing)
- [ ] I want to deploy on localhost
- Pros: Quick, easy, no domain needed
- Cons: Not accessible from internet
- Command: `./deploy-complete.sh` → Choose option 1

**Option 2: Production with HTTPS** (For real use)
- [ ] I want to deploy with custom domain and SSL
- Pros: Professional, secure, accessible
- Cons: Requires domain, more complex
- Command: `./deploy-complete.sh` → Choose option 2

**Option 3: Custom/Manual**
- [ ] I want to configure everything manually
- For advanced users only

---

## ✅ Final Checks

### Before Running Deployment
- [ ] All required credentials collected
- [ ] System requirements met
- [ ] Documentation reviewed
- [ ] Backup plan in place
- [ ] Deployment mode decided
- [ ] Time allocated (15-30 minutes)

### Ready to Deploy?
If all checks above are complete:

```bash
# Make scripts executable
chmod +x deploy-complete.sh verify-deployment.sh

# Run deployment
./deploy-complete.sh
```

---

## 🚨 Common Pre-Deployment Issues

### Issue: Docker not installed
**Solution:**
```bash
./quick-setup.sh  # Will install Docker
```

### Issue: Port already in use
**Solution:**
```bash
# Find what's using the port
lsof -i :5678

# Kill the process or change port in .env
N8N_PORT=5679
```

### Issue: No domain for production
**Solution:**
- Start with local deployment first
- Register domain later
- Upgrade to production when ready

### Issue: Missing API keys
**Solution:**
- Can deploy without API keys
- Add credentials in n8n UI after deployment
- Or get keys before starting

---

## 📞 Need Help?

### Stuck on Pre-Flight?
1. Review the specific section above
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for details
3. Run verification: `./verify-deployment.sh`
4. Check documentation in [README.md](./README.md)

### Skip Verification?
**Not recommended**, but if you must:
```bash
# Deploy anyway (at your own risk)
./deploy-complete.sh
```

---

## 🎯 Next Steps

Once all checklist items are complete:

1. Run: `./deploy-complete.sh`
2. Follow interactive prompts
3. Complete n8n setup
4. Run: `./verify-deployment.sh`
5. Check: `cat DEPLOYMENT-STATUS.md`

---

**✅ All checks passed? Let's deploy!**

```bash
./deploy-complete.sh
```

---

**Last Updated:** December 2024
