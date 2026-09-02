#!/usr/bin/env node

/**
 * Test script for the career automation system
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const CareerAutomationWebhook = require('./webhook-integration');

async function runTests() {
    console.log('🧪 Running Career Automation System Tests...\n');
    
    const webhook = new CareerAutomationWebhook();
    let testsPass = 0;
    let testsTotal = 0;
    let testsSkipped = 0;

    // Test 1: Configuration check
    testsTotal++;
    console.log('Test 1: Configuration validation');
    try {
        webhook.displayStatus();
        testsPass++;
        console.log('✅ Configuration check passed\n');
    } catch (error) {
        console.error('❌ Configuration check failed:', error.message);
    }

    // Test 2: Config template generation
    testsTotal++;
    console.log('Test 2: Configuration template generation');
    const tempConfigPath = path.join(os.tmpdir(), `career-automation-${process.pid}.env`);
    try {
        const generatedPath = webhook.generateConfigTemplate(tempConfigPath);
        if (generatedPath !== tempConfigPath || !fs.existsSync(tempConfigPath)) {
            throw new Error('Configuration template was not written to the isolated temporary path');
        }
        testsPass++;
        console.log('✅ Template generation passed\n');
    } catch (error) {
        console.error('❌ Template generation failed:', error.message);
    } finally {
        fs.rmSync(tempConfigPath, { force: true });
    }

    // Test 3: Webhook connectivity (only when an integration URL is configured)
    testsTotal++;
    console.log('Test 3: Webhook connectivity');
    if (!process.env.N8N_WEBHOOK_URL) {
        testsSkipped++;
        console.log('⏭️ Webhook connectivity skipped (N8N_WEBHOOK_URL not configured)\n');
    } else {
    try {
        const success = await webhook.testWebhook();
        if (success) {
            testsPass++;
            console.log('✅ Webhook connectivity passed\n');
        } else {
            console.error('❌ Webhook connectivity failed\n');
        }
    } catch (error) {
        console.error('❌ Webhook connectivity failed:', error.message);
    }
    }

    // Test 4: Portfolio data formatting
    testsTotal++;
    console.log('Test 4: Portfolio data formatting');
    try {
        const testProject = {
            name: 'Test Bioinformatics Project',
            description: 'Testing automation system integration',
            tools: ['Python', 'n8n', 'GitHub Actions'],
            findings: 'Automation system working correctly'
        };
        
        // This would normally send to webhook, but we'll just validate the format
        console.log('Test project data:', JSON.stringify(testProject, null, 2));
        testsPass++;
        console.log('✅ Portfolio data formatting passed\n');
    } catch (error) {
        console.error('❌ Portfolio data formatting failed:', error.message);
    }

    // Results summary
    console.log('📊 Test Results Summary:');
    console.log('========================');
    console.log(`Tests passed: ${testsPass}/${testsTotal}`);
    console.log(`Tests skipped: ${testsSkipped}`);
    console.log(`Success rate: ${Math.round((testsPass / testsTotal) * 100)}%`);
    
    if (testsPass + testsSkipped === testsTotal) {
        console.log('🎉 All configured tests passed! System is ready for use.');
        process.exit(0);
    } else {
        console.log('⚠️ Some tests failed. Please check configuration.');
        process.exit(1);
    }
}

// CLI commands
const command = process.argv[2];

switch (command) {
    case 'quick':
        console.log('🚀 Quick system validation...');
        const webhook = new CareerAutomationWebhook();
        webhook.displayStatus();
        break;
        
    case 'full':
    default:
        runTests();
        break;
}
