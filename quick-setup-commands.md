# 🎯 Quick Setup Commands

अगर आप तुरंत शुरू करना चाहते हैं, तो ये commands copy-paste करें:

## 1️⃣ n8n Webhook Ready करने के लिए

### n8n में जाकर:
1. **New Workflow** → **Webhook Node** add करें
2. **Path**: `balaji-automation` 
3. **Method**: `POST`
4. **Save & Activate**
5. Production URL copy करें

### GitHub में secrets add करें:
```bash
# Repository → Settings → Secrets → Actions में जाकर add करें:

Name: N8N_WEBHOOK_URL
Value: https://your-n8n-domain.com

Name: OPENAI_API_KEY  
Value: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Name: GEMINI_API_KEY
Value: AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Name: AZURE_PUBLISH_PROFILE (optional)
Value: <PublishProfile>...</PublishProfile>
```

## 2️⃣ D-U-N-S Application के लिए

### Direct Link:
```
https://www.dnb.co.in/duns/get-a-duns
```

### Fill करने के लिए ready data:
```
Business Name: Parul University
Address: P.O. Limda, Waghodia, Vadodara - 391760, Gujarat
Phone: +91-2668-260277
Website: https://paruluniversity.ac.in/
Industry: Educational Services
```

## 3️⃣ Test Your Setup

### Automation test करें:
```bash
# Repository में Actions tab में जाकर
# "AI Career Automation Workflow" manually trigger करें
```

### n8n webhook test करें:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": "automation"}' \
  "YOUR_N8N_URL/webhook/balaji-automation"
```

## 4️⃣ Status Check Commands

### Automation status देखें:
```bash
# Repository files में check करें:
- automation-status.json
- automation-analytics.json  
- README.md (updated section)
```

## 🚀 Ready Status Messages

जब कोई step complete हो जाए तो भेजें:

- **"Webhook Ready"** - n8n setup complete हो गया
- **"DUNS Submitted"** - D-U-N-S application submit हो गया  
- **"Secrets Added"** - GitHub secrets configure हो गए
- **"Automation Working"** - पूरा system test हो गया

## 📞 Instant Help

अगर कहीं अटक जाएं तो screenshot के साथ specific error भेजें।

**🎯 Next: जो step पहले करना है उसका status भेजें!**