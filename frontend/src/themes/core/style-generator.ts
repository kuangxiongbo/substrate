/**
 * 样式生成器
 * 根据主题包配置生成完整的CSS样式
 */

import type { ThemePackageConfig, ThemeToken } from './types';

export interface StyleGeneratorOptions {
  includeLayout?: boolean;
  includeComponents?: boolean;
  includeAnimations?: boolean;
  includeResponsive?: boolean;
  minify?: boolean;
}

export class StyleGenerator {
  private theme: ThemePackageConfig;
  private options: StyleGeneratorOptions;

  constructor(theme: ThemePackageConfig, options: StyleGeneratorOptions = {}) {
    this.theme = theme;
    this.options = {
      includeLayout: true,
      includeComponents: true,
      includeAnimations: true,
      includeResponsive: true,
      minify: false,
      ...options,
    };
  }

  /**
   * 生成完整的CSS样式
   */
  generateCSS(): string {
    const styles: string[] = [];

    // 生成CSS变量
    styles.push(this.generateCSSVariables());

    // 生成布局样式
    if (this.options.includeLayout) {
      styles.push(this.generateLayoutStyles());
    }

    // 生成组件样式
    if (this.options.includeComponents) {
      styles.push(this.generateComponentStyles());
    }

    // 生成动画样式
    if (this.options.includeAnimations) {
      styles.push(this.generateAnimationStyles());
    }

    // 生成响应式样式
    if (this.options.includeResponsive) {
      styles.push(this.generateResponsiveStyles());
    }

    return this.options.minify ? this.minifyCSS(styles.join('\n')) : styles.join('\n');
  }

  /**
   * 生成CSS变量
   */
  private generateCSSVariables(): string {
    const variables: string[] = [];
    const token = this.theme.token;

    // 基础颜色变量
    variables.push(`  /* 主题: ${this.theme.meta.displayName} */`);
    variables.push(`  --theme-primary: ${token.colorPrimary};`);
    variables.push(`  --theme-success: ${token.colorSuccess};`);
    variables.push(`  --theme-warning: ${token.colorWarning};`);
    variables.push(`  --theme-error: ${token.colorError};`);
    variables.push(`  --theme-info: ${token.colorInfo};`);

    // 布局变量
    if (token.layoutSidebarWidth) {
      variables.push(`  --layout-sidebar-width: ${token.layoutSidebarWidth}px;`);
    }
    if (token.layoutSidebarCollapsedWidth) {
      variables.push(`  --layout-sidebar-collapsed-width: ${token.layoutSidebarCollapsedWidth}px;`);
    }
    if (token.layoutSidebarHeaderHeight) {
      variables.push(`  --layout-sidebar-header-height: ${token.layoutSidebarHeaderHeight}px;`);
    }
    if (token.layoutTopMenuHeight) {
      variables.push(`  --layout-top-menu-height: ${token.layoutTopMenuHeight}px;`);
    }

    // Logo变量
    if (token.logoBackgroundColor) {
      variables.push(`  --logo-background-color: ${token.logoBackgroundColor};`);
    }
    if (token.logoTextColor) {
      variables.push(`  --logo-text-color: ${token.logoTextColor};`);
    }
    if (token.logoIconColor) {
      variables.push(`  --logo-icon-color: ${token.logoIconColor};`);
    }

    // 菜单变量
    if (token.menuBackgroundColor) {
      variables.push(`  --menu-background-color: ${token.menuBackgroundColor};`);
    }
    if (token.menuItemColor) {
      variables.push(`  --menu-item-color: ${token.menuItemColor};`);
    }
    if (token.menuItemHoverColor) {
      variables.push(`  --menu-item-hover-color: ${token.menuItemHoverColor};`);
    }
    if (token.menuItemSelectedColor) {
      variables.push(`  --menu-item-selected-color: ${token.menuItemSelectedColor};`);
    }
    
    // 顶部菜单专用变量
    if (token.topMenuHeight) {
      variables.push(`  --top-menu-height: ${token.topMenuHeight}px;`);
    }
    if (token.topMenuItemMargin) {
      variables.push(`  --top-menu-item-margin: ${token.topMenuItemMargin}px;`);
    }
    if (token.topMenuItemPadding) {
      variables.push(`  --top-menu-item-padding: ${token.topMenuItemPadding}px;`);
    }
    if (token.topMenuContainerPadding) {
      variables.push(`  --top-menu-container-padding: ${token.topMenuContainerPadding}px;`);
    }
    if (token.topMenuContainerMargin) {
      variables.push(`  --top-menu-container-margin: ${token.topMenuContainerMargin}px;`);
    }

    // 按钮变量
    if (token.buttonPrimaryColor) {
      variables.push(`  --button-primary-color: ${token.buttonPrimaryColor};`);
    }
    if (token.buttonDefaultColor) {
      variables.push(`  --button-default-color: ${token.buttonDefaultColor};`);
    }
    if (token.buttonTextColor) {
      variables.push(`  --button-text-color: ${token.buttonTextColor};`);
    }

    // 头部变量
    if (token.headerBackgroundColor) {
      variables.push(`  --header-background-color: ${token.headerBackgroundColor};`);
    }
    if (token.headerTextColor) {
      variables.push(`  --header-text-color: ${token.headerTextColor};`);
    }
    if (token.headerIconColor) {
      variables.push(`  --header-icon-color: ${token.headerIconColor};`);
    }

    return `:root {\n${variables.join('\n')}\n}`;
  }

  /**
   * 生成布局样式
   */
  private generateLayoutStyles(): string {
    const styles: string[] = [];
    const token = this.theme.token;

    // 侧边栏样式
    styles.push(`
/* 侧边栏布局样式 */
.sidebar {
  width: var(--layout-sidebar-width, 240px);
  background-color: ${token.layoutSidebarBackgroundColor || token.colorBgContainer};
  border-right: 1px solid ${token.layoutSidebarBorderColor || token.colorBorder};
  box-shadow: ${token.layoutSidebarShadowColor || token.boxShadow};
}

.sidebar.collapsed {
  width: var(--layout-sidebar-collapsed-width, 80px);
}

.sidebar-header {
  height: var(--layout-sidebar-header-height, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${token.layoutSidebarBorderColor || token.colorBorder};
  background-color: ${token.headerBackgroundColor || token.colorBgContainer};
}`);

    // 顶部菜单样式
    styles.push(`
/* 顶部菜单布局样式 */
.top-menu-layout .top-header {
  height: var(--layout-top-menu-height, 64px);
  background-color: ${token.layoutTopMenuBackgroundColor || token.colorBgContainer};
  border-bottom: 1px solid ${token.layoutTopMenuBorderColor || token.colorBorder};
  box-shadow: ${token.layoutTopMenuShadowColor || token.boxShadow};
}`);

    // 内容区域样式
    styles.push(`
/* 内容区域样式 */
.content-area {
  background-color: ${token.layoutContentBackgroundColor || token.colorBgLayout};
  padding: ${token.layoutContentPadding || 16}px;
  margin: ${token.layoutContentMargin || 0}px;
}

/* 全局背景色控制 - 最高优先级 */
html, body {
  background-color: ${token.colorBgLayout} !important;
  transition: background-color 0.3s ease !important;
}

body {
  color: ${token.colorText} !important;
  transition: background-color 0.3s ease, color 0.3s ease !important;
}

/* 确保所有容器都有正确的背景色 */
.ant-layout {
  background-color: ${token.colorBgLayout} !important;
}

.ant-layout-content {
  background-color: ${token.colorBgBase} !important;
}

/* 强制应用主题背景色 - 覆盖所有可能的样式 */
#root, .app, .main-container {
  background-color: ${token.colorBgLayout} !important;
  min-height: 100vh !important;
}

/* 确保页面内容区域背景色正确 */
.page-content, .content-wrapper, .main-content {
  background-color: ${token.colorBgBase} !important;
}`);

    return styles.join('\n');
  }

  /**
   * 生成组件样式
   */
  private generateComponentStyles(): string {
    const styles: string[] = [];
    const token = this.theme.token;

    // Logo样式
    styles.push(`
/* Logo组件样式 */
.logo-text {
  color: ${token.logoTextColor || token.colorText};
  font-size: ${token.logoFontSize || 18}px;
  font-weight: ${token.logoFontWeight || 'bold'};
}

.logo-icon {
  background-color: ${token.logoBackgroundColor || token.colorPrimary};
  color: ${token.logoIconColor || '#ffffff'};
  border-radius: ${token.logoBorderRadius || 6}px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}`);

    // 菜单样式
    styles.push(`
/* 菜单组件样式 */
.menu-theme-unified .ant-menu {
  background-color: ${token.menuBackgroundColor || 'transparent'};
  border-radius: ${token.menuBorderRadius || 6}px;
}

.menu-theme-unified .ant-menu-item {
  color: ${token.menuItemColor || token.colorText};
  font-size: ${token.menuFontSize || 14}px;
  font-weight: ${token.menuFontWeight || 'normal'};
  padding: ${token.menuPadding || 8}px;
  margin: ${token.menuMargin || 4}px 8px;
}

.menu-theme-unified .ant-menu-item:hover {
  background-color: ${token.menuItemHoverBackgroundColor || token.colorFillSecondary};
  color: ${token.menuItemHoverColor || token.colorPrimary};
}

.menu-theme-unified .ant-menu-item-selected {
  background-color: ${token.menuItemSelectedBackgroundColor || token.colorPrimary};
  color: ${token.menuItemSelectedColor || '#ffffff'};
}

.menu-theme-unified .ant-menu-item .ant-menu-item-icon {
  color: ${token.menuIconColor || token.colorTextSecondary};
}

.menu-theme-unified .ant-menu-item:hover .ant-menu-item-icon {
  color: ${token.menuIconHoverColor || token.colorPrimary};
}

.menu-theme-unified .ant-menu-item-selected .ant-menu-item-icon {
  color: ${token.menuIconSelectedColor || '#ffffff'};
}`);

    // 按钮样式
    styles.push(`
/* 按钮组件样式 */
.theme-button {
  border-radius: ${token.buttonBorderRadius || 6}px;
  font-size: ${token.buttonFontSize || 14}px;
  font-weight: ${token.buttonFontWeight || 'normal'};
  padding: ${token.buttonPadding || 8}px 16px;
  margin: ${token.buttonMargin || 4}px;
  box-shadow: ${token.buttonShadow || token.boxShadow};
}

.theme-button.primary {
  background-color: ${token.buttonPrimaryColor || token.colorPrimary};
  color: ${token.buttonTextColor || '#ffffff'};
  border-color: ${token.buttonBorderColor || token.colorPrimary};
}

.theme-button.default {
  background-color: ${token.buttonBackgroundColor || token.colorBgContainer};
  color: ${token.buttonDefaultColor || token.colorText};
  border-color: ${token.buttonBorderColor || token.colorBorder};
}`);

    // 头部样式
    styles.push(`
/* 头部组件样式 */
.theme-header {
  background-color: ${token.headerBackgroundColor || token.colorBgContainer};
  height: ${token.headerHeight || 64}px;
  border-bottom: 1px solid ${token.headerBorderColor || token.colorBorder};
  box-shadow: ${token.headerShadowColor || token.boxShadow};
  padding: 0 ${token.headerPadding || 16}px;
}

.theme-header .header-text {
  color: ${token.headerTextColor || token.colorText};
}

.theme-header .header-icon {
  color: ${token.headerIconColor || token.colorTextSecondary};
}`);

    return styles.join('\n');
  }

  /**
   * 生成动画样式
   */
  private generateAnimationStyles(): string {
    const styles: string[] = [];
    const token = this.theme.token;

    styles.push(`
/* 动画样式 */
.theme-transition {
  transition: all ${token.motionDurationCustom1 || '0.3s'} ${token.motionEaseCustom1 || 'cubic-bezier(0.2, 0, 0, 1)'};
}

.theme-fade-in {
  animation: fadeIn ${token.motionDurationCustom2 || '0.5s'} ${token.motionEaseCustom2 || 'ease-in-out'};
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`);

    return styles.join('\n');
  }

  /**
   * 生成响应式样式
   */
  private generateResponsiveStyles(): string {
    return `
/* 响应式样式 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    position: fixed;
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .content-area {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .theme-header {
    height: 56px;
    padding: 0 8px;
  }
  
  .logo-text {
    font-size: 16px;
  }
}`;
  }

  /**
   * 压缩CSS
   */
  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
      .replace(/\s+/g, ' ') // 合并空白字符
      .replace(/;\s*}/g, '}') // 移除分号后的空格
      .replace(/{\s*/g, '{') // 移除左大括号后的空格
      .replace(/;\s*/g, ';') // 移除分号后的空格
      .trim();
  }
}

/**
 * 创建样式生成器实例
 */
export function createStyleGenerator(
  theme: ThemePackageConfig,
  options?: StyleGeneratorOptions
): StyleGenerator {
  return new StyleGenerator(theme, options);
}

/**
 * 生成主题CSS
 */
export function generateThemeCSS(
  theme: ThemePackageConfig,
  options?: StyleGeneratorOptions
): string {
  const generator = createStyleGenerator(theme, options);
  return generator.generateCSS();
}
