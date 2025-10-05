/**
 * 性能优化工具
 * 提供缓存、懒加载、代码分割等功能
 */
import React from 'react';

// 内存缓存实现
class MemoryCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>();

  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

// 全局缓存实例
export const apiCache = new MemoryCache<any>();
export const imageCache = new MemoryCache<string>();

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 图片懒加载
export class ImageLazyLoader {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              this.observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );
  }

  observe(img: HTMLImageElement): void {
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement): void {
    this.observer.unobserve(img);
  }

  disconnect(): void {
    this.observer.disconnect();
  }
}

// 全局图片懒加载实例
export const imageLazyLoader = new ImageLazyLoader();

// 虚拟滚动工具
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export class VirtualScrollManager {
  private scrollTop = 0;
  private containerHeight = 0;
  private itemHeight = 0;
  private overscan = 5;

  constructor(options: VirtualScrollOptions) {
    this.itemHeight = options.itemHeight;
    this.containerHeight = options.containerHeight;
    this.overscan = options.overscan || 5;
  }

  updateScroll(scrollTop: number): void {
    this.scrollTop = scrollTop;
  }

  getVisibleRange(totalItems: number): { start: number; end: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.min(
      start + Math.ceil(this.containerHeight / this.itemHeight) + this.overscan,
      totalItems
    );
    return { start, end };
  }

  getOffsetY(index: number): number {
    return index * this.itemHeight;
  }
}

// 性能监控
export class PerformanceMonitor {
  private metrics: Record<string, number[]> = {};

  startTiming(name: string): void {
    performance.mark(`${name}-start`);
  }

  endTiming(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    const duration = measure.duration;
    
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    this.metrics[name].push(duration);
    
    // 清理性能标记
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  getAverageTime(name: string): number {
    const times = this.metrics[name];
    if (!times || times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    Object.keys(this.metrics).forEach((key) => {
      result[key] = {
        average: this.getAverageTime(key),
        count: this.metrics[key].length,
      };
    });
    
    return result;
  }
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();

// 预加载资源
export function preloadResource(url: string, type: 'image' | 'script' | 'style' = 'image'): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'image':
        link.as = 'image';
        break;
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
    }
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload ${url}`));
    
    document.head.appendChild(link);
  });
}

// 批量预加载
export async function preloadResources(resources: Array<{ url: string; type?: 'image' | 'script' | 'style' }>): Promise<void> {
  const promises = resources.map(({ url, type = 'image' }) => preloadResource(url, type));
  await Promise.all(promises);
}

// 代码分割工具
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

// 资源压缩检测
export function isImageOptimized(img: HTMLImageElement): boolean {
  // 检查图片是否已经压缩过
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return false;
  
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  
  const dataURL = canvas.toDataURL('image/jpeg', 0.8);
  const originalSize = img.src.length;
  const compressedSize = dataURL.length;
  
  // 如果压缩后大小减少超过20%，认为需要优化
  return (originalSize - compressedSize) / originalSize < 0.2;
}

// 内存使用监控
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  
  return { used: 0, total: 0, percentage: 0 };
}

// 网络状态检测
export function getNetworkInfo(): {
  effectiveType: string;
  downlink: number;
  rtt: number;
} {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
    };
  }
  
  return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
}
