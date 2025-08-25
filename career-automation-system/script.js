// Global variables
let currentTab = 'portfolio';
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
let isOffline = !navigator.onLine;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadStoredData();
    updateAnalytics();
    initializeOfflineSupport();
    setupNetworkDetection();
});

// Initialize offline support
function initializeOfflineSupport() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    // Show offline indicator if needed
    updateOfflineStatus();
}

// Setup network detection
function setupNetworkDetection() {
    window.addEventListener('online', () => {
        isOffline = false;
        updateOfflineStatus();
        syncPendingData();
        showMessage('इंटरनेट कनेक्शन वापस आ गया! डेटा सिंक हो रहा है...', 'success');
    });
    
    window.addEventListener('offline', () => {
        isOffline = true;
        updateOfflineStatus();
        showMessage('ऑफलाइन मोड: डेटा लोकल में सेव हो रहा है', 'info');
    });
}

// Update offline status indicator
function updateOfflineStatus() {
    const existingIndicator = document.querySelector('.offline-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (isOffline) {
        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.innerHTML = '<i class="fas fa-wifi"></i> ऑफलाइन मोड - डेटा लोकल में सेव हो रहा है';
        document.body.appendChild(indicator);
    }
}

// Sync pending data when back online
function syncPendingData() {
    const pendingData = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    if (pendingData.length > 0) {
        // In a real app, this would sync with server
        console.log('Syncing pending data:', pendingData);
        localStorage.removeItem('pendingSync');
    }
}

// Tab Navigation
function initializeTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    currentTab = tabName;
}

// Portfolio Builder Functions
function generatePortfolioContent() {
    const projectName = document.getElementById('projectName').value;
    const projectType = document.getElementById('projectType').value;
    const description = document.getElementById('projectDescription').value;
    const tools = document.getElementById('toolsUsed').value;
    const dataset = document.getElementById('datasetSource').value;
    const findings = document.getElementById('keyFindings').value;

    if (!projectName || !description) {
        showMessage('कृपया प्रोजेक्ट का नाम और विवरण भरें', 'error');
        return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> Generating...';
    button.disabled = true;

    // Simulate AI processing
    setTimeout(() => {
        const generatedContent = generatePortfolioText(projectName, projectType, description, tools, dataset, findings);
        
        document.getElementById('portfolioContent').innerHTML = generatedContent;
        document.getElementById('portfolioOutput').style.display = 'block';
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        showMessage('कंटेंट सफलतापूर्वक जनरेट किया गया!', 'success');
    }, 2000);
}

function generatePortfolioText(name, type, description, tools, dataset, findings) {
    const typeLabels = {
        'bioinformatics': 'बायोइन्फॉर्मेटिक्स',
        'data-analysis': 'डेटा एनालिसिस',
        'web-design': 'वेब डिज़ाइन',
        'research': 'रिसर्च'
    };

    return `
        <div class="portfolio-content">
            <h3>${name}</h3>
            <p><strong>प्रोजेक्ट प्रकार:</strong> ${typeLabels[type]}</p>
            
            <h4>प्रोजेक्ट अवलोकन</h4>
            <p>${description}</p>
            
            <h4>तकनीकी विवरण</h4>
            <ul>
                <li><strong>उपयोग किए गए टूल्स:</strong> ${tools || 'Python, Pandas, Matplotlib'}</li>
                <li><strong>डेटासेट स्रोत:</strong> ${dataset || 'Public Dataset'}</li>
            </ul>
            
            <h4>मुख्य निष्कर्ष</h4>
            <p>${findings || 'डेटा एनालिसिस के माध्यम से महत्वपूर्ण पैटर्न और insights प्राप्त किए गए।'}</p>
            
            <h4>GitHub README.md</h4>
            <pre><code># ${name}

## प्रोजेक्ट विवरण
${description}

## तकनीकी स्टैक
- ${tools || 'Python, Pandas, Matplotlib, Seaborn'}

## डेटा स्रोत
${dataset || 'Public Dataset from Kaggle/NCBI'}

## मुख्य निष्कर्ष
${findings || 'डेटा एनालिसिस के माध्यम से महत्वपूर्ण insights प्राप्त किए गए।'}

## इंस्टॉलेशन और उपयोग
\`\`\`bash
pip install -r requirements.txt
python main.py
\`\`\`

## लाइसेंस
MIT License</code></pre>
        </div>
    `;
}

function saveProject() {
    const projectData = {
        id: Date.now(),
        name: document.getElementById('projectName').value,
        type: document.getElementById('projectType').value,
        description: document.getElementById('projectDescription').value,
        tools: document.getElementById('toolsUsed').value,
        dataset: document.getElementById('datasetSource').value,
        findings: document.getElementById('keyFindings').value,
        date: new Date().toLocaleDateString('hi-IN'),
        timestamp: new Date().toISOString()
    };

    if (!projectData.name || !projectData.description) {
        showMessage('कृपया प्रोजेक्ट का नाम और विवरण भरें', 'error');
        return;
    }

    try {
        projects.push(projectData);
        
        // Enhanced local storage with backup
        saveDataWithBackup('projects', projects);
        
        // If offline, add to pending sync
        if (isOffline) {
            const pendingSync = JSON.parse(localStorage.getItem('pendingSync') || '[]');
            pendingSync.push({
                type: 'project',
                data: projectData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('pendingSync', JSON.stringify(pendingSync));
        }
        
        // Clear form
        clearPortfolioForm();
        showMessage('प्रोजेक्ट सफलतापूर्वक सेव किया गया!', 'success');
        updateAnalytics();
        
    } catch (error) {
        console.error('Error saving project:', error);
        showMessage('प्रोजेक्ट सेव करने में त्रुटि हुई। कृपया पुनः प्रयास करें।', 'error');
    }
}

// Enhanced data saving with backup
function saveDataWithBackup(key, data) {
    try {
        // Save main data
        localStorage.setItem(key, JSON.stringify(data));
        
        // Create backup
        localStorage.setItem(`${key}_backup`, JSON.stringify({
            data: data,
            timestamp: new Date().toISOString(),
            version: '1.2'
        }));
        
        // Clean old backups (keep only latest 3)
        const backupKeys = Object.keys(localStorage).filter(k => k.startsWith(`${key}_backup_`));
        if (backupKeys.length > 2) {
            const sortedKeys = backupKeys.sort();
            localStorage.removeItem(sortedKeys[0]);
        }
        
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showMessage('स्टोरेज भर गया है। कुछ पुराना डेटा साफ करें।', 'error');
            // Try to recover by clearing old backups
            clearOldBackups();
        } else {
            throw error;
        }
    }
}

// Clear old backups to free space
function clearOldBackups() {
    const keys = Object.keys(localStorage);
    const backupKeys = keys.filter(k => k.includes('_backup_'));
    
    // Remove oldest backups
    backupKeys.sort().slice(0, Math.floor(backupKeys.length / 2)).forEach(key => {
        localStorage.removeItem(key);
    });
}

function clearPortfolioForm() {
    document.getElementById('projectName').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('toolsUsed').value = '';
    document.getElementById('datasetSource').value = '';
    document.getElementById('keyFindings').value = '';
    document.getElementById('portfolioOutput').style.display = 'none';
}

// Social Media Generator Functions
function generateSocialPost() {
    const platform = document.getElementById('platform').value;
    const postType = document.getElementById('postType').value;
    const content = document.getElementById('postContent').value;
    const tone = document.getElementById('tone').value;
    const hashtags = document.getElementById('hashtags').value;

    if (!content) {
        showMessage('कृपया पोस्ट का विषय भरें', 'error');
        return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> Generating...';
    button.disabled = true;

    setTimeout(() => {
        const generatedPost = generateSocialContent(platform, postType, content, tone, hashtags);
        
        document.getElementById('socialContent').innerHTML = generatedPost;
        document.getElementById('socialOutput').style.display = 'block';
        
        button.innerHTML = originalText;
        button.disabled = false;
        
        showMessage('सोशल मीडिया पोस्ट जनरेट किया गया!', 'success');
    }, 2000);
}

function generateSocialContent(platform, postType, content, tone, hashtags) {
    const platformNames = {
        'linkedin': 'LinkedIn',
        'facebook': 'Facebook',
        'twitter': 'Twitter'
    };

    const postTypes = {
        'project': 'प्रोजेक्ट शेयर',
        'achievement': 'उपलब्धि',
        'learning': 'सीख',
        'industry': 'इंडस्ट्री इनसाइट'
    };

    const tones = {
        'professional': 'प्रोफेशनल',
        'casual': 'कैजुअल',
        'enthusiastic': 'उत्साही',
        'educational': 'शैक्षिक'
    };

    const defaultHashtags = '#Bioinformatics #DataAnalysis #Biotechnology #Python #Pharma #ClinicalResearch';
    
    return `
        <div class="social-content">
            <h4>${platformNames[platform]} पोस्ट</h4>
            <div class="post-preview">
                <p><strong>पोस्ट प्रकार:</strong> ${postTypes[postType]}</p>
                <p><strong>टोन:</strong> ${tones[tone]}</p>
                
                <div class="post-text">
                    <p>🚀 <strong>${content}</strong></p>
                    <p>🔬 बायोइन्फॉर्मेटिक्स और डेटा एनालिसिस के क्षेत्र में काम करते हुए, मैंने यह महत्वपूर्ण सीख प्राप्त की है।</p>
                    <p>💡 यह प्रोजेक्ट मेरे करियर में एक महत्वपूर्ण मील का पत्थर है।</p>
                    <p>📊 डेटा-संचालित निर्णय लेने की शक्ति को समझना आज के समय में बहुत महत्वपूर्ण है।</p>
                    <p>🔗 पूरा केस स्टडी देखने के लिए मेरी पोर्टफोलियो वेबसाइट पर जाएँ।</p>
                    <p>${hashtags || defaultHashtags}</p>
                </div>
            </div>
            
            <div class="post-tips">
                <h5>पोस्टिंग टिप्स:</h5>
                <ul>
                    <li>सुबह 9-11 बजे या शाम 5-7 बजे पोस्ट करें</li>
                    <li>इमेज या इन्फोग्राफिक जोड़ें</li>
                    <li>कमेंट्स में जुड़ाव बनाएं</li>
                    <li>सप्ताह में 2-3 पोस्ट करें</li>
                </ul>
            </div>
        </div>
    `;
}

function schedulePost() {
    showMessage('पोस्ट शेड्यूलिंग फीचर जल्द ही उपलब्ध होगा!', 'success');
}

// Resume Optimizer Functions
function optimizeContent() {
    const optimizeType = document.getElementById('optimizeType').value;
    const currentContent = document.getElementById('currentContent').value;
    const targetRole = document.getElementById('targetRole').value;
    const targetCompany = document.getElementById('targetCompany').value;

    if (!currentContent) {
        showMessage('कृपया वर्तमान कंटेंट भरें', 'error');
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> Optimizing...';
    button.disabled = true;

    setTimeout(() => {
        const optimizedContent = generateOptimizedContent(optimizeType, currentContent, targetRole, targetCompany);
        
        document.getElementById('resumeContent').innerHTML = optimizedContent;
        document.getElementById('resumeOutput').style.display = 'block';
        
        button.innerHTML = originalText;
        button.disabled = false;
        
        showMessage('कंटेंट सफलतापूर्वक optimize किया गया!', 'success');
    }, 2000);
}

function generateOptimizedContent(type, content, role, company) {
    const typeLabels = {
        'headline': 'LinkedIn हेडलाइन',
        'summary': 'About सेक्शन',
        'experience': 'एक्सपीरियंस डिस्क्रिप्शन',
        'skills': 'स्किल्स सेक्शन'
    };

    const headlines = [
        `🔬 बायोटेक्नोलॉजी प्रोफेशनल | बायोइन्फॉर्मेटिक्स में रुचि | Python & Data Analysis`,
        `📊 बायोइन्फॉर्मेटिक्स एनालिस्ट | डेटा-संचालित रिसर्च | फार्मा इंडस्ट्री में करियर`,
        `🧬 बायोटेक्नोलॉजी डिप्लोमा | बायोइन्फॉर्मेटिक्स में विशेषज्ञता | AI & ML में अनुभव`,
        `💻 बायोडेटा एनालिस्ट | क्लिनिकल रिसर्च | Python, SQL, Web Development`,
        `🔬 बायोटेक्नोलॉजी से बायोइन्फॉर्मेटिक्स तक | डेटा एनालिसिस में पैशन | फार्मा करियर`
    ];

    const summaries = [
        `बायोटेक्नोलॉजी में डिप्लोमा के साथ, मैं बायोइन्फॉर्मेटिक्स और डेटा एनालिसिस के क्षेत्र में अपना करियर बनाने के लिए तैयार हूँ। मेरे पास Python, SQL, और वेब डिज़ाइन में मजबूत कौशल हैं, जो मुझे फार्मास्युटिकल और क्लिनिकल रिसर्च कंपनियों में मूल्यवान बनाते हैं।`,
        
        `एक बायोटेक्नोलॉजी प्रोफेशनल के रूप में, मैं डेटा-संचालित निर्णय लेने की शक्ति में विश्वास रखता हूँ। मेरी बायोइन्फॉर्मेटिक्स में 1-महीने की इंटर्नशिप और Python, SQL में मजबूत कौशल मुझे फार्मा इंडस्ट्री में सफल करियर बनाने में मदद करेंगे।`,
        
        `बायोटेक्नोलॉजी से बायोइन्फॉर्मेटिक्स तक का मेरा सफर मुझे डेटा एनालिसिस और क्लिनिकल रिसर्च के बीच की खाई को पाटने में मदद करता है। मेरे कौशल में Python प्रोग्रामिंग, डेटा विज़ुअलाइज़ेशन, और वेब डिज़ाइन शामिल हैं।`
    ];

    let optimizedText = '';

    switch(type) {
        case 'headline':
            optimizedText = `<h4>${typeLabels[type]} विकल्प:</h4><ul>`;
            headlines.forEach(headline => {
                optimizedText += `<li>${headline}</li>`;
            });
            optimizedText += '</ul>';
            break;
            
        case 'summary':
            optimizedText = `<h4>${typeLabels[type]} विकल्प:</h4><ul>`;
            summaries.forEach(summary => {
                optimizedText += `<li>${summary}</li>`;
            });
            optimizedText += '</ul>';
            break;
            
        default:
            optimizedText = `
                <h4>Optimized ${typeLabels[type]}:</h4>
                <p><strong>मूल कंटेंट:</strong></p>
                <p>${content}</p>
                <p><strong>Optimized कंटेंट:</strong></p>
                <p>${content.replace(/मैंने/g, 'मैंने सफलतापूर्वक').replace(/किया/g, 'पूरा किया')}</p>
            `;
    }

    return optimizedText;
}

function generateMultiple() {
    showMessage('कई विकल्प जनरेट करने के लिए optimizeContent() फंक्शन का उपयोग करें', 'success');
}

// Job Tracker Functions
function searchJobs() {
    const role = document.getElementById('jobRole').value;
    const location = document.getElementById('jobLocation').value;
    const company = document.getElementById('jobCompany').value;

    showMessage(`नौकरी खोज रहा हूँ: ${role} in ${location} at ${company}`, 'success');
    
    // Simulate job search
    setTimeout(() => {
        updateJobList();
    }, 1000);
}

function updateJobList() {
    const jobList = document.querySelector('.job-list');
    const newJobs = [
        {
            title: 'Bioinformatics Analyst',
            company: 'Sun Pharma',
            location: 'Mumbai, Maharashtra',
            description: 'Looking for a skilled bioinformatics analyst with Python experience in drug discovery and clinical data analysis.'
        },
        {
            title: 'Data Analyst - Clinical Research',
            company: 'Zydus Cadila',
            location: 'Ahmedabad, Gujarat',
            description: 'Join our clinical research team to analyze patient data and contribute to drug development process.'
        },
        {
            title: 'Research Associate - Bioinformatics',
            company: 'Alembic Pharmaceuticals',
            location: 'Vadodara, Gujarat',
            description: 'Work on genomic data analysis and contribute to our precision medicine initiatives.'
        }
    ];

    jobList.innerHTML = '';
    newJobs.forEach(job => {
        jobList.innerHTML += `
            <div class="job-item">
                <h4>${job.title}</h4>
                <p class="company">${job.company}</p>
                <p class="location">${job.location}</p>
                <p class="description">${job.description}</p>
                <div class="job-actions">
                    <button class="btn btn-sm btn-primary" onclick="applyForJob('${job.title}', '${job.company}')">Apply</button>
                    <button class="btn btn-sm btn-secondary" onclick="saveJob('${job.title}', '${job.company}')">Save</button>
                </div>
            </div>
        `;
    });
}

function applyForJob(title, company) {
    showMessage(`${company} में ${title} के लिए आवेदन किया गया!`, 'success');
}

function saveJob(title, company) {
    showMessage(`${company} में ${title} सेव किया गया!`, 'success');
}

// AI Prompts Functions
function copyPrompt(button) {
    const promptText = button.parentElement.querySelector('p').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#48bb78';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// Analytics Functions
function updateAnalytics() {
    const projectCount = projects.length;
    const socialCount = socialPosts.length;
    
    // Update metrics
    document.querySelector('.analytics-card:nth-child(1) .metric').textContent = projectCount;
    document.querySelector('.analytics-card:nth-child(2) .metric').textContent = socialCount;
    
    // Update storage info
    updateStorageInfo();
}

// Update storage information
function updateStorageInfo() {
    try {
        const storageInfo = document.getElementById('storageInfo');
        if (storageInfo && 'storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
                const used = (estimate.usage / 1024 / 1024).toFixed(2);
                const quota = (estimate.quota / 1024 / 1024).toFixed(2);
                storageInfo.textContent = `उपयोग: ${used} MB / ${quota} MB (${projects.length} प्रोजेक्ट्स, ${socialPosts.length} पोस्ट्स)`;
            });
        } else if (storageInfo) {
            // Fallback for browsers without storage API
            const dataSize = new Blob([JSON.stringify(projects) + JSON.stringify(socialPosts)]).size;
            const sizeInKB = (dataSize / 1024).toFixed(2);
            storageInfo.textContent = `अनुमानित डेटा: ${sizeInKB} KB (${projects.length} प्रोजेक्ट्स, ${socialPosts.length} पोस्ट्स)`;
        }
    } catch (error) {
        console.log('Could not estimate storage:', error);
    }
}

// Utility Functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at top of main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function loadStoredData() {
    // Load projects and social posts from localStorage
    projects = JSON.parse(localStorage.getItem('projects')) || [];
    socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                switchTab('portfolio');
                break;
            case '2':
                e.preventDefault();
                switchTab('social');
                break;
            case '3':
                e.preventDefault();
                switchTab('resume');
                break;
            case '4':
                e.preventDefault();
                switchTab('jobs');
                break;
            case '5':
                e.preventDefault();
                switchTab('prompts');
                break;
            case '6':
                e.preventDefault();
                switchTab('analytics');
                break;
        }
    }
});

// Auto-save functionality
setInterval(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('socialPosts', JSON.stringify(socialPosts));
}, 30000); // Save every 30 seconds

// Enhanced export functionality
function exportData() {
    try {
        const data = {
            projects: projects,
            socialPosts: socialPosts,
            exportDate: new Date().toISOString(),
            version: '1.2',
            metadata: {
                totalProjects: projects.length,
                totalPosts: socialPosts.length,
                lastModified: localStorage.getItem('lastModified') || new Date().toISOString()
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `career-automation-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showMessage('डेटा सफलतापूर्वक एक्सपोर्ट किया गया!', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showMessage('एक्सपोर्ट में त्रुटि हुई। कृपया पुनः प्रयास करें।', 'error');
    }
}

// Import functionality
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (importedData.projects && Array.isArray(importedData.projects)) {
                        // Confirm before overwriting
                        if (confirm('क्या आप वर्तमान डेटा को इम्पोर्ट किए गए डेटा से बदलना चाहते हैं?')) {
                            // Backup current data
                            const backupData = {
                                projects: projects,
                                socialPosts: socialPosts,
                                timestamp: new Date().toISOString()
                            };
                            localStorage.setItem('pre_import_backup', JSON.stringify(backupData));
                            
                            // Import new data
                            projects = importedData.projects || [];
                            socialPosts = importedData.socialPosts || [];
                            
                            // Save imported data
                            saveDataWithBackup('projects', projects);
                            saveDataWithBackup('socialPosts', socialPosts);
                            localStorage.setItem('lastModified', new Date().toISOString());
                            
                            // Update UI
                            updateAnalytics();
                            showMessage('डेटा सफलतापूर्वक इम्पोर्ट किया गया!', 'success');
                        }
                    } else {
                        showMessage('अवैध फ़ाइल फॉर्मेट। कृपया वैध JSON फ़ाइल चुनें।', 'error');
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    showMessage('फ़ाइल पढ़ने में त्रुटि। कृपया वैध JSON फ़ाइल चुनें।', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Restore from backup
function restoreFromBackup() {
    const backup = localStorage.getItem('pre_import_backup');
    if (backup) {
        try {
            const backupData = JSON.parse(backup);
            if (confirm('क्या आप पिछले बैकअप से डेटा रिस्टोर करना चाहते हैं?')) {
                projects = backupData.projects || [];
                socialPosts = backupData.socialPosts || [];
                
                saveDataWithBackup('projects', projects);
                saveDataWithBackup('socialPosts', socialPosts);
                
                updateAnalytics();
                showMessage('बैकअप से डेटा सफलतापूर्वक रिस्टोर किया गया!', 'success');
            }
        } catch (error) {
            showMessage('बैकअप रिस्टोर करने में त्रुटि हुई।', 'error');
        }
    } else {
        showMessage('कोई बैकअप उपलब्ध नहीं है।', 'info');
    }
}

// Initialize tooltips and help text
function initializeHelp() {
    const helpTexts = {
        'projectName': 'अपने प्रोजेक्ट का स्पष्ट और आकर्षक नाम दें',
        'projectDescription': 'प्रोजेक्ट के लक्ष्य, प्रक्रिया और परिणामों का विस्तृत विवरण',
        'toolsUsed': 'उपयोग किए गए प्रोग्रामिंग भाषाएं, लाइब्रेरीज और टूल्स',
        'datasetSource': 'डेटा का स्रोत (जैसे: Kaggle, NCBI, TCGA)',
        'keyFindings': 'प्रोजेक्ट से प्राप्त मुख्य insights और निष्कर्ष'
    };

    Object.keys(helpTexts).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = helpTexts[id];
        }
    });
}

// Initialize help on load
document.addEventListener('DOMContentLoaded', initializeHelp);