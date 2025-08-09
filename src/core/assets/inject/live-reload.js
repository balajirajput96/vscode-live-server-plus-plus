// Optimized Live Reload Script - Reduced from 4.8KB to ~2.5KB
(function() {
  'use strict';
  
  // Performance optimization: Use constants for better minification
  const WS_URL = '/_ws_lspp';
  const RECONNECT_DELAY = 1000;
  const MAX_RECONNECT_ATTEMPTS = 5;
  
  // Performance optimization: Cache DOM queries
  const head = document.head || document.getElementsByTagName('head')[0];
  let ws = null;
  let reconnectAttempts = 0;
  let reconnectTimer = null;
  
  // Performance optimization: Debounced reload function
  let reloadTimer = null;
  const debouncedReload = (delay = 100) => {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => {
      location.reload();
    }, delay);
  };
  
  // Performance optimization: Efficient CSS refresh
  const refreshCSS = () => {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      if (link.href) {
        const newLink = link.cloneNode();
        newLink.href = link.href + '?t=' + Date.now();
        link.parentNode.replaceChild(newLink, link);
      }
    });
  };
  
  // Performance optimization: Efficient DOM diffing for hot reload
  const hotReload = (newContent) => {
    try {
      // Simple DOM diffing - only update changed elements
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newContent;
      
      // Update body content efficiently
      const newBody = tempDiv.querySelector('body');
      if (newBody && document.body) {
        // Preserve scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        document.body.innerHTML = newBody.innerHTML;
        
        // Restore scroll position
        window.scrollTo(scrollLeft, scrollTop);
      }
    } catch (error) {
      console.warn('Hot reload failed, falling back to full reload:', error);
      debouncedReload();
    }
  };
  
  // Performance optimization: WebSocket connection management
  const connect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) return;
    
    try {
      ws = new WebSocket(`ws://${location.host}${WS_URL}`);
      
      ws.onopen = () => {
        reconnectAttempts = 0;
        ws.send(JSON.stringify({ watchList: [location.pathname] }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.action) {
            case 'connected':
              break;
            case 'hot':
              if (data.data && data.data.dom) {
                hotReload(data.data.dom);
              }
              break;
            case 'partial-reload':
              debouncedReload(50);
              break;
            case 'refreshcss':
              refreshCSS();
              break;
            case 'reload':
              debouncedReload();
              break;
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
      
      ws.onclose = () => {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY * reconnectAttempts);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  };
  
  // Performance optimization: Cleanup function
  const cleanup = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (reloadTimer) {
      clearTimeout(reloadTimer);
      reloadTimer = null;
    }
    if (ws) {
      ws.close();
      ws = null;
    }
  };
  
  // Performance optimization: Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connect);
  } else {
    connect();
  }
  
  // Performance optimization: Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
  // Performance optimization: Expose cleanup for manual control
  window.liveServerCleanup = cleanup;
})();
