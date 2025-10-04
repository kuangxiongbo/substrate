/**
 * 主题包加载器
 * 基于 Spec-Kit 方法的动态主题包加载系统
 */

import type {
  ThemePackageConfig,
  ThemePackageLoader,
  ValidationResult,
  ThemePackageOptions,
} from './types';
import { themePackageValidator } from './validator';
import { themePackageRegistry } from './registry';

export class ThemePackageLoaderImpl implements ThemePackageLoader {
  private options: ThemePackageOptions;
  private cache: Map<string, ThemePackageConfig> = new Map();
  private loadingPromises: Map<string, Promise<ThemePackageConfig>> = new Map();

  constructor(options: ThemePackageOptions = {}) {
    this.options = {
      autoLoad: true,
      validateOnLoad: true,
      cacheEnabled: true,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      fallbackPackage: 'light',
      strictMode: false,
      ...options,
    };
  }

  /**
   * 加载单个主题包
   */
  async load(packageId: string): Promise<ThemePackageConfig> {
    // 检查缓存
    if (this.options.cacheEnabled && this.cache.has(packageId)) {
      const cached = this.cache.get(packageId)!;
      if (this.isCacheValid(cached)) {
        return cached;
      } else {
        this.cache.delete(packageId);
      }
    }

    // 检查是否正在加载
    if (this.loadingPromises.has(packageId)) {
      return this.loadingPromises.get(packageId)!;
    }

    // 创建加载Promise
    const loadPromise = this.loadPackageInternal(packageId);
    this.loadingPromises.set(packageId, loadPromise);

    try {
      const config = await loadPromise;
      
      // 缓存结果
      if (this.options.cacheEnabled) {
        this.cache.set(packageId, config);
      }
      
      return config;
    } finally {
      this.loadingPromises.delete(packageId);
    }
  }

  /**
   * 加载所有主题包
   */
  async loadAll(): Promise<ThemePackageConfig[]> {
    const packageIds = this.getAvailablePackageIds();
    const loadPromises = packageIds.map(id => this.load(id));
    
    try {
      const configs = await Promise.all(loadPromises);
      return configs.filter(config => config !== null);
    } catch (error) {
      console.error('Error loading theme packages:', error);
      return [];
    }
  }

  /**
   * 验证主题包配置
   */
  validate(config: ThemePackageConfig): boolean {
    const result = themePackageValidator.validate(config);
    
    if (!result.valid && this.options.strictMode) {
      throw new Error(`Theme package validation failed: ${result.errors.join(', ')}`);
    }
    
    return result.valid;
  }

  /**
   * 注册主题包
   */
  register(config: ThemePackageConfig): void {
    // 验证配置
    if (this.options.validateOnLoad && !this.validate(config)) {
      throw new Error('Invalid theme package configuration');
    }

    // 注册到注册表
    themePackageRegistry.register(config);
    
    // 缓存配置
    if (this.options.cacheEnabled) {
      this.cache.set(config.meta.id, config);
    }
  }

  /**
   * 注销主题包
   */
  unregister(packageId: string): void {
    // 从注册表注销
    themePackageRegistry.unregister(packageId);
    
    // 从缓存移除
    this.cache.delete(packageId);
  }

  /**
   * 获取已注册的主题包
   */
  getRegistered(): ThemePackageConfig[] {
    return themePackageRegistry.getAll();
  }

  /**
   * 预加载主题包
   */
  async preload(packageIds: string[]): Promise<void> {
    const loadPromises = packageIds.map(id => this.load(id));
    await Promise.all(loadPromises);
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存状态
   */
  getCacheStatus(): {
    size: number;
    keys: string[];
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: 0, // 这里可以实现命中率统计
    };
  }

  /**
   * 内部加载方法
   */
  private async loadPackageInternal(packageId: string): Promise<ThemePackageConfig> {
    try {
      // 首先检查注册表
      const registered = themePackageRegistry.get(packageId);
      if (registered) {
        return registered;
      }

      // 尝试从文件系统加载
      const config = await this.loadFromFileSystem(packageId);
      
      // 验证配置
      if (this.options.validateOnLoad && !this.validate(config)) {
        throw new Error(`Invalid theme package configuration for '${packageId}'`);
      }

      // 自动注册
      if (this.options.autoLoad) {
        themePackageRegistry.register(config);
      }

      return config;
    } catch (error) {
      console.error(`Failed to load theme package '${packageId}':`, error);
      
      // 尝试加载备用主题包
      if (this.options.fallbackPackage && packageId !== this.options.fallbackPackage) {
        console.log(`Loading fallback theme package '${this.options.fallbackPackage}'`);
        return this.load(this.options.fallbackPackage);
      }
      
      throw error;
    }
  }

  /**
   * 从文件系统加载主题包
   */
  private async loadFromFileSystem(packageId: string): Promise<ThemePackageConfig> {
    try {
      // 动态导入主题包
      const module = await import(`../packages/${packageId}/index.ts`);
      
      if (!module.default) {
        throw new Error(`Theme package '${packageId}' does not export a default configuration`);
      }
      
      return module.default;
    } catch (error) {
      throw new Error(`Failed to load theme package '${packageId}' from file system: ${error}`);
    }
  }

  /**
   * 获取可用的主题包ID列表
   * 自动发现并返回所有可用的主题包
   */
  private getAvailablePackageIds(): string[] {
    // 自动发现主题包
    const availablePackages: string[] = [];
    
    // 尝试动态导入所有可能的主题包
    const possiblePackages = ['light', 'dark', 'purple', 'cyan', 'high-contrast'];
    
    for (const packageId of possiblePackages) {
      try {
        // 检查主题包是否存在（通过尝试导入）
        const packagePath = `../packages/${packageId}/index.ts`;
        // 这里我们使用静态列表，但可以扩展为动态发现
        if (['light', 'dark'].includes(packageId)) {
          availablePackages.push(packageId);
        }
      } catch (error) {
        // 主题包不存在，跳过
        console.debug(`Theme package '${packageId}' not found, skipping...`);
      }
    }
    
    return availablePackages;
  }

  /**
   * 检查缓存是否有效
   */
  private isCacheValid(config: ThemePackageConfig): boolean {
    if (!this.options.cacheTimeout) {
      return true;
    }
    
    const now = Date.now();
    const updatedAt = new Date(config.meta.updatedAt).getTime();
    
    return (now - updatedAt) < this.options.cacheTimeout;
  }

  /**
   * 更新选项
   */
  updateOptions(newOptions: Partial<ThemePackageOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * 获取当前选项
   */
  getOptions(): ThemePackageOptions {
    return { ...this.options };
  }

  /**
   * 重新加载主题包
   */
  async reload(packageId: string): Promise<ThemePackageConfig> {
    // 清除缓存
    this.cache.delete(packageId);
    
    // 重新加载
    return this.load(packageId);
  }

  /**
   * 批量重新加载
   */
  async reloadAll(): Promise<ThemePackageConfig[]> {
    // 清除所有缓存
    this.clearCache();
    
    // 重新加载所有主题包
    return this.loadAll();
  }

  /**
   * 检查主题包是否存在
   */
  async exists(packageId: string): Promise<boolean> {
    try {
      await this.load(packageId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取主题包信息
   */
  async getPackageInfo(packageId: string): Promise<{
    exists: boolean;
    loaded: boolean;
    cached: boolean;
    config?: ThemePackageConfig;
  }> {
    const exists = await this.exists(packageId);
    const loaded = themePackageRegistry.has(packageId);
    const cached = this.cache.has(packageId);
    const config = themePackageRegistry.get(packageId);

    return {
      exists,
      loaded,
      cached,
      config,
    };
  }
}

// 创建默认加载器实例
export const themePackageLoader = new ThemePackageLoaderImpl();






