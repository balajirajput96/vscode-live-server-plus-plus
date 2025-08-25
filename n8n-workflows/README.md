# 🤖 n8n + Perplexity AI Pro Workflows

This directory contains ready-to-import n8n workflows that integrate with Perplexity AI Pro for automated research and content generation.

## 📁 Workflow Files

### 1. `perplexity-research-automation.json`
**Purpose**: Weekly automated industry research and report generation
**Trigger**: Every Monday at 9:00 AM
**Features**:
- Researches biotechnology and bioinformatics trends
- Generates formatted reports with citations
- Saves to Google Sheets for tracking
- Sends HTML email reports to balaji.web.design1@gmail.com
- Creates LinkedIn content based on research

**Setup Requirements**:
- Perplexity API credentials
- Google Sheets API access
- SMTP email configuration

### 2. `perplexity-content-generator.json`
**Purpose**: On-demand content generation via webhook
**Trigger**: HTTP webhook endpoint
**Features**:
- Generates content for various platforms (LinkedIn, blog posts, etc.)
- Customizable topic, tone, and target audience
- Returns formatted JSON response
- Logs all generated content to Google Sheets

**Usage**:
```bash
curl -X POST https://your-n8n-domain/webhook/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Latest trends in pharmaceutical data analysis",
    "content_type": "linkedin_post",
    "target_audience": "Bioinformatics professionals",
    "tone": "professional_engaging"
  }'
```

## ⚙️ Import Instructions

1. **Access n8n Web Interface**
   ```bash
   # If running locally
   open http://localhost:5678
   
   # If using domain setup
   open https://your-domain.com
   ```

2. **Import Workflows**
   - Click "+" to create new workflow
   - Click "..." menu → "Import from file"
   - Select the JSON file from this directory
   - Save the imported workflow

3. **Configure Credentials**
   Before activating workflows, set up these credentials:

   **Perplexity API Auth**:
   - Type: HTTP Header Auth
   - Name: `perplexity-auth`
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_PERPLEXITY_API_KEY`

   **Google Sheets OAuth2** (if using Google Sheets nodes):
   - Type: Google Sheets OAuth2 API
   - Follow Google OAuth2 setup process

   **SMTP Email** (if using email nodes):
   - Type: SMTP
   - Configure with your email provider settings

4. **Update Configuration**
   - Replace placeholder values (Google Sheet IDs, email addresses)
   - Customize research topics and content parameters
   - Test each workflow before activating

## 🔧 Customization Options

### Research Topics
Edit the `Set Research Data` node to modify research focus:
```javascript
{
  "research_topics": "Your custom topics here",
  "email": "balaji.web.design1@gmail.com"
}
```

### Content Parameters
Modify the content generator webhook parameters:
- `content_type`: linkedin_post, blog_article, twitter_thread, etc.
- `topic`: Any research topic or industry focus
- `target_audience`: Specify your audience
- `tone`: professional, casual, academic, engaging, etc.

### Scheduling
Change the cron expression in Schedule Trigger nodes:
- `0 9 * * 1` = Every Monday at 9 AM
- `0 18 * * *` = Every day at 6 PM
- `0 9 * * 1,3,5` = Monday, Wednesday, Friday at 9 AM

## 📊 Expected Outputs

### Research Automation
- **Google Sheets**: Research data with citations and metrics
- **Email Report**: Formatted HTML report with insights
- **LinkedIn Content**: Ready-to-post social media content

### Content Generator
- **JSON Response**: Formatted content with metadata
- **Google Sheets Log**: Content generation history
- **Citations**: Source links for fact-checking

## 🚨 Troubleshooting

### Common Issues

1. **API Authentication Errors**
   ```
   Error: 401 Unauthorized
   Solution: Check Perplexity API key in credentials
   ```

2. **Google Sheets Access Denied**
   ```
   Error: 403 Forbidden
   Solution: Verify OAuth2 setup and sheet permissions
   ```

3. **Webhook Not Triggering**
   ```
   Error: Webhook URL not found
   Solution: Activate workflow and check webhook URL
   ```

4. **Content Generation Timeout**
   ```
   Error: Request timeout
   Solution: Reduce max_tokens or increase timeout settings
   ```

### Testing Workflows

1. **Manual Test**
   - Use "Execute Workflow" button in n8n interface
   - Check each node output for errors

2. **Webhook Test**
   ```bash
   # Test content generator
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"topic": "test topic"}'
   ```

3. **Schedule Test**
   - Temporarily change cron to trigger in next few minutes
   - Monitor execution in n8n workflow history

## 📈 Performance Tips

1. **Rate Limiting**
   - Add delays between multiple API calls
   - Monitor Perplexity usage limits

2. **Error Handling**
   - Use Try/Catch nodes for robust workflows
   - Set up error notifications

3. **Resource Management**
   - Archive old research data periodically
   - Monitor n8n server resources

## 🔒 Security Notes

- Never commit API keys to version control
- Use n8n environment variables for sensitive data
- Regularly rotate API credentials
- Monitor workflow execution logs for security issues

## 📞 Support

For workflow-specific issues:
- Check n8n execution history for error details
- Review Perplexity API documentation
- Contact: balaji.web.design1@gmail.com

---

**🚀 Ready to automate your research and content with AI-powered workflows!**