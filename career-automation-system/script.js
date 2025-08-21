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

// Critical Thinking Optimization Features

// Prompt Category Management
function initializePromptCategories() {
    const categoryTabs = document.querySelectorAll('.prompt-category-tab');
    const categoryContents = document.querySelectorAll('.prompt-category-content');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Remove active classes
            categoryTabs.forEach(t => t.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));
            
            // Add active classes
            tab.classList.add('active');
            document.getElementById(`${category}-prompts`).classList.add('active');
        });
    });
}

// Advanced Prompt Copy Functionality
function copyAdvancedPrompt(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Advanced prompt copied to clipboard! 🧠', 'success');
        
        // Find the button that was clicked and show feedback
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(elementId)) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btn.style.background = '#48bb78';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 2000);
            }
        });
    }).catch(err => {
        showMessage('Failed to copy prompt. Please try again.', 'error');
    });
}

// Specialized Prompt Library
const specializedPrompts = {
    linkedin: {
        title: 'LinkedIn Profile Critical Analysis',
        content: `**Role**: Expert LinkedIn optimization consultant with critical thinking expertise

**Task**: Perform comprehensive critical analysis of this LinkedIn profile content:

**Profile Content to Analyze**: 
[Paste your LinkedIn headline, about section, or experience description here]

**Analysis Framework**:
1. **Content Audit**: What works vs. what doesn't?
2. **Keyword Analysis**: SEO and recruiter visibility 
3. **Narrative Flow**: Story coherence and impact
4. **Competitive Analysis**: Industry benchmark comparison
5. **Conversion Optimization**: Call-to-action effectiveness

**Output Requirements**:
- Overall optimization score (1-10)
- 3 highest-impact improvements
- Before/after content examples
- Industry-specific keyword suggestions
- Measurable success criteria

**Instructions**: Be specific with recommendations and provide actionable steps for optimization.`
    },
    resume: {
        title: 'Resume Content Performance Analysis',
        content: `**Role**: Senior HR consultant and resume optimization expert

**Analyze This Resume Section**: 
[Paste your resume summary, experience bullet points, or skills section here]

**Critical Evaluation Criteria**:
- **Impact Quantification**: Are achievements measurable?
- **Relevance Scoring**: How well does content match target role?
- **ATS Compatibility**: Keyword optimization for applicant tracking systems
- **Storytelling Effectiveness**: Does content tell a compelling career story?
- **Industry Alignment**: Matches sector expectations and language?

**Target Role**: [Specify the job title you're targeting]

**Provide**:
- Content effectiveness score (1-10)
- Top 3 optimization priorities
- Rewritten high-impact examples
- ATS keyword enhancement suggestions
- Industry-specific improvements

**Instructions**: Focus on measurable improvements that will increase interview callbacks.`
    },
    jobstrategy: {
        title: 'Job Application Strategy Critical Analysis',
        content: `**Role**: Career strategist specializing in pharmaceutical and biotech industries

**Analyze My Job Search Approach**:
- **Target Role**: [Specific job title]
- **Target Companies**: [List companies you're targeting]
- **Current Strategy**: [Describe your current approach]
- **Application Materials**: [List what you're using - resume, cover letter, portfolio]
- **Results So Far**: [Response rates, interviews, feedback received]

**Critical Analysis Areas**:
1. **Strategy Alignment**: Does approach match industry expectations?
2. **Material Effectiveness**: Are applications compelling and targeted?
3. **Process Efficiency**: Is the workflow optimized for best ROI?
4. **Market Positioning**: How competitive is the positioning?
5. **Success Probability**: What's the likelihood of success?

**Output**: 
- Strategy effectiveness rating (1-10)
- Process optimization recommendations
- Material improvement priorities
- Timeline and success metrics
- Risk mitigation strategies

**Instructions**: Provide data-driven insights and specific action steps for improvement.`
    },
    portfolio: {
        title: 'Project Portfolio Critical Review',
        content: `**Role**: Senior project portfolio reviewer and career advancement specialist

**Portfolio Projects to Analyze**:
[List your projects with brief descriptions, technologies used, and outcomes]

**Evaluation Criteria**:
- **Technical Complexity**: Demonstrates required skills?
- **Business Impact**: Shows value creation ability?
- **Presentation Quality**: Effectively communicates achievements?
- **Market Relevance**: Aligns with industry needs?
- **Differentiation**: Stands out from competition?

**Target Industry**: [Biotech/Pharma/Clinical Research/Data Science]

**Critical Questions**:
- Which projects should be featured prominently?
- What gaps exist in the portfolio?
- How can presentation be optimized?
- What additional projects would strengthen positioning?

**Provide**:
- Portfolio strength assessment (1-10)
- Project prioritization recommendations  
- Presentation optimization strategies
- Gap analysis and suggestions
- Competitive positioning advice

**Instructions**: Be specific about which projects to emphasize and how to present them effectively.`
    }
};

// Load Specialized Prompt
function loadSpecializedPrompt(type) {
    const prompt = specializedPrompts[type];
    if (!prompt) return;
    
    const display = document.getElementById('specializedPromptDisplay');
    const title = document.getElementById('specializedPromptTitle');
    const content = document.getElementById('specializedPromptContent');
    
    title.innerHTML = `<i class="fas fa-brain"></i> ${prompt.title}`;
    content.value = prompt.content;
    display.style.display = 'block';
    
    // Scroll to the prompt
    display.scrollIntoView({ behavior: 'smooth' });
    
    showMessage(`Loaded ${prompt.title} - customize with your details and copy to AI tool`, 'success');
}

// Customize Prompt Functionality
function customizePrompt() {
    const content = document.getElementById('specializedPromptContent');
    content.readOnly = false;
    content.style.background = '#fff';
    content.style.border = '2px solid #667eea';
    
    const customizeBtn = event.target;
    customizeBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    customizeBtn.onclick = saveCustomization;
    
    showMessage('Prompt is now editable. Customize it for your needs!', 'success');
}

function saveCustomization() {
    const content = document.getElementById('specializedPromptContent');
    content.readOnly = true;
    content.style.background = '#2d3748';
    content.style.border = '2px solid #4a5568';
    
    const saveBtn = event.target;
    saveBtn.innerHTML = '<i class="fas fa-edit"></i> Customize';
    saveBtn.onclick = customizePrompt;
    
    showMessage('Customizations saved! Your prompt is ready to use.', 'success');
}

// Performance Analysis Functions
function analyzeContentPerformance() {
    // Simulate analysis with realistic scoring
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
    
    let score = 0;
    
    // Score based on content quantity and quality indicators
    if (projects.length > 0) score += 30;
    if (projects.length > 3) score += 20;
    if (socialPosts.length > 0) score += 25;
    if (socialPosts.length > 5) score += 15;
    
    // Add random variation for realism
    score += Math.floor(Math.random() * 10);
    score = Math.min(score, 100);
    
    updateMetricDisplay('contentScore', score);
    
    if (score < 60) {
        showMessage('Content effectiveness could be improved. Use critical thinking prompts to optimize!', 'error');
    } else if (score < 80) {
        showMessage('Good content performance! Consider using advanced analysis prompts for optimization.', 'success');
    } else {
        showMessage('Excellent content performance! Keep using AI optimization strategies.', 'success');
    }
}

function analyzeProfileOptimization() {
    // Simulate profile analysis
    const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
    updateMetricDisplay('profileScore', score);
    
    if (score < 70) {
        showMessage('Profile needs optimization. Try the LinkedIn analysis prompt!', 'error');
    } else if (score < 85) {
        showMessage('Profile is good but can be improved. Use critical thinking analysis!', 'success');
    } else {
        showMessage('Excellent profile optimization! You\'re using AI effectively.', 'success');
    }
}

function analyzeAIUsage() {
    // Simulate AI usage efficiency analysis
    const promptUsage = localStorage.getItem('promptUsageCount') || 0;
    let score = Math.min(parseInt(promptUsage) * 10, 90) + Math.floor(Math.random() * 10);
    score = Math.min(score, 100);
    
    updateMetricDisplay('efficiencyScore', score);
    
    // Track usage
    localStorage.setItem('promptUsageCount', parseInt(promptUsage) + 1);
    
    showMessage(`AI usage efficiency: ${score}%. Great job leveraging AI for career optimization!`, 'success');
}

function updateMetricDisplay(metricId, score) {
    const element = document.getElementById(metricId);
    if (element) {
        // Animate the score update
        let currentScore = 0;
        const increment = score / 20;
        
        const interval = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(interval);
            }
            element.textContent = Math.floor(currentScore) + '%';
            
            // Color code based on score
            if (currentScore < 60) {
                element.style.color = '#e53e3e';
            } else if (currentScore < 80) {
                element.style.color = '#d69e2e';
            } else {
                element.style.color = '#38a169';
            }
        }, 50);
    }
}

// Apply Optimization Suggestions
function applySuggestion(button) {
    const suggestionText = button.parentElement.querySelector('span').textContent;
    
    // Mark as applied
    button.innerHTML = '<i class="fas fa-check"></i> Applied';
    button.style.background = '#48bb78';
    button.disabled = true;
    
    // Navigate to relevant section based on suggestion
    if (suggestionText.includes('LinkedIn')) {
        switchTab('prompts');
        document.querySelector('[data-category="optimization"]').click();
        setTimeout(() => loadSpecializedPrompt('linkedin'), 500);
    } else if (suggestionText.includes('resume')) {
        switchTab('prompts');
        document.querySelector('[data-category="optimization"]').click();
        setTimeout(() => loadSpecializedPrompt('resume'), 500);
    } else if (suggestionText.includes('portfolio')) {
        switchTab('prompts');
        document.querySelector('[data-category="optimization"]').click();
        setTimeout(() => loadSpecializedPrompt('portfolio'), 500);
    }
    
    showMessage('Suggestion applied! Follow the loaded prompt for optimization.', 'success');
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeHelp();
    initializePromptCategories();
    
    // Show welcome message for new optimization features
    setTimeout(() => {
        if (!localStorage.getItem('seenOptimizationWelcome')) {
            showMessage('🧠 New: Critical Thinking AI Prompts now available! Check the AI Prompts section.', 'success');
            localStorage.setItem('seenOptimizationWelcome', 'true');
        }
    }, 2000);
});