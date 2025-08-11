/**
 * Social Media Service
 * Handles scheduling posts to LinkedIn, Twitter, Facebook via Buffer and Meta APIs
 */

const axios = require('axios');
const { logger } = require('../utils/logger');
const { withRetry, withTimeout } = require('../utils/retry');

class SocialMediaService {
    constructor() {
        this.bufferToken = process.env.BUFFER_ACCESS_TOKEN;
        this.metaToken = process.env.META_ACCESS_TOKEN;
        this.pageId = process.env.FACEBOOK_PAGE_ID;
        this.linkedinProfileId = process.env.LINKEDIN_PROFILE_ID;
        
        this.bufferBaseUrl = 'https://api.bufferapp.com/1';
        this.metaBaseUrl = 'https://graph.facebook.com/v18.0';
    }

    async scheduleLinkedInPost(post) {
        try {
            logger.info('Scheduling LinkedIn post...');
            
            // Use Buffer API for LinkedIn scheduling
            const payload = {
                text: this.formatLinkedInPost(post),
                profile_ids: [this.linkedinProfileId],
                scheduled_at: this.getOptimalPostTime('linkedin')
            };

            const response = await withRetry(
                () => withTimeout(
                    () => axios.post(`${this.bufferBaseUrl}/updates/create.json`, payload, {
                        headers: {
                            'Authorization': `Bearer ${this.bufferToken}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    30000,
                    'LinkedIn post scheduling'
                ),
                3,
                'Scheduling LinkedIn post'
            );

            logger.info('LinkedIn post scheduled successfully', {
                updateId: response.data.id,
                scheduledAt: payload.scheduled_at
            });

            return {
                platform: 'linkedin',
                status: 'scheduled',
                updateId: response.data.id,
                scheduledAt: payload.scheduled_at
            };

        } catch (error) {
            logger.error('Failed to schedule LinkedIn post:', error);
            throw error;
        }
    }

    async scheduleTwitterPost(post) {
        try {
            logger.info('Scheduling Twitter post...');
            
            const twitterContent = this.formatTwitterPost(post);
            
            // Use Buffer API for Twitter scheduling
            const payload = {
                text: twitterContent,
                profile_ids: [process.env.TWITTER_PROFILE_ID],
                scheduled_at: this.getOptimalPostTime('twitter')
            };

            const response = await withRetry(
                () => withTimeout(
                    () => axios.post(`${this.bufferBaseUrl}/updates/create.json`, payload, {
                        headers: {
                            'Authorization': `Bearer ${this.bufferToken}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    30000,
                    'Twitter post scheduling'
                ),
                3,
                'Scheduling Twitter post'
            );

            logger.info('Twitter post scheduled successfully', {
                updateId: response.data.id,
                scheduledAt: payload.scheduled_at
            });

            return {
                platform: 'twitter',
                status: 'scheduled',
                updateId: response.data.id,
                scheduledAt: payload.scheduled_at
            };

        } catch (error) {
            logger.error('Failed to schedule Twitter post:', error);
            throw error;
        }
    }

    async scheduleFacebookPost(post) {
        try {
            logger.info('Scheduling Facebook post...');
            
            const facebookContent = this.formatFacebookPost(post);
            
            // Use Meta Graph API for Facebook scheduling
            const payload = {
                message: facebookContent,
                published: false, // Schedule for later
                scheduled_publish_time: Math.floor(new Date(this.getOptimalPostTime('facebook')).getTime() / 1000),
                access_token: this.metaToken
            };

            const response = await withRetry(
                () => withTimeout(
                    () => axios.post(`${this.metaBaseUrl}/${this.pageId}/feed`, payload),
                    30000,
                    'Facebook post scheduling'
                ),
                3,
                'Scheduling Facebook post'
            );

            logger.info('Facebook post scheduled successfully', {
                postId: response.data.id,
                scheduledAt: payload.scheduled_publish_time
            });

            return {
                platform: 'facebook',
                status: 'scheduled',
                postId: response.data.id,
                scheduledAt: new Date(payload.scheduled_publish_time * 1000).toISOString()
            };

        } catch (error) {
            logger.error('Failed to schedule Facebook post:', error);
            throw error;
        }
    }

    formatLinkedInPost(post) {
        // LinkedIn allows longer posts and professional tone
        const content = `${post.content}

${post.hashtags.join(' ')}

#OpenToWork #BiotechJobs #PharmaCareer`;

        // LinkedIn limit is 3000 characters
        return content.length > 3000 ? content.substring(0, 2997) + '...' : content;
    }

    formatTwitterPost(post) {
        // Twitter has character limits, need to be concise
        const shortContent = this.summarizeForTwitter(post.content);
        const hashtags = post.hashtags.slice(0, 5).join(' '); // Limit hashtags
        
        const tweetContent = `${shortContent}

${hashtags}`;

        // Twitter limit is 280 characters
        return tweetContent.length > 280 ? tweetContent.substring(0, 277) + '...' : tweetContent;
    }

    formatFacebookPost(post) {
        // Facebook allows longer posts and more casual tone
        const content = `🧬 Biotech Development Update!

${post.content}

${post.hashtags.slice(0, 8).join(' ')}

#BiotechCareer #OpenToWork`;

        return content;
    }

    summarizeForTwitter(content) {
        // Extract key points from longer content for Twitter
        const sentences = content.split('. ');
        const keySentence = sentences[0]; // Usually the main point
        
        // If still too long, truncate intelligently
        if (keySentence.length > 150) {
            const words = keySentence.split(' ');
            const truncated = words.slice(0, 20).join(' ');
            return truncated + '...';
        }
        
        return keySentence;
    }

    getOptimalPostTime(platform) {
        const now = new Date();
        const currentHour = now.getHours();
        let optimalTime = new Date(now);

        // Set optimal posting times based on platform and IST timezone
        switch (platform) {
            case 'linkedin':
                // LinkedIn: Tuesday-Thursday, 9 AM or 2 PM IST
                if (currentHour < 9) {
                    optimalTime.setHours(9, 0, 0, 0);
                } else if (currentHour < 14) {
                    optimalTime.setHours(14, 0, 0, 0);
                } else {
                    // Next day 9 AM
                    optimalTime.setDate(optimalTime.getDate() + 1);
                    optimalTime.setHours(9, 0, 0, 0);
                }
                break;

            case 'twitter':
                // Twitter: 9 AM, 12 PM, 3 PM IST
                if (currentHour < 9) {
                    optimalTime.setHours(9, 0, 0, 0);
                } else if (currentHour < 12) {
                    optimalTime.setHours(12, 0, 0, 0);
                } else if (currentHour < 15) {
                    optimalTime.setHours(15, 0, 0, 0);
                } else {
                    // Next day 9 AM
                    optimalTime.setDate(optimalTime.getDate() + 1);
                    optimalTime.setHours(9, 0, 0, 0);
                }
                break;

            case 'facebook':
                // Facebook: 1-3 PM IST (when people check during lunch)
                if (currentHour < 13) {
                    optimalTime.setHours(13, 0, 0, 0);
                } else if (currentHour < 15) {
                    optimalTime.setHours(14, 30, 0, 0);
                } else {
                    // Next day 1 PM
                    optimalTime.setDate(optimalTime.getDate() + 1);
                    optimalTime.setHours(13, 0, 0, 0);
                }
                break;

            default:
                // Default to 1 hour from now
                optimalTime.setHours(optimalTime.getHours() + 1);
        }

        return optimalTime.toISOString();
    }

    async getScheduledPosts() {
        try {
            const response = await axios.get(`${this.bufferBaseUrl}/profiles/{profile_id}/updates/pending.json`, {
                headers: {
                    'Authorization': `Bearer ${this.bufferToken}`
                }
            });

            return response.data;
        } catch (error) {
            logger.error('Failed to get scheduled posts:', error);
            return [];
        }
    }

    async updateScheduledPost(updateId, changes) {
        try {
            const response = await axios.post(`${this.bufferBaseUrl}/updates/${updateId}/update.json`, changes, {
                headers: {
                    'Authorization': `Bearer ${this.bufferToken}`,
                    'Content-Type': 'application/json'
                }
            });

            logger.info(`Updated scheduled post ${updateId}`);
            return response.data;
        } catch (error) {
            logger.error(`Failed to update scheduled post ${updateId}:`, error);
            throw error;
        }
    }

    async deleteScheduledPost(updateId) {
        try {
            await axios.post(`${this.bufferBaseUrl}/updates/${updateId}/destroy.json`, {}, {
                headers: {
                    'Authorization': `Bearer ${this.bufferToken}`
                }
            });

            logger.info(`Deleted scheduled post ${updateId}`);
        } catch (error) {
            logger.error(`Failed to delete scheduled post ${updateId}:`, error);
            throw error;
        }
    }

    async getAnalytics(platform, days = 7) {
        try {
            // This would return engagement analytics for posts
            // Implementation depends on specific API endpoints
            logger.info(`Getting ${platform} analytics for last ${days} days`);
            
            // Mock analytics data
            return {
                platform,
                period: `${days} days`,
                posts: 5,
                totalReach: 1250,
                totalEngagement: 89,
                avgEngagementRate: 7.1,
                topPost: 'Bioinformatics project update',
                bestPostTime: '9:00 AM IST'
            };
        } catch (error) {
            logger.error(`Failed to get ${platform} analytics:`, error);
            return null;
        }
    }

    // Health check method
    async healthCheck() {
        try {
            const checks = await Promise.allSettled([
                this.checkBufferAPI(),
                this.checkMetaAPI()
            ]);

            return {
                buffer: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
                meta: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Social media service health check failed:', error);
            return {
                buffer: 'unhealthy',
                meta: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    async checkBufferAPI() {
        const response = await axios.get(`${this.bufferBaseUrl}/user.json`, {
            headers: {
                'Authorization': `Bearer ${this.bufferToken}`
            },
            timeout: 10000
        });
        return response.status === 200;
    }

    async checkMetaAPI() {
        const response = await axios.get(`${this.metaBaseUrl}/me`, {
            params: { access_token: this.metaToken },
            timeout: 10000
        });
        return response.status === 200;
    }
}

module.exports = { SocialMediaService };