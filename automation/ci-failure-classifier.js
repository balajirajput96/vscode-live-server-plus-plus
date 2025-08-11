#!/usr/bin/env node

/**
 * CI Failure Classifier
 * Classifies CI failure root causes and returns exact fix snippets
 */

const { Octokit } = require('@octokit/rest');
const { GoogleSheetsService } = require('./services/google-sheets.service');
const { WhatsAppService } = require('./services/whatsapp.service');
const { logger } = require('./utils/logger');

class CIFailureClassifier {
    constructor() {
        this.octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });
        this.sheetsService = new GoogleSheetsService();
        this.whatsappService = new WhatsAppService();
        this.owner = process.env.GITHUB_REPOSITORY_OWNER;
        this.repo = process.env.GITHUB_REPOSITORY_NAME;
    }

    async classifyFailure(workflowRunId) {
        try {
            logger.info(`Analyzing CI failure for workflow run ${workflowRunId}`);

            // Get workflow run details
            const workflowRun = await this.octokit.actions.getWorkflowRun({
                owner: this.owner,
                repo: this.repo,
                run_id: workflowRunId
            });

            if (workflowRun.data.conclusion !== 'failure') {
                logger.info('Workflow run did not fail, no classification needed');
                return null;
            }

            // Get jobs for this workflow run
            const jobs = await this.octokit.actions.listJobsForWorkflowRun({
                owner: this.owner,
                repo: this.repo,
                run_id: workflowRunId
            });

            const failedJobs = jobs.data.jobs.filter(job => job.conclusion === 'failure');
            
            if (failedJobs.length === 0) {
                logger.warn('No failed jobs found for failed workflow run');
                return null;
            }

            // Analyze each failed job
            const analyses = await Promise.all(
                failedJobs.map(job => this.analyzeFailedJob(job))
            );

            // Consolidate results
            const classification = this.consolidateAnalyses(analyses);
            
            // Generate fix snippets
            const fixSnippets = await this.generateFixSnippets(classification);

            const result = {
                workflowRunId,
                workflowName: workflowRun.data.name,
                failedJobs: failedJobs.length,
                classification,
                fixSnippets,
                analyzedAt: new Date().toISOString()
            };

            // Log to sheets and notify
            await this.logClassification(result);
            await this.notifyFailure(result);

            return result;

        } catch (error) {
            logger.error('Failed to classify CI failure:', error);
            throw error;
        }
    }

    async analyzeFailedJob(job) {
        try {
            // Get job logs
            const logs = await this.octokit.actions.downloadJobLogsForWorkflowRun({
                owner: this.owner,
                repo: this.repo,
                job_id: job.id
            });

            const logText = logs.data; // This would be the log content
            
            return {
                jobName: job.name,
                jobId: job.id,
                steps: job.steps.filter(step => step.conclusion === 'failure'),
                rootCause: this.identifyRootCause(logText),
                errorPatterns: this.extractErrorPatterns(logText),
                suggestedFix: this.suggestFix(logText)
            };

        } catch (error) {
            logger.error(`Failed to analyze job ${job.id}:`, error);
            return {
                jobName: job.name,
                jobId: job.id,
                error: error.message,
                rootCause: 'unknown'
            };
        }
    }

    identifyRootCause(logText) {
        const patterns = [
            {
                category: 'dependency_failure',
                patterns: [
                    /npm ERR!/i,
                    /npm install failed/i,
                    /package.json.*not found/i,
                    /node_modules.*not found/i,
                    /unable to resolve dependency/i,
                    /ENOENT.*package\.json/i
                ]
            },
            {
                category: 'compilation_error',
                patterns: [
                    /TypeScript error/i,
                    /tsc.*error/i,
                    /Compilation failed/i,
                    /Cannot find module/i,
                    /Type.*is not assignable/i,
                    /Property.*does not exist/i
                ]
            },
            {
                category: 'test_failure',
                patterns: [
                    /Test failed/i,
                    /AssertionError/i,
                    /Expected.*but received/i,
                    /\d+ failing/i,
                    /jest.*failed/i,
                    /mocha.*failed/i
                ]
            },
            {
                category: 'linting_error',
                patterns: [
                    /ESLint found/i,
                    /TSLint found/i,
                    /Linting failed/i,
                    /\d+ problems? \(\d+ errors?, \d+ warnings?\)/i
                ]
            },
            {
                category: 'environment_issue',
                patterns: [
                    /command not found/i,
                    /No such file or directory/i,
                    /Permission denied/i,
                    /EACCES/i,
                    /timeout/i,
                    /network.*error/i
                ]
            },
            {
                category: 'authentication_failure',
                patterns: [
                    /Authentication failed/i,
                    /401.*unauthorized/i,
                    /403.*forbidden/i,
                    /Invalid.*token/i,
                    /credential.*invalid/i
                ]
            },
            {
                category: 'resource_exhaustion',
                patterns: [
                    /out of memory/i,
                    /heap.*out of memory/i,
                    /disk.*full/i,
                    /ENOMEM/i,
                    /ENOSPC/i
                ]
            }
        ];

        for (const category of patterns) {
            if (category.patterns.some(pattern => pattern.test(logText))) {
                return category.category;
            }
        }

        return 'unknown';
    }

    extractErrorPatterns(logText) {
        const patterns = [];
        const lines = logText.split('\n');

        for (const line of lines) {
            // Extract error messages
            if (line.includes('Error:') || line.includes('ERROR') || line.includes('FAIL')) {
                patterns.push(line.trim());
            }
        }

        return patterns.slice(0, 5); // Limit to 5 most relevant patterns
    }

    suggestFix(logText) {
        const rootCause = this.identifyRootCause(logText);
        
        const fixes = {
            dependency_failure: [
                'Delete node_modules and package-lock.json, then run npm install',
                'Update npm to latest version: npm install -g npm@latest',
                'Clear npm cache: npm cache clean --force',
                'Check for missing dependencies in package.json'
            ],
            compilation_error: [
                'Fix TypeScript errors in source files',
                'Update type definitions: npm install @types/node --save-dev',
                'Check import statements and file paths',
                'Verify tsconfig.json configuration'
            ],
            test_failure: [
                'Review failing test cases and fix implementation',
                'Update test expectations to match current behavior',
                'Add missing test dependencies',
                'Check test environment configuration'
            ],
            linting_error: [
                'Fix linting errors: npm run lint -- --fix',
                'Update linting configuration in .eslintrc or tslint.json',
                'Add eslint-disable comments for specific rules',
                'Install missing linting dependencies'
            ],
            environment_issue: [
                'Check file permissions and paths',
                'Verify environment variables are set correctly',
                'Update GitHub Actions runner configuration',
                'Add timeout settings to long-running commands'
            ],
            authentication_failure: [
                'Verify GitHub token permissions',
                'Update expired credentials in repository secrets',
                'Check API access permissions',
                'Regenerate and update authentication tokens'
            ],
            resource_exhaustion: [
                'Increase memory allocation in CI configuration',
                'Optimize build process to use less resources',
                'Use caching to reduce build time',
                'Split large jobs into smaller chunks'
            ]
        };

        return fixes[rootCause] || [
            'Review full error logs for specific issues',
            'Check recent code changes for potential problems',
            'Verify CI configuration and environment setup',
            'Contact development team for assistance'
        ];
    }

    consolidateAnalyses(analyses) {
        const rootCauses = analyses.map(a => a.rootCause);
        const mostCommonCause = this.getMostCommon(rootCauses);
        
        return {
            primaryRootCause: mostCommonCause,
            failureDistribution: this.getDistribution(rootCauses),
            criticalErrors: analyses.flatMap(a => a.errorPatterns || []).slice(0, 10),
            affectedJobs: analyses.map(a => a.jobName)
        };
    }

    getMostCommon(array) {
        const counts = {};
        array.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        
        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';
    }

    getDistribution(array) {
        const counts = {};
        array.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        return counts;
    }

    async generateFixSnippets(classification) {
        const fixes = {
            dependency_failure: {
                title: 'Fix Dependency Issues',
                steps: [
                    {
                        description: 'Clean install dependencies',
                        command: 'rm -rf node_modules package-lock.json && npm install'
                    },
                    {
                        description: 'Update package.json if needed',
                        snippet: `// Add missing dependencies
"dependencies": {
  // Add required packages here
}`,
                        file: 'package.json'
                    }
                ]
            },
            compilation_error: {
                title: 'Fix Compilation Errors',
                steps: [
                    {
                        description: 'Fix TypeScript configuration',
                        snippet: `{
  "compilerOptions": {
    "strict": false,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}`,
                        file: 'tsconfig.json'
                    },
                    {
                        description: 'Add type declarations',
                        command: 'npm install @types/node @types/vscode --save-dev'
                    }
                ]
            },
            test_failure: {
                title: 'Fix Test Failures',
                steps: [
                    {
                        description: 'Update test configuration',
                        command: 'npm test -- --updateSnapshot'
                    },
                    {
                        description: 'Add test timeout',
                        snippet: `// Increase test timeout
jest.setTimeout(30000);`,
                        file: 'test setup'
                    }
                ]
            },
            linting_error: {
                title: 'Fix Linting Issues',
                steps: [
                    {
                        description: 'Auto-fix linting errors',
                        command: 'npm run lint -- --fix'
                    },
                    {
                        description: 'Update linting configuration',
                        snippet: `{
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off"
  }
}`,
                        file: '.eslintrc.json'
                    }
                ]
            }
        };

        return fixes[classification.primaryRootCause] || {
            title: 'General CI Fix',
            steps: [
                {
                    description: 'Check recent changes',
                    command: 'git log --oneline -10'
                },
                {
                    description: 'Verify CI configuration',
                    file: '.github/workflows/ci.yml'
                }
            ]
        };
    }

    async logClassification(result) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                workflowRunId: result.workflowRunId,
                workflowName: result.workflowName,
                primaryRootCause: result.classification.primaryRootCause,
                failedJobs: result.failedJobs,
                fixTitle: result.fixSnippets.title,
                fixSteps: result.fixSnippets.steps.length
            };

            await this.sheetsService.logError(logEntry);
            logger.info('CI failure classification logged');
        } catch (error) {
            logger.error('Failed to log classification:', error);
        }
    }

    async notifyFailure(result) {
        try {
            const message = `🚨 *CI Failure Alert*

Workflow: ${result.workflowName}
Run ID: ${result.workflowRunId}
Failed Jobs: ${result.failedJobs}

🔍 *Root Cause:* ${result.classification.primaryRootCause.replace(/_/g, ' ').toUpperCase()}

⚡ *Quick Fix:* ${result.fixSnippets.title}

🛠️ *Fix Steps:*
${result.fixSnippets.steps.map((step, i) => `${i + 1}. ${step.description}`).join('\n')}

${result.fixSnippets.steps[0]?.command ? `💻 *Run:* \`${result.fixSnippets.steps[0].command}\`` : ''}

Check GitHub Actions for full details.`;

            await this.whatsappService.sendMessage(message);
            logger.info('CI failure notification sent');
        } catch (error) {
            logger.error('Failed to send failure notification:', error);
        }
    }
}

// Export for use in GitHub Actions or other scripts
module.exports = { CIFailureClassifier };

// CLI usage
if (require.main === module) {
    const workflowRunId = process.argv[2];
    if (!workflowRunId) {
        console.error('Usage: node ci-failure-classifier.js <workflow_run_id>');
        process.exit(1);
    }

    const classifier = new CIFailureClassifier();
    classifier.classifyFailure(workflowRunId)
        .then((result) => {
            if (result) {
                console.log('CI failure classification completed');
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log('No failure to classify');
            }
        })
        .catch((error) => {
            console.error('Classification failed:', error);
            process.exit(1);
        });
}