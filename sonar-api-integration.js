// Sonar API Integration Example for Career Automation System
// This file demonstrates how to integrate Sonar API with the existing career automation features

class SonarAPIIntegration {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.perplexity.ai/chat/completions';
    }

    // Enhanced portfolio content generation using Sonar API
    async generateEnhancedPortfolioContent(projectData) {
        const prompt = `
        मैं एक biotechnology professional हूं जो bioinformatics में transition कर रहा हूं। 
        कृपया एक professional portfolio description बनाएं:
        
        प्रोजेक्ट: ${projectData.name}
        तकनीक: ${projectData.tools}
        डेटा: ${projectData.dataset}
        मुख्य निष्कर्ष: ${projectData.findings}
        
        इसमें शामिल करें:
        - Technical summary
        - Impact statement
        - GitHub README format
        - LinkedIn post version
        `;

        return await this.makeAPICall(prompt);
    }

    // Enhanced social media content generation
    async generateSocialMediaContent(platform, content, tone = 'professional') {
        const prompt = `
        Create a ${platform} post for a biotechnology professional:
        
        Content: ${content}
        Tone: ${tone}
        Target Audience: Pharmaceutical companies, biotech recruiters, research professionals
        
        Include relevant hashtags and industry-specific keywords for maximum visibility.
        `;

        return await this.makeAPICall(prompt);
    }

    // Enhanced resume optimization
    async optimizeResumeContent(section, content, targetRole, targetCompany) {
        const prompt = `
        Optimize this resume ${section} for a ${targetRole} position at ${targetCompany}:
        
        Current Content: ${content}
        
        Make it ATS-friendly and highlight relevant biotechnology/bioinformatics skills.
        Focus on quantifiable achievements and industry-specific keywords.
        `;

        return await this.makeAPICall(prompt);
    }

    // Generate interview preparation content
    async generateInterviewPrep(company, role, background) {
        const prompt = `
        Generate interview preparation content for:
        Company: ${company}
        Role: ${role}
        My Background: ${background}
        
        Include:
        - 10 potential technical questions
        - 5 behavioral questions
        - Company-specific talking points
        - Key projects to highlight
        `;

        return await this.makeAPICall(prompt);
    }

    // Core API call method
    async makeAPICall(prompt, streaming = false) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'sonar-pro',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    stream: streaming
                })
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Sonar API Error:', error);
            throw error;
        }
    }

    // Streaming version for real-time content generation
    async streamContentGeneration(prompt, onChunk) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'sonar-pro',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    stream: true
                })
            });

            const reader = response.body?.getReader();
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = new TextDecoder().decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonStr = line.slice(6);
                            if (jsonStr !== '[DONE]') {
                                try {
                                    const parsed = JSON.parse(jsonStr);
                                    const content = parsed.choices[0]?.delta?.content;
                                    if (content) {
                                        onChunk(content);
                                    }
                                } catch (e) {
                                    console.warn('Failed to parse streaming chunk:', e);
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Streaming Error:', error);
            throw error;
        }
    }
}

// Integration with existing career automation system
function integrateSonarAPI() {
    // Get API key from environment or user input
    const apiKey = process.env.SONAR_API_KEY || prompt('Enter your Sonar API key:');
    
    if (!apiKey) {
        console.error('Sonar API key is required');
        return;
    }

    const sonarAPI = new SonarAPIIntegration(apiKey);

    // Enhance existing portfolio generation function
    window.generatePortfolioContentEnhanced = async function() {
        const projectData = {
            name: document.getElementById('projectName').value,
            tools: document.getElementById('toolsUsed').value,
            dataset: document.getElementById('datasetSource').value,
            findings: document.getElementById('keyFindings').value
        };

        if (!projectData.name || !projectData.findings) {
            showMessage('कृपया प्रोजेक्ट का नाम और मुख्य निष्कर्ष भरें', 'error');
            return;
        }

        try {
            const button = event.target;
            button.innerHTML = '<div class="loading"></div> AI से content generate हो रहा है...';
            button.disabled = true;

            const enhancedContent = await sonarAPI.generateEnhancedPortfolioContent(projectData);
            
            // Display the enhanced content
            document.getElementById('portfolioOutput').innerHTML = `
                <div class="generated-content">
                    <h3>🤖 AI-Enhanced Portfolio Content</h3>
                    <div class="content-section">
                        <h4>Professional Description</h4>
                        <pre>${enhancedContent}</pre>
                    </div>
                    <div class="action-buttons">
                        <button onclick="copyToClipboard('${enhancedContent.replace(/'/g, '\\\'')}')" class="btn btn-primary">
                            📋 Copy Content
                        </button>
                        <button onclick="saveProject()" class="btn btn-success">
                            💾 Save Project
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('portfolioOutput').style.display = 'block';

            button.innerHTML = '🤖 Generate AI Content';
            button.disabled = false;
            
            showMessage('AI-enhanced content generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating enhanced content:', error);
            showMessage('Error generating content. Please try again.', 'error');
            
            button.innerHTML = '🤖 Generate AI Content';
            button.disabled = false;
        }
    };

    // Enhance social media generation
    window.generateSocialPostEnhanced = async function() {
        const platform = document.getElementById('platform').value;
        const content = document.getElementById('content').value;
        const tone = document.getElementById('tone').value;

        if (!content) {
            showMessage('Please enter content to generate social media post', 'error');
            return;
        }

        try {
            const enhancedPost = await sonarAPI.generateSocialMediaContent(platform, content, tone);
            
            document.getElementById('socialOutput').innerHTML = `
                <div class="generated-content">
                    <h3>🤖 AI-Enhanced ${platform} Post</h3>
                    <div class="content-section">
                        <pre>${enhancedPost}</pre>
                    </div>
                    <div class="action-buttons">
                        <button onclick="copyToClipboard('${enhancedPost.replace(/'/g, '\\\'')}')" class="btn btn-primary">
                            📋 Copy Post
                        </button>
                        <button onclick="schedulePost()" class="btn btn-secondary">
                            ⏰ Schedule Post
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('socialOutput').style.display = 'block';
            
            showMessage('AI-enhanced social media post generated!', 'success');
        } catch (error) {
            console.error('Error generating social media content:', error);
            showMessage('Error generating post. Please try again.', 'error');
        }
    };

    return sonarAPI;
}

// Helper function for copying content to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Content copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showMessage('Failed to copy content', 'error');
    });
}

// Initialize Sonar API integration when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sonar API Integration loaded');
    
    // Add enhanced buttons to the existing UI
    const portfolioSection = document.querySelector('.portfolio-section');
    if (portfolioSection) {
        const enhancedButton = document.createElement('button');
        enhancedButton.className = 'btn btn-primary';
        enhancedButton.innerHTML = '🤖 Generate AI-Enhanced Content';
        enhancedButton.onclick = generatePortfolioContentEnhanced;
        
        const existingButton = portfolioSection.querySelector('button');
        if (existingButton) {
            existingButton.parentNode.insertBefore(enhancedButton, existingButton.nextSibling);
        }
    }

    const socialSection = document.querySelector('.social-media-section');
    if (socialSection) {
        const enhancedButton = document.createElement('button');
        enhancedButton.className = 'btn btn-primary';
        enhancedButton.innerHTML = '🤖 Generate AI-Enhanced Post';
        enhancedButton.onclick = generateSocialPostEnhanced;
        
        const existingButton = socialSection.querySelector('button');
        if (existingButton) {
            existingButton.parentNode.insertBefore(enhancedButton, existingButton.nextSibling);
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SonarAPIIntegration, integrateSonarAPI };
}