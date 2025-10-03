/**
 * 快速设置面板组件
 * 提供主题和布局的快速切换功能
 */
import React, { useState } from 'react';
import { Drawer, Card, Space, Typography, Button, Divider, Tooltip, Switch } from 'antd';
import {
  BgColorsOutlined,
  AppstoreOutlined,
  SunOutlined,
  MoonOutlined,
  MenuOutlined,
  SettingOutlined,
  EyeOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLayout } from '../contexts/LayoutContext';
import '../styles/menu-theme.css';

const { Title, Text } = Typography;

interface QuickSettingsPanelProps {
  visible: boolean;
  onClose: () => void;
}

const QuickSettingsPanel: React.FC<QuickSettingsPanelProps> = ({ visible, onClose }) => {
  const { currentTheme, setTheme, availableThemes, isDarkMode, toggleTheme } = useTheme();
  const { layout, setLayout, toggleLayout } = useLayout();
  const [previewMode, setPreviewMode] = useState(false);

  const handleThemeChange = (themeName: string) => {
    console.log('QuickSettingsPanel: handleThemeChange called with:', themeName);
    
    // 立即设置主题，无延迟
    setTheme(themeName);
    
    if (previewMode) {
      setPreviewMode(false);
    }
    
    // 应用主题后自动关闭弹窗
    setTimeout(() => {
      onClose();
    }, 100);
    
    console.log('QuickSettingsPanel: handleThemeChange completed immediately');
  };

  const handleLayoutChange = (layoutType: 'sidebar' | 'top') => {
    console.log('QuickSettingsPanel: handleLayoutChange called with:', layoutType);
    
    // 立即设置布局
    setLayout({ ...layout, type: layoutType });
    
    if (previewMode) {
      setPreviewMode(false);
    }
    
    // 应用布局后自动关闭弹窗
    setTimeout(() => {
      onClose();
    }, 100);
    
    console.log('QuickSettingsPanel: handleLayoutChange completed immediately');
  };

  const handlePreview = (type: 'theme' | 'layout', value: string) => {
    console.log('QuickSettingsPanel: handlePreview called with:', type, value);
    
    setPreviewMode(true);
    if (type === 'theme') {
      // 立即应用预览主题
      setTheme(value);
    } else {
      setLayout({ ...layout, type: value as 'sidebar' | 'top' });
    }
    
    // 1.5秒后恢复并关闭弹窗 - 缩短预览时间
    setTimeout(() => {
      setPreviewMode(false);
      onClose();
    }, 1500);
    
    console.log('QuickSettingsPanel: handlePreview completed, will auto-close in 1.5s');
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <SunOutlined />;
      case 'dark':
        return <MoonOutlined />;
      case 'high-contrast':
        return <BgColorsOutlined />;
      case 'purple':
        return <AppstoreOutlined />;
      case 'cyan':
        return <BgColorsOutlined />;
      default:
        return <SunOutlined />;
    }
  };

  const getLayoutIcon = (layoutType: string) => {
    return layoutType === 'sidebar' ? <MenuOutlined /> : <AppstoreOutlined />;
  };

  return (
    <Drawer
      title={
        <Space>
          <SkinOutlined />
          <span>切换皮肤</span>
        </Space>
      }
      placement="right"
      width={360}
      open={visible}
      onClose={onClose}
      styles={{
        body: { padding: '16px' }
      }}
    >
      <Space direction="vertical" size="large" className="quick-settings-container">
        {/* 主题设置 */}
        <Card size="small" title="主题设置">
          <Space direction="vertical" size="middle" className="theme-settings-container">
            <div>
              <Text strong>当前主题</Text>
              <div className="theme-current-info">
                <Space>
                  {getThemeIcon(currentTheme.meta.id)}
                  <Text>{currentTheme.meta.displayName}</Text>
                </Space>
              </div>
            </div>

            <Divider className="theme-divider" />

            <div>
              <Text strong>选择主题</Text>
              <div className="theme-switch-container">
                <Space direction="vertical" size="small" className="theme-options-container">
                  {availableThemes.map((theme) => (
                    <div key={theme.meta.id} className="theme-option-item">
                      <Space>
                        {getThemeIcon(theme.meta.id)}
                        <Text>{theme.meta.displayName}</Text>
                      </Space>
                      <Space>
                        <Tooltip title="预览">
                          <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview('theme', theme.meta.id)}
                          />
                        </Tooltip>
                        <Button
                          type={currentTheme.meta.id === theme.meta.id ? 'primary' : 'default'}
                          size="small"
                          onClick={() => handleThemeChange(theme.meta.id)}
                        >
                          {currentTheme.meta.id === theme.meta.id ? '当前' : '应用'}
                        </Button>
                      </Space>
                    </div>
                  ))}
                </Space>
              </div>
            </div>

            <Divider className="theme-divider" />

            <div>
              <Space>
                <Text>快速切换</Text>
                <Switch
                  checked={isDarkMode}
                  onChange={(checked) => {
                    toggleTheme();
                    // 快速切换后自动关闭弹窗
                    setTimeout(() => {
                      onClose();
                    }, 100);
                  }}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                />
                <Text type="secondary">{isDarkMode ? '深色模式' : '浅色模式'}</Text>
              </Space>
            </div>
          </Space>
        </Card>

        {/* 布局设置 */}
        <Card size="small" title="布局设置">
          <Space direction="vertical" size="middle" className="layout-settings-container">
            <div>
              <Text strong>当前布局</Text>
              <div className="layout-current-info">
                <Space>
                  {getLayoutIcon(layout.type)}
                  <Text>{layout.type === 'sidebar' ? '侧边栏布局' : '顶部菜单布局'}</Text>
                </Space>
              </div>
            </div>

            <Divider className="theme-divider" />

            <div>
              <Text strong>选择布局</Text>
              <div className="theme-switch-container">
                <Space direction="vertical" size="small" className="theme-options-container">
                  <div className="layout-option-item">
                    <Space>
                      <MenuOutlined />
                      <Text>侧边栏布局</Text>
                    </Space>
                    <Space>
                      <Tooltip title="预览">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview('layout', 'sidebar')}
                        />
                      </Tooltip>
                      <Button
                        type={layout.type === 'sidebar' ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleLayoutChange('sidebar')}
                      >
                        {layout.type === 'sidebar' ? '当前' : '应用'}
                      </Button>
                    </Space>
                  </div>
                  
                  <div className="layout-option-item">
                    <Space>
                      <AppstoreOutlined />
                      <Text>顶部菜单布局</Text>
                    </Space>
                    <Space>
                      <Tooltip title="预览">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview('layout', 'top')}
                        />
                      </Tooltip>
                      <Button
                        type={layout.type === 'top' ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleLayoutChange('top')}
                      >
                        {layout.type === 'top' ? '当前' : '应用'}
                      </Button>
                    </Space>
                  </div>
                </Space>
              </div>
            </div>

            <Divider className="theme-divider" />

            <div>
              <Space>
                <Text>快速切换</Text>
                <Switch
                  checked={layout.type === 'top'}
                  onChange={toggleLayout}
                  checkedChildren={<AppstoreOutlined />}
                  unCheckedChildren={<MenuOutlined />}
                />
                <Text type="secondary">{layout.type === 'top' ? '顶部菜单' : '侧边栏'}</Text>
              </Space>
            </div>
          </Space>
        </Card>

        {/* 预览模式提示 */}
        {previewMode && (
          <Card size="small" className="preview-notice">
            <Space>
              <EyeOutlined className="preview-notice-icon" />
              <Text type="warning">预览模式 - 3秒后自动退出</Text>
            </Space>
          </Card>
        )}
      </Space>
    </Drawer>
  );
};

export default QuickSettingsPanel;


