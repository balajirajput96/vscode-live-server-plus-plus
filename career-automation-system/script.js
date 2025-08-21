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

// Template Data Storage
const pharmaTemplates = {
    resumes: {
        qc_qa: {
            title: "QC/QA Apprentice Resume - Balaji Dilip Singh",
            content: `# Balaji Dilip Singh
Vadodara, Gujarat • +91-<PHONE> • <EMAIL> • LinkedIn: <URL> • GitHub: <URL> • NAPS/NATS ID: <ID if any>

**TARGET ROLE: QC/QA Apprentice | QC/QA Trainee (OSD/API/Diagnostics)**

## SUMMARY
- Diploma in Biotechnology (Parul University) fresher with internship exposure in bioinformatics/data handling and strong interest in GMP-driven operations.
- Comfortable with cGMP/GDP/ALCOA+, documentation (BMR/BPR/logbooks), sample handling/labeling, and shift operations.
- "Bio + Data" edge: beginner Python/Linux/SQL; building mini-projects (FASTA/BLAST, QC data dashboard) on GitHub.

## EDUCATION
- Diploma in Biotechnology — Parul University, Vadodara | <Year> — <CGPA/%>

## INTERNSHIP
- Bioinformatics Intern — <Org/Lab>, <City> | <MM YYYY> (1 month)
  - Worked on sequence data workflows: FASTA parsing, BLAST (NCBI) basics; maintained run logs and observation notes.
  - Documented steps in SOP-like format; basic QC of outputs and CSV export for review.

## CORE SKILLS
- Quality & Compliance: cGMP, GDP, ALCOA+, data integrity; deviation/CAPA/change control (basics).
- Documentation: BMR/BPR familiarity, line clearance records, logbook discipline, sample labeling/traceability.
- Lab: Solution prep/safety, weighing/calibration basics, pH measurement, UV-Vis, pipetting; GLP basics.
- Tools: MS Excel (filters, pivot, VLOOKUP), Google Sheets; Python (Pandas – beginner), Linux CLI (grep/sed basics), Git/GitHub; SQL (basics).
- Plus: Web design (HTML/CSS) and digital marketing exposure—useful for reporting/communication.

## PROJECTS (GitHub)
- FASTA/BLAST Mini-Notebook — Parse sequences, compute GC%, (optional) run BLAST; export CSV summary. Repo: <URL>
- QC Data Mini-Dashboard — Mock QC dataset with OOS/OOT flags, Pareto/trendlines (Excel/Python). Repo: <URL>

## CERTIFICATIONS (select)
- "Bioinformatics I – Finding Hidden Messages in DNA" (in progress), Python basics, Linux CLI primer
- <Any notable course: Google Digital Marketing / IBM Intro to SE / AWS AI services> (relevant highlights)

## ADDITIONAL
- Languages: English, Hindi, Gujarati
- Availability: Immediate; shift-ready; Vadodara/Ahmedabad/Halol/Ankleshwar

**ATS KEYWORDS**
cGMP, GDP, ALCOA+, SOP, BMR/BPR, Line Clearance, Deviation, CAPA, Change Control, OOS/OOT, GLP, Data Integrity, QC, QA, Documentation, Calibration, Apprentice, Trainee`
        },
        production: {
            title: "Production Trainee Resume - Balaji Dilip Singh",
            content: `# Balaji Dilip Singh
Vadodara, Gujarat • +91-<PHONE> • <EMAIL> • LinkedIn: <URL> • NAPS/NATS ID: <ID if any>

**TARGET ROLE: Production Trainee | Manufacturing Apprentice (OSD/API)**

## SUMMARY
- Biotech diploma fresher focused on shop-floor discipline, EHS/5S, and SOP-compliant manufacturing.
- Understanding of BMR/BPR entries, line clearance, IPC basics (OSD), and material status labeling.
- Shift-ready; quick learner for RMG/FBD/compression/coating (OSD) or sterile basics if applicable.

## EDUCATION
- Diploma in Biotechnology — Parul University, Vadodara | <Year> — <CGPA/%>

## CORE SKILLS
- Production: BMR/BPR entries, line clearance, reconciliation, IPC basics (weight/hardness/friability).
- EHS/5S: PPE usage, housekeeping, near-miss reporting attitude, audit readiness mindset.
- Compliance: cGMP, documentation accuracy, logbook maintenance.
- Tools: Excel (basic logs), barcode/ERP familiarity (theoretical), English/Hindi reporting.

## PROJECTS/INITIATIVES
- Mock OSD Batch Docs — Sample BMR pages, IPC logs, simple deviation note draft.
- 5S Checklist — Daily/weekly audit sheet template for aisle/label/cleanliness compliance.

## ADDITIONAL
- Availability: Immediate; shift-ready; Vadodara/Halol/A'bad/Ankleshwar
- Languages: English, Hindi, Gujarati

**ATS KEYWORDS**
Production, BMR/BPR, IPC, Granulation, Compression, Coating, Packing, Line Clearance, Reconciliation, cGMP, EHS, 5S, SOP, OSD, API, Trainee, Apprentice`
        },
        lab_tech: {
            title: "Lab Technician Resume - Balaji Dilip Singh",
            content: `# Balaji Dilip Singh
Vadodara, Gujarat • +91-<PHONE> • <EMAIL> • LinkedIn: <URL> • GitHub: <URL>

**TARGET ROLE: Lab Technician/Assistant (Diagnostics/SME Labs)**

## SUMMARY
- Wet-lab basics: sample handling/ID, pipetting, solution prep, centrifugation, UV-Vis, basic microscopy.
- Documentation-focused: logs, labeling, TAT tracking, internal QC basics; biosafety awareness.
- Beginner Python/Excel for simple cleaning and reporting.

## EDUCATION
- Diploma in Biotechnology — Parul University | <Year> — <CGPA/%>

## LAB SKILLS
- Sample Management: receipt, labeling, storage (temp/time), aliquoting.
- Techniques: dilution series, spectrophotometry (UV-Vis), pipetting practice, basic microscopy.
- Quality: control runs (concept), SOP/logs, biosafety.
- Data/Tools: Excel (filters/pivot), Google Sheets, basic Python (CSV cleaning), GitHub (portfolio).

## PROJECTS
- Diagnostics Data Log Template (Excel) — TAT, re-run flags, control tracking
- ELISA/PCR theory notes + mock run sheet (practice)

## ADDITIONAL
- Availability: Immediate; shifts OK
- Languages: English, Hindi, Gujarati

**ATS KEYWORDS**
Lab Technician, Sample Handling, Pipetting, UV-Vis, ELISA, Hematology Analyzer, Biochemistry Analyzer, TAT, QC Logs, SOP, GLP, Biosafety, Documentation`
        }
    },
    coverLetters: {
        apprentice: {
            title: "Apprenticeship Cover Letter",
            content: `Balaji Dilip Singh
Vadodara, Gujarat • +91-<PHONE> • <EMAIL> • LinkedIn: <URL>

Date: <DD Month YYYY>

Hiring Team,
<Company Name>

Subject: Application for Apprentice/Trainee – QC/QA/Production

Dear Hiring Team,

I am a Diploma in Biotechnology (Parul University) fresher seeking an Apprentice/Trainee opportunity in QC/QA/Production. I bring internship exposure in bioinformatics workflows along with strong documentation and SOP-driven practices.

Highlights aligned to entry-level roles:
- Quality/GMP: Familiar with cGMP, GDP, ALCOA+; basic understanding of deviation/CAPA/change control.
- Documentation & Lab: BMR/BPR familiarity, logbook discipline, line clearance records; basics of pH/UV-Vis/pipetting.
- Tools: Excel (pivot/VLOOKUP) and beginner Python/Linux/SQL for simple reporting/continuous improvement.

I am registered/ready to register under NAPS/NATS and am available for immediate joining. Locations: Vadodara/Ahmedabad/Halol/Ankleshwar. I am shift-ready.

Attached: my resume tailored for Apprentice/Trainee roles. I would be grateful for an interview opportunity.

Sincerely,
Balaji Dilip Singh
+91-<PHONE> | <EMAIL>`
        },
        trainee: {
            title: "Trainee Position Cover Letter",
            content: `Balaji Dilip Singh
Vadodara, Gujarat • +91-<PHONE> • <EMAIL> • LinkedIn: <URL>

Date: <DD Month YYYY>

Dear Hiring Manager,

I am writing to express my strong interest in the Trainee position at <Company Name>. As a recent Diploma graduate in Biotechnology from Parul University, I am eager to begin my career in the pharmaceutical industry.

My academic background and practical exposure have prepared me for entry-level roles in:
- Quality Control/Quality Assurance operations
- Production and manufacturing processes
- Laboratory operations and data management

Key qualifications:
✓ Strong foundation in biotechnology principles
✓ Hands-on experience with basic laboratory techniques
✓ Understanding of regulatory compliance (cGMP, GDP)
✓ Proficiency in documentation and data integrity
✓ Readiness for shift work and diverse assignments

I am particularly drawn to <Company Name> because of your reputation for excellence in pharmaceutical manufacturing and commitment to developing fresh talent. I am confident that my enthusiasm, technical aptitude, and willingness to learn will make me a valuable addition to your team.

I am available for immediate joining and would welcome the opportunity to discuss how I can contribute to your organization's continued success.

Thank you for your consideration.

Best regards,
Balaji Dilip Singh`
        }
    },
    linkedin: {
        headline: {
            title: "LinkedIn Professional Headline",
            content: `Biotech Diploma (Parul Univ) | NAPS-ready | QC/QA/Production Trainee | Python/SQL (beginner) | Vadodara/Ahmedabad

Alternative Headlines:
• Fresh Biotech Graduate | Apprentice-ready for Gujarat Pharma Belt | cGMP/Documentation Focus
• Biotechnology Diploma | Quality Control Enthusiast | Python/Data Skills | Immediate Joining Available
• Entry-level Pharmaceutical Professional | QC/QA/Production | Bioinformatics Background | Vadodara/Ahmedabad`
        },
        about: {
            title: "LinkedIn About Section",
            content: `Biotech diploma fresher with internship exposure in bioinformatics and strong interest in GMP/SOP-driven operations. Comfortable with documentation (BMR/BPR/logbooks), basic lab workflows (pH/UV-Vis/pipetting), and Excel-based reporting. Building "Bio + Data" edge via Python/SQL mini-projects (FASTA/BLAST, QC dashboard) on GitHub. Shift-ready; immediate joining in Gujarat pharma belt.

🎯 **Currently Seeking:** Apprentice/Trainee positions in QC/QA/Production
📍 **Location:** Open to Vadodara/Ahmedabad/Halol/Ankleshwar
🔬 **Interests:** Quality Control, Data Integrity, Bioinformatics, Pharmaceutical Manufacturing

🛠️ **Technical Skills:**
• Laboratory: pH measurement, UV-Vis spectrophotometry, pipetting, solution preparation
• Quality: cGMP, GDP, ALCOA+ principles, documentation practices
• Data: Excel (Pivot tables, VLOOKUP), Python basics, SQL fundamentals
• Tools: GitHub portfolio development, basic Linux command line

💡 **What I Bring:**
✓ Fresh perspective with solid theoretical foundation
✓ Hands-on experience in data handling and analysis
✓ Strong documentation and compliance mindset
✓ Eagerness to learn and adapt in shift environments
✓ Multilingual communication (English, Hindi, Gujarati)

🤝 **Let's Connect:** Always open to discussing opportunities in pharmaceutical and biotechnology sectors. Feel free to reach out for networking, mentorship, or potential collaborations.`
        },
        skills: {
            title: "LinkedIn Skills & Keywords",
            content: `**Top Skills to Pin (Top 10):**
1. cGMP (Current Good Manufacturing Practice)
2. GDP (Good Documentation Practice)
3. ALCOA+ (Data Integrity Principles)
4. Documentation (BMR/BPR)
5. Quality Control (QC)
6. Quality Assurance (QA)
7. Excel (Pivot Tables/VLOOKUP)
8. Python (Beginner)
9. SQL (Beginner)
10. Linux CLI

**Additional Skills to Add:**
• Pipetting/UV-Vis
• Data Integrity
• Laboratory Safety
• Good Laboratory Practice (GLP)
• Batch Manufacturing Record (BMR)
• Batch Processing Record (BPR)
• Line Clearance
• Deviation Management
• CAPA (Corrective and Preventive Action)
• Change Control
• OOS/OOT (Out of Specification/Trend)
• 5S Methodology
• EHS (Environment, Health, Safety)
• Bioinformatics
• FASTA/BLAST
• GitHub
• Data Analysis
• CSV Handling
• Pharmaceutical Manufacturing
• Apprenticeship Programs
• NAPS/NATS Ready

**Industry Keywords for Searchability:**
Pharmaceutical, Biotechnology, Gujarat Pharma Belt, Sun Pharma, Zydus, Alembic, Fresher, Entry Level, Trainee, Apprentice, Immediate Joining, Shift Ready`
        }
    },
    outreach: {
        hr_pharma: {
            title: "HR Outreach - Pharma Companies",
            content: `**Subject:** Apprentice/Trainee – Fresher (Vadodara/Ahmedabad)

Hi [Name],

I'm Balaji (Biotech Diploma, Parul Univ), NAPS-ready. Comfortable with cGMP/GDP basics, documentation (BMR/BPR/logs) and shifts. Applied for [Role]. Sharing resume. Are there upcoming batches or a walk-in I can attend?

Best regards,
Balaji Dilip Singh
+91-[PHONE] | [EMAIL]

---

**Alternative Version (Longer):**

Subject: Entry-level support for QC/QA (Apprentice/Trainee)

Hi [Name],

Hope you're doing well. I'm Balaji Dilip Singh, a recent Biotechnology Diploma graduate from Parul University, reaching out regarding entry-level opportunities at [Company Name].

I can support documentation and simple reporting (Excel/Python – OOS trends). Immediate joining in Gujarat belt. May I share my resume for consideration?

I'm particularly interested in:
• QC/QA Apprentice positions
• Production Trainee roles
• Laboratory Assistant opportunities

I'm NAPS-ready, shift-flexible, and available for immediate joining across Vadodara/Ahmedabad/Halol/Ankleshwar.

Would be grateful for any guidance or upcoming opportunity information.

Thanks for your time!

Best regards,
Balaji Dilip Singh
[Contact Information]`
        },
        diagnostics: {
            title: "Diagnostics Lab Outreach",
            content: `**Subject:** Lab Technician – Fresher | Immediate joining

Hi [Name],

I'm Balaji, Biotech Diploma graduate with hands-on basics (pipetting, solution prep, UV-Vis) + documentation discipline. Can I visit for a short assessment this week? Resume attached.

Key strengths:
• Sample handling and labeling
• Basic lab techniques
• Documentation accuracy
• TAT awareness
• Immediate availability

Available for shifts and eager to learn lab-specific protocols.

Thanks!
Balaji Dilip Singh
+91-[PHONE]

---

**Follow-up Message:**

Hi [Name],

Following up on my application for Lab Technician position. I understand the importance of accuracy and speed in diagnostic operations.

Quick question: Do you have any upcoming training programs or assessment opportunities for fresh graduates?

I'm ready to start immediately and committed to maintaining your lab's quality standards.

Best regards,
Balaji`
        },
        alumni: {
            title: "Alumni Referral Messages",
            content: `**Subject:** Referral guidance for Apprentice/Trainee

Hi [Name],

Hope you're doing great! I'm Balaji, a Biotech diploma fresher from Parul Univ targeting QC/QA/Production Apprentice roles. Any current openings to refer me to? I'll share JD + resume. Thanks!

Best,
Balaji

---

**Detailed Alumni Message:**

Hi [Alumni Name],

I hope this message finds you well. I'm Balaji Dilip Singh, a recent Biotechnology Diploma graduate from Parul University.

I came across your profile and noticed you're working at [Company Name]. I'm currently seeking entry-level opportunities in the pharmaceutical industry, specifically:

• QC/QA Apprentice positions
• Production Trainee roles
• Laboratory positions

Given your experience at [Company], I was wondering if you could provide any insights about:
1. Current hiring trends in your company
2. Skills that are most valued for fresh graduates
3. Any upcoming apprenticeship programs
4. Best approach for applications

I'd be incredibly grateful for any guidance or referral opportunities you might suggest. I'm ready for immediate joining and open to various locations in Gujarat.

Would you be available for a brief call this week? I understand you're busy, so even a few minutes of advice would be invaluable.

Thank you for your time and consideration!

Best regards,
Balaji Dilip Singh
[Contact Information]
[LinkedIn Profile]`
        },
        follow_up: {
            title: "Follow-up Messages",
            content: `**Subject:** Application follow-up – [Role, Job ID]

Hi [Name],

Applied on [date] for [Role]. I'm shift-ready, NAPS-ready, and open to Vadodara/Ahmedabad/Halol. Reattaching resume; kindly advise next steps.

Thanks!
Balaji Dilip Singh
+91-[PHONE]

---

**Second Follow-up (After 1 week):**

Hi [Name],

Following up on my application for [Role] submitted on [Date]. I remain very interested in the position and would appreciate any update on the selection process.

Since my application, I've also completed:
• [Any new certification/course]
• [Additional relevant activity]

I'm still available for immediate joining and eager to contribute to your team.

Please let me know if you need any additional information.

Best regards,
Balaji

---

**Third Follow-up (After 2 weeks):**

Hi [Name],

I hope you're doing well. I wanted to follow up once more on my application for [Role] position.

I understand recruitment processes can take time, and I wanted to reiterate my strong interest in joining [Company Name]. 

In the meantime, I've been:
• Enhancing my skills in [relevant area]
• Networking with industry professionals
• Preparing for pharmaceutical industry challenges

If the position has been filled, I'd be grateful if you could keep my profile for any future openings. I'm genuinely excited about the prospect of contributing to your organization.

Thank you for your patience and consideration.

Best regards,
Balaji Dilip Singh`
        }
    },
    actionPlan: {
        week1: {
            title: "Week 1: Foundation + High-Volume Targeting",
            content: `**WEEK 1 CHECKLIST:**

**Day 1-2: Setup & Documentation**
□ NAPS/NATS registration + documents upload
□ Finalize resume variants (QC/QA Apprentice, Production Trainee, Lab Tech)
□ Update LinkedIn (headline/about/skills), add Featured section
□ Create GitHub account and basic portfolio structure

**Day 3-4: Application Blitz**
□ Target: 15-20 applications (Gujarat + "Apprentice/Trainee/QC/Production/Lab Tech")
□ Focus companies: Sun Pharma, Zydus, Alembic, Torrent, Cadila
□ Document applications in tracker spreadsheet

**Day 5-6: Networking & Outreach**
□ 10 LinkedIn DMs (HR/Alumni/Team Leads)
□ 3 referral requests through college network
□ Connect with Parul University alumni in pharma

**Day 7: Skill Development Start**
□ Python basics: variables, loops, basic file I/O (60-90 min)
□ Linux commands: ls, cd, grep, basic navigation
□ Review cGMP, GDP, ALCOA+ basics

**Success Metrics Week 1:**
• 15-20 applications submitted
• 5-10 LinkedIn connections made
• NAPS registration completed
• Resume templates finalized
• GitHub profile created

**Red Flags to Watch:**
• Less than 10% response rate by Day 7
• Difficulty in finding job postings
• Technical issues with applications

**Adjustments if Needed:**
• Expand search radius to Ankleshwar/Halol
• Add more role types (Production, Packaging)
• Increase networking efforts`
        },
        week2: {
            title: "Week 2: Walk-ins + SME/Diagnostics Mix",
            content: `**WEEK 2 CHECKLIST:**

**Day 8-9: Physical Presence**
□ Attend 1 walk-in or schedule on-site HR meet
□ Prepare walk-in pack: resumes, certificates, ID proofs
□ Target: Alembic Pharmaceuticals (Vadodara), local labs

**Day 10-11: SME Focus**
□ Shortlist SME/Diagnostics labs (Vadodara/Ahmedabad)
□ Call/email for appointment slots
□ Research: Supratech, Neuberg, local diagnostic centers

**Day 12-13: Application Continuation**
□ 15-20 more applications
□ 10 follow-ups from Week 1 (email/call/DM)
□ Focus on diagnostics and SME pharmaceutical companies

**Day 14: Skill Development**
□ Python Day 4-7: files, CSV handling
□ BioPython installation and basic usage
□ BLAST basics and NCBI introduction
□ GitHub: FASTA parsing notebook draft

**Success Metrics Week 2:**
• 1 walk-in/HR meeting attended
• 30+ total applications (cumulative)
• 3-5 follow-up responses received
• GitHub project started
• 2-3 SME lab contacts made

**Networking Goals:**
• 5 new LinkedIn connections per day
• 1 meaningful conversation with industry professional
• Alumni coffee chat or phone call

**Contingency Plans:**
• If no walk-in opportunities: Schedule phone interviews
• If low response rate: Expand to Ahmedabad/Halol
• If technical difficulties: Seek help from college placement cell`
        },
        week3: {
            title: "Week 3: Conversion Push + Portfolio Signal",
            content: `**WEEK 3 CHECKLIST:**

**Day 15-16: NAPS Follow-up**
□ NAPS-linked apprenticeship leads follow-up (phone + email)
□ Contact companies with active NAPS programs
□ Check status of government apprenticeship portals

**Day 17-18: Geographic Expansion**
□ 15-20 applications; expand to Ankleshwar/Halol/Ahmedabad cluster
□ Target contract manufacturing organizations
□ Research API manufacturers in Gujarat

**Day 19-20: Portfolio Development**
□ Complete FASTA/BLAST demo + comprehensive README
□ LinkedIn post about project (with screenshots)
□ Add project link to all job applications

**Day 21: Interview Preparation**
□ Mock interview: 15 key questions
  - cGMP/GDP/ALCOA+
  - BMR/BPR understanding
  - OOS/OOT scenarios
  - IPC basics
□ Practice answers with family/friends

**Success Metrics Week 3:**
• 45+ total applications
• 1 completed GitHub project
• 1 LinkedIn post with engagement
• 1-2 interview calls/screenings
• Strong follow-up response rate

**Portfolio Content:**
• Professional README files
• Code comments and documentation
• LinkedIn posts showcasing work
• Updated resume with project links

**Interview Preparation Topics:**
• Company research (especially applied companies)
• Industry trends and regulations
• Personal motivation and career goals
• Technical skills demonstration`
        },
        week4: {
            title: "Week 4: Metrics Review + Strategic Adjustment",
            content: `**WEEK 4 CHECKLIST:**

**Day 22-23: Performance Review**
□ Analyze: applications sent, responses received, interviews scheduled
□ Calculate response rates and conversion metrics
□ Identify best-performing channels and companies

**Day 24-25: Strategic Adjustment**
□ If callbacks low: add Packaging/Production roles
□ If no interviews: intensive referral push
□ If geographic limitations: consider remote/hybrid options

**Day 26-27: Final Application Push**
□ Submit 15-20 more applications (total 60+)
□ Target 2 HR calls per day
□ Focus on previously responsive companies

**Day 28: Advanced Skills**
□ SQL basics: SELECT, WHERE, GROUP BY
□ Pandas introduction for data manipulation
□ Create simple QC dashboard mockup

**Day 29-30: Industry Preparation**
□ Study: 5S/EHS methodologies
□ Deviation/CAPA process understanding
□ Site/process awareness for interviews
□ Company-specific research for shortlisted interviews

**Success Metrics Week 4:**
• 60+ total applications submitted
• 3-5 active interview processes
• 2-3 second-round interviews
• 1+ job offer (target)
• Strong GitHub portfolio

**Final Review Questions:**
1. Which application channels worked best?
2. What skills gaps were identified?
3. Which companies showed most interest?
4. What feedback was received from interviews?
5. How can the approach be refined?

**Next Steps Planning:**
• Month 2 strategy if no offers
• Skill development continuation
• Network expansion plans
• Alternative role considerations

**Success Celebration:**
• Document lessons learned
• Thank mentors and supporters
• Plan career development next steps`
        }
    }
};

// Template Functions
function loadResumeTemplate(type) {
    const template = pharmaTemplates.resumes[type];
    displayTemplate(template.title, template.content);
}

function loadCoverLetter(type) {
    const template = pharmaTemplates.coverLetters[type];
    displayTemplate(template.title, template.content);
}

function loadLinkedInContent(type) {
    const template = pharmaTemplates.linkedin[type];
    displayTemplate(template.title, template.content);
}

function loadOutreachTemplate(type) {
    const template = pharmaTemplates.outreach[type];
    displayTemplate(template.title, template.content);
}

function loadActionPlan(week) {
    const template = pharmaTemplates.actionPlan[week];
    displayTemplate(template.title, template.content);
}

function displayTemplate(title, content) {
    document.getElementById('templateTitle').textContent = title;
    document.getElementById('templateContent').textContent = content;
    document.getElementById('templateDisplay').style.display = 'block';
    
    // Scroll to template display
    document.getElementById('templateDisplay').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function copyTemplateContent() {
    const content = document.getElementById('templateContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
        showMessage('Template content copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('Failed to copy content. Please select and copy manually.', 'error');
    });
}

function closeTemplate() {
    document.getElementById('templateDisplay').style.display = 'none';
}

function downloadTracker() {
    const csvContent = `Date,Company,Role,Location,Source,Contact Person/HR,Applied Via,Status,Next Action,Follow-up Date,Notes
2025-01-21,Sun Pharma,QC/QA Apprentice,Halol,Naukri,,naukri.com,Applied,Call reception + DM HR,2025-01-25,NAPS-ready
2025-01-21,Zydus Lifesciences,Production Trainee,Ahmedabad,LinkedIn,,linkedin.com,Applied,Email resume + ask walk-in slot,2025-01-26,
2025-01-21,Alembic Pharmaceuticals,Lab Technician,Vadodara,Company site,,alembicpharmaceuticals.com,Applied,Walk-in inquiry by phone,2025-01-24,Local company`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-application-tracker.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    showMessage('Application tracker CSV downloaded!', 'success');
}

function viewTrackerSample() {
    const sampleData = `**Application Tracker Sample Data:**

This spreadsheet helps you track:
• Application dates and companies
• Job roles and locations
• Application sources (LinkedIn, Naukri, etc.)
• Contact person details
• Current status and next actions
• Follow-up dates and notes

**Usage Tips:**
1. Update daily with new applications
2. Set reminders for follow-up dates
3. Track response rates by source
4. Note feedback from interviews
5. Maintain professional contact database

**Status Categories:**
• Applied - Recently submitted
• Screening - HR review in progress
• Interview - Interview scheduled/completed
• Offer - Job offer received
• Rejected - Application declined
• On Hold - Process paused`;
    
    displayTemplate('Application Tracker Guide', sampleData);
}