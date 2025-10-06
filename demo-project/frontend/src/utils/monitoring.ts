/**
 * 监控与日志系统
 * 提供性能监控、错误追踪、用户行为分析等功能
 */
import React from 'react';

export interface ErrorInfo {
  message: string;
  stack?: string;
  url: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  component?: string;
  action?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge';
  tags?: Record<string, string>;
}

export interface UserAction {
  action: string;
  target: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface ApiMetric {
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: number;
  userId?: string;
  error?: string;
}

class MonitoringService {
  private errors: ErrorInfo[] = [];
  private metrics: PerformanceMetric[] = [];
  private actions: UserAction[] = [];
  private apiMetrics: ApiMetric[] = [];
  private sessionId: string;
  private userId?: string;
  private maxStorageSize = 1000; // 最大存储数量

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.setupPerformanceObserver();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    // JavaScript错误
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        userId: this.userId,
      });
    });

    // Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        userId: this.userId,
      });
    });
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // 观察导航性能
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.navigationStart, 'timing');
            this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.navigationStart, 'timing');
            this.recordMetric('first_paint', navEntry.responseEnd - navEntry.navigationStart, 'timing');
          }
        });
      });

      try {
        navObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('PerformanceObserver not supported');
      }

      // 观察资源加载性能
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.recordMetric('resource_load_time', resourceEntry.duration, 'timing', {
              url: resourceEntry.name,
              type: this.getResourceType(resourceEntry.name),
            });
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Resource PerformanceObserver not supported');
      }
    }
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'style';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.gif')) return 'image';
    if (url.includes('.woff') || url.includes('.ttf')) return 'font';
    return 'other';
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  captureError(error: ErrorInfo): void {
    this.errors.push(error);
    this.trimArray(this.errors);

    // 发送到服务器
    this.sendToServer('/api/v1/monitoring/errors', error);

    // 控制台输出
    console.error('Captured Error:', error);
  }

  recordMetric(name: string, value: number, type: PerformanceMetric['type'], tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type,
      tags,
    };

    this.metrics.push(metric);
    this.trimArray(this.metrics);

    // 发送到服务器
    this.sendToServer('/api/v1/monitoring/metrics', metric);
  }

  trackAction(action: string, target: string, metadata?: Record<string, any>): void {
    const userAction: UserAction = {
      action,
      target,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      metadata,
    };

    this.actions.push(userAction);
    this.trimArray(this.actions);

    // 发送到服务器
    this.sendToServer('/api/v1/monitoring/actions', userAction);
  }

  trackApiCall(url: string, method: string, status: number, duration: number, error?: string): void {
    const apiMetric: ApiMetric = {
      url,
      method,
      status,
      duration,
      timestamp: Date.now(),
      userId: this.userId,
      error,
    };

    this.apiMetrics.push(apiMetric);
    this.trimArray(this.apiMetrics);

    // 发送到服务器
    this.sendToServer('/api/v1/monitoring/api', apiMetric);
  }

  private trimArray(array: any[]): void {
    if (array.length > this.maxStorageSize) {
      array.splice(0, array.length - this.maxStorageSize);
    }
  }

  private async sendToServer(endpoint: string, data: any): Promise<void> {
    try {
      // 在测试环境中跳过服务器发送
      if (typeof window === 'undefined' || !window.location) {
        console.log('Skipping server send in test environment:', endpoint, data);
        return;
      }
      
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn('Failed to send monitoring data:', error);
    }
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getActions(): UserAction[] {
    return [...this.actions];
  }

  getApiMetrics(): ApiMetric[] {
    return [...this.apiMetrics];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  clear(): void {
    this.errors = [];
    this.metrics = [];
    this.actions = [];
    this.apiMetrics = [];
  }

  // 页面性能监控
  trackPagePerformance(): void {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        this.recordMetric('page_load_time', perfData.loadEventEnd - perfData.navigationStart, 'timing');
        this.recordMetric('dom_ready_time', perfData.domContentLoadedEventEnd - perfData.navigationStart, 'timing');
        this.recordMetric('first_byte_time', perfData.responseStart - perfData.navigationStart, 'timing');
        this.recordMetric('dns_lookup_time', perfData.domainLookupEnd - perfData.domainLookupStart, 'timing');
        this.recordMetric('tcp_connect_time', perfData.connectEnd - perfData.connectStart, 'timing');
      }
    }
  }

  // 内存使用监控
  trackMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory_used', memory.usedJSHeapSize, 'gauge');
      this.recordMetric('memory_total', memory.totalJSHeapSize, 'gauge');
      this.recordMetric('memory_limit', memory.jsHeapSizeLimit, 'gauge');
    }
  }

  // 网络状态监控
  trackNetworkStatus(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.recordMetric('network_effective_type', connection.effectiveType === '4g' ? 4 : 3, 'gauge');
      this.recordMetric('network_downlink', connection.downlink, 'gauge');
      this.recordMetric('network_rtt', connection.rtt, 'gauge');
    }
  }

  // 用户交互监控
  setupUserInteractionTracking(): void {
    // 点击事件
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackAction('click', target.tagName + (target.className ? '.' + target.className : ''), {
        x: event.clientX,
        y: event.clientY,
        url: window.location.href,
      });
    });

    // 滚动事件
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackAction('scroll', 'window', {
          scrollY: window.scrollY,
          scrollX: window.scrollX,
          url: window.location.href,
        });
      }, 100);
    });

    // 页面离开事件
    window.addEventListener('beforeunload', () => {
      this.trackAction('page_unload', window.location.href, {
        timeOnPage: Date.now() - performance.timing.navigationStart,
      });
    });
  }
}

// 创建全局监控实例
export const monitoring = new MonitoringService();

// 错误边界组件
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

// React错误边界
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    monitoring.captureError({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      component: errorInfo.componentStack,
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement('div', {
        style: { padding: '20px', textAlign: 'center' }
      }, [
        React.createElement('h2', { key: 'title' }, '出现了一些问题'),
        React.createElement('p', { key: 'message' }, '我们正在努力修复这个问题，请稍后再试。'),
        React.createElement('button', {
          key: 'reload',
          onClick: () => window.location.reload()
        }, '重新加载页面')
      ]);
    }

    return this.props.children;
  }
}

// 性能监控Hook
export function usePerformanceMonitoring(componentName: string): void {
  const startTime = React.useRef<number>(Date.now());

  React.useEffect(() => {
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;
    
    monitoring.recordMetric(`component_render_time_${componentName}`, renderTime, 'timing');
  });

  return {
    trackAction: (action: string, target: string, metadata?: Record<string, any>): void => {
      monitoring.trackAction(action, target, { ...metadata, component: componentName });
    },
  };
}

// 自动初始化监控
if (typeof window !== 'undefined') {
  // 设置用户交互监控
  monitoring.setupUserInteractionTracking();
  
  // 页面加载完成后记录性能数据
  window.addEventListener('load', () => {
    setTimeout(() => {
      monitoring.trackPagePerformance();
      monitoring.trackMemoryUsage();
      monitoring.trackNetworkStatus();
    }, 1000);
  });
}
