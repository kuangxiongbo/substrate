/**
 * 样式应用器
 * 将主题包生成的CSS样式应用到DOM元素
 */

import type { ThemePackageConfig } from './types';
import { generateThemeCSS } from './style-generator';
import type { StyleGeneratorOptions } from './style-generator';

export interface StyleApplierOptions {
  targetSelector?: string;
  insertPosition?: 'head' | 'body';
  replaceExisting?: boolean;
  minify?: boolean;
}

export class StyleApplier {
  private theme: ThemePackageConfig;
  private options: StyleApplierOptions;
  private styleElement: HTMLStyleElement | null = null;

  constructor(theme: ThemePackageConfig, options: StyleApplierOptions = {}) {
    this.theme = theme;
    this.options = {
      targetSelector: 'body',
      insertPosition: 'head',
      replaceExisting: true,
      minify: false,
      ...options,
    };
  }

  /**
   * 应用主题样式到DOM
   */
  apply(): void {
    const css = this.generateCSS();
    this.injectCSS(css);
    this.applyThemeClass();
  }

  /**
   * 移除主题样式
   */
  remove(): void {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    this.removeThemeClass();
  }

  /**
   * 更新主题样式
   */
  update(newTheme: ThemePackageConfig): void {
    this.theme = newTheme;
    this.apply();
  }

  /**
   * 生成CSS
   */
  private generateCSS(): string {
    const generatorOptions: StyleGeneratorOptions = {
      includeLayout: true,
      includeComponents: true,
      includeAnimations: true,
      includeResponsive: true,
      minify: this.options.minify,
    };

    return generateThemeCSS(this.theme, generatorOptions);
  }

  /**
   * 注入CSS到DOM
   */
  private injectCSS(css: string): void {
    // 移除现有的样式
    if (this.styleElement) {
      this.styleElement.remove();
    }

    // 创建新的样式元素
    this.styleElement = document.createElement('style');
    this.styleElement.id = `theme-${this.theme.meta.id}-styles`;
    this.styleElement.type = 'text/css';
    this.styleElement.textContent = css;

    // 插入到指定位置
    const targetElement = this.options.insertPosition === 'head' 
      ? document.head 
      : document.body;
    
    targetElement.appendChild(this.styleElement);
  }

  /**
   * 应用主题类名
   */
  private applyThemeClass(): void {
    const targetElement = document.querySelector(this.options.targetSelector!);
    if (targetElement) {
      // 移除其他主题类
      targetElement.classList.remove('light-theme', 'dark-theme', 'high-contrast-theme', 'purple-theme', 'cyan-theme');
      
      // 添加当前主题类
      const themeClass = `${this.theme.meta.id}-theme`;
      targetElement.classList.add(themeClass);
      
      // 同时添加到html元素，确保全局覆盖
      document.documentElement.classList.remove('light-theme', 'dark-theme', 'high-contrast-theme', 'purple-theme', 'cyan-theme');
      document.documentElement.classList.add(themeClass);
      
      console.log(`Applied theme class: ${themeClass} to ${this.options.targetSelector}`);
    } else {
      console.warn(`Target element not found: ${this.options.targetSelector}`);
    }
  }

  /**
   * 移除主题类名
   */
  private removeThemeClass(): void {
    const targetElement = document.querySelector(this.options.targetSelector!);
    if (targetElement) {
      targetElement.classList.remove(`${this.theme.meta.id}-theme`);
    }
    
    // 同时从html元素移除
    document.documentElement.classList.remove(`${this.theme.meta.id}-theme`);
  }

  /**
   * 获取当前应用的CSS
   */
  getAppliedCSS(): string | null {
    return this.styleElement?.textContent || null;
  }

  /**
   * 检查样式是否已应用
   */
  isApplied(): boolean {
    return this.styleElement !== null && document.contains(this.styleElement);
  }
}

/**
 * 创建样式应用器实例
 */
export function createStyleApplier(
  theme: ThemePackageConfig,
  options?: StyleApplierOptions
): StyleApplier {
  return new StyleApplier(theme, options);
}

/**
 * 应用主题样式
 */
export function applyThemeStyles(
  theme: ThemePackageConfig,
  options?: StyleApplierOptions
): StyleApplier {
  const applier = createStyleApplier(theme, options);
  applier.apply();
  return applier;
}

/**
 * 全局样式应用器管理器
 */
export class GlobalStyleManager {
  private static instance: GlobalStyleManager;
  private currentApplier: StyleApplier | null = null;

  private constructor() {}

  static getInstance(): GlobalStyleManager {
    if (!GlobalStyleManager.instance) {
      GlobalStyleManager.instance = new GlobalStyleManager();
    }
    return GlobalStyleManager.instance;
  }

  /**
   * 应用主题
   */
  applyTheme(theme: ThemePackageConfig, options?: StyleApplierOptions): void {
    // 移除当前主题
    if (this.currentApplier) {
      this.currentApplier.remove();
    }

    // 应用新主题
    this.currentApplier = createStyleApplier(theme, options);
    this.currentApplier.apply();
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): ThemePackageConfig | null {
    return this.currentApplier ? this.currentApplier['theme'] : null;
  }

  /**
   * 移除当前主题
   */
  removeCurrentTheme(): void {
    if (this.currentApplier) {
      this.currentApplier.remove();
      this.currentApplier = null;
    }
  }
}

/**
 * 获取全局样式管理器实例
 */
export function getGlobalStyleManager(): GlobalStyleManager {
  return GlobalStyleManager.getInstance();
}


