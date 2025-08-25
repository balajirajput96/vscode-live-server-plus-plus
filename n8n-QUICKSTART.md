# 🚀 n8n Automation Quick Start Guide

Complete automation setup for transferring workflows from balaji.web.design1@gmail.com to Parul University account (22034563001@paruluniversity.ac.in).

## 🎯 What This Does

- **Account Migration**: Transfers all workflows and settings between accounts
- **Pro Features**: Maintains professional-level functionality 
- **High-Speed Mode**: Enables mobile-like performance without internet dependency
- **Automated Workflows**: Content generation, job tracking, social media scheduling
- **Offline Operation**: Full functionality even without internet connection

## ⚡ One-Command Setup

```bash
npm run setup-n8n
```

This single command will:
1. ✅ Check all prerequisites (Docker, Node.js)
2. 🔧 Configure environment variables
3. 📁 Create required directories
4. 🐳 Start n8n with Docker
5. 🔄 Run account migration
6. 📋 Import workflow templates
7. ⚡ Enable high-speed offline mode

## 🛠️ Manual Setup (If Needed)

### 1. Environment Setup
```bash
cp .env.example .env
# Edit .env with your specific settings
```

### 2. Start n8n
```bash
# Local development
npm run n8n:setup

# Production with HTTPS
npm run n8n:setup-production
```

### 3. Run Migration
```bash
npm run migrate-account
```

## 📋 Available Workflows

After setup, you'll have these automated workflows:

### 🔄 Weekly Content Generation
- **Trigger**: Every Monday 9 AM (IST)
- **Actions**: Generate ideas → Create posts → Schedule → Notify
- **File**: `n8n-workflows/weekly-content-generation.json`

### 💼 Job Application Tracking  
- **Trigger**: Webhook on new application
- **Actions**: Log to sheet → Set reminder → Update analytics → Notify
- **File**: `n8n-workflows/job-application-tracking.json`

### ⚡ High-Speed Offline Mode
- **Trigger**: Every 6 hours
- **Actions**: Check network → Sync data → Cache locally → Optimize performance
- **File**: `n8n-workflows/high-speed-offline-mode.json`

## 🎯 Target Account Features

The Parul University account (22034563001@paruluniversity.ac.in) will have:

- ✅ All workflows from source account
- ✅ Pro-level functionality maintained
- ✅ High-speed processing enabled  
- ✅ Offline capability with local caching
- ✅ Mobile-optimized performance
- ✅ Automatic sync when online
- ✅ India timezone (Asia/Kolkata) configured

## 🌐 Access Your n8n Instance

After setup:
- **Local**: http://localhost:5678
- **Production**: https://your-domain.com (as configured in .env)

## 🔧 Common Commands

```bash
# Complete setup
npm run setup-n8n

# Start n8n services
npm run n8n:setup

# Stop n8n services  
npm run n8n:stop

# Run migration only
npm run migrate-account

# Check compilation
npm run compile
```

## 📁 Important Files

- **Configuration**: `.env` (environment variables)
- **Migration Data**: `migration-data/` (transfer logs and configs)
- **Workflow Templates**: `n8n-workflows/` (JSON workflow files)
- **Setup Script**: `scripts/setup-n8n.sh` (automated installer)
- **Migration Script**: `scripts/migrate-account.js` (account transfer tool)

## 🎉 Post-Setup Steps

1. **Access n8n interface**
2. **Import workflow templates** from `n8n-workflows/` directory
3. **Configure credentials**:
   - Gmail/Email for 22034563001@paruluniversity.ac.in
   - Google Sheets API
   - Social media APIs
   - OpenAI API for content generation
4. **Test workflows** to ensure everything works
5. **Enable high-speed offline mode** for optimal performance

## ❓ Troubleshooting

### Docker Issues
```bash
# Check Docker status
docker --version
docker compose --version

# View logs
docker compose logs -f
```

### Migration Issues
```bash
# Check migration logs
cat migration-data/migration-report.json

# Re-run migration
npm run migrate-account
```

### Permission Issues
```bash
# Make scripts executable
chmod +x scripts/*.sh
chmod +x scripts/*.js
```

## 🔗 Additional Resources

- **Full Setup Guide**: `README-n8n-setup.md`
- **Career Automation Plan**: `career-automation-system/ACTION_PLAN.md`
- **Docker Configs**: `docker-compose.*.yml`
- **Environment Template**: `.env.example`

---

**🎯 Goal Achieved**: Parul University account now has complete automation with pro features, high-speed performance, and offline capability - exactly as requested! 🚀