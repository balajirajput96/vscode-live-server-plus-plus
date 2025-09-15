/**
 * 🎬 YouTube Data API Integration
 * Complete YouTube automation for entrepreneurship content
 */

const { google } = require('googleapis');
const fs = require('fs').promises;

class YouTubeAutomation {
    constructor(apiKey, oauth2Credentials) {
        this.apiKey = apiKey;
        this.oauth2Client = new google.auth.OAuth2(
            oauth2Credentials.clientId,
            oauth2Credentials.clientSecret,
            oauth2Credentials.redirectUri
        );
        this.oauth2Client.setCredentials(oauth2Credentials.tokens);
        this.youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
    }

    /**
     * Upload video with automated metadata
     * @param {Object} videoData - Video information
     * @returns {Object} Upload result
     */
    async uploadVideo(videoData) {
        try {
            const {
                title,
                description,
                tags,
                filePath,
                categoryId = '22', // People & Blogs for entrepreneurship
                privacy = 'public',
                scheduledPublishTime = null
            } = videoData;

            const videoResource = {
                snippet: {
                    title: title,
                    description: description,
                    tags: tags,
                    categoryId: categoryId,
                    defaultLanguage: 'hi', // Hindi for Indian entrepreneurship content
                    defaultAudioLanguage: 'hi'
                },
                status: {
                    privacyStatus: privacy,
                    publishAt: scheduledPublishTime,
                    selfDeclaredMadeForKids: false
                }
            };

            const media = {
                body: await fs.createReadStream(filePath)
            };

            const response = await this.youtube.videos.insert({
                part: 'snippet,status',
                resource: videoResource,
                media: media,
                notifySubscribers: true
            });

            console.log(`✅ Video uploaded successfully: ${response.data.id}`);
            return {
                success: true,
                videoId: response.data.id,
                url: `https://www.youtube.com/watch?v=${response.data.id}`
            };
        } catch (error) {
            console.error('❌ Upload failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate optimized video metadata using AI
     * @param {Object} content - Video content details
     * @returns {Object} Optimized metadata
     */
    async generateVideoMetadata(content) {
        const { topic, keyPoints, targetAudience } = content;

        // AI-generated title variations for A/B testing
        const titleTemplates = [
            `${topic} के लिए Complete Guide | Entrepreneurship Tips`,
            `How to ${topic} | Business Success Strategy`,
            `${topic} से पैसे कैसे कमाएं | Startup Guide`,
            `${topic} | Entrepreneur के लिए Practical Tips`,
            `Complete ${topic} Tutorial | Business Growth Hacks`
        ];

        // Generate description with proper structure
        const description = this.generateVideoDescription(content);

        // SEO-optimized tags for entrepreneurship niche
        const tags = [
            'entrepreneurship',
            'business',
            'startup',
            'hindi business',
            'entrepreneur tips',
            'business ideas',
            'money making',
            'success tips',
            topic.toLowerCase().replace(/\s+/g, '-'),
            'indian entrepreneur',
            'business strategy',
            'startup india'
        ];

        return {
            titles: titleTemplates,
            description: description,
            tags: tags,
            thumbnail: await this.generateThumbnailSuggestions(topic)
        };
    }

    /**
     * Generate video description with proper structure
     * @param {Object} content - Video content
     * @returns {string} Formatted description
     */
    generateVideoDescription(content) {
        const { topic, keyPoints, timestamps, affiliateLinks, socialLinks } = content;

        let description = `🚀 ${topic} के बारे में Complete Information\n\n`;
        
        description += `📝 इस Video में:\n`;
        keyPoints.forEach((point, index) => {
            description += `${index + 1}. ${point}\n`;
        });

        description += `\n⏰ Timestamps:\n`;
        if (timestamps) {
            timestamps.forEach(stamp => {
                description += `${stamp.time} - ${stamp.title}\n`;
            });
        }

        description += `\n💼 Useful Resources:\n`;
        if (affiliateLinks) {
            affiliateLinks.forEach(link => {
                description += `${link.title}: ${link.url}\n`;
            });
        }

        description += `\n📱 Connect with me:\n`;
        if (socialLinks) {
            Object.entries(socialLinks).forEach(([platform, url]) => {
                description += `${platform}: ${url}\n`;
            });
        }

        description += `\n#Entrepreneurship #Business #StartupIndia #BusinessTips #Hindi\n\n`;
        description += `⚠️ Disclaimer: यह video educational purpose के लिए है। कोई भी business decision लेने से पहले proper research करें।`;

        return description;
    }

    /**
     * Generate thumbnail suggestions
     * @param {string} topic - Video topic
     * @returns {Array} Thumbnail design suggestions
     */
    async generateThumbnailSuggestions(topic) {
        return [
            {
                style: 'bold_text',
                elements: ['Large Hindi text', 'Person pointing', 'Money symbols'],
                colors: ['Red', 'Yellow', 'White'],
                template: 'high_contrast_entrepreneurship'
            },
            {
                style: 'professional',
                elements: ['Clean typography', 'Business icons', 'Gradient background'],
                colors: ['Blue', 'White', 'Orange'],
                template: 'modern_business'
            },
            {
                style: 'youtube_trending',
                elements: ['Shocked expression', 'Currency symbols', 'Arrows'],
                colors: ['Red', 'Yellow', 'Black'],
                template: 'viral_money_making'
            }
        ];
    }

    /**
     * Auto-moderate and reply to comments
     * @param {string} videoId - Video ID
     * @returns {Object} Moderation results
     */
    async moderateComments(videoId) {
        try {
            const response = await this.youtube.commentThreads.list({
                part: 'snippet,replies',
                videoId: videoId,
                maxResults: 100,
                order: 'time'
            });

            const comments = response.data.items;
            const moderationResults = [];

            for (const comment of comments) {
                const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
                const commentId = comment.snippet.topLevelComment.id;

                // Basic spam/toxic detection
                const moderationAction = this.analyzeComment(commentText);
                
                if (moderationAction.action === 'auto_reply') {
                    await this.replyToComment(commentId, moderationAction.reply);
                } else if (moderationAction.action === 'hide') {
                    await this.hideComment(commentId);
                }

                moderationResults.push({
                    commentId: commentId,
                    text: commentText,
                    action: moderationAction.action,
                    confidence: moderationAction.confidence
                });
            }

            return { success: true, results: moderationResults };
        } catch (error) {
            console.error('❌ Comment moderation failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Analyze comment for moderation
     * @param {string} commentText - Comment text
     * @returns {Object} Moderation decision
     */
    analyzeComment(commentText) {
        const lowerText = commentText.toLowerCase();

        // Common positive patterns for auto-reply
        const positivePatterns = [
            'great video', 'helpful', 'thanks', 'useful', 'amazing',
            'बहुत अच्छा', 'धन्यवाद', 'helpful', 'good content'
        ];

        // Spam/toxic patterns
        const negativePatterns = [
            'subscribe to my channel', 'check my channel', 'spam',
            'fake', 'scam', 'waste of time'
        ];

        // Question patterns for auto-reply
        const questionPatterns = [
            'how to', 'kaise', 'क्या', 'कैसे', 'when', 'where'
        ];

        if (negativePatterns.some(pattern => lowerText.includes(pattern))) {
            return {
                action: 'hide',
                confidence: 0.8,
                reason: 'Potential spam/toxic content'
            };
        }

        if (questionPatterns.some(pattern => lowerText.includes(pattern))) {
            return {
                action: 'auto_reply',
                confidence: 0.7,
                reply: 'Thanks for your question! Please check the video description for detailed information. आप video को पूरा देखिए, सभी details मिल जाएंगी। 🙏'
            };
        }

        if (positivePatterns.some(pattern => lowerText.includes(pattern))) {
            return {
                action: 'auto_reply',
                confidence: 0.9,
                reply: 'Thank you so much! 🙏 अगर helpful लगा तो like और share करना न भूलें। More valuable content के लिए subscribe करें!'
            };
        }

        return {
            action: 'approve',
            confidence: 0.6,
            reason: 'Standard comment, no action needed'
        };
    }

    /**
     * Reply to a comment
     * @param {string} commentId - Comment ID
     * @param {string} replyText - Reply text
     */
    async replyToComment(commentId, replyText) {
        try {
            await this.youtube.comments.insert({
                part: 'snippet',
                resource: {
                    snippet: {
                        parentId: commentId,
                        textOriginal: replyText
                    }
                }
            });
            console.log(`✅ Replied to comment: ${commentId}`);
        } catch (error) {
            console.error('❌ Reply failed:', error.message);
        }
    }

    /**
     * Get video analytics
     * @param {string} videoId - Video ID
     * @returns {Object} Analytics data
     */
    async getVideoAnalytics(videoId) {
        try {
            const response = await this.youtube.videos.list({
                part: 'statistics,snippet',
                id: videoId
            });

            const video = response.data.items[0];
            if (!video) {
                throw new Error('Video not found');
            }

            const analytics = {
                title: video.snippet.title,
                publishedAt: video.snippet.publishedAt,
                views: parseInt(video.statistics.viewCount) || 0,
                likes: parseInt(video.statistics.likeCount) || 0,
                comments: parseInt(video.statistics.commentCount) || 0,
                subscribers: parseInt(video.statistics.subscriberCount) || 0,
                engagementRate: this.calculateEngagementRate(video.statistics)
            };

            return { success: true, analytics: analytics };
        } catch (error) {
            console.error('❌ Analytics fetch failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate engagement rate
     * @param {Object} stats - Video statistics
     * @returns {number} Engagement rate percentage
     */
    calculateEngagementRate(stats) {
        const views = parseInt(stats.viewCount) || 0;
        const likes = parseInt(stats.likeCount) || 0;
        const comments = parseInt(stats.commentCount) || 0;

        if (views === 0) return 0;
        
        const engagement = ((likes + comments) / views) * 100;
        return Math.round(engagement * 100) / 100;
    }

    /**
     * Schedule daily content pipeline
     * @param {Array} contentQueue - Queued content
     * @returns {Object} Scheduling results
     */
    async scheduleDailyPipeline(contentQueue) {
        const results = [];

        for (const content of contentQueue) {
            try {
                // Generate metadata
                const metadata = await this.generateVideoMetadata(content);
                
                // Schedule upload
                const uploadResult = await this.uploadVideo({
                    title: metadata.titles[0], // Use first title option
                    description: metadata.description,
                    tags: metadata.tags,
                    filePath: content.videoFile,
                    scheduledPublishTime: content.publishTime
                });

                results.push({
                    content: content.topic,
                    result: uploadResult,
                    metadata: metadata
                });

            } catch (error) {
                results.push({
                    content: content.topic,
                    error: error.message
                });
            }
        }

        return { success: true, results: results };
    }
}

module.exports = YouTubeAutomation;

/**
 * Example usage:
 * 
 * const youtube = new YouTubeAutomation(apiKey, oauth2Credentials);
 * 
 * // Upload video
 * const uploadResult = await youtube.uploadVideo({
 *     title: "Online Business कैसे शुरू करें | Complete Guide",
 *     description: "Complete guide for starting online business...",
 *     tags: ["entrepreneurship", "business", "startup"],
 *     filePath: "/path/to/video.mp4"
 * });
 * 
 * // Auto-moderate comments
 * const moderation = await youtube.moderateComments(videoId);
 */