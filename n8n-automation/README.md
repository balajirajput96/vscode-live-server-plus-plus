# n8n Career Automation System

Complete n8n automation setup for biotech career management with Docker, webhooks, tunnels, and CLI integration.

## 🚀 Quick Start

### One-Command Setup
```bash
cd n8n-automation
./setup.sh
```

This will:
- ✅ Check prerequisites (Docker, Docker Compose)
- ✅ Create environment configuration
- ✅ Build custom n8n image with bioinformatics tools
- ✅ Start n8n service
- ✅ Set up basic automation workflows
- ✅ Configure webhooks and tunnels

### Access Points
- **n8n Editor**: http://localhost:5678
- **Health Check**: http://localhost:5678/healthz
- **Webhook Base**: http://localhost:5678/webhook/

## 📋 Features

### 🐳 Docker Integration
- **Custom n8n Image**: Pre-installed with Python, scientific libraries, and automation tools
- **Data Persistence**: Docker volumes for workflow and execution data
- **Health Monitoring**: Built-in health checks and monitoring
- **Easy Scaling**: Docker Compose for multi-service deployments

### 🔗 Webhook Automation
- **LinkedIn Post Generation**: `/webhook/linkedin-post`
- **Job Search Automation**: `/webhook/job-search`
- **Portfolio Updates**: `/webhook/portfolio-update`
- **GitHub Sync**: `/webhook/github-sync`

### 🌐 Tunnel & External Access
- **Ngrok Integration**: Automatic tunnel setup for external webhooks
- **Reverse Proxy**: Nginx configuration for HTTPS and domain mapping
- **Environment Variables**: Easy configuration for different deployment scenarios

### 🛠️ CLI Management
```bash
# Check status
./scripts/n8n-cli.py status

# List workflows
./scripts/n8n-cli.py workflows

# Trigger career automation
./scripts/n8n-cli.py career linkedin_post "My Project"

# Activate workflow
./scripts/n8n-cli.py activate workflow-id
```

## 📁 Project Structure

```
n8n-automation/
├── Dockerfile                 # Custom n8n image
├── docker-compose.yml        # Multi-service orchestration
├── setup.sh                  # One-command setup script
├── .env.template             # Environment configuration template
├── workflows/                # Pre-built automation workflows
│   ├── linkedin_post_automation.json
│   ├── job_search_automation.json
│   └── portfolio_automation.json
├── scripts/                  # CLI and automation scripts
│   └── n8n-cli.py           # Python CLI for n8n management
├── config/                   # Configuration files
│   └── nginx.conf           # Reverse proxy configuration
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Basic Configuration
N8N_HOST=localhost
N8N_PROTOCOL=http
TIMEZONE=Asia/Kolkata
WEBHOOK_URL=http://localhost:5678/

# Tunnel Configuration
NGROK_AUTHTOKEN=your_ngrok_token

# API Keys
OPENAI_API_KEY=your_openai_key
LINKEDIN_API_KEY=your_linkedin_key
GITHUB_TOKEN=your_github_token

# Career Automation
TARGET_COMPANIES=Sun Pharma,Zydus Cadila,Dr. Reddy's
JOB_SEARCH_KEYWORDS=bioinformatics,data analysis,python
```

### Webhook URLs
Configure these in external services to trigger automation:

- **LinkedIn Post**: `http://localhost:5678/webhook/linkedin-post`
- **Job Search**: `http://localhost:5678/webhook/job-search`
- **Portfolio Update**: `http://localhost:5678/webhook/portfolio-update`

## 🚀 Usage Examples

### 1. Generate LinkedIn Post
```bash
curl -X POST http://localhost:5678/webhook/linkedin-post \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Gene Expression Analysis",
    "skills": "Python, Pandas, Bioinformatics",
    "description": "Analyzed breast cancer gene expression data"
  }'
```

### 2. Automated Job Search
```bash
curl -X POST http://localhost:5678/webhook/job-search \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "bioinformatics,data scientist",
    "companies": "Sun Pharma,Biocon,Cipla",
    "location": "Bangalore"
  }'
```

### 3. Portfolio Update
```bash
curl -X POST http://localhost:5678/webhook/portfolio-update \
  -H "Content-Type: application/json" \
  -d '{
    "action": "add_project",
    "project": {
      "name": "COVID-19 Variant Analysis",
      "description": "Genomic analysis of SARS-CoV-2 variants",
      "tools": ["Python", "BioPython", "Matplotlib"],
      "dataset": "GISAID Database"
    },
    "github_repo": "https://github.com/username/covid-analysis"
  }'
```

## 🛠️ Management Commands

### Setup & Control
```bash
# Initial setup
./setup.sh

# Start services
./setup.sh start

# Stop services
./setup.sh stop

# View logs
./setup.sh logs

# Update n8n
./setup.sh update

# Access CLI
./setup.sh cli
```

### Advanced Features
```bash
# Enable tunnel for external access
./setup.sh tunnel

# Enable reverse proxy with HTTPS
./setup.sh proxy

# Check service status
./setup.sh status
```

## 🔧 Custom Workflows

### Creating New Workflows
1. Use the n8n editor at http://localhost:5678
2. Create your workflow with the visual editor
3. Export the workflow JSON
4. Place it in the `workflows/` directory
5. Restart the service to load the new workflow

### Workflow Templates Included
- **LinkedIn Post Automation**: Generates professional posts from project data
- **Job Search Automation**: Searches jobs and generates application messages
- **Portfolio Automation**: Updates GitHub README and portfolio website

## 🌐 Production Deployment

### With Custom Domain
1. Update `.env` with your domain:
```bash
N8N_HOST=n8n.yourdomain.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.yourdomain.com/
```

2. Configure SSL certificates in `config/ssl/`
3. Enable proxy service:
```bash
./setup.sh proxy
```

### With Ngrok Tunnel
1. Get Ngrok auth token from https://dashboard.ngrok.com
2. Update `.env`:
```bash
NGROK_AUTHTOKEN=your_token_here
```
3. Start tunnel:
```bash
./setup.sh tunnel
```

## 📊 Monitoring & Analytics

### Health Checks
- **n8n Health**: http://localhost:5678/healthz
- **Docker Status**: `docker-compose ps`
- **Service Logs**: `docker-compose logs -f n8n`

### Workflow Monitoring
```bash
# View recent executions
./scripts/n8n-cli.py executions --limit 20

# Check specific workflow
./scripts/n8n-cli.py executions --workflow-id workflow-id
```

## 🔒 Security Considerations

### Production Checklist
- [ ] Change default ports
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure firewall rules
- [ ] Set up authentication (n8n supports OAuth, LDAP)
- [ ] Use Docker secrets for sensitive data
- [ ] Regular backup of workflows and data

### Environment Security
- Store API keys in `.env` file (never commit to git)
- Use Docker secrets for production deployments
- Enable n8n authentication for public access
- Configure CORS and webhook security

## 🚨 Troubleshooting

### Common Issues

#### n8n Not Starting
```bash
# Check Docker service
docker-compose ps

# View logs
docker-compose logs n8n

# Restart service
docker-compose restart n8n
```

#### Webhook Not Responding
```bash
# Test webhook directly
curl -X POST http://localhost:5678/webhook/test

# Check n8n logs
docker-compose logs -f n8n

# Verify workflow is active
./scripts/n8n-cli.py workflows
```

#### Tunnel Connection Issues
```bash
# Check Ngrok configuration
docker-compose logs ngrok

# Verify auth token
echo $NGROK_AUTHTOKEN

# Restart tunnel
docker-compose restart ngrok
```

### Debug Mode
Enable debug logging by adding to `.env`:
```bash
N8N_LOG_LEVEL=debug
```

## 📚 Career Automation Workflows

### LinkedIn Automation
- **Frequency**: 3x per week
- **Content Types**: Project showcases, skill highlights, industry insights
- **Trigger**: Webhook or scheduled execution
- **Output**: Professional LinkedIn posts with hashtags

### Job Search Automation
- **Frequency**: Daily
- **Sources**: Company career pages, job boards
- **Filters**: Keywords, location, company preferences
- **Output**: Qualified job listings with application templates

### Portfolio Maintenance
- **Frequency**: Weekly
- **Actions**: GitHub README updates, website content generation
- **Integration**: GitHub API, portfolio website webhooks
- **Output**: Updated documentation and project showcases

## 🎯 Success Metrics

Track these KPIs through n8n execution data:
- **LinkedIn Engagement**: Post reach, likes, comments
- **Job Applications**: Applications sent, response rate
- **Portfolio Traffic**: GitHub views, website visitors
- **Network Growth**: New connections, follower increase

## 🆘 Support & Community

### Documentation
- [n8n Official Docs](https://docs.n8n.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Webhook Testing Tools](https://webhook.site/)

### Getting Help
1. Check the troubleshooting section above
2. Review n8n logs for error messages
3. Test individual workflow nodes
4. Validate webhook endpoints with curl

## 📄 License

This automation system is provided under the MIT License. Feel free to customize and extend for your career automation needs.

---

**🎯 Ready to automate your biotech career? Start with `./setup.sh` and watch your professional presence grow!**