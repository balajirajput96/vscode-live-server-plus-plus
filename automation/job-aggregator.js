#!/usr/bin/env node

/**
 * Job Aggregation and Deduplication Service
 * Aggregates QC/Lab/Bioinformatics jobs daily, writes to Google Sheets, sends WhatsApp summary
 */

const { GoogleSheetsService } = require('./services/google-sheets.service');
const { WhatsAppService } = require('./services/whatsapp.service');
const { JobScrapingService } = require('./services/job-scraping.service');
const { logger } = require('./utils/logger');
const { withRetry } = require('./utils/retry');

class JobAggregator {
    constructor() {
        this.sheetsService = new GoogleSheetsService();
        this.whatsappService = new WhatsAppService();
        this.jobScrapingService = new JobScrapingService();
        this.approvalTimeout = 15 * 60 * 1000; // 15 minutes
    }

    async run() {
        try {
            logger.info('Starting daily job aggregation...');
            
            // Step 1: Aggregate jobs from various sources
            const aggregatedJobs = await withRetry(
                () => this.aggregateJobs(),
                3,
                'Job aggregation'
            );

            // Step 2: Deduplicate jobs
            const uniqueJobs = await this.deduplicateJobs(aggregatedJobs);
            
            // Step 3: Write to Google Sheets
            await withRetry(
                () => this.sheetsService.writeJobs(uniqueJobs),
                3,
                'Writing jobs to Google Sheets'
            );

            // Step 4: Send WhatsApp summary and wait for approval
            const summary = this.generateJobSummary(uniqueJobs);
            const approvalMessage = await this.whatsappService.sendAndWaitForApproval(
                summary,
                this.approvalTimeout
            );

            if (approvalMessage && approvalMessage.toLowerCase().includes('approve')) {
                logger.info('Approval received, proceeding with auto-apply steps...');
                await this.proceedWithAutoApply(uniqueJobs);
            } else {
                logger.info('No approval received within timeout, skipping auto-apply');
            }

            // Step 5: Log results
            await this.logResults(uniqueJobs.length, approvalMessage ? 'approved' : 'timeout');
            
        } catch (error) {
            logger.error('Job aggregation failed:', error);
            await this.logResults(0, 'failed', error.message);
            throw error;
        }
    }

    async aggregateJobs() {
        const sources = [
            { name: 'Naukri', method: () => this.jobScrapingService.scrapeNaukri() },
            { name: 'LinkedIn', method: () => this.jobScrapingService.scrapeLinkedIn() },
            { name: 'Indeed', method: () => this.jobScrapingService.scrapeIndeed() },
            { name: 'Company Sites', method: () => this.jobScrapingService.scrapeCompanySites() }
        ];

        const allJobs = [];
        
        for (const source of sources) {
            try {
                logger.info(`Scraping jobs from ${source.name}...`);
                const jobs = await withRetry(source.method, 3, `${source.name} scraping`);
                allJobs.push(...jobs.map(job => ({ ...job, source: source.name })));
                logger.info(`Found ${jobs.length} jobs from ${source.name}`);
            } catch (error) {
                logger.error(`Failed to scrape ${source.name}:`, error);
                // Continue with other sources
            }
        }

        return allJobs;
    }

    async deduplicateJobs(jobs) {
        const seen = new Set();
        const uniqueJobs = [];

        for (const job of jobs) {
            // Create a unique key based on company, title, and location
            const key = `${job.company?.toLowerCase()}-${job.title?.toLowerCase()}-${job.location?.toLowerCase()}`;
            
            if (!seen.has(key)) {
                seen.add(key);
                uniqueJobs.push({
                    ...job,
                    id: this.generateJobId(),
                    aggregatedAt: new Date().toISOString(),
                    status: 'new'
                });
            }
        }

        logger.info(`Deduplicated ${jobs.length} jobs to ${uniqueJobs.length} unique jobs`);
        return uniqueJobs;
    }

    generateJobSummary(jobs) {
        const totalJobs = jobs.length;
        const companies = [...new Set(jobs.map(job => job.company))].length;
        const topCompanies = this.getTopCompanies(jobs);
        const jobTypes = this.getJobTypeBreakdown(jobs);

        return `🚀 *Daily Job Report*

📊 *Summary:*
• Total Jobs: ${totalJobs}
• Unique Companies: ${companies}
• QC/Lab Jobs: ${jobTypes.qc}
• Bioinformatics Jobs: ${jobTypes.bioinfo}
• Data Analysis Jobs: ${jobTypes.dataAnalysis}

🏢 *Top Companies:*
${topCompanies.map(c => `• ${c.name} (${c.count} jobs)`).join('\n')}

📍 *Top Locations:*
${this.getTopLocations(jobs).map(l => `• ${l.name} (${l.count} jobs)`).join('\n')}

💰 *Salary Range:*
• Average: ${this.calculateAverageSalary(jobs)}
• Range: ${this.getSalaryRange(jobs)}

React with "Approve" to proceed with auto-apply steps or ignore to skip.`;
    }

    getTopCompanies(jobs) {
        const companyCounts = {};
        jobs.forEach(job => {
            const company = job.company || 'Unknown';
            companyCounts[company] = (companyCounts[company] || 0) + 1;
        });

        return Object.entries(companyCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
    }

    getTopLocations(jobs) {
        const locationCounts = {};
        jobs.forEach(job => {
            const location = job.location || 'Unknown';
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        });

        return Object.entries(locationCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
    }

    getJobTypeBreakdown(jobs) {
        const breakdown = { qc: 0, bioinfo: 0, dataAnalysis: 0, other: 0 };
        
        jobs.forEach(job => {
            const title = (job.title || '').toLowerCase();
            if (title.includes('qc') || title.includes('quality control') || title.includes('lab')) {
                breakdown.qc++;
            } else if (title.includes('bioinformatics') || title.includes('computational biology')) {
                breakdown.bioinfo++;
            } else if (title.includes('data analysis') || title.includes('data scientist') || title.includes('analyst')) {
                breakdown.dataAnalysis++;
            } else {
                breakdown.other++;
            }
        });

        return breakdown;
    }

    calculateAverageSalary(jobs) {
        const salaries = jobs.filter(job => job.salary && job.salary > 0).map(job => job.salary);
        if (salaries.length === 0) return 'Not specified';
        
        const average = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
        return `₹${Math.round(average / 1000)}K`;
    }

    getSalaryRange(jobs) {
        const salaries = jobs.filter(job => job.salary && job.salary > 0).map(job => job.salary);
        if (salaries.length === 0) return 'Not specified';
        
        const min = Math.min(...salaries);
        const max = Math.max(...salaries);
        return `₹${Math.round(min / 1000)}K - ₹${Math.round(max / 1000)}K`;
    }

    async proceedWithAutoApply(jobs) {
        logger.info('Starting auto-apply process...');
        
        // Filter jobs for auto-apply (e.g., high match score, preferred companies)
        const autoApplyJobs = jobs.filter(job => this.shouldAutoApply(job));
        
        logger.info(`Selected ${autoApplyJobs.length} jobs for auto-apply`);
        
        for (const job of autoApplyJobs.slice(0, 5)) { // Limit to 5 applications per day
            try {
                await this.autoApplyToJob(job);
                await new Promise(resolve => setTimeout(resolve, 30000)); // 30s delay between applications
            } catch (error) {
                logger.error(`Failed to auto-apply to job ${job.id}:`, error);
            }
        }
    }

    shouldAutoApply(job) {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const description = (job.description || '').toLowerCase();

        // Check for relevant keywords
        const relevantKeywords = ['bioinformatics', 'data analysis', 'python', 'sql', 'biotech', 'pharmaceutical'];
        const hasRelevantKeywords = relevantKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword)
        );

        // Check for preferred companies
        const preferredCompanies = ['sun pharma', 'zydus', 'lupin', 'dr reddy', 'biocon'];
        const isPreferredCompany = preferredCompanies.some(company_name => 
            company.includes(company_name)
        );

        return hasRelevantKeywords && (isPreferredCompany || job.matchScore > 80);
    }

    async autoApplyToJob(job) {
        // This would integrate with job application APIs
        logger.info(`Auto-applying to: ${job.title} at ${job.company}`);
        
        // Update job status in sheets
        await this.sheetsService.updateJobStatus(job.id, 'applied');
        
        // Log application
        await this.logApplication(job);
    }

    async logResults(jobCount, status, error = null) {
        const result = {
            timestamp: new Date().toISOString(),
            jobCount,
            status,
            error
        };

        await this.sheetsService.logResult(result);
        logger.info('Results logged:', result);
    }

    async logApplication(job) {
        const application = {
            timestamp: new Date().toISOString(),
            jobId: job.id,
            company: job.company,
            title: job.title,
            source: job.source,
            status: 'applied'
        };

        await this.sheetsService.logApplication(application);
    }

    generateJobId() {
        return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Run if called directly
if (require.main === module) {
    const aggregator = new JobAggregator();
    aggregator.run()
        .then(() => {
            logger.info('Job aggregation completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('Job aggregation failed:', error);
            process.exit(1);
        });
}

module.exports = { JobAggregator };