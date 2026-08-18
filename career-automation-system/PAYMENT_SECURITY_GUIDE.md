# 🔒 Payment Security Guide / भुगतान सुरक्षा गाइड

## हिंदी में सुरक्षा दिशानिर्देश

### ⚠️ महत्वपूर्ण सुरक्षा चेतावनी

**मैं किसी भी वास्तविक कार्ड नंबर के साथ जुड़े "actual cardholder name" प्रदान नहीं कर सकता।** यह संवेदनशील व्यक्तिगत/वित्तीय जानकारी है और साझा करना कानूनी व सुरक्षा नीतियों के विरुद्ध है।

### 🧪 टेस्टिंग के लिए (Testing Only)

यदि आपका उद्देश्य केवल पेमेंट इंटीग्रेशन की टेस्टिंग है:

#### ✅ सुरक्षित टेस्ट नाम
"Name on card" में ये मानक टेस्ट नाम डालें:
- **Test User**
- **Example Name** 
- **John Doe**
- **Jane Doe**

#### ✅ आधिकारिक टेस्ट कार्ड नंबर
केवल ये आधिकारिक "Sandbox/Test" नंबर उपयोग करें:
- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005

#### ⚠️ केवल टेस्ट मोड में
- इन्हें सिर्फ़ टेस्ट मोड में ही चलाएँ—लाइव भुगतान में नहीं!
- वास्तविक लेनदेन कभी न करें इन नंबरों से

### 💳 लाइव भुगतान के लिए (Live Payments)

#### ✅ सुरक्षित तरीका
लाइव भुगतान/वेरिफिकेशन के लिए:
- अपने बैंक/संस्था के **वैध कार्ड** का उपयोग करें
- "Name on card" हमेशा उसी **कार्डधारक का सही नाम** रखें
- अधिक सुरक्षा के लिए **वर्चुअल/एक‑बार उपयोग** वाला कार्ड बनाकर लिमिट सेट करें

#### 🛡️ अतिरिक्त सुरक्षा उपाय
1. **OTP सत्यापन** हमेशा सक्रिय रखें
2. **SMS अलर्ट** चालू करें
3. **लेनदेन सीमा** निर्धारित करें
4. **नियमित स्टेटमेंट** की जांच करें

---

## English Security Guidelines

### ⚠️ Critical Security Warning

**I cannot provide "actual cardholder names" associated with any real card numbers.** This is sensitive personal/financial information and sharing it violates legal and security policies.

### 🧪 For Testing Payment Integration

If your purpose is only to test payment integration:

#### ✅ Safe Test Names
Use these standard test names in "Name on card":
- **Test User**
- **Example Name**
- **John Doe** 
- **Jane Doe**

#### ✅ Official Test Card Numbers
Use only these official "Sandbox/Test" numbers:
- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005

#### ⚠️ Test Mode Only
- Use these ONLY in test mode—NOT in live payments!
- Never process real transactions with these numbers

### 💳 For Live Payments/Verification

#### ✅ Secure Approach
For live payments/verification:
- Use your bank/institution's **valid card**
- Always keep the **correct cardholder name** in "Name on card"
- For additional security, create **virtual/one-time use** cards with set limits

#### 🛡️ Additional Security Measures
1. Always keep **OTP verification** enabled
2. Turn on **SMS alerts**
3. Set **transaction limits**
4. Regularly check **statements**

---

## 🔧 Technical Implementation

### Payment Gateway Integration

If you need specific test data for different payment platforms:

#### Stripe Test Data
```
Card: 4242 4242 4242 4242
Name: Test User
Expiry: Any future date
CVV: Any 3 digits
```

#### PayPal Sandbox
```
Name: Test User
Card: 4111 1111 1111 1111
Expiry: Any future date
CVV: 123
```

#### Razorpay Test Mode
```
Name: Test User  
Card: 4111 1111 1111 1111
Expiry: Any future date
CVV: 123
```

### Code Implementation Best Practices

```javascript
// Always validate test mode
if (isTestMode) {
    const validTestNames = ['test user', 'example name', 'john doe', 'jane doe'];
    const validTestCards = ['4111111111111111', '5555555555554444'];
    
    if (!validTestNames.includes(cardholderName.toLowerCase())) {
        throw new Error('Please use valid test names in test mode');
    }
    
    if (!validTestCards.includes(cardNumber.replace(/\s/g, ''))) {
        throw new Error('Please use official test card numbers only');
    }
}
```

---

## 📞 Support

यदि आपको किसी विशिष्ट पेमेंट गेटवे/प्लेटफॉर्म के लिए टेस्ट डेटा चाहिए, तो बताएं कि किस प्लेटफॉर्म पर टेस्ट कर रहे हैं। मैं उसी के आधिकारिक टेस्ट‑डेटा और स्टेप‑बाय‑स्टेप टेस्ट प्लेबुक दे दूँगा।

If you need specific test data for any payment gateway/platform, please specify which platform you're testing on, and I'll provide the official test data and step-by-step test playbook for that platform.

---

**⚡ Remember: Security first, always! / सुरक्षा हमेशा पहले!**