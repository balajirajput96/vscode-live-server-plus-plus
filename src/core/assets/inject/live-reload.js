(function() {
  'use strict';
  
  // Performance optimizations
  const storageKey = 'IsThisFirstTime_Log_From_LiveServer++';
  const { DiffDOM } = window.diffDOM;
  const dd = new DiffDOM({ trimNodeTextValue: true });
  const bodyRegex = /<body[^>]*>([\s\S]*)<\/body>/im;
  
  // Cache DOM elements
  let cachedElements = new Map();
  
  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimized logging
  const log = console.log.bind(console, '[LiveServer++]');
  const error = console.error.bind(console, '[LiveServer++]');

  // WebSocket connection with reconnection logic
  class LiveReloadWebSocket {
    constructor() {
      this.address = this.getWebSocketAddress();
      this.socket = null;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectDelay = 1000;
      this.connect();
    }

    getWebSocketAddress() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/_ws_lspp`;
    }

    connect() {
      try {
        this.socket = new WebSocket(this.address);
        this.setupEventHandlers();
      } catch (err) {
        error('WebSocket connection failed:', err);
        this.scheduleReconnect();
      }
    }

    setupEventHandlers() {
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    }

    handleOpen(event) {
      log('Connected!');
      this.reconnectAttempts = 0;
      this.socket.send(JSON.stringify({ watchList: this.getWatchList() }));
      
      if (!sessionStorage.getItem(storageKey)) {
        sessionStorage.setItem(storageKey, 'true');
      }
    }

    handleMessage(event) {
      try {
        const { action, data } = JSON.parse(event.data);
        this.handleAction(action, data);
      } catch (err) {
        error('Invalid message format:', err);
      }
    }

    handleAction(action, data) {
      switch (action) {
        case 'refreshcss':
          this.refreshCSS();
          break;
        case 'reload':
          this.fullBrowserReload();
          break;
        case 'hot':
          this.updateDOM(data.dom);
          break;
        case 'partial-reload':
          this.fullHTMLRerender(data.dom);
          break;
        default:
          log('Unknown action:', action);
      }
    }

    handleClose() {
      log('Connection closed');
      this.scheduleReconnect();
    }

    handleError(event) {
      error('WebSocket error:', event);
    }

    scheduleReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        setTimeout(() => this.connect(), delay);
      } else {
        error('Max reconnection attempts reached');
      }
    }

    getWatchList() {
      return [window.location.pathname];
    }

    // Optimized DOM update methods
    updateDOM(html) {
      try {
        this.onDemandHTMLRender(html);
      } catch (err) {
        try {
          this.fullHTMLRerender(html);
        } catch (err2) {
          this.fullBrowserReload();
        }
      }
    }

    fullHTMLRerender(html) {
      const match = bodyRegex.exec(html);
      if (!match) {
        throw new Error('Invalid HTML format');
      }
      
      const newBody = document.createElement('body');
      newBody.innerHTML = match[1];
      document.body.replaceWith(newBody);
      
      // Clear cache after full render
      cachedElements.clear();
    }

    onDemandHTMLRender(html) {
      const match = bodyRegex.exec(html);
      if (!match) {
        throw new Error('Invalid HTML format');
      }
      
      const newBody = document.createElement('body');
      newBody.innerHTML = match[1];
      
      const diff = dd.diff(document.body, newBody);
      const result = dd.apply(document.body, diff);
      
      if (!result) {
        throw new Error("Can't update DOM");
      }
    }

    fullBrowserReload() {
      window.location.reload();
    }

    // Optimized CSS refresh
    refreshCSS() {
      const sheets = Array.from(document.getElementsByTagName('link'));
      const head = document.head;
      
      sheets.forEach(sheet => {
        if (sheet.rel === 'stylesheet') {
          const href = sheet.href;
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = href + '?v=' + Date.now();
          head.appendChild(newLink);
          
          // Remove old link after new one loads
          newLink.onload = () => {
            if (sheet.parentNode) {
              sheet.parentNode.removeChild(sheet);
            }
          };
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (!('WebSocket' in window)) {
      return error('WebSocket not supported. Please upgrade your browser.');
    }
    
    new LiveReloadWebSocket();
  }
})();
