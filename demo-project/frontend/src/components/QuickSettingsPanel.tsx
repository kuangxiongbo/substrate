/**
 * 快速设置面板组件
 * 提供主题和布局的快速切换功能
 */
import React, { useState, useEffect } from 'react';
import { Drawer, Card, Space, Typography, Button, Divider, Tooltip, Switch } from 'antd';
import {
  BgColorsOutlined,
  AppstoreOutlined,
  SunOutlined,
  MoonOutlined,
  MenuOutlined,
  EyeOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLayout } from '../contexts/LayoutContext';
import '../styles/menu-theme.css';

const { Text } = Typography;

interface QuickSettingsPanelProps {
  visible: boolean;
  onClose: () => void;
}

const QuickSettingsPanel: React.FC<QuickSettingsPanelProps> = ({ visible, onClose }) => {
  const { currentTheme, setTheme, availableThemes, isDarkMode, toggleTheme } = useTheme();
  const { layout, setLayout, switchLayoutType } = useLayout();
  const [previewMode, setPreviewMode] = useState(false);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  const [autoCloseReason, setAutoCloseReason] = useState<string>('');

  // 自动关闭效果
  useEffect(() => {
    if (shouldAutoClose && visible) {
      const delay = autoCloseReason === 'preview-mode' ? 1500 : 100;
      
      const timer = setTimeout(() => {
        if (autoCloseReason === 'preview-mode') {
          setPreviewMode(false);
        }
        onClose();
        setShouldAutoClose(false);
        setAutoCloseReason('');
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoClose, visible, onClose, autoCloseReason]);

  const handleThemeChange = (themeName: string) => {
    console.log('QuickSettingsPanel: Switching theme to:', themeName);
    
    // 简单切换主题
    setTheme(themeName);
    
    if (previewMode) {
      setPreviewMode(false);
    }
    
    // 设置自动关闭
    setAutoCloseReason('theme-change');
    setShouldAutoClose(true);
  };

  const handleLayoutChange = (layoutType: 'sidebar' | 'top_menu') => {
    console.log('QuickSettingsPanel: handleLayoutChange called with:', layoutType);
    
    // 立即设置布局
    switchLayoutType(layoutType as any);
    
    if (previewMode) {
      setPreviewMode(false);
    }
    
    // 设置自动关闭
    setAutoCloseReason('layout-change');
    setShouldAutoClose(true);
    
    console.log('QuickSettingsPanel: handleLayoutChange completed immediately');
  };

  const handlePreview = (type: 'theme' | 'layout', value: string) => {
    console.log('QuickSettingsPanel: handlePreview called with:', type, value);
    
    setPreviewMode(true);
    if (type === 'theme') {
      // 立即应用预览主题
      setTheme(value);
    } else {
      setLayout({ ...layout, type: value as any });
    }
    
    // 设置预览模式自动关闭
    setAutoCloseReason('preview-mode');
    setShouldAutoClose(true);
    
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
                  onChange={() => {
                    toggleTheme();
                    // 设置快速切换自动关闭
                    setAutoCloseReason('quick-switch');
                    setShouldAutoClose(true);
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
                        type={layout.type === 'top_menu' ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleLayoutChange('top_menu')}
                      >
                        {layout.type === 'top_menu' ? '当前' : '应用'}
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
                  checked={layout.type === 'top_menu'}
                  onChange={() => switchLayoutType(layout.type === 'top_menu' ? 'sidebar' : 'top_menu')}
                  checkedChildren={<AppstoreOutlined />}
                  unCheckedChildren={<MenuOutlined />}
                />
                <Text type="secondary">{layout.type === 'top_menu' ? '顶部菜单' : '侧边栏'}</Text>
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

























