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

// Master Prompt Functions
function toggleMasterPromptInputs() {
    const inputsDiv = document.getElementById('masterPromptInputs');
    const button = event.target;
    
    if (inputsDiv.style.display === 'none') {
        inputsDiv.style.display = 'block';
        button.textContent = 'Hide Inputs';
    } else {
        inputsDiv.style.display = 'none';
        button.textContent = 'Customize';
    }
}

function copyMasterPrompt() {
    const currentQuestion = document.getElementById('currentQuestion').value || '{{WRITE MY CURRENT QUESTION HERE}}';
    const screenshots = document.getElementById('screenshots').value || '{{ADD ANY LINKS/IMAGES OR "NONE"}}';
    const platforms = document.getElementById('platforms').value || '{{e.g., Microsoft + n8n + OpenAI}}';
    const constraints = document.getElementById('constraints').value || '{{ADD OR "NONE"}}';
    
    const masterPromptTemplate = `MASTER PROMPT — Balaji Nonprofit + Automation (Use as-is)

Role
- Act as my senior solutions architect and nonprofit program strategist.
- Optimize for: fastest valid path, legal/ToS‑compliant methods, and copy‑pasteable outputs.
- Style: short, decisive, step‑by‑step. No fluff.

Context
- I am Balaji, running nonprofit/educational initiatives at Parul University, Vadodara (GST: 24AADAP4952C2ZS).
- Goals:
  1) Get maximum free/discount access to AI, cloud, developer tools via nonprofit/education programs, grants, credits.
  2) Set up zero‑error automations: n8n Cloud, Microsoft Power Automate, Google Workspace, GitHub, OpenAI/Gemini/Hugging Face.
  3) Provide ready‑to‑paste emails, JSON workflows, API/CLI snippets, and checklists.
- Constraints:
  - No document forgery, no region spoofing, no ToS violations. Offer risk notes + safe alternatives.
  - Keep security best practices (2FA, least privilege, secret handling) with each code/snippet.
- My environment:
  - n8n Cloud active (latest screenshot shows instance and license).
  - Microsoft/Google/GitHub accounts; nonprofit posture.
  - Mobile‑first usage; I prefer prompts and assets I can paste without editing.

Outputs (strict)
1) 2–3 line Summary: what to do first, with rationale.
2) Programs/Offers list (bulleted): name, what's free/discounted, eligibility, verification steps, and the exact place to apply (no links if not allowed, just the program name and "where to find" path).
3) Action Plan (step‑by‑step): for Microsoft, Google, GitHub, OpenAI, Hugging Face, AWS. Include exact button/menu paths and docs required.
4) Risk Notes: any tactic that may trigger ToS risk; add safe alternatives (e.g., official nonprofit verification or sales negotiation).
5) Ready Emails: 3 short email templates (nonprofit benefits, research credits, grants).
6) n8n Pack: 1–2 importable workflow JSONs
   - Donor form/webhook → validate → AI personal reply → Drive/SharePoint save → email/Teams alert.
   - Error‑safe, with placeholders clearly marked: {{WEBHOOK_URL}}, {{OPENAI_API_KEY}}, {{DEST_FOLDER}}, {{RECIPIENT_EMAIL}}.
7) API/CLI Snippets: OpenAI, Gemini, Hugging Face (auth + minimal task). Include env var names and security notes.
8) Contingency: open‑source/self‑host alternatives + quick setup notes.
9) One‑Page Checklist: ultra‑concise, all steps in order (Immediate / This Week / Optional).
10) If my input includes screenshots/links, analyze them and integrate into steps (e.g., D‑U‑N‑S flow for Google Play, npm username rules, Webhook creation in n8n). If data is missing (e.g., D‑U‑N‑S), state it clearly and give exact retrieval path.

Formatting
- Use clear headings and flat bullet points.
- Provide copy‑paste blocks for JSON, shell, or email.
- Mark all placeholders with ALL‑CAPS in double braces, e.g., {{ORG_NAME}}.

Inputs (paste/append here)
- Latest question/task: ${currentQuestion}
- Key screenshots/links: ${screenshots}
- My chosen platforms to prioritize today: ${platforms}
- Any constraints (budget/region/security): ${constraints}

Rules
- If something cannot be verified or is not public, say "Unknown—do this to obtain: …".
- If there are two ways (fast vs. compliant), propose both, label clearly.
- Do not invent data (IDs, dates, prices). Give the path to fetch them.
- For mobile, prefer minimal taps and "Import from JSON" routes.

Deliver now in this exact order with headings 1–10. Keep it compact but complete. End with: "Reply 'GO' and paste {{WEBHOOK_URL}} to receive finalized n8n JSON pre‑filled for your org."`;

    navigator.clipboard.writeText(masterPromptTemplate).then(() => {
        const button = document.querySelector('button[onclick="copyMasterPrompt()"]');
        const originalText = button.textContent;
        button.textContent = 'Copied Master Prompt!';
        button.style.background = '#48bb78';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
        
        showMessage('मास्टर प्रॉम्प्ट कॉपी किया गया! इसे किसी भी AI Pro/Enterprise टूल में पेस्ट करें।', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showMessage('कॉपी करने में त्रुटि हुई। कृपया मैन्युअल रूप से टेक्स्ट सेलेक्ट करें।', 'error');
    });
}

// n8n Workflow Template
function copyN8nWorkflow() {
    const n8nWorkflow = `{
  "name": "Balaji Nonprofit Donor Management",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "donor-form",
        "responseMode": "responseNode"
      },
      "id": "webhook-donor-form",
      "name": "Webhook - Donor Form",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "messageInputs": [
            {
              "role": "system",
              "message": "You are a professional nonprofit coordinator for Parul University. Generate a personalized thank you response for donors."
            },
            {
              "role": "user", 
              "message": "Donor Name: {{$json.name}}\\nDonation Amount: {{$json.amount}}\\nMessage: {{$json.message}}"
            }
          ]
        }
      },
      "id": "openai-response",
      "name": "OpenAI - Generate Response",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [460, 300],
      "credentials": {
        "openAiApi": {
          "id": "{{OPENAI_API_KEY_ID}}",
          "name": "OpenAI Account"
        }
      }
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": "{{GOOGLE_SHEET_ID}}",
        "sheetName": "Donors",
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Name": "={{$node['Webhook - Donor Form'].json.name}}",
            "Email": "={{$node['Webhook - Donor Form'].json.email}}",
            "Amount": "={{$node['Webhook - Donor Form'].json.amount}}",
            "Date": "={{$now()}}",
            "AI_Response": "={{$json.choices[0].message.content}}"
          }
        }
      },
      "id": "google-sheets-save",
      "name": "Google Sheets - Save Data", 
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "select": "channel",
        "channelId": "{{TEAMS_CHANNEL_ID}}",
        "message": "🎉 New Donation Received!\\n**Donor:** {{$node['Webhook - Donor Form'].json.name}}\\n**Amount:** ₹{{$node['Webhook - Donor Form'].json.amount}}\\n**AI Response Sent:** ✅"
      },
      "id": "teams-notification",
      "name": "Microsoft Teams - Alert",
      "type": "n8n-nodes-base.microsoftTeams",
      "typeVersion": 1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Webhook - Donor Form": {
      "main": [
        [
          {
            "node": "OpenAI - Generate Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI - Generate Response": {
      "main": [
        [
          {
            "node": "Google Sheets - Save Data",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets - Save Data": {
      "main": [
        [
          {
            "node": "Microsoft Teams - Alert",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "timezone": "Asia/Kolkata"
  }
}

// Setup Instructions:
// 1. Replace {{OPENAI_API_KEY_ID}} with your OpenAI credential ID
// 2. Replace {{GOOGLE_SHEET_ID}} with your Google Sheet ID
// 3. Replace {{TEAMS_CHANNEL_ID}} with your Teams channel ID
// 4. Test webhook URL: https://your-n8n-instance.app/webhook/donor-form`;

    navigator.clipboard.writeText(n8nWorkflow).then(() => {
        showMessage('n8n Workflow JSON कॉपी किया गया! n8n में import करें।', 'success');
    });
}

// Email Templates
function copyEmailTemplates() {
    const emailTemplates = `EMAIL TEMPLATE 1: Nonprofit Benefits Request
Subject: Nonprofit Verification Request - Parul University (GST: 24AADAP4952C2ZS)

Dear [Company] Support Team,

I am writing to request nonprofit/educational verification for Parul University, a recognized educational institution in Vadodara, Gujarat, India.

Organization Details:
- Name: Parul University
- GST Number: 24AADAP4952C2ZS
- Type: Educational Institution
- Purpose: Biotechnology and Bioinformatics Research

We are specifically interested in your nonprofit program for:
- [Specific service/product]
- Educational/research use case

Required Documentation:
- GST Certificate (attached)
- University Registration Certificate (available upon request)
- Educational Use Case Description

Please guide us through your nonprofit verification process and available benefits.

Best regards,
Balaji Rajput
Research Coordinator
Parul University

---

EMAIL TEMPLATE 2: Research Credits Application
Subject: Research Credits Application - Bioinformatics Project

Hello [Platform] Team,

We are conducting bioinformatics research at Parul University and would like to apply for research credits under your academic program.

Project Overview:
- Title: [Your Research Title]
- Duration: [Project Duration]
- Team Size: [Number of researchers]
- Expected Usage: [Compute/API requirements]

Educational Institution Verification:
- Institution: Parul University
- GST: 24AADAP4952C2ZS
- Research Domain: Biotechnology/Bioinformatics

We commit to:
- Acknowledging your support in publications
- Sharing non-sensitive research outcomes
- Following platform usage guidelines

Please advise on the application process and required documentation.

Thank you,
Balaji Rajput
[Your Position]
Parul University

---

EMAIL TEMPLATE 3: Grant Application Inquiry
Subject: Open Source/Education Grant Inquiry - Nonprofit Initiative

Dear [Foundation/Company] Grants Team,

Parul University is developing an open-source career automation system for biotechnology students and would like to inquire about available grants.

Project Impact:
- Target: 500+ biotech students
- Open Source: MIT License
- Geographic: India (developing market)
- Social Impact: Career guidance for underserved communities

Organization Credentials:
- Legal Status: Registered Educational Institution
- GST: 24AADAP4952C2ZS
- Track Record: [Mention any previous projects]

Grant Requirements:
- Funding Amount: [Specific amount]
- Use Case: [Infrastructure/Tools/Development]
- Timeline: [Project duration]

We are committed to transparency and regular progress reporting.

Could you please share:
1. Eligibility criteria
2. Application process
3. Required documentation
4. Timeline for decisions

Looking forward to your response.

Best regards,
Balaji Rajput
Project Lead
Parul University`;

    navigator.clipboard.writeText(emailTemplates).then(() => {
        showMessage('Email Templates कॉपी किए गए! अपनी जरूरत के अनुसार customize करें।', 'success');
    });
}

// API/CLI Snippets
function copyAPISnippets() {
    const apiSnippets = `# API/CLI SNIPPETS - Security Best Practices Included

## OpenAI API Setup
# Environment Variables (add to .env file)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_organization_id_here

# Python Example
import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# Secure API call
def generate_content(prompt, max_tokens=150):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=0.7
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"Error: {e}")
        return None

---

## Google Gemini API Setup
# Environment Variables
GOOGLE_API_KEY=your_gemini_api_key_here

# Python Example
import google.generativeai as genai
import os

# Configure API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize model
model = genai.GenerativeModel('gemini-pro')

def gemini_generate(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return None

---

## Hugging Face API Setup  
# Environment Variables
HF_TOKEN=your_huggingface_token_here

# Python Example
from transformers import pipeline
import os

# Set token
hf_token = os.getenv("HF_TOKEN")

# Initialize pipeline with authentication
def hf_generate(text, task="text-generation"):
    try:
        generator = pipeline(
            task, 
            model="gpt2",
            use_auth_token=hf_token
        )
        result = generator(text, max_length=100)
        return result[0]['generated_text']
    except Exception as e:
        print(f"HuggingFace Error: {e}")
        return None

---

## Security Best Practices:

1. **Environment Variables**: Never hardcode API keys
2. **Rate Limiting**: Implement request delays
3. **Error Handling**: Always use try-catch blocks
4. **Token Rotation**: Regularly rotate API keys
5. **Access Control**: Use least privilege principle
6. **Logging**: Log requests but not sensitive data

## CLI Tools:

# OpenAI CLI
curl -X POST \\
  https://api.openai.com/v1/completions \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "text-davinci-003",
    "prompt": "Your prompt here",
    "max_tokens": 50
  }'

# GitHub CLI for automation
gh repo create my-project --public
gh workflow run automation.yml

# n8n CLI
npm install -g n8n
n8n start --tunnel`;

    navigator.clipboard.writeText(apiSnippets).then(() => {
        showMessage('API/CLI Snippets कॉपी किए गए! Security best practices के साथ।', 'success');
    });
}
document.addEventListener('DOMContentLoaded', initializeHelp);