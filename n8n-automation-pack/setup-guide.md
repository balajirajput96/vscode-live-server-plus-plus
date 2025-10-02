# 🛠️ AI Automation Pack Setup Guide

**Complete step-by-step setup instructions for your AI-powered career automation system**

---

## 📋 Prerequisites

### Required Accounts:
- ✅ **n8n Account** (Free/Paid)
- ✅ **OpenAI Account** (API access)
- ✅ **Google Account** (Sheets API)
- ✅ **Buffer Account** (Social media)
- ✅ **Predis AI Account** (Image generation)

### Technical Requirements:
- ✅ Stable internet connection
- ✅ Modern web browser
- ✅ Basic understanding of APIs
- ✅ 2-3 hours for initial setup

---

## 1️⃣ n8n Setup

### Option A: n8n Cloud (Recommended)
```bash
1. Go to: https://n8n.cloud
2. Create account → Choose plan
3. Access your workspace
4. Import workflow JSON
```

### Option B: Self-Hosted n8n
```bash
# Install via Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access at: http://localhost:5678
```

### Import Workflow:
1. Open n8n workspace
2. Click "Import" button
3. Select `n8n-workflow.json` file
4. Workflow will appear in your workspace

---

## 2️⃣ API Credentials Setup

### OpenAI API Configuration

#### Step 1: Get API Key
```bash
1. Visit: https://platform.openai.com
2. Login → API Keys section
3. Create new secret key
4. Copy and save securely
```

#### Step 2: Configure in n8n
```bash
1. Open workflow → OpenAI node
2. Add credentials
3. Paste API key
4. Test connection
```

### Google Sheets API Setup

#### Step 1: Enable API
```bash
1. Go to: https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google Sheets API
4. Create service account
5. Download JSON credentials
```

#### Step 2: Configure in n8n
```bash
1. n8n → Credentials → Google Sheets OAuth2
2. Upload service account JSON
3. Test connection with sample sheet
```

### Buffer API Configuration

#### Step 1: Get Access Token
```bash
1. Visit: https://buffer.com/developers
2. Login → My Apps
3. Create new app
4. Get access token
```

#### Step 2: Connect Social Accounts
```bash
1. Connect LinkedIn profile
2. Connect Facebook page
3. Note profile IDs for workflow
```

### Predis AI Setup

#### Step 1: Get API Access
```bash
1. Sign up at: https://predis.ai
2. Go to API section
3. Generate API key
4. Note usage limits
```

#### Step 2: Configure in Workflow
```bash
1. Open HTTP Request node
2. Add authorization header
3. Update API key
4. Test image generation
```

---

## 3️⃣ Google Sheets Preparation

### Create Master Sheet

#### Sheet 1: Projects
```
Column A: Project (Text)
Column B: Description (Text)
Column C: Tools (Text)
Column D: Results (Text)

Sample Data:
| Project | Description | Tools | Results |
|---------|-------------|-------|---------|
| Protein Analysis | Drug target identification using machine learning | Python, Pandas, Scikit-learn | Identified 5 potential targets with 85% accuracy |
| Clinical Data Mining | Patient response prediction model | R, SQL, ggplot2 | Created model with 78% prediction accuracy |
```

#### Sheet 2: Analytics
```
Column A: Date (Date)
Column B: Project (Text)
Column C: Action (Text)
Column D: Platform (Text)
Column E: Status (Text)

Headers:
Date | Project | Action | Platform | Status
```

#### Sheet 3: Content Calendar
```
Column A: Week (Date)
Column B: Project (Text)
Column C: Content Type (Text)
Column D: Status (Text)
Column E: Notes (Text)
```

### Share Sheet with n8n
```bash
1. Click "Share" button
2. Add service account email
3. Give "Editor" permissions
4. Copy sheet ID from URL
5. Update workflow with sheet ID
```

---

## 4️⃣ Workflow Configuration

### Update Credentials in Each Node:

#### 1. Google Sheets Nodes
```json
{
  "sheetId": "YOUR_ACTUAL_SHEET_ID",
  "credentials": "YOUR_GOOGLE_CREDENTIALS_NAME"
}
```

#### 2. OpenAI Node
```json
{
  "credentials": "YOUR_OPENAI_CREDENTIALS_NAME",
  "model": "gpt-4"
}
```

#### 3. Buffer Nodes
```json
{
  "headers": {
    "Authorization": "Bearer YOUR_BUFFER_TOKEN"
  },
  "body": {
    "profile_ids": ["YOUR_LINKEDIN_ID", "YOUR_FACEBOOK_ID"]
  }
}
```

#### 4. Predis AI Node
```json
{
  "headers": {
    "Authorization": "Bearer YOUR_PREDIS_API_KEY"
  }
}
```

---

## 5️⃣ Testing & Validation

### Test Individual Nodes:

#### 1. Test Google Sheets Connection
```bash
1. Right-click "Get Next Project" node
2. Click "Execute Node"
3. Verify data is retrieved
4. Check JSON output format
```

#### 2. Test OpenAI Content Generation
```bash
1. Execute "ChatGPT Generate Content" node
2. Review generated social media posts
3. Ensure quality and relevance
4. Adjust prompt if needed
```

#### 3. Test Image Generation
```bash
1. Execute "Predis AI Generate Image" node
2. Check image URL is generated
3. Verify image quality
4. Test different prompts
```

#### 4. Test Social Media Posting
```bash
1. Execute Buffer nodes (one at a time)
2. Check posts are scheduled
3. Verify content and images
4. Monitor for any errors
```

### Full Workflow Test:
```bash
1. Execute entire workflow manually
2. Monitor each node execution
3. Check final outputs
4. Verify posts are scheduled
5. Confirm analytics logging
```

---

## 6️⃣ Scheduling & Automation

### Set Up Cron Trigger:
```bash
1. Open "Weekly Trigger" node
2. Configure timing:
   - Mode: "Every Week"
   - Weekday: Monday (1)
   - Hour: 9
   - Minute: 0
   - Timezone: Asia/Kolkata
3. Save and activate workflow
```

### Monitor Execution:
```bash
1. Check "Executions" tab in n8n
2. Monitor success/failure rates
3. Review error logs
4. Set up email notifications
```

---

## 7️⃣ Customization Options

### Content Personalization:

#### Modify OpenAI Prompts:
```
Current prompt:
"Create a LinkedIn and Facebook post based on this project..."

Customization options:
- Add your writing style preferences
- Include specific industry keywords
- Adjust tone and formality
- Add personal branding elements
```

#### Image Generation Customization:
```json
{
  "prompt": "Professional biotechnology [YOUR_STYLE] featuring [PROJECT_TYPE]. Clean, modern, [YOUR_COLORS] suitable for social media.",
  "style": "corporate/modern/creative",
  "size": "1080x1080/1200x628"
}
```

### Platform-Specific Optimization:

#### LinkedIn Posts:
- Professional tone
- Industry-specific hashtags
- Technical details emphasis
- Career growth focus

#### Facebook Posts:
- More casual tone
- Personal learning journey
- Broader audience appeal
- Visual content emphasis

---

## 8️⃣ Advanced Configuration

### Error Handling:
```bash
1. Add "If" nodes for error conditions
2. Set up retry logic for API failures
3. Configure fallback content
4. Add email notifications for failures
```

### Content Variations:
```bash
1. Create multiple content templates
2. Add randomization logic
3. Rotate between different styles
4. A/B test different approaches
```

### Analytics Integration:
```bash
1. Add Google Analytics tracking
2. Monitor social media metrics
3. Track portfolio website traffic
4. Measure conversion rates
```

---

## 9️⃣ Maintenance & Monitoring

### Weekly Tasks:
- ✅ Review generated content quality
- ✅ Update project database
- ✅ Check API usage limits
- ✅ Monitor social media engagement

### Monthly Tasks:
- ✅ Analyze performance metrics
- ✅ Update content templates
- ✅ Refresh API credentials
- ✅ Optimize workflow efficiency

### Quarterly Tasks:
- ✅ Review and update automation strategy
- ✅ Explore new AI tools and integrations
- ✅ Assess ROI and career impact
- ✅ Plan workflow expansions

---

## 🔟 Troubleshooting

### Common Issues & Solutions:

#### "Google Sheets Access Denied"
```bash
Solution:
1. Check service account permissions
2. Verify sheet sharing settings
3. Confirm sheet ID is correct
4. Re-generate credentials if needed
```

#### "OpenAI Rate Limit Exceeded"
```bash
Solution:
1. Check API usage limits
2. Add delay between requests
3. Upgrade to paid plan
4. Implement rate limiting logic
```

#### "Buffer Authentication Failed"
```bash
Solution:
1. Re-authorize social media accounts
2. Check access token validity
3. Verify profile IDs are correct
4. Update Buffer app permissions
```

#### "Workflow Not Triggering"
```bash
Solution:
1. Check cron expression syntax
2. Verify timezone settings
3. Ensure workflow is activated
4. Review execution history for errors
```

#### "Poor Content Quality"
```bash
Solution:
1. Refine OpenAI prompts
2. Add more context to inputs
3. Implement content review process
4. Train custom AI models
```

---

## 📊 Performance Optimization

### Speed Improvements:
- Use parallel node execution
- Optimize API call frequency
- Cache repeated data requests
- Minimize data transfers

### Cost Optimization:
- Monitor API usage patterns
- Use appropriate AI model tiers
- Implement smart caching
- Optimize image generation calls

### Quality Improvements:
- A/B test different prompts
- Analyze engagement metrics
- Implement feedback loops
- Continuously refine content

---

## 📱 Mobile Management

### Monitor on Mobile:
- n8n mobile app for execution monitoring
- Buffer mobile app for post management
- Google Sheets mobile for data updates
- Social media apps for engagement tracking

### Mobile Optimization:
- Ensure generated content is mobile-friendly
- Optimize images for mobile viewing
- Use mobile-appropriate hashtags
- Test content appearance on mobile

---

## 🚀 Success Metrics

### Track These KPIs:
- **Automation Reliability**: 95%+ successful executions
- **Content Quality**: Engagement rate > 3%
- **Time Savings**: 90% reduction in manual posting
- **Professional Growth**: 20% increase in profile views

### Monthly Reports:
- Posts generated and published
- Social media engagement metrics
- Portfolio website traffic
- Professional network growth

---

## 📞 Support Resources

### Documentation:
- n8n official documentation
- OpenAI API documentation
- Buffer API documentation
- Google Sheets API guides

### Community Support:
- n8n Community Forum
- Reddit automation communities
- LinkedIn AI/automation groups
- Discord servers for developers

### Professional Support:
- n8n paid support plans
- Freelance automation consultants
- AI prompt engineering services
- Social media management experts

---

**🎯 Setup Complete! Your AI automation system is ready to accelerate your biotech career.**

---

*Setup Time: 2-3 hours*  
*Maintenance: 15 minutes/week*  
*ROI: Significant time savings + professional growth*