/**
 * WhatsApp Business API Service
 * Handles WhatsApp messaging and approval workflows
 */

const axios = require('axios');
const { logger } = require('../utils/logger');
const { withRetry } = require('../utils/retry');

class WhatsAppService {
    constructor() {
        this.token = process.env.WHATSAPP_TOKEN;
        this.phoneId = process.env.WHATSAPP_PHONE_ID;
        this.targetNumber = process.env.WHATSAPP_TARGET_NUMBER;
        this.baseUrl = `https://graph.facebook.com/v18.0/${this.phoneId}`;
        this.pendingApprovals = new Map();
        
        if (!this.token || !this.phoneId || !this.targetNumber) {
            throw new Error('WhatsApp credentials not configured');
        }
    }

    async sendMessage(message, phoneNumber = null) {
        const url = `${this.baseUrl}/messages`;
        const recipient = phoneNumber || this.targetNumber;

        const payload = {
            messaging_product: 'whatsapp',
            to: recipient,
            type: 'text',
            text: { body: message }
        };

        try {
            const response = await withRetry(
                () => axios.post(url, payload, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }),
                3,
                'Sending WhatsApp message'
            );

            logger.info('WhatsApp message sent successfully', { 
                messageId: response.data.messages[0].id,
                recipient
            });

            return response.data.messages[0].id;
        } catch (error) {
            logger.error('Failed to send WhatsApp message:', error);
            throw error;
        }
    }

    async sendAndWaitForApproval(message, timeoutMs = 15 * 60 * 1000) {
        const approvalId = 'approval_' + Date.now();
        
        // Send message with approval request
        const approvalMessage = `${message}

⏰ *Auto-timeout in 15 minutes*
Reply with "Approve" to proceed or ignore to skip.

Approval ID: ${approvalId}`;

        await this.sendMessage(approvalMessage);
        
        return new Promise((resolve) => {
            // Set up approval listener
            this.pendingApprovals.set(approvalId, {
                resolve,
                timestamp: Date.now(),
                message
            });

            // Set timeout
            setTimeout(() => {
                if (this.pendingApprovals.has(approvalId)) {
                    this.pendingApprovals.delete(approvalId);
                    logger.info(`Approval timeout for ${approvalId}`);
                    resolve(null); // Timeout
                }
            }, timeoutMs);
        });
    }

    // This would be called by a webhook handler in a real implementation
    handleIncomingMessage(messageData) {
        const { from, text, timestamp } = messageData;
        
        if (from !== this.targetNumber) {
            logger.warn('Received message from unknown number:', from);
            return;
        }

        const messageText = text.body.toLowerCase();
        
        // Check for approval responses
        if (messageText.includes('approve')) {
            this.processApproval(messageText, timestamp);
        }
    }

    processApproval(messageText, timestamp) {
        // Extract approval ID if present
        const approvalIdMatch = messageText.match(/approval_(\d+)/);
        
        if (approvalIdMatch) {
            const approvalId = `approval_${approvalIdMatch[1]}`;
            
            if (this.pendingApprovals.has(approvalId)) {
                const approval = this.pendingApprovals.get(approvalId);
                this.pendingApprovals.delete(approvalId);
                
                logger.info(`Approval received for ${approvalId}`);
                approval.resolve(messageText);
                return;
            }
        }

        // Fallback: approve latest pending approval
        const latestApproval = Array.from(this.pendingApprovals.entries())
            .sort(([,a], [,b]) => b.timestamp - a.timestamp)[0];

        if (latestApproval) {
            const [approvalId, approval] = latestApproval;
            this.pendingApprovals.delete(approvalId);
            
            logger.info(`Approval received for latest request: ${approvalId}`);
            approval.resolve(messageText);
        }
    }

    async sendJobSummary(jobs) {
        const summary = this.formatJobSummary(jobs);
        return await this.sendMessage(summary);
    }

    async sendLearningUpdate(progress) {
        const update = this.formatLearningUpdate(progress);
        return await this.sendMessage(update);
    }

    async sendPortfolioPreview(content) {
        const preview = `📝 *Portfolio Post Preview*

${content}

React with "Approve" to schedule via Buffer/Meta or ignore to skip.`;
        
        return await this.sendAndWaitForApproval(preview);
    }

    async sendErrorNotification(error, component) {
        const errorMessage = `🚨 *System Error Alert*

Component: ${component}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
Error: ${error.message}

Automated systems may be affected. Please check logs for details.`;

        return await this.sendMessage(errorMessage);
    }

    formatJobSummary(jobs) {
        const total = jobs.length;
        const companies = [...new Set(jobs.map(j => j.company))].length;
        
        return `💼 *Daily Job Summary*

📊 Found ${total} new jobs from ${companies} companies
🔗 Top Companies: ${jobs.slice(0, 3).map(j => j.company).join(', ')}
📍 Locations: ${[...new Set(jobs.map(j => j.location))].slice(0, 3).join(', ')}

View full details in your tracking sheet.`;
    }

    formatLearningUpdate(progress) {
        return `📚 *Learning Progress Update*

✅ Completed: ${progress.completed} minutes
🎯 Target: ${progress.target} minutes
📈 Weekly Progress: ${Math.round(progress.weeklyProgress * 100)}%

Keep up the great work! 🚀`;
    }

    // Health check method
    async healthCheck() {
        try {
            const testMessage = `🔧 WhatsApp Service Health Check - ${new Date().toISOString()}`;
            await this.sendMessage(testMessage);
            return true;
        } catch (error) {
            logger.error('WhatsApp health check failed:', error);
            return false;
        }
    }
}

module.exports = { WhatsAppService };