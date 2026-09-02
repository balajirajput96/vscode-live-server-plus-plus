// Global variables
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
let jobApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];

// AI Prompt Templates
const prompts = {
    'github': `Analyze this Python/R project and create a comprehensive README.md file including:

1. **Project Title:** Clear, descriptive title
2. **Description:** Brief overview for non-technical readers explaining the biological/medical relevance
3. **Dataset:** Source and type of data used (mention if public/private)
4. **Methodology:** 
   - Data preprocessing steps
   - Analysis techniques used
   - Statistical methods applied
5. **Key Findings:** 
   - Main biological insights
   - Statistical significance
   - Clinical relevance (if applicable)
6. **Technologies Used:** Python libraries, R packages, databases
7. **How to Run:** 
   - Installation requirements
   - Step-by-step execution guide
   - Expected output format
8. **Future Work:** Potential extensions or improvements

Make the content professional, clear, and suitable for biotechnology/bioinformatics professionals.`,

    'linkedin': `Create a professional LinkedIn post about this biotech/bioinformatics achievement:

**Post Structure:**
1. **Hook:** Engaging opening line about the breakthrough/learning
2. **Context:** Brief background on the problem/challenge
3. **Process:** What tools/methods were used (mention specific technologies)
4. **Results:** Key insights or outcomes achieved
5. **Impact:** How this contributes to the field or industry
6. **Call to Action:** Invite discussion or connections

**Tone:** Professional but approachable, showing expertise while remaining humble
**Length:** 150-300 words
**Hashtags:** Include relevant industry hashtags (#Bioinformatics #DataScience #Biotech)
**Emojis:** Use sparingly but effectively

Make it engaging for both technical and non-technical professionals in the biotech industry.`,

    'cover': `Write a compelling cover letter for this biotech/bioinformatics position:

**Structure:**
1. **Opening:** Strong hook connecting your background to the role
2. **Value Proposition:** 2-3 specific examples of relevant experience
3. **Technical Skills:** Highlight programming languages, tools, and methodologies
4. **Industry Knowledge:** Show understanding of company's focus area
5. **Closing:** Express enthusiasm and next steps

**Key Elements:**
- Quantify achievements where possible
- Mention specific projects from your portfolio
- Show knowledge of current industry trends
- Demonstrate problem-solving abilities
- Keep to 3-4 paragraphs maximum

Personalize for the specific company and role requirements.`,

    'interview': `Common Bioinformatics/Biotech Interview Questions and Sample Answers:

**Technical Questions:**
1. Explain your approach to analyzing genomic data
2. How do you handle missing data in clinical datasets?
3. Describe a challenging data analysis project you completed
4. What programming languages do you use and why?
5. How do you ensure data quality and reproducibility?

**Industry Questions:**
1. What interests you about our company's research focus?
2. How do you stay updated with bioinformatics trends?
3. Describe your experience with regulatory requirements
4. How would you explain complex analysis to non-technical stakeholders?

**Behavioral Questions:**
1. Tell me about a time you had to learn a new technology quickly
2. How do you handle tight project deadlines?
3. Describe a situation where your analysis led to unexpected results

Prepare specific examples from your projects to illustrate your answers.`
};

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
        document.getElementById('portfolioOutput').innerHTML = generatedContent;
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        showMessage('पोर्टफोलियो कंटेंट सफलतापूर्वक जनरेट किया गया!', 'success');
    }, 2000);
}

function generatePortfolioText(name, type, description, tools, dataset, findings) {
    return `# ${name}

## Project Overview
**Type:** ${type}
**Description:** ${description}

## Technologies Used
${tools}

## Dataset Information
**Source:** ${dataset}

## Key Findings
${findings}

## Implementation
\`\`\`python
# Sample code structure for ${name}
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Data loading and preprocessing
data = pd.read_csv('${dataset}')
cleaned_data = data.dropna()

# Analysis implementation
# Add your specific analysis code here

# Visualization
plt.figure(figsize=(10, 6))
# Add your plotting code
plt.show()
\`\`\`

## Results and Discussion
${findings}

## Conclusion
This project demonstrates proficiency in ${tools} and provides valuable insights for ${type} applications.

## License
MIT License</code></pre>
        </div>
    `;
}

function saveProject() {
    const projectName = document.getElementById('projectName').value;
    const projectType = document.getElementById('projectType').value;
    const description = document.getElementById('projectDescription').value;
    const tools = document.getElementById('toolsUsed').value;
    const dataset = document.getElementById('datasetSource').value;
    const findings = document.getElementById('keyFindings').value;

    if (!projectName) {
        showMessage('प्रोजेक्ट का नाम आवश्यक है', 'error');
        return;
    }

    const project = {
        id: Date.now(),
        name: projectName,
        type: projectType,
        description: description,
        tools: tools,
        dataset: dataset,
        findings: findings,
        createdAt: new Date().toISOString()
    };

    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    showMessage('प्रोजेक्ट सफलतापूर्वक सेव किया गया!', 'success');
    updateAnalytics();
}

// Social Media Generator Functions
function generateSocialPost() {
    const postType = document.getElementById('postType').value;
    const message = document.getElementById('postMessage').value;
    const platform = document.getElementById('socialPlatform').value;

    if (!message) {
        showMessage('कृपया मुख्य संदेश भरें', 'error');
        return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> Generating...';
    button.disabled = true;

    // Simulate AI processing
    setTimeout(() => {
        const generatedPost = generateSocialPostText(postType, message, platform);
        document.getElementById('socialOutput').innerHTML = generatedPost;
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        showMessage('सोशल मीडिया पोस्ट जनरेट किया गया!', 'success');
    }, 2000);
}

function generateSocialPostText(type, message, platform) {
    const templates = {
        'achievement': `🎉 Excited to share a recent accomplishment!

${message}

This experience has strengthened my skills in data analysis and reinforced my passion for biotechnology innovation.

Looking forward to applying these insights in future projects! 💡

#Bioinformatics #DataScience #Biotech #Innovation #CareerGrowth`,

        'learning': `📚 Continuous learning in action!

Recently diving deep into: ${message}

The field of bioinformatics is constantly evolving, and staying updated with the latest tools and methodologies is crucial for delivering impactful results.

What new technologies are you exploring in your field? 🤔

#LearningJourney #Bioinformatics #ProfessionalDevelopment #DataScience`,

        'project': `🔬 Project Spotlight: 

${message}

This analysis demonstrates the power of computational biology in solving real-world problems. The intersection of data science and life sciences continues to unlock new possibilities.

Excited to share more insights from this work! 

#ProjectShowcase #Bioinformatics #DataAnalysis #LifeSciences #Innovation`,

        'industry': `💭 Industry Insight:

${message}

The biotechnology landscape is rapidly changing, and these developments highlight the importance of data-driven decision making in advancing human health.

What are your thoughts on this trend? Share your perspective below! 👇

#BiotechTrends #DataScience #HealthTech #Innovation #Industry`
    };

    return templates[type] || templates['achievement'];
}

function schedulePost() {
    showMessage('पोस्ट शेड्यूलिंग फीचर जल्द ही उपलब्ध होगा!', 'success');
}

// Resume Optimizer Functions
function optimizeContent() {
    const resumeType = document.getElementById('resumeType').value;
    const currentContent = document.getElementById('currentContent').value;
    const targetJob = document.getElementById('targetJob').value;

    if (!currentContent) {
        showMessage('कृपया वर्तमान कंटेंट भरें', 'error');
        return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="loading"></div> Optimizing...';
    button.disabled = true;

    // Simulate AI processing
    setTimeout(() => {
        const optimizedContent = generateOptimizedContent(resumeType, currentContent, targetJob);
        document.getElementById('resumeOutput').innerHTML = optimizedContent;
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        showMessage('कंटेंट सफलतापूर्वक optimize किया गया!', 'success');
    }, 2000);
}

function generateOptimizedContent(type, content, targetJob) {
    const optimizations = {
        'headline': `🔍 Optimized LinkedIn Headline:

"${targetJob} | Bioinformatics & Data Science Expert | Python, R & Machine Learning | Transforming Biological Data into Actionable Insights"

📊 Key Improvements:
- Lead with target job title
- Highlight technical skills
- Emphasize value proposition
- Include relevant keywords for recruiters`,

        'summary': `📝 Optimized Professional Summary:

Results-driven ${targetJob} with expertise in computational biology and data analysis. Skilled in Python, R, and machine learning applications for biological data interpretation. Proven track record of delivering actionable insights from complex genomic and clinical datasets.

✅ Core Strengths:
• Advanced programming in Python/R
• Statistical analysis and visualization
• Genomic data processing
• Machine learning implementation
• Cross-functional collaboration

💡 Key Improvements:
- Quantified achievements
- Industry-specific keywords
- Technical skill emphasis
- Action-oriented language`,

        'skills': `🛠️ Optimized Skills Section:

**Technical Skills:**
• Programming: Python, R, SQL, Bash
• Bioinformatics Tools: BLAST, Bioconductor, Galaxy
• Data Analysis: Pandas, NumPy, Scikit-learn
• Visualization: Matplotlib, Seaborn, ggplot2
• Databases: PostgreSQL, MongoDB
• Cloud Platforms: AWS, Google Cloud

**Domain Expertise:**
• Genomic Data Analysis
• Statistical Modeling
• Machine Learning Applications
• Clinical Data Processing
• Biomarker Discovery

🎯 Optimization Notes:
- Grouped skills by category
- Included industry-standard tools
- Balanced technical and domain knowledge`,

        'experience': `💼 Optimized Experience Description:

**${targetJob} • [Company Name]**
*[Duration]*

• Analyzed genomic datasets (10,000+ samples) using Python and R, identifying 15 novel biomarkers with statistical significance (p<0.05)
• Developed machine learning models achieving 85% accuracy in predicting treatment outcomes
• Collaborated with cross-functional teams of 8+ scientists to deliver 3 major research publications
• Automated data processing pipelines, reducing analysis time by 60%
• Presented findings to C-level executives and regulatory teams

🔧 Technical Stack: Python, R, SQL, AWS, Docker, Git

✨ Improvements Made:
- Quantified all achievements
- Included specific technologies
- Emphasized collaboration
- Highlighted efficiency gains
- Added business impact`
    };

    return optimizations[type] || optimizations['summary'];
}

function generateMultiple() {
    showMessage('Multiple content generation feature coming soon!', 'success');
}

// Job Tracker Functions
function searchJobs() {
    const searchTerm = document.getElementById('jobSearch').value;
    
    if (!searchTerm) {
        showMessage('कृपया जॉब सर्च टर्म भरें', 'error');
        return;
    }
    
    showMessage(`Searching for "${searchTerm}" jobs...`, 'success');
    updateJobList();
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
    const application = {
        id: Date.now(),
        title: title,
        company: company,
        appliedAt: new Date().toISOString(),
        status: 'Applied'
    };
    
    jobApplications.push(application);
    localStorage.setItem('jobApplications', JSON.stringify(jobApplications));
    
    showMessage(`आपने ${company} में ${title} के लिए आवेदन दिया है!`, 'success');
    updateAnalytics();
}

function saveJob(title, company) {
    showMessage(`${company} में ${title} जॉब सेव किया गया!`, 'success');
}

// AI Prompts Functions
function copyPrompt(button) {
    const promptType = button.getAttribute('data-prompt');
    const promptText = prompts[promptType];
    
    if (promptText) {
        navigator.clipboard.writeText(promptText).then(() => {
            button.innerHTML = 'Copied!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = 'Copy';
                button.style.background = '#28a745';
            }, 2000);
            
            showMessage('प्रॉम्प्ट कॉपी किया गया!', 'success');
        }).catch(() => {
            showMessage('कॉपी करने में त्रुटि हुई', 'error');
        });
    }
}

// Analytics Functions
function updateAnalytics() {
    // Update stats based on stored data
    const totalProjects = projects.length;
    const totalPosts = socialPosts.length;
    const totalApplications = jobApplications.length;
    
    // Update progress bars (this is a simulation)
    const portfolioProgress = Math.min((totalProjects / 10) * 100, 100);
    const linkedinProgress = Math.min((totalPosts / 20) * 100, 100);
    const jobProgress = Math.min((totalApplications / 20) * 100, 100);
    
    // You could update the actual progress bars here
    console.log('Analytics updated:', { portfolioProgress, linkedinProgress, jobProgress });
}

// Utility Functions
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function loadStoredData() {
    projects = JSON.parse(localStorage.getItem('projects')) || [];
    socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
    jobApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    updateAnalytics();
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
        jobApplications: jobApplications,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'career-automation-data.json';
    link.click();
}

// Initialize tooltips and help text
function initializeHelp() {
    const helpTexts = {
        'projectName': 'Enter a descriptive name for your bioinformatics project',
        'projectType': 'Select the category that best describes your project',
        'toolsUsed': 'List the programming languages and tools you used',
        'projectDescription': 'Provide a brief overview of what your project does',
        'datasetSource': 'Mention where you got your data from',
        'keyFindings': 'Summarize the main insights or results'
    };
    
    Object.keys(helpTexts).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = helpTexts[id];
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    initializeHelp();
    updateJobList(); // Load sample jobs
});

// Initialize help on load
document.addEventListener('DOMContentLoaded', initializeHelp);