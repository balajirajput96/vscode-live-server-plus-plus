# n8n Automation Setup (Docker)

## 🚀 Overview

This setup provides a complete n8n automation system integrated with the AI Career Automation features of Live Server++. It includes VPN capabilities, local AI processing, and high-performance queue-based execution.

## 🎯 System Components

- **Gluetun VPN**: Geo-switching capabilities for automated job applications
- **PostgreSQL**: Robust database for workflow and execution data
- **Redis**: High-performance queue system for scalable automation
- **Ollama**: Local AI server for privacy-focused AI operations
- **n8n**: Main automation platform with worker scaling

## 1️⃣ Prerequisites

### System Requirements
- Docker & Docker Compose installed
- At least 4GB RAM available
- 10GB free disk space
- Internet connection for initial setup

### VPN Account (Optional but Recommended)
- Surfshark account (or other supported VPN provider)
- VPN credentials for geo-switching features

## 2️⃣ Quick Start

### Step 1: Prepare Environment
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

### Step 2: Configure .env File
Set the following critical variables:
```bash
# Generate encryption key
N8N_ENCRYPTION_KEY=$(openssl rand -base64 32)

# VPN credentials (optional)
SURFSHARK_USER=your_username
SURFSHARK_PASSWORD=your_password

# Database password
POSTGRES_PASSWORD=secure_random_password
```

### Step 3: Start the System
```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f n8n
```

### Step 4: Access n8n
Open your browser and navigate to:
- **n8n Interface**: http://localhost:5678
- **Ollama API**: http://localhost:11434

## 3️⃣ Configuration Options

### Local Development (No HTTPS)
```bash
# Basic setup for local development
docker compose up -d
```

### Production Setup with HTTPS
For production deployment, update your .env:
```bash
DOMAIN=your-domain.com
EMAIL=your-email@domain.com
WEBHOOK_URL=https://your-domain.com/
N8N_SECURE_COOKIE=true
N8N_TRUST_PROXY=true
```

### VPN Configuration
Currently configured for Surfshark, but supports:
- Surfshark
- NordVPN
- ExpressVPN
- Custom OpenVPN configurations

## 4️⃣ Career Automation Workflows

### Pre-built Workflows Available
1. **LinkedIn Content Generation**
   - Auto-generate posts based on projects
   - Schedule content publication
   - Track engagement metrics

2. **Job Application Automation**
   - Monitor job boards
   - Auto-apply with customized applications
   - Track application status

3. **Portfolio Sync**
   - Auto-update GitHub repositories
   - Generate project documentation
   - Sync portfolio website content

4. **Social Media Management**
   - Cross-platform posting
   - Hashtag optimization
   - Engagement tracking

### Importing Workflows
```bash
# Place workflow files in ./workflows directory
mkdir -p workflows
# Copy your .json workflow files here
# They will be available in n8n for import
```

## 5️⃣ AI Integration

### Ollama Setup
The system includes Ollama for local AI processing:

```bash
# Connect to Ollama container
docker compose exec ollama ollama pull llama2

# Available models for career automation
docker compose exec ollama ollama pull codellama
docker compose exec ollama ollama pull mistral
```

### AI Model Usage in Workflows
- **Text Generation**: Resume summaries, cover letters
- **Code Analysis**: GitHub project documentation
- **Content Creation**: Social media posts, LinkedIn articles

## 6️⃣ Scaling and Performance

### Worker Scaling
Adjust worker count in docker-compose.yml:
```yaml
n8n-worker:
  deploy:
    replicas: 4  # Increase for more concurrent executions
```

### Resource Optimization
```bash
# Monitor resource usage
docker stats

# Adjust memory limits if needed
docker compose config
```

## 7️⃣ Monitoring and Maintenance

### Health Checks
```bash
# Check all services
docker compose ps

# Check n8n logs
docker compose logs -f n8n

# Check database health
docker compose exec postgres pg_isready
```

### Backup and Recovery
```bash
# Backup all data
docker compose down
docker run --rm -v n8n_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data

# Restore from backup
docker run --rm -v n8n_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /
```

## 8️⃣ Security Best Practices

### Essential Security Steps
1. **Change default passwords** in .env file
2. **Generate strong encryption key** for n8n
3. **Use VPN** for geo-sensitive operations
4. **Regular backups** of workflow data
5. **Network isolation** using Docker networks

### Network Security
```bash
# Check network isolation
docker network ls
docker network inspect vscode-live-server-plus-plus_n8n-stack
```

## 9️⃣ Troubleshooting

### Common Issues

**Issue**: n8n not starting
```bash
# Check logs
docker compose logs n8n

# Common fixes
docker compose down && docker compose up -d
```

**Issue**: Database connection errors
```bash
# Check PostgreSQL status
docker compose exec postgres pg_isready

# Reset database if needed
docker compose down -v postgres
docker compose up -d postgres
```

**Issue**: VPN connection problems
```bash
# Check Gluetun logs
docker compose logs gluetun

# Verify VPN credentials in .env
```

**Issue**: Worker not processing jobs
```bash
# Check worker logs
docker compose logs n8n-worker

# Restart workers
docker compose restart n8n-worker
```

### Performance Issues
```bash
# Monitor resource usage
docker stats

# Increase worker concurrency
# Edit docker-compose.yml worker command:
command: ["n8n", "worker", "--concurrency=5"]
```

## 🔧 Advanced Configuration

### Custom Workflows Directory
Mount your own workflows directory:
```yaml
volumes:
  - ./my-workflows:/data/workflows:ro
```

### Environment-specific Overrides
Create environment-specific compose files:
```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📊 Integration with VS Code Live Server++

This n8n setup integrates seamlessly with the VS Code Live Server++ extension:

1. **Automatic Workflow Sync**: Workflows sync with your portfolio projects
2. **Real-time Updates**: Career automation reflects in your Live Server++ dashboard
3. **AI-Powered Content**: Generated content appears in your portfolio automatically

## 🆘 Support and Resources

### Documentation Links
- [n8n Official Documentation](https://docs.n8n.io/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Ollama Documentation](https://ollama.ai/docs)

### Community and Support
- [n8n Community Forum](https://community.n8n.io/)
- [Live Server++ GitHub Issues](https://github.com/balajirajput96/vscode-live-server-plus-plus/issues)

---

## 🚀 Quick Commands Reference

```bash
# Start system
docker compose up -d

# Stop system
docker compose down

# Update to latest versions
docker compose pull && docker compose up -d

# View all logs
docker compose logs -f

# Access n8n
open http://localhost:5678

# Backup data
docker compose exec postgres pg_dump -U n8n n8n > backup.sql

# Reset everything (CAUTION: Deletes all data)
docker compose down -v && docker compose up -d
```

---

**Built with ❤️ for AI-Powered Career Automation**

*Last Updated: January 2024*
*Version: 1.0*
*Compatibility: Docker Compose v3.8+*