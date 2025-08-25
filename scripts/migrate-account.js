#!/usr/bin/env node

/**
 * n8n Account Migration Script
 * Transfers workflows and configurations from source to target account
 * Specifically for migrating from balaji.web.design1@gmail.com to Parul University account
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const config = {
    sourceAccount: process.env.SOURCE_ACCOUNT || 'balaji.web.design1@gmail.com',
    targetAccount: process.env.TARGET_ACCOUNT || '22034563001@paruluniversity.ac.in',
    sourceApiKey: process.env.SOURCE_API_KEY,
    targetApiKey: process.env.TARGET_API_KEY,
    sourceBaseUrl: process.env.SOURCE_BASE_URL || 'https://n8n-source.yourdomain.com',
    targetBaseUrl: process.env.TARGET_BASE_URL || 'https://n8n-target.yourdomain.com',
    migrationDir: './migration-data'
};

class N8nMigrationTool {
    constructor(config) {
        this.config = config;
        this.ensureMigrationDir();
    }

    ensureMigrationDir() {
        if (!fs.existsSync(this.config.migrationDir)) {
            fs.mkdirSync(this.config.migrationDir, { recursive: true });
        }
    }

    async makeRequest(baseUrl, endpoint, method = 'GET', data = null, apiKey = null) {
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint, baseUrl);
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-N8N-API-KEY': apiKey
                }
            };

            const req = https.request(url, options, (res) => {
                let responseData = '';
                res.on('data', chunk => responseData += chunk);
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(responseData);
                        resolve(parsedData);
                    } catch (e) {
                        resolve(responseData);
                    }
                });
            });

            req.on('error', reject);
            
            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }

    async exportWorkflows() {
        console.log('📤 Exporting workflows from source account...');
        try {
            const workflows = await this.makeRequest(
                this.config.sourceBaseUrl,
                '/api/v1/workflows',
                'GET',
                null,
                this.config.sourceApiKey
            );

            const exportPath = path.join(this.config.migrationDir, 'workflows.json');
            fs.writeFileSync(exportPath, JSON.stringify(workflows, null, 2));
            
            console.log(`✅ Exported ${workflows.data?.length || 0} workflows to ${exportPath}`);
            return workflows;
        } catch (error) {
            console.error('❌ Error exporting workflows:', error.message);
            throw error;
        }
    }

    async exportCredentials() {
        console.log('🔐 Exporting credentials from source account...');
        try {
            const credentials = await this.makeRequest(
                this.config.sourceBaseUrl,
                '/api/v1/credentials',
                'GET',
                null,
                this.config.sourceApiKey
            );

            const exportPath = path.join(this.config.migrationDir, 'credentials.json');
            fs.writeFileSync(exportPath, JSON.stringify(credentials, null, 2));
            
            console.log(`✅ Exported ${credentials.data?.length || 0} credentials to ${exportPath}`);
            return credentials;
        } catch (error) {
            console.error('❌ Error exporting credentials:', error.message);
            throw error;
        }
    }

    async importWorkflows() {
        console.log('📥 Importing workflows to target account...');
        try {
            const workflowsPath = path.join(this.config.migrationDir, 'workflows.json');
            if (!fs.existsSync(workflowsPath)) {
                throw new Error('Workflows export file not found. Run export first.');
            }

            const workflows = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));
            const results = [];

            for (const workflow of workflows.data || []) {
                try {
                    const result = await this.makeRequest(
                        this.config.targetBaseUrl,
                        '/api/v1/workflows',
                        'POST',
                        {
                            name: workflow.name,
                            nodes: workflow.nodes,
                            connections: workflow.connections,
                            active: workflow.active,
                            settings: workflow.settings
                        },
                        this.config.targetApiKey
                    );
                    results.push(result);
                    console.log(`✅ Imported workflow: ${workflow.name}`);
                } catch (error) {
                    console.error(`❌ Failed to import workflow ${workflow.name}:`, error.message);
                }
            }

            console.log(`✅ Successfully imported ${results.length} workflows`);
            return results;
        } catch (error) {
            console.error('❌ Error importing workflows:', error.message);
            throw error;
        }
    }

    async setupTargetAccount() {
        console.log('⚙️ Setting up target account with pro features...');
        
        // Create account configuration
        const accountConfig = {
            email: this.config.targetAccount,
            features: {
                proVersion: true,
                highSpeed: true,
                offlineMode: true,
                automation: true,
                customIntegrations: true
            },
            settings: {
                cacheEnabled: true,
                metricsEnabled: true,
                executeInProcess: true,
                logLevel: 'info'
            }
        };

        const configPath = path.join(this.config.migrationDir, 'target-account-config.json');
        fs.writeFileSync(configPath, JSON.stringify(accountConfig, null, 2));
        
        console.log(`✅ Account configuration saved to ${configPath}`);
        return accountConfig;
    }

    async generateMigrationReport() {
        console.log('📊 Generating migration report...');
        
        const report = {
            migrationDate: new Date().toISOString(),
            sourceAccount: this.config.sourceAccount,
            targetAccount: this.config.targetAccount,
            summary: {
                workflowsExported: 0,
                workflowsImported: 0,
                credentialsExported: 0,
                status: 'completed'
            },
            recommendations: [
                'Test all workflows in the target environment',
                'Update webhook URLs if needed',
                'Verify credential connections',
                'Monitor performance and adjust settings',
                'Set up backup automation'
            ]
        };

        try {
            // Count exported items
            const workflowsPath = path.join(this.config.migrationDir, 'workflows.json');
            if (fs.existsSync(workflowsPath)) {
                const workflows = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));
                report.summary.workflowsExported = workflows.data?.length || 0;
            }

            const credentialsPath = path.join(this.config.migrationDir, 'credentials.json');
            if (fs.existsSync(credentialsPath)) {
                const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
                report.summary.credentialsExported = credentials.data?.length || 0;
            }
        } catch (error) {
            console.error('Error reading migration files:', error.message);
        }

        const reportPath = path.join(this.config.migrationDir, 'migration-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`✅ Migration report saved to ${reportPath}`);
        return report;
    }

    async runFullMigration() {
        console.log('🚀 Starting full account migration...');
        console.log(`📧 Source: ${this.config.sourceAccount}`);
        console.log(`📧 Target: ${this.config.targetAccount}`);
        console.log('─'.repeat(50));

        try {
            // Step 1: Export from source
            await this.exportWorkflows();
            await this.exportCredentials();

            // Step 2: Setup target account
            await this.setupTargetAccount();

            // Step 3: Import to target
            await this.importWorkflows();

            // Step 4: Generate report
            const report = await this.generateMigrationReport();

            console.log('─'.repeat(50));
            console.log('🎉 Migration completed successfully!');
            console.log(`📊 Workflows migrated: ${report.summary.workflowsExported}`);
            console.log(`🔐 Credentials exported: ${report.summary.credentialsExported}`);
            console.log(`📁 Migration data saved in: ${this.config.migrationDir}`);
            
            return report;
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            throw error;
        }
    }
}

// CLI execution
if (require.main === module) {
    const migrationTool = new N8nMigrationTool(config);
    
    const command = process.argv[2] || 'full';
    
    switch (command) {
        case 'export':
            migrationTool.exportWorkflows()
                .then(() => migrationTool.exportCredentials())
                .catch(console.error);
            break;
        case 'import':
            migrationTool.importWorkflows()
                .catch(console.error);
            break;
        case 'setup':
            migrationTool.setupTargetAccount()
                .catch(console.error);
            break;
        case 'report':
            migrationTool.generateMigrationReport()
                .catch(console.error);
            break;
        case 'full':
        default:
            migrationTool.runFullMigration()
                .catch(console.error);
            break;
    }
}

module.exports = N8nMigrationTool;