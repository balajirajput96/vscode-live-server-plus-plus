#!/usr/bin/env node

/**
 * Performance Analysis Script for Live Server++
 * 
 * This script analyzes the performance characteristics of the extension
 * and provides recommendations for optimization.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Live Server++ Performance Analysis\n');

// Analyze bundle size
function analyzeBundleSize() {
  console.log('📦 Bundle Size Analysis:');
  
  try {
    const outDir = path.join(__dirname, '../out');
    if (fs.existsSync(outDir)) {
      const files = fs.readdirSync(outDir);
      let totalSize = 0;
      
      files.forEach(file => {
        const filePath = path.join(outDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          const sizeKB = (stats.size / 1024).toFixed(2);
          totalSize += stats.size;
          console.log(`  ${file}: ${sizeKB} KB`);
        }
      });
      
      const totalSizeKB = (totalSize / 1024).toFixed(2);
      console.log(`  Total: ${totalSizeKB} KB\n`);
      
      // Performance recommendations
      if (totalSize > 500 * 1024) { // 500KB
        console.log('⚠️  Bundle size is large. Consider:');
        console.log('   - Tree-shaking unused code');
        console.log('   - Code splitting');
        console.log('   - Minification and compression');
      } else {
        console.log('✅ Bundle size is optimized\n');
      }
    } else {
      console.log('  Build directory not found. Run "npm run build:prod" first.\n');
    }
  } catch (error) {
    console.log('  Error analyzing bundle size:', error.message);
  }
}

// Analyze dependencies
function analyzeDependencies() {
  console.log('📋 Dependency Analysis:');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const { dependencies, devDependencies } = packageJson;
    
    console.log(`  Production dependencies: ${Object.keys(dependencies).length}`);
    console.log(`  Development dependencies: ${Object.keys(devDependencies).length}`);
    
    // Check for large dependencies
    const largeDeps = ['ws', 'compression', 'etag'];
    largeDeps.forEach(dep => {
      if (dependencies[dep] || devDependencies[dep]) {
        console.log(`  ⚠️  Large dependency detected: ${dep}`);
      }
    });
    
    console.log('');
  } catch (error) {
    console.log('  Error analyzing dependencies:', error.message);
  }
}

// Analyze TypeScript configuration
function analyzeTypeScriptConfig() {
  console.log('⚙️  TypeScript Configuration Analysis:');
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../tsconfig.json'), 'utf8'));
    
    console.log(`  Target: ${tsConfig.compilerOptions.target}`);
    console.log(`  Module: ${tsConfig.compilerOptions.module}`);
    console.log(`  Source maps: ${tsConfig.compilerOptions.sourceMap ? 'enabled' : 'disabled'}`);
    
    // Performance recommendations
    if (tsConfig.compilerOptions.target === 'es6') {
      console.log('  ✅ Modern target for better performance');
    }
    
    if (tsConfig.compilerOptions.sourceMap) {
      console.log('  ⚠️  Source maps enabled (disable in production for better performance)');
    }
    
    console.log('');
  } catch (error) {
    console.log('  Error analyzing TypeScript config:', error.message);
  }
}

// Analyze webpack configuration
function analyzeWebpackConfig() {
  console.log('🔧 Webpack Configuration Analysis:');
  
  try {
    const webpackConfig = fs.readFileSync(path.join(__dirname, '../webpack.config.js'), 'utf8');
    
    if (webpackConfig.includes('TerserPlugin')) {
      console.log('  ✅ Minification enabled');
    } else {
      console.log('  ❌ Minification not configured');
    }
    
    if (webpackConfig.includes('CompressionPlugin')) {
      console.log('  ✅ Compression enabled');
    } else {
      console.log('  ❌ Compression not configured');
    }
    
    if (webpackConfig.includes('splitChunks')) {
      console.log('  ✅ Code splitting enabled');
    } else {
      console.log('  ❌ Code splitting not configured');
    }
    
    console.log('');
  } catch (error) {
    console.log('  Error analyzing webpack config:', error.message);
  }
}

// Performance recommendations
function provideRecommendations() {
  console.log('💡 Performance Optimization Recommendations:\n');
  
  console.log('1. Bundle Optimization:');
  console.log('   - Use webpack bundle analyzer: npm run bundle:analyze');
  console.log('   - Enable tree-shaking and dead code elimination');
  console.log('   - Implement code splitting for large modules');
  
  console.log('\n2. Runtime Performance:');
  console.log('   - Enable compression for HTTP responses');
  console.log('   - Implement intelligent caching strategies');
  console.log('   - Use connection pooling for WebSocket connections');
  
  console.log('\n3. Development Experience:');
  console.log('   - Use webpack watch mode for faster rebuilds');
  console.log('   - Implement hot module replacement');
  console.log('   - Optimize file watching with debouncing');
  
  console.log('\n4. Monitoring:');
  console.log('   - Track response times and cache hit rates');
  console.log('   - Monitor memory usage and connection counts');
  console.log('   - Use performance profiling tools');
}

// Run analysis
function runAnalysis() {
  analyzeBundleSize();
  analyzeDependencies();
  analyzeTypeScriptConfig();
  analyzeWebpackConfig();
  provideRecommendations();
  
  console.log('🎯 Analysis complete! Use the recommendations above to optimize performance.');
}

// Run if called directly
if (require.main === module) {
  runAnalysis();
}

module.exports = { runAnalysis };