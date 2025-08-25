// Global variables
let projects = [];
let socialPosts = [];
let currentTab = 'portfolio';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    updateAnalytics();
    initializeHelp();
});

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    currentTab = tabName;
    
    // Load tab-specific data
    if (tabName === 'portfolio') {
        displayProjects();
    } else if (tabName === 'social') {
        displaySocialPosts();
    } else if (tabName === 'jobs') {
        updateJobList();
    }
}

// Portfolio Builder Functions
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
    displayProjects();
}

function clearPortfolioForm() {
    document.getElementById('projectName').value = '';
    document.getElementById('projectType').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('toolsUsed').value = '';
    document.getElementById('datasetSource').value = '';
    document.getElementById('keyFindings').value = '';
}

function displayProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p class="text-center">अभी तक कोई प्रोजेक्ट नहीं जोड़ा गया है। ऊपर से नया प्रोजेक्ट जोड़ें।</p>';
        return;
    }
    
    projects.forEach(project => {
        const projectCard = `
            <div class="project-card">
                <h4>${project.name}</h4>
                <span class="project-type">${project.type}</span>
                <p><strong>Description:</strong> ${project.description}</p>
                <p><strong>Tools:</strong> ${project.tools}</p>
                <p><strong>Dataset:</strong> ${project.dataset}</p>
                <p><strong>Key Findings:</strong> ${project.findings}</p>
                <p><strong>Date:</strong> ${project.date}</p>
            </div>
        `;
        projectsList.innerHTML += projectCard;
    });
}

// Social Media Functions
function generateContent() {
    const platform = document.getElementById('platform').value;
    const postType = document.getElementById('postType').value;
    
    // Simulate AI content generation
    const templates = {
        'linkedin-project-showcase': '🚀 Excited to share my latest project! I recently completed a ${projectType} that focuses on ${topic}. Key highlights:\n\n✅ Used ${tools}\n✅ Achieved ${results}\n✅ Learned ${learnings}\n\n#DataScience #MachineLearning #Bioinformatics #TechInnovation',
        'facebook-career-tip': '💡 Career Tip: ${tip}\n\nThis has been a game-changer in my professional journey! What strategies have worked best for you? Share in the comments! 👇\n\n#CareerGrowth #ProfessionalDevelopment #TechCareers',
        'twitter-industry-insight': '🔬 Latest trends in ${industry}:\n\n• ${trend1}\n• ${trend2}\n• ${trend3}\n\nWhat excites you most about these developments? #${hashtag1} #${hashtag2}'
    };
    
    const templateKey = `${platform}-${postType}`;
    const template = templates[templateKey] || 'यहाँ आपका AI-generated content होगा...';
    
    document.getElementById('postContent').value = template;
    showMessage('Content successfully generated!', 'success');
}

function schedulePost() {
    showMessage('पोस्ट शेड्यूलिंग फीचर जल्द ही उपलब्ध होगा!', 'success');
}

function saveSocialPost() {
    const postData = {
        id: Date.now(),
        platform: document.getElementById('platform').value,
        type: document.getElementById('postType').value,
        content: document.getElementById('postContent').value,
        date: new Date().toLocaleDateString('hi-IN')
    };
    
    if (!postData.content) {
        showMessage('कृपया post content भरें', 'error');
        return;
    }
    
    socialPosts.push(postData);
    localStorage.setItem('socialPosts', JSON.stringify(socialPosts));
    showMessage('Social media post saved!', 'success');
    updateAnalytics();
}

function displaySocialPosts() {
    const socialPostsContainer = document.getElementById('socialPosts');
    socialPostsContainer.innerHTML = '';
    
    if (socialPosts.length === 0) {
        socialPostsContainer.innerHTML = '<p class="text-center">अभी तक कोई social media post नहीं बनाया गया है।</p>';
        return;
    }
    
    socialPosts.forEach(post => {
        const postCard = `
            <div class="social-post">
                <span class="post-platform">${post.platform}</span>
                <h4>${post.type}</h4>
                <p>${post.content}</p>
                <small>Created: ${post.date}</small>
            </div>
        `;
        socialPostsContainer.innerHTML += postCard;
    });
}

// Resume Builder Functions
function optimizeSection(section) {
    const messages = {
        'summary': 'Professional summary को AI से optimize किया जा रहा है...',
        'skills': 'Skills section को latest industry trends के साथ update किया जा रहा है...',
        'experience': 'Experience descriptions को impact-focused language के साथ improve किया जा रहा है...'
    };
    
    showMessage(messages[section] || 'Section को optimize किया जा रहा है...', 'success');
    
    // Simulate optimization process
    setTimeout(() => {
        showMessage(`${section} section successfully optimized!`, 'success');
    }, 2000);
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
    const jobList = document.getElementById('jobList');
    
    // Simulate job listings
    const jobs = [
        {
            title: 'Data Scientist',
            company: 'TechCorp India',
            location: 'Bangalore',
            type: 'Full-time',
            description: 'Looking for experienced data scientist with Python, ML skills'
        },
        {
            title: 'Bioinformatics Analyst',
            company: 'BioTech Solutions',
            location: 'Hyderabad',
            type: 'Contract',
            description: 'Genomic data analysis, R/Python required'
        },
        {
            title: 'Machine Learning Engineer',
            company: 'AI Innovations',
            location: 'Mumbai',
            type: 'Full-time',
            description: 'ML model deployment and optimization'
        }
    ];
    
    jobList.innerHTML = '';
    jobs.forEach(job => {
        const jobItem = `
            <div class="job-item">
                <div class="job-info">
                    <h4>${job.title}</h4>
                    <p><strong>${job.company}</strong> - ${job.location} (${job.type})</p>
                    <p>${job.description}</p>
                </div>
                <div class="job-actions">
                    <button class="apply-btn" onclick="applyForJob('${job.title}', '${job.company}')">
                        <i class="fas fa-paper-plane"></i> Apply
                    </button>
                    <button class="save-btn" onclick="saveJob('${job.title}', '${job.company}')">
                        <i class="fas fa-heart"></i> Save
                    </button>
                </div>
            </div>
        `;
        jobList.innerHTML += jobItem;
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
    document.getElementById('projectCount').textContent = projects.length;
    document.getElementById('postCount').textContent = socialPosts.length;
    document.getElementById('jobCount').textContent = Math.floor(Math.random() * 10) + 1;
    document.getElementById('weeklyActivity').textContent = projects.length + socialPosts.length;
}

// Utility Functions
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Auto remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageContainer.removeChild(messageElement);
        }
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
    // Add tooltips to important elements
    const helpElements = document.querySelectorAll('[data-help]');
    helpElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const helpText = this.getAttribute('data-help');
            showMessage(helpText, 'info');
        });
    });
}

// Initialize help on load
document.addEventListener('DOMContentLoaded', initializeHelp);