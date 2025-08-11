#!/usr/bin/env node

/**
 * Learning Plan Tracker
 * Tracks 16-week learning plan, proposes micro-tasks for gaps, creates calendar blocks
 */

const { GoogleSheetsService } = require('./services/google-sheets.service');
const { WhatsAppService } = require('./services/whatsapp.service');
const { CalendarService } = require('./services/calendar.service');
const { logger } = require('./utils/logger');
const { withRetry } = require('./utils/retry');

class LearningTracker {
    constructor() {
        this.sheetsService = new GoogleSheetsService();
        this.whatsappService = new WhatsAppService();
        this.calendarService = new CalendarService();
        this.approvalTimeout = 15 * 60 * 1000; // 15 minutes
        this.targetDailyMinutes = 30;
    }

    async run() {
        try {
            logger.info('Starting learning plan check...');
            
            // Step 1: Get today's learning progress
            const todaysProgress = await withRetry(
                () => this.sheetsService.getTodaysLearningProgress(),
                3,
                'Getting learning progress'
            );

            // Step 2: Check if daily gap > 30 min
            const gapMinutes = this.targetDailyMinutes - (todaysProgress.minutesCompleted || 0);
            
            if (gapMinutes > 0) {
                logger.info(`Daily learning gap detected: ${gapMinutes} minutes`);
                
                // Step 3: Propose 3 micro-tasks
                const microTasks = await this.generateMicroTasks(gapMinutes, todaysProgress.currentWeek);
                
                // Step 4: Send WhatsApp proposal and wait for approval
                const proposal = this.generateLearningProposal(gapMinutes, microTasks);
                const approvalMessage = await this.whatsappService.sendAndWaitForApproval(
                    proposal,
                    this.approvalTimeout
                );

                if (approvalMessage && approvalMessage.toLowerCase().includes('approve')) {
                    logger.info('Approval received, creating calendar blocks...');
                    await this.createCalendarBlocks(microTasks);
                    await this.updateLearningProgress(microTasks);
                } else {
                    logger.info('No approval received within timeout, skipping calendar creation');
                }
            } else {
                logger.info('Daily learning target already met');
                await this.sendProgressUpdate(todaysProgress);
            }

            // Step 5: Weekly progress check
            if (todaysProgress.isWeekEnd) {
                await this.sendWeeklyProgressReport(todaysProgress);
            }

        } catch (error) {
            logger.error('Learning tracker failed:', error);
            await this.logError(error);
            throw error;
        }
    }

    async generateMicroTasks(gapMinutes, currentWeek) {
        const tasks = [
            {
                id: 'task_' + Date.now() + '_1',
                title: 'Python Bioinformatics Practice',
                duration: Math.min(30, Math.ceil(gapMinutes / 3)),
                type: 'coding',
                description: 'Practice Python coding for bioinformatics analysis',
                resources: ['BioPython tutorial', 'Pandas documentation'],
                difficulty: 'beginner'
            },
            {
                id: 'task_' + Date.now() + '_2',
                title: 'Biotech Industry Reading',
                duration: Math.min(30, Math.ceil(gapMinutes / 3)),
                type: 'reading',
                description: 'Read latest articles on pharmaceutical research',
                resources: ['Nature Biotechnology', 'BioPharma Jobs blog'],
                difficulty: 'intermediate'
            },
            {
                id: 'task_' + Date.now() + '_3',
                title: 'SQL Database Practice',
                duration: Math.min(30, Math.ceil(gapMinutes / 3)),
                type: 'practical',
                description: 'Practice SQL queries for biological databases',
                resources: ['SQLBolt exercises', 'UniProt SQL tutorial'],
                difficulty: 'beginner'
            }
        ];

        // Customize tasks based on current week
        return this.customizeTasksForWeek(tasks, currentWeek);
    }

    customizeTasksForWeek(tasks, week) {
        const weeklyFocus = {
            1: 'Python Basics',
            2: 'Data Analysis Fundamentals',
            3: 'BioPython Introduction',
            4: 'SQL for Biology',
            5: 'Statistics Review',
            6: 'Machine Learning Basics',
            7: 'Genomics Analysis',
            8: 'Protein Structure Analysis',
            9: 'Drug Discovery Basics',
            10: 'Clinical Data Analysis',
            11: 'Biostatistics',
            12: 'Research Methods',
            13: 'Industry Applications',
            14: 'Portfolio Development',
            15: 'Interview Preparation',
            16: 'Job Application Strategy'
        };

        const focus = weeklyFocus[week] || 'General Skills';
        
        return tasks.map(task => ({
            ...task,
            weeklyFocus: focus,
            customizedFor: `Week ${week}: ${focus}`
        }));
    }

    generateLearningProposal(gapMinutes, microTasks) {
        return `📚 *Learning Gap Alert*

🎯 *Today's Target:* ${this.targetDailyMinutes} minutes
⏰ *Remaining:* ${gapMinutes} minutes

🔥 *Proposed Micro-Tasks:*

${microTasks.map((task, index) => `
*${index + 1}. ${task.title}* (${task.duration} min)
${task.description}
📖 Resources: ${task.resources.join(', ')}
🎚️ Level: ${task.difficulty}
`).join('\n')}

✨ *Benefits:*
• Stay on track with 16-week learning plan
• Build consistent learning habits
• Advance biotech career skills

React with "Approve" to create calendar blocks or ignore to skip.`;
    }

    async createCalendarBlocks(microTasks) {
        const now = new Date();
        let startTime = new Date(now.getTime() + 30 * 60000); // Start 30 minutes from now

        for (const task of microTasks) {
            const endTime = new Date(startTime.getTime() + task.duration * 60000);
            
            try {
                await withRetry(
                    () => this.calendarService.createEvent({
                        title: `🧬 ${task.title}`,
                        description: `${task.description}\n\nResources:\n${task.resources.map(r => `• ${r}`).join('\n')}\n\nWeekly Focus: ${task.weeklyFocus}`,
                        startTime: startTime.toISOString(),
                        endTime: endTime.toISOString(),
                        location: 'Learning Session',
                        reminders: [
                            { method: 'popup', minutes: 10 },
                            { method: 'email', minutes: 30 }
                        ]
                    }),
                    3,
                    `Creating calendar event for ${task.title}`
                );

                logger.info(`Created calendar block: ${task.title} (${task.duration} min)`);
                
                // Next task starts 15 minutes after this one ends (buffer time)
                startTime = new Date(endTime.getTime() + 15 * 60000);
                
            } catch (error) {
                logger.error(`Failed to create calendar event for ${task.title}:`, error);
            }
        }
    }

    async updateLearningProgress(microTasks) {
        const totalMinutes = microTasks.reduce((sum, task) => sum + task.duration, 0);
        
        const progressUpdate = {
            date: new Date().toISOString().split('T')[0],
            plannedMinutes: totalMinutes,
            tasksScheduled: microTasks.length,
            status: 'scheduled',
            tasks: microTasks.map(task => ({
                id: task.id,
                title: task.title,
                duration: task.duration,
                type: task.type
            }))
        };

        await withRetry(
            () => this.sheetsService.updateLearningProgress(progressUpdate),
            3,
            'Updating learning progress'
        );

        logger.info(`Updated learning progress: ${totalMinutes} minutes scheduled`);
    }

    async sendProgressUpdate(todaysProgress) {
        const message = `✅ *Learning Target Achieved*

🎯 *Today's Progress:*
• Target: ${this.targetDailyMinutes} minutes
• Completed: ${todaysProgress.minutesCompleted} minutes
• Status: ${todaysProgress.minutesCompleted >= this.targetDailyMinutes ? 'Target Met! 🎉' : 'In Progress'}

📊 *Week ${todaysProgress.currentWeek} Summary:*
• Total Hours: ${Math.round(todaysProgress.weeklyMinutes / 60 * 10) / 10}h
• Completion Rate: ${Math.round(todaysProgress.completionRate * 100)}%
• Streak: ${todaysProgress.currentStreak} days

Keep up the great work! 💪`;

        await this.whatsappService.sendMessage(message);
    }

    async sendWeeklyProgressReport(progress) {
        const weeklyReport = `📊 *Week ${progress.currentWeek} Learning Report*

🎯 *Weekly Summary:*
• Total Learning Time: ${Math.round(progress.weeklyMinutes / 60 * 10) / 10} hours
• Daily Average: ${Math.round(progress.weeklyMinutes / 7)} minutes
• Target Achievement: ${Math.round(progress.weeklyCompletionRate * 100)}%
• Learning Streak: ${progress.currentStreak} days

📚 *Skills Developed:*
${progress.skillsLearned.map(skill => `• ${skill}`).join('\n')}

🚀 *Next Week Focus:*
• ${progress.nextWeekFocus}
• Estimated Time: ${progress.nextWeekEstimatedHours} hours
• Key Milestones: ${progress.nextWeekMilestones.join(', ')}

🏆 *16-Week Progress:*
• Weeks Completed: ${progress.currentWeek}/16
• Overall Progress: ${Math.round(progress.overallProgress * 100)}%
• Time Invested: ${Math.round(progress.totalMinutes / 60)} hours

${progress.currentWeek >= 16 ? '🎉 Congratulations! Learning plan completed!' : 'Keep going strong! 💪'}`;

        await this.whatsappService.sendMessage(weeklyReport);
    }

    async logError(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            component: 'LearningTracker',
            error: error.message,
            stack: error.stack
        };

        await this.sheetsService.logError(errorLog);
    }
}

// Run if called directly
if (require.main === module) {
    const tracker = new LearningTracker();
    tracker.run()
        .then(() => {
            logger.info('Learning tracker completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Learning tracker failed:', error);
            process.exit(1);
        });
}

module.exports = { LearningTracker };