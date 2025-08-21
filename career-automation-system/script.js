// Global variables
let currentTab = 'portfolio';
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadStoredData();
    updateAnalytics();
});

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
        date: new Date().toLocaleDateString('hi-IN')
    };

    if (!projectData.name || !projectData.description) {
        showMessage('कृपया प्रोजेक्ट का नाम और विवरण भरें', 'error');
        return;
    }

    projects.push(projectData);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Clear form
    clearPortfolioForm();
    showMessage('प्रोजेक्ट सफलतापूर्वक सेव किया गया!', 'success');
    updateAnalytics();
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

// Export functionality
function exportData() {
    const data = {
        projects: projects,
        socialPosts: socialPosts,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-automation-data.json';
    a.click();
    URL.revokeObjectURL(url);
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
// Voice AI Agent Integration
let voiceAgent = null;
let isVoiceListening = false;

// Voice AI Agent Class (Simplified version for integration)
class VoiceAIAgent {
    constructor(config = {}) {
        this.config = {
            language: config.language || 'hi-IN',
            openaiApiKey: config.openaiApiKey || null,
            n8nWebhookUrl: config.n8nWebhookUrl || null,
            ...config
        };

        this.isListening = false;
        this.conversationHistory = [];
        this.recognition = null;
        this.synthesis = null;
        
        this.initializeServices();
    }

    initializeServices() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = this.config.language;
            
            this.setupRecognitionHandlers();
        }

        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    setupRecognitionHandlers() {
        this.recognition.onstart = () => {
            this.isListening = true;
            this.onListeningStart();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.onListeningEnd();
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.processVoiceCommand(finalTranscript);
            }

            this.onTranscription(finalTranscript, interimTranscript);
        };

        this.recognition.onerror = (event) => {
            this.onError(event.error);
        };
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    async processVoiceCommand(transcript) {
        try {
            this.conversationHistory.push({
                role: 'user',
                content: transcript,
                timestamp: new Date().toISOString()
            });

            // Process the command locally (simplified version)
            const response = await this.processCommandLocally(transcript);
            
            this.speak(response);
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Error processing voice command:', error);
            this.speak('माफ़ करें, आपके कमांड को प्रोसेस करने में कोई समस्या हुई है।');
        }
    }

    async processCommandLocally(transcript) {
        const lowerText = transcript.toLowerCase();
        
        // LinkedIn post generation
        if (lowerText.includes('linkedin') && lowerText.includes('post')) {
            const topic = this.extractTopic(lowerText);
            return this.generateLinkedInPost(topic);
        }
        
        // Job application tracking
        if (lowerText.includes('job') || lowerText.includes('application') || lowerText.includes('applied')) {
            return this.trackJobApplication(lowerText);
        }
        
        // Resume optimization
        if (lowerText.includes('resume') || lowerText.includes('optimize')) {
            return this.optimizeResume(lowerText);
        }
        
        // n8n workflow
        if (lowerText.includes('workflow') || lowerText.includes('n8n')) {
            return await this.sendToN8n(lowerText);
        }
        
        // Default response
        return 'मैं समझ गया। मैं निम्नलिखित कार्य कर सकता हूं: LinkedIn posts बना सकता हूं, job applications track कर सकता हूं, resume optimize कर सकता हूं, और n8n workflows trigger कर सकता हूं।';
    }

    extractTopic(text) {
        // Simple topic extraction
        const words = text.split(' ');
        const projectKeywords = ['python', 'data', 'analysis', 'bioinformatics', 'biotechnology', 'project'];
        const foundKeywords = words.filter(word => projectKeywords.includes(word.toLowerCase()));
        return foundKeywords.length > 0 ? foundKeywords.join(' ') : 'Professional Development';
    }

    generateLinkedInPost(topic) {
        const post = `🚀 ${topic} के बारे में नई जानकारी

🔬 बायोइन्फॉर्मेटिक्स और डेटा एनालिसिस के क्षेत्र में काम करते हुए, मैंने यह महत्वपूर्ण सीख प्राप्त की है।

#Bioinformatics #DataAnalysis #Biotechnology #Python #CareerGrowth`;

        // Save to existing system
        const posts = JSON.parse(localStorage.getItem('socialPosts')) || [];
        posts.push({
            platform: 'linkedin',
            content: post,
            createdAt: new Date().toISOString(),
            generatedBy: 'voice'
        });
        localStorage.setItem('socialPosts', JSON.stringify(posts));
        socialPosts = posts; // Update global variable

        return `LinkedIn पोस्ट सफलतापूर्वक बनाया गया। Topic: ${topic}`;
    }

    trackJobApplication(text) {
        // Extract company and position from text
        const companies = ['sun pharma', 'biocon', 'dr reddy', 'lupin', 'cipla', 'glenmark'];
        const foundCompany = companies.find(company => text.toLowerCase().includes(company)) || 'Unknown Company';
        
        const applications = JSON.parse(localStorage.getItem('jobApplications')) || [];
        applications.push({
            company: foundCompany,
            position: 'Data Analyst',
            status: 'applied',
            appliedDate: new Date().toISOString(),
            addedBy: 'voice'
        });
        localStorage.setItem('jobApplications', JSON.stringify(applications));

        return `${foundCompany} में job application successfully track किया गया।`;
    }

    optimizeResume(text) {
        return 'Resume optimization के लिए विस्तृत content की जरूरत है। कृपया Resume Optimizer tab में जाकर complete details provide करें।';
    }

    async sendToN8n(text) {
        if (!this.config.n8nWebhookUrl) {
            return 'n8n webhook URL configure नहीं है। कृपया configuration में URL add करें।';
        }

        try {
            const response = await fetch(this.config.n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    workflow: 'voice_command',
                    data: { command: text },
                    timestamp: new Date().toISOString(),
                    source: 'voice-agent'
                })
            });

            if (response.ok) {
                return 'n8n workflow को सफलतापूर्वक trigger किया गया।';
            } else {
                return 'n8n workflow में कोई समस्या हुई।';
            }
        } catch (error) {
            return 'n8n connection में समस्या हुई।';
        }
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.config.language;
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            const voices = this.synthesis.getVoices();
            const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
            if (hindiVoice) {
                utterance.voice = hindiVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    onListeningStart() {
        updateVoiceStatus('🎤 सुन रहा हूँ... बोलिए!', 'listening');
        const micBtn = document.getElementById('voiceMicButton');
        if (micBtn) micBtn.classList.add('listening');
        addVoiceLog('Started listening for voice commands');
    }

    onListeningEnd() {
        updateVoiceStatus('Voice AI Agent तैयार है', 'ready');
        const micBtn = document.getElementById('voiceMicButton');
        if (micBtn) micBtn.classList.remove('listening');
        addVoiceLog('Stopped listening');
    }

    onTranscription(final, interim) {
        const transcriptionDiv = document.getElementById('voiceCurrentTranscription');
        if (transcriptionDiv) {
            if (final) {
                transcriptionDiv.innerHTML = `<strong>आपने कहा:</strong> ${final}`;
                addToVoiceConversationHistory('user', final);
                addVoiceLog(`Transcription: ${final}`);
            } else if (interim) {
                transcriptionDiv.innerHTML = `<em>सुन रहा हूँ:</em> ${interim}`;
            }
        }
    }

    onError(error) {
        updateVoiceStatus(`❌ Error: ${error}`, 'error');
        addVoiceLog(`Error: ${error}`);
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// Voice AI Helper Functions
function initializeVoiceAI() {
    const config = loadVoiceConfiguration();
    voiceAgent = new VoiceAIAgent(config);
    
    // Setup event listeners
    setupVoiceEventListeners();
    
    addVoiceLog('Voice AI Agent initialized successfully');
    addVoiceLog('Ready for voice commands...');
}

function setupVoiceEventListeners() {
    const micButton = document.getElementById('voiceMicButton');
    
    if (micButton) {
        micButton.addEventListener('click', () => {
            if (isVoiceListening) {
                voiceAgent.stopListening();
                isVoiceListening = false;
            } else {
                voiceAgent.startListening();
                isVoiceListening = true;
            }
        });
    }

    // Configuration change handlers
    const configInputs = ['voiceOpenaiKey', 'voiceLanguage', 'voiceN8nWebhook'];
    configInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateVoiceConfiguration);
        }
    });

    // Test n8n connection
    const testBtn = document.getElementById('testN8nBtn');
    if (testBtn) {
        testBtn.addEventListener('click', testN8nConnection);
    }

    // Clear history button
    const clearBtn = document.getElementById('clearVoiceHistoryBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearVoiceHistory);
    }
}

function updateVoiceConfiguration() {
    if (voiceAgent) {
        const newConfig = {
            language: document.getElementById('voiceLanguage')?.value || 'hi-IN',
            openaiApiKey: document.getElementById('voiceOpenaiKey')?.value || null,
            n8nWebhookUrl: document.getElementById('voiceN8nWebhook')?.value || null
        };
        
        voiceAgent.updateConfig(newConfig);
        saveVoiceConfiguration();
        addVoiceLog('Configuration updated');
    }
}

function updateVoiceStatus(message, type = 'info') {
    const statusDiv = document.getElementById('voiceStatus');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `voice-status ${type}`;
    }
}

function addToVoiceConversationHistory(role, content) {
    const historyDiv = document.getElementById('voiceConversationHistory');
    if (historyDiv) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `conversation-message ${role}`;
        
        const time = new Date().toLocaleString('hi-IN');
        messageDiv.innerHTML = `
            <div class="message-time">${time}</div>
            <div>${content}</div>
        `;
        
        historyDiv.appendChild(messageDiv);
        historyDiv.scrollTop = historyDiv.scrollHeight;
    }
}

function addVoiceLog(message) {
    const logsDiv = document.getElementById('voiceSystemLogs');
    if (logsDiv) {
        const time = new Date().toLocaleTimeString();
        logsDiv.textContent += `[${time}] ${message}\n`;
        logsDiv.scrollTop = logsDiv.scrollHeight;
    }
}

function clearVoiceHistory() {
    if (voiceAgent) {
        voiceAgent.clearHistory();
        const historyDiv = document.getElementById('voiceConversationHistory');
        if (historyDiv) {
            historyDiv.innerHTML = '';
        }
        addVoiceLog('Conversation history cleared');
    }
}

function testN8nConnection() {
    const webhookUrl = document.getElementById('voiceN8nWebhook')?.value;
    if (!webhookUrl) {
        alert('कृपया n8n webhook URL enter करें');
        return;
    }

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            test: true,
            message: 'Voice AI Agent connection test',
            timestamp: new Date().toISOString()
        })
    })
    .then(response => {
        if (response.ok) {
            alert('✅ n8n connection successful!');
            addVoiceLog('n8n connection test successful');
        } else {
            alert('❌ n8n connection failed');
            addVoiceLog('n8n connection test failed');
        }
    })
    .catch(error => {
        alert('❌ n8n connection error: ' + error.message);
        addVoiceLog('n8n connection error: ' + error.message);
    });
}

function saveVoiceConfiguration() {
    const config = {
        openaiKey: document.getElementById('voiceOpenaiKey')?.value || '',
        language: document.getElementById('voiceLanguage')?.value || 'hi-IN',
        n8nWebhook: document.getElementById('voiceN8nWebhook')?.value || ''
    };
    localStorage.setItem('voiceAIConfig', JSON.stringify(config));
}

function loadVoiceConfiguration() {
    const savedConfig = localStorage.getItem('voiceAIConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        // Set form values when elements are available
        setTimeout(() => {
            if (document.getElementById('voiceOpenaiKey')) {
                document.getElementById('voiceOpenaiKey').value = config.openaiKey || '';
            }
            if (document.getElementById('voiceLanguage')) {
                document.getElementById('voiceLanguage').value = config.language || 'hi-IN';
            }
            if (document.getElementById('voiceN8nWebhook')) {
                document.getElementById('voiceN8nWebhook').value = config.n8nWebhook || '';
            }
        }, 100);
        
        return {
            openaiApiKey: config.openaiKey,
            language: config.language || 'hi-IN',
            n8nWebhookUrl: config.n8nWebhook
        };
    }
    
    return {
        language: 'hi-IN'
    };
}

// Override switchTab to handle voice AI initialization
const originalSwitchTab = window.switchTab;
if (originalSwitchTab) {
    window.switchTab = function(tabName) {
        originalSwitchTab(tabName);
        
        // Initialize voice AI when voice tab is opened
        if (tabName === 'voice' && !voiceAgent) {
            setTimeout(() => {
                initializeVoiceAI();
            }, 100);
        }
    };
}
