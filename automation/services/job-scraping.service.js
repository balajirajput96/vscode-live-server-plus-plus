/**
 * Job Scraping Service
 * Scrapes jobs from various sources including Naukri, LinkedIn, Indeed, and company websites
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { logger } = require('../utils/logger');
const { withRetry } = require('../utils/retry');

class JobScrapingService {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        this.biotechKeywords = [
            'bioinformatics', 'biotech', 'biotechnology', 'pharmaceutical', 'pharma',
            'clinical research', 'data analysis', 'quality control', 'qc analyst',
            'research associate', 'lab analyst', 'biological', 'medical device'
        ];
        this.targetCompanies = [
            'Sun Pharma', 'Zydus', 'Lupin', 'Dr Reddy', 'Biocon', 
            'Cipla', 'Aurobindo', 'Alembic', 'Glenmark', 'Torrent'
        ];
    }

    async scrapeNaukri() {
        try {
            logger.info('Scraping Naukri.com...');
            const jobs = [];
            
            for (const keyword of this.biotechKeywords.slice(0, 3)) { // Limit to avoid rate limiting
                const searchUrl = `https://www.naukri.com/jobs-in-india?k=${encodeURIComponent(keyword)}`;
                const jobsFromKeyword = await this.scrapeNaukriSearch(searchUrl, keyword);
                jobs.push(...jobsFromKeyword);
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const uniqueJobs = this.deduplicateByUrl(jobs);
            logger.info(`Scraped ${uniqueJobs.length} unique jobs from Naukri`);
            return uniqueJobs;
            
        } catch (error) {
            logger.error('Error scraping Naukri:', error);
            return [];
        }
    }

    async scrapeNaukriSearch(url, keyword) {
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': this.userAgent },
                timeout: 30000
            });

            const $ = cheerio.load(response.data);
            const jobs = [];

            $('.jobTuple').each((index, element) => {
                if (index >= 20) return; // Limit results per keyword

                const $job = $(element);
                const title = $job.find('.jobTupleHeader .ellipsis').text().trim();
                const company = $job.find('.jobTupleHeader .subTitle .ellipsis').text().trim();
                const location = $job.find('.jobTupleFooter .fleft .ellipsis').text().trim();
                const experience = $job.find('.jobTupleFooter .fleft .ellipsis').eq(1).text().trim();
                const salary = $job.find('.jobTupleFooter .fleft .ellipsis').eq(2).text().trim();
                const url = 'https://www.naukri.com' + $job.find('.jobTupleHeader .title a').attr('href');

                if (title && company) {
                    jobs.push({
                        title,
                        company,
                        location,
                        experience,
                        salary: this.parseSalary(salary),
                        url,
                        description: '', // Would need additional request to get full description
                        source: 'Naukri',
                        keyword,
                        scrapedAt: new Date().toISOString(),
                        matchScore: this.calculateMatchScore(title, company, keyword)
                    });
                }
            });

            return jobs;
            
        } catch (error) {
            logger.error(`Error scraping Naukri search for ${keyword}:`, error);
            return [];
        }
    }

    async scrapeLinkedIn() {
        try {
            logger.info('Scraping LinkedIn Jobs...');
            // Note: LinkedIn has strict anti-scraping measures
            // In production, this would use LinkedIn API or a specialized service
            
            const jobs = [];
            
            // Simulated job data for demonstration
            const mockJobs = [
                {
                    title: 'Bioinformatics Analyst',
                    company: 'Biocon',
                    location: 'Bangalore',
                    salary: 600000,
                    url: 'https://linkedin.com/jobs/mock-1',
                    description: 'Analyze genomic data using Python and R',
                    source: 'LinkedIn',
                    scrapedAt: new Date().toISOString(),
                    matchScore: 85
                },
                {
                    title: 'Data Scientist - Pharma',
                    company: 'Dr Reddy\'s',
                    location: 'Hyderabad',
                    salary: 800000,
                    url: 'https://linkedin.com/jobs/mock-2',
                    description: 'Machine learning for drug discovery',
                    source: 'LinkedIn',
                    scrapedAt: new Date().toISOString(),
                    matchScore: 90
                }
            ];

            jobs.push(...mockJobs);
            
            logger.info(`Scraped ${jobs.length} jobs from LinkedIn`);
            return jobs;
            
        } catch (error) {
            logger.error('Error scraping LinkedIn:', error);
            return [];
        }
    }

    async scrapeIndeed() {
        try {
            logger.info('Scraping Indeed India...');
            const jobs = [];
            
            for (const keyword of this.biotechKeywords.slice(0, 2)) {
                const searchUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(keyword)}&l=India`;
                const jobsFromKeyword = await this.scrapeIndeedSearch(searchUrl, keyword);
                jobs.push(...jobsFromKeyword);
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            const uniqueJobs = this.deduplicateByUrl(jobs);
            logger.info(`Scraped ${uniqueJobs.length} unique jobs from Indeed`);
            return uniqueJobs;
            
        } catch (error) {
            logger.error('Error scraping Indeed:', error);
            return [];
        }
    }

    async scrapeIndeedSearch(url, keyword) {
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': this.userAgent },
                timeout: 30000
            });

            const $ = cheerio.load(response.data);
            const jobs = [];

            $('[data-jk]').each((index, element) => {
                if (index >= 15) return; // Limit results

                const $job = $(element);
                const title = $job.find('h2 a span').text().trim();
                const company = $job.find('[data-testid="company-name"]').text().trim();
                const location = $job.find('[data-testid="job-location"]').text().trim();
                const salary = $job.find('.salary-snippet').text().trim();
                const jobKey = $job.attr('data-jk');
                const url = jobKey ? `https://in.indeed.com/viewjob?jk=${jobKey}` : '';

                if (title && company) {
                    jobs.push({
                        title,
                        company,
                        location,
                        salary: this.parseSalary(salary),
                        url,
                        description: '', // Would need additional request
                        source: 'Indeed',
                        keyword,
                        scrapedAt: new Date().toISOString(),
                        matchScore: this.calculateMatchScore(title, company, keyword)
                    });
                }
            });

            return jobs;
            
        } catch (error) {
            logger.error(`Error scraping Indeed search for ${keyword}:`, error);
            return [];
        }
    }

    async scrapeCompanySites() {
        try {
            logger.info('Scraping company career pages...');
            const jobs = [];
            
            const companySites = [
                { name: 'Sun Pharma', url: 'https://careers.sunpharma.com', method: 'scrapeSunPharma' },
                { name: 'Biocon', url: 'https://www.biocon.com/careers', method: 'scrapeBiocon' },
                // Add more company-specific scrapers
            ];

            for (const site of companySites) {
                try {
                    const companyJobs = await this[site.method](site.url);
                    jobs.push(...companyJobs.map(job => ({ ...job, company: site.name })));
                    
                    // Rate limiting
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } catch (error) {
                    logger.error(`Error scraping ${site.name}:`, error);
                    // Continue with other companies
                }
            }

            logger.info(`Scraped ${jobs.length} jobs from company sites`);
            return jobs;
            
        } catch (error) {
            logger.error('Error scraping company sites:', error);
            return [];
        }
    }

    async scrapeSunPharma(url) {
        // Company-specific scraping logic
        // In production, this would be tailored to each company's career page structure
        return [
            {
                title: 'QC Analyst',
                location: 'Mumbai',
                salary: 400000,
                url: url + '/qc-analyst',
                description: 'Quality control testing and analysis',
                source: 'Sun Pharma Careers',
                scrapedAt: new Date().toISOString(),
                matchScore: 75
            }
        ];
    }

    async scrapeBiocon(url) {
        // Company-specific scraping logic
        return [
            {
                title: 'Research Associate - Bioinformatics',
                location: 'Bangalore',
                salary: 600000,
                url: url + '/research-associate',
                description: 'Bioinformatics research and analysis',
                source: 'Biocon Careers',
                scrapedAt: new Date().toISOString(),
                matchScore: 88
            }
        ];
    }

    calculateMatchScore(title, company, keyword) {
        let score = 0;
        
        const titleLower = title.toLowerCase();
        const companyLower = company.toLowerCase();
        const keywordLower = keyword.toLowerCase();

        // Keyword match in title
        if (titleLower.includes(keywordLower)) score += 30;
        
        // Biotech keywords in title
        const biotechMatches = this.biotechKeywords.filter(kw => titleLower.includes(kw.toLowerCase()));
        score += biotechMatches.length * 10;

        // Preferred company
        const isPreferredCompany = this.targetCompanies.some(tc => 
            companyLower.includes(tc.toLowerCase())
        );
        if (isPreferredCompany) score += 20;

        // Relevant job titles
        const relevantTitles = ['analyst', 'associate', 'scientist', 'researcher', 'engineer'];
        const titleRelevance = relevantTitles.some(rt => titleLower.includes(rt));
        if (titleRelevance) score += 15;

        return Math.min(score, 100);
    }

    parseSalary(salaryText) {
        if (!salaryText) return null;
        
        // Extract numbers from salary text
        const numbers = salaryText.match(/\d+/g);
        if (!numbers) return null;

        // Convert to annual salary in INR
        let salary = parseInt(numbers[0]);
        
        if (salaryText.toLowerCase().includes('lakh')) {
            salary *= 100000;
        } else if (salaryText.toLowerCase().includes('crore')) {
            salary *= 10000000;
        } else if (salaryText.toLowerCase().includes('k')) {
            salary *= 1000;
        }

        return salary;
    }

    deduplicateByUrl(jobs) {
        const seen = new Set();
        return jobs.filter(job => {
            if (seen.has(job.url)) {
                return false;
            }
            seen.add(job.url);
            return true;
        });
    }

    // Health check method
    async healthCheck() {
        try {
            // Test with a simple request to each major site
            const tests = [
                { name: 'Naukri', url: 'https://www.naukri.com' },
                { name: 'Indeed', url: 'https://in.indeed.com' }
            ];

            const results = await Promise.allSettled(
                tests.map(test => 
                    axios.head(test.url, { 
                        timeout: 10000,
                        headers: { 'User-Agent': this.userAgent }
                    })
                )
            );

            const health = tests.map((test, index) => ({
                site: test.name,
                status: results[index].status === 'fulfilled' ? 'healthy' : 'unhealthy',
                error: results[index].reason?.message
            }));

            logger.info('Job scraping service health check:', health);
            return health;
            
        } catch (error) {
            logger.error('Job scraping health check failed:', error);
            return [];
        }
    }
}

module.exports = { JobScrapingService };