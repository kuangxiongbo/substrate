/**
 * Ant Design 主题配置
 * 专业UI设计师定制主题
 */
import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // 主色调 - 现代化渐变蓝色系
    colorPrimary: '#667eea',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#667eea',
    
    // 中性色
    colorTextBase: '#262626',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    colorTextQuaternary: '#f0f0f0',
    
    // 背景色 - 现代化渐变背景
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    colorBgSpotlight: '#fafafa',
    
    // 边框色
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // 圆角
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    
    // 阴影
    boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    
    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // 高度
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
    controlHeightXS: 16,
  },
  
  components: {
    // 按钮组件
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      fontWeight: 500,
      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
    },
    
    // 输入框组件
    Input: {
      borderRadius: 6,
      controlHeight: 40,
      paddingInline: 12,
    },
    
    // 卡片组件
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      paddingLG: 24,
    },
    
    // 表单组件
    Form: {
      labelFontSize: 14,
      labelColor: '#262626',
      itemMarginBottom: 24,
    },
    
    // 菜单组件 - 现代化设计
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 8,
      itemHeight: 44,
      itemPaddingInline: 20,
      itemMarginInline: 8,
      itemSelectedBg: '#1890ff',
      itemSelectedColor: '#ffffff',
      itemHoverBg: 'rgba(24, 144, 255, 0.1)',
      itemActiveBg: 'rgba(24, 144, 255, 0.15)',
      itemColor: '#262626',
      itemHoverColor: '#1890ff',
      itemSelectedIconColor: '#ffffff',
      itemIconColor: '#8c8c8c',
      itemHoverIconColor: '#1890ff',
    },
    
    // 布局组件
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f5f5f5',
    },
    
    // 表格组件
    Table: {
      borderRadius: 8,
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: '#f5f5f5',
    },
    
    // 消息组件
    Message: {
      borderRadius: 8,
      contentPadding: '12px 16px',
    },
    
    // 通知组件
    Notification: {
      borderRadius: 8,
      paddingLG: 16,
    },
    
    // 模态框组件
    Modal: {
      borderRadius: 12,
      paddingLG: 24,
    },
    
    // 抽屉组件
    Drawer: {
      borderRadius: 12,
    },
  },
  
  algorithm: theme.defaultAlgorithm, // 使用默认算法，支持亮色/暗色主题切换
};

// 暗色主题配置
export const antdDarkTheme: ThemeConfig = {
  ...antdTheme,
  algorithm: theme.darkAlgorithm, // 使用暗色算法
  token: {
    ...antdTheme.token,
    // 暗色主题色彩调整
    colorPrimary: '#177ddc',
    colorSuccess: '#49aa19',
    colorWarning: '#d89614',
    colorError: '#dc4446',
    colorInfo: '#177ddc',
    
    colorTextBase: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    colorTextTertiary: '#737373',
    colorTextQuaternary: '#404040',
    
    colorBgBase: '#141414',
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorBgLayout: '#000000',
    colorBgSpotlight: '#1f1f1f',
    
    colorBorder: '#424242',
    colorBorderSecondary: '#303030',
  },
};
