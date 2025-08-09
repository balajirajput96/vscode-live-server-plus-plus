export interface PerformanceMetrics {
  memoryUsage: number;
  cpuUsage: number;
  responseTime: number;
  cacheHitRate: number;
  activeConnections: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = Date.now();
  private maxMetrics = 100; // Keep last 100 metrics

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    // Monitor memory usage every 30 seconds
    setInterval(() => {
      this.recordMetrics();
    }, 30000);
  }

  recordMetrics() {
    const memoryUsage = process.memoryUsage();
    const metric: PerformanceMetrics = {
      memoryUsage: memoryUsage.heapUsed / 1024 / 1024, // MB
      cpuUsage: process.cpuUsage().user / 1000000, // seconds
      responseTime: 0, // Will be set by individual operations
      cacheHitRate: this.calculateCacheHitRate(),
      activeConnections: 0, // Will be set by WebSocket manager
      timestamp: Date.now()
    };

    this.metrics.push(metric);
    
    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log warnings for high memory usage
    if (metric.memoryUsage > 100) { // 100MB threshold
      console.warn(`High memory usage detected: ${metric.memoryUsage.toFixed(2)}MB`);
    }
  }

  private calculateCacheHitRate(): number {
    // This would need to be implemented based on your cache implementation
    return 0.85; // Placeholder
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  getAverageResponseTime(): number {
    const validMetrics = this.metrics.filter(m => m.responseTime > 0);
    if (validMetrics.length === 0) return 0;
    
    const sum = validMetrics.reduce((acc, m) => acc + m.responseTime, 0);
    return sum / validMetrics.length;
  }

  getMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.metrics.length < 2) return 'stable';
    
    const recent = this.metrics.slice(-5);
    const first = recent[0].memoryUsage;
    const last = recent[recent.length - 1].memoryUsage;
    
    const diff = last - first;
    if (Math.abs(diff) < 1) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  }

  generateReport(): string {
    const latest = this.getLatestMetrics();
    if (!latest) return 'No metrics available';

    const avgResponseTime = this.getAverageResponseTime();
    const memoryTrend = this.getMemoryTrend();
    const uptime = Date.now() - this.startTime;

    return `
Performance Report:
==================
Uptime: ${(uptime / 1000 / 60).toFixed(2)} minutes
Current Memory: ${latest.memoryUsage.toFixed(2)}MB
Memory Trend: ${memoryTrend}
Average Response Time: ${avgResponseTime.toFixed(2)}ms
Cache Hit Rate: ${(latest.cacheHitRate * 100).toFixed(1)}%
Active Connections: ${latest.activeConnections}
    `.trim();
  }

  reset() {
    this.metrics = [];
    this.startTime = Date.now();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();