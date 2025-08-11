/**
 * Calendar Service
 * Handles Google Calendar integration for learning blocks and scheduling
 */

const { google } = require('googleapis');
const { logger } = require('../utils/logger');
const { withRetry } = require('../utils/retry');

class CalendarService {
    constructor() {
        this.credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
        this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
        
        this.auth = null;
        this.calendar = null;
        
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            this.auth = new google.auth.GoogleAuth({
                credentials: this.credentials,
                scopes: ['https://www.googleapis.com/auth/calendar']
            });
            
            this.calendar = google.calendar({ version: 'v3', auth: this.auth });
            logger.info('Google Calendar service initialized');
        } catch (error) {
            logger.error('Failed to initialize Google Calendar service:', error);
            throw error;
        }
    }

    async createEvent(eventData) {
        try {
            const event = {
                summary: eventData.title,
                description: eventData.description,
                location: eventData.location,
                start: {
                    dateTime: eventData.startTime,
                    timeZone: 'Asia/Kolkata'
                },
                end: {
                    dateTime: eventData.endTime,
                    timeZone: 'Asia/Kolkata'
                },
                reminders: {
                    useDefault: false,
                    overrides: eventData.reminders || [
                        { method: 'popup', minutes: 10 }
                    ]
                },
                colorId: '2' // Green color for learning events
            };

            const response = await withRetry(
                () => this.calendar.events.insert({
                    calendarId: this.calendarId,
                    resource: event
                }),
                3,
                'Creating calendar event'
            );

            logger.info(`Calendar event created: ${eventData.title}`, {
                eventId: response.data.id,
                startTime: eventData.startTime
            });

            return response.data;
        } catch (error) {
            logger.error('Failed to create calendar event:', error);
            throw error;
        }
    }

    async createLearningBlock(task, startTime) {
        const endTime = new Date(new Date(startTime).getTime() + task.duration * 60000);
        
        return await this.createEvent({
            title: `🧬 ${task.title}`,
            description: this.formatLearningDescription(task),
            location: 'Learning Session',
            startTime: startTime,
            endTime: endTime.toISOString(),
            reminders: [
                { method: 'popup', minutes: 10 },
                { method: 'email', minutes: 30 }
            ]
        });
    }

    formatLearningDescription(task) {
        return `${task.description}

📚 Resources:
${task.resources.map(r => `• ${r}`).join('\n')}

🎯 Learning Goals:
• ${task.type.charAt(0).toUpperCase() + task.type.slice(1)} practice
• Skill development for biotech career
• ${task.weeklyFocus}

⭐ Difficulty: ${task.difficulty}
⏱️ Duration: ${task.duration} minutes

#LearningPlan #Biotech #Career`;
    }

    async createJobApplicationReminder(job, followUpDate) {
        const followUpTime = new Date(followUpDate);
        
        return await this.createEvent({
            title: `📋 Follow up: ${job.title} at ${job.company}`,
            description: `Follow up on job application:

🏢 Company: ${job.company}
💼 Position: ${job.title}
📍 Location: ${job.location}
🔗 URL: ${job.url}

📝 Action Items:
• Check application status
• Send follow-up email if no response
• Connect with hiring manager on LinkedIn
• Update tracking sheet`,
            startTime: followUpTime.toISOString(),
            endTime: new Date(followUpTime.getTime() + 30 * 60000).toISOString(), // 30 min event
            reminders: [
                { method: 'popup', minutes: 15 },
                { method: 'email', minutes: 60 }
            ]
        });
    }

    async createInterviewReminder(interview) {
        const interviewTime = new Date(interview.dateTime);
        const prepTime = new Date(interviewTime.getTime() - 60 * 60000); // 1 hour before

        // Create prep reminder
        await this.createEvent({
            title: `🎯 Interview Prep: ${interview.company}`,
            description: `Interview preparation session:

💼 Position: ${interview.position}
🏢 Company: ${interview.company}
👥 Interviewer: ${interview.interviewer || 'TBD'}
📱 Type: ${interview.type || 'Unknown'}

📋 Preparation Checklist:
• Review company background
• Practice technical questions
• Prepare STAR method examples
• Test video call setup (if virtual)
• Print resume copies
• Plan route/logistics`,
            startTime: prepTime.toISOString(),
            endTime: interviewTime.toISOString(),
            reminders: [
                { method: 'popup', minutes: 30 }
            ]
        });

        // Create actual interview event
        return await this.createEvent({
            title: `🎤 Interview: ${interview.position} - ${interview.company}`,
            description: `Job Interview:

💼 Position: ${interview.position}
🏢 Company: ${interview.company}
👥 Interviewer: ${interview.interviewer || 'TBD'}
📱 Type: ${interview.type || 'Unknown'}
📍 Location: ${interview.location || 'TBD'}
🔗 Meeting Link: ${interview.meetingLink || 'TBD'}

💡 Key Points to Remember:
• Highlight bioinformatics skills
• Mention Python/SQL experience
• Discuss portfolio projects
• Ask about growth opportunities
• Follow up within 24 hours`,
            startTime: interview.dateTime,
            endTime: new Date(new Date(interview.dateTime).getTime() + (interview.duration || 60) * 60000).toISOString(),
            reminders: [
                { method: 'popup', minutes: 15 },
                { method: 'email', minutes: 60 }
            ]
        });
    }

    async getUpcomingEvents(days = 7) {
        try {
            const timeMin = new Date().toISOString();
            const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

            const response = await this.calendar.events.list({
                calendarId: this.calendarId,
                timeMin: timeMin,
                timeMax: timeMax,
                singleEvents: true,
                orderBy: 'startTime'
            });

            return response.data.items || [];
        } catch (error) {
            logger.error('Failed to get upcoming events:', error);
            throw error;
        }
    }

    async updateEvent(eventId, updates) {
        try {
            const response = await this.calendar.events.patch({
                calendarId: this.calendarId,
                eventId: eventId,
                resource: updates
            });

            logger.info(`Calendar event updated: ${eventId}`);
            return response.data;
        } catch (error) {
            logger.error(`Failed to update calendar event ${eventId}:`, error);
            throw error;
        }
    }

    async deleteEvent(eventId) {
        try {
            await this.calendar.events.delete({
                calendarId: this.calendarId,
                eventId: eventId
            });

            logger.info(`Calendar event deleted: ${eventId}`);
        } catch (error) {
            logger.error(`Failed to delete calendar event ${eventId}:`, error);
            throw error;
        }
    }

    // Health check method
    async healthCheck() {
        try {
            const response = await this.calendar.calendars.get({
                calendarId: this.calendarId
            });

            logger.info('Calendar service health check passed');
            return {
                status: 'healthy',
                calendarName: response.data.summary,
                timeZone: response.data.timeZone
            };
        } catch (error) {
            logger.error('Calendar service health check failed:', error);
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
}

module.exports = { CalendarService };