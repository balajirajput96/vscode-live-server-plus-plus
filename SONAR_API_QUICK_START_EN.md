# Sonar API Quick Start Guide

> Generate an API key and make your first call in < 3 minutes.

## Generating API Key

**Get your Sonar API Key** 🔑

Go to the **API Keys** tab in the API portal and create a new key.

[Click here](https://perplexity.ai/account/api) to get your API key.

> **Info:** See the [API Groups](/getting-started/api-groups) page to set up API groups.

> **Note:** **OpenAI SDK Compatible:** Perplexity's API supports the OpenAI Chat Completions format. You can use OpenAI client libraries by pointing them to our endpoint. See our [OpenAI SDK Guide](/guides/chat-completions-guide) for examples.

## Making Your First API Call

### cURL

**cURL** is a command-line tool for making HTTP requests. Set your API key and run the command:

#### Non-streaming Request

```bash
curl --location 'https://api.perplexity.ai/chat/completions' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $SONAR_API_KEY" \
--data '{
  "model": "sonar-pro",
  "messages": [
    {
      "role": "user",
      "content": "What are the most popular open-source alternatives to OpenAI GPT models?"
    }
  ]
}'
```

#### Streaming Response

```bash
curl https://api.perplexity.ai/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $SONAR_API_KEY" \
-d '{
"model": "sonar-pro",
"messages": [
{
  "role": "user",
  "content": "What were the results of the 2025 French Open finals?"
}
],
"stream": true
}' | jq
```

### Python

#### Non-streaming Request

```python
import requests

# Set API endpoint and headers
url = "https://api.perplexity.ai/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",  # Replace with your actual API key
    "Content-Type": "application/json"
}

# Define request payload
payload = {
    "model": "sonar-pro",
    "messages": [
        {"role": "user", "content": "What were the results of the 2025 French Open finals?"}
    ]
}

# Make API call
response = requests.post(url, headers=headers, json=payload)

# Print AI response
print(response.json())  # Replace with print(response.json()["choices"][0]['message']['content']) for content only
```

#### Streaming Response

```python
import requests

# Set API endpoint and headers
url = "https://api.perplexity.ai/chat/completions"
headers = {
    "Authorization": "Bearer SONAR_API_KEY",  # Replace with your actual API key
    "Content-Type": "application/json"
}

# Define request payload with streaming enabled
payload = {
    "model": "sonar-pro",
    "messages": [
        {"role": "user", "content": "What are the most popular open-source alternatives to OpenAI GPT models?"}
    ],
    "stream": True  # Enable streaming for real-time responses
}

# Make API call with streaming enabled
response = requests.post(url, headers=headers, json=payload, stream=True)

# Process streaming response (simplified example)
for line in response.iter_lines():
    if line:
        print(line.decode('utf-8'))
```

> **Note:** Replace `SONAR_API_KEY` with your actual Sonar API key.
> For production, use environment variables instead of hardcoding API keys: `os.environ.get("SONAR_API_KEY")` or `process.env.SONAR_API_KEY`.

### TypeScript

#### Basic Request

```typescript
// Set API endpoint and headers
const url = 'https://api.perplexity.ai/chat/completions';
const headers = {
    'Authorization': 'Bearer YOUR_API_KEY',  // Replace with your actual API key
    'Content-Type': 'application/json'
};

// Define request payload
const payload = {
    model: 'sonar-pro',
    messages: [
        { role: 'user', content: 'What were the results of the 2025 French Open finals?' }
    ]
};

// Make API call
const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
});

const data = await response.json();

// Print AI response
console.log(data);  // Replace with console.log(data.choices[0].message.content) for content only
```

#### Streaming Response

```typescript
// Set API endpoint and headers
const url = 'https://api.perplexity.ai/chat/completions';
const headers = {
    'Authorization': 'Bearer SONAR_API_KEY',  // Replace with your actual API key
    'Content-Type': 'application/json'
};

// Define request payload with streaming enabled
const payload = {
    model: 'sonar-pro',
    messages: [
        { role: 'user', content: 'What are the most popular open-source alternatives to OpenAI GPT models?' }
    ],
    stream: true  // Enable streaming for real-time responses
};

// Make API call with streaming enabled
const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
});

// Process streaming response
const reader = response.body?.getReader();
if (reader) {
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        console.log(chunk);  // Replace with console.log(chunk.choices[0].delta.content) for content only
    }
}
```

> **Note:** Replace `SONAR_API_KEY` with your actual Sonar API key.

## Example Response

### Response Content

```
## 2025 French Open Final Results

**Men's Singles Final**

- **Champion:** Carlos Alcaraz
- **Runner-up:** Jannik Sinner
- **Score:** 4–6, 6–7^(4–7), 6–4, 7–6^(7–3), 7–6^(10–2)
- **Details:** Carlos Alcaraz successfully defended his title by defeating Jannik Sinner in a dramatic five-set final.

**Women's Singles Final**

- **Champion:** Coco Gauff
- **Runner-up:** Aryna Sabalenka
- **Details:** Coco Gauff came back from an early deficit to defeat Aryna Sabalenka in a three-set battle.
```

### Search Results

```json
[
  "https://en.wikipedia.org/wiki/2025_French_Open_%E2%80%93_Men's_singles",
  "https://en.wikipedia.org/wiki/2025_French_Open_%E2%80%93_Men's_singles_final",
  "https://www.rolandgarros.com/en-us/matches?status=finished",
  "https://www.tennis.com/news/articles/who-were-the-winners-and-losers-at-2025-roland-garros",
  "https://www.cbssports.com/tennis/news/2025-french-open-results-schedule-as-jannik-sinner-faces-carlos-alcaraz-coco-gauff-earns-first-title/"
]
```

### Usage Information

```json
{
  "completion_tokens": 625,
  "prompt_tokens": 13,
  "total_tokens": 638
}
```

### Raw Response

```json
{
  "id": "d06009f7-06e3-481b-87b9-37878abab471",
  "model": "sonar-pro",
  "created": 1752790019,
  "usage": {
    "prompt_tokens": 16,
    "completion_tokens": 517,
    "total_tokens": 533,
    "search_context_size": "small"
  },
  "search_results": [
    {
      "title": "Top 5 Open-Source LLMs for Developers: ChatGPT Alternatives ...",
      "url": "https://www.syncfusion.com/blogs/post/best-5-open-source-llms",
      "date": "2025-06-17",
      "last_updated": "2025-06-21"
    }
  ],
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "As of 2025, the most popular open-source alternatives to OpenAI's GPT models include several robust Large Language Models (LLMs)..."
      }
    }
  ]
}
```

## Streaming Guide

For a **complete streaming guide** including parsing, error handling, citation management, and best practices, see our [Streaming Guide](/guides/streaming).

## Next Steps

Now that you've made your first API call, here are some recommended next steps:

### 📚 Models
Explore the different models available and their capabilities.

### 💻 API Reference
View complete API documentation with detailed endpoint specifications.

### 💡 Guides
Read our guides to learn how to get the maximum benefit from the Sonar API.

### ▶️ Examples
Discover code examples, tutorials, and integration patterns.

---

## Security Recommendations

1. **API Key Security**: Never commit your API key to public repositories
2. **Environment Variables**: Always use environment variables in production
3. **Rate Limiting**: Monitor the frequency of API calls
4. **Error Handling**: Implement proper error handling in all API calls

## Troubleshooting

### Common Errors

**401 Unauthorized**: Check your API key  
**429 Too Many Requests**: Rate limit exceeded, wait a moment  
**500 Internal Server Error**: Server issue, try again later

### Support Resources

- [API Documentation](https://docs.perplexity.ai/)
- [Community Forum](https://community.perplexity.ai/)
- [GitHub Issues](https://github.com/perplexityai/perplexity-api/issues)

---

## Integration with Career Automation System

This Sonar API can be integrated with our [Career Automation System](/career-automation-system/) to enhance AI-powered features:

- **Portfolio Generation**: Use Sonar API for creating professional project descriptions
- **Social Media Content**: Generate engaging LinkedIn and social media posts
- **Resume Optimization**: Create targeted resume content for specific roles
- **Interview Preparation**: Generate industry-specific interview questions and answers

### Example Integration

```python
# Integration example for portfolio generation
from sonar_api import SonarClient

client = SonarClient(api_key="your_sonar_api_key")

def generate_portfolio_content(project_data):
    prompt = f"""
    Create a professional portfolio description for:
    Project: {project_data['name']}
    Technology: {project_data['tech_stack']}
    Domain: Biotechnology and Bioinformatics
    """
    
    response = client.chat_completion(
        model="sonar-pro",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

---

**🚀 You're now ready to use the Sonar API! Make your first API call and experience the power of AI.**

*Last Updated: January 2025*  
*Version: 1.0*  
*Compatibility: All modern programming languages*