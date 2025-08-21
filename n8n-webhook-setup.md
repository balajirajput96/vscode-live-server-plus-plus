# 🔗 n8n Webhook Integration Guide

यह complete guide है n8n webhook setup के लिए जो GitHub Actions के साथ integrate करता है।

## 🎯 Step-by-Step n8n Setup

### Step 1: n8n Workflow बनाएं

1. **n8n Dashboard** खोलें
2. **+ New Workflow** पर click करें
3. Workflow का name दें: "Balaji Career Automation"

### Step 2: Webhook Node Configuration

```json
{
  "name": "Webhook - balaji-automation",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "balaji-automation",
    "responseMode": "responseNode",
    "options": {
      "allowedOrigins": "*",
      "rawBody": false
    }
  }
}
```

**Configuration Steps:**
1. **Add Node** → **Trigger** → **Webhook**
2. **HTTP Method**: POST
3. **Path**: `balaji-automation`
4. **Authentication**: None (या आपकी requirement के अनुसार)

### Step 3: Data Processing Nodes

#### JSON Parser Node
```json
{
  "name": "Process GitHub Data",
  "type": "n8n-nodes-base.set",
  "parameters": {
    "values": {
      "string": [
        {
          "name": "repository",
          "value": "={{$json.repository}}"
        },
        {
          "name": "commit",
          "value": "={{$json.commit}}"
        },
        {
          "name": "branch", 
          "value": "={{$json.branch}}"
        },
        {
          "name": "automation_status",
          "value": "={{$json.data.automation_status}}"
        }
      ]
    }
  }
}
```

#### Email Notification Node
```json
{
  "name": "Send Notification",
  "type": "n8n-nodes-base.emailSend",
  "parameters": {
    "fromEmail": "automation@yourdomain.com",
    "toEmail": "your-email@domain.com",
    "subject": "🤖 Career Automation Update - {{$json.repository}}",
    "text": "Automation completed successfully!\n\nRepository: {{$json.repository}}\nCommit: {{$json.commit}}\nBranch: {{$json.branch}}\nStatus: {{$json.automation_status}}\n\nNext scheduled run: {{$json.data.next_scheduled_run}}"
  }
}
```

### Step 4: Complete Workflow JSON

```json
{
  "name": "Balaji Career Automation",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "balaji-automation",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "repository",
              "value": "={{$json.repository}}"
            },
            {
              "name": "commit_short",
              "value": "={{$json.commit.slice(0,7)}}"
            },
            {
              "name": "branch",
              "value": "={{$json.branch}}"
            },
            {
              "name": "timestamp",
              "value": "={{$json.timestamp}}"
            },
            {
              "name": "status",
              "value": "={{$json.data.automation_status}}"
            }
          ]
        }
      },
      "name": "Process Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.event}}",
              "operation": "equal",
              "value2": "github_automation_trigger"
            }
          ]
        }
      },
      "name": "Check Event Type",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "functionCode": "// Generate LinkedIn post based on automation data\nconst data = items[0].json;\n\nconst linkedinPost = `🚀 Automated Career System Update!\n\n✅ Repository: ${data.repository}\n✅ Latest Changes: ${data.commit_short}\n✅ Branch: ${data.branch}\n✅ Status: ${data.status}\n\nOur AI-powered biotech career automation is working 24/7 to:\n🔬 Generate professional content\n📱 Update social media templates\n💼 Track job applications\n🤖 Optimize career profiles\n\n#BiotechCareers #AIAutomation #CareerGrowth #Bioinformatics\n\nUpdated: ${new Date(data.timestamp).toLocaleString()}`;\n\nreturn [\n  {\n    json: {\n      ...data,\n      linkedin_post: linkedinPost,\n      twitter_post: `🤖 Career automation update! Repository: ${data.repository} | Status: ${data.status} | #BiotechCareers #AIAutomation`,\n      email_subject: `Career Automation Success - ${data.repository}`,\n      email_body: `Automation workflow completed successfully for ${data.repository}\\n\\nCommit: ${data.commit_short}\\nBranch: ${data.branch}\\nStatus: ${data.status}\\nTime: ${new Date(data.timestamp).toLocaleString()}\\n\\nNext actions ready for execution.`\n    }\n  }\n];"
      },
      "name": "Generate Content",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [900, 240]
    },
    {
      "parameters": {
        "url": "https://api.github.com/repos/{{$json.repository}}/issues",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "token YOUR_GITHUB_TOKEN"
            },
            {
              "name": "Accept",
              "value": "application/vnd.github.v3+json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "title",
              "value": "🤖 Automation Report - {{$json.timestamp}}"
            },
            {
              "name": "body",
              "value": "## Automated Career System Report\\n\\n**Repository**: {{$json.repository}}\\n**Commit**: {{$json.commit_short}}\\n**Branch**: {{$json.branch}}\\n**Status**: {{$json.status}}\\n**Timestamp**: {{$json.timestamp}}\\n\\n### Generated Content\\n\\n**LinkedIn Post**:\\n```\\n{{$json.linkedin_post}}\\n```\\n\\n**Twitter Post**:\\n```\\n{{$json.twitter_post}}\\n```\\n\\n### Next Steps\\n- Review and customize generated content\\n- Schedule social media posts\\n- Monitor automation performance\\n- Update AI prompts based on results"
            },
            {
              "name": "labels",
              "value": ["automation", "career-system", "ai-generated"]
            }
          ]
        }
      },
      "name": "Create GitHub Issue",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [1120, 180]
    },
    {
      "parameters": {
        "fromEmail": "automation@yourdomain.com",
        "toEmail": "your-email@domain.com",
        "subject": "={{$json.email_subject}}",
        "text": "={{$json.email_body}}"
      },
      "name": "Send Email Notification",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "respondWith": "text",
        "responseBody": "✅ Automation webhook received and processed successfully!\\n\\nRepository: {{$json.repository}}\\nCommit: {{$json.commit_short}}\\nStatus: {{$json.status}}\\nProcessed at: {{new Date().toISOString()}}"
      },
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1340, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Process Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Data": {
      "main": [
        [
          {
            "node": "Check Event Type",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Event Type": {
      "main": [
        [
          {
            "node": "Generate Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Content": {
      "main": [
        [
          {
            "node": "Create GitHub Issue",
            "type": "main",
            "index": 0
          },
          {
            "node": "Send Email Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create GitHub Issue": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Email Notification": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🔧 Configuration Steps

### 1. Import Workflow
1. n8n में जाकर **Import** button पर click करें
2. ऊपर दिया गया JSON paste करें
3. **Import** पर click करें

### 2. Configure Credentials
1. **Email Send node** के लिए SMTP settings configure करें
2. **GitHub API** के लिए Personal Access Token add करें
3. **Webhook Response** node verify करें

### 3. Test the Webhook
```bash
# Test command
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "event": "github_automation_trigger",
    "repository": "test/repo",
    "commit": "abc123def456",
    "branch": "master",
    "timestamp": "2024-01-15T10:30:00Z",
    "data": {
      "automation_status": "active",
      "portfolio_updated": true,
      "social_templates_updated": true
    }
  }' \
  "YOUR_N8N_WEBHOOK_URL/webhook/balaji-automation"
```

## 📧 Email Template Configuration

### SMTP Settings
```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "auth": {
    "user": "your-email@gmail.com",
    "pass": "your-app-password"
  }
}
```

### Email Templates

#### Success Notification
```html
<!DOCTYPE html>
<html>
<head>
    <title>Career Automation Success</title>
</head>
<body>
    <h2>🤖 AI Career Automation Update</h2>
    
    <p><strong>Repository:</strong> {{repository}}</p>
    <p><strong>Commit:</strong> {{commit_short}}</p>
    <p><strong>Branch:</strong> {{branch}}</p>
    <p><strong>Status:</strong> {{status}}</p>
    <p><strong>Processed At:</strong> {{timestamp}}</p>
    
    <h3>Generated Content Ready:</h3>
    <ul>
        <li>✅ LinkedIn professional post</li>
        <li>✅ Twitter update</li>
        <li>✅ Portfolio content</li>
        <li>✅ Social media templates</li>
    </ul>
    
    <p>Next steps: Review and publish the generated content!</p>
</body>
</html>
```

## 🔗 Webhook URL Configuration

### Production URL Format
```
https://your-n8n-domain.com/webhook/balaji-automation
```

### Development URL Format
```
http://localhost:5678/webhook/balaji-automation
```

### n8n Cloud URL Format
```
https://app.n8n.cloud/webhook/your-instance-id/balaji-automation
```

## 🚨 Troubleshooting

### Common Issues:

#### Webhook Not Receiving Data
- Check n8n workflow is **active**
- Verify webhook path is exactly `balaji-automation`
- Test with curl command first

#### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure apps" for Gmail
- Use App Password instead of regular password

#### GitHub Issue Not Created
- Verify GitHub token has proper permissions
- Check repository name format (owner/repo)
- Ensure token has `repo` scope

## 📊 Monitoring & Analytics

### Workflow Execution Logs
n8n automatically logs:
- Execution count
- Success/failure rates
- Execution time
- Error details

### Custom Analytics Node
```javascript
// Add this to a Function node for custom analytics
const executionData = {
  timestamp: new Date().toISOString(),
  repository: items[0].json.repository,
  branch: items[0].json.branch,
  status: 'success',
  execution_time: Date.now() - items[0].json.start_time
};

// Log to external analytics service
// Or store in database
// Or send to monitoring service

return [{ json: executionData }];
```

## 🎯 Next Steps

1. **Deploy n8n Workflow**:
   - Import करें और test करें
   - Production URL copy करें
   - GitHub secrets में add करें

2. **Customize for Your Needs**:
   - Email templates modify करें
   - Additional automation steps add करें
   - Custom analytics implement करें

3. **Monitor Performance**:
   - Daily execution logs check करें
   - Success rates monitor करें
   - Based on performance, optimize करें

**🚀 आपका n8n webhook automation ready है!**