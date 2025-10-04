/**
 * 主题包自动发现功能
 * 自动扫描和发现可用的主题包
 */

import type { ThemePackageConfig } from './types';

/**
 * 主题包自动发现器
 */
export class ThemePackageAutoDiscovery {
  private static instance: ThemePackageAutoDiscovery;
  private discoveredPackages: Map<string, ThemePackageConfig> = new Map();
  private discoveryCache: Map<string, boolean> = new Map();

  /**
   * 获取单例实例
   */
  public static getInstance(): ThemePackageAutoDiscovery {
    if (!ThemePackageAutoDiscovery.instance) {
      ThemePackageAutoDiscovery.instance = new ThemePackageAutoDiscovery();
    }
    return ThemePackageAutoDiscovery.instance;
  }

  /**
   * 自动发现所有可用的主题包
   */
  public async discoverAllPackages(): Promise<ThemePackageConfig[]> {
    // 如果已经发现过，直接返回缓存的结果
    if (this.discoveredPackages.size > 0) {
      return Array.from(this.discoveredPackages.values());
    }

    const discoveredPackages: ThemePackageConfig[] = [];
    
    // 预定义的主题包列表（可以扩展为动态扫描）
    const knownPackages = [
      { id: 'light', path: '../packages/light/index.ts' },
      { id: 'dark', path: '../packages/dark/index.ts' },
      // 可以添加更多主题包
      // { id: 'purple', path: '../packages/purple/index.ts' },
      // { id: 'cyan', path: '../packages/cyan/index.ts' },
      // { id: 'high-contrast', path: '../packages/high-contrast/index.ts' },
    ];

    for (const packageInfo of knownPackages) {
      try {
        // 检查是否已经发现过
        if (this.discoveredPackages.has(packageInfo.id)) {
          const cachedPackage = this.discoveredPackages.get(packageInfo.id);
          if (cachedPackage) {
            discoveredPackages.push(cachedPackage);
          }
          continue;
        }

        const themePackage = await this.discoverPackage(packageInfo.id, packageInfo.path);
        if (themePackage) {
          discoveredPackages.push(themePackage);
          this.discoveredPackages.set(packageInfo.id, themePackage);
        }
      } catch (error) {
        console.debug(`Failed to discover theme package '${packageInfo.id}':`, error);
      }
    }

    return discoveredPackages;
  }

  /**
   * 发现单个主题包
   */
  private async discoverPackage(packageId: string, packagePath: string): Promise<ThemePackageConfig | null> {
    try {
      // 检查缓存
      if (this.discoveryCache.has(packageId)) {
        return this.discoveredPackages.get(packageId) || null;
      }

      // 动态导入主题包
      const module = await import(packagePath);
      
      if (!module.default) {
        throw new Error(`Theme package '${packageId}' does not export a default configuration`);
      }

      const themePackage: ThemePackageConfig = module.default;
      
      // 验证主题包结构
      if (!this.validateThemePackage(themePackage)) {
        throw new Error(`Invalid theme package structure for '${packageId}'`);
      }

      // 缓存结果
      this.discoveryCache.set(packageId, true);
      this.discoveredPackages.set(packageId, themePackage);

      console.log(`✅ Discovered theme package: ${themePackage.meta.displayName} (${themePackage.meta.id})`);
      
      return themePackage;
    } catch (error) {
      console.debug(`❌ Failed to discover theme package '${packageId}':`, error);
      this.discoveryCache.set(packageId, false);
      return null;
    }
  }

  /**
   * 验证主题包结构
   */
  private validateThemePackage(themePackage: any): boolean {
    return (
      themePackage &&
      themePackage.meta &&
      typeof themePackage.meta.id === 'string' &&
      typeof themePackage.meta.name === 'string' &&
      typeof themePackage.meta.displayName === 'string' &&
      typeof themePackage.meta.description === 'string' &&
      themePackage.token &&
      themePackage.components
    );
  }

  /**
   * 获取已发现的主题包
   */
  public getDiscoveredPackages(): ThemePackageConfig[] {
    return Array.from(this.discoveredPackages.values());
  }

  /**
   * 获取主题包信息
   */
  public getPackageInfo(packageId: string): ThemePackageConfig | null {
    return this.discoveredPackages.get(packageId) || null;
  }

  /**
   * 检查主题包是否存在
   */
  public hasPackage(packageId: string): boolean {
    return this.discoveredPackages.has(packageId);
  }

  /**
   * 获取主题包统计信息
   */
  public getDiscoveryStats() {
    return {
      totalDiscovered: this.discoveredPackages.size,
      packages: Array.from(this.discoveredPackages.keys()),
      cacheSize: this.discoveryCache.size,
    };
  }

  /**
   * 清除发现缓存
   */
  public clearCache(): void {
    this.discoveredPackages.clear();
    this.discoveryCache.clear();
  }

  /**
   * 重新发现主题包
   */
  public async rediscover(): Promise<ThemePackageConfig[]> {
    this.clearCache();
    return await this.discoverAllPackages();
  }
}

// 导出单例实例
export const themePackageAutoDiscovery = ThemePackageAutoDiscovery.getInstance();






