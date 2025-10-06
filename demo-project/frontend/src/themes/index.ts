/**
 * 主题包系统统一导出
 * 基于 Spec-Kit 方法的可扩展主题架构
 */

// 导入管理器实例用于内部使用
import { themePackageManager } from './core/manager';

// 核心架构导出
export * from './core/types';
export * from './core/validator';
export * from './core/registry';
export * from './core/loader';
export * from './core/manager';
export * from './core/auto-discovery';
export * from './core/accessibility';
export * from './core/menu-variants';

// 默认实例导出
export { themePackageValidator } from './core/validator';
export { themePackageRegistry } from './core/registry';
export { themePackageLoader } from './core/loader';
export { themePackageManager } from './core/manager';
export { themePackageAutoDiscovery } from './core/auto-discovery';
export { menuVariantManager } from './core/menu-variants';

// 可访问性检查工具
export { checkAllThemesAccessibility, generateAccessibilityOptimizations, checkColorContrast } from './accessibility-check';

// 主题包导出
export { default as lightTheme } from './packages/light';
export { default as darkTheme } from './packages/dark';

// 主题包管理器实例
export const themeManager = themePackageManager;

// 便捷方法
export const loadTheme = (packageId: string) => themePackageManager.loadPackage(packageId);
export const loadAllThemes = () => themePackageManager.loadAllPackages();
export const getTheme = (packageId: string) => themePackageManager.getPackage(packageId);
export const getAllThemes = () => themePackageManager.getAllPackages();
export const registerTheme = (config: any) => themePackageManager.registerPackage(config);
export const unregisterTheme = (packageId: string) => themePackageManager.unregisterPackage(packageId);
export const validateTheme = (config: any) => themePackageManager.validatePackage(config);
export const searchThemes = (query: string) => themePackageManager.searchPackages(query);
export const getThemesByCategory = (category: string) => themePackageManager.getPackagesByCategory(category);
export const getThemesByTag = (tag: string) => themePackageManager.getPackagesByTag(tag);

// 主题包初始化
export const initializeThemes = async () => {
  try {
    // 注册默认主题包
    await themePackageManager.loadAllPackages();
    
    console.log('Theme packages initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize theme packages:', error);
    return false;
  }
};

// 主题包统计信息
export const getThemeStats = () => themePackageManager.getStats();

// 主题包缓存管理
export const clearThemeCache = () => themePackageManager.clearCache();
export const getThemeCacheStatus = () => themePackageManager.getCacheStatus();

// 主题包导入导出
export const exportTheme = (packageId: string) => themePackageManager.exportPackage(packageId);
export const importTheme = (json: string) => themePackageManager.importPackage(json);
export const cloneTheme = (packageId: string, newId: string) => themePackageManager.clonePackage(packageId, newId);
export const mergeThemes = (baseId: string, overrideId: string, newId: string) => 
  themePackageManager.mergePackages(baseId, overrideId, newId);

// 主题包工厂方法
export const createTheme = (config: any) => themePackageManager.createPackage(config);

// 主题包选项管理
export const updateThemeOptions = (options: any) => themePackageManager.updateOptions(options);
export const getThemeOptions = () => themePackageManager.getOptions();

// 主题包预加载
export const preloadThemes = (packageIds: string[]) => themePackageManager.preloadPackages(packageIds);

// 主题包重新加载
export const reloadTheme = (packageId: string) => themePackageManager.reloadPackage(packageId);
export const reloadAllThemes = () => themePackageManager.reloadAllPackages();

// 主题包存在性检查
export const themeExists = (packageId: string) => themePackageManager.packageExists(packageId);
export const getThemeInfo = (packageId: string) => themePackageManager.getPackageInfo(packageId);

// 默认主题包ID常量
export const DEFAULT_THEME_IDS = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// 主题包分类常量
export const THEME_CATEGORIES = {
  LIGHT: 'light',
  DARK: 'dark',
  COLORFUL: 'colorful',
  MINIMAL: 'minimal',
  PROFESSIONAL: 'professional',
} as const;

// 主题包标签常量
export const THEME_TAGS = {
  LIGHT: 'light',
  DARK: 'dark',
  BRIGHT: 'bright',
  CLEAN: 'clean',
  MODERN: 'modern',
  PROFESSIONAL: 'professional',
  EYE_FRIENDLY: 'eye-friendly',
  NIGHT: 'night',
  COLORFUL: 'colorful',
  MINIMAL: 'minimal',
  CUSTOM: 'custom',
} as const;

// 主题包管理器配置选项
export const DEFAULT_THEME_OPTIONS = {
  autoLoad: true,
  validateOnLoad: true,
  cacheEnabled: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  fallbackPackage: 'light',
  strictMode: false,
} as const;

// 主题包事件类型
export const THEME_EVENTS = {
  PACKAGE_LOADED: 'packageLoaded',
  PACKAGE_REGISTERED: 'packageRegistered',
  PACKAGE_UNREGISTERED: 'packageUnregistered',
  PACKAGE_UPDATED: 'packageUpdated',
  PACKAGE_VALIDATED: 'packageValidated',
  ERROR: 'error',
} as const;

// 样式生成器和应用器
export * from './core/style-generator';
export { createStyleGenerator, generateThemeCSS } from './core/style-generator';

export * from './core/style-applier';
export { createStyleApplier, applyThemeStyles, getGlobalStyleManager } from './core/style-applier';

// 主题包管理器实例的便捷访问
export default themePackageManager;




















