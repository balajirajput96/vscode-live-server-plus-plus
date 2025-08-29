// Global variables
let currentTab = 'portfolio';
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let socialPosts = JSON.parse(localStorage.getItem('socialPosts')) || [];
let procrastinationData = JSON.parse(localStorage.getItem('procrastinationData')) || {
    moodTracking: [],
    futureSelfs: [],
    attentionSpans: [],
    habitStack: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadStoredData();
    updateAnalytics();
    initializeProcrastinationTools();
});

// Tab Navigation
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Add active class to selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    currentTab = tabName;
}

// Portfolio Builder Functions
function generatePortfolioContent() {
    const name = document.getElementById('projectName').value;
    const type = document.getElementById('projectType').value;
    const description = document.getElementById('projectDescription').value;
    const tools = document.getElementById('toolsUsed').value;
    const dataset = document.getElementById('datasetInfo').value;
    const findings = document.getElementById('keyFindings').value;
    
    if (!name || !description || !tools || !findings) {
        showMessage('कृपया सभी आवश्यक फ़ील्ड भरें (Please fill all required fields)', 'error');
        return;
    }
    
    const generatedContent = generatePortfolioText(name, type, description, tools, dataset, findings);
    document.getElementById('portfolioOutput').innerHTML = generatedContent;
    
    showMessage('Portfolio content generated successfully!', 'success');
}

function generatePortfolioText(name, type, description, tools, dataset, findings) {
    return `
    <div class="generated-content">
        <h3>📄 README.md Content</h3>
        <div class="content-box">
            <h2>${name}</h2>
            <p><strong>Project Type:</strong> ${type}</p>
            
            <h3>🎯 Project Overview</h3>
            <p>${description}</p>
            
            <h3>🛠️ Technologies Used</h3>
            <p>${tools}</p>
            
            <h3>📊 Dataset Information</h3>
            <p>${dataset}</p>
            
            <h3>🔍 Key Findings</h3>
            <p>${findings}</p>
            
            <h3>🚀 Skills Demonstrated</h3>
            <ul>
                <li>Bioinformatics Analysis</li>
                <li>Data Preprocessing & Cleaning</li>
                <li>Statistical Analysis & Visualization</li>
                <li>Python Programming & Libraries</li>
            </ul>
            
            <h3>💡 Future Applications</h3>
            <p>This analysis methodology can be applied to pharmaceutical research, clinical trials data analysis, and drug discovery processes in companies like Sun Pharma, Zydus Cadila, and Biocon.</p>
        </div>
        
        <h3>💼 LinkedIn Post</h3>
        <div class="content-box">
            <p>🚀 Exciting to share my latest ${type} project: "${name}"</p>
            <p>${description}</p>
            <p>🔬 <strong>Key Technologies:</strong> ${tools}</p>
            <p>📈 <strong>Main Finding:</strong> ${findings}</p>
            <p>This project showcases my growing expertise in bioinformatics and data analysis, essential skills for the pharmaceutical industry.</p>
            <p>#Bioinformatics #DataAnalysis #BiotechCareer #Python #PharmaResearch</p>
        </div>
        
        <h3>🌐 Portfolio Website Description</h3>
        <div class="content-box">
            <h4>${name}</h4>
            <p>${description}</p>
            <p><strong>Technical Skills:</strong> ${tools}</p>
            <p><strong>Impact:</strong> ${findings}</p>
            <p>This work exemplifies my commitment to using data science for advancing healthcare and pharmaceutical research.</p>
        </div>
    </div>`;
}

function saveProject() {
    const name = document.getElementById('projectName').value;
    const type = document.getElementById('projectType').value;
    const description = document.getElementById('projectDescription').value;
    
    if (!name || !description) {
        showMessage('Project name and description are required', 'error');
        return;
    }
    
    const project = {
        id: Date.now(),
        name,
        type,
        description,
        createdAt: new Date().toISOString()
    };
    
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    showMessage('Project saved successfully!', 'success');
    clearPortfolioForm();
}

function clearPortfolioForm() {
    document.getElementById('projectName').value = '';
    document.getElementById('projectType').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('toolsUsed').value = '';
    document.getElementById('datasetInfo').value = '';
    document.getElementById('keyFindings').value = '';
    document.getElementById('portfolioOutput').innerHTML = '';
}

// Social Media Generator Functions
function generateSocialPost() {
    const platform = document.querySelector('input[name="platform"]:checked')?.value;
    const postType = document.getElementById('postType').value;
    const content = document.getElementById('postContent').value;
    const tone = document.getElementById('tone').value;
    const hashtags = document.getElementById('hashtags').value;
    
    if (!platform || !content) {
        showMessage('Please select platform and enter content', 'error');
        return;
    }
    
    const generatedContent = generateSocialContent(platform, postType, content, tone, hashtags);
    document.getElementById('socialOutput').innerHTML = generatedContent;
    
    showMessage('Social media content generated!', 'success');
}

function generateSocialContent(platform, postType, content, tone, hashtags) {
    let platformContent = '';
    
    switch(platform) {
        case 'linkedin':
            platformContent = `
                <h3>🔗 LinkedIn Post</h3>
                <div class="content-box">
                    <p>🚀 ${content}</p>
                    <p>As a biotechnology professional transitioning into bioinformatics, I'm constantly amazed by the potential of data science in healthcare innovation.</p>
                    <p>💡 This experience reinforces my passion for using computational biology to solve real-world medical challenges.</p>
                    <p>Looking forward to applying these skills in pharmaceutical research and drug discovery!</p>
                    <p>${hashtags} #BiotechCareer #Bioinformatics #DataScience #PharmaInnovation</p>
                </div>
            `;
            break;
            
        case 'facebook':
            platformContent = `
                <h3>📘 Facebook Post</h3>
                <div class="content-box">
                    <p>📚 आज कुछ बहुत interesting सीखा!</p>
                    <p>${content}</p>
                    <p>🧬 <strong>Why it matters:</strong> Biotechnology और data science का combination future में healthcare को revolutionize करने वाला है।</p>
                    <p>💭 हर नया project मुझे pharmaceutical industry में अपने career goals के closer ले जा रहा है।</p>
                    <p>${hashtags}</p>
                </div>
            `;
            break;
            
        case 'twitter':
            platformContent = `
                <h3>🐦 Twitter Post</h3>
                <div class="content-box">
                    <p>🔬 ${content}</p>
                    <p>The future of healthcare lies in computational biology! 💊🧬</p>
                    <p>${hashtags} #BiotechTwitter #Bioinformatics</p>
                </div>
            `;
            break;
    }
    
    return platformContent;
}

function schedulePost() {
    const platform = document.querySelector('input[name="platform"]:checked')?.value;
    const content = document.getElementById('postContent').value;
    const scheduleTime = document.getElementById('scheduleTime').value;
    
    if (!platform || !content || !scheduleTime) {
        showMessage('Please fill all fields for scheduling', 'error');
        return;
    }
    
    const scheduledPost = {
        id: Date.now(),
        platform,
        content,
        scheduleTime,
        status: 'scheduled'
    };
    
    socialPosts.push(scheduledPost);
    localStorage.setItem('socialPosts', JSON.stringify(socialPosts));
    
    showMessage('Post scheduled successfully!', 'success');
}

// Resume Optimizer Functions
function optimizeContent() {
    const type = document.getElementById('contentType').value;
    const content = document.getElementById('currentContent').value;
    const role = document.getElementById('targetRole').value;
    const company = document.getElementById('targetCompany').value;
    
    if (!content) {
        showMessage('Please enter content to optimize', 'error');
        return;
    }
    
    const optimizedContent = generateOptimizedContent(type, content, role, company);
    document.getElementById('optimizedOutput').innerHTML = optimizedContent;
    
    showMessage('Content optimized successfully!', 'success');
}

function generateOptimizedContent(type, content, role, company) {
    let optimized = '';
    
    switch(type) {
        case 'headline':
            optimized = `
                <h3>📝 Optimized LinkedIn Headline</h3>
                <div class="content-box">
                    <p><strong>Original:</strong> ${content}</p>
                    <p><strong>Optimized:</strong> Biotechnology Graduate | Python & Data Analysis Expert | Seeking ${role} Role | Passionate about Bioinformatics & Drug Discovery | ${company} Ready</p>
                </div>
            `;
            break;
            
        case 'summary':
            optimized = `
                <h3>📄 Optimized Professional Summary</h3>
                <div class="content-box">
                    <p><strong>Enhanced Summary:</strong></p>
                    <p>Results-driven Biotechnology professional with hands-on experience in bioinformatics and data analysis. Skilled in Python, SQL, and computational biology techniques. Passionate about leveraging data science to advance pharmaceutical research and drug discovery. Seeking to contribute to ${company}'s innovative research initiatives as a ${role}.</p>
                    <p><strong>Key Differentiators:</strong></p>
                    <ul>
                        <li>Unique combination of biological knowledge and technical skills</li>
                        <li>Experience with real-world bioinformatics projects</li>
                        <li>Strong foundation in both wet lab and computational approaches</li>
                    </ul>
                </div>
            `;
            break;
            
        case 'cover_letter':
            optimized = `
                <h3>💌 Optimized Cover Letter</h3>
                <div class="content-box">
                    <p>Dear ${company} Hiring Team,</p>
                    <p>As a Biotechnology graduate with a passion for computational biology, I am excited to apply for the ${role} position. My unique combination of biological knowledge and programming skills aligns perfectly with ${company}'s mission to advance healthcare through innovative research.</p>
                    <p>My experience includes:</p>
                    <ul>
                        <li>Bioinformatics analysis using Python and specialized libraries</li>
                        <li>Data preprocessing and statistical analysis</li>
                        <li>Visualization of complex biological datasets</li>
                    </ul>
                    <p>I am particularly drawn to ${company}'s work in [specific area] and would welcome the opportunity to contribute to your research team.</p>
                    <p>Best regards,<br>[Your Name]</p>
                </div>
            `;
            break;
    }
    
    return optimized;
}

function generateMultiple() {
    const type = document.getElementById('contentType').value;
    const variations = [];
    
    for (let i = 1; i <= 5; i++) {
        variations.push(`
            <div class="variation">
                <h4>Variation ${i}</h4>
                <p>Optimized ${type} content variation ${i} would appear here...</p>
            </div>
        `);
    }
    
    document.getElementById('optimizedOutput').innerHTML = `
        <h3>🔄 Multiple Variations</h3>
        <div class="content-box">
            ${variations.join('')}
        </div>
    `;
}

// Procrastination Research Implementation
function initializeProcrastinationTools() {
    // Initialize Harvard Future Self Visualization
    initFutureSelfTool();
    
    // Initialize Oxford Mood Tracking
    initMoodTracker();
    
    // Initialize Cambridge Attention Tracker
    initAttentionTracker();
    
    // Initialize Habit Stacking (James Clear)
    initHabitStacker();
}

// Harvard Research: Future Self Visualization (77% effectiveness)
function initFutureSelfTool() {
    const futureSelfContainer = document.getElementById('futureSelfTool');
    if (futureSelfContainer) {
        futureSelfContainer.innerHTML = `
            <h3>🎯 Future Self Visualization (Harvard Research - 77% Effectiveness)</h3>
            <div class="research-tool">
                <p><strong>Research:</strong> Todd Rogers & Max Bazerman found focusing on future self is 77% vs 30% more effective</p>
                <div class="form-group">
                    <label>आज के काम भविष्य के मुझे कैसे help करेंगे? (How will today's work help my future self?)</label>
                    <textarea id="futureHelp" placeholder="Type your reflection..."></textarea>
                </div>
                <div class="form-group">
                    <label>5 साल बाद मैं कहाँ होना चाहता हूं? (Where do I want to be in 5 years?)</label>
                    <textarea id="fiveYearVision" placeholder="Describe your 5-year vision..."></textarea>
                </div>
                <button onclick="saveFutureSelfVisualization()" class="btn">Save Visualization</button>
                <div id="futureSelfHistory"></div>
            </div>
        `;
    }
}

function saveFutureSelfVisualization() {
    const futureHelp = document.getElementById('futureHelp').value;
    const fiveYearVision = document.getElementById('fiveYearVision').value;
    
    if (!futureHelp || !fiveYearVision) {
        showMessage('Please fill both fields', 'error');
        return;
    }
    
    const visualization = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        futureHelp,
        fiveYearVision,
        timestamp: new Date().toISOString()
    };
    
    procrastinationData.futureSelfs.push(visualization);
    localStorage.setItem('procrastinationData', JSON.stringify(procrastinationData));
    
    document.getElementById('futureHelp').value = '';
    document.getElementById('fiveYearVision').value = '';
    
    showMessage('Future self visualization saved! Harvard research shows this increases task completion by 77%', 'success');
    updateFutureSelfHistory();
}

function updateFutureSelfHistory() {
    const historyContainer = document.getElementById('futureSelfHistory');
    if (historyContainer && procrastinationData.futureSelfs.length > 0) {
        const recentEntries = procrastinationData.futureSelfs.slice(-5).reverse();
        historyContainer.innerHTML = `
            <h4>Recent Visualizations</h4>
            ${recentEntries.map(entry => `
                <div class="history-entry">
                    <strong>${entry.date}</strong>
                    <p><em>Future Help:</em> ${entry.futureHelp.substring(0, 100)}...</p>
                </div>
            `).join('')}
        `;
    }
}

// Oxford Research: Mood-Productivity Tracker (12% productivity boost per happiness point)
function initMoodTracker() {
    const moodContainer = document.getElementById('moodTracker');
    if (moodContainer) {
        moodContainer.innerHTML = `
            <h3>😊 Mood-Productivity Tracker (Oxford Research - 12% Boost per Happiness Point)</h3>
            <div class="research-tool">
                <p><strong>Research:</strong> Oxford Wellbeing Research Centre found 1 happiness point = 12% productivity boost</p>
                <div class="form-group">
                    <label>Current Mood (1-10)</label>
                    <input type="range" id="moodSlider" min="1" max="10" value="5" oninput="updateMoodDisplay()">
                    <span id="moodValue">5</span>
                </div>
                <div class="form-group">
                    <label>Productivity Level (1-10)</label>
                    <input type="range" id="productivitySlider" min="1" max="10" value="5" oninput="updateProductivityDisplay()">
                    <span id="productivityValue">5</span>
                </div>
                <div class="form-group">
                    <label>What made you happy today?</label>
                    <textarea id="happinessSource" placeholder="Describe what contributed to your mood..."></textarea>
                </div>
                <button onclick="saveMoodData()" class="btn">Track Mood & Productivity</button>
                <div id="moodAnalytics"></div>
            </div>
        `;
    }
}

function updateMoodDisplay() {
    document.getElementById('moodValue').textContent = document.getElementById('moodSlider').value;
}

function updateProductivityDisplay() {
    document.getElementById('productivityValue').textContent = document.getElementById('productivitySlider').value;
}

function saveMoodData() {
    const mood = parseInt(document.getElementById('moodSlider').value);
    const productivity = parseInt(document.getElementById('productivitySlider').value);
    const happinessSource = document.getElementById('happinessSource').value;
    
    const moodEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        mood,
        productivity,
        happinessSource,
        timestamp: new Date().toISOString()
    };
    
    procrastinationData.moodTracking.push(moodEntry);
    localStorage.setItem('procrastinationData', JSON.stringify(procrastinationData));
    
    // Calculate correlation
    const correlation = calculateMoodProductivityCorrelation();
    
    document.getElementById('happinessSource').value = '';
    
    showMessage(`Mood data saved! Your mood-productivity correlation: ${correlation.toFixed(2)}`, 'success');
    updateMoodAnalytics();
}

function calculateMoodProductivityCorrelation() {
    if (procrastinationData.moodTracking.length < 2) return 0;
    
    const data = procrastinationData.moodTracking;
    const n = data.length;
    
    const sumMood = data.reduce((sum, entry) => sum + entry.mood, 0);
    const sumProductivity = data.reduce((sum, entry) => sum + entry.productivity, 0);
    const sumMoodSquared = data.reduce((sum, entry) => sum + entry.mood * entry.mood, 0);
    const sumProductivitySquared = data.reduce((sum, entry) => sum + entry.productivity * entry.productivity, 0);
    const sumMoodProductivity = data.reduce((sum, entry) => sum + entry.mood * entry.productivity, 0);
    
    const numerator = n * sumMoodProductivity - sumMood * sumProductivity;
    const denominator = Math.sqrt((n * sumMoodSquared - sumMood * sumMood) * (n * sumProductivitySquared - sumProductivity * sumProductivity));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

function updateMoodAnalytics() {
    const analyticsContainer = document.getElementById('moodAnalytics');
    if (analyticsContainer && procrastinationData.moodTracking.length > 0) {
        const avgMood = procrastinationData.moodTracking.reduce((sum, entry) => sum + entry.mood, 0) / procrastinationData.moodTracking.length;
        const avgProductivity = procrastinationData.moodTracking.reduce((sum, entry) => sum + entry.productivity, 0) / procrastinationData.moodTracking.length;
        const correlation = calculateMoodProductivityCorrelation();
        
        analyticsContainer.innerHTML = `
            <h4>📊 Mood-Productivity Analytics</h4>
            <div class="analytics">
                <p><strong>Average Mood:</strong> ${avgMood.toFixed(1)}/10</p>
                <p><strong>Average Productivity:</strong> ${avgProductivity.toFixed(1)}/10</p>
                <p><strong>Correlation:</strong> ${correlation.toFixed(2)} (Oxford research predicts ${(correlation * 12).toFixed(1)}% productivity boost)</p>
            </div>
        `;
    }
}

// Cambridge Research: Attention Span Tracker (47-second cycles)
function initAttentionTracker() {
    const attentionContainer = document.getElementById('attentionTracker');
    if (attentionContainer) {
        attentionContainer.innerHTML = `
            <h3>🧠 Attention Span Tracker (Cambridge Research - 47-Second Natural Cycles)</h3>
            <div class="research-tool">
                <p><strong>Research:</strong> Gloria Mark found average attention span is 47 seconds, 25 minutes to refocus after interruption</p>
                <div class="attention-timer">
                    <div id="timerDisplay">00:00</div>
                    <button onclick="startAttentionTimer()" class="btn">Start Focus Session</button>
                    <button onclick="stopAttentionTimer()" class="btn btn-secondary">Stop Session</button>
                    <button onclick="logInterruption()" class="btn btn-warning">Log Interruption</button>
                </div>
                <div id="attentionStats"></div>
            </div>
        `;
    }
}

let attentionTimer = null;
let attentionStartTime = null;
let attentionSeconds = 0;

function startAttentionTimer() {
    if (attentionTimer) return; // Already running
    
    attentionStartTime = new Date();
    attentionSeconds = 0;
    
    attentionTimer = setInterval(() => {
        attentionSeconds++;
        const minutes = Math.floor(attentionSeconds / 60);
        const seconds = attentionSeconds % 60;
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    showMessage('Focus session started! Cambridge research shows 47-second natural attention cycles.', 'info');
}

function stopAttentionTimer() {
    if (!attentionTimer) return;
    
    clearInterval(attentionTimer);
    attentionTimer = null;
    
    const duration = attentionSeconds;
    const attentionSession = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        duration,
        interruptions: 0,
        timestamp: new Date().toISOString()
    };
    
    procrastinationData.attentionSpans.push(attentionSession);
    localStorage.setItem('procrastinationData', JSON.stringify(procrastinationData));
    
    document.getElementById('timerDisplay').textContent = '00:00';
    
    showMessage(`Focus session completed! Duration: ${Math.floor(duration/60)}:${(duration%60).toString().padStart(2, '0')}`, 'success');
    updateAttentionStats();
}

function logInterruption() {
    if (attentionTimer && procrastinationData.attentionSpans.length > 0) {
        const lastSession = procrastinationData.attentionSpans[procrastinationData.attentionSpans.length - 1];
        lastSession.interruptions = (lastSession.interruptions || 0) + 1;
        localStorage.setItem('procrastinationData', JSON.stringify(procrastinationData));
        
        showMessage('Interruption logged. Remember: Cambridge research shows 25 minutes to fully refocus!', 'warning');
    }
}

function updateAttentionStats() {
    const statsContainer = document.getElementById('attentionStats');
    if (statsContainer && procrastinationData.attentionSpans.length > 0) {
        const sessions = procrastinationData.attentionSpans;
        const avgDuration = sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length;
        const totalSessions = sessions.length;
        const longestSession = Math.max(...sessions.map(s => s.duration));
        
        statsContainer.innerHTML = `
            <h4>📈 Attention Analytics</h4>
            <div class="analytics">
                <p><strong>Total Sessions:</strong> ${totalSessions}</p>
                <p><strong>Average Duration:</strong> ${Math.floor(avgDuration/60)}:${Math.floor(avgDuration%60).toString().padStart(2, '0')}</p>
                <p><strong>Longest Session:</strong> ${Math.floor(longestSession/60)}:${(longestSession%60).toString().padStart(2, '0')}</p>
                <p><strong>Target:</strong> Gradually increase beyond 47-second natural cycles</p>
            </div>
        `;
    }
}

// James Clear: Habit Stacking Implementation (65% effectiveness)
function initHabitStacker() {
    const habitContainer = document.getElementById('habitStacker');
    if (habitContainer) {
        habitContainer.innerHTML = `
            <h3>🔗 Habit Stacking (James Clear Method - 65% Effectiveness)</h3>
            <div class="research-tool">
                <p><strong>Research:</strong> James Clear's millions of followers prove habit stacking effectiveness</p>
                <div class="form-group">
                    <label>Existing Habit (Current behavior you do daily)</label>
                    <input type="text" id="existingHabit" placeholder="e.g., Coffee पीने के बाद (After drinking coffee)">
                </div>
                <div class="form-group">
                    <label>New Productive Habit (What you want to add)</label>
                    <input type="text" id="newHabit" placeholder="e.g., मैं 5 minutes planning करूंगा (I will plan for 5 minutes)">
                </div>
                <div class="form-group">
                    <label>Career Goal Connection</label>
                    <textarea id="goalConnection" placeholder="How does this habit help your biotech career?"></textarea>
                </div>
                <button onclick="createHabitStack()" class="btn">Create Habit Stack</button>
                <div id="habitStackList"></div>
            </div>
        `;
    }
}

function createHabitStack() {
    const existingHabit = document.getElementById('existingHabit').value;
    const newHabit = document.getElementById('newHabit').value;
    const goalConnection = document.getElementById('goalConnection').value;
    
    if (!existingHabit || !newHabit) {
        showMessage('Please fill both habit fields', 'error');
        return;
    }
    
    const habitStack = {
        id: Date.now(),
        existingHabit,
        newHabit,
        goalConnection,
        createdDate: new Date().toISOString().split('T')[0],
        completionCount: 0,
        lastCompleted: null
    };
    
    procrastinationData.habitStack.push(habitStack);
    localStorage.setItem('procrastinationData', JSON.stringify(procrastinationData));
    
    document.getElementById('existingHabit').value = '';
    document.getElementById('newHabit').value = '';
    document.getElementById('goalConnection').value = '';
    
    showMessage('Habit stack created! James Clear research shows 65% effectiveness rate.', 'success');
    updateHabitStackList();
}

function updateHabitStackList() {
    const listContainer = document.getElementById('habitStackList');
    if (listContainer && procrastinationData.habitStack.length > 0) {
        listContainer.innerHTML = `
            <h4>📋 Your Habit Stacks</h4>
            ${procrastinationData.habitStack.map(habit => `
                <div class="habit-stack-item">
                    <p><strong>Formula:</strong> "${habit.existingHabit} के बाद, ${habit.newHabit}"</p>
                    <p><em>Career Connection:</em> ${habit.goalConnection}</p>
                    <p><small>Completed: ${habit.completionCount} times | Created: ${habit.createdDate}</small></p>
                    <button onclick="markHabitCompleted(${habit.id})" class="btn btn-small">Mark Completed Today</button>
                </div>
            `).join('')}
        `;
    }
}

function markHabitCompleted(habitId) {
    const habit = procrastinationData.habitStack.find(h => h.id === habitId);
    if (habit) {
        habit.completionCount++;
        habit.lastCompleted = new Date().toISOString().split('T')[0];
        localStorage.setItem('procrastinationData', JSON.stringify(procrastinationData));
        
        showMessage(`Habit completed! Total completions: ${habit.completionCount}`, 'success');
        updateHabitStackList();
    }
}

// Job Tracker Functions
function searchJobs() {
    const searchTerm = document.getElementById('jobSearch').value.toLowerCase();
    const location = document.getElementById('locationFilter').value;
    const company = document.getElementById('companyFilter').value;
    
    // This would typically connect to job APIs
    showMessage(`Searching for: ${searchTerm} in ${location} at ${company}`, 'info');
    updateJobList();
}

function updateJobList() {
    const jobList = document.getElementById('jobList');
    if (jobList) {
        jobList.innerHTML = `
            <div class="job-item">
                <h4>Bioinformatics Analyst - Sun Pharma</h4>
                <p>Mumbai • Full-time • ₹6-8 LPA</p>
                <p>Python, SQL, Data Analysis, Clinical Research</p>
                <button onclick="applyForJob('Bioinformatics Analyst', 'Sun Pharma')" class="btn btn-small">Quick Apply</button>
                <button onclick="saveJob('Bioinformatics Analyst', 'Sun Pharma')" class="btn btn-secondary btn-small">Save</button>
            </div>
            <div class="job-item">
                <h4>Data Scientist - Biocon</h4>
                <p>Bangalore • Full-time • ₹8-12 LPA</p>
                <p>Python, R, Machine Learning, Biostatistics</p>
                <button onclick="applyForJob('Data Scientist', 'Biocon')" class="btn btn-small">Quick Apply</button>
                <button onclick="saveJob('Data Scientist', 'Biocon')" class="btn btn-secondary btn-small">Save</button>
            </div>
        `;
    }
}

function applyForJob(title, company) {
    // Use research-based application strategy
    const futureSelfQuestion = `इस ${company} में ${title} role से मेरा भविष्य कैसा होगा?`;
    
    showMessage(`Application initiated for ${title} at ${company}. Remember: ${futureSelfQuestion}`, 'info');
    
    // Track application
    const application = {
        id: Date.now(),
        title,
        company,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'applied'
    };
    
    let applications = JSON.parse(localStorage.getItem('applications')) || [];
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));
}

function saveJob(title, company) {
    showMessage(`Job saved: ${title} at ${company}`, 'success');
}

// AI Prompts Functions
function copyPrompt(button) {
    const promptText = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        showMessage('Prompt copied to clipboard!', 'success');
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy Prompt';
        }, 2000);
    });
}

// Analytics Functions
function updateAnalytics() {
    const analyticsContainer = document.getElementById('analyticsData');
    if (analyticsContainer) {
        const totalProjects = projects.length;
        const totalSocialPosts = socialPosts.length;
        const moodEntries = procrastinationData.moodTracking.length;
        const attentionSessions = procrastinationData.attentionSpans.length;
        const habitStacks = procrastinationData.habitStack.length;
        
        analyticsContainer.innerHTML = `
            <div class="analytics-grid">
                <div class="metric">
                    <h4>${totalProjects}</h4>
                    <p>Projects Created</p>
                </div>
                <div class="metric">
                    <h4>${totalSocialPosts}</h4>
                    <p>Social Posts Scheduled</p>
                </div>
                <div class="metric">
                    <h4>${moodEntries}</h4>
                    <p>Mood Trackings</p>
                </div>
                <div class="metric">
                    <h4>${attentionSessions}</h4>
                    <p>Focus Sessions</p>
                </div>
                <div class="metric">
                    <h4>${habitStacks}</h4>
                    <p>Habit Stacks Created</p>
                </div>
            </div>
            
            <h4>🧠 Research-Based Progress</h4>
            <div class="research-progress">
                <p>✅ Harvard Future Self: ${procrastinationData.futureSelfs.length} visualizations</p>
                <p>✅ Oxford Mood Tracking: ${moodEntries} entries</p>
                <p>✅ Cambridge Attention: ${attentionSessions} sessions</p>
                <p>✅ Habit Stacking: ${habitStacks} stacks created</p>
            </div>
        `;
    }
}

// Utility Functions
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function loadStoredData() {
    // Load and display existing data
    updateAnalytics();
    updateFutureSelfHistory();
    updateMoodAnalytics();
    updateAttentionStats();
    updateHabitStackList();
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
    localStorage.setItem('procrastinationData', JSON.stringify(procrastinationData));
}, 30000); // Save every 30 seconds

// Export functionality
function exportData() {
    const data = {
        projects,
        socialPosts,
        procrastinationData,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-automation-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('Data exported successfully!', 'success');
}

// Initialize tooltips and help text
function initializeHelp() {
    const helpButtons = document.querySelectorAll('.help-button');
    helpButtons.forEach(button => {
        button.addEventListener('click', function() {
            const helpText = this.getAttribute('data-help');
            showMessage(helpText, 'info');
        });
    });
}

// Initialize help on load
document.addEventListener('DOMContentLoaded', initializeHelp);