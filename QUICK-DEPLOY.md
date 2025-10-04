# ⚡ Quick Deploy Reference Card

**Fast reference for deploying the AI-Powered Career Automation System**

---

## 🚀 One-Command Deploy

```bash
./deploy-complete.sh
```

---

## 📦 Quick Setup Steps

### 1. Prerequisites (2 min)
```bash
# Verify Docker
docker --version

# Verify Docker Compose
docker-compose --version

# Start Docker daemon
sudo systemctl start docker
```

### 2. Environment Setup (1 min)
```bash
# Copy environment file
cp .env.example .env

# Edit credentials
nano .env
# Change: N8N_BASIC_AUTH_PASSWORD
```

### 3. Deploy n8n (2 min)
```bash
# Local development
docker-compose -f docker-compose.basic.yml up -d

# OR Production with HTTPS
docker-compose -f docker-compose.reverse-proxy.yml up -d
```

### 4. Verify (1 min)
```bash
# Run verification
./verify-deployment.sh

# Check health
curl http://localhost:5678/healthz
```

---

## 🔗 Quick Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| n8n Dashboard | http://localhost:5678 | See .env file |
| GitHub Pages | https://username.github.io/repo | Public |
| Career Dashboard | ./index.html | Local file |
| Job Tracker | ./Job_Tracking_System.html | Local file |

---

## 📋 Quick Commands

### Docker Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f n8n

# Restart
docker-compose restart n8n

# Check status
docker-compose ps
```

### n8n Operations
```bash
# Health check
curl http://localhost:5678/healthz

# Access dashboard
open http://localhost:5678

# Export workflows
docker exec n8n n8n export:workflow --all

# Import workflows
# Use web interface: Workflows → Import
```

### Monitoring
```bash
# System status
./monitor-automation.sh

# Container stats
docker stats n8n

# View recent logs
docker-compose logs --tail=50 n8n

# Follow logs live
docker-compose logs -f n8n
```

---

## 🔧 Quick Fixes

### n8n Not Starting
```bash
# Check logs
docker-compose logs n8n

# Restart
docker-compose restart n8n

# Full reset
docker-compose down
docker-compose up -d
```

### Port Already in Use
```bash
# Find process using port 5678
sudo lsof -i :5678
# OR
sudo netstat -tulpn | grep 5678

# Kill process or change port in .env
```

### Cannot Access n8n
```bash
# Check if running
docker ps | grep n8n

# Check health
curl http://localhost:5678/healthz

# Check firewall
sudo ufw status
sudo ufw allow 5678
```

### Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
# OR
newgrp docker
```

---

## 📊 Quick Health Check

```bash
# All-in-one health check
curl http://localhost:5678/healthz && \
docker ps | grep n8n && \
echo "✅ System healthy"
```

---

## 🎯 Quick Configuration

### Essential n8n Settings
1. **Timezone**: Asia/Kolkata (or your timezone)
2. **Authentication**: Basic Auth enabled
3. **Webhooks**: http://localhost:5678
4. **Executions**: Save all (for debugging)

### Essential API Keys (in n8n)
- [ ] OpenAI API (required)
- [ ] Gmail OAuth (optional)
- [ ] Google Drive OAuth (optional)
- [ ] Buffer API (optional)
- [ ] GitHub PAT (optional)

### Essential Workflows
1. Social media automation
2. Email automation
3. Content generation
4. Job tracking
5. GitHub automation

---

## 📚 Quick Links

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Deployment Summary](./DEPLOYMENT-SUMMARY.md)
- [Status Tracker](./DEPLOYMENT-STATUS.md)
- [n8n Setup Guide](./README-n8n-setup.md)
- [Project README](./README.md)

---

## 🆘 Quick Support

### Common Issues
1. **503 Error**: n8n still starting, wait 30s
2. **401 Error**: Wrong credentials, check .env
3. **Connection Refused**: Docker not running
4. **Port Conflict**: Change port in .env

### Get Help
- Check documentation files
- Run `./verify-deployment.sh`
- Review logs: `docker-compose logs`
- GitHub Issues: Open a ticket

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Prerequisites Check | 2 min |
| Environment Setup | 1 min |
| Deploy n8n | 2 min |
| Verify Deployment | 1 min |
| Import Workflows | 5 min |
| Configure APIs | 10 min |
| Test Workflows | 5 min |
| **Total** | **~25 min** |

---

## 🎉 Success Checklist

- [ ] Docker running
- [ ] n8n accessible at http://localhost:5678
- [ ] Login successful
- [ ] Workflows imported
- [ ] API keys configured
- [ ] Test workflow executed
- [ ] No errors in logs

---

**Quick Deploy Reference Card v1.0**  
**Last Updated:** December 2024
