export interface IPerformanceMetrics {
  requestCount: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  activeConnections: number;
  memoryUsage: number;
}
