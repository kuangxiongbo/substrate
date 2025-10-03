/**
 * 主题切换器组件
 * 基于Spec-Kit方法实现的主题切换功能
 */

import React from 'react';
import { Select, Space, Typography, Tooltip } from 'antd';
import { BgColorsOutlined, SunOutlined, MoonOutlined, EyeOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

const { Option } = Select;
const { Text } = Typography;

interface ThemeSwitcherProps {
  size?: 'small' | 'middle' | 'large';
  showLabel?: boolean;
  style?: React.CSSProperties;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  size = 'middle', 
  showLabel = true,
  style 
}) => {
  const { currentTheme, availableThemes, setTheme, isDarkMode } = useTheme();

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
    <Space direction="vertical" size="small" style={style}>
      {showLabel && (
        <Text strong style={{ fontSize: '14px' }}>
          主题设置
        </Text>
      )}
      
      <Select
        value={currentTheme.name}
        onChange={handleThemeChange}
        size={size}
        style={{ minWidth: 120 }}
        suffixIcon={<BgColorsOutlined />}
      >
        {availableThemes.map((theme) => (
          <Option key={theme.name} value={theme.name}>
            <Space>
              {getThemeIcon(theme.name)}
              <span>{theme.displayName}</span>
            </Space>
          </Option>
        ))}
      </Select>
      
      {currentTheme.description && (
        <Tooltip title={currentTheme.description} placement="bottom">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {getThemeDescription(currentTheme.name)}
          </Text>
        </Tooltip>
      )}
    </Space>
  );
};

export default ThemeSwitcher;
