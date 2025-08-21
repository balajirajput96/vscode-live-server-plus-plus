# सोनार एपीआई त्वरित प्रारंभ गाइड
# Sonar API Quick Start Guide

> API कुंजी बनाएं और < 3 मिनट में अपना पहला कॉल करें।

## API कुंजी उत्पन्न करना

**अपनी सोनार एपीआई कुंजी प्राप्त करें** 🔑

API पोर्टल में **API कुंजियाँ** टैब पर जाएँ और एक नई कुंजी बनाएँ।

[यहां क्लिक करें](https://perplexity.ai/account/api) API कुंजी प्राप्त करने के लिए।

> **जानकारी:** API समूह सेट अप करने के लिए [API समूह](/getting-started/api-groups) पृष्ठ देखें।

> **नोट:** **OpenAI SDK संगत:** Perplexity का API OpenAI चैट कंप्लीशन्स फ़ॉर्मेट का समर्थन करता है। आप हमारे एंडपॉइंट पर पॉइंट करके OpenAI क्लाइंट लाइब्रेरीज़ का उपयोग कर सकते हैं। उदाहरणों के लिए हमारी [OpenAI SDK गाइड](/guides/chat-completions-guide) देखें।

## अपना पहला API कॉल करना

### cURL

**cURL** HTTP अनुरोध करने के लिए एक कमांड-लाइन टूल है। अपनी API कुंजी सेट करें और कमांड चलाएँ:

#### गैर-स्ट्रीमिंग अनुरोध

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
      "content": "OpenAI के GPT मॉडल के सबसे लोकप्रिय ओपन-सोर्स विकल्प क्या हैं?"
    }
  ]
}'
```

#### स्ट्रीमिंग प्रतिक्रिया

```bash
curl https://api.perplexity.ai/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $SONAR_API_KEY" \
-d '{
"model": "sonar-pro",
"messages": [
{
  "role": "user",
  "content": "2025 फ्रेंच ओपन फ़ाइनल के परिणाम क्या थे?"
}
],
"stream": true
}' | jq
```

### Python

#### गैर-स्ट्रीमिंग अनुरोध

```python
import requests

# API एंडपॉइंट और हेडर सेट करें
url = "https://api.perplexity.ai/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",  # अपनी वास्तविक API कुंजी से बदलें
    "Content-Type": "application/json"
}

# अनुरोध पेलोड को परिभाषित करें
payload = {
    "model": "sonar-pro",
    "messages": [
        {"role": "user", "content": "2025 फ्रेंच ओपन फ़ाइनल के परिणाम क्या थे?"}
    ]
}

# API कॉल करें
response = requests.post(url, headers=headers, json=payload)

# AI की प्रतिक्रिया प्रिंट करें
print(response.json())  # केवल सामग्री के लिए print(response.json()["choices"][0]['message']['content']) से बदलें
```

#### स्ट्रीमिंग प्रतिक्रिया

```python
import requests

# API एंडपॉइंट और हेडर सेट करें
url = "https://api.perplexity.ai/chat/completions"
headers = {
    "Authorization": "Bearer SONAR_API_KEY",  # अपनी वास्तविक API कुंजी से बदलें
    "Content-Type": "application/json"
}

# स्ट्रीमिंग सक्षम के साथ अनुरोध पेलोड को परिभाषित करें
payload = {
    "model": "sonar-pro",
    "messages": [
        {"role": "user", "content": "OpenAI के GPT मॉडल के सबसे लोकप्रिय ओपन-सोर्स विकल्प क्या हैं?"}
    ],
    "stream": True  # वास्तविक समय प्रतिक्रियाओं के लिए स्ट्रीमिंग सक्षम करें
}

# स्ट्रीमिंग सक्षम करके API कॉल करें
response = requests.post(url, headers=headers, json=payload, stream=True)

# स्ट्रीमिंग प्रतिक्रिया को संसाधित करें (सरलीकृत उदाहरण)
for line in response.iter_lines():
    if line:
        print(line.decode('utf-8'))
```

> **नोट:** `SONAR_API_KEY` को अपनी वास्तविक सोनार API कुंजी से बदलें।
> उत्पादन के लिए, API कुंजियों को हार्डकोड करने के बजाय पर्यावरण चर का उपयोग करें: `os.environ.get("SONAR_API_KEY")` या `process.env.SONAR_API_KEY`।

### TypeScript

#### मूल अनुरोध

```typescript
// API एंडपॉइंट और हेडर सेट करें
const url = 'https://api.perplexity.ai/chat/completions';
const headers = {
    'Authorization': 'Bearer YOUR_API_KEY',  // अपनी वास्तविक API कुंजी से बदलें
    'Content-Type': 'application/json'
};

// अनुरोध पेलोड को परिभाषित करें
const payload = {
    model: 'sonar-pro',
    messages: [
        { role: 'user', content: '2025 फ्रेंच ओपन फ़ाइनल के परिणाम क्या थे?' }
    ]
};

// API कॉल करें
const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
});

const data = await response.json();

// AI की प्रतिक्रिया प्रिंट करें
console.log(data);  // केवल सामग्री के लिए console.log(data.choices[0].message.content) से बदलें
```

#### स्ट्रीमिंग प्रतिक्रिया

```typescript
// API एंडपॉइंट और हेडर सेट करें
const url = 'https://api.perplexity.ai/chat/completions';
const headers = {
    'Authorization': 'Bearer SONAR_API_KEY',  // अपनी वास्तविक API कुंजी से बदलें
    'Content-Type': 'application/json'
};

// स्ट्रीमिंग सक्षम के साथ अनुरोध पेलोड को परिभाषित करें
const payload = {
    model: 'sonar-pro',
    messages: [
        { role: 'user', content: 'ओपनएआई के GPT मॉडल के सबसे लोकप्रिय ओपन-सोर्स विकल्प क्या हैं?' }
    ],
    stream: true  // वास्तविक समय प्रतिक्रियाओं के लिए स्ट्रीमिंग सक्षम करें
};

// स्ट्रीमिंग सक्षम करके API कॉल करें
const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
});

// स्ट्रीमिंग प्रतिक्रिया को संसाधित करें
const reader = response.body?.getReader();
if (reader) {
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        console.log(chunk);  // केवल सामग्री के लिए console.log(chunk.choices[0].delta.content) से बदलें
    }
}
```

> **नोट:** `SONAR_API_KEY` को अपनी वास्तविक सोनार API कुंजी से बदलें।

## उदाहरण प्रतिक्रिया

### प्रतिक्रिया सामग्री

```
## 2025 फ्रेंच ओपन फाइनल परिणाम

**पुरुष एकल फाइनल**

- **चैंपियन:** कार्लोस अलकराज
- **उपविजेता:** जैनिक सिनर
- **स्कोर:** 4–6, 6–7^(4–7), 6–4, 7–6^(7–3), 7–6^(10–2)
- **विवरण:** कार्लोस अल्काराज़ ने पाँच सेटों के एक नाटकीय फ़ाइनल में जैनिक सिनर को हराकर अपने ख़िताब का सफलतापूर्वक बचाव किया।

**महिला एकल फाइनल**

- **चैंपियन:** कोको गौफ़
- **उपविजेता:** आर्यना सबालेंका
- **विवरण:** कोको गॉफ़ ने शुरुआती पिछड़ने के बाद वापसी करते हुए आर्यना सबालेंका को तीन सेटों के संघर्ष में हरा दिया।
```

### खोज के परिणाम

```json
[
  "https://en.wikipedia.org/wiki/2025_French_Open_%E2%80%93_Men's_singles",
  "https://en.wikipedia.org/wiki/2025_French_Open_%E2%80%93_Men's_singles_final",
  "https://www.rolandgarros.com/en-us/matches?status=finished",
  "https://www.tennis.com/news/articles/who-were-the-winners-and-losers-at-2025-roland-garros",
  "https://www.cbssports.com/tennis/news/2025-french-open-results-schedule-as-jannik-sinner-faces-carlos-alcaraz-coco-gauff-earns-first-title/"
]
```

### उपयोग की जानकारी

```json
{
  "completion_tokens": 625,
  "prompt_tokens": 13,
  "total_tokens": 638
}
```

### कच्ची प्रतिक्रिया

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
      "title": "डेवलपर्स के लिए सर्वश्रेष्ठ 5 ओपन-सोर्स LLM: ChatGPT के विकल्प ...",
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
        "content": "2025 तक, OpenAI के GPT मॉडल के सबसे लोकप्रिय ओपन-सोर्स विकल्पों में कई मज़बूत लार्ज लैंग्वेज मॉडल (LLM) शामिल हैं..."
      }
    }
  ]
}
```

## स्ट्रीमिंग गाइड

**संपूर्ण स्ट्रीमिंग गाइड** के लिए, जिसमें पार्सिंग, त्रुटि प्रबंधन, उद्धरण प्रबंधन और सर्वोत्तम अभ्यास शामिल हैं, हमारी [स्ट्रीमिंग गाइड](/guides/streaming) देखें।

## अगले कदम

अब जबकि आपने अपना पहला API कॉल कर लिया है, तो यहां कुछ अनुशंसित अगले चरण दिए गए हैं:

### 📚 मॉडल
उपलब्ध विभिन्न मॉडलों और उनकी क्षमताओं का अन्वेषण करें।

### 💻 एपीआई संदर्भ
विस्तृत एंडपॉइंट विनिर्देशों के साथ संपूर्ण API दस्तावेज़ देखें।

### 💡 गाइड्स
सोनार एपीआई से अधिकतम लाभ प्राप्त करने के तरीके जानने के लिए हमारी मार्गदर्शिका पढ़ें।

### ▶️ उदाहरण
कोड उदाहरण, ट्यूटोरियल और एकीकरण पैटर्न खोजें।

---

## सुरक्षा सुझाव

1. **API कुंजी सुरक्षा**: अपनी API कुंजी को कभी भी public repositories में commit न करें
2. **पर्यावरण चर**: उत्पादन में हमेशा environment variables का उपयोग करें
3. **Rate Limiting**: API calls की frequency को monitor करें
4. **Error Handling**: सभी API calls में proper error handling implement करें

## समस्या निवारण

### सामान्य त्रुटियां

**401 Unauthorized**: API कुंजी की जांच करें  
**429 Too Many Requests**: Rate limit exceeded, थोड़ी देर प्रतीक्षा करें  
**500 Internal Server Error**: Server की समस्या, बाद में कोशिश करें

### सहायता संसाधन

- [API Documentation](https://docs.perplexity.ai/)
- [Community Forum](https://community.perplexity.ai/)
- [GitHub Issues](https://github.com/perplexityai/perplexity-api/issues)

---

**🚀 अब आप Sonar API का उपयोग करने के लिए तैयार हैं! अपनी पहली API call करें और AI की शक्ति का अनुभव करें।**

*अंतिम अपडेट: जनवरी 2025*  
*संस्करण: 1.0*  
*संगतता: सभी आधुनिक प्रोग्रामिंग भाषाएं*