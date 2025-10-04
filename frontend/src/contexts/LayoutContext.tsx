/**
 * 布局上下文
 * 基于Spec-Kit方法实现的布局状态管理
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// 布局类型枚举
export enum LayoutType {
  SIDEBAR = 'sidebar',
  TOP = 'top'
}

// 布局配置接口
export interface LayoutConfig {
  type: LayoutType;
  collapsed?: boolean; // 仅适用于sidebar布局
  theme?: 'light' | 'dark';
  fixed?: boolean; // 固定菜单栏
  width?: number; // 菜单宽度
  height?: number; // 顶部菜单高度
}

// 布局常量
export const LAYOUT_CONSTANTS = {
  SIDEBAR_WIDTH: 240,
  SIDEBAR_COLLAPSED_WIDTH: 80,
  TOP_MENU_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  ANIMATION_DURATION: 300,
} as const;

// 布局上下文类型
export interface LayoutContextType {
  layout: LayoutConfig;
  setLayout: (layout: LayoutConfig) => void;
  toggleLayout: () => void;
  toggleCollapse: () => void;
  isSidebar: boolean;
  isTop: boolean;
  isCollapsed: boolean;
  isLoading: boolean;
}

// 布局存储键
export const LAYOUT_STORAGE_KEYS = {
  LAYOUT_CONFIG: 'layoutConfig',
  LAYOUT_HISTORY: 'layoutHistory',
  USER_PREFERENCES: 'userPreferences',
} as const;

// 应用布局CSS变量
const applyLayoutCSSVariables = (config: LayoutConfig): void => {
  const root = document.documentElement;
  
  // 设置布局类型
  root.style.setProperty('--layout-type', config.type);
  
  // 设置侧边栏宽度
  const sidebarWidth = config.collapsed ? LAYOUT_CONSTANTS.SIDEBAR_COLLAPSED_WIDTH : LAYOUT_CONSTANTS.SIDEBAR_WIDTH;
  root.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  root.style.setProperty('--sidebar-collapsed-width', `${LAYOUT_CONSTANTS.SIDEBAR_COLLAPSED_WIDTH}px`);
  
  // 设置顶部菜单高度
  root.style.setProperty('--top-menu-height', `${LAYOUT_CONSTANTS.TOP_MENU_HEIGHT}px`);
  
  // 设置内容区域高度
  const contentHeight = config.type === 'top' ? `calc(100vh - ${LAYOUT_CONSTANTS.TOP_MENU_HEIGHT}px)` : '100vh';
  root.style.setProperty('--content-height', contentHeight);
  
  // 设置内容区域宽度
  const contentWidth = config.type === 'sidebar' ? `calc(100vw - ${sidebarWidth}px)` : '100vw';
  root.style.setProperty('--content-width', contentWidth);
  
  // 设置动画持续时间
  root.style.setProperty('--layout-transition-duration', `${LAYOUT_CONSTANTS.ANIMATION_DURATION}ms`);
  
  // 设置固定状态
  root.style.setProperty('--layout-fixed', config.fixed ? '1' : '0');
  
  // 添加布局类名到body
  document.body.className = document.body.className.replace(/layout-\w+/g, '');
  document.body.classList.add(`layout-${config.type}`);
  if (config.collapsed) {
    document.body.classList.add('layout-collapsed');
  }
};

// 布局默认配置
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  type: 'sidebar',
  collapsed: false,
  theme: 'light',
  fixed: true,
  width: 240,
  height: 64,
};

// 创建布局上下文
const LayoutContext = createContext<LayoutContextType | null>(null);

// 布局提供者组件
export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [layout, setLayoutState] = useState<LayoutConfig>(DEFAULT_LAYOUT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // 从本地存储加载布局配置
  useEffect(() => {
    const loadLayoutConfig = () => {
      try {
        const savedConfig = localStorage.getItem(LAYOUT_STORAGE_KEYS.LAYOUT_CONFIG);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setLayoutState(parsedConfig);
        }
      } catch (error) {
        console.warn('Failed to load layout config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayoutConfig();
  }, []);

  // 保存布局配置到本地存储
  const saveLayoutConfig = useCallback((config: LayoutConfig) => {
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEYS.LAYOUT_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save layout config:', error);
    }
  }, []);

  // 设置布局配置
  const setLayout = useCallback((newLayout: LayoutConfig) => {
    setLayoutState(newLayout);
    saveLayoutConfig(newLayout);
  }, [saveLayoutConfig]);

  // 切换布局类型
  const toggleLayout = useCallback(() => {
    const newType = layout.type === 'sidebar' ? 'top' : 'sidebar';
    const newLayout: LayoutConfig = {
      ...layout,
      type: newType,
      collapsed: newType === 'top' ? false : layout.collapsed,
    };
    setLayout(newLayout);
  }, [layout, setLayout]);

  // 切换侧边栏折叠状态
  const toggleCollapse = useCallback(() => {
    if (layout.type === 'sidebar') {
      const newLayout: LayoutConfig = {
        ...layout,
        collapsed: !layout.collapsed,
      };
      setLayout(newLayout);
    }
  }, [layout, setLayout]);

  // 计算布局状态
  const isSidebar = layout.type === 'sidebar';
  const isTop = layout.type === 'top';
  const isCollapsed = layout.collapsed || false;

  // 应用布局CSS变量
  useEffect(() => {
    if (!isLoading) {
      applyLayoutCSSVariables(layout);
    }
  }, [layout, isLoading]);

  // 上下文值
  const contextValue: LayoutContextType = {
    layout,
    setLayout,
    toggleLayout,
    toggleCollapse,
    isSidebar,
    isTop,
    isCollapsed,
    isLoading,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

// 使用布局上下文的Hook
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// 布局工具函数
export const layoutUtils = {
  // 验证布局配置
  validateLayoutConfig: (config: LayoutConfig): boolean => {
    return config && config.type && (config.type === 'sidebar' || config.type === 'top');
  },

  // 获取布局CSS类名
  getLayoutClassName: (config: LayoutConfig): string => {
    const classes = [`layout-${config.type}`];
    if (config.collapsed) classes.push('layout-collapsed');
    if (config.fixed) classes.push('layout-fixed');
    return classes.join(' ');
  },

  // 重置布局配置
  resetLayoutConfig: (): LayoutConfig => {
    return { ...DEFAULT_LAYOUT_CONFIG };
  },
};






