# 🚀 Quick Deployment Reference Card

## One-Command Deployment

### 🚀 Cloud Deployment (Fastest - 30 seconds)
```bash
./deploy-to-cloud.sh
# Choose: Railway, Render, Vercel, or Netlify
```

### 🐳 Docker Deployment (Full Control)
```bash
./deploy-complete.sh
```

---

## 🎯 Deployment Options

### Option 1: One-Click Cloud Deployment ⚡ (Recommended)
```bash
./deploy-to-cloud.sh
# Interactive menu:
# 1) Railway (n8n + full stack) - 30 sec
# 2) Render (n8n + static) - 2 min
# 3) Vercel (static only) - 1 min
# 4) Netlify (static only) - 1 min
```
**See**: [CLOUD-DEPLOYMENT.md](./CLOUD-DEPLOYMENT.md)

### Option 2: Complete Automated Docker Deployment
```bash
chmod +x deploy-complete.sh
./deploy-complete.sh
# Follow interactive prompts
```

### Option 3: Quick Setup (Beginner Friendly)
```bash
chmod +x quick-setup.sh
./quick-setup.sh
# Choose: 1 for Local Dev, 2 for Production
```

### Option 4: Manual Step-by-Step
```bash
# 1. Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# 2. Deploy n8n locally
docker-compose --env-file .env -f docker-compose.basic.yml up -d

# 3. Access n8n
open http://localhost:5678
```

---

## ✅ Quick Verification
```bash
./verify-deployment.sh
```

---

## 📊 Check Status
```bash
# View status dashboard
cat DEPLOYMENT-STATUS.md

# Check running containers
docker ps

# View n8n logs
docker-compose logs -f

# Test n8n health
curl http://localhost:5678/healthz
```

---

## 🔧 Common Commands

### Start Services
```bash
docker-compose --env-file .env -f docker-compose.basic.yml up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
docker-compose logs -f n8n
```

### Monitor System
```bash
./monitor-automation.sh
```

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Complete deployment guide |
| [DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md) | Status dashboard & checklist |
| [README-n8n-setup.md](./README-n8n-setup.md) | n8n specific setup |
| [COPY-PASTE-COMMANDS.md](./COPY-PASTE-COMMANDS.md) | Ready-to-use commands |

---

## 🆘 Need Help?

### Troubleshooting
```bash
# 1. Check logs
docker-compose logs -f

# 2. Verify configuration
cat .env

# 3. Run verification
./verify-deployment.sh

# 4. Restart services
docker-compose restart
```

### Common Issues

**n8n not starting:**
```bash
docker-compose logs n8n
# Check port conflicts, verify .env settings
```

**Port already in use:**
```bash
# Change N8N_PORT in .env
N8N_PORT=5679
```

**Docker not installed:**
```bash
./quick-setup.sh
# Choose option 1 or 2
```

---

## 🎯 Deployment Checklist

- [ ] Run `./deploy-complete.sh`
- [ ] Access n8n at http://localhost:5678
- [ ] Complete first-time setup
- [ ] Import workflows
- [ ] Configure API credentials
- [ ] Test webhook
- [ ] Enable GitHub Pages
- [ ] Add GitHub secrets
- [ ] Run verification: `./verify-deployment.sh`

---

## 📱 Quick Access URLs

**Local Development:**
- n8n: http://localhost:5678
- GitHub Pages: https://username.github.io/repo-name

**Production:**
- n8n: https://your-domain.com
- GitHub Pages: https://username.github.io/repo-name

---

## 🔐 Security Checklist

- [ ] Changed default n8n password
- [ ] Generated encryption key
- [ ] Secured webhook URLs
- [ ] Added GitHub secrets
- [ ] Enabled HTTPS (production)
- [ ] Configured firewall rules

---

## 📈 Status at a Glance

Run to update:
```bash
./verify-deployment.sh
```

---

**Last Updated:** [Auto-updated on verification]

**Quick Start:** `./deploy-complete.sh` 🚀
