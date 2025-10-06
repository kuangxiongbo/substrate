/**
 * 布局包装器组件
 * 基于Spec-Kit方法重构的布局包装器
 */

import React from 'react';
import { LayoutProvider, useLayout } from '../../contexts/LayoutContext';
import SidebarLayout from './SidebarLayout';
import TopMenuLayout from './TopMenuLayout';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { layout } = useLayout();

  // 根据布局类型渲染不同的布局组件
  if (layout.type === 'sidebar') {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  if (layout.type === 'top_menu') {
    return <TopMenuLayout>{children}</TopMenuLayout>;
  }

  // 默认使用侧边栏布局
  return <SidebarLayout>{children}</SidebarLayout>;
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
};

export default LayoutWrapper;





















