#!/usr/bin/env node

/**
 * Performance Testing Script for Live Server++
 * 
 * This script runs performance benchmarks to measure the impact
 * of optimizations on response times, memory usage, and throughput.
 */

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

console.log('🧪 Live Server++ Performance Testing\n');

class PerformanceTester {
  constructor() {
    this.results = {
      httpRequests: [],
      websocketConnections: [],
      memoryUsage: [],
      responseTimes: []
    };
    this.testPort = 3001; // Use different port for testing
  }

  // Test HTTP response times
  async testHttpPerformance() {
    console.log('📡 Testing HTTP Performance...');
    
    const testFile = path.join(__dirname, '../test-files/index.html');
    
    // Create test HTML file if it doesn't exist
    if (!fs.existsSync(testFile)) {
      const testDir = path.dirname(testFile);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      fs.writeFileSync(testFile, `
        <!DOCTYPE html>
        <html>
        <head><title>Performance Test</title></head>
        <body><h1>Performance Test Page</h1></body>
        </html>
      `);
    }

    const iterations = 100;
    const concurrent = 10;
    
    for (let i = 0; i < iterations; i += concurrent) {
      const promises = [];
      
      for (let j = 0; j < concurrent && (i + j) < iterations; j++) {
        promises.push(this.makeHttpRequest());
      }
      
      const batchResults = await Promise.all(promises);
      this.results.httpRequests.push(...batchResults);
      
      // Progress indicator
      if (i % 50 === 0) {
        process.stdout.write(`  Progress: ${Math.round((i / iterations) * 100)}%\r`);
      }
    }
    
    console.log('\n  HTTP Performance Test Complete');
  }

  async makeHttpRequest() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const req = http.get(`http://localhost:${this.testPort}/`, (res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            responseTime,
            contentLength: data.length
          });
        });
      });
      
      req.on('error', () => {
        resolve({
          statusCode: 0,
          responseTime: Date.now() - startTime,
          contentLength: 0,
          error: true
        });
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          statusCode: 0,
          responseTime: Date.now() - startTime,
          contentLength: 0,
          timeout: true
        });
      });
    });
  }

  // Test WebSocket connection performance
  async testWebSocketPerformance() {
    console.log('🔌 Testing WebSocket Performance...');
    
    const connections = 50;
    const promises = [];
    
    for (let i = 0; i < connections; i++) {
      promises.push(this.testWebSocketConnection());
    }
    
    const results = await Promise.all(promises);
    this.results.websocketConnections = results;
    
    console.log('  WebSocket Performance Test Complete');
  }

  async testWebSocketConnection() {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const ws = new WebSocket(`ws://localhost:${this.testPort}/_ws_lspp`);
      
      let connected = false;
      let messageReceived = false;
      
      ws.on('open', () => {
        connected = true;
        ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      });
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === 'pong') {
            messageReceived = true;
            ws.close();
          }
        } catch (error) {
          // Ignore parsing errors
        }
      });
      
      ws.on('close', () => {
        const endTime = Date.now();
        resolve({
          connectionTime: endTime - startTime,
          connected,
          messageReceived,
          duration: endTime - startTime
        });
      });
      
      ws.on('error', () => {
        const endTime = Date.now();
        resolve({
          connectionTime: endTime - startTime,
          connected: false,
          messageReceived: false,
          error: true
        });
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        ws.close();
        resolve({
          connectionTime: Date.now() - startTime,
          connected: false,
          messageReceived: false,
          timeout: true
        });
      }, 5000);
    });
  }

  // Test memory usage
  testMemoryUsage() {
    console.log('💾 Testing Memory Usage...');
    
    const iterations = 100;
    
    for (let i = 0; i < iterations; i++) {
      const memUsage = process.memoryUsage();
      this.results.memoryUsage.push({
        iteration: i,
        rss: memUsage.rss,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external
      });
      
      // Simulate some work
      const arr = new Array(1000).fill('test');
      arr.forEach(item => item.toString());
    }
    
    console.log('  Memory Usage Test Complete');
  }

  // Generate performance report
  generateReport() {
    console.log('\n📊 Performance Test Results\n');
    
    // HTTP Performance
    const httpResults = this.results.httpRequests.filter(r => !r.error && !r.timeout);
    if (httpResults.length > 0) {
      const avgResponseTime = httpResults.reduce((sum, r) => sum + r.responseTime, 0) / httpResults.length;
      const minResponseTime = Math.min(...httpResults.map(r => r.responseTime));
      const maxResponseTime = Math.max(...httpResults.map(r => r.responseTime));
      
      console.log('HTTP Performance:');
      console.log(`  Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`  Min Response Time: ${minResponseTime}ms`);
      console.log(`  Max Response Time: ${maxResponseTime}ms`);
      console.log(`  Success Rate: ${((httpResults.length / this.results.httpRequests.length) * 100).toFixed(1)}%`);
      console.log('');
    }
    
    // WebSocket Performance
    const wsResults = this.results.websocketConnections.filter(r => !r.error && !r.timeout);
    if (wsResults.length > 0) {
      const avgConnectionTime = wsResults.reduce((sum, r) => sum + r.connectionTime, 0) / wsResults.length;
      const successRate = (wsResults.length / this.results.websocketConnections.length) * 100;
      
      console.log('WebSocket Performance:');
      console.log(`  Average Connection Time: ${avgConnectionTime.toFixed(2)}ms`);
      console.log(`  Success Rate: ${successRate.toFixed(1)}%`);
      console.log(`  Message Success Rate: ${((wsResults.filter(r => r.messageReceived).length / wsResults.length) * 100).toFixed(1)}%`);
      console.log('');
    }
    
    // Memory Usage
    if (this.results.memoryUsage.length > 0) {
      const firstMem = this.results.memoryUsage[0];
      const lastMem = this.results.memoryUsage[this.results.memoryUsage.length - 1];
      const memoryGrowth = lastMem.heapUsed - firstMem.heapUsed;
      
      console.log('Memory Usage:');
      console.log(`  Initial Heap Used: ${(firstMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Final Heap Used: ${(lastMem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Memory Growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Memory Growth Rate: ${(memoryGrowth / this.results.memoryUsage.length / 1024).toFixed(2)} KB per iteration`);
      console.log('');
    }
    
    // Performance recommendations
    console.log('💡 Performance Recommendations:');
    
    const httpResults = this.results.httpRequests.filter(r => !r.error && !r.timeout);
    if (httpResults.length > 0) {
      const avgResponseTime = httpResults.reduce((sum, r) => sum + r.responseTime, 0) / httpResults.length;
      
      if (avgResponseTime > 100) {
        console.log('  ⚠️  HTTP response times are high. Consider:');
        console.log('     - Enabling compression');
        console.log('     - Implementing caching');
        console.log('     - Optimizing file serving');
      } else {
        console.log('  ✅ HTTP response times are optimized');
      }
    }
    
    const wsResults = this.results.websocketConnections.filter(r => !r.error && !r.timeout);
    if (wsResults.length > 0) {
      const successRate = (wsResults.length / this.results.websocketConnections.length) * 100;
      
      if (successRate < 90) {
        console.log('  ⚠️  WebSocket connection success rate is low. Consider:');
        console.log('     - Connection pooling');
        console.log('     - Better error handling');
        console.log('     - Rate limiting');
      } else {
        console.log('  ✅ WebSocket connections are stable');
      }
    }
  }

  // Run all tests
  async runAllTests() {
    try {
      await this.testHttpPerformance();
      await this.testWebSocketPerformance();
      this.testMemoryUsage();
      this.generateReport();
      
      console.log('🎯 All performance tests completed successfully!');
    } catch (error) {
      console.error('❌ Performance testing failed:', error.message);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests();
}

module.exports = { PerformanceTester };