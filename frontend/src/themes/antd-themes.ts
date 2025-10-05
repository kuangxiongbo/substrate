/**
 * Ant Design 主题配置
 * 基于 Spec-Kit 方法实现的完整主题系统
 */

import { theme } from 'antd';
import { 
  blue, 
  purple, 
  cyan, 
  green, 
  // magenta, 
  red, 
  // volcano, 
  // orange, 
  gold, 
  // lime 
} from '@ant-design/colors';

// 完整的主题类型定义
export interface AntdThemeConfig {
  name: string;
  displayName: string;
  description: string;
  algorithm: any;
  token: {
    // 主色调
    colorPrimary: string;
    colorSuccess: string;
    colorWarning: string;
    colorError: string;
    colorInfo: string;
    
    // 背景色
    colorBgBase: string;
    colorBgContainer: string;
    colorBgElevated: string;
    colorBgLayout: string;
    colorBgSpotlight: string;
    colorBgMask: string;
    
    // 文字色
    colorText: string;
    colorTextSecondary: string;
    colorTextTertiary: string;
    colorTextQuaternary: string;
    colorTextDisabled: string;
    colorTextHeading: string;
    colorTextDescription: string;
    colorTextPlaceholder: string;
    
    // 边框色
    colorBorder: string;
    colorBorderSecondary: string;
    colorSplit: string;
    
    // 填充色
    colorFill: string;
    colorFillSecondary: string;
    colorFillTertiary: string;
    colorFillQuaternary: string;
    
    // 链接色
    colorLink: string;
    colorLinkHover: string;
    colorLinkActive: string;
    
    // 圆角
    borderRadius: number;
    borderRadiusLG: number;
    borderRadiusSM: number;
    borderRadiusXS: number;
    
    // 阴影
    boxShadow: string;
    boxShadowSecondary: string;
    boxShadowTertiary: string;
    
    // 字体
    fontFamily: string;
    fontSize: number;
    fontSizeLG: number;
    fontSizeSM: number;
    fontSizeXL: number;
    fontSizeHeading1: number;
    fontSizeHeading2: number;
    fontSizeHeading3: number;
    fontSizeHeading4: number;
    fontSizeHeading5: number;
    
    // 行高
    lineHeight: number;
    lineHeightLG: number;
    lineHeightSM: number;
    
    // 间距
    padding: number;
    paddingLG: number;
    paddingSM: number;
    paddingXS: number;
    margin: number;
    marginLG: number;
    marginSM: number;
    marginXS: number;
    
    // 动画
    motionDurationFast: string;
    motionDurationMid: string;
    motionDurationSlow: string;
    motionEaseInOut: string;
    motionEaseOut: string;
    motionEaseIn: string;
    
    // 其他
    wireframe: boolean;
    controlHeight: number;
    controlHeightLG: number;
    controlHeightSM: number;
  };
  components: {
    // 布局组件
    Layout: {
      bodyBg: string;
      headerBg: string;
      headerColor: string;
      headerHeight: number;
      siderBg: string;
      siderColor: string;
      triggerBg: string;
      triggerColor: string;
    };
    
    // 菜单组件
    Menu: {
      itemBg: string;
      itemSelectedBg: string;
      itemHoverBg: string;
      itemColor: string;
      itemSelectedColor: string;
      itemHoverColor: string;
      itemActiveBg: string;
      itemActiveColor: string;
      itemDisabledColor: string;
      subMenuItemBg: string;
      groupTitleColor: string;
      iconSize: number;
      collapsedIconSize: number;
      collapsedWidth: number;
    };
    
    // 按钮组件
    Button: {
      primaryColor: string;
      defaultBg: string;
      defaultColor: string;
      defaultBorderColor: string;
      defaultHoverBg: string;
      defaultHoverColor: string;
      defaultHoverBorderColor: string;
      defaultActiveBg: string;
      defaultActiveColor: string;
      defaultActiveBorderColor: string;
      textHoverBg: string;
      textHoverColor: string;
      dangerColor: string;
      dangerBg: string;
      dangerBorderColor: string;
      dangerHoverColor: string;
      dangerHoverBg: string;
      dangerHoverBorderColor: string;
      borderRadius: number;
      controlHeight: number;
      controlHeightLG: number;
      controlHeightSM: number;
      paddingInline: number;
      paddingInlineLG: number;
      paddingInlineSM: number;
      fontSize: number;
      fontSizeLG: number;
      fontSizeSM: number;
      fontWeight: number;
      lineWidth: number;
      shadow: string;
    };
    
    // 卡片组件
    Card: {
      headerBg: string;
      headerColor: string;
      bodyBg: string;
      bodyColor: string;
      borderColor: string;
      borderRadius: number;
      boxShadow: string;
      boxShadowTertiary: string;
      paddingLG: number;
      paddingSM: number;
      paddingXS: number;
      headerFontSize: number;
      headerFontSizeSM: number;
      headerFontSizeLG: number;
      headerHeight: number;
      headerHeightSM: number;
      headerHeightLG: number;
    };
    
    // 输入框组件
    Input: {
      colorBgContainer: string;
      colorBorder: string;
      colorBorderHover: string;
      colorPrimary: string;
      colorText: string;
      colorTextPlaceholder: string;
      colorTextDisabled: string;
      colorTextSecondary: string;
      colorError: string;
      colorErrorHover: string;
      colorWarning: string;
      colorWarningHover: string;
      borderRadius: number;
      controlHeight: number;
      controlHeightLG: number;
      controlHeightSM: number;
      paddingInline: number;
      paddingInlineLG: number;
      paddingInlineSM: number;
      fontSize: number;
      fontSizeLG: number;
      fontSizeSM: number;
      lineWidth: number;
      lineWidthFocus: number;
      boxShadow: string;
      activeShadow: string;
      hoverShadow: string;
    };
    
    // 表格组件
    Table: {
      headerBg: string;
      headerColor: string;
      headerSortActiveBg: string;
      headerSortHoverBg: string;
      bodySortBg: string;
      rowHoverBg: string;
      rowSelectedBg: string;
      rowSelectedHoverBg: string;
      rowExpandedBg: string;
      cellPaddingBlock: number;
      cellPaddingInline: number;
      cellPaddingBlockMD: number;
      cellPaddingInlineMD: number;
      cellPaddingBlockSM: number;
      cellPaddingInlineSM: number;
      borderColor: string;
      headerBorderBottom: string;
      headerSplitColor: string;
      footerBg: string;
      footerColor: string;
      stickyScrollBarBg: string;
      stickyScrollBarBorderRadius: number;
    };
    
    // 模态框组件
    Modal: {
      contentBg: string;
      headerBg: string;
      titleColor: string;
      titleFontSize: number;
      titleLineHeight: number;
      contentPadding: number;
      contentPaddingHorizontal: number;
      contentPaddingVertical: number;
      borderRadius: number;
      boxShadow: string;
      maskBg: string;
      footerBg: string;
      footerPaddingVertical: number;
      footerPaddingHorizontal: number;
      closeBtnColor: string;
      closeBtnHoverColor: string;
      closeBtnSize: number;
    };
    
    // 抽屉组件
    Drawer: {
      colorBgElevated: string;
      colorBgMask: string;
      colorText: string;
      colorTextSecondary: string;
      colorTextTertiary: string;
      colorTextQuaternary: string;
      colorBorder: string;
      colorFillSecondary: string;
      colorFillTertiary: string;
      colorFillQuaternary: string;
      colorPrimary: string;
      colorSuccess: string;
      colorWarning: string;
      colorError: string;
      colorInfo: string;
      colorLink: string;
      colorLinkHover: string;
      colorLinkActive: string;
      borderRadius: number;
      boxShadow: string;
      boxShadowSecondary: string;
      paddingLG: number;
      padding: number;
      paddingSM: number;
      paddingXS: number;
      paddingXXS: number;
      marginLG: number;
      margin: number;
      marginSM: number;
      marginXS: number;
      marginXXS: number;
      fontSize: number;
      fontSizeLG: number;
      fontSizeSM: number;
      fontSizeXL: number;
      lineHeight: number;
      lineHeightLG: number;
      lineHeightSM: number;
      motionDurationSlow: string;
      motionDurationMid: string;
      motionDurationFast: string;
      motionEaseInOut: string;
      motionEaseOut: string;
      motionEaseIn: string;
    };
    
    // 消息组件
    Message: {
      contentBg: string;
      contentPadding: number;
      contentPaddingVertical: number;
      contentPaddingHorizontal: number;
      borderRadius: number;
      boxShadow: string;
      colorText: string;
      colorTextSecondary: string;
      colorSuccess: string;
      colorError: string;
      colorWarning: string;
      colorInfo: string;
      fontSize: number;
      lineHeight: number;
      marginBottom: number;
      zIndexPopup: number;
    };
    
    // 通知组件
    Notification: {
      contentBg: string;
      contentPadding: number;
      contentPaddingVertical: number;
      contentPaddingHorizontal: number;
      borderRadius: number;
      boxShadow: string;
      colorText: string;
      colorTextSecondary: string;
      colorSuccess: string;
      colorError: string;
      colorWarning: string;
      colorInfo: string;
      fontSize: number;
      lineHeight: number;
      marginBottom: number;
      zIndexPopup: number;
      titleFontSize: number;
      titleLineHeight: number;
      titleMarginBottom: number;
      descriptionFontSize: number;
      descriptionLineHeight: number;
      descriptionMarginBottom: number;
      closeBtnColor: string;
      closeBtnHoverColor: string;
      closeBtnSize: number;
    };
    
    // 标签组件
    Tag: {
      defaultBg: string;
      defaultColor: string;
      defaultBorderColor: string;
      successBg: string;
      successColor: string;
      successBorderColor: string;
      warningBg: string;
      warningColor: string;
      warningBorderColor: string;
      errorBg: string;
      errorColor: string;
      errorBorderColor: string;
      infoBg: string;
      infoColor: string;
      infoBorderColor: string;
      borderRadius: number;
      fontSize: number;
      lineHeight: number;
      paddingInline: number;
      paddingBlock: number;
      marginInlineEnd: number;
      closeBtnColor: string;
      closeBtnHoverColor: string;
      closeBtnSize: number;
    };
    
    // 徽章组件
    Badge: {
      textFontSize: number;
      textFontWeight: number;
      statusSize: number;
      dotSize: number;
      dotSizeMin: number;
      dotSizeMax: number;
      colorBgContainer: string;
      colorError: string;
      colorWarning: string;
      colorSuccess: string;
      colorInfo: string;
      colorText: string;
      colorTextSecondary: string;
      colorTextTertiary: string;
      colorTextQuaternary: string;
      colorBorder: string;
      colorBorderSecondary: string;
      colorFill: string;
      colorFillSecondary: string;
      colorFillTertiary: string;
      colorFillQuaternary: string;
      borderRadius: number;
      boxShadow: string;
      boxShadowSecondary: string;
      paddingInline: number;
      paddingBlock: number;
      marginInlineEnd: number;
      zIndexPopup: number;
    };
    
    // 头像组件
    Avatar: {
      textFontSize: number;
      textFontSizeLG: number;
      textFontSizeSM: number;
      textFontWeight: number;
      textColor: string;
      textColorSecondary: string;
      textColorTertiary: string;
      textColorQuaternary: string;
      bg: string;
      bgSecondary: string;
      bgTertiary: string;
      bgQuaternary: string;
      colorBgContainer: string;
      colorBorder: string;
      colorBorderSecondary: string;
      borderRadius: number;
      borderRadiusLG: number;
      borderRadiusSM: number;
      size: number;
      sizeLG: number;
      sizeSM: number;
      sizeXS: number;
      boxShadow: string;
      boxShadowSecondary: string;
    };
    
    // 分页组件
    Pagination: {
      itemBg: string;
      itemSize: number;
      itemSizeSM: number;
      itemActiveBg: string;
      itemActiveBgDisabled: string;
      itemInputBg: string;
      itemLinkBg: string;
      itemLinkBgHover: string;
      itemLinkBgActive: string;
      itemLinkBgActiveHover: string;
      itemColor: string;
      itemColorHover: string;
      itemColorActive: string;
      itemColorActiveHover: string;
      itemColorDisabled: string;
      itemColorDisabledHover: string;
      itemBorderColor: string;
      itemBorderColorHover: string;
      itemBorderColorActive: string;
      itemBorderColorActiveHover: string;
      itemBorderColorDisabled: string;
      itemBorderColorDisabledHover: string;
      borderRadius: number;
      borderRadiusSM: number;
      fontSize: number;
      fontSizeSM: number;
      lineHeight: number;
      lineHeightSM: number;
      paddingInline: number;
      paddingInlineSM: number;
      paddingBlock: number;
      paddingBlockSM: number;
      margin: number;
      marginSM: number;
      boxShadow: string;
      boxShadowSecondary: string;
    };
    
    // 面包屑组件
    Breadcrumb: {
      itemColor: string;
      itemColorHover: string;
      itemColorActive: string;
      itemColorDisabled: string;
      lastItemColor: string;
      separatorColor: string;
      separatorMargin: number;
      fontSize: number;
      fontSizeSM: number;
      lineHeight: number;
      lineHeightSM: number;
      linkColor: string;
      linkColorHover: string;
      linkColorActive: string;
      linkColorDisabled: string;
      linkDecoration: string;
      linkDecorationHover: string;
      linkDecorationActive: string;
      linkDecorationDisabled: string;
      linkHoverDecoration: string;
      linkActiveDecoration: string;
      linkDisabledDecoration: string;
    };
    
    // 加载组件
    Spin: {
      colorPrimary: string;
      colorText: string;
      colorTextSecondary: string;
      colorTextTertiary: string;
      colorTextQuaternary: string;
      colorBgContainer: string;
      colorBorder: string;
      colorBorderSecondary: string;
      colorFill: string;
      colorFillSecondary: string;
      colorFillTertiary: string;
      colorFillQuaternary: string;
      fontSize: number;
      fontSizeLG: number;
      fontSizeSM: number;
      lineHeight: number;
      lineHeightLG: number;
      lineHeightSM: number;
      borderRadius: number;
      boxShadow: string;
      boxShadowSecondary: string;
      padding: number;
      paddingLG: number;
      paddingSM: number;
      margin: number;
      marginLG: number;
      marginSM: number;
      zIndexPopup: number;
    };
    
    // 进度条组件
    Progress: {
      defaultColor: string;
      remainingColor: string;
      successColor: string;
      exceptionColor: string;
      textColor: string;
      textColorSecondary: string;
      textColorTertiary: string;
      textColorQuaternary: string;
      fontSize: number;
      fontSizeSM: number;
      lineHeight: number;
      lineHeightSM: number;
      borderRadius: number;
      borderRadiusSM: number;
      boxShadow: string;
      boxShadowSecondary: string;
      padding: number;
      paddingSM: number;
      margin: number;
      marginSM: number;
    };
    
    // 下拉菜单组件
    Dropdown: {
      colorBgElevated: string;
      colorBgMask: string;
      colorText: string;
      colorTextSecondary: string;
      colorTextTertiary: string;
      colorTextQuaternary: string;
      colorBorder: string;
      colorBorderSecondary: string;
      colorFill: string;
      colorFillSecondary: string;
      colorFillTertiary: string;
      colorFillQuaternary: string;
      colorPrimary: string;
      colorSuccess: string;
      colorWarning: string;
      colorError: string;
      colorInfo: string;
      colorLink: string;
      colorLinkHover: string;
      colorLinkActive: string;
      borderRadius: number;
      boxShadow: string;
      boxShadowSecondary: string;
      padding: number;
      paddingLG: number;
      paddingSM: number;
      paddingXS: number;
      paddingXXS: number;
      margin: number;
      marginLG: number;
      marginSM: number;
      marginXS: number;
      marginXXS: number;
      fontSize: number;
      fontSizeLG: number;
      fontSizeSM: number;
      lineHeight: number;
      lineHeightLG: number;
      lineHeightSM: number;
      zIndexPopup: number;
    };
    
    // 工具提示组件
    Tooltip: {
      colorBgSpotlight: string;
      colorTextLightSolid: string;
      colorText: string;
      colorTextSecondary: string;
      colorTextTertiary: string;
      colorTextQuaternary: string;
      colorBorder: string;
      colorBorderSecondary: string;
      colorFill: string;
      colorFillSecondary: string;
      colorFillTertiary: string;
      colorFillQuaternary: string;
      borderRadius: number;
      boxShadow: string;
      boxShadowSecondary: string;
      padding: number;
      paddingLG: number;
      paddingSM: number;
      paddingXS: number;
      paddingXXS: number;
      margin: number;
      marginLG: number;
      marginSM: number;
      marginXS: number;
      marginXXS: number;
      fontSize: number;
      fontSizeLG: number;
      fontSizeSM: number;
      lineHeight: number;
      lineHeightLG: number;
      lineHeightSM: number;
      zIndexPopup: number;
    };
  };
}

// 浅色主题
export const lightTheme: AntdThemeConfig = {
  name: 'light',
  displayName: '浅色主题',
  description: '明亮清爽的浅色主题，适合日间使用',
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: blue[6],
    colorSuccess: green[6],
    colorWarning: gold[6],
    colorError: red[6],
    colorInfo: cyan[6],
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#d9d9d9',
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    colorTextQuaternary: '#f0f0f0',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: '#f5f5f5',
      headerBg: '#ffffff',
      siderBg: '#001529',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: blue[6],
      itemHoverBg: 'rgba(24, 144, 255, 0.1)',
      itemColor: 'rgba(255, 255, 255, 0.85)',
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#ffffff',
    },
    Button: {
      primaryColor: blue[6],
      defaultBg: '#ffffff',
      defaultColor: '#262626',
      defaultBorderColor: '#d9d9d9',
    },
    Card: {
      headerBg: '#fafafa',
      bodyBg: '#ffffff',
    },
  },
};

// 深色主题
export const darkTheme: AntdThemeConfig = {
  name: 'dark',
  displayName: '深色主题',
  description: '护眼深色主题，适合夜间使用',
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: blue[5],
    colorSuccess: green[5],
    colorWarning: gold[5],
    colorError: red[5],
    colorInfo: cyan[5],
    colorBgBase: '#141414',
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
    colorBorder: '#434343',
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    colorTextTertiary: '#737373',
    colorTextQuaternary: '#404040',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: '#141414',
      headerBg: '#1f1f1f',
      siderBg: '#001529',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: blue[5],
      itemHoverBg: 'rgba(24, 144, 255, 0.2)',
      itemColor: 'rgba(255, 255, 255, 0.85)',
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#ffffff',
    },
    Button: {
      primaryColor: blue[5],
      defaultBg: '#1f1f1f',
      defaultColor: '#ffffff',
      defaultBorderColor: '#434343',
    },
    Card: {
      headerBg: '#262626',
      bodyBg: '#1f1f1f',
    },
  },
};

// 高对比度主题
export const highContrastTheme: AntdThemeConfig = {
  name: 'high-contrast',
  displayName: '高对比度主题',
  description: '高对比度主题，提升可访问性',
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#0000ff',
    colorSuccess: '#008000',
    colorWarning: '#ff8c00',
    colorError: '#ff0000',
    colorInfo: '#0000ff',
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#000000',
    colorText: '#000000',
    colorTextSecondary: '#333333',
    colorTextTertiary: '#666666',
    colorTextQuaternary: '#999999',
    borderRadius: 0,
    wireframe: true,
  },
  components: {
    Layout: {
      bodyBg: '#ffffff',
      headerBg: '#ffffff',
      siderBg: '#000000',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#0000ff',
      itemHoverBg: 'rgba(0, 0, 255, 0.1)',
      itemColor: '#ffffff',
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#ffffff',
    },
    Button: {
      primaryColor: '#0000ff',
      defaultBg: '#ffffff',
      defaultColor: '#000000',
      defaultBorderColor: '#000000',
    },
    Card: {
      headerBg: '#f0f0f0',
      bodyBg: '#ffffff',
    },
  },
};

// 紫色主题
export const purpleTheme: AntdThemeConfig = {
  name: 'purple',
  displayName: '紫色主题',
  description: '优雅的紫色主题，适合创意工作',
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: purple[6],
    colorSuccess: green[6],
    colorWarning: gold[6],
    colorError: red[6],
    colorInfo: cyan[6],
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#d9d9d9',
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    colorTextQuaternary: '#f0f0f0',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: '#faf5ff',
      headerBg: '#ffffff',
      siderBg: '#2d1b69',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: purple[6],
      itemHoverBg: 'rgba(114, 46, 209, 0.1)',
      itemColor: 'rgba(255, 255, 255, 0.85)',
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#ffffff',
    },
    Button: {
      primaryColor: purple[6],
      defaultBg: '#ffffff',
      defaultColor: '#262626',
      defaultBorderColor: '#d9d9d9',
    },
    Card: {
      headerBg: '#f9f0ff',
      bodyBg: '#ffffff',
    },
  },
};

// 青色主题
export const cyanTheme: AntdThemeConfig = {
  name: 'cyan',
  displayName: '青色主题',
  description: '清新的青色主题，适合科技感界面',
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: cyan[6],
    colorSuccess: green[6],
    colorWarning: gold[6],
    colorError: red[6],
    colorInfo: cyan[6],
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#d9d9d9',
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    colorTextTertiary: '#bfbfbf',
    colorTextQuaternary: '#f0f0f0',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Layout: {
      bodyBg: '#f0f9ff',
      headerBg: '#ffffff',
      siderBg: '#002329',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: cyan[6],
      itemHoverBg: 'rgba(13, 202, 240, 0.1)',
      itemColor: 'rgba(255, 255, 255, 0.85)',
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#ffffff',
    },
    Button: {
      primaryColor: cyan[6],
      defaultBg: '#ffffff',
      defaultColor: '#262626',
      defaultBorderColor: '#d9d9d9',
    },
    Card: {
      headerBg: '#e6fffb',
      bodyBg: '#ffffff',
    },
  },
};

// 可用主题列表
export const availableThemes: AntdThemeConfig[] = [
  lightTheme,
  darkTheme,
  highContrastTheme,
  purpleTheme,
  cyanTheme,
];

// 根据主题名称获取主题配置
export const getThemeByName = (name: string): AntdThemeConfig | undefined => {
  return availableThemes.find(theme => theme.name === name);
};

// 获取默认主题
export const getDefaultTheme = (): AntdThemeConfig => {
  return lightTheme;
};



















