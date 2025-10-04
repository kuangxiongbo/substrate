/**
 * 主题包注册表
 * 基于 Spec-Kit 方法的主题包注册系统
 */

import type {
  ThemePackageConfig,
  ThemePackageRegistry,
  ValidationResult,
} from './types';
import { themePackageValidator } from './validator';

export class ThemePackageRegistryImpl implements ThemePackageRegistry {
  private packages: Map<string, ThemePackageConfig> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * 注册主题包
   */
  register(config: ThemePackageConfig, overwrite: boolean = false): void {
    // 验证主题包配置
    const validation = themePackageValidator.validate(config);
    if (!validation.valid) {
      throw new Error(`Invalid theme package configuration: ${validation.errors.join(', ')}`);
    }

    // 检查ID是否已存在
    if (this.packages.has(config.meta.id) && !overwrite) {
      throw new Error(`Theme package with ID '${config.meta.id}' already exists`);
    }

    const isUpdate = this.packages.has(config.meta.id);
    
    // 注册主题包
    this.packages.set(config.meta.id, config);
    
    // 触发相应事件
    if (isUpdate) {
      this.emit('packageUpdated', config);
      console.log(`Theme package '${config.meta.id}' updated successfully`);
    } else {
      this.emit('packageRegistered', config);
      console.log(`Theme package '${config.meta.id}' registered successfully`);
    }
  }

  /**
   * 注销主题包
   */
  unregister(packageId: string): void {
    if (!this.packages.has(packageId)) {
      throw new Error(`Theme package with ID '${packageId}' not found`);
    }

    this.packages.delete(packageId);
    
    // 触发注销事件
    this.emit('packageUnregistered', packageId);
    
    console.log(`Theme package '${packageId}' unregistered successfully`);
  }

  /**
   * 获取主题包
   */
  get(packageId: string): ThemePackageConfig | undefined {
    return this.packages.get(packageId);
  }

  /**
   * 获取所有主题包
   */
  getAll(): ThemePackageConfig[] {
    return Array.from(this.packages.values());
  }

  /**
   * 检查主题包是否存在
   */
  has(packageId: string): boolean {
    return this.packages.has(packageId);
  }

  /**
   * 清空所有主题包
   */
  clear(): void {
    const packageIds = Array.from(this.packages.keys());
    this.packages.clear();
    
    // 触发清空事件
    packageIds.forEach(id => {
      this.emit('packageUnregistered', id);
    });
    
    console.log('All theme packages cleared');
  }

  /**
   * 获取主题包数量
   */
  size(): number {
    return this.packages.size;
  }

  /**
   * 获取所有主题包ID
   */
  getPackageIds(): string[] {
    return Array.from(this.packages.keys());
  }

  /**
   * 按分类获取主题包
   */
  getByCategory(category: string): ThemePackageConfig[] {
    return this.getAll().filter(pkg => pkg.meta.category === category);
  }

  /**
   * 按标签获取主题包
   */
  getByTag(tag: string): ThemePackageConfig[] {
    return this.getAll().filter(pkg => pkg.meta.tags.includes(tag));
  }

  /**
   * 搜索主题包
   */
  search(query: string): ThemePackageConfig[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(pkg => 
      pkg.meta.name.toLowerCase().includes(lowerQuery) ||
      pkg.meta.displayName.toLowerCase().includes(lowerQuery) ||
      pkg.meta.description.toLowerCase().includes(lowerQuery) ||
      pkg.meta.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * 更新主题包
   */
  update(packageId: string, updates: Partial<ThemePackageConfig>): void {
    const existing = this.packages.get(packageId);
    if (!existing) {
      throw new Error(`Theme package with ID '${packageId}' not found`);
    }

    // 合并更新
    const updated = { ...existing, ...updates };
    
    // 验证更新后的配置
    const validation = themePackageValidator.validate(updated);
    if (!validation.valid) {
      throw new Error(`Invalid updated theme package configuration: ${validation.errors.join(', ')}`);
    }

    // 更新主题包
    this.packages.set(packageId, updated);
    
    // 触发更新事件
    this.emit('packageUpdated', updated);
    
    console.log(`Theme package '${packageId}' updated successfully`);
  }

  /**
   * 克隆主题包
   */
  clone(packageId: string, newId: string, newName?: string): void {
    const original = this.packages.get(packageId);
    if (!original) {
      throw new Error(`Theme package with ID '${packageId}' not found`);
    }

    // 创建克隆
    const cloned: ThemePackageConfig = {
      ...original,
      meta: {
        ...original.meta,
        id: newId,
        name: newName || `${original.meta.name} (Copy)`,
        displayName: newName || `${original.meta.displayName} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    // 注册克隆的主题包
    this.register(cloned);
    
    console.log(`Theme package '${packageId}' cloned as '${newId}'`);
  }

  /**
   * 导出主题包配置
   */
  export(packageId: string): string {
    const config = this.packages.get(packageId);
    if (!config) {
      throw new Error(`Theme package with ID '${packageId}' not found`);
    }

    return JSON.stringify(config, null, 2);
  }

  /**
   * 导入主题包配置
   */
  import(json: string): void {
    try {
      const config: ThemePackageConfig = JSON.parse(json);
      this.register(config);
    } catch (error) {
      throw new Error(`Failed to import theme package: ${error}`);
    }
  }

  /**
   * 验证主题包
   */
  validate(packageId: string): ValidationResult {
    const config = this.packages.get(packageId);
    if (!config) {
      return {
        valid: false,
        errors: [`Theme package with ID '${packageId}' not found`],
        warnings: [],
      };
    }

    return themePackageValidator.validate(config);
  }

  /**
   * 获取主题包统计信息
   */
  getStats(): {
    total: number;
    byCategory: Record<string, number>;
    byAuthor: Record<string, number>;
    recentlyUpdated: ThemePackageConfig[];
  } {
    const packages = this.getAll();
    const byCategory: Record<string, number> = {};
    const byAuthor: Record<string, number> = {};
    
    packages.forEach(pkg => {
      // 按分类统计
      byCategory[pkg.meta.category] = (byCategory[pkg.meta.category] || 0) + 1;
      
      // 按作者统计
      byAuthor[pkg.meta.author] = (byAuthor[pkg.meta.author] || 0) + 1;
    });

    // 最近更新的主题包
    const recentlyUpdated = packages
      .sort((a, b) => new Date(b.meta.updatedAt).getTime() - new Date(a.meta.updatedAt).getTime())
      .slice(0, 5);

    return {
      total: packages.length,
      byCategory,
      byAuthor,
      recentlyUpdated,
    };
  }

  /**
   * 事件监听器管理
   */
  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: string, listener: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in theme package event listener for '${event}':`, error);
        }
      });
    }
  }

  /**
   * 清理所有事件监听器
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }
}

// 创建默认注册表实例
export const themePackageRegistry = new ThemePackageRegistryImpl();






