#!/usr/bin/env node

/**
 * Unified API Test Suite
 * Tests all endpoints and validates responses
 */

const https = require('https');
const http = require('http');

class UnifiedAPITester {
  constructor(apiUrl) {
    this.apiUrl = apiUrl || process.env.N8N_UNIFIED_API_URL || 'http://localhost:5678/webhook/unified-api';
    this.results = [];
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(data) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.apiUrl);
      const postData = JSON.stringify(data);
      
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'Unified-API-Tester'
        }
      };

      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonResponse = JSON.parse(responseData);
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: jsonResponse
            });
          } catch (error) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: responseData,
              parseError: error.message
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.abort();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  }

  async testEndpoint(testName, requestData, expectedSuccess = true) {
    console.log(`\n🧪 Testing: ${testName}`);
    console.log(`📤 Request: ${JSON.stringify(requestData, null, 2)}`);
    
    try {
      const response = await this.makeRequest(requestData);
      
      console.log(`📨 Status: ${response.statusCode}`);
      console.log(`📥 Response: ${JSON.stringify(response.data, null, 2)}`);
      
      const success = response.statusCode === 200 && 
                     (expectedSuccess ? response.data?.success : true);
      
      const result = {
        test: testName,
        success,
        statusCode: response.statusCode,
        response: response.data,
        error: success ? null : 'Test failed'
      };
      
      this.results.push(result);
      
      if (success) {
        console.log('✅ Test passed');
      } else {
        console.log('❌ Test failed');
      }
      
      return result;
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      
      const result = {
        test: testName,
        success: false,
        error: error.message,
        response: null
      };
      
      this.results.push(result);
      return result;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Unified API Test Suite');
    console.log(`🎯 Target URL: ${this.apiUrl}`);
    console.log('=' * 50);

    // Test 1: Log endpoint (safest)
    await this.testEndpoint('Log Data', {
      type: 'log',
      message: 'Test log entry from test suite',
      email: 'test@example.com',
      category: 'api-testing',
      data: {
        testRun: new Date().toISOString(),
        testType: 'automated'
      }
    });

    await this.sleep(2000); // Wait between requests

    // Test 2: AI endpoint (if configured)
    await this.testEndpoint('AI Query', {
      type: 'ai',
      query: 'What is biotechnology? Reply in Hinglish with a short answer.',
      email: 'test@example.com',
      context: 'API testing'
    });

    await this.sleep(2000);

    // Test 3: GitHub endpoint (if configured)
    await this.testEndpoint('GitHub Issue Creation', {
      type: 'github',
      title: 'API Test Issue - Please Ignore',
      description: `This is an automated test issue created at ${new Date().toISOString()}. Safe to close.`,
      labels: ['test', 'automated', 'safe-to-close']
    });

    await this.sleep(2000);

    // Test 4: Docs endpoint (if configured)
    await this.testEndpoint('Document Retrieval', {
      type: 'docs',
      file_id: 'test-file-id',
      operation: 'download'
    }, false); // May fail if not configured

    await this.sleep(2000);

    // Test 5: Invalid request type
    await this.testEndpoint('Invalid Request Type', {
      type: 'invalid-type',
      message: 'This should be handled gracefully'
    }, false);

    await this.sleep(2000);

    // Test 6: Malformed request
    await this.testEndpoint('Malformed Request', {
      // Missing required fields
      message: 'Test malformed request'
    }, false);

    this.generateReport();
  }

  generateReport() {
    console.log('\n' + '=' * 50);
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' * 50);

    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;

    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    console.log(`📈 Success Rate: ${((passed/total) * 100).toFixed(1)}%`);

    console.log('\n📋 Detailed Results:');
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    // Recommendations
    console.log('\n💡 Recommendations:');
    
    const logTest = this.results.find(r => r.test === 'Log Data');
    if (!logTest?.success) {
      console.log('⚠️  Basic logging failed - check n8n workflow is active and accessible');
    }

    const aiTest = this.results.find(r => r.test === 'AI Query');
    if (!aiTest?.success) {
      console.log('⚠️  AI endpoint failed - check OpenAI credentials in n8n');
    }

    const githubTest = this.results.find(r => r.test === 'GitHub Issue Creation');
    if (!githubTest?.success) {
      console.log('⚠️  GitHub integration failed - check GitHub credentials and permissions');
    }

    const docsTest = this.results.find(r => r.test === 'Document Retrieval');
    if (!docsTest?.success) {
      console.log('ℹ️  Document retrieval failed - this is expected if Google Drive is not configured');
    }

    console.log('\n🔗 Next Steps:');
    console.log('1. Fix any failed credential configurations in n8n');
    console.log('2. Ensure all required services are properly connected');
    console.log('3. Test individual endpoints manually if needed');
    console.log('4. Check n8n workflow logs for detailed error information');

    // Exit code
    const criticalFailures = this.results.filter(r => 
      !r.success && ['Log Data', 'AI Query'].includes(r.test)
    ).length;

    if (criticalFailures > 0) {
      console.log('\n❌ Critical tests failed - system may not be properly configured');
      process.exit(1);
    } else {
      console.log('\n✅ Core functionality working - system is operational');
      process.exit(0);
    }
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const apiUrl = args[0] || process.env.N8N_UNIFIED_API_URL;

  if (!apiUrl) {
    console.error('❌ API URL required. Usage:');
    console.error('  node test-unified-api.js <API_URL>');
    console.error('  OR set N8N_UNIFIED_API_URL environment variable');
    console.error('');
    console.error('Example:');
    console.error('  node test-unified-api.js http://localhost:5678/webhook/unified-api');
    process.exit(1);
  }

  const tester = new UnifiedAPITester(apiUrl);
  await tester.runAllTests();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = { UnifiedAPITester };