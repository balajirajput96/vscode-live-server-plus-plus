// Career Automation Dashboard - Main JavaScript File

// Global variables
let currentTab = 'portfolio';
let isLoading = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeForms();
    initializeJobSearch();
    initializeCopyFunctions();
    showWelcomeMessage();
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
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;
}

// Form Initialization
function initializeForms() {
    // Portfolio Form
    const portfolioForm = document.getElementById('portfolioForm');
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', handlePortfolioForm);
    }

    // Social Media Form
    const socialForm = document.getElementById('socialForm');
    if (socialForm) {
        socialForm.addEventListener('submit', handleSocialForm);
    }

    // Resume Form
    const resumeForm = document.getElementById('resumeForm');
    if (resumeForm) {
        resumeForm.addEventListener('submit', handleResumeForm);
    }
}

// Portfolio Form Handler
async function handlePortfolioForm(e) {
    e.preventDefault();
    
    const formData = {
        projectName: document.getElementById('projectName').value,
        projectDescription: document.getElementById('projectDescription').value,
        toolsUsed: document.getElementById('toolsUsed').value,
        datasetSource: document.getElementById('datasetSource').value,
        keyFindings: document.getElementById('keyFindings').value
    };

    if (!formData.projectName) {
        showMessage('कृपया प्रोजेक्ट का नाम दर्ज करें', 'error');
        return;
    }

    setLoading(true);
    
    try {
        const readme = await generateREADME(formData);
        displayPortfolioOutput(readme);
        showMessage('README.md सफलतापूर्वक बनाया गया!', 'success');
    } catch (error) {
        showMessage('README बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।', 'error');
        console.error('Error generating README:', error);
    } finally {
        setLoading(false);
    }
}

// Social Media Form Handler
async function handleSocialForm(e) {
    e.preventDefault();
    
    const formData = {
        platform: document.getElementById('platform').value,
        projectTitle: document.getElementById('projectTitle').value,
        projectGoal: document.getElementById('projectGoal').value,
        keyInsight: document.getElementById('keyInsight').value
    };

    if (!formData.projectTitle) {
        showMessage('कृपया प्रोजेक्ट का शीर्षक दर्ज करें', 'error');
        return;
    }

    setLoading(true);
    
    try {
        const posts = await generateSocialPosts(formData);
        displaySocialOutput(posts);
        showMessage('सोशल मीडिया पोस्ट सफलतापूर्वक बनाए गए!', 'success');
    } catch (error) {
        showMessage('पोस्ट बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।', 'error');
        console.error('Error generating social posts:', error);
    } finally {
        setLoading(false);
    }
}

// Resume Form Handler
async function handleResumeForm(e) {
    e.preventDefault();
    
    const formData = {
        experience: document.getElementById('experience').value,
        targetRole: document.getElementById('targetRole').value,
        keySkills: document.getElementById('keySkills').value
    };

    setLoading(true);
    
    try {
        const profile = await generateLinkedInProfile(formData);
        displayResumeOutput(profile);
        showMessage('LinkedIn प्रोफाइल सफलतापूर्वक बनाया गया!', 'success');
    } catch (error) {
        showMessage('प्रोफाइल बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।', 'error');
        console.error('Error generating LinkedIn profile:', error);
    } finally {
        setLoading(false);
    }
}

// AI Content Generation Functions

// Generate README.md
async function generateREADME(data) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const readme = `# ${data.projectName}

## 📋 Description
${data.projectDescription || 'A comprehensive analysis project in the field of bioinformatics and data science.'}

## 🎯 Project Overview
This project demonstrates advanced data analysis techniques applied to biological datasets, showcasing skills in bioinformatics and computational biology.

## 📊 Data Source
- **Dataset:** ${data.datasetSource || 'Public dataset from Kaggle/NCBI'}
- **Type:** Biological/Clinical data
- **Size:** Variable based on analysis requirements

## 🛠️ Tools & Technologies Used
${data.toolsUsed || 'Python, Pandas, NumPy, Matplotlib, Seaborn, scikit-learn'}

## 📈 Methodology
1. **Data Collection & Preprocessing**
   - Data cleaning and validation
   - Handling missing values
   - Feature engineering

2. **Exploratory Data Analysis (EDA)**
   - Statistical analysis
   - Data visualization
   - Pattern identification

3. **Advanced Analysis**
   - Machine learning models
   - Statistical testing
   - Results interpretation

## 🔍 Key Findings
${data.keyFindings || 'Significant correlations and patterns were identified in the dataset, providing valuable insights for further research.'}

## 📊 Results Summary
- **Primary Objective:** Achieved
- **Data Quality:** High
- **Statistical Significance:** Confirmed
- **Practical Applications:** Identified

## 🚀 How to Run the Code

### Prerequisites
\`\`\`bash
pip install pandas numpy matplotlib seaborn scikit-learn
\`\`\`

### Installation
1. Clone this repository:
\`\`\`bash
git clone https://github.com/yourusername/${data.projectName.toLowerCase().replace(/\s+/g, '-')}.git
\`\`\`

2. Navigate to the project directory:
\`\`\`bash
cd ${data.projectName.toLowerCase().replace(/\s+/g, '-')}
\`\`\`

3. Install required packages:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Usage
\`\`\`python
python main.py
\`\`\`

## 📁 Project Structure
\`\`\`
${data.projectName.toLowerCase().replace(/\s+/g, '-')}/
├── data/
│   ├── raw/
│   └── processed/
├── src/
│   ├── analysis.py
│   ├── visualization.py
│   └── utils.py
├── notebooks/
│   └── analysis.ipynb
├── results/
│   ├── figures/
│   └── reports/
├── requirements.txt
└── README.md
\`\`\`

## 🎯 Future Enhancements
- [ ] Additional statistical analyses
- [ ] Machine learning model optimization
- [ ] Web application development
- [ ] Real-time data integration

## 👨‍💻 Author
**Your Name** - Biotechnology Professional | Bioinformatics Enthusiast

## 📞 Contact
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]
- Email: your.email@example.com

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*This project showcases the intersection of biotechnology and data science, demonstrating practical applications of bioinformatics in modern research.*`;

    return readme;
}

// Generate Social Media Posts
async function generateSocialPosts(data) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const linkedinPost = `🔬 **Exciting Update: ${data.projectTitle}**

I'm thrilled to share my latest bioinformatics project that demonstrates the power of data science in biological research!

**Project Goal:** ${data.projectGoal || 'To analyze complex biological datasets and extract meaningful insights using advanced computational methods.'}

**Key Insight:** ${data.keyInsight || 'The analysis revealed significant patterns that could have important implications for future research.'}

**Skills Demonstrated:**
✅ Python & Data Analysis
✅ Statistical Modeling
✅ Bioinformatics Tools
✅ Data Visualization

This project perfectly showcases how biotechnology and data science come together to solve real-world problems. The results are promising and open up new avenues for further research.

**Why This Matters:**
In today's data-driven world, the ability to analyze complex biological data is crucial for advancing medical research and drug development. This project represents a step forward in that direction.

**Call to Action:**
Interested in learning more about this project or discussing potential collaborations? Check out my portfolio for the complete case study and connect with me!

#Bioinformatics #DataAnalysis #Biotechnology #Python #Pharma #ClinicalResearch #DataScience #Innovation

---
*Building the future of healthcare through data-driven insights*`;

    const facebookPost = `🚀 **New Project Alert!**

Just completed an exciting bioinformatics project: **${data.projectTitle}**

**What I did:**
${data.projectGoal || 'Analyzed complex biological data to find meaningful patterns and insights.'}

**The exciting part:**
${data.keyInsight || 'Discovered some really interesting patterns that could help with future research!'}

**Why this matters:**
This kind of work helps researchers understand complex biological processes better, which could lead to new treatments and discoveries.

**My journey:**
From biotechnology to bioinformatics - it's amazing how data science is transforming the way we understand life sciences!

**Want to learn more?**
Check out my portfolio for the full story and see how I'm combining my biotech background with modern data analysis techniques.

#Biotechnology #Bioinformatics #DataAnalysis #Science #Innovation #CareerGrowth

---
*Excited to share my work and connect with fellow science enthusiasts!*`;

    return {
        linkedin: linkedinPost,
        facebook: facebookPost
    };
}

// Generate LinkedIn Profile
async function generateLinkedInProfile(data) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const headlines = [
        `Biotechnology Professional | Bioinformatics Analyst | Python & Data Science Enthusiast | Transforming Biological Data into Insights`,
        `Bioinformatics Specialist | Biotechnology Graduate | Data Analysis Expert | Passionate about Pharma Innovation`,
        `Biotech Professional → Bioinformatics Analyst | Python, SQL, Data Visualization | Driving Research Through Data`,
        `Biotechnology & Bioinformatics Professional | Data Analysis | Web Design | Digital Marketing | Pharma Industry Focus`,
        `Bioinformatics Analyst | Biotechnology Background | Data Science Skills | Committed to Healthcare Innovation`
    ];

    const aboutSection = `🎯 **Biotechnology Professional with a Passion for Bioinformatics**

I am a dedicated biotechnology professional with a strong foundation in biological sciences and a growing expertise in bioinformatics and data analysis. My journey from traditional biotechnology to computational biology reflects my commitment to staying at the forefront of scientific innovation.

**🔬 Educational Background:**
- Diploma in Biotechnology from Parul University
- Specialized training in bioinformatics and data analysis
- Continuous learning in Python, SQL, and modern data science tools

**💼 Professional Experience:**
- ${data.experience} year${data.experience > 1 ? 's' : ''} of experience in biological research and data analysis
- Completed a comprehensive 1-month internship in bioinformatics
- Hands-on experience with real-world datasets and research projects

**🛠️ Technical Skills:**
${data.keySkills || 'Python, SQL, Data Analysis, Statistical Modeling, Data Visualization, Web Design, Digital Marketing'}

**🎯 Career Goals:**
I am actively seeking opportunities in leading pharmaceutical and clinical research organizations where I can apply my unique combination of biological knowledge and technical skills. My goal is to contribute to meaningful research that advances healthcare and drug development.

**🌟 What Sets Me Apart:**
- Cross-disciplinary approach combining biotechnology and data science
- Practical experience with modern bioinformatics tools
- Strong analytical and problem-solving abilities
- Passion for translating complex data into actionable insights

**🔗 Let's Connect:**
I'm always interested in connecting with professionals in the biotechnology, pharmaceutical, and data science communities. Whether you're looking for collaboration opportunities, want to discuss industry trends, or simply share insights, I'd love to hear from you!

#Bioinformatics #Biotechnology #DataAnalysis #Pharma #ClinicalResearch #Python #DataScience`;

    return {
        headlines: headlines,
        about: aboutSection
    };
}

// Display Functions

function displayPortfolioOutput(readme) {
    const output = document.getElementById('portfolioOutput');
    const readmeOutput = document.getElementById('readmeOutput');
    
    readmeOutput.textContent = readme;
    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth' });
}

function displaySocialOutput(posts) {
    const output = document.getElementById('socialOutput');
    const linkedinPost = document.getElementById('linkedinPost');
    const facebookPost = document.getElementById('facebookPost');
    
    linkedinPost.textContent = posts.linkedin;
    facebookPost.textContent = posts.facebook;
    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth' });
}

function displayResumeOutput(profile) {
    const output = document.getElementById('resumeOutput');
    const headlineOutput = document.getElementById('headlineOutput');
    const aboutOutput = document.getElementById('aboutOutput');
    
    headlineOutput.textContent = profile.headlines[0]; // Show first headline
    aboutOutput.textContent = profile.about;
    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth' });
}

// Utility Functions

function setLoading(loading) {
    isLoading = loading;
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        if (loading) {
            button.innerHTML = '<span class="loading"></span> प्रोसेसिंग...';
            button.disabled = true;
        } else {
            button.innerHTML = button.getAttribute('data-original-text') || '<i class="fas fa-magic"></i> AI से बनाएं';
            button.disabled = false;
        }
    });
}

function showMessage(message, type = 'success') {
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

// Copy to Clipboard Functions
function initializeCopyFunctions() {
    // Store original button text
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.setAttribute('data-original-text', button.innerHTML);
    });
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;

    navigator.clipboard.writeText(text).then(() => {
        showMessage('कॉपी हो गया!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showMessage('कॉपी हो गया!', 'success');
    });
}

function copyPrompt(button) {
    const promptText = button.parentElement.querySelector('p').textContent;
    
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = button.textContent;
        button.textContent = 'कॉपी हो गया!';
        button.style.background = '#38a169';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    });
}

// Job Search Functionality
function initializeJobSearch() {
    const searchInput = document.getElementById('jobSearch');
    const locationSelect = document.getElementById('jobLocation');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterJobs);
    }
    
    if (locationSelect) {
        locationSelect.addEventListener('change', filterJobs);
    }
}

function filterJobs() {
    const searchTerm = document.getElementById('jobSearch').value.toLowerCase();
    const location = document.getElementById('jobLocation').value.toLowerCase();
    const companyCards = document.querySelectorAll('.company-card');

    companyCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const position = card.querySelector('p').textContent.toLowerCase();
        const locationText = card.querySelectorAll('p')[1].textContent.toLowerCase();

        const matchesSearch = title.includes(searchTerm) || position.includes(searchTerm);
        const matchesLocation = !location || locationText.includes(location);

        if (matchesSearch && matchesLocation) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Welcome Message
function showWelcomeMessage() {
    setTimeout(() => {
        showMessage('🎉 AI Career Automation Dashboard में आपका स्वागत है! अपनी करियर यात्रा शुरू करें।', 'success');
    }, 1000);
}

// Analytics Functions
function updateAnalytics() {
    // Simulate real-time analytics updates
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        const currentValue = parseInt(metric.textContent.replace(/,/g, ''));
        const newValue = currentValue + Math.floor(Math.random() * 10);
        metric.textContent = newValue.toLocaleString();
    });
}

// Auto-update analytics every 30 seconds
setInterval(updateAnalytics, 30000);

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + 1-6 for tab switching
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const tabs = ['portfolio', 'social', 'resume', 'jobs', 'prompts', 'analytics'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            switchTab(tabs[tabIndex]);
        }
    }
    
    // Escape to clear forms
    if (e.key === 'Escape') {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
        showMessage('फॉर्म रीसेट हो गया', 'success');
    }
});

// Export Functions for External Use
window.CareerAutomation = {
    generateREADME,
    generateSocialPosts,
    generateLinkedInProfile,
    copyToClipboard,
    showMessage,
    switchTab
};

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to search
const debouncedFilterJobs = debounce(filterJobs, 300);
if (document.getElementById('jobSearch')) {
    document.getElementById('jobSearch').addEventListener('input', debouncedFilterJobs);
}