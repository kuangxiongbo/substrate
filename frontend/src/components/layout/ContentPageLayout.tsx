/**
 * 统一内容页面布局组件 - 简化版
 * 支持两种模式：带子tab和不带tab
 * 简化嵌套，统一布局
 */
import React from 'react';
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/content-page-layout.css';

export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface ToolbarItem {
  key: string;
  type: 'button' | 'search' | 'filter' | 'custom';
  content: React.ReactNode;
}

export interface ContentPageLayoutProps {
  // 页面模式
  mode?: 'simple' | 'tabs';
  
  // Tab模式相关
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  
  // 工具栏区域
  toolbar?: ToolbarItem[];
  
  // 表格内容区域
  children?: React.ReactNode;
  
  // 分页区域
  pagination?: React.ReactNode;
  
  // 帮助中心
  helpCenterUrl?: string;
  helpCenterVisible?: boolean;
}

const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
  mode = 'simple',
  tabs = [],
  activeTab,
  onTabChange,
  toolbar = [],
  children,
  pagination,
  helpCenterUrl = '/help',
  helpCenterVisible = true,
}) => {
  const { currentTheme } = useTheme();

  return (
    <div className={`content-page-layout ${currentTheme?.meta.id || 'light'}-theme`}>
      {/* Tab导航区域 */}
      {mode === 'tabs' && tabs.length > 0 && (
        <div className="content-page-tabs">
          <div className="tabs-container">
            <div className="tabs-nav">
              {tabs.map(tab => (
                <Button
                  key={tab.key}
                  type={activeTab === tab.key ? 'primary' : 'text'}
                  icon={tab.icon}
                  onClick={() => onTabChange?.(tab.key)}
                  className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                  size="small"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            
            {/* 帮助中心入口 */}
            {helpCenterVisible && (
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                onClick={() => window.open(helpCenterUrl, '_blank')}
                className="help-center-button"
                title="帮助中心"
                size="small"
              >
                帮助
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 工具栏区域 */}
      {toolbar.length > 0 && (
        <div className="content-page-toolbar">
          <div className="toolbar-container">
            <div className="toolbar-left">
              {toolbar.filter(item => item.type !== 'custom').map(item => (
                <div key={item.key} className="toolbar-item">
                  {item.content}
                </div>
              ))}
            </div>
            
            <div className="toolbar-right">
              {toolbar.filter(item => item.type === 'custom').map(item => (
                <div key={item.key} className="toolbar-item">
                  {item.content}
                </div>
              ))}
              
              {/* 简单模式下的帮助中心入口 */}
              {mode === 'simple' && helpCenterVisible && (
                <Button
                  type="text"
                  icon={<QuestionCircleOutlined />}
                  onClick={() => window.open(helpCenterUrl, '_blank')}
                  className="help-center-button"
                  title="帮助中心"
                  size="small"
                >
                  帮助
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 主内容滚动区域 */}
      <div className="content-page-main-scroll">
        {mode === 'tabs' ? (
          // Tab模式：显示当前激活tab的内容
          tabs.find(tab => tab.key === activeTab)?.content || children
        ) : (
          // 简单模式：直接显示children
          children || <div className="content-page-empty">暂无内容</div>
        )}
      </div>

      {/* 分页区域 */}
      {pagination && (
        <div className="content-page-pagination">
          <div className="pagination-container">
            {pagination}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPageLayout;
