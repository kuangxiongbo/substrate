/**
 * 布局提供者组件
 * 基于Spec-Kit方法重构的布局上下文提供者
 */

import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLayoutStore, selectLayout, selectIsSidebar, selectIsTop, selectIsCollapsed, selectIsLoading, type LayoutContextType } from '../../stores/layout-store';

// 创建布局上下文
const LayoutContext = createContext<LayoutContextType | null>(null);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const layout = useLayoutStore(selectLayout);
  const isSidebar = useLayoutStore(selectIsSidebar);
  const isTop = useLayoutStore(selectIsTop);
  const isCollapsed = useLayoutStore(selectIsCollapsed);
  const isLoading = useLayoutStore(selectIsLoading);
  
  const setLayout = useLayoutStore((state) => state.setLayout);
  const toggleLayout = useLayoutStore((state) => state.toggleLayoutType);
  const toggleCollapse = useLayoutStore((state) => state.toggleCollapse);

  // 应用布局CSS变量
  useEffect(() => {
    const root = document.documentElement;
    
    // 设置布局类型
    root.className = root.className.replace(/layout-\w+/g, '');
    root.classList.add(`layout-${layout.type}`);
    
    // 设置折叠状态
    if (layout.collapsed) {
      root.classList.add('layout-collapsed');
    } else {
      root.classList.remove('layout-collapsed');
    }
    
    // 设置固定状态
    if (layout.fixed) {
      root.classList.add('layout-fixed');
    } else {
      root.classList.remove('layout-fixed');
    }
    
    // 设置CSS变量
    root.style.setProperty('--layout-type', layout.type);
    root.style.setProperty('--sidebar-width', `${layout.width || 240}px`);
    root.style.setProperty('--sidebar-collapsed-width', '80px');
    root.style.setProperty('--top-menu-height', `${layout.height || 64}px`);
    root.style.setProperty('--layout-fixed', layout.fixed ? '1' : '0');
    root.style.setProperty('--layout-transition-duration', '300ms');
  }, [layout]);

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

// 导出布局上下文
export { LayoutContext };




















