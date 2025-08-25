# 🚀 Complete n8n Career Automation Setup Guide

## 📋 Overview
This guide will help you set up a complete career automation system using n8n, designed specifically for biotechnology professionals transitioning to bioinformatics and data analysis roles.

## 🎯 What This System Does

### Automated Workflows
1. **Weekly Content Generation**: Automatically generates LinkedIn posts and social media content
2. **Job Application Tracking**: Tracks applications and sends follow-up reminders
3. **Analytics Dashboard**: Monitors your career progress and metrics
4. **Networking Automation**: Helps manage LinkedIn connections and outreach
5. **LinkedIn Networking**: Automated follow-up reminders and strategy planning

### Key Benefits
- ⏰ **Time Saving**: Automates repetitive tasks
- 📊 **Data-Driven**: Tracks all your career activities
- 🎯 **Consistent**: Maintains regular posting and follow-up schedule
- 🚀 **Scalable**: Grows with your career development needs

---

## 🛠️ Prerequisites

### Required Accounts
1. **Google Account** - For Google Sheets integration
2. **Gmail Account** - For email automation
3. **OpenAI Account** - For content generation (optional)
4. **LinkedIn Account** - For professional networking
5. **Domain Name** - For production deployment (optional)

### Technical Requirements
- Docker and Docker Compose installed
- Basic command line knowledge
- Text editor for configuration files

---

## 📁 Project Structure

```
career-automation-system/
├── .env.example                     # Environment variables template
├── docker-compose.basic.yml         # Local development setup
├── docker-compose.reverse-proxy.yml # Production setup with HTTPS
├── Caddyfile                        # Reverse proxy configuration
├── README-n8n-setup.md             # This setup guide
├── workflows/                       # n8n workflow templates
│   ├── weekly-content-generation.json
│   ├── job-application-tracking.json
│   ├── analytics-dashboard.json
│   └── linkedin-networking-automation.json
├── career-automation-system/        # Documentation and action plans
│   └── ACTION_PLAN.md
└── portfolio-automation-system/     # Templates and prompts
    ├── templates/
    └── prompts/
```

---

## 🚀 Quick Start (Local Development)

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd vscode-live-server-plus-plus

# Copy environment file
cp .env.example .env

# Generate encryption key
openssl rand -base64 32
```

### Step 2: Configure Environment
Edit `.env` file with your settings:
```env
N8N_ENCRYPTION_KEY=your-generated-encryption-key
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

### Step 3: Start n8n
```bash
# Start local development server
docker compose --env-file .env -f docker-compose.basic.yml up -d

# Check if running
docker ps
```

### Step 4: Access n8n
1. Open http://localhost:5678
2. Create your admin account
3. Import workflow templates from `workflows/` directory

---

## 🔧 Production Setup (with HTTPS)

### Step 1: Domain Configuration
1. Purchase a domain name
2. Point DNS A record to your server IP
3. Update `.env` file:
```env
DOMAIN=your-domain.com
EMAIL=your-email@example.com
WEBHOOK_URL=https://your-domain.com/
```

### Step 2: Deploy with HTTPS
```bash
# Start production setup
docker compose --env-file .env -f docker-compose.reverse-proxy.yml up -d

# Check logs
docker compose logs -f
```

### Step 3: Verify Setup
1. Access https://your-domain.com
2. SSL certificate should be automatically generated
3. All traffic will be encrypted

---

## 📊 Google Sheets Integration

### Step 1: Create Google Sheets
Create these sheets in your Google Drive:
1. **Job Application Tracker**
2. **Content Calendar** 
3. **Analytics Dashboard**
4. **Networking Log**

### Step 2: Sheet Templates

#### Job Application Tracker Columns:
```
Date Applied | Company Name | Position | Application URL | Status | Follow-up Date | Notes
```

#### Content Calendar Columns:
```
Date | Content Type | Platform | Content | Status | Engagement | Notes
```

### Step 3: Get Sheet IDs
1. Open each Google Sheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
3. Update workflow files with your Sheet IDs

### Step 4: Service Account Setup
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create service account and download JSON key
5. Share your Google Sheets with service account email

---

## 🤖 Workflow Configuration

### 1. Weekly Content Generation
**File**: `workflows/weekly-content-generation.json`

**Configuration**:
- Runs every Monday at 9 AM
- Generates 5 LinkedIn post ideas
- Creates 2 complete posts
- Saves to Google Sheets
- Sends email notification

**Setup**:
1. Import workflow in n8n
2. Configure OpenAI API key (if using)
3. Update Google Sheets document ID
4. Test the workflow

### 2. Job Application Tracking
**File**: `workflows/job-application-tracking.json`

**Configuration**:
- Webhook endpoint for new applications
- Automatic tracking in Google Sheets
- Follow-up reminders after 7 days
- Email notifications

**Setup**:
1. Import workflow in n8n
2. Update Google Sheets document ID
3. Configure email settings
4. Note webhook URL for job applications

### 3. Usage Examples

#### Track New Job Application
```bash
curl -X POST http://localhost:5678/webhook/job-application \\
  -H "Content-Type: application/json" \\
  -d '{
    "company": "Sun Pharma",
    "position": "Bioinformatics Analyst",
    "url": "https://company.com/careers/job123"
  }'
```

---

## 📱 Mobile Integration

For on-the-go career management, see the comprehensive [Mobile Integration Guide](MOBILE_INTEGRATION.md).

### Quick Mobile Features:
- **Browser Bookmarklets**: One-click job application tracking
- **Mobile Web App**: Responsive interface for all devices
- **iOS Shortcuts**: Native integration with iOS
- **Offline Sync**: Work without internet, sync when connected
- **PWA Support**: Install as mobile app

---

## 📱 Mobile Integration

### Browser Bookmarklet for Job Applications
```javascript
javascript:(function(){
  var company = prompt("Company Name:");
  var position = prompt("Position:");
  var url = window.location.href;
  
  fetch('YOUR_WEBHOOK_URL', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({company, position, url})
  }).then(() => alert('Application tracked!'));
})();
```

Save this as a bookmark for quick job application tracking.

---

## 📈 Analytics and Monitoring

### Key Metrics to Track
1. **Job Applications**: Number per week, response rate
2. **Content Performance**: Engagement rates, reach
3. **Network Growth**: New connections, interactions
4. **Skill Development**: Courses completed, certifications

### Weekly Review Process
1. Check Google Sheets dashboards
2. Review automation performance
3. Adjust strategies based on data
4. Plan next week's activities

---

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env` files to version control
- Use strong encryption keys
- Regularly rotate API keys

### Access Control
- Use service accounts for API access
- Limit permissions to minimum required
- Enable 2FA on all accounts

### Data Backup
- Regular Google Sheets backups
- Export n8n workflows periodically
- Document configuration changes

---

## 🐛 Troubleshooting

### Common Issues

#### n8n Won't Start
```bash
# Check logs
docker compose logs n8n

# Common solutions
docker compose down
docker compose up -d
```

#### Webhook Not Working
1. Check firewall settings
2. Verify webhook URL in workflow
3. Test with curl command

#### Google Sheets Connection Failed
1. Verify service account setup
2. Check sheet permissions
3. Confirm API is enabled

### Debug Mode
```bash
# Start with debug logging
N8N_LOG_LEVEL=debug docker compose up
```

---

## 🚀 Advanced Features

### Custom Workflow Ideas
1. **LinkedIn Auto-commenting**: Automatically engage with industry posts
2. **Company Research**: Gather information about target companies
3. **Interview Prep**: Generate custom interview questions
4. **Skill Gap Analysis**: Track required vs current skills

### Integration Options
- **Zapier**: For additional app connections
- **IFTTT**: Simple automation tasks
- **GitHub Actions**: Code-related automations
- **Slack/Discord**: Team notifications

---

## 📚 Additional Resources

### Learning Materials
- [n8n Documentation](https://docs.n8n.io/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [LinkedIn API](https://docs.microsoft.com/en-us/linkedin/)

### Community Support
- [n8n Community](https://community.n8n.io/)
- [Career Automation GitHub](https://github.com/your-repo)

---

## 📞 Support

### Getting Help
1. Check troubleshooting section above
2. Review n8n community forums
3. Create GitHub issues for bugs
4. Join Discord for real-time help

### Contributing
1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Document changes

---

## 🎯 Next Steps

After completing this setup:

1. **Week 1**: Import and test all workflows
2. **Week 2**: Customize workflows for your needs
3. **Week 3**: Add advanced integrations
4. **Week 4**: Create custom workflows
5. **Ongoing**: Monitor, optimize, and expand

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**🚀 Ready to automate your career journey? Let's get started!**

*For detailed career strategies and daily action plans, see the [complete career automation guide](career-automation-system/ACTION_PLAN.md).*