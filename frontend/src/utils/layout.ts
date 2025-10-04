/**
 * 布局工具函数
 * 基于Spec-Kit方法实现的布局相关工具函数
 */

import { LayoutType, LayoutConfig, LAYOUT_CONSTANTS } from '../contexts/LayoutContext';

// 布局验证结果接口
export interface LayoutValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 响应式断点
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

// 布局配置验证
export const validateLayoutConfig = (config: LayoutConfig): LayoutValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 验证布局类型
  if (!config.type || (config.type !== 'sidebar' && config.type !== 'top')) {
    errors.push('Invalid layout type');
  }

  // 验证宽度
  if (config.width && (config.width < 200 || config.width > 400)) {
    warnings.push('Layout width should be between 200px and 400px');
  }

  // 验证高度
  if (config.height && (config.height < 48 || config.height > 80)) {
    warnings.push('Layout height should be between 48px and 80px');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// 获取当前断点
export const getCurrentBreakpoint = (): keyof typeof BREAKPOINTS => {
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

// 检查是否为移动设备
export const isMobile = (): boolean => {
  return window.innerWidth < BREAKPOINTS.md;
};

// 检查是否为平板设备
export const isTablet = (): boolean => {
  const width = window.innerWidth;
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
};

// 检查是否为桌面设备
export const isDesktop = (): boolean => {
  return window.innerWidth >= BREAKPOINTS.lg;
};

// 计算布局尺寸
export const calculateLayoutDimensions = (config: LayoutConfig) => {
  const dimensions = {
    sidebarWidth: LAYOUT_CONSTANTS.SIDEBAR_WIDTH,
    sidebarCollapsedWidth: LAYOUT_CONSTANTS.SIDEBAR_COLLAPSED_WIDTH,
    topMenuHeight: LAYOUT_CONSTANTS.TOP_MENU_HEIGHT,
  };

  if (config.type === 'sidebar') {
    dimensions.sidebarWidth = config.collapsed 
      ? LAYOUT_CONSTANTS.SIDEBAR_COLLAPSED_WIDTH 
      : (config.width || LAYOUT_CONSTANTS.SIDEBAR_WIDTH);
  }

  if (config.type === 'top') {
    dimensions.topMenuHeight = config.height || LAYOUT_CONSTANTS.TOP_MENU_HEIGHT;
  }

  return dimensions;
};

// 生成布局CSS变量
export const generateLayoutCSSVariables = (config: LayoutConfig): Record<string, string> => {
  const dimensions = calculateLayoutDimensions(config);
  
  return {
    '--layout-type': config.type,
    '--sidebar-width': `${dimensions.sidebarWidth}px`,
    '--sidebar-collapsed-width': `${dimensions.sidebarCollapsedWidth}px`,
    '--top-menu-height': `${dimensions.topMenuHeight}px`,
    '--layout-fixed': config.fixed ? '1' : '0',
    '--layout-transition-duration': `${LAYOUT_CONSTANTS.ANIMATION_DURATION}ms`,
  };
};

// 应用布局CSS变量
export const applyLayoutCSSVariables = (config: LayoutConfig): void => {
  const variables = generateLayoutCSSVariables(config);
  const root = document.documentElement;

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // 添加布局类名
  root.className = root.className.replace(/layout-\w+/g, '');
  root.classList.add(`layout-${config.type}`);
  
  if (config.collapsed) {
    root.classList.add('layout-collapsed');
  }
  
  if (config.fixed) {
    root.classList.add('layout-fixed');
  }
};

// 布局切换动画
export const animateLayoutSwitch = (
  fromConfig: LayoutConfig, 
  toConfig: LayoutConfig,
  duration: number = LAYOUT_CONSTANTS.ANIMATION_DURATION
): Promise<void> => {
  return new Promise((resolve) => {
    const root = document.documentElement;
    
    // 添加过渡类
    root.classList.add('layout-transitioning');
    
    // 应用新配置
    applyLayoutCSSVariables(toConfig);
    
    // 等待动画完成
    setTimeout(() => {
      root.classList.remove('layout-transitioning');
      resolve();
    }, duration);
  });
};

// 获取布局统计信息
export const getLayoutStats = (config: LayoutConfig) => {
  const dimensions = calculateLayoutDimensions(config);
  const breakpoint = getCurrentBreakpoint();
  
  return {
    type: config.type,
    collapsed: config.collapsed || false,
    fixed: config.fixed || false,
    dimensions,
    breakpoint,
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
  };
};

// 重置布局配置
export const resetLayoutConfig = (): LayoutConfig => {
  const defaultConfig = {
    type: 'sidebar' as const,
    collapsed: false,
    theme: 'light' as const,
    fixed: true,
    width: LAYOUT_CONSTANTS.SIDEBAR_WIDTH,
    height: LAYOUT_CONSTANTS.TOP_MENU_HEIGHT,
  };
  
  return defaultConfig;
};

// 导出布局工具函数
export const layoutUtils = {
  validateLayoutConfig,
  getCurrentBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  calculateLayoutDimensions,
  generateLayoutCSSVariables,
  applyLayoutCSSVariables,
  animateLayoutSwitch,
  getLayoutStats,
  resetLayoutConfig
};






