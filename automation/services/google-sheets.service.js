/**
 * Google Sheets API Service
 * Handles reading/writing data to Google Sheets for job tracking, learning progress, and KPIs
 */

const { google } = require('googleapis');
const { logger } = require('../utils/logger');
const { withRetry } = require('../utils/retry');

class GoogleSheetsService {
    constructor() {
        this.credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
        this.jobTrackingSheetId = process.env.GOOGLE_SHEETS_JOB_TRACKING_ID;
        this.learningSheetId = process.env.GOOGLE_SHEETS_LEARNING_ID;
        this.kpiSheetId = process.env.GOOGLE_SHEETS_KPI_ID;
        
        this.auth = null;
        this.sheets = null;
        
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            this.auth = new google.auth.GoogleAuth({
                credentials: this.credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
            
            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
            logger.info('Google Sheets service initialized');
        } catch (error) {
            logger.error('Failed to initialize Google Sheets service:', error);
            throw error;
        }
    }

    async writeJobs(jobs) {
        if (!jobs || jobs.length === 0) {
            logger.info('No jobs to write');
            return;
        }

        const values = jobs.map(job => [
            job.id,
            job.title,
            job.company,
            job.location,
            job.salary || 'Not specified',
            job.description || '',
            job.url || '',
            job.source,
            job.aggregatedAt,
            job.status,
            job.matchScore || 0,
            job.keywords ? job.keywords.join(', ') : ''
        ]);

        // Add header row if this is the first write
        const headerRow = [
            'Job ID', 'Title', 'Company', 'Location', 'Salary', 
            'Description', 'URL', 'Source', 'Aggregated At', 'Status', 
            'Match Score', 'Keywords'
        ];

        try {
            // Check if sheet exists and has headers
            const existingData = await this.getSheetData(this.jobTrackingSheetId, 'Jobs!A1:L1');
            
            if (!existingData || existingData.length === 0) {
                // Sheet is empty, add headers
                await this.appendToSheet(this.jobTrackingSheetId, 'Jobs!A1', [headerRow]);
            }

            // Append job data
            await withRetry(
                () => this.appendToSheet(this.jobTrackingSheetId, 'Jobs!A:L', values),
                3,
                'Writing jobs to sheet'
            );

            logger.info(`Successfully wrote ${jobs.length} jobs to Google Sheets`);
        } catch (error) {
            logger.error('Failed to write jobs to Google Sheets:', error);
            throw error;
        }
    }

    async updateJobStatus(jobId, status) {
        try {
            // Find the row with the job ID
            const range = 'Jobs!A:A';
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.jobTrackingSheetId,
                range: range
            });

            const rows = response.data.values || [];
            const rowIndex = rows.findIndex(row => row[0] === jobId);

            if (rowIndex === -1) {
                logger.warn(`Job ID ${jobId} not found in sheet`);
                return;
            }

            // Update status column (column J = index 9)
            const updateRange = `Jobs!J${rowIndex + 1}`;
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.jobTrackingSheetId,
                range: updateRange,
                valueInputOption: 'RAW',
                resource: {
                    values: [[status]]
                }
            });

            logger.info(`Updated job ${jobId} status to ${status}`);
        } catch (error) {
            logger.error(`Failed to update job status for ${jobId}:`, error);
            throw error;
        }
    }

    async getTodaysLearningProgress() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const range = 'Learning!A:H';
            
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.learningSheetId,
                range: range
            });

            const rows = response.data.values || [];
            const todayRow = rows.find(row => row[0] === today);

            if (!todayRow) {
                return {
                    date: today,
                    minutesCompleted: 0,
                    currentWeek: this.getCurrentWeek(),
                    isWeekEnd: this.isWeekEnd(),
                    weeklyMinutes: 0,
                    completionRate: 0,
                    currentStreak: 0
                };
            }

            return {
                date: todayRow[0],
                minutesCompleted: parseInt(todayRow[1]) || 0,
                currentWeek: parseInt(todayRow[2]) || this.getCurrentWeek(),
                isWeekEnd: todayRow[3] === 'true',
                weeklyMinutes: parseInt(todayRow[4]) || 0,
                completionRate: parseFloat(todayRow[5]) || 0,
                currentStreak: parseInt(todayRow[6]) || 0,
                skillsLearned: todayRow[7] ? todayRow[7].split(',') : []
            };
        } catch (error) {
            logger.error('Failed to get learning progress:', error);
            throw error;
        }
    }

    async updateLearningProgress(progressUpdate) {
        try {
            const values = [[
                progressUpdate.date,
                progressUpdate.plannedMinutes,
                progressUpdate.currentWeek || this.getCurrentWeek(),
                progressUpdate.isWeekEnd || false,
                progressUpdate.weeklyMinutes || 0,
                progressUpdate.completionRate || 0,
                progressUpdate.currentStreak || 0,
                progressUpdate.skills ? progressUpdate.skills.join(',') : '',
                progressUpdate.status,
                JSON.stringify(progressUpdate.tasks || [])
            ]];

            const headerRow = [
                'Date', 'Planned Minutes', 'Week', 'Is Week End', 'Weekly Minutes',
                'Completion Rate', 'Current Streak', 'Skills Learned', 'Status', 'Tasks'
            ];

            // Check if sheet exists and has headers
            const existingData = await this.getSheetData(this.learningSheetId, 'Learning!A1:J1');
            
            if (!existingData || existingData.length === 0) {
                await this.appendToSheet(this.learningSheetId, 'Learning!A1', [headerRow]);
            }

            await withRetry(
                () => this.appendToSheet(this.learningSheetId, 'Learning!A:J', values),
                3,
                'Updating learning progress'
            );

            logger.info('Learning progress updated successfully');
        } catch (error) {
            logger.error('Failed to update learning progress:', error);
            throw error;
        }
    }

    async logResult(result) {
        try {
            const values = [[
                result.timestamp,
                'JobAggregation',
                result.jobCount,
                result.status,
                result.error || ''
            ]];

            await this.appendToSheet(this.jobTrackingSheetId, 'Results!A:E', values);
            logger.info('Result logged successfully');
        } catch (error) {
            logger.error('Failed to log result:', error);
        }
    }

    async logApplication(application) {
        try {
            const values = [[
                application.timestamp,
                application.jobId,
                application.company,
                application.title,
                application.source,
                application.status
            ]];

            await this.appendToSheet(this.jobTrackingSheetId, 'Applications!A:F', values);
            logger.info('Application logged successfully');
        } catch (error) {
            logger.error('Failed to log application:', error);
        }
    }

    async logError(errorLog) {
        try {
            const values = [[
                errorLog.timestamp,
                errorLog.component,
                errorLog.error,
                errorLog.stack || ''
            ]];

            await this.appendToSheet(this.jobTrackingSheetId, 'Errors!A:D', values);
            logger.info('Error logged successfully');
        } catch (error) {
            logger.error('Failed to log error:', error);
        }
    }

    async getKPIs() {
        try {
            const range = 'KPIs!A:E';
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.kpiSheetId,
                range: range
            });

            const rows = response.data.values || [];
            const kpis = {};

            rows.forEach(row => {
                if (row[0] && row[1]) {
                    kpis[row[0]] = {
                        value: row[1],
                        target: row[2] || null,
                        lastUpdated: row[3] || null,
                        trend: row[4] || 'stable'
                    };
                }
            });

            return kpis;
        } catch (error) {
            logger.error('Failed to get KPIs:', error);
            throw error;
        }
    }

    async updateKPI(name, value, target = null) {
        try {
            const timestamp = new Date().toISOString();
            const values = [[name, value, target, timestamp, 'updated']];

            await this.appendToSheet(this.kpiSheetId, 'KPIs!A:E', values);
            logger.info(`KPI updated: ${name} = ${value}`);
        } catch (error) {
            logger.error(`Failed to update KPI ${name}:`, error);
        }
    }

    // Helper methods
    async getSheetData(spreadsheetId, range) {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: range
            });
            return response.data.values;
        } catch (error) {
            if (error.code === 404) {
                return null; // Sheet doesn't exist
            }
            throw error;
        }
    }

    async appendToSheet(spreadsheetId, range, values) {
        return await this.sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });
    }

    getCurrentWeek() {
        // Calculate current week based on learning plan start date
        const startDate = new Date(process.env.LEARNING_PLAN_START_DATE || '2024-01-01');
        const currentDate = new Date();
        const diffTime = currentDate.getTime() - startDate.getTime();
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
        return Math.min(diffWeeks, 16);
    }

    isWeekEnd() {
        return new Date().getDay() === 0; // Sunday
    }
}

module.exports = { GoogleSheetsService };