/**
 * 布局上下文
 */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export const LayoutType = {
  SIDEBAR: 'sidebar',
  TOP_MENU: 'top_menu',
  MIXED: 'mixed'
} as const;

export type LayoutType = typeof LayoutType[keyof typeof LayoutType];

export interface LayoutConfig {
  type: LayoutType;
  collapsed: boolean;
  sidebarWidth: number;
  topMenuHeight: number;
}

export const LAYOUT_CONSTANTS = {
  SIDEBAR_WIDTH: 200,
  SIDEBAR_WIDTH_COLLAPSED: 80,
  TOP_MENU_HEIGHT: 64,
} as const;

interface LayoutContextType {
  layout: LayoutConfig;
  setLayout: (layout: LayoutConfig) => void;
  toggleCollapsed: () => void;
  switchLayoutType: (type: LayoutType) => void;
  toggleCollapse: () => void;
  isCollapsed: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
  initialLayout?: LayoutConfig;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ 
  children, 
  initialLayout = {
    type: LayoutType.SIDEBAR,
    collapsed: false,
    sidebarWidth: LAYOUT_CONSTANTS.SIDEBAR_WIDTH,
    topMenuHeight: LAYOUT_CONSTANTS.TOP_MENU_HEIGHT,
  }
}) => {
  const [layout, setLayoutState] = useState<LayoutConfig>(initialLayout);

  const setLayout = (newLayout: LayoutConfig) => {
    setLayoutState(newLayout);
  };

  const toggleCollapsed = () => {
    setLayoutState(prev => ({
      ...prev,
      collapsed: !prev.collapsed,
      sidebarWidth: !prev.collapsed 
        ? LAYOUT_CONSTANTS.SIDEBAR_WIDTH_COLLAPSED 
        : LAYOUT_CONSTANTS.SIDEBAR_WIDTH
    }));
  };

  const switchLayoutType = (type: LayoutType) => {
    setLayoutState(prev => ({
      ...prev,
      type
    }));
  };

  const value: LayoutContextType = {
    layout,
    setLayout,
    toggleCollapsed,
    switchLayoutType,
    toggleCollapse: toggleCollapsed,
    isCollapsed: layout.collapsed,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export default LayoutContext;
