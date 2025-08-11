#!/usr/bin/env node

/**
 * GitHub Activity Tracker and Portfolio Post Generator
 * Turns GitHub activity into 120-word posts, sends preview on WhatsApp, schedules via Buffer/Meta
 */

const { Octokit } = require('@octokit/rest');
const { WhatsAppService } = require('./services/whatsapp.service');
const { SocialMediaService } = require('./services/social-media.service');
const { GoogleSheetsService } = require('./services/google-sheets.service');
const { logger } = require('./utils/logger');
const { withRetry } = require('./utils/retry');

class GitHubActivityTracker {
    constructor() {
        this.octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });
        this.whatsappService = new WhatsAppService();
        this.socialMediaService = new SocialMediaService();
        this.sheetsService = new GoogleSheetsService();
        this.username = process.env.GITHUB_USERNAME;
        this.approvalTimeout = 15 * 60 * 1000; // 15 minutes
    }

    async run() {
        try {
            logger.info('Starting GitHub activity tracking...');
            
            // Step 1: Get recent GitHub activity
            const activity = await withRetry(
                () => this.getRecentActivity(),
                3,
                'Getting GitHub activity'
            );

            if (!activity || activity.length === 0) {
                logger.info('No recent GitHub activity found');
                return;
            }

            // Step 2: Generate portfolio post
            const post = await this.generatePortfolioPost(activity);
            
            // Step 3: Send WhatsApp preview and wait for approval
            const approvalMessage = await this.whatsappService.sendAndWaitForApproval(
                this.formatPostPreview(post),
                this.approvalTimeout
            );

            if (approvalMessage && approvalMessage.toLowerCase().includes('approve')) {
                logger.info('Approval received, scheduling post...');
                
                // Step 4: Schedule via Buffer/Meta
                const results = await this.schedulePost(post);
                
                // Step 5: Log results
                await this.logResults(post, results);
                
                logger.info('Portfolio post scheduled successfully');
            } else {
                logger.info('No approval received, post not scheduled');
                await this.logResults(post, { status: 'not_approved' });
            }

        } catch (error) {
            logger.error('GitHub activity tracking failed:', error);
            await this.logError(error);
            throw error;
        }
    }

    async getRecentActivity() {
        try {
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            // Get recent events
            const events = await this.octokit.activity.listEventsForAuthenticatedUser({
                username: this.username,
                per_page: 100
            });

            // Filter for relevant events in the last week
            const relevantEvents = events.data.filter(event => {
                const eventDate = new Date(event.created_at);
                return eventDate > oneWeekAgo && this.isRelevantEvent(event);
            });

            // Get additional repository information
            const enrichedActivity = await this.enrichActivityData(relevantEvents);
            
            logger.info(`Found ${enrichedActivity.length} relevant GitHub activities`);
            return enrichedActivity;

        } catch (error) {
            logger.error('Failed to get GitHub activity:', error);
            throw error;
        }
    }

    isRelevantEvent(event) {
        const relevantTypes = [
            'PushEvent',           // Code commits
            'CreateEvent',         // Repository/branch creation
            'PullRequestEvent',    // Pull requests
            'IssuesEvent',         // Issues created/closed
            'ReleaseEvent',        // Releases
            'ForkEvent',           // Repository forks
            'WatchEvent',          // Repository stars
            'PublicEvent'          // Repository made public
        ];

        return relevantTypes.includes(event.type);
    }

    async enrichActivityData(events) {
        const enriched = [];
        
        for (const event of events) {
            try {
                const enrichedEvent = {
                    type: event.type,
                    repo: event.repo.name,
                    created_at: event.created_at,
                    actor: event.actor.login,
                    ...await this.getEventDetails(event)
                };

                // Get repository details if it's biotech/bioinformatics related
                if (await this.isBiotechRelated(event.repo.name)) {
                    const repoDetails = await this.getRepositoryDetails(event.repo.name);
                    enrichedEvent.repoDetails = repoDetails;
                    enrichedEvent.isBiotechRelated = true;
                }

                enriched.push(enrichedEvent);
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                logger.warn(`Failed to enrich event ${event.id}:`, error.message);
                // Continue with other events
            }
        }

        return enriched;
    }

    async getEventDetails(event) {
        const details = {};

        switch (event.type) {
            case 'PushEvent':
                details.commits = event.payload.commits?.length || 0;
                details.branch = event.payload.ref?.replace('refs/heads/', '') || 'main';
                details.messages = event.payload.commits?.map(c => c.message).slice(0, 3) || [];
                break;

            case 'PullRequestEvent':
                details.action = event.payload.action;
                details.title = event.payload.pull_request?.title;
                details.state = event.payload.pull_request?.state;
                break;

            case 'CreateEvent':
                details.refType = event.payload.ref_type;
                details.ref = event.payload.ref;
                break;

            case 'IssuesEvent':
                details.action = event.payload.action;
                details.title = event.payload.issue?.title;
                break;

            case 'ReleaseEvent':
                details.action = event.payload.action;
                details.tagName = event.payload.release?.tag_name;
                details.name = event.payload.release?.name;
                break;
        }

        return details;
    }

    async isBiotechRelated(repoName) {
        try {
            const repo = await this.octokit.repos.get({
                owner: repoName.split('/')[0],
                repo: repoName.split('/')[1]
            });

            const description = (repo.data.description || '').toLowerCase();
            const topics = repo.data.topics || [];
            const repoNameLower = repoName.toLowerCase();

            const biotechKeywords = [
                'bioinformatics', 'biotech', 'biology', 'genomics', 'proteomics',
                'pharmaceutical', 'drug', 'clinical', 'medical', 'healthcare',
                'dna', 'rna', 'protein', 'gene', 'sequence', 'analysis'
            ];

            const hasBiotechKeywords = biotechKeywords.some(keyword =>
                description.includes(keyword) || 
                topics.includes(keyword) ||
                repoNameLower.includes(keyword)
            );

            return hasBiotechKeywords;

        } catch (error) {
            logger.warn(`Failed to check if repo ${repoName} is biotech related:`, error.message);
            return false;
        }
    }

    async getRepositoryDetails(repoName) {
        try {
            const [owner, repo] = repoName.split('/');
            
            const [repoData, languages, readme] = await Promise.all([
                this.octokit.repos.get({ owner, repo }),
                this.octokit.repos.listLanguages({ owner, repo }),
                this.getReadmeContent(owner, repo)
            ]);

            return {
                description: repoData.data.description,
                language: repoData.data.language,
                languages: Object.keys(languages.data),
                stars: repoData.data.stargazers_count,
                forks: repoData.data.forks_count,
                topics: repoData.data.topics,
                hasReadme: !!readme,
                createdAt: repoData.data.created_at,
                updatedAt: repoData.data.updated_at
            };

        } catch (error) {
            logger.warn(`Failed to get repository details for ${repoName}:`, error.message);
            return {};
        }
    }

    async getReadmeContent(owner, repo) {
        try {
            const readme = await this.octokit.repos.getReadme({ owner, repo });
            return Buffer.from(readme.data.content, 'base64').toString('utf8');
        } catch (error) {
            return null;
        }
    }

    async generatePortfolioPost(activity) {
        const biotechActivity = activity.filter(a => a.isBiotechRelated);
        const totalActivity = activity.length;
        const biotechRepos = [...new Set(biotechActivity.map(a => a.repo))];
        
        const post = {
            content: await this.createPostContent(activity, biotechActivity),
            hashtags: this.generateHashtags(activity),
            metrics: {
                totalActivity,
                biotechActivity: biotechActivity.length,
                repositories: biotechRepos.length,
                commits: activity.filter(a => a.type === 'PushEvent').reduce((sum, a) => sum + (a.commits || 0), 0)
            },
            repositories: biotechRepos.slice(0, 3), // Top 3 repos
            generatedAt: new Date().toISOString()
        };

        return post;
    }

    async createPostContent(activity, biotechActivity) {
        const templates = [
            this.createDevelopmentUpdateTemplate,
            this.createProjectHighlightTemplate,
            this.createLearningJourneyTemplate,
            this.createSkillDevelopmentTemplate
        ];

        // Choose template based on activity type
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template.call(this, activity, biotechActivity);
    }

    createDevelopmentUpdateTemplate(activity, biotechActivity) {
        const commits = activity.filter(a => a.type === 'PushEvent').reduce((sum, a) => sum + (a.commits || 0), 0);
        const repos = [...new Set(biotechActivity.map(a => a.repo))];
        const mainLanguages = this.extractMainLanguages(biotechActivity);

        return `🧬 Weekly Development Update!

This week I pushed ${commits} commits across ${repos.length} bioinformatics projects, focusing on ${mainLanguages.join(' and ')} development.

🔬 Key highlights:
${this.generateHighlights(biotechActivity).slice(0, 2).map(h => `• ${h}`).join('\n')}

Building computational solutions for biological research and advancing my biotech career journey. Every line of code brings me closer to making an impact in pharmaceutical innovation.

#BioinformaticsJourney #CodeForScience`;
    }

    createProjectHighlightTemplate(activity, biotechActivity) {
        const featuredRepo = biotechActivity.find(a => a.repoDetails)?.repo;
        const languages = this.extractMainLanguages(biotechActivity);

        return `🚀 Project Spotlight: Biotech Development

Excited to share recent progress on my ${featuredRepo ? featuredRepo.split('/')[1] : 'bioinformatics'} project! 

💻 Tech stack: ${languages.join(', ')}
🧪 Focus: Computational biology and data analysis
📊 Impact: Building tools for pharmaceutical research

${this.generateTechnicalHighlight(biotechActivity)}

Passionate about bridging biology and technology to accelerate drug discovery and improve healthcare outcomes.

#ProjectShowcase #BiotechInnovation`;
    }

    createLearningJourneyTemplate(activity, biotechActivity) {
        const skills = this.extractSkillsFromActivity(biotechActivity);
        const repoCount = [...new Set(biotechActivity.map(a => a.repo))].length;

        return `📚 Continuous Learning in Bioinformatics

This week expanded my skill set across ${repoCount} active projects, mastering ${skills.join(', ')} for biological data analysis.

🎯 Recent achievements:
${this.generateLearningHighlights(biotechActivity).slice(0, 2).map(h => `• ${h}`).join('\n')}

Committed to staying current with computational biology trends and building expertise that matters in pharmaceutical research.

#LifelongLearning #BiotechSkills`;
    }

    createSkillDevelopmentTemplate(activity, biotechActivity) {
        const commits = activity.filter(a => a.type === 'PushEvent').reduce((sum, a) => sum + (a.commits || 0), 0);
        const mainSkill = this.extractMainLanguages(biotechActivity)[0] || 'Python';

        return `⚡ Skill Development Update

Intensified my ${mainSkill} programming this week with ${commits} commits focused on bioinformatics applications.

🔧 Technical focus:
${this.generateTechnicalHighlights(biotechActivity).slice(0, 2).map(h => `• ${h}`).join('\n')}

Building expertise that pharmaceutical companies value - combining biological knowledge with computational skills for real-world impact.

#SkillBuilding #TechForBiotech`;
    }

    generateHighlights(activity) {
        const highlights = [];
        
        const pushEvents = activity.filter(a => a.type === 'PushEvent');
        if (pushEvents.length > 0) {
            highlights.push(`Enhanced ${pushEvents[0]?.repo?.split('/')[1]} with ${pushEvents.reduce((sum, a) => sum + (a.commits || 0), 0)} commits`);
        }

        const newRepos = activity.filter(a => a.type === 'CreateEvent' && a.refType === 'repository');
        if (newRepos.length > 0) {
            highlights.push(`Launched new ${newRepos[0]?.repo?.split('/')[1]} project`);
        }

        const prs = activity.filter(a => a.type === 'PullRequestEvent');
        if (prs.length > 0) {
            highlights.push(`Collaborated through ${prs.length} pull requests`);
        }

        return highlights.length > 0 ? highlights : ['Advanced bioinformatics analysis capabilities'];
    }

    generateTechnicalHighlight(activity) {
        const commits = activity.filter(a => a.type === 'PushEvent')[0];
        if (commits && commits.messages?.length > 0) {
            return `Recent work: "${commits.messages[0].substring(0, 60)}..."`;
        }
        return 'Implementing cutting-edge computational biology solutions.';
    }

    generateLearningHighlights(activity) {
        const highlights = [];
        
        if (activity.some(a => a.languages?.includes('Python'))) {
            highlights.push('Advanced Python scripting for biological data processing');
        }
        
        if (activity.some(a => a.languages?.includes('R'))) {
            highlights.push('Statistical analysis with R for genomic research');
        }
        
        if (activity.some(a => a.repoDetails?.topics?.includes('machine-learning'))) {
            highlights.push('Applied ML techniques to biomedical datasets');
        }

        return highlights.length > 0 ? highlights : ['Strengthened computational biology foundations'];
    }

    generateTechnicalHighlights(activity) {
        const highlights = [];
        
        const languages = this.extractMainLanguages(activity);
        if (languages.length > 0) {
            highlights.push(`${languages[0]} algorithm optimization for biological analysis`);
        }
        
        if (activity.some(a => a.type === 'PullRequestEvent')) {
            highlights.push('Code review and collaborative development practices');
        }

        return highlights.length > 0 ? highlights : ['Enhanced data processing pipeline efficiency'];
    }

    extractMainLanguages(activity) {
        const languageCounts = {};
        
        activity.forEach(a => {
            if (a.repoDetails?.languages) {
                a.repoDetails.languages.forEach(lang => {
                    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
                });
            }
        });

        return Object.entries(languageCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([lang]) => lang);
    }

    extractSkillsFromActivity(activity) {
        const skills = new Set();
        
        activity.forEach(a => {
            if (a.repoDetails?.languages) {
                a.repoDetails.languages.forEach(lang => skills.add(lang));
            }
            
            if (a.repoDetails?.topics) {
                a.repoDetails.topics.forEach(topic => {
                    if (['data-science', 'machine-learning', 'statistics', 'visualization'].includes(topic)) {
                        skills.add(topic.replace('-', ' '));
                    }
                });
            }
        });

        return Array.from(skills).slice(0, 3);
    }

    generateHashtags(activity) {
        const hashtags = [
            '#Bioinformatics',
            '#BiotechCareer',
            '#ComputationalBiology',
            '#DataScience',
            '#Python',
            '#OpenSource',
            '#PharmaJobs',
            '#BioTech',
            '#CareerGrowth'
        ];

        // Add language-specific hashtags
        const languages = this.extractMainLanguages(activity);
        languages.forEach(lang => {
            if (lang && !hashtags.includes(`#${lang}`)) {
                hashtags.push(`#${lang}`);
            }
        });

        return hashtags.slice(0, 8); // Limit to 8 hashtags
    }

    formatPostPreview(post) {
        return `📝 *Portfolio Post Preview*

${post.content}

${post.hashtags.join(' ')}

📊 *Metrics:*
• Total Activities: ${post.metrics.totalActivity}
• Biotech Projects: ${post.metrics.biotechActivity}
• Commits: ${post.metrics.commits}
• Repositories: ${post.metrics.repositories}

🎯 *Featured Repos:*
${post.repositories.map(repo => `• ${repo}`).join('\n')}

React with "Approve" to schedule via Buffer/Meta or ignore to skip.`;
    }

    async schedulePost(post) {
        try {
            const results = await Promise.allSettled([
                this.socialMediaService.scheduleLinkedInPost(post),
                this.socialMediaService.scheduleTwitterPost(post),
                this.socialMediaService.scheduleFacebookPost(post)
            ]);

            const summary = {
                linkedin: results[0].status === 'fulfilled' ? 'scheduled' : 'failed',
                twitter: results[1].status === 'fulfilled' ? 'scheduled' : 'failed',
                facebook: results[2].status === 'fulfilled' ? 'scheduled' : 'failed',
                scheduledAt: new Date().toISOString()
            };

            logger.info('Post scheduling results:', summary);
            return summary;

        } catch (error) {
            logger.error('Failed to schedule posts:', error);
            throw error;
        }
    }

    async logResults(post, results) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            component: 'GitHubActivityTracker',
            postContent: post.content.substring(0, 100) + '...',
            metrics: post.metrics,
            schedulingResults: results,
            status: results.status || 'completed'
        };

        await this.sheetsService.logResult(logEntry);
        logger.info('GitHub activity tracking results logged');
    }

    async logError(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            component: 'GitHubActivityTracker',
            error: error.message,
            stack: error.stack
        };

        await this.sheetsService.logError(errorLog);
    }
}

// Run if called directly
if (require.main === module) {
    const tracker = new GitHubActivityTracker();
    tracker.run()
        .then(() => {
            logger.info('GitHub activity tracking completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('GitHub activity tracking failed:', error);
            process.exit(1);
        });
}

module.exports = { GitHubActivityTracker };