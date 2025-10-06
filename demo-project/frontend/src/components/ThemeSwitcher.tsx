/**
 * 主题切换器组件
 * 基于Spec-Kit方法实现的主题切换功能
 */

import React from 'react';
import { Select, Space, Typography, Tooltip } from 'antd';
import { BgColorsOutlined, SunOutlined, MoonOutlined, EyeOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/settings-pages.css';

const { Option } = Select;
const { Text } = Typography;

interface ThemeSwitcherProps {
  size?: 'small' | 'middle' | 'large';
  showLabel?: boolean;
  style?: React.CSSProperties;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  size = 'middle', 
  showLabel = true
}) => {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <SunOutlined />;
      case 'dark':
        return <MoonOutlined />;
      case 'high-contrast':
        return <EyeOutlined />;
      default:
        return <BgColorsOutlined />;
    }
  };

  const getThemeDescription = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return '适合日间使用的浅色主题';
      case 'dark':
        return '适合夜间使用的深色主题';
      case 'high-contrast':
        return '高对比度主题，提高可访问性';
      default:
        return '自定义主题';
    }
  };

  return (
    <Space direction="vertical" size="small" className="theme-switcher-container">
      {showLabel && (
        <Text strong className="theme-switcher-label">
          主题设置
        </Text>
      )}
      
      <Select
        value={(currentTheme as any)?.name}
        onChange={handleThemeChange}
        size={size}
        className="theme-switcher-select"
        suffixIcon={<BgColorsOutlined />}
      >
        {availableThemes.map((theme: any) => (
          <Option key={theme.id || theme.name} value={theme.id || theme.name}>
            <Space>
              {getThemeIcon(theme.id || theme.name)}
              <span>{theme.displayName || theme.name}</span>
            </Space>
          </Option>
        ))}
      </Select>
      
      {(currentTheme as any)?.description && (
        <Tooltip title={(currentTheme as any).description} placement="bottom">
          <Text type="secondary" className="theme-switcher-description">
            {getThemeDescription((currentTheme as any)?.name || (currentTheme as any)?.id)}
          </Text>
        </Tooltip>
      )}
    </Space>
  );
};

export default ThemeSwitcher;
