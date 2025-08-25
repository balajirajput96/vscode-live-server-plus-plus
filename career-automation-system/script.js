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
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected tab button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
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
    return `# ${name}

## 🎯 Project Overview
${description}

## 🛠️ Technologies Used
- **Programming Languages**: ${tools.includes('Python') ? 'Python' : 'Python, R'}
- **Libraries/Frameworks**: ${tools}
- **Database**: SQL, NoSQL
- **Visualization**: Matplotlib, Seaborn, Plotly

## 📊 Dataset Information
- **Source**: ${dataset}
- **Size**: [Dataset size information]
- **Format**: CSV, JSON, FASTA (as applicable)

## 🔬 Methodology
1. **Data Collection**: Gathered data from ${dataset}
2. **Data Preprocessing**: Cleaned and normalized the dataset
3. **Analysis**: Applied ${type} techniques
4. **Validation**: Cross-validation and statistical testing
5. **Visualization**: Created comprehensive plots and charts

## 📈 Key Findings
${findings}

## 🚀 Results
- Achieved [X]% accuracy in predictions
- Identified [X] significant patterns
- Reduced processing time by [X]%
- Generated actionable insights for biotech applications

## 📁 Project Structure
\`\`\`
${name.toLowerCase().replace(/\s+/g, '-')}/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── data_exploration.ipynb
│   └── analysis.ipynb
├── src/
│   ├── data_processing.py
│   └── analysis.py
├── results/
│   ├── figures/
│   └── reports/
├── requirements.txt
└── README.md
\`\`\`

## 🔧 Installation & Usage
\`\`\`bash
# Clone the repository
git clone https://github.com/username/${name.toLowerCase().replace(/\s+/g, '-')}.git

# Install dependencies
pip install -r requirements.txt

# Run the analysis
python src/analysis.py
\`\`\`

## 📊 Sample Output
[Include sample visualizations or results]

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact
- **Author**: Your Name
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]

---
**Built with ❤️ for advancing Biotechnology and Bioinformatics research**`;
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
}

// Social Media Generator Functions
function generateSocialPost() {
    const platform = document.getElementById('platform').value;
    const postType = document.getElementById('postType').value;
    const content = document.getElementById('postContent').value;
    const tone = document.getElementById('postTone').value;
    const hashtags = document.getElementById('hashtags').value;

    if (!content) {
        showMessage('कृपया post content भरें', 'error');
        return;
    }

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
        
        showMessage('Social media post सफलतापूर्वक जनरेट किया गया!', 'success');
    }, 1500);
}

function generateSocialContent(platform, postType, content, tone, hashtags) {
    const posts = {
        linkedin: {
            'project-share': `🚀 Excited to share my latest ${postType} project!

${content}

This project demonstrates the power of bioinformatics in solving real-world challenges. Through advanced data analysis and machine learning techniques, I was able to uncover valuable insights that could impact biotechnology research.

Key achievements:
• Applied cutting-edge computational biology methods
• Processed and analyzed large-scale biological datasets
• Developed scalable solutions for biotech applications
• Contributed to the advancement of personalized medicine

Always grateful for the opportunity to work at the intersection of biology and technology! 💻🧬

${hashtags} #Biotechnology #DataScience #MachineLearning #Research #Innovation`,

            'achievement': `🎉 Thrilled to announce ${content}!

This milestone represents months of dedicated work in the field of bioinformatics and computational biology. I'm grateful for the mentorship, collaboration, and continuous learning that made this possible.

Special thanks to my mentors and colleagues who supported this journey. Their guidance has been invaluable in developing both technical skills and research methodologies.

Looking forward to applying these learnings to solve more complex challenges in biotechnology and contribute to meaningful research outcomes.

${hashtags} #Achievement #Bioinformatics #ProfessionalGrowth #Grateful`,

            'learning': `📚 Today I learned about ${content}, and I'm amazed by its applications in biotechnology!

The intersection of computational methods and biological research continues to fascinate me. This new knowledge opens up exciting possibilities for:

• Enhanced data analysis workflows
• Novel approaches to biological problem-solving
• Improved efficiency in research processes
• Better understanding of complex biological systems

The rapid evolution of bioinformatics tools and techniques constantly reminds me why continuous learning is essential in our field.

What's the most exciting thing you've learned recently in biotech or data science?

${hashtags} #ContinuousLearning #Bioinformatics #TechTrends #Research`,

            'industry-insight': `🔬 Industry Insight: ${content}

The biotechnology sector is experiencing unprecedented growth, driven by advances in computational biology, AI-driven drug discovery, and personalized medicine approaches.

Key trends I'm observing:
• Integration of AI/ML in pharmaceutical research
• Rise of precision medicine and genomics
• Increased demand for bioinformatics professionals
• Growing importance of data-driven healthcare solutions

For professionals in our field, this presents incredible opportunities to make meaningful contributions to human health and scientific advancement.

What trends are you seeing in your area of biotech? Let's discuss in the comments!

${hashtags} #Biotechnology #IndustryTrends #FutureOfHealthcare #Innovation`
        }
    };

    return posts[platform]?.[postType] || `Generated post for ${platform}:\n\n${content}\n\n${hashtags}`;
}

function generateMultiple() {
    showMessage('5 विविध posts जनरेट हो रहे हैं...', 'success');
    
    const content = document.getElementById('postContent').value;
    if (!content) {
        showMessage('कृपया content भरें', 'error');
        return;
    }

    const platform = document.getElementById('platform').value;
    const hashtags = document.getElementById('hashtags').value;
    
    const multipleTypes = ['project-share', 'achievement', 'learning', 'industry-insight'];
    let allPosts = '';
    
    multipleTypes.forEach((type, index) => {
        allPosts += `\n\n--- POST ${index + 1} (${type.toUpperCase()}) ---\n\n`;
        allPosts += generateSocialContent(platform, type, content, 'professional', hashtags);
    });
    
    document.getElementById('socialContent').innerHTML = allPosts;
    document.getElementById('socialOutput').style.display = 'block';
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
    const optimizations = {
        'resume': `OPTIMIZED RESUME CONTENT:

🎯 PROFESSIONAL SUMMARY
Results-driven Biotechnology professional with expertise in bioinformatics, data analysis, and computational biology. Proven track record of applying machine learning and statistical methods to solve complex biological problems. Seeking ${role} position to leverage analytical skills and domain knowledge in advancing ${company ? company + "'s" : "biotech"} research initiatives.

💼 CORE COMPETENCIES
• Bioinformatics & Computational Biology
• Python, R, SQL Programming
• Machine Learning & Statistical Analysis
• Data Visualization (Matplotlib, Seaborn, Plotly)
• Genomics & Proteomics Analysis
• Database Management & Big Data Processing
• Research Methodology & Scientific Writing

🔬 PROFESSIONAL EXPERIENCE
[Your experience with enhanced descriptions focusing on quantifiable achievements]

🎓 EDUCATION & CERTIFICATIONS
[Your education with relevant coursework and certifications highlighted]

📊 KEY ACHIEVEMENTS
• Developed machine learning models with 95%+ accuracy
• Processed and analyzed datasets containing 10M+ data points
• Published research in peer-reviewed journals
• Reduced analysis time by 40% through workflow optimization

Original content has been optimized for ATS compatibility and ${role} requirements.`,

        'linkedin-headline': `OPTIMIZED LINKEDIN HEADLINE:

${role} | Bioinformatics & Data Science Expert | Transforming Biological Data into Actionable Insights | Python • R • Machine Learning • Genomics

Alternative headlines:
• Biotechnology Professional | ${role} | Computational Biology & AI Enthusiast | Driving Innovation in Life Sciences
• Data-Driven Bioinformatics Specialist | ${role} | Bridging Biology & Technology for Better Healthcare Solutions
• ${role} | Bioinformatics Expert | Leveraging Big Data & AI to Advance Biotech Research | Available for New Opportunities`,

        'linkedin-summary': `OPTIMIZED LINKEDIN SUMMARY:

🧬 Passionate ${role} with a strong foundation in biotechnology and computational biology

I specialize in transforming complex biological datasets into meaningful insights that drive scientific discovery and innovation. With expertise in bioinformatics, machine learning, and data visualization, I help organizations unlock the potential of their biological data.

🔬 WHAT I BRING TO THE TABLE:
• Advanced proficiency in Python, R, and SQL for biological data analysis
• Experience with genomics, proteomics, and transcriptomics data
• Machine learning model development and statistical analysis
• Data visualization and scientific communication skills
• Strong research methodology and problem-solving abilities

📊 RECENT ACHIEVEMENTS:
• Developed predictive models improving research efficiency by 40%
• Analyzed multi-omics datasets leading to 3 peer-reviewed publications
• Implemented automated workflows reducing analysis time from weeks to days
• Collaborated with cross-functional teams on drug discovery projects

🎯 SEEKING OPPORTUNITIES:
I'm actively seeking ${role} positions where I can apply my analytical skills to solve complex biological challenges and contribute to advancing human health through data-driven insights.

${company ? `I'm particularly interested in opportunities at ${company}, where I can contribute to your mission of innovation in biotechnology.` : ''}

🤝 LET'S CONNECT:
Always open to discussing exciting opportunities in bioinformatics, data science, and biotechnology. Feel free to reach out!`,

        'cover-letter': `OPTIMIZED COVER LETTER:

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position${company ? ` at ${company}` : ''}. With my background in biotechnology and expertise in bioinformatics, I am excited about the opportunity to contribute to your team's success.

My experience includes:
• Advanced data analysis using Python, R, and specialized bioinformatics tools
• Machine learning model development for biological applications
• Statistical analysis of genomics and proteomics datasets
• Collaboration with multidisciplinary research teams
• Scientific writing and presentation of complex findings

What sets me apart is my ability to bridge the gap between biological complexity and computational solutions. I have successfully transformed raw biological data into actionable insights that have led to significant research breakthroughs.

${company ? `I am particularly drawn to ${company} because of your commitment to innovation and your impact on advancing biotechnology research.` : 'I am eager to bring my analytical skills and scientific curiosity to your organization.'} I am confident that my technical expertise and passion for biological research make me an ideal candidate for this role.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team's continued success. Thank you for considering my application.

Sincerely,
[Your Name]`
    };

    return optimizations[type] || `Optimized content for ${type}:\n\n${content}`;
}

// Job Tracker Functions
function searchJobs() {
    const searchTerm = document.getElementById('jobSearch').value;
    
    if (!searchTerm) {
        showMessage('कृपया search term भरें', 'error');
        return;
    }

    showMessage('Jobs search हो रही है...', 'success');
    
    // Simulate job search
    setTimeout(() => {
        updateJobList();
    }, 1000);
}

function updateJobList() {
    const jobResults = document.getElementById('jobResults');
    
    const sampleJobs = [
        {
            title: 'Bioinformatics Analyst',
            company: 'TCS Bio Sciences',
            location: 'Bangalore, India',
            description: 'Analyze genomic data using computational tools and develop algorithms for biological research.',
            type: 'Full-time'
        },
        {
            title: 'Data Scientist - Biotech',
            company: 'Biocon Limited',
            location: 'Hyderabad, India',
            description: 'Apply machine learning techniques to drug discovery and development processes.',
            type: 'Full-time'
        },
        {
            title: 'Research Associate - Computational Biology',
            company: 'Indian Institute of Science',
            location: 'Bangalore, India',
            description: 'Conduct research in computational biology and bioinformatics for academic publications.',
            type: 'Contract'
        }
    ];

    jobResults.innerHTML = sampleJobs.map(job => `
        <div class="job-card">
            <h3>${job.title}</h3>
            <div class="company">${job.company}</div>
            <div class="location">${job.location}</div>
            <p class="description">${job.description}</p>
            <div class="job-actions">
                <button class="btn btn-sm btn-primary" onclick="applyForJob('${job.title}', '${job.company}')">Apply</button>
                <button class="btn btn-sm btn-secondary" onclick="saveJob('${job.title}', '${job.company}')">Save</button>
            </div>
        </div>
    `).join('');
}

function applyForJob(title, company) {
    showMessage(`${company} में ${title} के लिए application submit की गई!`, 'success');
}

function saveJob(title, company) {
    showMessage(`${company} में ${title} job saved!`, 'success');
}

// AI Prompts Functions
function copyPrompt(button) {
    const promptCard = button.closest('.prompt-card');
    const promptContent = promptCard.querySelector('.prompt-content').textContent;
    
    navigator.clipboard.writeText(promptContent).then(() => {
        showMessage('Prompt copied to clipboard!', 'success');
    });
}

// Analytics Functions
function updateAnalytics() {
    document.getElementById('projectCount').textContent = projects.length;
    document.getElementById('postCount').textContent = socialPosts.length;
    document.getElementById('jobCount').textContent = '12'; // Sample data
    document.getElementById('successRate').textContent = '78%'; // Sample data
}

// Utility Functions
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function loadStoredData() {
    // Load projects and social posts from localStorage
    projects = JSON.parse(localStorage.getItem('projects')) || [];
    socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Content copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('Failed to copy content', 'error');
    });
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

// Help function
function showHelp() {
    showMessage('Keyboard shortcuts: Ctrl+1-6 for tabs, Auto-save every 30 seconds', 'success');
}

// Initialize tooltips and help text
function initializeHelp() {
    // Add tooltips and help text initialization here
}

// Initialize help on load
document.addEventListener('DOMContentLoaded', initializeHelp);