# 🚀 Perplexity AI API Integration Guide

## Overview

This enhanced career automation dashboard now includes full integration with Perplexity AI's powerful Sonar API, enabling real-time AI-powered career guidance, job market analysis, and personalized biotech/bioinformatics career advice.

## 🎯 Key Features

### 1. **Real-time AI Assistant**
- Direct integration with Perplexity AI Sonar API
- Support for both streaming and non-streaming responses
- Context-aware career guidance specifically for biotech professionals

### 2. **Smart Query System**
- Pre-built career-focused query templates
- Intelligent query type categorization
- Quick-access buttons for common career questions

### 3. **Biotech-Specific Intelligence**
- Targeted prompts for pharmaceutical industry
- Company research capabilities
- Salary trend analysis
- Skill development roadmaps

## 🔧 Setup Instructions

### Step 1: Get Your Perplexity API Key
1. Visit [Perplexity AI API Portal](https://perplexity.ai/account/api)
2. Sign up or log into your account
3. Navigate to the **API Keys** tab
4. Generate a new API key (starts with `pplx-`)
5. Copy the key for use in the dashboard

### Step 2: Configure the Dashboard
1. Open the career automation dashboard (`index.html`)
2. Locate the **🤖 AI Assistant (Perplexity API)** section
3. Paste your API key in the "Perplexity API Key" field
4. Click **Save** to store the key locally (optional)

### Step 3: Start Using AI Assistance
1. Choose a query type or use preset queries
2. Enter your career-related question
3. Click **Get AI Response** for standard responses
4. Click **Stream Response** for real-time streaming

## 💡 Usage Examples

### Quick Career Queries
The dashboard includes preset buttons for common questions:

1. **Biotech Salary Trends**
   - Current compensation data for Indian pharmaceutical industry
   - Entry-level to senior position analysis
   - Company-specific salary insights

2. **Top Pharma Companies**
   - Comprehensive list of hiring companies
   - Location and focus area details
   - Current job market opportunities

3. **Required Skills**
   - Technical skills in high demand
   - Programming languages and tools
   - Domain knowledge requirements

4. **Career Transition Tips**
   - Roadmap for biotech to bioinformatics transition
   - Step-by-step career planning
   - Industry-specific advice

### Custom Queries
You can ask any career-related question such as:
- "What are the growth prospects for bioinformatics professionals in India?"
- "How should I prepare for a data analyst interview at Sun Pharma?"
- "What projects should I build to showcase my bioinformatics skills?"

## 🔄 API Response Types

### Standard Response
- Complete answer in one response
- Includes usage statistics (tokens used)
- Formatted for easy reading

### Streaming Response
- Real-time response generation
- Live updates as AI generates content
- Better for longer, detailed responses

## 🛡️ Security & Privacy

### API Key Management
- Keys are stored locally in browser storage
- No server-side storage of credentials
- Users maintain full control over their API keys

### Data Handling
- All API calls go directly to Perplexity AI
- No intermediate storage of queries or responses
- Complete privacy of user interactions

## 📊 Response Format

The AI responses include:
- **Main Content**: Detailed answer to your query
- **Usage Information**: Token consumption details
- **Error Handling**: Clear error messages if issues occur
- **Formatting**: Professional, easy-to-read layout

## 🔧 Technical Implementation

### API Configuration
```javascript
const perplexityConfig = {
    url: 'https://api.perplexity.ai/chat/completions',
    model: 'sonar-pro'
};
```

### Request Format
```javascript
{
    "model": "sonar-pro",
    "messages": [
        {
            "role": "user",
            "content": "Your career question here"
        }
    ],
    "stream": false // or true for streaming
}
```

### Error Handling
The system includes comprehensive error handling for:
- Missing or invalid API keys
- Network connectivity issues
- API rate limiting
- Invalid response formats

## 🎯 Career-Focused Features

### Industry Context
All queries are processed with biotech/pharmaceutical industry context, ensuring relevant and actionable advice.

### Company Intelligence
Specific insights about major Indian pharmaceutical companies:
- Sun Pharma
- Zydus Cadila
- Alembic Pharma
- Lupin
- Dr. Reddy's
- And more...

### Skill Development
Targeted guidance for:
- Python and R programming
- Bioinformatics tools and platforms
- Statistical analysis and data visualization
- Database management
- Clinical research methodologies

## 📈 Best Practices

### Query Optimization
1. **Be Specific**: Include your background, goals, and specific interests
2. **Context Matters**: Mention your location, experience level, and target companies
3. **Follow-up**: Use insights from previous responses to ask deeper questions

### Effective Usage
1. **Start with Presets**: Use quick query buttons to get familiar with the system
2. **Combine Sources**: Use AI insights alongside existing career resources
3. **Regular Updates**: Ask about industry trends and market changes regularly

### Cost Management
- Monitor token usage displayed in responses
- Use streaming for exploratory queries
- Use standard responses for specific, targeted questions

## 🚀 Integration Benefits

### Career Planning
- Data-driven decision making
- Real-time market insights
- Personalized career roadmaps

### Job Search Optimization
- Company-specific preparation
- Industry trend awareness
- Skill gap identification

### Professional Development
- Continuous learning guidance
- Technology trend updates
- Network building strategies

## 🔮 Future Enhancements

Planned improvements include:
- Integration with job boards
- Resume optimization suggestions
- Interview preparation automation
- Salary negotiation guidance
- Career milestone tracking

## 📞 Support

For technical issues or feature requests:
1. Check the error messages in the dashboard
2. Verify your API key is valid and has credits
3. Ensure stable internet connectivity
4. Refer to [Perplexity AI Documentation](https://docs.perplexity.ai/)

---

**🎉 Ready to supercharge your biotech career with AI? Start exploring the enhanced dashboard today!**

*Last Updated: August 2024*
*Compatible with all modern browsers*
*Requires valid Perplexity AI API key*