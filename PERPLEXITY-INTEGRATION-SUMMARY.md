# 🎯 Quick Start: n8n + Perplexity AI Pro Integration

## ✅ What's Been Configured

### 1. n8n Version Update
- **Updated from**: v1.82.1 → **v1.108.1**
- **Email configured**: balaji.web.design1@gmail.com
- **Environment**: Ready for Perplexity API integration

### 2. Perplexity AI Pro Integration
- **API Configuration**: Added to `.env.example`
- **Account**: Configured for balaji.web.design1@gmail.com
- **Documentation**: Complete setup guide created

### 3. Ready-to-Use Workflows
Two n8n workflows created and tested:

#### 🔄 **Weekly Research Automation** (`perplexity-research-automation.json`)
- **Runs**: Every Monday at 9:00 AM
- **Does**: 
  - Researches biotechnology/bioinformatics trends
  - Generates detailed reports with citations
  - Emails reports to balaji.web.design1@gmail.com
  - Creates LinkedIn content suggestions
  - Saves everything to Google Sheets

#### 🎨 **On-Demand Content Generator** (`perplexity-content-generator.json`)
- **Trigger**: HTTP webhook
- **Does**:
  - Generates content for any topic/platform
  - Returns formatted JSON response
  - Logs all activity to Google Sheets
  - Perfect for LinkedIn posts, blog articles, etc.

## 🚀 How to Get Started (5 minutes)

### Step 1: Setup Environment
```bash
# Copy the configured environment file
cp .env.example .env

# Edit .env and add your Perplexity API key
# Replace: PERPLEXITY_API_KEY=your_perplexity_pro_api_key_here
# With: PERPLEXITY_API_KEY=your_actual_api_key_from_perplexity
```

### Step 2: Get Perplexity API Key
1. Go to [perplexity.ai](https://perplexity.ai)
2. Login with: **balaji.web.design1@gmail.com**
3. Navigate to API settings (or developer section)
4. Generate API key
5. Copy the key to your `.env` file

### Step 3: Start n8n
```bash
# For local development
docker compose --env-file .env -f docker-compose.basic.yml up -d

# Access n8n at: http://localhost:5678
```

### Step 4: Import Workflows
1. Open n8n web interface
2. Click "+" → "Import from file"
3. Import both JSON files from `n8n-workflows/` directory
4. Configure credentials (see detailed guide below)

### Step 5: Test Integration
```bash
# Run the validation script
./test-integration.sh

# Test the content generator webhook
curl -X POST http://localhost:5678/webhook/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Latest bioinformatics trends",
    "content_type": "linkedin_post"
  }'
```

## 🔧 Credential Configuration

### Perplexity API (Required)
- **Type**: HTTP Header Auth
- **Name**: `perplexity-auth`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer YOUR_PERPLEXITY_API_KEY`

### Google Sheets (Optional, for logging)
- **Type**: Google Sheets OAuth2 API
- **Setup**: Follow Google OAuth2 process
- **Purpose**: Store research data and content logs

### Email SMTP (Optional, for reports)
- **Type**: SMTP
- **Purpose**: Send automated research reports
- **Config**: Use your preferred email provider

## 📊 What You'll Get

### Automated Weekly Reports
Every Monday at 9 AM, you'll receive:
- 📧 **Email Report**: Industry research with citations
- 📋 **Google Sheets**: Structured data for tracking
- 📱 **LinkedIn Content**: Ready-to-post suggestions

### On-Demand Content Generation
Use the webhook to generate:
- LinkedIn posts about any topic
- Blog article outlines
- Industry research summaries
- Professional content with citations

## 📁 File Structure
```
├── .env.example                           # ✅ Updated with Perplexity config
├── README-n8n-setup.md                   # ✅ Enhanced with integration steps
├── n8n-perplexity-integration.md         # ✅ Complete setup guide
├── n8n-workflows/
│   ├── README.md                          # ✅ Workflow documentation
│   ├── perplexity-research-automation.json     # ✅ Weekly automation
│   └── perplexity-content-generator.json       # ✅ On-demand generator
├── test-integration.sh                    # ✅ Validation script
└── portfolio-automation-system/
    └── templates/weekly-workflow-template.md    # ✅ Updated with n8n references
```

## 🆘 Troubleshooting

### Common Issues
1. **API Key Not Working**: Verify Pro account status at perplexity.ai
2. **Workflows Not Importing**: Check JSON file integrity
3. **Webhooks Not Responding**: Ensure workflow is activated
4. **Email Not Sending**: Configure SMTP credentials

### Get Help
- 📖 **Detailed Guide**: `n8n-perplexity-integration.md`
- 🔧 **Workflow Help**: `n8n-workflows/README.md`
- 📧 **Contact**: balaji.web.design1@gmail.com

## 🎉 Ready to Go!

Your n8n + Perplexity AI Pro integration is now fully configured. The system will:

1. **Automatically research** industry trends every week
2. **Generate professional content** on-demand
3. **Email you reports** with actionable insights
4. **Log everything** for tracking and improvement

**Start with the weekly automation, then experiment with the content generator webhook!**

---

*Built with ❤️ for biotechnology professionals who want to automate their research and content creation.*