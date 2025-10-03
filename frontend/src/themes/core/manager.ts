/**
 * 主题包管理器
 * 基于 Spec-Kit 方法的统一主题包管理
 */

import type {
  ThemePackageConfig,
  ThemePackageManager,
  ThemePackageOptions,
  ValidationResult,
} from './types';
import { themePackageLoader } from './loader';
import { themePackageRegistry } from './registry';
import { themePackageValidator } from './validator';
import { themePackageAutoDiscovery } from './auto-discovery';

export class ThemePackageManagerImpl implements ThemePackageManager {
  public loader: typeof themePackageLoader;
  public registry: typeof themePackageRegistry;
  public validator: typeof themePackageValidator;
  public factory: ThemePackageFactory;

  constructor(options: ThemePackageOptions = {}) {
    this.loader = themePackageLoader;
    this.registry = themePackageRegistry;
    this.validator = themePackageValidator;
    this.factory = new ThemePackageFactory();
    
    // 更新加载器选项
    this.loader.updateOptions(options);
  }

  /**
   * 加载单个主题包
   */
  async loadPackage(packageId: string): Promise<ThemePackageConfig> {
    try {
      const config = await this.loader.load(packageId);
      return config;
    } catch (error) {
      console.error(`Failed to load theme package '${packageId}':`, error);
      throw error;
    }
  }

  /**
   * 加载所有主题包
   * 使用自动发现功能
   */
  async loadAllPackages(): Promise<ThemePackageConfig[]> {
    try {
      // 使用自动发现功能
      const discoveredPackages = await themePackageAutoDiscovery.discoverAllPackages();
      
      // 注册所有发现的主题包（允许覆盖）
      for (const themePackage of discoveredPackages) {
        this.registry.register(themePackage, true);
      }

      console.log(`✅ Auto-discovered ${discoveredPackages.length} theme packages`);
      return discoveredPackages;
    } catch (error) {
      console.error('Failed to auto-discover theme packages:', error);
      
      // 回退到手动加载
      try {
        const configs = await this.loader.loadAll();
        return configs;
      } catch (fallbackError) {
        console.error('Failed to load all theme packages:', fallbackError);
        return [];
      }
    }
  }

  /**
   * 注册主题包
   */
  registerPackage(config: ThemePackageConfig): boolean {
    try {
      this.registry.register(config);
      return true;
    } catch (error) {
      console.error('Failed to register theme package:', error);
      return false;
    }
  }

  /**
   * 注销主题包
   */
  unregisterPackage(packageId: string): boolean {
    try {
      this.registry.unregister(packageId);
      return true;
    } catch (error) {
      console.error(`Failed to unregister theme package '${packageId}':`, error);
      return false;
    }
  }

  /**
   * 获取主题包
   */
  getPackage(packageId: string): ThemePackageConfig | undefined {
    return this.registry.get(packageId);
  }

  /**
   * 获取所有主题包
   */
  getAllPackages(): ThemePackageConfig[] {
    return this.registry.getAll();
  }

  /**
   * 验证主题包
   */
  validatePackage(config: ThemePackageConfig): ValidationResult {
    return this.validator.validate(config);
  }

  /**
   * 创建主题包
   */
  createPackage(config: Partial<ThemePackageConfig>): ThemePackageConfig {
    return this.factory.create(config);
  }

  /**
   * 导出主题包
   */
  exportPackage(packageId: string): string {
    return this.registry.export(packageId);
  }

  /**
   * 导入主题包
   */
  importPackage(json: string): boolean {
    try {
      this.registry.import(json);
      return true;
    } catch (error) {
      console.error('Failed to import theme package:', error);
      return false;
    }
  }

  /**
   * 克隆主题包
   */
  clonePackage(packageId: string, newId: string): boolean {
    try {
      this.registry.clone(packageId, newId);
      return true;
    } catch (error) {
      console.error(`Failed to clone theme package '${packageId}':`, error);
      return false;
    }
  }

  /**
   * 合并主题包
   */
  mergePackages(baseId: string, overrideId: string, newId: string): boolean {
    try {
      const base = this.registry.get(baseId);
      const override = this.registry.get(overrideId);
      
      if (!base || !override) {
        throw new Error('Base or override theme package not found');
      }
      
      const merged = this.factory.merge(base, override);
      merged.meta.id = newId;
      merged.meta.name = `${base.meta.name}-${override.meta.name}`;
      merged.meta.displayName = `${base.meta.displayName} + ${override.meta.displayName}`;
      merged.meta.createdAt = new Date().toISOString();
      merged.meta.updatedAt = new Date().toISOString();
      
      this.registry.register(merged);
      return true;
    } catch (error) {
      console.error('Failed to merge theme packages:', error);
      return false;
    }
  }

  /**
   * 获取主题包统计信息
   */
  getStats() {
    return this.registry.getStats();
  }

  /**
   * 搜索主题包
   */
  searchPackages(query: string): ThemePackageConfig[] {
    return this.registry.search(query);
  }

  /**
   * 按分类获取主题包
   */
  getPackagesByCategory(category: string): ThemePackageConfig[] {
    return this.registry.getByCategory(category);
  }

  /**
   * 按标签获取主题包
   */
  getPackagesByTag(tag: string): ThemePackageConfig[] {
    return this.registry.getByTag(tag);
  }

  /**
   * 预加载主题包
   */
  async preloadPackages(packageIds: string[]): Promise<void> {
    await this.loader.preload(packageIds);
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.loader.clearCache();
  }

  /**
   * 获取缓存状态
   */
  getCacheStatus() {
    return this.loader.getCacheStatus();
  }

  /**
   * 重新加载主题包
   */
  async reloadPackage(packageId: string): Promise<ThemePackageConfig> {
    return this.loader.reload(packageId);
  }

  /**
   * 重新加载所有主题包
   */
  async reloadAllPackages(): Promise<ThemePackageConfig[]> {
    return this.loader.reloadAll();
  }

  /**
   * 检查主题包是否存在
   */
  async packageExists(packageId: string): Promise<boolean> {
    return this.loader.exists(packageId);
  }

  /**
   * 获取主题包信息
   */
  async getPackageInfo(packageId: string) {
    return this.loader.getPackageInfo(packageId);
  }

  /**
   * 更新管理器选项
   */
  updateOptions(options: Partial<ThemePackageOptions>): void {
    this.loader.updateOptions(options);
  }

  /**
   * 获取当前选项
   */
  getOptions(): ThemePackageOptions {
    return this.loader.getOptions();
  }
}

/**
 * 主题包工厂类
 */
class ThemePackageFactory {
  /**
   * 创建主题包配置
   */
  create(config: Partial<ThemePackageConfig>): ThemePackageConfig {
    const now = new Date().toISOString();
    
    const defaultConfig: ThemePackageConfig = {
      meta: {
        id: 'custom-theme',
        name: 'custom-theme',
        displayName: '自定义主题',
        description: '用户自定义主题',
        version: '1.0.0',
        author: 'User',
        tags: ['custom'],
        category: 'light',
        preview: '',
        createdAt: now,
        updatedAt: now,
      },
      algorithm: null,
      token: this.getDefaultToken(),
      components: {},
    };

    return this.merge(defaultConfig, config);
  }

  /**
   * 从JSON创建主题包
   */
  fromJSON(json: string): ThemePackageConfig {
    try {
      return JSON.parse(json);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error}`);
    }
  }

  /**
   * 转换为JSON
   */
  toJSON(config: ThemePackageConfig): string {
    return JSON.stringify(config, null, 2);
  }

  /**
   * 克隆主题包
   */
  clone(config: ThemePackageConfig): ThemePackageConfig {
    return JSON.parse(JSON.stringify(config));
  }

  /**
   * 合并主题包配置
   */
  merge(base: ThemePackageConfig, override: Partial<ThemePackageConfig>): ThemePackageConfig {
    const merged = this.clone(base);
    
    if (override.meta) {
      merged.meta = { ...merged.meta, ...override.meta };
    }
    
    if (override.algorithm) {
      merged.algorithm = override.algorithm;
    }
    
    if (override.token) {
      merged.token = { ...merged.token, ...override.token };
    }
    
    if (override.components) {
      merged.components = { ...merged.components, ...override.components };
    }
    
    if (override.custom) {
      merged.custom = { ...merged.custom, ...override.custom };
    }
    
    return merged;
  }

  /**
   * 获取默认令牌配置
   */
  private getDefaultToken() {
    return {
      colorPrimary: '#1890ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#13c2c2',
      colorBgBase: '#ffffff',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBgLayout: '#f5f5f5',
      colorBgSpotlight: 'rgba(0, 0, 0, 0.85)',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorText: '#262626',
      colorTextSecondary: '#8c8c8c',
      colorTextTertiary: '#bfbfbf',
      colorTextQuaternary: '#f0f0f0',
      colorTextDisabled: '#bfbfbf',
      colorTextHeading: '#262626',
      colorTextDescription: '#8c8c8c',
      colorTextPlaceholder: '#bfbfbf',
      colorBorder: '#d9d9d9',
      colorBorderSecondary: '#f0f0f0',
      colorSplit: '#f0f0f0',
      colorFill: '#f5f5f5',
      colorFillSecondary: '#fafafa',
      colorFillTertiary: '#f0f0f0',
      colorFillQuaternary: '#fafafa',
      colorLink: '#1890ff',
      colorLinkHover: '#40a9ff',
      colorLinkActive: '#096dd9',
      borderRadius: 6,
      borderRadiusLG: 8,
      borderRadiusSM: 4,
      borderRadiusXS: 2,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      fontSizeXL: 20,
      fontSizeHeading1: 38,
      fontSizeHeading2: 30,
      fontSizeHeading3: 24,
      fontSizeHeading4: 20,
      fontSizeHeading5: 16,
      lineHeight: 1.5714285714285714,
      lineHeightLG: 1.5,
      lineHeightSM: 1.66,
      padding: 16,
      paddingLG: 24,
      paddingSM: 12,
      paddingXS: 8,
      margin: 16,
      marginLG: 24,
      marginSM: 12,
      marginXS: 8,
      motionDurationFast: '0.1s',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
      motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      motionEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      wireframe: false,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
    };
  }
}

// 创建默认管理器实例
export const themePackageManager = new ThemePackageManagerImpl();
