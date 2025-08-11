#!/usr/bin/env node

/**
 * Main Automation Orchestrator
 * Coordinates all automation agents and provides a unified interface
 */

const { JobAggregator } = require('./job-aggregator');
const { LearningTracker } = require('./learning-tracker');
const { GitHubActivityTracker } = require('./github-activity-tracker');
const { CIFailureClassifier } = require('./ci-failure-classifier');
const { GoogleSheetsService } = require('./services/google-sheets.service');
const { WhatsAppService } = require('./services/whatsapp.service');
const { logger } = require('./utils/logger');

class AutomationOrchestrator {
    constructor() {
        this.services = {
            jobAggregator: new JobAggregator(),
            learningTracker: new LearningTracker(),
            githubTracker: new GitHubActivityTracker(),
            ciClassifier: new CIFailureClassifier(),
            sheets: new GoogleSheetsService(),
            whatsapp: new WhatsAppService()
        };
    }

    async runDailyAutomation() {
        try {
            logger.info('Starting daily automation suite...');
            
            const results = {
                startTime: new Date().toISOString(),
                jobs: null,
                learning: null,
                github: null,
                errors: [],
                kpis: {}
            };

            // Run job aggregation
            try {
                logger.info('Running job aggregation...');
                await this.services.jobAggregator.run();
                results.jobs = 'completed';
            } catch (error) {
                logger.error('Job aggregation failed:', error);
                results.errors.push({ component: 'jobAggregation', error: error.message });
                results.jobs = 'failed';
            }

            // Run learning plan check
            try {
                logger.info('Running learning plan check...');
                await this.services.learningTracker.run();
                results.learning = 'completed';
            } catch (error) {
                logger.error('Learning tracker failed:', error);
                results.errors.push({ component: 'learningTracker', error: error.message });
                results.learning = 'failed';
            }

            // Run GitHub activity tracking (if there's recent activity)
            try {
                logger.info('Running GitHub activity tracking...');
                await this.services.githubTracker.run();
                results.github = 'completed';
            } catch (error) {
                logger.error('GitHub tracker failed:', error);
                results.errors.push({ component: 'githubTracker', error: error.message });
                results.github = 'failed';
            }

            // Update KPIs
            try {
                results.kpis = await this.updateDailyKPIs();
            } catch (error) {
                logger.error('KPI update failed:', error);
                results.errors.push({ component: 'kpiUpdate', error: error.message });
            }

            // Send daily summary
            await this.sendDailySummary(results);

            results.endTime = new Date().toISOString();
            results.duration = new Date(results.endTime) - new Date(results.startTime);

            logger.info('Daily automation suite completed', results);
            return results;

        } catch (error) {
            logger.error('Daily automation suite failed:', error);
            await this.services.whatsapp.sendErrorNotification(error, 'DailyAutomation');
            throw error;
        }
    }

    async handleCIFailure(workflowRunId) {
        try {
            logger.info(`Handling CI failure for workflow run ${workflowRunId}`);
            
            const classification = await this.services.ciClassifier.classifyFailure(workflowRunId);
            
            if (classification) {
                // Update failure KPIs
                await this.services.sheets.updateKPI('ci_failures_today', 1);
                await this.services.sheets.updateKPI('last_failure_type', classification.classification.primaryRootCause);
                
                logger.info('CI failure handled successfully');
                return classification;
            }

            return null;

        } catch (error) {
            logger.error('CI failure handling failed:', error);
            await this.services.whatsapp.sendErrorNotification(error, 'CIFailureHandler');
            throw error;
        }
    }

    async runWeeklyAnalysis() {
        try {
            logger.info('Running weekly analysis...');

            const weeklyData = {
                jobApplications: await this.getWeeklyJobApplications(),
                learningMinutes: await this.getWeeklyLearningMinutes(),
                githubActivity: await this.getWeeklyGitHubActivity(),
                socialMediaPosts: await this.getWeeklySocialMediaPosts(),
                ciReliability: await this.getWeeklyCIReliability()
            };

            const analysis = this.analyzeWeeklyTrends(weeklyData);
            const recommendations = this.generateWeeklyRecommendations(analysis);

            await this.sendWeeklyReport(weeklyData, analysis, recommendations);

            logger.info('Weekly analysis completed');
            return { weeklyData, analysis, recommendations };

        } catch (error) {
            logger.error('Weekly analysis failed:', error);
            throw error;
        }
    }

    async updateDailyKPIs() {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Applications today
            const applications = await this.countTodaysApplications();
            await this.services.sheets.updateKPI('applications_today', applications);

            // Learning minutes today
            const learningProgress = await this.services.sheets.getTodaysLearningProgress();
            await this.services.sheets.updateKPI('learning_minutes_today', learningProgress.minutesCompleted || 0);

            // GitHub commits today
            const commits = await this.countTodaysCommits();
            await this.services.sheets.updateKPI('commits_today', commits);

            // Active job opportunities
            const activeJobs = await this.countActiveJobs();
            await this.services.sheets.updateKPI('active_opportunities', activeJobs);

            return {
                applications,
                learningMinutes: learningProgress.minutesCompleted || 0,
                commits,
                activeJobs,
                updatedAt: new Date().toISOString()
            };

        } catch (error) {
            logger.error('Failed to update daily KPIs:', error);
            throw error;
        }
    }

    async sendDailySummary(results) {
        try {
            const summary = `📊 *Daily Automation Summary*

⏰ *Completed:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

✅ *Results:*
• Job Aggregation: ${results.jobs}
• Learning Tracker: ${results.learning}  
• GitHub Activity: ${results.github}

📈 *Daily KPIs:*
• Applications: ${results.kpis.applications || 0}
• Learning: ${results.kpis.learningMinutes || 0} minutes
• Commits: ${results.kpis.commits || 0}
• Opportunities: ${results.kpis.activeJobs || 0}

${results.errors.length > 0 ? `⚠️ *Errors:* ${results.errors.length} components failed` : '🎉 *All systems operational!*'}

Duration: ${Math.round(results.duration / 1000)}s`;

            await this.services.whatsapp.sendMessage(summary);
            logger.info('Daily summary sent');

        } catch (error) {
            logger.error('Failed to send daily summary:', error);
        }
    }

    async sendWeeklyReport(data, analysis, recommendations) {
        try {
            const report = `📊 *Weekly Career Automation Report*

📅 *Week Ending:* ${new Date().toLocaleDateString('en-IN')}

🎯 *Key Metrics:*
• Job Applications: ${data.jobApplications}
• Learning Hours: ${Math.round(data.learningMinutes / 60 * 10) / 10}h
• GitHub Activity: ${data.githubActivity} events
• Social Posts: ${data.socialMediaPosts}
• CI Reliability: ${data.ciReliability}%

📈 *Trends:*
${analysis.trends.map(trend => `• ${trend}`).join('\n')}

💡 *Recommendations:*
${recommendations.map(rec => `• ${rec}`).join('\n')}

🚀 *Next Week Focus:*
Continue building momentum in biotech career development!`;

            await this.services.whatsapp.sendMessage(report);
            logger.info('Weekly report sent');

        } catch (error) {
            logger.error('Failed to send weekly report:', error);
        }
    }

    // Helper methods for data collection
    async countTodaysApplications() {
        // This would query the applications log in Google Sheets
        return 0; // Placeholder
    }

    async countTodaysCommits() {
        // This would use GitHub API to count today's commits
        return 0; // Placeholder
    }

    async countActiveJobs() {
        // This would count jobs with status 'new' or 'applied' 
        return 0; // Placeholder
    }

    async getWeeklyJobApplications() {
        return 12; // Placeholder
    }

    async getWeeklyLearningMinutes() {
        return 180; // Placeholder - 3 hours
    }

    async getWeeklyGitHubActivity() {
        return 25; // Placeholder
    }

    async getWeeklySocialMediaPosts() {
        return 4; // Placeholder
    }

    async getWeeklyCIReliability() {
        return 95; // Placeholder - 95% success rate
    }

    analyzeWeeklyTrends(data) {
        const trends = [];
        
        if (data.jobApplications > 10) {
            trends.push('Strong job application activity');
        }
        
        if (data.learningMinutes > 150) {
            trends.push('Consistent learning progress');
        }
        
        if (data.githubActivity > 20) {
            trends.push('Active development and portfolio building');
        }

        return { trends };
    }

    generateWeeklyRecommendations(analysis) {
        const recommendations = [
            'Continue daily automation for consistent progress',
            'Focus on high-match job opportunities',
            'Maintain learning streak for skill development'
        ];

        return recommendations;
    }

    // Health check for all services
    async healthCheck() {
        try {
            const checks = await Promise.allSettled([
                this.services.sheets.healthCheck?.() || Promise.resolve('unknown'),
                this.services.whatsapp.healthCheck?.() || Promise.resolve('unknown')
            ]);

            return {
                sheets: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
                whatsapp: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error('Health check failed:', error);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

// CLI interface
if (require.main === module) {
    const orchestrator = new AutomationOrchestrator();
    const command = process.argv[2];

    switch (command) {
        case 'daily':
            orchestrator.runDailyAutomation()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;

        case 'weekly':
            orchestrator.runWeeklyAnalysis()
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;

        case 'ci-failure':
            const workflowRunId = process.argv[3];
            if (!workflowRunId) {
                console.error('Usage: node main.js ci-failure <workflow_run_id>');
                process.exit(1);
            }
            orchestrator.handleCIFailure(workflowRunId)
                .then(() => process.exit(0))
                .catch(() => process.exit(1));
            break;

        case 'health':
            orchestrator.healthCheck()
                .then(result => {
                    console.log(JSON.stringify(result, null, 2));
                    process.exit(0);
                })
                .catch(() => process.exit(1));
            break;

        default:
            console.error('Usage: node main.js [daily|weekly|ci-failure|health]');
            process.exit(1);
    }
}

module.exports = { AutomationOrchestrator };