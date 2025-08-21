# 🤖 n8n Workflow Templates for Personal Automation

This directory contains ready-to-use n8n workflow templates for complete personal automation.

## 📋 Available Workflows

### 1. **YouTube to Social Media Cross-Posting**
**File**: `youtube-crosspost-workflow.json`
**Purpose**: Automatically share new YouTube videos across all social platforms
**Triggers**: New YouTube video published
**Actions**: Post to LinkedIn, Facebook, Twitter with customized content

### 2. **Email to Task Management**
**File**: `email-task-workflow.json`  
**Purpose**: Convert important emails into tasks automatically
**Triggers**: New email with specific keywords
**Actions**: Create tasks in Notion/Todoist, set reminders

### 3. **Social Media Analytics Aggregator**
**File**: `social-analytics-workflow.json`
**Purpose**: Collect analytics from all platforms into one dashboard
**Triggers**: Daily at 9 AM
**Actions**: Fetch data from YouTube, LinkedIn, Twitter, save to Google Sheets

### 4. **Content Research Pipeline**
**File**: `content-research-workflow.json`
**Purpose**: Automatically research and suggest content topics
**Triggers**: Weekly on Monday
**Actions**: Scrape trending topics, analyze keywords, generate content ideas

### 5. **Job Application Tracker**
**File**: `job-tracker-workflow.json`
**Purpose**: Track job applications and follow-ups automatically
**Triggers**: New email from job boards
**Actions**: Extract job details, update tracking sheet, set follow-up reminders

## 🚀 How to Use These Workflows

### Step 1: Import Workflow
1. Open your n8n instance
2. Click "Add workflow" → "Import from file"
3. Select the JSON file you want to import
4. Click "Import"

### Step 2: Configure Credentials
1. Set up API credentials for each service:
   - YouTube Data API
   - LinkedIn API
   - Twitter API
   - Google Sheets API
   - Notion API (if using)

### Step 3: Customize Settings
1. Update webhook URLs
2. Modify content templates
3. Set your preferred scheduling times
4. Test each workflow

### Step 4: Activate
1. Click "Active" toggle for each workflow
2. Monitor execution logs
3. Adjust as needed

## 🔧 Workflow Descriptions

### YouTube Cross-Posting Workflow

**Trigger**: Webhook from YouTube (or RSS feed check)
**Flow**:
```
YouTube Video Published
↓
Extract video metadata (title, description, tags)
↓
Generate platform-specific content:
  • LinkedIn: Professional post with insights
  • Facebook: Personal update with video link
  • Twitter: Thread with key takeaways
↓
Schedule posts at optimal times
↓
Log success/failure to Google Sheets
```

**Required APIs**:
- YouTube Data API v3
- LinkedIn Pages API
- Facebook Graph API
- Twitter API v2

### Email Task Workflow

**Trigger**: Gmail webhook or IMAP check
**Flow**:
```
New Email Received
↓
Filter by keywords: "urgent", "deadline", "action required"
↓
Extract task details using AI/regex
↓
Create task in preferred app:
  • Notion: Database entry
  • Todoist: New task
  • Google Tasks: Add to list
↓
Set reminder based on urgency
↓
Send confirmation email/notification
```

**Required APIs**:
- Gmail API
- Notion API / Todoist API
- Google Calendar API (for reminders)

### Social Analytics Workflow

**Trigger**: Daily schedule (9 AM)
**Flow**:
```
Scheduled Trigger (Daily 9 AM)
↓
Fetch analytics from all platforms:
  • YouTube: Views, likes, comments, subscribers
  • LinkedIn: Profile views, post engagement
  • Twitter: Followers, engagement rate
↓
Calculate performance metrics
↓
Update Google Sheets dashboard
↓
Generate weekly/monthly reports
↓
Send summary email with insights
```

**Required APIs**:
- YouTube Analytics API
- LinkedIn Analytics API
- Twitter Analytics API
- Google Sheets API

## 📊 Sample Workflow Configurations

### Optimal Posting Times (IST)
- **LinkedIn**: Tuesday 9 AM, Thursday 2 PM
- **Facebook**: Monday 6 PM, Wednesday 8 PM  
- **Twitter**: Tuesday 11 AM, Friday 3 PM
- **YouTube**: Saturday 7 PM, Sunday 6 PM

### Content Templates

#### LinkedIn Post Template
```
🚀 Just published a new video: {{youtube.title}}

{{youtube.description | truncate(200)}}

Key insights:
• [Auto-extracted point 1]
• [Auto-extracted point 2]  
• [Auto-extracted point 3]

What's your take on this topic? Let me know in the comments!

#{{hashtags}} #Content #LinkedIn

Watch here: {{youtube.url}}
```

#### Twitter Thread Template
```
🧵 Thread: {{youtube.title}}

1/{{thread_count}} {{first_tweet_content}}

2/{{thread_count}} {{key_point_1}}

3/{{thread_count}} {{key_point_2}}

{{thread_count}}/{{thread_count}} Full video: {{youtube.url}}

#{{hashtags}}
```

## 🔐 Security Best Practices

### API Key Management
- Store all API keys in n8n credentials store
- Use environment variables for sensitive data
- Rotate keys monthly
- Limit API permissions to minimum required

### Webhook Security
- Use HTTPS for all webhooks
- Implement signature verification
- Add rate limiting
- Monitor for suspicious activity

### Data Privacy
- Encrypt sensitive data in transit
- Implement data retention policies
- Regular security audits
- Comply with GDPR/privacy laws

## 🐛 Troubleshooting

### Common Issues

**Workflow not triggering**:
- Check webhook URL configuration
- Verify API credentials
- Review trigger settings
- Check n8n logs

**API rate limits exceeded**:
- Implement exponential backoff
- Add delays between requests
- Use bulk operations where possible
- Monitor API usage

**Content not posting**:
- Verify account permissions
- Check content formatting
- Review platform posting limits
- Test with manual execution

### Debugging Steps
1. Enable debug mode in n8n
2. Check execution logs for errors
3. Test each node individually
4. Verify API responses
5. Check network connectivity

## 📈 Performance Optimization

### Workflow Efficiency
- Use HTTP request batching
- Implement caching for frequent requests
- Optimize trigger frequency
- Remove unnecessary nodes

### Resource Management
- Monitor CPU and memory usage
- Set reasonable timeouts
- Implement error handling
- Use webhook triggers over polling

### Scaling Considerations
- Distribute workflows across multiple instances
- Use external databases for large datasets
- Implement queue systems for high volume
- Monitor and alert on failures

## 🎯 Advanced Features

### AI Integration
- OpenAI API for content generation
- Claude API for text analysis
- Stability AI for image generation
- Speech-to-text for video transcription

### Multi-Agent Systems
- Content research agent
- Writing agent
- Editing agent
- Publishing agent
- Analytics agent

### Custom Nodes
- Create custom n8n nodes for specific APIs
- Build integrations with local services
- Develop specialized data processors
- Share with community

---

**💡 Pro Tip**: Start with simple workflows and gradually add complexity. Test thoroughly before activating production workflows.

**🔗 Need Help?** Check the [Complete Personal Automation Guide](../Complete_Personal_Automation_Guide.md) for detailed setup instructions.