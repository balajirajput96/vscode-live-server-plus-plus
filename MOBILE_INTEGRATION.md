# 📱 Mobile Integration Guide

## Quick Setup for On-the-Go Career Management

### 📱 Browser Bookmarklets

#### 1. Job Application Tracker
Save this as a bookmark for quick job application tracking:

```javascript
javascript:(function(){
  var company = prompt("Company Name:");
  if(!company) return;
  var position = prompt("Position:");
  if(!position) return;
  var url = window.location.href;
  
  fetch('YOUR_N8N_WEBHOOK_URL/webhook/job-application', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({company, position, url})
  }).then(response => {
    if(response.ok) {
      alert('✅ Application tracked successfully!');
    } else {
      alert('❌ Failed to track application');
    }
  }).catch(() => alert('❌ Network error'));
})();
```

**Setup Instructions:**
1. Replace `YOUR_N8N_WEBHOOK_URL` with your actual n8n webhook URL
2. Save as bookmark named "Track Job Application"
3. Click bookmark when on a job posting page

#### 2. LinkedIn Connection Logger
Track new LinkedIn connections:

```javascript
javascript:(function(){
  var name = prompt("Contact Name:");
  if(!name) return;
  var company = prompt("Company:");
  var notes = prompt("Notes (optional):");
  
  fetch('YOUR_N8N_WEBHOOK_URL/webhook/new-connection', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name, 
      company, 
      notes, 
      date: new Date().toISOString().split('T')[0],
      platform: 'LinkedIn'
    })
  }).then(response => {
    if(response.ok) {
      alert('✅ Connection logged!');
    } else {
      alert('❌ Failed to log connection');
    }
  }).catch(() => alert('❌ Network error'));
})();
```

#### 3. Content Ideas Saver
Save content ideas on the go:

```javascript
javascript:(function(){
  var idea = prompt("Content idea:");
  if(!idea) return;
  var platform = prompt("Platform (LinkedIn/Twitter/Blog):");
  
  fetch('YOUR_N8N_WEBHOOK_URL/webhook/content-idea', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      idea, 
      platform, 
      date: new Date().toISOString().split('T')[0],
      source_url: window.location.href
    })
  }).then(response => {
    if(response.ok) {
      alert('💡 Idea saved!');
    } else {
      alert('❌ Failed to save idea');
    }
  }).catch(() => alert('❌ Network error'));
})();
```

---

## 📱 Mobile Web App

Create a simple mobile web interface for quick actions:

### HTML Interface

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Career Automation Mobile</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .button {
            background: #007bff;
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 8px;
            width: 100%;
            font-size: 16px;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .button:hover {
            background: #0056b3;
        }
        .input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 16px;
            box-sizing: border-box;
        }
        .success {
            background: #28a745;
            color: white;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .error {
            background: #dc3545;
            color: white;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        h2 {
            color: #555;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Career Automation</h1>
        
        <!-- Job Application Tracker -->
        <div class="card">
            <h2>📝 Track Job Application</h2>
            <input type="text" id="company" class="input" placeholder="Company Name">
            <input type="text" id="position" class="input" placeholder="Position Title">
            <input type="url" id="jobUrl" class="input" placeholder="Job URL">
            <button class="button" onclick="trackApplication()">Track Application</button>
            <div id="appResult"></div>
        </div>
        
        <!-- Content Idea Saver -->
        <div class="card">
            <h2>💡 Save Content Idea</h2>
            <textarea id="contentIdea" class="input" placeholder="Your content idea..." rows="3"></textarea>
            <select id="platform" class="input">
                <option value="">Select Platform</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Blog">Blog</option>
            </select>
            <button class="button" onclick="saveContentIdea()">Save Idea</button>
            <div id="contentResult"></div>
        </div>
        
        <!-- Connection Logger -->
        <div class="card">
            <h2>🤝 Log New Connection</h2>
            <input type="text" id="contactName" class="input" placeholder="Contact Name">
            <input type="text" id="contactCompany" class="input" placeholder="Company">
            <input type="text" id="contactNotes" class="input" placeholder="Notes (optional)">
            <button class="button" onclick="logConnection()">Log Connection</button>
            <div id="connectionResult"></div>
        </div>
    </div>

    <script>
        const N8N_BASE_URL = 'YOUR_N8N_WEBHOOK_URL'; // Replace with your n8n URL
        
        function showMessage(elementId, message, isSuccess = true) {
            const element = document.getElementById(elementId);
            element.innerHTML = `<div class="${isSuccess ? 'success' : 'error'}">${message}</div>`;
            setTimeout(() => element.innerHTML = '', 3000);
        }
        
        async function trackApplication() {
            const company = document.getElementById('company').value;
            const position = document.getElementById('position').value;
            const url = document.getElementById('jobUrl').value;
            
            if (!company || !position) {
                showMessage('appResult', 'Please fill in company and position', false);
                return;
            }
            
            try {
                const response = await fetch(`${N8N_BASE_URL}/webhook/job-application`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({company, position, url: url || window.location.href})
                });
                
                if (response.ok) {
                    showMessage('appResult', '✅ Application tracked successfully!');
                    document.getElementById('company').value = '';
                    document.getElementById('position').value = '';
                    document.getElementById('jobUrl').value = '';
                } else {
                    showMessage('appResult', '❌ Failed to track application', false);
                }
            } catch (error) {
                showMessage('appResult', '❌ Network error', false);
            }
        }
        
        async function saveContentIdea() {
            const idea = document.getElementById('contentIdea').value;
            const platform = document.getElementById('platform').value;
            
            if (!idea || !platform) {
                showMessage('contentResult', 'Please fill in idea and select platform', false);
                return;
            }
            
            try {
                const response = await fetch(`${N8N_BASE_URL}/webhook/content-idea`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        idea, 
                        platform, 
                        date: new Date().toISOString().split('T')[0],
                        source_url: window.location.href
                    })
                });
                
                if (response.ok) {
                    showMessage('contentResult', '💡 Idea saved successfully!');
                    document.getElementById('contentIdea').value = '';
                    document.getElementById('platform').value = '';
                } else {
                    showMessage('contentResult', '❌ Failed to save idea', false);
                }
            } catch (error) {
                showMessage('contentResult', '❌ Network error', false);
            }
        }
        
        async function logConnection() {
            const name = document.getElementById('contactName').value;
            const company = document.getElementById('contactCompany').value;
            const notes = document.getElementById('contactNotes').value;
            
            if (!name) {
                showMessage('connectionResult', 'Please enter contact name', false);
                return;
            }
            
            try {
                const response = await fetch(`${N8N_BASE_URL}/webhook/new-connection`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name, 
                        company, 
                        notes, 
                        date: new Date().toISOString().split('T')[0],
                        platform: 'Manual Entry'
                    })
                });
                
                if (response.ok) {
                    showMessage('connectionResult', '🤝 Connection logged!');
                    document.getElementById('contactName').value = '';
                    document.getElementById('contactCompany').value = '';
                    document.getElementById('contactNotes').value = '';
                } else {
                    showMessage('connectionResult', '❌ Failed to log connection', false);
                }
            } catch (error) {
                showMessage('connectionResult', '❌ Network error', false);
            }
        }
    </script>
</body>
</html>
```

### Setup Instructions:

1. **Save as HTML file**: Save the code above as `mobile-app.html`
2. **Replace webhook URL**: Update `YOUR_N8N_WEBHOOK_URL` with your actual n8n instance URL
3. **Host the file**: 
   - Local: Open directly in browser
   - Online: Upload to GitHub Pages, Netlify, or any web hosting
4. **Add to home screen**: On mobile browsers, use "Add to Home Screen" for app-like experience

---

## 📊 Mobile Analytics Dashboard

Create a simple analytics view for mobile:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Career Analytics</title>
    <style>
        /* Same base styles as above */
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-label {
            font-weight: 500;
            color: #333;
        }
        .metric-value {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Career Analytics</h1>
        
        <div class="card">
            <h2>This Week</h2>
            <div class="metric">
                <span class="metric-label">Applications Sent</span>
                <span class="metric-value" id="applications">-</span>
            </div>
            <div class="metric">
                <span class="metric-label">Responses Received</span>
                <span class="metric-value" id="responses">-</span>
            </div>
            <div class="metric">
                <span class="metric-label">Content Published</span>
                <span class="metric-value" id="content">-</span>
            </div>
            <div class="metric">
                <span class="metric-label">New Connections</span>
                <span class="metric-value" id="connections">-</span>
            </div>
        </div>
        
        <button class="button" onclick="refreshData()">🔄 Refresh Data</button>
    </div>

    <script>
        const SHEETS_API_URL = 'YOUR_GOOGLE_SHEETS_API_URL'; // Configure with your Google Sheets API
        
        async function refreshData() {
            try {
                // This would connect to your Google Sheets API or n8n endpoint
                // For demo purposes, showing static data
                document.getElementById('applications').textContent = '5';
                document.getElementById('responses').textContent = '2';
                document.getElementById('content').textContent = '3';
                document.getElementById('connections').textContent = '8';
            } catch (error) {
                console.error('Failed to refresh data:', error);
            }
        }
        
        // Load data on page load
        refreshData();
    </script>
</body>
</html>
```

---

## 📱 iOS Shortcuts Integration

For iOS users, create Shortcuts for quick actions:

### Job Application Tracker Shortcut
1. Open Shortcuts app
2. Create new shortcut
3. Add "Get Text from Input" action
4. Add "Get URLs from Input" action
5. Add "Get My Shortcuts" → "Run Shortcut" 
6. Configure to send data to your n8n webhook

### Quick Content Idea Shortcut
1. Add "Ask for Input" action (Text)
2. Add "Get Current App" action
3. Add "Get Contents of URL" action pointing to your n8n webhook
4. Configure with your content idea endpoint

---

## 🔧 Offline Capabilities

For situations with limited internet:

### Local Storage Solution
```javascript
// Store data locally when offline
function saveLocally(type, data) {
    const stored = JSON.parse(localStorage.getItem('careerData') || '[]');
    stored.push({
        type,
        data,
        timestamp: Date.now(),
        synced: false
    });
    localStorage.setItem('careerData', JSON.stringify(stored));
}

// Sync when back online
function syncData() {
    const stored = JSON.parse(localStorage.getItem('careerData') || '[]');
    const unsynced = stored.filter(item => !item.synced);
    
    unsynced.forEach(async (item) => {
        try {
            await fetch(`${N8N_BASE_URL}/webhook/${item.type}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(item.data)
            });
            
            // Mark as synced
            item.synced = true;
        } catch (error) {
            console.error('Sync failed:', error);
        }
    });
    
    localStorage.setItem('careerData', JSON.stringify(stored));
}

// Check for internet and sync
window.addEventListener('online', syncData);
```

---

## 📲 Progressive Web App (PWA)

Convert to PWA for better mobile experience:

### manifest.json
```json
{
  "name": "Career Automation",
  "short_name": "CareerAuto",
  "description": "Mobile career automation dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker
Basic caching for offline functionality:

```javascript
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('career-automation-v1').then(cache => {
      return cache.addAll([
        '/',
        '/mobile-app.html',
        '/analytics.html'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

---

## 🚀 Quick Setup Summary

1. **Create bookmarklets** for instant job tracking
2. **Save HTML files** for mobile web app
3. **Setup iOS Shortcuts** for native integration
4. **Configure PWA** for app-like experience
5. **Test offline sync** functionality

Your career automation is now truly mobile! 📱✨