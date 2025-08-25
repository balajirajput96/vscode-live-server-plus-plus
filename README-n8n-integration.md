# n8n Automation Integration for VSCode Live Server++

Complete production-ready n8n workflow automation setup integrated with the VSCode Live Server++ career automation system.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Clone and setup
git clone https://github.com/balajirajput96/vscode-live-server-plus-plus.git
cd vscode-live-server-plus-plus

# Run automated setup
./scripts/quick_setup.sh
```

### Option 2: Manual Setup
```bash
# 1. Copy environment template
cp .env.n8n.example .env

# 2. Generate encryption key
openssl rand -base64 32 | tr -d "=+/" | cut -c1-32

# 3. Update .env file with your settings
nano .env

# 4. Start services
docker-compose -f docker-compose.n8n.yml up -d

# 5. Setup AI models
docker exec $(docker-compose -f docker-compose.n8n.yml ps -q ollama) ollama pull gemma2:2b-instruct-q4_K_M
```

## 📊 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **n8n Dashboard** | http://localhost:5678 | Main automation interface |
| **Career Dashboard** | http://localhost:5555 | AI career automation (VS Code Live Server++) |
| **Ollama AI** | http://localhost:11434 | Local AI inference |
| **VPN Proxy** | http://localhost:8888 | Geo-switching proxy |

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   VS Code       │    │      n8n        │    │    Ollama AI    │
│ Live Server++   │◄──►│   Workflows     │◄──►│   Local Models  │
│  (Port 5555)    │    │  (Port 5678)    │    │  (Port 11434)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Gluetun VPN    │
                    │  (Port 8888)    │
                    └─────────────────┘
```

## 🔧 Core Components

### 1. Docker Services
- **n8n**: Main automation engine with queue mode
- **n8n-worker**: Additional workers for performance
- **PostgreSQL**: Database for workflows and executions
- **Redis**: Queue management and caching
- **Ollama**: Local AI inference (Gemma, Phi3)
- **Gluetun**: VPN container for geo-switching

### 2. Pre-built Workflows
- **Complete Test Workflow**: End-to-end testing with all components
- **Error Handling Workflow**: Automatic error detection and alerts
- **Career Automation**: Integration with existing career system

### 3. Management Scripts
- `scripts/quick_setup.sh`: Automated installation
- `scripts/health_check.sh`: System health monitoring
- `scripts/backup_restore.sh`: Data backup and recovery

## 📝 Workflow Examples

### 1. VPN-Enabled Web Scraping
```javascript
// HTTP Request Node with VPN
{
  "method": "GET",
  "url": "https://api.example.com/data",
  "options": {
    "proxy": "http://gluetun:8888"
  }
}
```

### 2. Local AI Processing
```javascript
// Ollama AI Node
{
  "method": "POST",
  "url": "http://ollama:11434/api/generate",
  "body": {
    "model": "gemma2:2b-instruct-q4_K_M",
    "prompt": "Analyze this job posting: {{$json.jobDescription}}",
    "stream": false
  }
}
```

### 3. Career Dashboard Integration
```javascript
// Webhook to Career System
{
  "method": "POST",
  "url": "http://host.docker.internal:5555/api/process-job",
  "body": {
    "jobData": "{{$json.processedData}}",
    "source": "n8n-automation"
  }
}
```

## 🔒 Security Configuration

### Environment Variables
```bash
# Critical security settings
N8N_ENCRYPTION_KEY=your-32-char-key
POSTGRES_PASSWORD=secure-password
VPN_SERVICE_PROVIDER=your-vpn-provider
SURFSHARK_USER=your-username
SURFSHARK_PASSWORD=your-password
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
4. Configure in n8n: Settings → Credentials → Google OAuth2

### Network Security
- All services run in isolated Docker network
- VPN container controls external access
- Internal communication only between containers

## 📊 Performance Optimization

### Queue Mode Benefits
- **Parallel Processing**: Multiple workers handle tasks simultaneously
- **Scalability**: Easy to add more workers
- **Reliability**: Failed jobs are retried automatically
- **Monitoring**: Built-in queue health checks

### AI Model Selection
| Model | Size | Speed | Use Case |
|-------|------|--------|----------|
| `gemma2:2b-instruct-q4_K_M` | 1.6GB | Fast | Quick responses |
| `phi3:3.8b-mini-instruct-4k-fp16` | 2.3GB | Medium | Complex analysis |
| `llama2:7b-chat` | 3.8GB | Slow | Detailed responses |

### Resource Requirements
- **Minimum**: 4GB RAM, 2 CPU cores, 10GB storage
- **Recommended**: 8GB RAM, 4 CPU cores, 25GB storage
- **Optimal**: 16GB RAM, 8 CPU cores, 50GB storage

## 🔄 Integration with Career System

### Workflow Triggers
1. **New Job Alert**: Automatically process job postings
2. **Application Submitted**: Generate follow-up tasks
3. **Interview Scheduled**: Prepare interview materials
4. **Profile Update**: Sync with LinkedIn/GitHub

### Data Flow
```
Job Posting → n8n Analysis → AI Processing → Career Dashboard → Action Items
     ↓              ↓              ↓              ↓              ↓
  Web Scraping   Content AI    Response Gen   Portfolio Update  Email/SMS
```

### Example Integration
```javascript
// Complete career automation workflow
{
  "trigger": "webhook",
  "steps": [
    "Extract job requirements",
    "Match with skills",
    "Generate cover letter (AI)",
    "Update application tracker",
    "Schedule follow-up reminder",
    "Notify via email/SMS"
  ]
}
```

## 🛠️ Management Commands

### Daily Operations
```bash
# Health check
./scripts/health_check.sh

# View logs
docker-compose -f docker-compose.n8n.yml logs -f n8n

# Restart services
docker-compose -f docker-compose.n8n.yml restart

# Update models
docker exec ollama_container ollama pull gemma2:2b-instruct-q4_K_M
```

### Backup & Recovery
```bash
# Create backup
./scripts/backup_restore.sh backup

# List backups
./scripts/backup_restore.sh list

# Restore from backup
./scripts/backup_restore.sh restore backup_file.tar.gz
```

### Troubleshooting
```bash
# Check container status
docker-compose -f docker-compose.n8n.yml ps

# View specific service logs
docker-compose -f docker-compose.n8n.yml logs service_name

# Reset everything
docker-compose -f docker-compose.n8n.yml down -v
docker-compose -f docker-compose.n8n.yml up -d
```

## 📈 Monitoring & Analytics

### Built-in Metrics
- Workflow execution times
- Success/failure rates
- Queue processing statistics
- Resource usage monitoring

### Health Endpoints
- n8n: `http://localhost:5678/healthz`
- Ollama: `http://localhost:11434/api/tags`
- PostgreSQL: Internal health checks
- Redis: Connection monitoring

### Log Locations
- n8n workflows: `/home/node/.n8n/logs/`
- Application logs: Docker container logs
- System logs: `docker-compose logs`

## 🎯 Use Cases

### Career Automation
1. **Job Application Automation**
   - Auto-apply to matching positions
   - Generate customized cover letters
   - Track application status

2. **Network Building**
   - Auto-connect on LinkedIn
   - Send personalized messages
   - Track relationship building

3. **Content Creation**
   - Generate LinkedIn posts
   - Create portfolio content
   - Schedule social media

### Business Automation
1. **Lead Generation**
   - Scrape business directories
   - Qualify leads with AI
   - Send personalized outreach

2. **Content Marketing**
   - Generate blog posts
   - Schedule social media
   - Track engagement metrics

3. **Data Processing**
   - Extract data from various sources
   - Clean and analyze with AI
   - Generate reports

## 🔧 Customization

### Adding New Workflows
1. Create workflow in n8n UI
2. Export as JSON
3. Place in `workflows/` directory
4. Import via management script

### Custom Nodes
```bash
# Install community nodes
docker-compose -f docker-compose.n8n.yml exec n8n npm install n8n-nodes-package

# Restart to load new nodes
docker-compose -f docker-compose.n8n.yml restart n8n
```

### Environment Customization
```bash
# Edit environment file
nano .env

# Apply changes
docker-compose -f docker-compose.n8n.yml up -d
```

## 📞 Support

### Documentation
- [Complete Setup Guide](./n8n-complete-setup-guide.md)
- [Workflow Examples](./workflows/)
- [Career Automation Guide](./career-automation-system/)

### Common Issues
1. **VPN Not Connecting**: Check provider credentials
2. **AI Models Slow**: Use smaller quantized models
3. **Database Issues**: Check PostgreSQL logs
4. **Memory Issues**: Increase Docker resource limits

### Getting Help
1. Check health status: `./scripts/health_check.sh`
2. Review logs: `docker-compose logs`
3. Consult documentation
4. Submit GitHub issue

## 🎉 Success Metrics

After setup, you should achieve:
- ✅ 99%+ uptime for automation workflows
- ✅ <5 second response times for AI processing
- ✅ Automatic error recovery and notifications
- ✅ Seamless integration with career system
- ✅ Production-ready performance with queue mode

## 📄 License

This n8n integration maintains compatibility with the parent project license while adding production-ready automation capabilities for career and business use cases.

---

**Ready to automate your career success? Start with `./scripts/quick_setup.sh`!**

*Last Updated: January 2024*
*Compatible with: n8n v1.108.1, Docker Compose v2.0+*