import * as vscode from 'vscode';
import { ILiveServerPlusPlus, IPerformanceMetrics } from '../../core/types';

export class PerformanceMonitorService {
  private metrics: IPerformanceMetrics = {
    requestCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    activeConnections: 0,
    memoryUsage: 0
  };
  
  private responseTimes: number[] = [];
  private startTime = Date.now();
  private statusBarItem!: vscode.StatusBarItem; // Use definite assignment assertion
  
  constructor(private lspp: ILiveServerPlusPlus) {
    this.register();
    this.createStatusBarItem();
    this.startMonitoring();
  }
  
  register() {
    // Monitor server events
    this.lspp.onDidGoLive(() => {
      this.metrics.activeConnections = 0;
      this.updateStatusBar();
    });
    
    this.lspp.onDidGoOffline(() => {
      this.metrics.activeConnections = 0;
      this.updateStatusBar();
    });
  }
  
  // Performance tracking methods
  trackRequest() {
    this.metrics.requestCount++;
    this.updateStatusBar();
  }
  
  trackCacheHit() {
    this.metrics.cacheHits++;
    this.updateStatusBar();
  }
  
  trackCacheMiss() {
    this.metrics.cacheMisses++;
    this.updateStatusBar();
  }
  
  trackResponseTime(responseTime: number) {
    this.responseTimes.push(responseTime);
    
    // Keep only last 100 response times for rolling average
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
    
    this.metrics.averageResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    this.updateStatusBar();
  }
  
  updateConnectionCount(count: number) {
    this.metrics.activeConnections = count;
    this.updateStatusBar();
  }
  
  private createStatusBarItem() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'extension.live-server++.showPerformance';
    this.updateStatusBar();
    this.statusBarItem.show();
  }
  
  private updateStatusBar() {
    const cacheHitRate = this.metrics.requestCount > 0 
      ? ((this.metrics.cacheHits / this.metrics.requestCount) * 100).toFixed(1)
      : '0.0';
    
    const avgResponseTime = this.metrics.averageResponseTime > 0
      ? this.metrics.averageResponseTime.toFixed(0)
      : '0';
    
    this.statusBarItem.text = `$(server) ${this.metrics.activeConnections} | $(clock) ${avgResponseTime}ms | $(database) ${cacheHitRate}%`;
    this.statusBarItem.tooltip = this.getDetailedTooltip();
  }
  
  private getDetailedTooltip(): string {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const memoryUsage = process.memoryUsage();
    
    return [
      `**Live Server++ Performance Metrics**`,
      ``,
      `🕐 Uptime: ${this.formatUptime(uptime)}`,
      `📊 Total Requests: ${this.metrics.requestCount.toLocaleString()}`,
      `⚡ Cache Hit Rate: ${((this.metrics.cacheHits / Math.max(this.metrics.requestCount, 1)) * 100).toFixed(1)}%`,
      `🚀 Avg Response Time: ${this.metrics.averageResponseTime.toFixed(0)}ms`,
      `🔌 Active Connections: ${this.metrics.activeConnections}`,
      `💾 Memory Usage: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(1)}MB`,
      ``,
      `Click to view detailed performance report`
    ].join('\n');
  }
  
  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
  
  private startMonitoring() {
    // Update memory usage every 5 seconds
    setInterval(() => {
      const memoryUsage = process.memoryUsage();
      this.metrics.memoryUsage = memoryUsage.heapUsed;
      this.updateStatusBar();
    }, 5000);
    
    // Log performance summary every minute
    setInterval(() => {
      this.logPerformanceSummary();
    }, 60000);
  }
  
  private logPerformanceSummary() {
    const cacheHitRate = this.metrics.requestCount > 0 
      ? ((this.metrics.cacheHits / this.metrics.requestCount) * 100).toFixed(1)
      : '0.0';
    
    console.log(`[Performance Monitor] Cache Hit Rate: ${cacheHitRate}%, Avg Response: ${this.metrics.averageResponseTime.toFixed(0)}ms, Active Connections: ${this.metrics.activeConnections}`);
  }
  
  // Public method to get current metrics
  getMetrics(): IPerformanceMetrics {
    return { ...this.metrics };
  }
  
  // Public method to reset metrics
  resetMetrics() {
    this.metrics = {
      requestCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      activeConnections: 0,
      memoryUsage: 0
    };
    this.responseTimes = [];
    this.startTime = Date.now();
    this.updateStatusBar();
  }
  
  // Cleanup method
  dispose() {
    if (this.statusBarItem) {
      this.statusBarItem.dispose();
    }
  }
}