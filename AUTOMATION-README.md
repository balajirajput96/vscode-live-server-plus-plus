# 🤖 GitHub Automation System

This repository includes a complete GitHub-based automation system for managing workflows, health checks, backups, and deployments.

## 🚀 Quick Start

### 1. Setup Environment Variables
```bash
# Copy the template
cp .env.template .env

# Edit with your values
nano .env
```

### 2. Configure GitHub Secrets
Go to **Settings → Secrets and variables → Actions** and add:
- `GOOGLE_PRIMARY_EMAIL`
- `MS_PRIMARY_EMAIL`  
- `TAILSCALE_AUTHKEY`
- `OPENAI_API_KEY`
- `YOUTUBE_API_KEY`

### 3. Test the System
```bash
# Run health check
./scripts/comprehensive_health_check.sh

# Test backup system
./scripts/n8n_backup.sh incremental

# Initialize complete system
./scripts/super_start.sh
```

## 📁 Structure

```
.github/workflows/          # GitHub Actions workflows
├── daily-health-check.yml  # Automated health monitoring  
├── daily-backup.yml        # Automated backups
└── deployment.yml          # Deployment pipeline

scripts/                    # Automation scripts
├── comprehensive_health_check.sh  # System health verification
├── n8n_backup.sh                 # Backup automation
└── super_start.sh                # System initialization

.env.template              # Environment variables template
.env.example              # Example configuration
github-setup-guide.md     # Complete setup guide (Hindi)
```

## 🔄 Workflows

### Daily Health Check
- **Schedule**: Every day at 2:00 AM UTC
- **Manual**: Run workflow button
- **Function**: Comprehensive system monitoring

### Daily Backup  
- **Schedule**: Every day at 3:00 AM UTC
- **Manual**: Run workflow button with backup type selection
- **Function**: Backup configurations, workflows, and data

### Deployment Pipeline
- **Trigger**: Push to main/master or merged PR
- **Function**: Auto-deploy and run health checks

## 🛠️ Scripts

### Health Check (`comprehensive_health_check.sh`)
- System information gathering
- Environment variable validation
- Network connectivity testing
- Package dependency verification
- Git repository status
- Performance metrics

### Backup System (`n8n_backup.sh`)
- **Full backup**: Complete system backup
- **Incremental**: Changes since last backup
- **Config-only**: Configuration files only

### System Initialization (`super_start.sh`)
- Environment setup
- Dependency installation
- Directory structure creation
- Service simulation startup
- Health check execution

## 📊 Monitoring

### Health Metrics
- System uptime and performance
- API connectivity status  
- Package dependency health
- Git repository status
- Resource utilization

### Backup Verification
- Backup completion status
- File integrity checks
- Storage utilization
- Retention policy compliance

## 🚨 Troubleshooting

### Common Issues

**Scripts not executable:**
```bash
chmod +x scripts/*.sh
```

**Environment variables missing:**
```bash
# Check current environment
env | grep -E "(GOOGLE|MS|TAILSCALE|OPENAI|YOUTUBE)"

# Verify .env file
cat .env
```

**GitHub Actions failing:**
- Check secrets are properly configured
- Verify script syntax in workflow files
- Review Action logs for specific errors

### Manual Testing
```bash
# Test individual components
./scripts/comprehensive_health_check.sh
./scripts/n8n_backup.sh full
./scripts/super_start.sh

# Check created files
ls -la logs/ backups/ temp/
```

## 📚 Complete Documentation

For detailed setup instructions and advanced configuration, see:
- **[GitHub Setup Guide](./github-setup-guide.md)** - Complete Hindi guide
- **[Main README](./README.md)** - Project overview

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Description"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request
6. Automated deployment on merge

---

**Ready to automate? Follow the [GitHub Setup Guide](./github-setup-guide.md) for complete instructions!** 🎯