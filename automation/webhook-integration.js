#!/usr/bin/env node

/**
 * Career Automation Webhook Integration Script
 * Handles webhook requests and integrates with various APIs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class CareerAutomationWebhook {
    constructor() {
        this.config = {
            n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
            openaiApiKey: process.env.OPENAI_API_KEY,
            geminiApiKey: process.env.GEMINI_API_KEY,
            azurePublishProfile: process.env.AZURE_PUBLISH_PROFILE,
            webhookPath: '/balaji-automation'
        };

        this.validateConfig();
    }

    validateConfig() {
        const requiredVars = ['N8N_WEBHOOK_URL'];
        const missing = requiredVars.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
            console.log('Please configure these secrets in GitHub Actions:');
            missing.forEach(key => console.log(`  - ${key}`));
        }
    }

    /**
     * Send data to n8n webhook for processing
     * @param {Object} data - Data to send to webhook
     * @returns {Promise<Object>} Response from webhook
     */
    async sendToN8nWebhook(data) {
        if (!this.config.n8nWebhookUrl) {
            throw new Error('N8N_WEBHOOK_URL is not configured');
        }

        const webhookUrl = `${this.config.n8nWebhookUrl.replace(/\/$/, '')}${this.config.webhookPath}`;
        
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(data);
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'User-Agent': 'Career-Automation-System/1.0'
                }
            };

            const urlObj = new URL(webhookUrl);
            options.hostname = urlObj.hostname;
            options.port = urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80);
            options.path = urlObj.pathname + urlObj.search;

            const protocol = urlObj.protocol === 'https:' ? https : require('http');
            
            const req = protocol.request(options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const result = responseData ? JSON.parse(responseData) : {};
                        resolve({
                            status: res.statusCode,
                            data: result,
                            headers: res.headers
                        });
                    } catch (error) {
                        resolve({
                            status: res.statusCode,
                            data: responseData,
                            headers: res.headers
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Webhook request failed: ${error.message}`));
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * Update portfolio with new project
     * @param {Object} projectData - Project information
     */
    async updatePortfolio(projectData) {
        const payload = {
            type: 'portfolio_update',
            project_name: projectData.name,
            description: projectData.description,
            tools: projectData.tools || [],
            findings: projectData.findings || '',
            timestamp: new Date().toISOString(),
            source: 'automation-script'
        };

        try {
            const response = await this.sendToN8nWebhook(payload);
            console.log('✅ Portfolio updated successfully:', response.status);
            return response;
        } catch (error) {
            console.error('❌ Failed to update portfolio:', error.message);
            throw error;
        }
    }

    /**
     * Create social media post
     * @param {Object} postData - Social media post data
     */
    async createSocialMediaPost(postData) {
        const payload = {
            type: 'social_media_post',
            platform: postData.platform || 'linkedin',
            content: postData.content,
            hashtags: postData.hashtags || [],
            timestamp: new Date().toISOString(),
            source: 'automation-script'
        };

        try {
            const response = await this.sendToN8nWebhook(payload);
            console.log('✅ Social media post created:', response.status);
            return response;
        } catch (error) {
            console.error('❌ Failed to create social media post:', error.message);
            throw error;
        }
    }

    /**
     * Send deployment notification
     * @param {Object} deploymentData - Deployment information
     */
    async notifyDeployment(deploymentData) {
        const payload = {
            type: 'deployment_notification',
            status: deploymentData.status || 'success',
            repository: deploymentData.repository,
            commit: deploymentData.commit,
            workflow: deploymentData.workflow,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await this.sendToN8nWebhook(payload);
            console.log('✅ Deployment notification sent:', response.status);
            return response;
        } catch (error) {
            console.error('❌ Failed to send deployment notification:', error.message);
            throw error;
        }
    }

    /**
     * Generate configuration template for environment variables
     */
    generateConfigTemplate() {
        const template = `# Career Automation System Environment Variables
# Add these secrets to your GitHub repository: Settings → Secrets → Actions

# Required: n8n webhook URL (get from n8n workflow)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/balaji-automation

# Optional: AI API keys for enhanced automation
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Azure deployment credentials
AZURE_FUNCTIONAPP_NAME=your-azure-function-app-name
AZURE_FUNCTIONAPP_PUBLISH_PROFILE=your_azure_publish_profile

# Optional: Additional webhook URLs for external integrations
DUNS_WEBHOOK_URL=https://your-duns-integration-webhook.com
PORTFOLIO_WEBHOOK_URL=https://your-portfolio-webhook.com

# Configuration Template Generated: ${new Date().toISOString()}
`;

        const configPath = path.join(__dirname, '../.env.automation.template');
        fs.writeFileSync(configPath, template);
        console.log(`✅ Configuration template created: ${configPath}`);
        return configPath;
    }

    /**
     * Test webhook connectivity
     */
    async testWebhook() {
        if (!this.config.n8nWebhookUrl) {
            console.error('❌ N8N_WEBHOOK_URL is not configured');
            return false;
        }

        try {
            const testPayload = {
                type: 'test',
                message: 'Webhook connectivity test',
                timestamp: new Date().toISOString()
            };

            const response = await this.sendToN8nWebhook(testPayload);
            console.log('✅ Webhook test successful:', response.status);
            return true;
        } catch (error) {
            console.error('❌ Webhook test failed:', error.message);
            return false;
        }
    }

    /**
     * Display current configuration status
     */
    displayStatus() {
        console.log('\n🔧 Career Automation System Status:');
        console.log('=====================================');
        
        const configs = [
            { name: 'N8N Webhook URL', value: this.config.n8nWebhookUrl, required: true },
            { name: 'OpenAI API Key', value: this.config.openaiApiKey, required: false },
            { name: 'Gemini API Key', value: this.config.geminiApiKey, required: false },
            { name: 'Azure Publish Profile', value: this.config.azurePublishProfile, required: false }
        ];

        configs.forEach(config => {
            const status = config.value ? '✅ Configured' : (config.required ? '❌ Missing (Required)' : '⚠️ Not configured');
            const maskedValue = config.value ? config.value.substring(0, 20) + '...' : 'Not set';
            console.log(`${config.name}: ${status}`);
            if (config.value) {
                console.log(`  Value: ${maskedValue}`);
            }
        });

        console.log('\n📝 Next Steps:');
        console.log('1. Configure missing environment variables');
        console.log('2. Run: node webhook-integration.js test');
        console.log('3. Deploy using GitHub Actions');
    }
}

// CLI Interface
if (require.main === module) {
    const webhook = new CareerAutomationWebhook();
    const command = process.argv[2];

    switch (command) {
        case 'test':
            webhook.testWebhook().then(success => {
                process.exit(success ? 0 : 1);
            });
            break;

        case 'config':
            webhook.generateConfigTemplate();
            break;

        case 'status':
            webhook.displayStatus();
            break;

        case 'portfolio':
            const projectData = {
                name: process.argv[3] || 'Test Project',
                description: process.argv[4] || 'Test project description',
                tools: ['GitHub Actions', 'n8n', 'Node.js'],
                findings: 'Automation system working correctly'
            };
            webhook.updatePortfolio(projectData).catch(console.error);
            break;

        case 'social':
            const postData = {
                platform: 'linkedin',
                content: process.argv[3] || 'Test social media automation',
                hashtags: ['automation', 'career', 'tech']
            };
            webhook.createSocialMediaPost(postData).catch(console.error);
            break;

        default:
            console.log('\n🚀 Career Automation Webhook Integration');
            console.log('=======================================');
            console.log('Available commands:');
            console.log('  node webhook-integration.js status   - Show configuration status');
            console.log('  node webhook-integration.js test     - Test webhook connectivity');
            console.log('  node webhook-integration.js config   - Generate config template');
            console.log('  node webhook-integration.js portfolio "Project Name" "Description"');
            console.log('  node webhook-integration.js social "Post content"');
            console.log('\nExample:');
            console.log('  node webhook-integration.js portfolio "AI Research" "Completed bioinformatics analysis"');
            webhook.displayStatus();
    }
}

module.exports = CareerAutomationWebhook;