# Task List: 多布局系统支持

## 任务概览

本任务列表详细描述了多布局系统实施的具体任务，包括左侧菜单布局、顶部菜单布局和布局切换功能的开发。

## 阶段1: 基础架构搭建

### 任务1.1: 创建布局类型定义
- [ ] 创建 `src/types/layout.ts` 文件
- [ ] 定义 `LayoutType` 枚举
- [ ] 定义 `LayoutConfig` 接口
- [ ] 定义 `LayoutContextType` 接口
- [ ] 添加布局相关的工具类型

### 任务1.2: 创建布局上下文
- [ ] 创建 `src/contexts/LayoutContext.tsx` 文件
- [ ] 实现 `LayoutProvider` 组件
- [ ] 添加布局状态管理逻辑
- [ ] 实现布局切换功能
- [ ] 添加用户偏好持久化

### 任务1.3: 创建布局工具函数
- [ ] 创建 `src/utils/layout.ts` 文件
- [ ] 实现布局配置验证函数
- [ ] 添加布局切换工具函数
- [ ] 实现响应式布局检测
- [ ] 添加布局相关的常量定义

## 阶段2: 左侧菜单布局实现

### 任务2.1: 重构现有布局组件
- [ ] 将 `AdminLayout.tsx` 重命名为 `SidebarLayout.tsx`
- [ ] 提取侧边栏相关逻辑
- [ ] 优化侧边栏样式结构
- [ ] 实现折叠/展开状态管理
- [ ] 添加侧边栏动画效果

### 任务2.2: 侧边栏菜单组件
- [ ] 创建 `src/components/menu/SidebarMenu.tsx` 组件
- [ ] 实现垂直菜单布局
- [ ] 添加菜单项图标和文字
- [ ] 实现子菜单展开/收起
- [ ] 添加菜单项选中状态

### 任务2.3: 侧边栏样式优化
- [ ] 创建 `src/styles/layout/sidebar-layout.css` 文件
- [ ] 创建 `src/styles/components/sidebar-menu.css` 文件
- [ ] 实现侧边栏基础样式
- [ ] 添加折叠/展开动画
- [ ] 优化菜单项悬停效果

### 任务2.4: 响应式适配
- [ ] 实现移动端抽屉菜单
- [ ] 添加平板端适配样式
- [ ] 实现断点响应式处理
- [ ] 优化触摸设备交互
- [ ] 添加移动端菜单动画

## 阶段3: 顶部菜单布局实现

### 任务3.1: 顶部菜单布局组件
- [ ] 创建 `src/components/layout/TopMenuLayout.tsx` 组件
- [ ] 实现顶部水平布局结构
- [ ] 添加顶部导航栏
- [ ] 实现主内容区域布局
- [ ] 添加页面标题显示

### 任务3.2: 顶部菜单组件
- [ ] 创建 `src/components/menu/TopMenu.tsx` 组件
- [ ] 实现水平菜单布局
- [ ] 添加菜单项水平排列
- [ ] 实现下拉子菜单
- [ ] 添加菜单项溢出处理

### 任务3.3: 顶部菜单样式
- [ ] 创建 `src/styles/layout/top-layout.css` 文件
- [ ] 创建 `src/styles/components/top-menu.css` 文件
- [ ] 实现顶部菜单基础样式
- [ ] 添加下拉菜单样式
- [ ] 优化菜单项悬停效果

### 任务3.4: 内容区域调整
- [ ] 调整主内容区域布局
- [ ] 实现面包屑导航组件
- [ ] 添加页面标题组件
- [ ] 优化内容区域间距
- [ ] 实现内容区域滚动

## 阶段4: 布局切换功能

### 任务4.1: 布局包装器组件
- [ ] 创建 `src/components/layout/LayoutWrapper.tsx` 组件
- [ ] 实现布局类型判断逻辑
- [ ] 添加布局组件动态渲染
- [ ] 实现路由集成
- [ ] 添加主题集成

### 任务4.2: 布局切换器组件
- [ ] 创建 `src/components/layout/LayoutSwitcher.tsx` 组件
- [ ] 实现布局选择界面
- [ ] 添加布局预览功能
- [ ] 实现切换确认机制
- [ ] 添加切换动画效果

### 任务4.3: 用户偏好设置
- [ ] 集成到系统设置页面
- [ ] 添加布局选择选项
- [ ] 实现偏好保存功能
- [ ] 添加默认布局配置
- [ ] 实现偏好导入/导出

### 任务4.4: 切换逻辑优化
- [ ] 实现平滑切换动画
- [ ] 添加状态保持机制
- [ ] 实现错误处理
- [ ] 添加加载状态
- [ ] 优化切换性能

## 阶段5: 样式系统完善

### 任务5.1: CSS变量系统
- [ ] 更新 `src/styles/theme-variables.css` 文件
- [ ] 添加布局相关CSS变量
- [ ] 实现主题变量集成
- [ ] 优化响应式变量
- [ ] 添加动画变量定义

### 任务5.2: 布局切换动画
- [ ] 创建 `src/styles/layout/layout-transitions.css` 文件
- [ ] 实现布局切换动画
- [ ] 添加菜单展开动画
- [ ] 实现页面过渡动画
- [ ] 优化动画性能

### 任务5.3: 主题适配
- [ ] 实现不同主题下的布局
- [ ] 添加暗色主题适配
- [ ] 实现高对比度主题支持
- [ ] 优化主题切换时的布局
- [ ] 添加主题相关的布局变量

## 阶段6: 测试与优化

### 任务6.1: 功能测试
- [ ] 测试布局切换功能
- [ ] 测试菜单导航功能
- [ ] 测试响应式适配
- [ ] 测试主题切换
- [ ] 测试用户偏好保存

### 任务6.2: 性能优化
- [ ] 实现组件懒加载
- [ ] 优化动画性能
- [ ] 减少内存使用
- [ ] 优化渲染性能
- [ ] 添加性能监控

### 任务6.3: 用户体验优化
- [ ] 优化交互细节
- [ ] 添加加载状态处理
- [ ] 实现错误状态处理
- [ ] 优化移动端体验
- [ ] 添加无障碍支持

## 具体实施步骤

### 步骤1: 创建基础文件结构
```bash
# 创建目录结构
mkdir -p src/components/layout
mkdir -p src/components/menu
mkdir -p src/styles/layout
mkdir -p src/types
mkdir -p src/utils

# 创建基础文件
touch src/types/layout.ts
touch src/contexts/LayoutContext.tsx
touch src/utils/layout.ts
```

### 步骤2: 实现布局类型定义
```typescript
// src/types/layout.ts
export enum LayoutType {
  SIDEBAR = 'sidebar',
  TOP = 'top'
}

export interface LayoutConfig {
  type: LayoutType;
  collapsed?: boolean;
  theme?: 'light' | 'dark';
  fixed?: boolean;
}

export interface LayoutContextType {
  layout: LayoutConfig;
  setLayout: (layout: LayoutConfig) => void;
  toggleLayout: () => void;
  isSidebar: boolean;
  isTop: boolean;
}
```

### 步骤3: 实现布局上下文
```typescript
// src/contexts/LayoutContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LayoutType, LayoutConfig, LayoutContextType } from '../types/layout';

const LayoutContext = createContext<LayoutContextType | null>(null);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useState<LayoutConfig>({
    type: LayoutType.SIDEBAR,
    collapsed: false,
    theme: 'light',
    fixed: true
  });

  // 布局切换逻辑
  const toggleLayout = () => {
    setLayout(prev => ({
      ...prev,
      type: prev.type === LayoutType.SIDEBAR ? LayoutType.TOP : LayoutType.SIDEBAR
    }));
  };

  // 用户偏好持久化
  useEffect(() => {
    const savedLayout = localStorage.getItem('layout-config');
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('layout-config', JSON.stringify(layout));
  }, [layout]);

  const value: LayoutContextType = {
    layout,
    setLayout,
    toggleLayout,
    isSidebar: layout.type === LayoutType.SIDEBAR,
    isTop: layout.type === LayoutType.TOP
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
```

### 步骤4: 重构现有布局组件
```typescript
// src/components/layout/SidebarLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import SidebarMenu from '../menu/SidebarMenu';
import './SidebarLayout.css';

const { Sider, Content } = Layout;

const SidebarLayout: React.FC = () => {
  return (
    <Layout className="sidebar-layout">
      <Sider className="sidebar-sider">
        <SidebarMenu />
      </Sider>
      <Layout>
        <Content className="sidebar-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
```

### 步骤5: 创建顶部菜单布局
```typescript
// src/components/layout/TopMenuLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import TopMenu from '../menu/TopMenu';
import './TopMenuLayout.css';

const { Header, Content } = Layout;

const TopMenuLayout: React.FC = () => {
  return (
    <Layout className="top-layout">
      <Header className="top-header">
        <TopMenu />
      </Header>
      <Content className="top-content">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default TopMenuLayout;
```

### 步骤6: 创建布局包装器
```typescript
// src/components/layout/LayoutWrapper.tsx
import React from 'react';
import { useLayout } from '../../contexts/LayoutContext';
import SidebarLayout from './SidebarLayout';
import TopMenuLayout from './TopMenuLayout';

const LayoutWrapper: React.FC = () => {
  const { layout } = useLayout();

  if (layout.type === 'sidebar') {
    return <SidebarLayout />;
  }

  return <TopMenuLayout />;
};

export default LayoutWrapper;
```

### 步骤7: 创建布局切换器
```typescript
// src/components/layout/LayoutSwitcher.tsx
import React from 'react';
import { Card, Radio, Space, Typography } from 'antd';
import { LayoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useLayout } from '../../contexts/LayoutContext';
import { LayoutType } from '../../types/layout';

const { Title, Text } = Typography;

const LayoutSwitcher: React.FC = () => {
  const { layout, setLayout } = useLayout();

  const handleLayoutChange = (e: any) => {
    setLayout({
      ...layout,
      type: e.target.value
    });
  };

  return (
    <Card title="布局设置" className="layout-switcher">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>选择布局类型</Title>
          <Text type="secondary">选择您偏好的界面布局方式</Text>
        </div>
        
        <Radio.Group
          value={layout.type}
          onChange={handleLayoutChange}
          className="layout-options"
        >
          <Space direction="vertical" size="middle">
            <Radio value={LayoutType.SIDEBAR} className="layout-option">
              <Space>
                <MenuOutlined />
                <div>
                  <div>左侧菜单布局</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    菜单在左侧，适合复杂的功能导航
                  </Text>
                </div>
              </Space>
            </Radio>
            
            <Radio value={LayoutType.TOP} className="layout-option">
              <Space>
                <LayoutOutlined />
                <div>
                  <div>顶部菜单布局</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    菜单在顶部，适合简洁的界面设计
                  </Text>
                </div>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </Space>
    </Card>
  );
};

export default LayoutSwitcher;
```

## 验收标准

### 功能验收
- [ ] 左侧菜单布局正常工作
- [ ] 顶部菜单布局正常工作
- [ ] 布局切换功能正常
- [ ] 用户偏好保存正常
- [ ] 响应式适配正常

### 性能验收
- [ ] 布局切换动画流畅
- [ ] 页面加载性能良好
- [ ] 内存使用合理
- [ ] 动画性能优化

### 用户体验验收
- [ ] 界面交互自然
- [ ] 移动端体验良好
- [ ] 主题切换正常
- [ ] 无障碍支持完善

## 总结

本任务列表提供了多布局系统实施的详细指导，通过分阶段、分任务的方式确保项目的可控性和质量。每个任务都有明确的交付物和验收标准，便于项目管理和质量控制。
