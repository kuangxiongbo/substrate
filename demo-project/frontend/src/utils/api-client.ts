/**
 * 增强的API客户端
 * 提供缓存、重试、性能监控等功能
 */
import { apiCache, performanceMonitor } from './performance';

export interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}

export interface RequestConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultCache: boolean;
  private defaultCacheTTL: number;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || '/api';
    this.defaultTimeout = options.timeout || 10000;
    this.defaultRetries = options.retries || 3;
    this.defaultCache = options.cache || true;
    this.defaultCacheTTL = options.cacheTTL || 5 * 60 * 1000; // 5分钟
  }

  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    if (!params) return fullURL;

    const urlObj = new URL(fullURL);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        urlObj.searchParams.append(key, String(params[key]));
      }
    });

    return urlObj.toString();
  }

  private buildCacheKey(config: RequestConfig): string {
    const { url, method, data, params } = config;
    const keyData = {
      url: this.buildURL(url, params),
      method: method.toUpperCase(),
      data: data ? JSON.stringify(data) : '',
    };
    return btoa(JSON.stringify(keyData));
  }

  private async makeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const cacheKey = this.buildCacheKey(config);
    
    // 检查缓存
    if (config.cache !== false && this.defaultCache) {
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        console.log('Cache hit for:', config.url);
        return cachedData;
      }
    }

    performanceMonitor.startTiming(`api-${config.method}-${config.url}`);

    try {
      const response = await this.fetchWithRetry(config);
      const apiResponse: ApiResponse<T> = {
        data: await response.json(),
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config,
      };

      // 缓存成功响应
      if (response.ok && config.cache !== false && this.defaultCache) {
        apiCache.set(cacheKey, apiResponse, config.cacheTTL || this.defaultCacheTTL);
      }

      performanceMonitor.endTiming(`api-${config.method}-${config.url}`);
      return apiResponse;
    } catch (error) {
      performanceMonitor.endTiming(`api-${config.method}-${config.url}`);
      throw error;
    }
  }

  private async fetchWithRetry(config: RequestConfig): Promise<Response> {
    const retries = (config as any).retries || this.defaultRetries;
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const url = this.buildURL(config.url, config.params);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...config.headers,
        };

        // 添加认证头
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.defaultTimeout);

        const response = await fetch(url, {
          method: config.method,
          headers,
          body: config.data ? JSON.stringify(config.data) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // 指数退避
          console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  async get<T>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'GET',
      params,
      ...config,
    });
  }

  async post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'POST',
      data,
      cache: false, // POST请求不缓存
      ...config,
    });
  }

  async put<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'PUT',
      data,
      cache: false, // PUT请求不缓存
      ...config,
    });
  }

  async patch<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'PATCH',
      data,
      cache: false, // PATCH请求不缓存
      ...config,
    });
  }

  async delete<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'DELETE',
      cache: false, // DELETE请求不缓存
      ...config,
    });
  }

  // 清除缓存
  clearCache(pattern?: string): void {
    if (pattern) {
      // 简单的模式匹配清除
      const keys = Array.from((apiCache as any).cache.keys());
      keys.forEach((key: unknown) => {
        if (typeof key === 'string' && key.includes(pattern)) {
          apiCache.delete(key);
        }
      });
    } else {
      apiCache.clear();
    }
  }

  // 获取缓存统计
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: (apiCache as any).cache.size,
      keys: Array.from((apiCache as any).cache.keys()),
    };
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient({
  baseURL: '/api',
  timeout: 10000,
  retries: 3,
  cache: true,
  cacheTTL: 5 * 60 * 1000, // 5分钟
});

// 导出类型和实例
export default ApiClient;
export { ApiClient };

