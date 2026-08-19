#!/usr/bin/env node

/**
 * Configuration Validator for Unified API System
 * Validates setup without requiring n8n to be running
 */

const fs = require('fs');
const path = require('path');

class ConfigValidator {
  constructor() {
    this.results = [];
    this.warnings = [];
    this.errors = [];
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const entry = { level, message, timestamp };
    
    if (level === 'error') {
      this.errors.push(entry);
      console.log(`❌ ${message}`);
    } else if (level === 'warning') {
      this.warnings.push(entry);
      console.log(`⚠️  ${message}`);
    } else if (level === 'success') {
      console.log(`✅ ${message}`);
    } else {
      console.log(`ℹ️  ${message}`);
    }
  }

  checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.log('success', `${description} exists: ${filePath}`);
      return true;
    } else {
      this.log('error', `${description} not found: ${filePath}`);
      return false;
    }
  }

  checkJSONFile(filePath, description) {
    if (!this.checkFileExists(filePath, description)) {
      return false;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      this.log('success', `${description} is valid JSON`);
      return true;
    } catch (error) {
      this.log('error', `${description} has invalid JSON: ${error.message}`);
      return false;
    }
  }

  checkEnvironmentFile() {
    this.log('info', 'Checking environment configuration...');
    
    if (!this.checkFileExists('.env', 'Environment file')) {
      this.log('warning', 'Run ./setup-unified-api.sh env to create .env file');
      return false;
    }

    const envContent = fs.readFileSync('.env', 'utf8');
    const placeholders = [
      'REPLACE_TELEGRAM_CHAT_ID',
      'REPLACE_GITHUB_OWNER', 
      'REPLACE_GITHUB_REPO',
      'REPLACE_GOOGLE_DRIVE_FILE_ID',
      'REPLACE_GOOGLE_SHEETS_ID',
      'your-generated-encryption-key',
      'your-strong-password',
      'your-domain.com'
    ];

    let hasPlaceholders = false;
    placeholders.forEach(placeholder => {
      if (envContent.includes(placeholder)) {
        this.log('warning', `Replace placeholder: ${placeholder}`);
        hasPlaceholders = true;
      }
    });

    if (!hasPlaceholders) {
      this.log('success', 'Environment file appears to be configured');
    }

    // Check for encryption key
    if (envContent.includes('N8N_ENCRYPTION_KEY=') && 
        !envContent.includes('your-generated-encryption-key')) {
      this.log('success', 'Encryption key is configured');
    } else {
      this.log('warning', 'Encryption key not configured or using placeholder');
    }

    return true;
  }

  checkWorkflowFiles() {
    this.log('info', 'Checking n8n workflow files...');
    
    const workflowFile = 'n8n-workflows/unified-api-router.json';
    if (this.checkJSONFile(workflowFile, 'n8n workflow')) {
      // Validate workflow structure
      const workflow = JSON.parse(fs.readFileSync(workflowFile, 'utf8'));
      
      if (workflow.nodes && Array.isArray(workflow.nodes)) {
        this.log('success', `Workflow has ${workflow.nodes.length} nodes`);
        
        // Check for key nodes
        const nodeTypes = workflow.nodes.map(n => n.type);
        const requiredNodes = [
          'n8n-nodes-base.webhook',
          'n8n-nodes-base.function',
          'n8n-nodes-base.if'
        ];
        
        requiredNodes.forEach(required => {
          if (nodeTypes.includes(required)) {
            this.log('success', `Required node type found: ${required}`);
          } else {
            this.log('warning', `Required node type missing: ${required}`);
          }
        });
      } else {
        this.log('error', 'Workflow structure is invalid');
      }
    }
  }

  checkGitHubActions() {
    this.log('info', 'Checking GitHub Actions...');
    
    const actionsFile = '.github/workflows/unified-api-health-check.yml';
    if (this.checkFileExists(actionsFile, 'GitHub Actions workflow')) {
      const content = fs.readFileSync(actionsFile, 'utf8');
      
      if (content.includes('N8N_UNIFIED_API_URL')) {
        this.log('success', 'GitHub Actions references required secrets');
      } else {
        this.log('warning', 'GitHub Actions may not be configured correctly');
      }
      
      if (content.includes('schedule:')) {
        this.log('success', 'GitHub Actions has scheduled triggers');
      }
    }
  }

  checkDocumentation() {
    this.log('info', 'Checking documentation...');
    
    const docs = [
      'UNIFIED-API-SETUP.md',
      'README.md',
      'README-n8n-setup.md'
    ];
    
    docs.forEach(doc => {
      this.checkFileExists(doc, `Documentation: ${doc}`);
    });
  }

  checkSetupScripts() {
    this.log('info', 'Checking setup scripts...');
    
    const scripts = [
      'setup-unified-api.sh',
      'test-unified-api.js'
    ];
    
    scripts.forEach(script => {
      if (this.checkFileExists(script, `Script: ${script}`)) {
        // Check if executable
        try {
          const stats = fs.statSync(script);
          if (stats.mode & parseInt('111', 8)) {
            this.log('success', `Script is executable: ${script}`);
          } else {
            this.log('warning', `Script not executable: ${script} (run: chmod +x ${script})`);
          }
        } catch (error) {
          this.log('warning', `Could not check permissions for: ${script}`);
        }
      }
    });
  }

  checkDockerFiles() {
    this.log('info', 'Checking Docker configuration...');
    
    const dockerFiles = [
      'docker-compose.basic.yml',
      'docker-compose.reverse-proxy.yml',
      '.env.example'
    ];
    
    dockerFiles.forEach(file => {
      this.checkFileExists(file, `Docker file: ${file}`);
    });
  }

  checkTypeScriptIntegration() {
    this.log('info', 'Checking TypeScript integration...');
    
    if (this.checkFileExists('src/api/UnifiedAPIClient.ts', 'TypeScript API client')) {
      if (this.checkFileExists('tsconfig.json', 'TypeScript configuration')) {
        this.log('success', 'TypeScript integration is set up');
      }
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CONFIGURATION VALIDATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📈 Summary:`);
    console.log(`✅ Validations passed: ${this.results.filter(r => r.level === 'success').length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings to address:');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.message}`);
      });
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors to fix:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
      });
    }
    
    console.log('\n💡 Next Steps:');
    
    if (this.errors.length > 0) {
      console.log('1. Fix the errors listed above');
      console.log('2. Re-run this validator');
    } else if (this.warnings.length > 0) {
      console.log('1. Address warnings if needed');
      console.log('2. Configure credentials in n8n');
      console.log('3. Add GitHub repository secrets');
      console.log('4. Test API endpoints');
    } else {
      console.log('1. Start n8n: ./setup-unified-api.sh start');
      console.log('2. Import workflow in n8n web interface');
      console.log('3. Configure credentials');
      console.log('4. Test API: node test-unified-api.js');
    }
    
    console.log('\n🔗 Useful commands:');
    console.log('• Setup environment: ./setup-unified-api.sh env');
    console.log('• Start n8n: ./setup-unified-api.sh start');
    console.log('• Test API: node test-unified-api.js [URL]');
    console.log('• View documentation: cat UNIFIED-API-SETUP.md');
    
    return this.errors.length === 0;
  }

  async runAllChecks() {
    console.log('🔍 Unified API Configuration Validator');
    console.log('='.repeat(60));
    
    this.checkEnvironmentFile();
    this.checkWorkflowFiles();
    this.checkGitHubActions();
    this.checkDocumentation();
    this.checkSetupScripts();
    this.checkDockerFiles();
    this.checkTypeScriptIntegration();
    
    return this.generateReport();
  }
}

// CLI Usage
async function main() {
  const validator = new ConfigValidator();
  const success = await validator.runAllChecks();
  
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Validator failed:', error.message);
    process.exit(1);
  });
}

module.exports = { ConfigValidator };