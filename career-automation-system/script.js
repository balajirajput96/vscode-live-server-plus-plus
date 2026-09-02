// Global variables
let currentTab = 'portfolio';
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
let scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts')) || [];

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
                <li><strong>उपयोग किए गए टूल्स:</strong> ${tools || 'केवल अपने verified tools जोड़ें'}</li>
                <li><strong>डेटासेट स्रोत:</strong> ${dataset || 'स्रोत और अनुमति सत्यापित करके जोड़ें'}</li>
            </ul>

            <h4>मुख्य निष्कर्ष</h4>
            <p>${findings || 'केवल सत्यापित निष्कर्ष और उनका स्रोत जोड़ें।'}</p>
            <p><em>Draft template: publish या portfolio में जोड़ने से पहले हर claim को अपने records से verify करें।</em></p>

            <h4>GitHub README.md</h4>
            <pre><code># ${name}

## प्रोजेक्ट विवरण
${description}

## तकनीकी स्टैक
            - ${tools || 'केवल verified tools जोड़ें'}

## डेटा स्रोत
            ${dataset || 'स्रोत और अनुमति सत्यापित करके जोड़ें'}

## मुख्य निष्कर्ष
            ${findings || 'केवल सत्यापित निष्कर्ष और उनका स्रोत जोड़ें।'}

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

    const defaultHashtags = '#Draft #ReviewBeforePublishing';

    return `
        <div class="social-content">
            <h4>${platformNames[platform]} पोस्ट</h4>
            <div class="post-preview">
                <p><strong>पोस्ट प्रकार:</strong> ${postTypes[postType]}</p>
                <p><strong>टोन:</strong> ${tones[tone]}</p>

                <div class="post-text">
                    <p><strong>Draft topic:</strong> ${content}</p>
                    <p>[अपनी verified सीख या finding यहाँ जोड़ें।]</p>
                    <p>[सिर्फ verified project details, source link, और allowed media reference जोड़ें।]</p>
                    <p><em>यह local draft है; approval के बिना publish नहीं किया जाएगा।</em></p>
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
    const content = document.querySelector('#socialContent .post-text')?.textContent;
    if (!content) {
        showMessage('पहले पोस्ट generate करें!', 'error');
        return;
    }

    const postData = {
        id: Date.now(),
        type: 'social_media_post',
        platform: document.getElementById('platform').value,
        content,
        status: 'draft_only',
        timestamp: new Date().toISOString()
    };

    scheduledPosts.push(postData);
    localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
    showMessage('पोस्ट केवल local draft queue में सेव हुआ है। Publish के लिए server-side approval आवश्यक है।', 'info');
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
        '[Verified qualification] | [Verified role focus] | [Verified skill or domain]',
        '[Verified current role] | [Verified industry experience] | [Verified career objective]'
    ];

    const summaries = [
        'Draft template: replace every bracketed field with facts present in your resume, portfolio, or supporting records. Do not add degrees, skills, tools, dates, metrics, employers, or achievements that cannot be verified.'
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
                <p><strong>Review cue:</strong></p>
                <p>इस text को केवल clarity के लिए edit करें। कोई नया degree, skill, employer, metric, certification, responsibility, या achievement न जोड़ें।</p>
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

    showMessage(`Local UI draft results तैयार हो रहे हैं: ${role} in ${location} at ${company}. ये verified job listings नहीं हैं।`, 'info');

    // Simulate job search
    setTimeout(() => {
        updateJobList();
    }, 1000);
}

function updateJobList() {
    const jobList = document.querySelector('.job-list');
    const newJobs = [
        {
            title: 'Example role — verify official source',
            company: 'Example employer',
            location: 'Add verified location',
            description: 'Illustrative UI record only. Add an official source URL and verify requirements before drafting any application.'
        },
        {
            title: 'Example role — verify official source',
            company: 'Example employer',
            location: 'Add verified location',
            description: 'Illustrative UI record only. No employer has been contacted and no application is created.'
        },
        {
            title: 'Example role — verify official source',
            company: 'Example employer',
            location: 'Add verified location',
            description: 'Illustrative UI record only. Use an official listing and a truthful candidate profile before any draft handoff.'
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
                    <button class="btn btn-sm btn-primary" onclick="applyForJob('${job.title}', '${job.company}')">Prepare draft</button>
                    <button class="btn btn-sm btn-secondary" onclick="saveJob('${job.title}', '${job.company}')">Save</button>
                </div>
            </div>
        `;
    });
}

function applyForJob(title, company) {
    showMessage(`${company} में ${title} के लिए local draft prepared है। कोई application submit नहीं हुआ।`, 'info');
}

function saveJob(title, company) {
    showMessage(`${company} में ${title} local review के लिए saved है।`, 'info');
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

// Bullet Points Generator Functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        // Find the button that triggered this copy
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> कॉपी हो गया!';
        button.style.background = '#48bb78';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
        
        showMessage('Text copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showMessage('Copy failed. Please try again.', 'error');
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

// Microsoft Copilot Integration Functions
function generateCopilotProject(projectType) {
    const templates = {
        'lab-automation': {
            name: 'Lab automation draft template',
            description: 'Draft only — replace with a verified project, source, and permitted tools.',
            linkedinPost: `[DRAFT — NOT FOR PUBLISHING]

Project topic: lab workflow improvement.

Replace this template with verified information only:
- the actual problem and project scope
- tools that were actually used
- a measured result with its source and measurement method, if applicable
- any review or compliance status only when documented

Do not state that a system was completed, deployed, compliant, integrated, or faster unless those facts are supported by records.`,
            resumeBullet: '[DRAFT] Describe only a verified contribution, verified tools, and a documented outcome. Remove this line until all facts are supported.'
        },
        'clinical-dashboard': {
            name: 'Clinical dashboard draft template',
            description: 'Draft only — do not represent this as a deployed clinical system.',
            linkedinPost: `[DRAFT — NOT FOR PUBLISHING]

Project topic: clinical dashboard concept.

Before using this copy, add only verified, permissioned details. Never claim use of patient data, a clinical deployment, a compliance status, accuracy improvement, or a performance result without documentary evidence and required authorization.`,
            resumeBullet: '[DRAFT] Add a factual, source-supported description only after the project, data permissions, tools, and outcome are verified.'
        },
        'api-pipeline': {
            name: 'Bioinformatics pipeline draft template',
            description: 'Draft only — replace with a verified, reproducible project description.',
            linkedinPost: `[DRAFT — NOT FOR PUBLISHING]

Project topic: bioinformatics workflow concept.

Add verified inputs, reproducible methods, permitted data sources, and documented findings before sharing. Do not claim an API integration, a clinical use, accuracy improvement, speed improvement, or drug-discovery impact without evidence.`,
            resumeBullet: '[DRAFT] Add a verified contribution and documented result only after independent review of the project evidence.'
        }
    };

    const template = templates[projectType];
    if (!template) {
        showMessage('Project template not found', 'error');
        return;
    }

    // Show a local, fact-review template only.
    showCopilotProjectResult(template);
}

function showCopilotProjectResult(template) {
    // Display the generated LinkedIn post and resume bullet in a modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fab fa-microsoft"></i> Copilot Project Draft Template</h3>
                <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="project-result">
                    <p><strong>Fact-review required:</strong> This local template contains no verified achievement claim. Do not publish or add it to a resume until every statement is supported.</p>
                    <h4><i class="fab fa-linkedin"></i> LinkedIn Post</h4>
                    <div class="content-box">
                        <p>${template.linkedinPost}</p>
                        <button class="btn btn-sm btn-primary" onclick="copyToClipboard(this.previousElementSibling.textContent)">
                            <i class="fas fa-copy"></i> Copy LinkedIn Post
                        </button>
                    </div>

                    <h4><i class="fas fa-file-alt"></i> Resume Bullet Point</h4>
                    <div class="content-box">
                        <p><strong>${template.resumeBullet}</strong></p>
                        <button class="btn btn-sm btn-primary" onclick="copyToClipboard(this.previousElementSibling.textContent)">
                            <i class="fas fa-copy"></i> Copy Resume Bullet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function viewCopilotDemo(projectType) {
    void projectType;
    showMessage('Demo links are not configured. Attach only a verified, authorized project link after review.', 'info');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showMessage('Failed to copy to clipboard', 'error');
    });
}

// Webhook Integration Functions
async function sendToWebhook(data) {
    void data;
    throw new Error('Browser-side webhook sending is disabled. Use a server-side approval queue before any external action.');
}

function getWebhookUrl() {
    // Try to get webhook URL from various sources
    return localStorage.getItem('webhookUrl') ||
           window.WEBHOOK_URL ||
           (typeof process !== 'undefined' && process?.env?.N8N_WEBHOOK_URL) ||
           null;
}

function setWebhookUrl(url) {
    localStorage.setItem('webhookUrl', url);
    showMessage('Webhook URL local settings में सेव है; browser से कोई external request नहीं भेजी जाएगी।', 'info');
}

// Enhanced save project function with webhook integration
async function saveProjectWithWebhook() {
    const projectName = document.getElementById('projectName').value;
    const description = document.getElementById('projectDescription').value;
    const tools = document.getElementById('toolsUsed').value;
    const findings = document.getElementById('keyFindings').value;

    if (!projectName || !description) {
        showMessage('कृपया प्रोजेक्ट का नाम और विवरण भरें', 'error');
        return;
    }

    const projectData = {
        name: projectName,
        description: description,
        tools: tools.split(',').map(t => t.trim()),
        findings: findings,
        timestamp: new Date().toISOString()
    };

    // Save locally
    projects.push(projectData);
    localStorage.setItem('projects', JSON.stringify(projects));

    showMessage('प्रोजेक्ट केवल local draft के रूप में सेव हुआ है। External handoff के लिए server-side approval आवश्यक है।', 'info');

    updateAnalytics();
}

// Webhook configuration UI
function showWebhookConfig() {
    const currentUrl = getWebhookUrl() || '';
    const newUrl = prompt('n8n Webhook URL enter करें:', currentUrl);

    if (newUrl && newUrl.trim()) {
        setWebhookUrl(newUrl.trim());
    }
}

async function testWebhookConnection() {
    showMessage('Browser-side webhook testing is disabled. Verify connectivity only through an approved server-side integration.', 'info');
}

// Auto-connect webhook on page load if URL is available
document.addEventListener('DOMContentLoaded', function() {
    const webhookUrl = getWebhookUrl();
    if (webhookUrl) {
        console.log('Webhook URL configured:', webhookUrl.substring(0, 30) + '...');
    }
});

// Premium Subscription Functions
let selectedPlan = null;

function selectPlan(planType) {
    selectedPlan = planType;
    document.getElementById('paymentForm').style.display = 'block';

    // Update form title based on selected plan
    const formTitle = document.querySelector('#paymentForm h3');
    const planNames = {
        basic: 'Basic Premium - ₹999/माह',
        pro: 'Pro Premium - ₹1999/माह'
    };
    formTitle.textContent = `भुगतान विवरण - ${planNames[planType]}`;

    // Scroll to payment form
    document.getElementById('paymentForm').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    showMessage(`${planNames[planType]} चुना गया। कृपया भुगतान विवरण भरें।`, 'success');
}

function cancelPayment() {
    document.getElementById('paymentForm').style.display = 'none';
    selectedPlan = null;

    // Clear form data
    document.getElementById('cardholderName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('billingAddress').value = '';

    showMessage('भुगतान रद्द किया गया।', 'info');
}

function processPayment() {
    if (!selectedPlan) {
        showMessage('कृपया पहले एक प्लान चुनें।', 'error');
        return;
    }

    // Get form values
    const cardholderName = document.getElementById('cardholderName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const isTestMode = document.getElementById('testMode').checked;

    // Validate required fields
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
        showMessage('कृपया सभी आवश्यक फील्ड भरें।', 'error');
        return;
    }

    // Validate test mode requirements
    if (isTestMode) {
        const validTestNames = ['test user', 'example name', 'john doe', 'jane doe'];
        const validTestCards = ['4111111111111111', '5555555555554444', '378282246310005'];

        if (!validTestNames.includes(cardholderName.toLowerCase())) {
            showMessage('टेस्ट मोड में कृपया वैध टेस्ट नाम का उपयोग करें: Test User, John Doe, Jane Doe, या Example Name', 'error');
            return;
        }

        if (!validTestCards.includes(cardNumber)) {
            showMessage('टेस्ट मोड में कृपया केवल आधिकारिक टेस्ट कार्ड नंबर का उपयोग करें।', 'error');
            return;
        }
    }

    // Validate card number format
    if (!/^\d{13,19}$/.test(cardNumber)) {
        showMessage('कृपया वैध कार्ड नंबर दर्ज करें।', 'error');
        return;
    }

    // Validate expiry date format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showMessage('कृपया वैध समाप्ति तिथि दर्ज करें (MM/YY)।', 'error');
        return;
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cvv)) {
        showMessage('कृपया वैध CVV दर्ज करें।', 'error');
        return;
    }

    // Simulate payment processing
    const submitBtn = document.querySelector('.payment-actions .btn-primary');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> प्रोसेसिंग...';
    submitBtn.disabled = true;

    setTimeout(() => {
        if (isTestMode) {
            showMessage('✅ टेस्ट भुगतान सफल! यह एक नकली लेनदेन था।', 'success');
        } else {
            showMessage('⚠️ लाइव मोड में वास्तविक भुगतान प्रोसेसिंग लागू नहीं की गई है।', 'error');
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (isTestMode) {
            // Clear form after successful test payment
            setTimeout(() => {
                cancelPayment();
            }, 2000);
        }
    }, 2000);
}

// Card number formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});

// Test mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const testModeToggle = document.getElementById('testMode');
    const testDataSection = document.getElementById('testDataSection');
    const livePaymentWarning = document.getElementById('livePaymentWarning');

    if (testModeToggle) {
        testModeToggle.addEventListener('change', function() {
            if (this.checked) {
                testDataSection.style.display = 'block';
                livePaymentWarning.style.display = 'none';
                showMessage('टेस्ट मोड सक्रिय - केवल नकली डेटा का उपयोग करें', 'info');
            } else {
                testDataSection.style.display = 'none';
                livePaymentWarning.style.display = 'block';
                showMessage('⚠️ लाइव मोड सक्रिय - सावधान रहें!', 'warning');
            }
        });
    }
});
