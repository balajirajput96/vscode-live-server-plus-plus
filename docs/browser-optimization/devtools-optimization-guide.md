# 🚀 Browser DevTools Performance Optimization

## Chrome DevTools Optimizations

### Enable Advanced Features
Navigate to `chrome://flags` and enable:

1. **WebGPU developer features** → Enable → Relaunch
2. **WebAssembly developer features** → Enable → Relaunch  
3. **Developer Tools experiments** → Enable → Relaunch

### Performance Audit Workflow
```javascript
// 1. Open DevTools (F12)
// 2. Navigate to Lighthouse tab
// 3. Run performance audit
// 4. Apply these common fixes:

// Fix 1: Optimize images
// Use WebP format and proper sizing
const optimizeImages = () => {
  // Add loading="lazy" to images
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
};

// Fix 2: Remove unused CSS
// Use Coverage tab to identify unused code
const removeUnusedCSS = () => {
  // DevTools → Coverage → Start recording → Navigate
  // Remove highlighted unused CSS rules
};

// Fix 3: Preload critical resources
// Add to <head> section
/*
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="important.js" as="script">
<link rel="dns-prefetch" href="//fonts.googleapis.com">
*/
```

### Network Optimization
```javascript
// Monitor network performance
const networkOptimization = {
  // 1. Use Performance tab to identify slow requests
  // 2. Implement resource hints
  addResourceHints: () => {
    const head = document.head;
    
    // DNS prefetch for external domains
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = '//api.example.com';
    head.appendChild(dnsPrefetch);
    
    // Preconnect for critical third-party origins
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    preconnect.crossOrigin = '';
    head.appendChild(preconnect);
  },
  
  // 3. Implement service worker for caching
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', registration);
      } catch (error) {
        console.log('SW registration failed:', error);
      }
    }
  }
};
```

---

## Edge DevTools with Copilot

### Enable Copilot Features
Navigate to `edge://flags` and enable:

1. **Copilot in DevTools** → Enable → Relaunch
2. **Developer Tools AI assistance** → Enable → Relaunch

### AI-Powered Debugging
```javascript
// Use Edge Copilot for smart debugging
const edgeCopilotWorkflow = {
  // 1. Open DevTools (F12)
  // 2. Navigate to Copilot tab
  // 3. Ask performance questions:
  
  commonQueries: [
    "Why is LCP slow?",
    "How to improve First Input Delay?",
    "Optimize Cumulative Layout Shift",
    "Reduce Time to Interactive",
    "Fix render-blocking resources"
  ],
  
  // 4. Apply AI-suggested optimizations
  applyAISuggestions: () => {
    // Copilot will provide specific code suggestions
    // Example responses and implementations:
    
    // For slow LCP - optimize largest contentful paint
    const optimizeLCP = () => {
      // Preload LCP image
      const lcpImage = document.querySelector('.hero-image');
      if (lcpImage) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = lcpImage.src;
        document.head.appendChild(preloadLink);
      }
    };
    
    // For high CLS - prevent layout shifts
    const reduceCLS = () => {
      // Add dimensions to images and embeds
      document.querySelectorAll('img, iframe, video').forEach(element => {
        if (!element.style.aspectRatio && element.naturalWidth) {
          element.style.aspectRatio = `${element.naturalWidth}/${element.naturalHeight}`;
        }
      });
    };
  }
};
```

### Memory and Performance Monitoring
```javascript
// Advanced performance monitoring with Edge AI
const performanceMonitoring = {
  // Memory usage analysis
  analyzeMemory: () => {
    // DevTools → Memory tab → Take heap snapshot
    // Ask Copilot: "Analyze memory leaks in this heap snapshot"
    
    if (performance.memory) {
      const memoryInfo = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
      console.table(memoryInfo);
      
      // Set memory warning threshold
      if (memoryInfo.used > memoryInfo.limit * 0.8) {
        console.warn('High memory usage detected');
      }
    }
  },
  
  // Performance observer for Core Web Vitals
  observeCoreWebVitals: () => {
    // LCP - Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('LCP:', entry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID - First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });
    
    // CLS - Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let cls = 0;
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }
      console.log('CLS:', cls);
    }).observe({ entryTypes: ['layout-shift'] });
  }
};
```

---

## Automated Performance Testing

### Lighthouse CI Integration
```javascript
// .lighthouserc.js configuration
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Performance Budget Script
```javascript
// performance-budget.js
const performanceBudget = {
  budgets: {
    // Size budgets (in KB)
    'total-byte-weight': 1600,
    'dom-size': 1500,
    'script-byte-weight': 400,
    'style-byte-weight': 100,
    'image-byte-weight': 1000,
    
    // Timing budgets (in ms)
    'first-contentful-paint': 2000,
    'largest-contentful-paint': 2500,
    'speed-index': 3000,
    'interactive': 5000,
  },
  
  // Check if current page meets budget
  checkBudget: async () => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`${entry.name}: ${entry.duration}ms`);
      }
    });
    
    observer.observe({ entryTypes: ['navigation', 'paint'] });
    
    // Resource size analysis
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);
    
    console.log(`Total resource size: ${(totalSize / 1024).toFixed(2)} KB`);
    return totalSize / 1024 < this.budgets['total-byte-weight'];
  }
};

// Run budget check
performanceBudget.checkBudget();
```

---

## Quick Reference Commands

### Chrome DevTools Console Commands
```javascript
// Performance measurement
console.time('page-load');
window.addEventListener('load', () => console.timeEnd('page-load'));

// Memory usage
console.log(performance.memory);

// Network timing
console.table(performance.getEntriesByType('navigation')[0]);

// Check Core Web Vitals
const vitals = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => console.log(entry));
});
vitals.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
```

### Edge Copilot Quick Questions
- "Why is this page slow?"
- "How to reduce bundle size?"
- "Optimize loading performance"
- "Fix layout shift issues"
- "Improve accessibility score"

### Performance Audit Checklist
- [ ] Lighthouse performance score > 90
- [ ] LCP < 2.5s
- [ ] FID < 100ms  
- [ ] CLS < 0.1
- [ ] Images optimized and lazy-loaded
- [ ] Critical CSS inlined
- [ ] JavaScript bundles optimized
- [ ] Service worker implemented
- [ ] Resource hints added
- [ ] Unused code removed

---

**Use these tools regularly to maintain optimal performance and user experience!**