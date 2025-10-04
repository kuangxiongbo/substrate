/**
 * 增强主题切换器组件
 * 基于Spec-Kit方法实现的完整主题切换功能
 */

import React, { useState } from 'react';
import { Card, Radio, Space, Typography, Button, Tooltip, Divider, Switch, ColorPicker } from 'antd';
import { 
  BgColorsOutlined, 
  SunOutlined, 
  MoonOutlined, 
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/menu-theme.css';

const { Title, Text } = Typography;

const EnhancedThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, availableThemes, isDarkMode, toggleTheme } = useTheme();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 处理主题切换
  const handleThemeChange = (e: any) => {
    const themeName = e.target.value;
    setTheme(themeName);
  };

  // 预览主题
  const handlePreview = (themeName: string) => {
    setIsPreviewMode(true);
    setPreviewTheme(themeName);
    
    // 临时应用主题
    const tempTheme = availableThemes.find(t => t.id === themeName);
    if (tempTheme) {
      // 这里可以临时应用主题样式
      document.documentElement.className = `theme-${themeName}`;
    }
    
    // 3秒后恢复原主题
    setTimeout(() => {
      setIsPreviewMode(false);
      setPreviewTheme(null);
      document.documentElement.className = `theme-${currentTheme.id}`;
    }, 3000);
  };

  // 重置主题
  const handleReset = () => {
    setTheme('light');
  };

  // 获取主题图标
  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <SunOutlined />;
      case 'dark':
        return <MoonOutlined />;
      case 'high-contrast':
        return <BgColorsOutlined />;
      default:
        return <AppstoreOutlined />;
    }
  };

  // 获取主题描述
  const getThemeDescription = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return '明亮清爽的浅色主题，适合日间使用';
      case 'dark':
        return '护眼的深色主题，适合夜间使用';
      case 'high-contrast':
        return '高对比度主题，提升可访问性';
      default:
        return '自定义主题配置';
    }
  };

  return (
    <Card 
      title={
        <Space>
          <BgColorsOutlined />
          <span>主题设置</span>
        </Space>
      }
      className="enhanced-theme-switcher"
      extra={
        <Space>
          <Tooltip title="高级设置">
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="重置为默认主题">
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              size="small"
            />
          </Tooltip>
        </Space>
      }
    >
      <Space direction="vertical" size="large" className="theme-switcher-space">
        {/* 当前主题状态 */}
        <div className="current-theme-status">
          <Title level={5}>当前主题</Title>
          <div className="theme-status-info">
            <Space>
              <span className="theme-type-badge">
                {getThemeIcon(currentTheme.id)}
                {currentTheme.displayName}
              </span>
              <Text type="secondary">
                {getThemeDescription(currentTheme.id)}
              </Text>
            </Space>
          </div>
        </div>

        <Divider />

        {/* 主题选择 */}
        <div className="theme-selection">
          <Title level={5}>选择主题</Title>
          <Text type="secondary">选择您偏好的界面主题</Text>
          
          <Radio.Group
            value={currentTheme.name}
            onChange={handleThemeChange}
            className="theme-options theme-options-container"
          >
            <Space direction="vertical" size="middle" className="theme-options-space">
              {availableThemes.map((theme) => (
                <Radio key={theme.name} value={theme.name} className="theme-option">
                  <div className="theme-option-content">
                    <Space>
                      <div className="theme-option-icon">
                        {getThemeIcon(theme.name)}
                      </div>
                      <div className="theme-option-details">
                        <div className="theme-option-title">
                          {theme.displayName}
                        </div>
                        <Text type="secondary" className="theme-option-description">
                          {getThemeDescription(theme.name)}
                        </Text>
                      </div>
                    </Space>
                    <div className="theme-option-actions">
                      <Tooltip title="预览效果">
                        <Button 
                          type="text" 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={() => handlePreview(theme.name)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <Divider />

        {/* 快速操作 */}
        <div className="quick-actions">
          <Title level={5}>快速操作</Title>
          <Space wrap>
            <Button 
              type="primary" 
              onClick={toggleTheme}
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            >
              {isDarkMode ? '切换到浅色' : '切换到深色'}
            </Button>
            <Button 
              onClick={() => handlePreview(isDarkMode ? 'light' : 'dark')}
              icon={<EyeOutlined />}
            >
              预览另一种主题
            </Button>
          </Space>
        </div>

        {/* 高级设置 */}
        {showAdvanced && (
          <>
            <Divider />
            <div className="advanced-settings">
              <Title level={5}>高级设置</Title>
              <Space direction="vertical" size="middle" className="advanced-settings-space">
                <div className="setting-item">
                  <Space>
                    <Text>自动切换主题</Text>
                    <Switch size="small" />
                  </Space>
                  <Text type="secondary" className="setting-description">
                    根据系统时间自动切换浅色/深色主题
                  </Text>
                </div>
                
                <div className="setting-item">
                  <Space>
                    <Text>主题跟随系统</Text>
                    <Switch size="small" defaultChecked />
                  </Space>
                  <Text type="secondary" className="setting-description">
                    跟随系统主题设置自动切换
                  </Text>
                </div>
                
                <div className="setting-item">
                  <Space>
                    <Text>自定义主色调</Text>
                    <ColorPicker 
                      size="small" 
                      defaultValue="#1890ff"
                      showText
                    />
                  </Space>
                  <Text type="secondary" className="setting-description">
                    自定义主题的主色调
                  </Text>
                </div>
              </Space>
            </div>
          </>
        )}

        {/* 预览模式提示 */}
        {isPreviewMode && previewTheme && (
          <div className="preview-mode-tip">
            <Text type="warning">
              <EyeOutlined /> 正在预览 {availableThemes.find(t => t.name === previewTheme)?.displayName} 主题，3秒后自动退出
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default EnhancedThemeSwitcher;









