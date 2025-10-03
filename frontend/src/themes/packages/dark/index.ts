/**
 * 深色主题包
 * 护眼深色主题，适合夜间使用
 * 基于 Spec-Kit 方法的主题包实现
 */

import { theme } from 'antd';
import type { ThemePackageConfig } from '../../core/types';
import { extendedComponents } from './components-extension';

const darkTheme: ThemePackageConfig = {
  meta: {
    id: 'dark',
    name: 'dark-theme',
    displayName: '深色主题',
    description: '护眼深色主题，适合夜间使用，减少眼部疲劳，提供舒适的暗色体验',
    version: '1.0.0',
    author: 'Spec-Kit Team',
    tags: ['dark', 'night', 'eye-friendly', 'modern', 'professional'],
    category: 'dark',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMTQxNDE0Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI4MCIgcng9IjgiIGZpbGw9IiMxZjFmMWYiLz4KPHJlY3QgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjMTc3ZGRjIi8+CjxyZWN0IHg9IjgwIiB5PSIzMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzQ5YWExOSIvPgo8cmVjdCB4PSIxMzAiIHk9IjMwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjZDg5NjE0Ii8+Cjwvc3ZnPgo=',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  // 菜单变体：深色主题使用深色菜单
  menuVariant: 'dark',
  algorithm: theme.darkAlgorithm,
  token: {
    // 主色调 - 现代深色主题配色
    colorPrimary: '#6366f1', // 现代紫色，更柔和
    colorSuccess: '#10b981', // 翠绿色，更醒目
    colorWarning: '#f59e0b', // 琥珀色，更温暖
    colorError: '#ef4444', // 红色，更鲜明
    colorInfo: '#06b6d4', // 青色，更清新
    
    // 背景色 - 深色背景层次优化
    colorBgBase: '#0f0f23', // 更深的背景色
    colorBgContainer: '#1a1a2e', // 容器背景
    colorBgElevated: '#16213e', // 悬浮背景
    colorBgLayout: '#0f0f23', // 布局背景
    colorBgSpotlight: 'rgba(15, 15, 35, 0.95)', // 聚光灯背景
    colorBgMask: 'rgba(0, 0, 0, 0.65)', // 遮罩背景
    
    // 文字色 - 现代化文字层次
    colorText: '#f8fafc', // 主文本，更柔和的白
    colorTextSecondary: '#cbd5e1', // 次要文本，更清晰
    colorTextTertiary: '#94a3b8', // 三级文本，更易读
    colorTextQuaternary: '#64748b', // 四级文本
    colorTextDisabled: '#64748b', // 禁用文本
    colorTextHeading: '#f1f5f9', // 标题文本
    colorTextDescription: '#cbd5e1', // 描述文本
    colorTextPlaceholder: '#64748b', // 占位符文本
    
    // 边框色 - 现代化边框
    colorBorder: '#334155', // 主边框
    colorBorderSecondary: '#475569', // 次要边框
    colorSplit: '#334155', // 分割线
    
    // 填充色 - 现代化填充
    colorFill: '#1e293b', // 主填充
    colorFillSecondary: '#334155', // 次要填充
    colorFillTertiary: '#475569', // 三级填充
    colorFillQuaternary: '#64748b', // 四级填充
    
    // 链接色 - 现代深色模式链接
    colorLink: '#6366f1', // 主色链接
    colorLinkHover: '#818cf8', // 悬停链接
    colorLinkActive: '#4f46e5', // 激活链接
    
    // 圆角 - 现代化圆角设计
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,
    
    // 阴影 - 现代化深色阴影
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 4px 12px -2px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    boxShadowTertiary: '0 2px 8px -1px rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    
    // 字体 - 现代字体栈
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // 行高 - 舒适的阅读体验
    lineHeight: 1.5714285714285714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.66,
    
    // 间距 - 统一的间距系统
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    
    // 动画 - 流畅的动画效果
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    
    // 其他
    wireframe: false,
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
    
    // 全局样式控制 - 确保深色主题的文字可见性
    colorBgContainerDisabled: '#1a1a1a',
    colorTextDisabled: '#595959',
    colorBgMask: 'rgba(0, 0, 0, 0.65)',
    
    // 顶部菜单专用间距配置 - 统一所有菜单项间距
    topMenuHeight: 64,
    topMenuItemMargin: 12, // 增加间距，确保菜单项之间有足够空间
    topMenuItemPadding: 20, // 增加内边距，确保内容有足够空间
    topMenuContainerPadding: 0,
    topMenuContainerMargin: 0,
    
    // 扩展的样式控制
    // 自定义颜色变量
    colorCustom1: '#667eea',
    colorCustom2: '#764ba2',
    colorCustom3: '#f093fb',
    colorCustom4: '#f5576c',
    colorCustom5: '#4facfe',
    
    // 布局样式配置
    layoutSidebarWidth: 240,
    layoutSidebarCollapsedWidth: 80,
    layoutSidebarHeaderHeight: 64,
    layoutSidebarBackgroundColor: '#001529',
    layoutSidebarBorderColor: '#1f1f1f',
    layoutSidebarShadowColor: '2px 0 8px rgba(0, 0, 0, 0.3)',
    layoutTopMenuHeight: 64,
    layoutTopMenuBackgroundColor: '#001529',
    layoutTopMenuBorderColor: '#1f1f1f',
    layoutTopMenuShadowColor: '0 2px 8px rgba(0, 0, 0, 0.3)',
    layoutContentBackgroundColor: '#141414',
    layoutContentPadding: 16,
    layoutContentMargin: 0,
    
    // Logo样式配置
    logoBackgroundColor: '#1890ff',
    logoTextColor: '#ffffff',
    logoIconColor: '#ffffff',
    logoFontSize: 18,
    logoFontWeight: 700,
    logoBorderRadius: 6,
    
    // 菜单样式配置
    menuBackgroundColor: 'transparent',
    menuItemColor: 'rgba(255, 255, 255, 0.95)',
    menuItemHoverColor: '#ffffff',
    menuItemSelectedColor: '#ffffff',
    menuItemBackgroundColor: 'transparent',
    menuItemHoverBackgroundColor: 'rgba(255, 255, 255, 0.1)',
    menuItemSelectedBackgroundColor: '#1890ff',
    menuIconColor: 'rgba(255, 255, 255, 0.85)',
    menuIconHoverColor: '#ffffff',
    menuIconSelectedColor: '#ffffff',
    menuBorderColor: '#1f1f1f',
    menuBorderRadius: 6,
    menuFontSize: 14,
    menuFontWeight: 400,
    menuPadding: 8,
    menuMargin: 4,
    
    
    // 按钮样式配置
    buttonPrimaryColor: '#1890ff',
    buttonDefaultColor: '#ffffff',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#1f1f1f',
    buttonBorderColor: '#434343',
    buttonHoverColor: '#40a9ff',
    buttonActiveColor: '#096dd9',
    buttonDisabledColor: 'rgba(255, 255, 255, 0.25)',
    buttonBorderRadius: 6,
    buttonFontSize: 14,
    buttonFontWeight: 400,
    buttonPadding: 8,
    buttonMargin: 4,
    buttonShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    
    // 头部样式配置
    headerBackgroundColor: '#001529',
    headerHeight: 64,
    headerBorderColor: '#1f1f1f',
    headerShadowColor: '0 2px 8px rgba(0, 0, 0, 0.3)',
    headerTextColor: '#ffffff',
    headerIconColor: 'rgba(255, 255, 255, 0.85)',
    headerPadding: 16,
    
    // 渐变背景
    gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradientSuccess: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradientWarning: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    gradientError: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    
    // 扩展的阴影效果
    boxShadowCustom1: '0 4px 20px rgba(102, 126, 234, 0.15)',
    boxShadowCustom2: '0 8px 30px rgba(102, 126, 234, 0.12)',
    boxShadowCustom3: '0 12px 40px rgba(102, 126, 234, 0.1)',
    boxShadowInset: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    boxShadowGlow: '0 0 20px rgba(102, 126, 234, 0.3)',
    
    // 扩展的圆角
    borderRadiusCustom1: 12,
    borderRadiusCustom2: 16,
    borderRadiusCustom3: 20,
    borderRadiusCustom4: 24,
    
    // 扩展的间距
    spacingCustom1: 4,
    spacingCustom2: 6,
    spacingCustom3: 10,
    spacingCustom4: 14,
    spacingCustom5: 18,
    spacingCustom6: 22,
    spacingCustom7: 26,
    spacingCustom8: 30,
    
    // 扩展的字体大小
    fontSizeCustom1: 10,
    fontSizeCustom2: 11,
    fontSizeCustom3: 13,
    fontSizeCustom4: 15,
    fontSizeCustom5: 17,
    fontSizeCustom6: 19,
    fontSizeCustom7: 21,
    fontSizeCustom8: 23,
    
    // 扩展的字体权重
    fontWeightLight: 300,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    fontWeightExtraBold: 800,
    
    // 扩展的行高
    lineHeightCustom1: 1.2,
    lineHeightCustom2: 1.3,
    lineHeightCustom3: 1.4,
    lineHeightCustom4: 1.6,
    lineHeightCustom5: 1.8,
    lineHeightCustom6: 2.0,
    
    // 扩展的动画持续时间
    motionDurationCustom1: '0.05s',
    motionDurationCustom2: '0.15s',
    motionDurationCustom3: '0.25s',
    motionDurationCustom4: '0.35s',
    motionDurationCustom5: '0.45s',
    motionDurationCustom6: '0.55s',
    
    // 扩展的动画缓动函数
    motionEaseCustom1: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    motionEaseCustom2: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    motionEaseCustom3: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    motionEaseCustom4: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    motionEaseCustom5: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    
    // 透明度控制
    opacityCustom1: 0.1,
    opacityCustom2: 0.2,
    opacityCustom3: 0.3,
    opacityCustom4: 0.4,
    opacityCustom5: 0.5,
    opacityCustom6: 0.6,
    opacityCustom7: 0.7,
    opacityCustom8: 0.8,
    opacityCustom9: 0.9,
    
    // 边框宽度
    lineWidthCustom1: 0.5,
    lineWidthCustom2: 1.5,
    lineWidthCustom3: 2,
    lineWidthCustom4: 3,
    lineWidthCustom5: 4,
    
    // Z-index 层级
    zIndexCustom1: 1000,
    zIndexCustom2: 1100,
    zIndexCustom3: 1200,
    zIndexCustom4: 1300,
    zIndexCustom5: 1400,
  },
  components: {
    // 布局组件 - 现代深色布局
    Layout: {
      bodyBg: '#0f0f23',
      headerBg: '#1a1a2e',
      headerColor: '#f8fafc',
      headerHeight: 64,
      siderBg: '#0f0f23',
      siderColor: '#cbd5e1',
      triggerBg: '#16213e',
      triggerColor: '#f8fafc',
    },
    
    // 菜单组件 - 现代深色侧边栏
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#6366f1', // 现代紫色选中背景
      itemHoverBg: 'rgba(99, 102, 241, 0.1)', // 柔和悬停背景
      itemColor: '#cbd5e1', // 现代文字颜色
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#f8fafc',
      itemActiveBg: 'rgba(99, 102, 241, 0.2)', // 激活背景
      itemActiveColor: '#ffffff',
      itemDisabledColor: '#64748b', // 禁用文本
      subMenuItemBg: 'transparent',
      groupTitleColor: '#94a3b8', // 分组标题
      iconSize: 14,
      collapsedIconSize: 16,
      collapsedWidth: 80,
      // 图标颜色控制 - 现代化配色
      itemIconColor: '#94a3b8', // 默认图标颜色
      itemIconColorHover: '#cbd5e1', // 悬停图标颜色
      itemIconColorSelected: '#ffffff', // 选中图标颜色
      submenuIconColor: '#94a3b8', // 子菜单图标颜色
      submenuIconColorHover: '#cbd5e1', // 子菜单悬停图标颜色
      submenuArrowColor: '#94a3b8', // 子菜单箭头颜色
      submenuArrowColorHover: '#cbd5e1', // 子菜单悬停箭头颜色
      // 边框和下划线控制
      itemBorderBottom: 'none', // 移除底部边框
      itemSelectedBorderBottom: 'none', // 移除选中项底部边框
      horizontalItemBorderBottom: 'none', // 移除水平菜单底部边框
      horizontalItemSelectedBorderBottom: 'none', // 移除选中水平菜单底部边框
    },
    
    // 按钮组件 - 现代深色按钮设计
    Button: {
      primaryColor: '#6366f1',
      defaultBg: '#1e293b',
      defaultColor: '#f8fafc',
      defaultBorderColor: '#334155',
      defaultHoverBg: '#334155',
      defaultHoverColor: '#6366f1',
      defaultHoverBorderColor: '#6366f1',
      defaultActiveBg: '#475569',
      defaultActiveColor: '#818cf8',
      defaultActiveBorderColor: '#818cf8',
      textHoverBg: 'rgba(99, 102, 241, 0.1)',
      textHoverColor: '#6366f1',
      dangerColor: '#ef4444',
      dangerBg: '#1e293b',
      dangerBorderColor: '#ef4444',
      dangerHoverColor: '#f87171',
      dangerHoverBg: '#2a1215',
      dangerHoverBorderColor: '#f87171',
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
      paddingInline: 15,
      paddingInlineLG: 19,
      paddingInlineSM: 7,
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      fontWeight: 400,
      lineWidth: 1,
      shadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
    },
    
    // 卡片组件 - 现代深色卡片设计
    Card: {
      headerBg: '#16213e',
      headerColor: '#f8fafc',
      bodyBg: '#1a1a2e',
      bodyColor: '#f8fafc',
      borderColor: '#334155',
      borderRadius: 12,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      boxShadowTertiary: '0 4px 12px -2px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      paddingLG: 24,
      paddingSM: 16,
      paddingXS: 12,
      headerFontSize: 16,
      headerFontSizeSM: 14,
      headerFontSizeLG: 18,
      headerHeight: 55,
      headerHeightSM: 47,
      headerHeightLG: 63,
    },
    
    // 输入框组件 - 深色输入体验
    Input: {
      colorBgContainer: '#1f1f1f',
      colorBorder: '#434343',
      colorBorderHover: '#177ddc',
      colorPrimary: '#177ddc',
      colorText: '#ffffff',
      colorTextPlaceholder: '#737373',
      colorTextDisabled: '#737373',
      colorTextSecondary: '#a6a6a6',
      colorError: '#dc4446',
      colorErrorHover: '#ff7875',
      colorWarning: '#d89614',
      colorWarningHover: '#ffc53d',
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
      paddingInline: 11,
      paddingInlineLG: 15,
      paddingInlineSM: 7,
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      lineWidth: 1,
      lineWidthFocus: 2,
      boxShadow: '0 0 0 2px rgba(23, 125, 220, 0.2)',
      activeShadow: '0 0 0 2px rgba(23, 125, 220, 0.2)',
      hoverShadow: '0 0 0 2px rgba(23, 125, 220, 0.2)',
    },
    
    // 表格组件 - 深色数据展示
    Table: {
      headerBg: '#262626',
      headerColor: '#ffffff',
      headerSortActiveBg: '#303030',
      headerSortHoverBg: '#262626',
      bodySortBg: '#262626',
      rowHoverBg: '#262626',
      rowSelectedBg: '#111b26',
      rowSelectedHoverBg: '#0f1419',
      rowExpandedBg: '#262626',
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
      cellPaddingBlockMD: 12,
      cellPaddingInlineMD: 12,
      cellPaddingBlockSM: 8,
      cellPaddingInlineSM: 8,
      borderColor: '#303030',
      headerBorderBottom: '1px solid #303030',
      headerSplitColor: '#303030',
      footerBg: '#262626',
      footerColor: '#ffffff',
      stickyScrollBarBg: 'rgba(255, 255, 255, 0.06)',
      stickyScrollBarBorderRadius: 3,
    },
    
    // 模态框组件 - 深色弹窗
    Modal: {
      contentBg: '#1f1f1f',
      headerBg: '#1f1f1f',
      titleColor: '#ffffff',
      titleFontSize: 16,
      titleLineHeight: 1.5,
      contentPadding: 24,
      contentPaddingHorizontal: 24,
      contentPaddingVertical: 24,
      borderRadius: 8,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      maskBg: 'rgba(0, 0, 0, 0.45)',
      footerBg: '#1f1f1f',
      footerPaddingVertical: 10,
      footerPaddingHorizontal: 16,
      closeBtnColor: '#a6a6a6',
      closeBtnHoverColor: '#ffffff',
      closeBtnSize: 22,
    },
    
    // 抽屉组件 - 深色侧边栏
    Drawer: {
      colorBgElevated: '#1f1f1f',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorTextTertiary: '#737373',
      colorTextQuaternary: '#404040',
      colorBorder: '#303030',
      colorFillSecondary: '#262626',
      colorFillTertiary: '#1f1f1f',
      colorFillQuaternary: '#141414',
      colorPrimary: '#177ddc',
      colorSuccess: '#49aa19',
      colorWarning: '#d89614',
      colorError: '#dc4446',
      colorInfo: '#13a8a8',
      colorLink: '#177ddc',
      colorLinkHover: '#3c9be8',
      colorLinkActive: '#0958d9',
      borderRadius: 8,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      paddingLG: 24,
      padding: 16,
      paddingSM: 12,
      paddingXS: 8,
      paddingXXS: 4,
      marginLG: 24,
      margin: 16,
      marginSM: 12,
      marginXS: 8,
      marginXXS: 4,
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      fontSizeXL: 20,
      lineHeight: 1.5714285714285714,
      lineHeightLG: 1.5,
      lineHeightSM: 1.66,
      motionDurationSlow: '0.3s',
      motionDurationMid: '0.2s',
      motionDurationFast: '0.1s',
      motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      motionEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    
    // 消息组件 - 深色提示信息
    Message: {
      contentBg: '#1f1f1f',
      contentPadding: 10,
      contentPaddingVertical: 10,
      contentPaddingHorizontal: 16,
      borderRadius: 6,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorSuccess: '#49aa19',
      colorError: '#dc4446',
      colorWarning: '#d89614',
      colorInfo: '#13a8a8',
      fontSize: 14,
      lineHeight: 1.5714285714285714,
      marginBottom: 8,
      zIndexPopup: 1010,
    },
    
    // 通知组件 - 深色通知样式
    Notification: {
      contentBg: '#1f1f1f',
      contentPadding: 16,
      contentPaddingVertical: 16,
      contentPaddingHorizontal: 24,
      borderRadius: 8,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorSuccess: '#49aa19',
      colorError: '#dc4446',
      colorWarning: '#d89614',
      colorInfo: '#13a8a8',
      fontSize: 14,
      lineHeight: 1.5714285714285714,
      marginBottom: 16,
      zIndexPopup: 1010,
      titleFontSize: 16,
      titleLineHeight: 1.5,
      titleMarginBottom: 8,
      descriptionFontSize: 14,
      descriptionLineHeight: 1.5714285714285714,
      descriptionMarginBottom: 0,
      closeBtnColor: '#a6a6a6',
      closeBtnHoverColor: '#ffffff',
      closeBtnSize: 16,
    },
    
    // 标签组件 - 深色标签设计
    Tag: {
      defaultBg: '#262626',
      defaultColor: '#ffffff',
      defaultBorderColor: '#434343',
      successBg: '#162312',
      successColor: '#49aa19',
      successBorderColor: '#389e0d',
      warningBg: '#2b2111',
      warningColor: '#d89614',
      warningBorderColor: '#d48806',
      errorBg: '#2a1215',
      errorColor: '#dc4446',
      errorBorderColor: '#cf1322',
      infoBg: '#111b26',
      infoColor: '#13a8a8',
      infoBorderColor: '#08979c',
      borderRadius: 6,
      fontSize: 12,
      lineHeight: 1.5,
      paddingInline: 7,
      paddingBlock: 0,
      marginInlineEnd: 8,
      closeBtnColor: '#a6a6a6',
      closeBtnHoverColor: '#ffffff',
      closeBtnSize: 10,
    },
    
    // 徽章组件 - 深色徽章样式
    Badge: {
      textFontSize: 12,
      textFontWeight: 400,
      statusSize: 6,
      dotSize: 6,
      dotSizeMin: 4,
      dotSizeMax: 16,
      colorBgContainer: '#1f1f1f',
      colorError: '#dc4446',
      colorWarning: '#d89614',
      colorSuccess: '#49aa19',
      colorInfo: '#13a8a8',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorTextTertiary: '#737373',
      colorTextQuaternary: '#404040',
      colorBorder: '#434343',
      colorBorderSecondary: '#303030',
      colorFill: '#262626',
      colorFillSecondary: '#1f1f1f',
      colorFillTertiary: '#141414',
      colorFillQuaternary: '#0f0f0f',
      borderRadius: 10,
      boxShadow: '0 0 0 1px #1f1f1f',
      boxShadowSecondary: '0 0 0 1px #1f1f1f',
      paddingInline: 6,
      paddingBlock: 0,
      marginInlineEnd: 8,
      zIndexPopup: 1010,
    },
    
    // 头像组件 - 深色头像设计
    Avatar: {
      textFontSize: 14,
      textFontSizeLG: 18,
      textFontSizeSM: 12,
      textFontWeight: 400,
      textColor: '#ffffff',
      textColorSecondary: '#a6a6a6',
      textColorTertiary: '#737373',
      textColorQuaternary: '#404040',
      bg: '#262626',
      bgSecondary: '#1f1f1f',
      bgTertiary: '#141414',
      bgQuaternary: '#0f0f0f',
      colorBgContainer: '#1f1f1f',
      colorBorder: '#434343',
      colorBorderSecondary: '#303030',
      borderRadius: 6,
      borderRadiusLG: 8,
      borderRadiusSM: 4,
      size: 32,
      sizeLG: 40,
      sizeSM: 24,
      sizeXS: 20,
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.06)',
      boxShadowSecondary: '0 0 0 1px rgba(255, 255, 255, 0.06)',
    },
    
    // 分页组件 - 深色分页导航
    Pagination: {
      itemBg: '#1f1f1f',
      itemSize: 32,
      itemSizeSM: 24,
      itemActiveBg: '#177ddc',
      itemActiveBgDisabled: '#262626',
      itemInputBg: '#1f1f1f',
      itemLinkBg: '#1f1f1f',
      itemLinkBgHover: '#262626',
      itemLinkBgActive: '#177ddc',
      itemLinkBgActiveHover: '#3c9be8',
      itemColor: '#ffffff',
      itemColorHover: '#177ddc',
      itemColorActive: '#ffffff',
      itemColorActiveHover: '#ffffff',
      itemColorDisabled: '#737373',
      itemColorDisabledHover: '#737373',
      itemBorderColor: '#434343',
      itemBorderColorHover: '#177ddc',
      itemBorderColorActive: '#177ddc',
      itemBorderColorActiveHover: '#3c9be8',
      itemBorderColorDisabled: '#303030',
      itemBorderColorDisabledHover: '#303030',
      borderRadius: 6,
      borderRadiusSM: 4,
      fontSize: 14,
      fontSizeSM: 12,
      lineHeight: 1.5714285714285714,
      lineHeightSM: 1.66,
      paddingInline: 4,
      paddingInlineSM: 4,
      paddingBlock: 0,
      paddingBlockSM: 0,
      margin: 0,
      marginSM: 0,
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.06)',
      boxShadowSecondary: '0 0 0 1px rgba(255, 255, 255, 0.06)',
    },
    
    // 面包屑组件 - 深色导航路径
    Breadcrumb: {
      itemColor: '#a6a6a6',
      itemColorHover: '#177ddc',
      itemColorActive: '#ffffff',
      itemColorDisabled: '#737373',
      lastItemColor: '#ffffff',
      separatorColor: '#a6a6a6',
      separatorMargin: 8,
      fontSize: 14,
      fontSizeSM: 12,
      lineHeight: 1.5714285714285714,
      lineHeightSM: 1.66,
      linkColor: '#a6a6a6',
      linkColorHover: '#177ddc',
      linkColorActive: '#ffffff',
      linkColorDisabled: '#737373',
      linkDecoration: 'none',
      linkDecorationHover: 'none',
      linkDecorationActive: 'none',
      linkDecorationDisabled: 'none',
      linkHoverDecoration: 'none',
      linkActiveDecoration: 'none',
      linkDisabledDecoration: 'none',
    },
    
    // 加载组件 - 深色加载动画
    Spin: {
      colorPrimary: '#177ddc',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorTextTertiary: '#737373',
      colorTextQuaternary: '#404040',
      colorBgContainer: '#1f1f1f',
      colorBorder: '#434343',
      colorBorderSecondary: '#303030',
      colorFill: '#262626',
      colorFillSecondary: '#1f1f1f',
      colorFillTertiary: '#141414',
      colorFillQuaternary: '#0f0f0f',
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      lineHeight: 1.5714285714285714,
      lineHeightLG: 1.5,
      lineHeightSM: 1.66,
      borderRadius: 6,
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.06)',
      boxShadowSecondary: '0 0 0 1px rgba(255, 255, 255, 0.06)',
      padding: 16,
      paddingLG: 24,
      paddingSM: 12,
      margin: 0,
      marginLG: 0,
      marginSM: 0,
      zIndexPopup: 1010,
    },
    
    // 进度条组件 - 深色进度指示
    Progress: {
      defaultColor: '#177ddc',
      remainingColor: '#303030',
      successColor: '#49aa19',
      exceptionColor: '#dc4446',
      textColor: '#ffffff',
      textColorSecondary: '#a6a6a6',
      textColorTertiary: '#737373',
      textColorQuaternary: '#404040',
      fontSize: 14,
      fontSizeSM: 12,
      lineHeight: 1.5714285714285714,
      lineHeightSM: 1.66,
      borderRadius: 100,
      borderRadiusSM: 100,
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.06)',
      boxShadowSecondary: '0 0 0 1px rgba(255, 255, 255, 0.06)',
      padding: 0,
      paddingSM: 0,
      margin: 0,
      marginSM: 0,
    },
    
    // 下拉菜单组件 - 深色下拉选择
    Dropdown: {
      colorBgElevated: '#1f1f1f',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorTextTertiary: '#737373',
      colorTextQuaternary: '#404040',
      colorBorder: '#303030',
      colorBorderSecondary: '#303030',
      colorFill: '#262626',
      colorFillSecondary: '#1f1f1f',
      colorFillTertiary: '#141414',
      colorFillQuaternary: '#0f0f0f',
      colorPrimary: '#177ddc',
      colorSuccess: '#49aa19',
      colorWarning: '#d89614',
      colorError: '#dc4446',
      colorInfo: '#13a8a8',
      colorLink: '#177ddc',
      colorLinkHover: '#3c9be8',
      colorLinkActive: '#0958d9',
      borderRadius: 6,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      padding: 4,
      paddingLG: 8,
      paddingSM: 4,
      paddingXS: 4,
      paddingXXS: 4,
      margin: 0,
      marginLG: 0,
      marginSM: 0,
      marginXS: 0,
      marginXXS: 0,
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      lineHeight: 1.5714285714285714,
      lineHeightLG: 1.5,
      lineHeightSM: 1.66,
      zIndexPopup: 1050,
    },
    
    // 工具提示组件 - 深色提示信息
    Tooltip: {
      colorBgSpotlight: 'rgba(0, 0, 0, 0.85)',
      colorTextLightSolid: '#ffffff',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorTextTertiary: '#737373',
      colorTextQuaternary: '#404040',
      colorBorder: '#303030',
      colorBorderSecondary: '#303030',
      colorFill: '#262626',
      colorFillSecondary: '#1f1f1f',
      colorFillTertiary: '#141414',
      colorFillQuaternary: '#0f0f0f',
      borderRadius: 6,
      boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      padding: 6,
      paddingLG: 8,
      paddingSM: 4,
      paddingXS: 4,
      paddingXXS: 4,
      margin: 0,
      marginLG: 0,
      marginSM: 0,
      marginXS: 0,
      marginXXS: 0,
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      lineHeight: 1.5714285714285714,
      lineHeightLG: 1.5,
      lineHeightSM: 1.66,
      zIndexPopup: 1070,
    },
    
    // 扩展的组件样式 - 补充缺失的组件
    ...extendedComponents,
  },
};

export default darkTheme;

