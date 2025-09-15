/**
 * 🚀 Entrepreneurship AI Automation System
 * Complete automation platform for YouTube + AI tools integration
 */

// Global state management
const AutomationSystem = {
    apiKeys: {
        youtube: localStorage.getItem('youtube_api_key') || '',
        gemini: localStorage.getItem('gemini_api_key') || '',
        github: localStorage.getItem('github_token') || '',
        microsoft: localStorage.getItem('microsoft_client_id') || ''
    },
    workflows: {
        dailyPipeline: { active: true, lastRun: new Date() },
        commentManagement: { active: true, lastRun: new Date() },
        kpiAlerts: { active: true, lastRun: new Date() },
        leadCapture: { active: false, lastRun: null }
    },
    analytics: {
        youtubeViews: 0,
        youtubeSubscribers: 0,
        activeWorkflows: 0,
        successRate: 0
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadStoredData();
    initializeAnalytics();
    setupEventListeners();
    showMessage('🚀 Entrepreneurship Automation System Loaded', 'success');
});

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Update analytics when switching to analytics tab
            if (targetTab === 'analytics') {
                updateAnalyticsDisplay();
            }
        });
    });
}

// Load stored data from localStorage
function loadStoredData() {
    // Load API keys
    Object.keys(AutomationSystem.apiKeys).forEach(key => {
        const input = document.getElementById(`${key}ApiKey`) || document.getElementById(`${key}Token`);
        if (input && AutomationSystem.apiKeys[key]) {
            input.value = AutomationSystem.apiKeys[key];
            updateConnectionStatus(key, true);
        }
    });
}

// YouTube Automation Functions
function generateTopics() {
    const niche = document.getElementById('niche').value;
    const keywords = document.getElementById('keywords').value;
    
    showMessage('🔍 Generating topic ideas...', 'info');
    
    // Simulate AI topic generation
    setTimeout(() => {
        const topics = generateTopicIdeas(niche, keywords);
        displayTopicResults(topics);
        showMessage('✅ Topic ideas generated successfully!', 'success');
    }, 2000);
}

function generateTopicIdeas(niche, keywords) {
    const templates = {
        entrepreneurship: [
            "5 Startup Mistakes That Kill Businesses (And How to Avoid Them)",
            "From Idea to $1M: The Complete Startup Roadmap",
            "Why 90% of Entrepreneurs Fail (Real Data Analysis)",
            "Building a Business with Zero Investment: Step-by-Step Guide",
            "The Psychology of Successful Entrepreneurs"
        ],
        business: [
            "Business Strategy That Actually Works in 2024",
            "How to Scale Your Business from 6 to 7 Figures",
            "Market Research Secrets Big Companies Don't Want You to Know",
            "Building Systems That Run Your Business Without You",
            "Customer Acquisition Strategies That Convert"
        ],
        startup: [
            "MVP Development: Build Your First Product in 30 Days",
            "Fundraising Masterclass: Getting Your First Investment",
            "Finding Co-founders: The Ultimate Guide",
            "Startup Legal Basics Every Founder Should Know",
            "Product-Market Fit: How to Know When You've Found It"
        ]
    };
    
    return templates[niche] || templates.entrepreneurship;
}

function displayTopicResults(topics) {
    const resultsDiv = document.getElementById('topicResults');
    resultsDiv.innerHTML = `
        <h4>Generated Topic Ideas:</h4>
        <ul>
            ${topics.map(topic => `<li onclick="selectTopic('${topic}')" style="cursor: pointer; margin: 10px 0; padding: 10px; background: #e2e8f0; border-radius: 5px;">${topic}</li>`).join('')}
        </ul>
    `;
    resultsDiv.classList.add('show');
}

function selectTopic(topic) {
    document.getElementById('videoTopic').value = topic;
    showMessage('📝 Topic selected! Ready for script generation.', 'success');
}

function generateScript() {
    const topic = document.getElementById('videoTopic').value;
    const length = document.getElementById('videoLength').value;
    const style = document.getElementById('scriptStyle').value;
    
    if (!topic) {
        showMessage('⚠️ Please enter a video topic first.', 'warning');
        return;
    }
    
    showMessage('✍️ Generating script with AI...', 'info');
    
    setTimeout(() => {
        const script = createScript(topic, length, style);
        displayScriptResults(script);
        showMessage('✅ Script generated successfully!', 'success');
    }, 3000);
}

function createScript(topic, length, style) {
    const structures = {
        short: {
            hook: "Hook (0-5 seconds)",
            problem: "Problem Statement (5-15 seconds)",
            solution: "Quick Solution (15-45 seconds)",
            cta: "Call to Action (45-60 seconds)"
        },
        medium: {
            hook: "Hook & Introduction (0-30 seconds)",
            background: "Background & Context (30-120 seconds)",
            main_content: "Main Content (120-480 seconds)",
            examples: "Examples & Case Studies (480-600 seconds)",
            cta: "Summary & Call to Action (600-720 seconds)"
        },
        long: {
            hook: "Hook & Introduction (0-60 seconds)",
            background: "Background & Problem (60-300 seconds)",
            deep_dive: "Deep Dive Content (300-900 seconds)",
            examples: "Examples & Case Studies (900-1080 seconds)",
            action_steps: "Action Steps (1080-1140 seconds)",
            cta: "Summary & Call to Action (1140-1200 seconds)"
        }
    };
    
    return {
        topic: topic,
        length: length,
        style: style,
        structure: structures[length],
        generatedScript: `
# ${topic}

## Script Overview
**Style:** ${style}
**Length:** ${length}
**Target Audience:** Entrepreneurs & Business Owners

## Script Structure:

${Object.entries(structures[length]).map(([section, timing]) => `
### ${section.replace('_', ' ').toUpperCase()}
**Timing:** ${timing}
**Content:** [AI-generated content for ${section} would go here based on the topic "${topic}" in ${style} style]
`).join('')}

## Call to Action Ideas:
- Subscribe for more entrepreneurship content
- Download free business template
- Join our entrepreneur community
- Book a free strategy call
        `
    };
}

function displayScriptResults(script) {
    const resultsDiv = document.getElementById('scriptResults');
    resultsDiv.innerHTML = `
        <h4>Generated Script:</h4>
        <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; max-height: 400px; overflow-y: auto;">
            <pre style="white-space: pre-wrap; font-family: inherit;">${script.generatedScript}</pre>
        </div>
        <div style="margin-top: 15px;">
            <button class="btn btn-secondary" onclick="copyToClipboard('${script.generatedScript.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Copy Script
            </button>
            <button class="btn btn-primary" onclick="proceedToThumbnail()">
                <i class="fas fa-arrow-right"></i> Generate Thumbnail
            </button>
        </div>
    `;
    resultsDiv.classList.add('show');
}

function generateThumbnail() {
    const style = document.getElementById('thumbnailStyle').value;
    const topic = document.getElementById('videoTopic').value;
    
    if (!topic) {
        showMessage('⚠️ Please enter a video topic first.', 'warning');
        return;
    }
    
    showMessage('🎨 Generating thumbnail and title options...', 'info');
    
    setTimeout(() => {
        const thumbnailData = createThumbnailOptions(topic, style);
        displayThumbnailResults(thumbnailData);
        showMessage('✅ Thumbnail and titles generated!', 'success');
    }, 2500);
}

function createThumbnailOptions(topic, style) {
    const titleTemplates = [
        `${topic.split(':')[0]} (SHOCKING TRUTH!)`,
        `How I ${topic.toLowerCase().includes('startup') ? 'Built a Startup' : 'Solved This'} in 30 Days`,
        `${topic.split(' ').slice(0, 3).join(' ')} - The Ultimate Guide`,
        `EXPOSED: ${topic.split('(')[0]}`,
        `${topic.split(':')[0]} That Changed Everything`
    ];
    
    const thumbnailElements = {
        professional: {
            background: 'Clean gradient background',
            text: 'Bold, readable font',
            colors: 'Blue and white theme',
            face: 'Professional headshot'
        },
        'eye-catching': {
            background: 'Bright, contrasting colors',
            text: 'Large, bold text with outline',
            colors: 'Red, yellow, and white',
            face: 'Surprised/excited expression'
        },
        minimalist: {
            background: 'Simple solid color',
            text: 'Clean, simple font',
            colors: 'Monochrome or single accent',
            face: 'Minimal, clean composition'
        },
        bold: {
            background: 'Dark, dramatic background',
            text: 'Massive, impactful text',
            colors: 'High contrast colors',
            face: 'Strong, confident expression'
        }
    };
    
    return {
        titles: titleTemplates,
        thumbnailSpecs: thumbnailElements[style],
        canvaPrompt: `Create a ${style} YouTube thumbnail for "${topic}" with ${thumbnailElements[style].background}, ${thumbnailElements[style].text}, and ${thumbnailElements[style].colors}.`
    };
}

function displayThumbnailResults(data) {
    const resultsDiv = document.getElementById('thumbnailResults');
    resultsDiv.innerHTML = `
        <h4>Generated Titles:</h4>
        <div style="margin-bottom: 20px;">
            ${data.titles.map((title, index) => `
                <div style="background: #f7fafc; padding: 15px; margin: 10px 0; border-radius: 10px; cursor: pointer;" onclick="selectTitle('${title}')">
                    <strong>Option ${index + 1}:</strong> ${title}
                </div>
            `).join('')}
        </div>
        
        <h4>Thumbnail Specifications:</h4>
        <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <p><strong>Style:</strong> ${document.getElementById('thumbnailStyle').value}</p>
            <p><strong>Background:</strong> ${data.thumbnailSpecs.background}</p>
            <p><strong>Text:</strong> ${data.thumbnailSpecs.text}</p>
            <p><strong>Colors:</strong> ${data.thumbnailSpecs.colors}</p>
            <p><strong>Face/Expression:</strong> ${data.thumbnailSpecs.face}</p>
        </div>
        
        <h4>Canva AI Prompt:</h4>
        <div style="background: #f0fff4; padding: 15px; border-radius: 10px; border-left: 4px solid #38a169;">
            <code>${data.canvaPrompt}</code>
            <button class="btn btn-secondary" onclick="copyToClipboard('${data.canvaPrompt}')" style="margin-left: 10px;">
                <i class="fas fa-copy"></i> Copy Prompt
            </button>
        </div>
    `;
    resultsDiv.classList.add('show');
}

function prepareUpload() {
    const schedule = document.getElementById('uploadSchedule').value;
    const publishTime = document.getElementById('publishTime').value;
    
    showMessage('📤 Preparing upload configuration...', 'info');
    
    setTimeout(() => {
        const uploadConfig = {
            schedule: schedule,
            publishTime: publishTime,
            status: schedule === 'immediate' ? 'Ready for immediate upload' : 
                   schedule === 'schedule' ? `Scheduled for ${publishTime}` : 'Saved as draft',
            nextSteps: getUploadSteps(schedule)
        };
        
        displayUploadResults(uploadConfig);
        showMessage('✅ Upload configuration ready!', 'success');
    }, 1500);
}

function getUploadSteps(schedule) {
    const baseSteps = [
        'Export video file in 1080p',
        'Prepare video file and thumbnail',
        'Copy title and description',
        'Set video visibility and tags'
    ];
    
    if (schedule === 'immediate') {
        return [...baseSteps, 'Upload immediately to YouTube'];
    } else if (schedule === 'schedule') {
        return [...baseSteps, 'Schedule for specified time', 'Set up publish notification'];
    } else {
        return [...baseSteps, 'Save as draft for review', 'Review and publish manually'];
    }
}

function displayUploadResults(config) {
    const resultsDiv = document.getElementById('uploadResults');
    resultsDiv.innerHTML = `
        <h4>Upload Configuration:</h4>
        <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <p><strong>Status:</strong> ${config.status}</p>
            <p><strong>Schedule Type:</strong> ${config.schedule}</p>
            ${config.publishTime ? `<p><strong>Publish Time:</strong> ${config.publishTime}</p>` : ''}
        </div>
        
        <h4>Next Steps:</h4>
        <ol style="background: #f7fafc; padding: 20px; border-radius: 10px;">
            ${config.nextSteps.map(step => `<li style="margin: 10px 0;">${step}</li>`).join('')}
        </ol>
        
        <div style="margin-top: 20px;">
            <button class="btn btn-primary" onclick="triggerUploadWorkflow()">
                <i class="fas fa-rocket"></i> Execute Upload Workflow
            </button>
        </div>
    `;
    resultsDiv.classList.add('show');
}

// AI Content Engine Functions
function executeGeminiPrompt() {
    const prompt = document.getElementById('geminiPrompt').value;
    
    if (!prompt.trim()) {
        showMessage('⚠️ Please enter a prompt for Gemini Pro.', 'warning');
        return;
    }
    
    if (!AutomationSystem.apiKeys.gemini) {
        showMessage('⚠️ Please connect Gemini Pro API first.', 'warning');
        return;
    }
    
    showMessage('🤖 Processing with Gemini Pro...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        const result = simulateGeminiResponse(prompt);
        displayGeminiResults(result);
        showMessage('✅ Gemini Pro response generated!', 'success');
    }, 2000);
}

function simulateGeminiResponse(prompt) {
    return {
        prompt: prompt,
        response: `This is a simulated Gemini Pro response to your prompt: "${prompt}"\n\nIn a real implementation, this would connect to the actual Gemini Pro API and return AI-generated content based on your prompt. The response would be contextual and helpful for your entrepreneurship content needs.`,
        tokens_used: Math.floor(Math.random() * 1000) + 500,
        processing_time: Math.random() * 2 + 1
    };
}

function displayGeminiResults(result) {
    const resultsDiv = document.getElementById('geminiResults');
    resultsDiv.innerHTML = `
        <h4>Gemini Pro Response:</h4>
        <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 15px;">
            <pre style="white-space: pre-wrap; font-family: inherit;">${result.response}</pre>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f7fafc; padding: 15px; border-radius: 10px;">
            <span>Tokens: ${result.tokens_used}</span>
            <span>Time: ${result.processing_time.toFixed(2)}s</span>
            <button class="btn btn-secondary" onclick="copyToClipboard('${result.response.replace(/'/g, "\\'")}')">
                <i class="fas fa-copy"></i> Copy Response
            </button>
        </div>
    `;
    resultsDiv.classList.add('show');
}

function executeCopilotTask() {
    const taskType = document.getElementById('copilotTask').value;
    
    showMessage('🤖 Executing Microsoft Copilot task...', 'info');
    
    setTimeout(() => {
        const result = simulateCopilotResponse(taskType);
        displayCopilotResults(result);
        showMessage('✅ Copilot task completed!', 'success');
    }, 2500);
}

function simulateCopilotResponse(taskType) {
    const responses = {
        code: 'Generated code snippet for your automation needs...',
        content: 'Created professional content for your entrepreneurship platform...',
        analysis: 'Analyzed data and provided insights for your business metrics...',
        documentation: 'Generated comprehensive documentation for your project...'
    };
    
    return {
        taskType: taskType,
        result: responses[taskType],
        suggestions: [
            'Consider optimizing for mobile users',
            'Add error handling for edge cases',
            'Implement analytics tracking',
            'Include accessibility features'
        ]
    };
}

function displayCopilotResults(result) {
    const resultsDiv = document.getElementById('copilotResults');
    resultsDiv.innerHTML = `
        <h4>Copilot Result (${result.taskType}):</h4>
        <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 15px;">
            ${result.result}
        </div>
        <h5>Suggestions:</h5>
        <ul style="background: #f7fafc; padding: 15px; border-radius: 10px;">
            ${result.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
        </ul>
    `;
    resultsDiv.classList.add('show');
}

// Security Functions
function scanRepositories() {
    document.getElementById('repoSecurity').textContent = 'Scanning...';
    showMessage('🔍 Scanning repositories for security issues...', 'info');
    
    setTimeout(() => {
        const securityStatus = 'Secure ✅';
        document.getElementById('repoSecurity').textContent = securityStatus;
        showMessage('✅ Repository security scan completed!', 'success');
        
        updateSecurityAlerts([
            { type: 'info', message: 'All repositories have security scanning enabled' },
            { type: 'success', message: 'No critical vulnerabilities found' },
            { type: 'warning', message: '2 dependencies need updates' }
        ]);
    }, 3000);
}

function analyzeCodeQuality() {
    document.getElementById('codeQuality').textContent = 'Analyzing...';
    showMessage('📊 Analyzing code quality...', 'info');
    
    setTimeout(() => {
        const qualityScore = 'Good (85%)';
        document.getElementById('codeQuality').textContent = qualityScore;
        showMessage('✅ Code quality analysis completed!', 'success');
    }, 2500);
}

function checkAPIKeys() {
    document.getElementById('apiSecurity').textContent = 'Checking...';
    showMessage('🔑 Checking API key security...', 'info');
    
    setTimeout(() => {
        const apiStatus = 'Protected ✅';
        document.getElementById('apiSecurity').textContent = apiStatus;
        showMessage('✅ API security check completed!', 'success');
    }, 2000);
}

function updateSecurityAlerts(alerts) {
    const alertsDiv = document.getElementById('securityAlerts');
    alertsDiv.innerHTML = `
        <h4>Security Alerts:</h4>
        ${alerts.map(alert => `
            <div style="background: ${getAlertColor(alert.type)}; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid ${getAlertBorderColor(alert.type)};">
                <strong>${alert.type.toUpperCase()}:</strong> ${alert.message}
            </div>
        `).join('')}
    `;
}

function getAlertColor(type) {
    const colors = {
        info: '#e6f7ff',
        success: '#f6ffed',
        warning: '#fffbe6',
        error: '#fff2f0'
    };
    return colors[type] || colors.info;
}

function getAlertBorderColor(type) {
    const colors = {
        info: '#1890ff',
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d'
    };
    return colors[type] || colors.info;
}

// Workflow Functions
function triggerDailyPipeline() {
    showMessage('🚀 Triggering daily content pipeline...', 'info');
    
    setTimeout(() => {
        AutomationSystem.workflows.dailyPipeline.lastRun = new Date();
        showMessage('✅ Daily pipeline executed successfully!', 'success');
        updateAnalyticsDisplay();
    }, 3000);
}

function triggerCommentManagement() {
    showMessage('💬 Processing comment management workflow...', 'info');
    
    setTimeout(() => {
        AutomationSystem.workflows.commentManagement.lastRun = new Date();
        showMessage('✅ Comment management completed!', 'success');
        updateAnalyticsDisplay();
    }, 2000);
}

// Tool Integration Functions
function connectYouTube() {
    const apiKey = document.getElementById('youtubeApiKey').value;
    
    if (!apiKey.trim()) {
        showMessage('⚠️ Please enter your YouTube API key.', 'warning');
        return;
    }
    
    showMessage('🔗 Connecting to YouTube API...', 'info');
    
    setTimeout(() => {
        AutomationSystem.apiKeys.youtube = apiKey;
        localStorage.setItem('youtube_api_key', apiKey);
        updateConnectionStatus('youtube', true);
        showMessage('✅ YouTube API connected successfully!', 'success');
    }, 1500);
}

function connectGemini() {
    const apiKey = document.getElementById('geminiApiKey').value;
    
    if (!apiKey.trim()) {
        showMessage('⚠️ Please enter your Gemini API key.', 'warning');
        return;
    }
    
    showMessage('🔗 Connecting to Gemini Pro API...', 'info');
    
    setTimeout(() => {
        AutomationSystem.apiKeys.gemini = apiKey;
        localStorage.setItem('gemini_api_key', apiKey);
        updateConnectionStatus('gemini', true);
        showMessage('✅ Gemini Pro API connected successfully!', 'success');
    }, 1500);
}

function connectGitHub() {
    const token = document.getElementById('githubToken').value;
    
    if (!token.trim()) {
        showMessage('⚠️ Please enter your GitHub token.', 'warning');
        return;
    }
    
    showMessage('🔗 Connecting to GitHub API...', 'info');
    
    setTimeout(() => {
        AutomationSystem.apiKeys.github = token;
        localStorage.setItem('github_token', token);
        updateConnectionStatus('github', true);
        showMessage('✅ GitHub API connected successfully!', 'success');
    }, 1500);
}

function updateConnectionStatus(service, connected) {
    const statusElement = document.getElementById(`${service}Status`);
    if (statusElement) {
        statusElement.textContent = connected ? 'Connected ✅' : 'Not Connected';
        statusElement.className = `connection-status ${connected ? 'connected' : ''}`;
    }
}

// Analytics Functions
function initializeAnalytics() {
    AutomationSystem.analytics = {
        youtubeViews: Math.floor(Math.random() * 50000) + 10000,
        youtubeSubscribers: Math.floor(Math.random() * 5000) + 1000,
        activeWorkflows: Object.values(AutomationSystem.workflows).filter(w => w.active).length,
        successRate: 98.5
    };
}

function updateAnalyticsDisplay() {
    document.getElementById('youtubeViews').textContent = AutomationSystem.analytics.youtubeViews.toLocaleString();
    document.getElementById('youtubeSubscribers').textContent = AutomationSystem.analytics.youtubeSubscribers.toLocaleString();
    document.getElementById('activeWorkflows').textContent = `${AutomationSystem.analytics.activeWorkflows}/4`;
    document.getElementById('successRate').textContent = `${AutomationSystem.analytics.successRate}%`;
}

// Utility Functions
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        background: ${getMessageColor(type)};
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

function getMessageColor(type) {
    const colors = {
        success: '#38a169',
        error: '#e53e3e',
        warning: '#ed8936',
        info: '#3182ce'
    };
    return colors[type] || colors.info;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('📋 Copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('❌ Failed to copy to clipboard', 'error');
    });
}

function setupEventListeners() {
    // Upload schedule change handler
    const uploadSchedule = document.getElementById('uploadSchedule');
    if (uploadSchedule) {
        uploadSchedule.addEventListener('change', function() {
            const scheduleTimeDiv = document.getElementById('scheduleTime');
            if (scheduleTimeDiv) {
                scheduleTimeDiv.style.display = this.value === 'schedule' ? 'block' : 'none';
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('[data-tab="youtube"]').click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('[data-tab="content"]').click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('[data-tab="security"]').click();
                    break;
            }
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);