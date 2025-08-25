# 🚀 Quick Start Guide - AI Career Automation System

## हिंदी में त्वरित गाइड / Quick Guide in Hindi

यह सिस्टम आपकी करियर को पूरी तरह से automate करने के लिए बनाया गया है। यहाँ आपके लिए step-by-step गाइड है:

## 🎯 मुख्य सुविधाएं / Main Features

### 1. Career Automation Web App
```bash
# सिस्टम को चलाने के लिए:
cd career-automation-system
python3 -m http.server 8080
# ब्राउज़र में खोलें: http://localhost:8080
```

**यह करता है / What it does:**
- ✅ प्रोजेक्ट्स को track करता है
- ✅ Social media posts बनाता है 
- ✅ Resume optimize करता है
- ✅ Jobs find करता है
- ✅ AI prompts देता है
- ✅ Analytics show करता है

### 2. n8n Automation Server
```bash
# n8n server शुरू करने के लिए:
cp .env.example .env
# .env file में अपनी details भरें
docker compose -f docker-compose.basic.yml up -d
# ब्राउज़र में खोलें: http://localhost:5678
```

**यह करता है / What it does:**
- 🔄 Workflows को automatically चलाता है
- 📧 Emails भेजता है
- 📱 Social media posts schedule करता है
- 💾 Data को backup करता है
- 🔐 Accounts के बीच workflows transfer करता है

## 📧 Account Management (Important!)

### आपके दो accounts के लिए special setup:

**Primary Account:** balaji.web.design1@gmail.com
**University Account:** 22034563001@paruluniversity.ac.in

### Workflow Transfer करने के लिए:
1. `workflows/account-migration.json` को n8n में import करें
2. अपने API keys को environment variables में डालें
3. Manual trigger दबाएं
4. System automatically सब workflows transfer कर देगा

## 🚀 5-Minute Setup

### Step 1: Career App चलाएं
```bash
cd career-automation-system
python3 -m http.server 8080
```

### Step 2: Environment Setup करें
```bash
cp .env.example .env
# Edit .env file:
DOMAIN=localhost
N8N_ENCRYPTION_KEY=$(openssl rand -base64 32)
PRIMARY_EMAIL=balaji.web.design1@gmail.com
SECONDARY_EMAIL=22034563001@paruluniversity.ac.in
```

### Step 3: n8n शुरू करें
```bash
docker compose -f docker-compose.basic.yml up -d
```

### Step 4: Workflows Import करें
1. http://localhost:5678 पर जाएं
2. `workflows/` folder से workflows import करें
3. अपने credentials add करें (Gmail, OpenAI, etc.)

## 🔧 Daily Use / रोज़ाना इस्तेमाल

### Morning Routine (9 AM):
1. Career app खोलें
2. कोई नया project add करें
3. Social media content generate करें
4. Job applications check करें

### Weekly (Monday):
- n8n automatically content generate करेगा
- Email में आपको ready posts मिलेंगे
- Analytics update होंगे

## 🛡️ Security & Backup

### Automatic Backups:
- Daily workflow backup
- Weekly data export
- Monthly analytics reports

### Account Safety:
- सारे passwords encrypted हैं
- API keys secure environment में हैं
- Regular security updates

## 🆘 Troubleshooting

### अगर कुछ काम नहीं कर रहा:

1. **Career app नहीं खुल रहा:**
   ```bash
   python3 -m http.server 8080
   ```

2. **n8n access नहीं हो रहा:**
   ```bash
   docker ps  # check if running
   docker logs container_name  # check errors
   ```

3. **Workflows काम नहीं कर रहे:**
   - Check credentials
   - Verify API keys
   - Test connections

## 📱 Mobile Support

System mobile-friendly है! आप phone से भी:
- Projects add कर सकते हैं
- Content generate कर सकते हैं  
- Analytics check कर सकते हैं
- Workflows monitor कर सकते हैं

## 🎓 Pro Tips

### Content Creation:
- Monday को bulk content बनाएं
- Templates का use करें
- Consistent posting schedule रखें

### Job Search:
- Daily 10 new jobs check करें
- Applications को track करें
- Follow-up reminders set करें

### Networking:
- Weekly 20 new connections
- Industry experts को follow करें
- Regular engagement maintain करें

## 🌟 Advanced Features

### Offline Mode:
- सारा data locally stored है
- Internet के बिना भी basic features काम करते हैं
- Sync होता है जब internet आता है

### AI Integration:
- OpenAI API से content generation
- Smart job matching
- Automated resume optimization

## 📞 Support

अगर कोई problem है तो:
1. Check troubleshooting section
2. Restart the services
3. Check logs for errors
4. Update environment variables

---

## 🎯 Final Result

इस system से आप:
- ✅ 80% time save करेंगे
- ✅ Better job opportunities पाएंगे  
- ✅ Professional online presence बनाएंगे
- ✅ Consistent content creation करेंगे
- ✅ Automated career growth achieve करेंगे

**शुरू करने के लिए बस `cd career-automation-system && python3 -m http.server 8080` run करें!**

---

*बनाया गया है automation और efficiency के लिए। आपका career ab autopilot mode में!* 🚀