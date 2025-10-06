/**
 * 布局切换器组件
 * 基于Spec-Kit方法重构的布局切换器
 */

import React from 'react';
import { Card, Radio, Space, Typography, Button, Tooltip } from 'antd';
import {
  MenuOutlined,
  AppstoreOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useLayout } from './LayoutProvider';
import '../../styles/menu-theme.css';

const { Title, Text } = Typography;

const LayoutSwitcher: React.FC = () => {
  const { layout, setLayout } = useLayout();

  const layoutOptions = [
    {
      value: 'sidebar' as const,
      label: '侧边栏布局',
      icon: <MenuOutlined />,
      description: '左侧菜单，右侧内容区域',
      preview: 'sidebar-preview',
    },
    {
      value: 'top' as const,
      label: '顶部菜单布局',
      icon: <AppstoreOutlined />,
      description: '顶部菜单，下方内容区域',
      preview: 'top-preview',
    },
  ];

  const handleLayoutChange = (e: any) => {
    const newLayout = {
      ...layout,
      type: e.target.value,
      collapsed: e.target.value === 'top' ? false : layout.collapsed,
    };
    setLayout(newLayout);
  };

  const handleReset = () => {
    // 重置为默认布局
    setLayout({
      type: 'sidebar',
      collapsed: false,
      theme: 'light',
      fixed: true,
      width: 240,
      height: 64,
    });
  };

  return (
    <Card className="layout-switcher-card">
      <div className="layout-switcher-header">
        <Title level={4} className="layout-switcher-title">
          布局设置
        </Title>
        <Text type="secondary" className="layout-switcher-description">
          选择适合您工作习惯的布局方式
        </Text>
      </div>

      <div className="layout-switcher-content">
        <Radio.Group
          value={layout.type}
          onChange={handleLayoutChange}
          className="layout-options"
        >
          <Space direction="vertical" size="large" className="layout-options-space">
            {layoutOptions.map((option) => (
              <Radio key={option.value} value={option.value} className="layout-option">
                <div className="layout-option-content">
                  <div className="layout-option-header">
                    <div className="layout-option-icon">
                      {option.icon}
                    </div>
                    <div className="layout-option-info">
                      <div className="layout-option-label">
                        {option.label}
                      </div>
                      <div className="layout-option-description">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  <div className={`layout-option-preview ${option.preview}`}>
                    <div className="preview-content">
                      {option.value === 'sidebar' ? (
                        <>
                          <div className="preview-sidebar"></div>
                          <div className="preview-main">
                            <div className="preview-header"></div>
                            <div className="preview-content-area"></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="preview-top-header"></div>
                          <div className="preview-main-content"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        <div className="layout-switcher-actions">
          <Space>
            <Tooltip title="快速切换布局">
              <Button
                icon={<EyeOutlined />}
                onClick={() => setLayout({
                  ...layout,
                  type: layout.type === 'sidebar' ? 'top' : 'sidebar'
                })}
                className="action-btn"
              >
                快速切换
              </Button>
            </Tooltip>
            
            <Tooltip title="重置为默认设置">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                className="action-btn"
              >
                重置设置
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default LayoutSwitcher;

















