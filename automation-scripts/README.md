# 🤖 Personal Automation Scripts Collection

यह directory में सभी automation scripts हैं जो आपको complete personal automation setup करने में help करती हैं।

## 📂 Directory Structure

```
automation-scripts/
├── 📄 gmail-automation.gs          # Google Apps Script - Gmail automation
├── 📄 youtube-analytics.gs         # Google Apps Script - YouTube analytics
├── 📁 n8n-workflows/              # n8n workflow templates
│   ├── 📄 README.md               # n8n workflows guide
│   ├── 📄 youtube-crosspost-workflow.json
│   ├── 📄 email-task-workflow.json
│   └── 📄 social-analytics-workflow.json
└── 📄 README.md                   # This file
```

## 🚀 Quick Start

### 1. **Google Apps Script Setup (मुफ्त)**

#### Gmail Automation
```javascript
// 1. Go to https://script.google.com
// 2. Create new project: "Gmail Automation"
// 3. Copy code from gmail-automation.gs
// 4. Run setupEmailAutomation() function
```

**Features:**
- ✅ Auto-organize emails by category
- ✅ Smart reply suggestions
- ✅ Bill and shopping email detection
- ✅ Work email classification

#### YouTube Analytics
```javascript
// 1. Enable YouTube Data API v3
// 2. Copy code from youtube-analytics.gs  
// 3. Run setupYouTubeAutomation() function
```

**Features:**
- ✅ Daily analytics reports
- ✅ Trending topics research
- ✅ WhatsApp notifications
- ✅ Google Sheets dashboard

### 2. **n8n Workflows Setup**

```bash
# Start n8n locally
./quick-setup.sh

# Access dashboard
http://localhost:5678

# Import workflows
# Go to automation-scripts/n8n-workflows/
# Import JSON files via n8n dashboard
```

## 📊 Available Automations

### Email & Communication
| Script | Purpose | Platform | Setup Time |
|--------|---------|----------|------------|
| Gmail Auto-Sort | Organize emails automatically | Google Apps Script | 5 min |
| Smart Replies | AI-powered email responses | Google Apps Script | 3 min |
| WhatsApp Notifications | Important alerts to phone | n8n + API | 10 min |

### Social Media & Content
| Script | Purpose | Platform | Setup Time |
|--------|---------|----------|------------|
| YouTube Cross-Post | Auto-share videos to all platforms | n8n | 15 min |
| Content Calendar | Schedule posts across platforms | n8n | 10 min |
| Analytics Dashboard | Track all social media metrics | Google Sheets | 8 min |

### Personal Productivity
| Script | Purpose | Platform | Setup Time |
|--------|---------|----------|------------|
| Calendar Automation | Meeting prep and reminders | Google Apps Script | 5 min |
| Task Management | Email to task conversion | n8n | 12 min |
| Financial Tracking | Bill reminders and expense tracking | Google Sheets | 10 min |

### YouTube Channel Management
| Script | Purpose | Platform | Setup Time |
|--------|---------|----------|------------|
| Analytics Reports | Daily performance reports | Google Apps Script | 8 min |
| Trending Research | Auto-research trending topics | n8n | 15 min |
| Comment Moderation | Auto-moderate and respond | n8n + AI | 20 min |

## 🛠️ Setup Instructions

### Prerequisites
- Google Account (मुफ्त)
- GitHub Student Pack (optional, but recommended)
- Basic computer knowledge

### Step 1: Google Apps Script (मुफ्त शुरुआत)
```bash
# 1. Open browser
https://script.google.com

# 2. Create new project
New Project → Name: "Personal Automation"

# 3. Copy our scripts
# Copy gmail-automation.gs content
# Paste in Code.gs file

# 4. Save and run
Ctrl+S → Run setupEmailAutomation
```

### Step 2: n8n Setup (Digital Ocean Credits)
```bash
# 1. Clone this repository
git clone https://github.com/your-username/ai-career-automation-system.git
cd ai-career-automation-system

# 2. Run quick setup
./quick-setup.sh

# 3. Choose option 1 (Local) या 2 (Production)
# Follow on-screen instructions

# 4. Access n8n
http://localhost:5678
```

### Step 3: Import Workflows
```bash
# 1. Access n8n dashboard
# 2. Click "Import workflow"
# 3. Upload JSON files from n8n-workflows/
# 4. Configure credentials
# 5. Activate workflows
```

## 📋 Configuration Guides

### Gmail Automation Configuration
```javascript
// Edit these settings in gmail-automation.gs
var workDomains = ['company.com', 'organization.org']; // आपकी company domains
var billKeywords = ['bill', 'invoice', 'payment']; // Bill detection keywords
var shoppingSites = ['amazon', 'flipkart', 'myntra']; // Shopping sites
```

### YouTube Analytics Configuration
```javascript
// Edit these settings in youtube-analytics.gs
var whatsappApiUrl = 'YOUR_WHATSAPP_API_URL'; // WhatsApp API endpoint
var phoneNumber = 'YOUR_PHONE_NUMBER'; // आपका phone number
```

### n8n Workflows Configuration
```json
// Edit these in workflow JSON files
"YOUR_GOOGLE_SHEET_ID": "1234567890abcdef", // आपकी Google Sheet ID
"your-email@example.com": "आपका@email.com", // Notification email
"YOUR_WHATSAPP_API_URL": "आपका WhatsApp API URL"
```

## 🔐 API Keys और Credentials

### Required APIs (सभी मुफ्त तक एक limit)
| API | Purpose | Free Limit | Setup Link |
|-----|---------|------------|------------|
| YouTube Data API v3 | Channel analytics | 10,000 units/day | https://console.developers.google.com |
| Gmail API | Email automation | 250 quota units/user/second | https://console.developers.google.com |
| Google Sheets API | Data storage | 300 requests/minute | https://console.developers.google.com |
| LinkedIn API | Professional posting | 500 requests/day | https://developer.linkedin.com |
| Twitter API v2 | Tweet automation | 300 tweets/month (free) | https://developer.twitter.com |

### Optional APIs (Advanced features)
| API | Purpose | Cost | Setup Link |
|-----|---------|------|------------|
| WhatsApp Business API | Phone notifications | $0.005/message | https://business.whatsapp.com |
| OpenAI API | AI content generation | $0.002/1K tokens | https://platform.openai.com |
| Telegram Bot API | Alternative notifications | Free | https://core.telegram.org/bots |

## 📱 Mobile Access

### Access Your Automation
```bash
# n8n Mobile Browser Access
https://your-domain.com

# Google Apps Script Trigger
# Runs automatically on phone/computer

# Monitoring via Phone
# WhatsApp notifications
# Email reports
# Telegram alerts
```

## 🐛 Troubleshooting

### Common Issues

**Gmail script not working:**
```javascript
// Solution 1: Enable Gmail API
// Go to console.developers.google.com
// Enable Gmail API

// Solution 2: Check permissions
// Allow script to access Gmail
// Approve authorization
```

**n8n not starting:**
```bash
# Check Docker status
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

**YouTube API quota exceeded:**
```javascript
// Solution: Optimize requests
// Use caching for frequent data
// Implement rate limiting
// Consider Analytics API for larger quotas
```

### Debug Mode
```bash
# Enable detailed logging
export N8N_LOG_LEVEL=debug

# Check Google Apps Script logs
// In script editor: View → Logs
```

## 📈 Performance Monitoring

### Track Your Success
- ⏰ **Time Saved**: Target 2-3 hours/day
- 🤖 **Tasks Automated**: Target 50+ daily tasks  
- 📊 **Error Reduction**: Target 90% fewer manual errors
- 📈 **Growth Metrics**: Social media engagement, email organization

### Monitoring Tools
```bash
# System monitoring
./monitor-automation.sh

# Google Apps Script monitoring
// Execution transcript in Apps Script
// Email error notifications

# n8n monitoring  
// Execution logs in dashboard
// Webhook status monitoring
```

## 🎯 Success Stories

### Before Automation
- ❌ 2 hours daily on email organization
- ❌ Manual social media posting
- ❌ Missing important deadlines
- ❌ Inconsistent content creation

### After Automation
- ✅ 15 minutes daily email management
- ✅ Automatic cross-platform posting
- ✅ AI-powered deadline tracking
- ✅ Consistent content calendar

## 🔗 Related Resources

### Documentation
- [Complete Personal Automation Guide](../Complete_Personal_Automation_Guide.md)
- [n8n Official Documentation](https://docs.n8n.io)
- [Google Apps Script Guides](https://developers.google.com/apps-script)

### Community
- [n8n Community Forum](https://community.n8n.io)
- [Google Apps Script Community](https://developers.google.com/apps-script/community)
- [Automation Reddit Communities](https://reddit.com/r/automation)

### Video Tutorials
- YouTube: "n8n automation tutorials"
- YouTube: "Google Apps Script for beginners"
- YouTube: "Personal automation workflows"

---

## 🚀 Quick Actions

### Today (अभी करें):
- [ ] Open script.google.com
- [ ] Copy gmail-automation.gs
- [ ] Set up email organization
- [ ] Test with 5 emails

### This Week:
- [ ] Setup n8n locally
- [ ] Import YouTube workflow
- [ ] Configure social media accounts
- [ ] Create first automated post

### This Month:
- [ ] Build personal assistant bot
- [ ] Set up comprehensive monitoring
- [ ] Create advanced workflows
- [ ] Share your success story

**🎉 Ready to automate your life? Start with Google Apps Script और 15 मिनट में देखें magic!**