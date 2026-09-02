# 🤖 n8n + Perplexity AI Pro Integration Guide

## 📋 Overview
This guide explains how to connect your Perplexity AI Pro account with n8n automation workflows for enhanced research and content generation capabilities.

## 🔑 Prerequisites
- Perplexity AI Pro account (balaji.web.design1@gmail.com)
- n8n instance running (v1.108.1+)
- API access to Perplexity AI

## ⚙️ Setup Instructions

### 1. Perplexity AI API Configuration
1. **Login to Perplexity AI Pro**
   - Visit [perplexity.ai](https://perplexity.ai)
   - Login with: balaji.web.design1@gmail.com
   - Navigate to API settings/developer section

2. **Generate API Key**
   ```bash
   # Add to your .env file
   PERPLEXITY_API_KEY=your_perplexity_pro_api_key_here
   ```

3. **Update n8n Environment**
   ```bash
   # In your .env file, ensure these are set:
   EMAIL=balaji.web.design1@gmail.com
   N8N_IMAGE_TAG=1.108.1
   PERPLEXITY_API_KEY=your_actual_api_key
   ```

### 2. n8n HTTP Request Node Configuration

#### Basic Perplexity API Call Setup
```json
{
  "method": "POST",
  "url": "https://api.perplexity.ai/chat/completions",
  "headers": {
    "Authorization": "Bearer {{$env.PERPLEXITY_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "llama-3.1-sonar-small-128k-online",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful research assistant."
      },
      {
        "role": "user",
        "content": "{{$json.query}}"
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.2,
    "return_citations": true,
    "return_images": false
  }
}
```

## 🔄 Sample Workflows

### 1. Industry Research Automation
**Trigger**: Weekly Schedule (Monday 9 AM)
**Flow**: 
1. **Schedule Trigger** → Every Monday 9:00 AM
2. **Set Research Topics** → Define research areas
3. **Perplexity API Call** → Get latest industry insights
4. **Format Results** → Structure the research data
5. **Save to Google Sheets** → Store findings
6. **Send Email Summary** → Email to balaji.web.design1@gmail.com

### 2. Content Generation Pipeline
**Trigger**: Manual/Webhook
**Flow**:
1. **Webhook Trigger** → Receive content request
2. **Perplexity Research** → Gather background information
3. **Content Generation** → Create structured content
4. **LinkedIn Post Format** → Format for social media
5. **Schedule Post** → Auto-schedule via Buffer/Hootsuite

### 3. Job Market Analysis
**Trigger**: Daily at 6 PM
**Flow**:
1. **Schedule Trigger** → Daily execution
2. **Job Market Query** → Research biotechnology jobs
3. **Perplexity Analysis** → Get market trends
4. **Opportunity Detection** → Find relevant positions
5. **Notification** → Alert about new opportunities

## 📊 Useful Perplexity Prompts for Automation

### Research Prompts
```javascript
// Industry Research
const industryPrompt = `Research the latest developments in:
- Pharmaceutical data analysis trends in 2024
- Bioinformatics job market in India
- Emerging technologies in biotech sector
- Top companies hiring bioinformatics professionals
Provide specific data, statistics, and actionable insights.`;

// Job Market Analysis
const jobPrompt = `Analyze current job market for:
- Bioinformatics positions in pharmaceutical companies
- Data analyst roles in clinical research
- Remote opportunities in biotechnology
- Salary trends and skill requirements
Focus on Indian market and international remote positions.`;

// Content Ideas
const contentPrompt = `Generate content ideas for a biotechnology professional's LinkedIn:
- Industry insights and trends
- Career advice for bioinformatics
- Technical tutorials and tips
- Networking and professional development
Provide 5 specific post ideas with hashtags.`;
```

### API Request Examples

#### 1. Basic Research Query
```json
{
  "model": "llama-3.1-sonar-large-128k-online",
  "messages": [
    {
      "role": "user",
      "content": "What are the latest trends in pharmaceutical data analysis for 2024? Include specific technologies, methodologies, and market insights."
    }
  ],
  "max_tokens": 1500,
  "temperature": 0.1,
  "return_citations": true
}
```

#### 2. Job Market Analysis
```json
{
  "model": "llama-3.1-sonar-large-128k-online",
  "messages": [
    {
      "role": "system",
      "content": "You are a career research specialist focusing on biotechnology and bioinformatics careers."
    },
    {
      "role": "user",
      "content": "Analyze the current job market for bioinformatics professionals in India. Include salary ranges, top hiring companies, required skills, and growth prospects."
    }
  ],
  "max_tokens": 2000,
  "temperature": 0.2,
  "return_citations": true
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Authentication Errors**
   ```bash
   # Check if API key is properly set
   echo $PERPLEXITY_API_KEY
   
   # Verify in n8n environment variables
   # Settings → Environment Variables → PERPLEXITY_API_KEY
   ```

2. **Rate Limiting**
   - Perplexity Pro has higher rate limits
   - Add delays between requests if needed
   - Monitor usage in Perplexity dashboard

3. **Response Format Issues**
   ```javascript
   // Handle API response in n8n
   const response = $json.choices[0].message.content;
   const citations = $json.citations || [];
   
   return {
     content: response,
     sources: citations,
     timestamp: new Date().toISOString()
   };
   ```

## 📈 Best Practices

### 1. Efficient API Usage
- Use specific, targeted queries
- Set appropriate temperature (0.1-0.3 for factual content)
- Enable citations for credible research
- Cache results to avoid duplicate requests

### 2. Workflow Organization
- Group related automation in folders
- Use descriptive workflow names
- Add error handling and retry logic
- Set up monitoring and alerts

### 3. Content Quality
- Review AI-generated content before publishing
- Add personal insights and experiences
- Maintain consistent brand voice
- Include proper attributions and citations

## 🔒 Security Notes
- Never commit API keys to version control
- Use n8n environment variables for sensitive data
- Regularly rotate API keys
- Monitor API usage and costs

## 📞 Support
For technical issues:
- Check n8n community forums
- Perplexity AI documentation
- Email: balaji.web.design1@gmail.com

---

**✨ Ready to automate your research and content generation with Perplexity AI Pro + n8n!**