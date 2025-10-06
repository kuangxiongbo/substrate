/**
 * 主题包强制器
 * 提供运行时样式验证和强制应用主题包样式
 */

export interface ThemeEnforcerConfig {
  strictMode: boolean;
  autoFix: boolean;
  reportViolations: boolean;
  fallbackTheme: string;
}

export interface EnforcementResult {
  success: boolean;
  violations: string[];
  fixes: string[];
  warnings: string[];
}

export class ThemeEnforcer {
  private config: ThemeEnforcerConfig;
  private violations: Set<string> = new Set();
  private fixes: Set<string> = new Set();
  private warnings: Set<string> = new Set();

  constructor(config: Partial<ThemeEnforcerConfig> = {}) {
    this.config = {
      strictMode: true,
      autoFix: false,
      reportViolations: true,
      fallbackTheme: 'light',
      ...config
    };

    this.initializeEnforcement();
  }

  /**
   * 初始化强制器
   */
  private initializeEnforcement(): void {
    if (typeof window === 'undefined') return;

    // 监听 DOM 变化
    this.observeDOMChanges();
    
    // 监听样式变化
    this.observeStyleChanges();
    
    // 初始化检查
    this.performInitialCheck();
  }

  /**
   * 监听 DOM 变化
   */
  private observeDOMChanges(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkElement(node as Element);
            }
          });
        } else if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'style') {
            this.checkElement(mutation.target as Element);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }

  /**
   * 监听样式变化
   */
  private observeStyleChanges(): void {
    // 监听 CSS 样式表变化
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const styleSheet = styleSheets[i];
        if (styleSheet.rules) {
          this.checkStyleSheet(styleSheet);
        }
      } catch (e) {
        // 跨域样式表无法访问
        console.warn('无法访问样式表:', e);
      }
    }
  }

  /**
   * 执行初始检查
   */
  private performInitialCheck(): void {
    // 检查所有元素
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element) => {
      this.checkElement(element);
    });

    // 检查所有样式表
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        this.checkStyleSheet(styleSheets[i]);
      } catch (e) {
        // 忽略跨域样式表
      }
    }

    // 报告结果
    if (this.config.reportViolations) {
      this.reportResults();
    }
  }

  /**
   * 检查元素
   */
  private checkElement(element: Element): void {
    // 检查内联样式
    if (element.hasAttribute('style')) {
      const violation = `元素 ${element.tagName} 使用了内联样式`;
      this.violations.add(violation);
      
      if (this.config.autoFix) {
        this.fixInlineStyle(element);
      }
    }

    // 检查主题类名
    if (!this.hasThemeClass(element)) {
      const warning = `元素 ${element.tagName} 缺少主题类名`;
      this.warnings.add(warning);
      
      if (this.config.autoFix) {
        this.fixThemeClass(element);
      }
    }

    // 检查硬编码样式
    const computedStyle = window.getComputedStyle(element);
    this.checkHardcodedStyles(element, computedStyle);
  }

  /**
   * 检查样式表
   */
  private checkStyleSheet(styleSheet: CSSStyleSheet): void {
    try {
      const rules = styleSheet.cssRules || styleSheet.rules;
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.type === CSSRule.STYLE_RULE) {
          this.checkCSSRule(rule as CSSStyleRule);
        }
      }
    } catch (e) {
      // 忽略无法访问的规则
    }
  }

  /**
   * 检查 CSS 规则
   */
  private checkCSSRule(rule: CSSStyleRule): void {
    const style = rule.style;
    
    // 检查硬编码颜色值
    if (style.color && /#[0-9a-fA-F]{3,6}/.test(style.color)) {
      const violation = `CSS 规则 ${rule.selectorText} 使用了硬编码颜色值: ${style.color}`;
      this.violations.add(violation);
    }

    // 检查硬编码背景色
    if (style.backgroundColor && /#[0-9a-fA-F]{3,6}/.test(style.backgroundColor)) {
      const violation = `CSS 规则 ${rule.selectorText} 使用了硬编码背景色: ${style.backgroundColor}`;
      this.violations.add(violation);
    }

    // 检查硬编码尺寸
    if (style.width && /[0-9]+px/.test(style.width)) {
      const warning = `CSS 规则 ${rule.selectorText} 使用了硬编码宽度: ${style.width}`;
      this.warnings.add(warning);
    }

    if (style.height && /[0-9]+px/.test(style.height)) {
      const warning = `CSS 规则 ${rule.selectorText} 使用了硬编码高度: ${style.height}`;
      this.warnings.add(warning);
    }
  }

  /**
   * 检查硬编码样式
   */
  private checkHardcodedStyles(element: Element, computedStyle: CSSStyleDeclaration): void {
    // 检查硬编码颜色
    if (computedStyle.color && /#[0-9a-fA-F]{3,6}/.test(computedStyle.color)) {
      const violation = `元素 ${element.tagName} 使用硬编码颜色: ${computedStyle.color}`;
      this.violations.add(violation);
    }

    // 检查硬编码背景色
    if (computedStyle.backgroundColor && /#[0-9a-fA-F]{3,6}/.test(computedStyle.backgroundColor)) {
      const violation = `元素 ${element.tagName} 使用硬编码背景色: ${computedStyle.backgroundColor}`;
      this.violations.add(violation);
    }
  }

  /**
   * 检查是否有主题类名
   */
  private hasThemeClass(element: Element): boolean {
    const classList = element.classList;
    return classList.contains('light-theme') || 
           classList.contains('dark-theme') ||
           classList.contains('theme-light') ||
           classList.contains('theme-dark');
  }

  /**
   * 修复内联样式
   */
  private fixInlineStyle(element: Element): void {
    const style = element.getAttribute('style');
    if (style) {
      // 移除内联样式
      element.removeAttribute('style');
      
      // 添加主题类名
      if (!this.hasThemeClass(element)) {
        element.classList.add(`${this.config.fallbackTheme}-theme`);
      }
      
      const fix = `修复元素 ${element.tagName} 的内联样式`;
      this.fixes.add(fix);
    }
  }

  /**
   * 修复主题类名
   */
  private fixThemeClass(element: Element): void {
    if (!this.hasThemeClass(element)) {
      element.classList.add(`${this.config.fallbackTheme}-theme`);
      
      const fix = `为元素 ${element.tagName} 添加主题类名`;
      this.fixes.add(fix);
    }
  }

  /**
   * 报告结果
   */
  private reportResults(): void {
    const result: EnforcementResult = {
      success: this.violations.size === 0,
      violations: Array.from(this.violations),
      fixes: Array.from(this.fixes),
      warnings: Array.from(this.warnings)
    };

    // 控制台输出
    console.group('🎨 主题包样式强制验证结果');
    
    if (result.violations.length > 0) {
      console.error('❌ 发现违规:', result.violations);
    }
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ 发现警告:', result.warnings);
    }
    
    if (result.fixes.length > 0) {
      console.info('✅ 自动修复:', result.fixes);
    }
    
    if (result.success) {
      console.info('🎉 所有样式符合主题包强制规范');
    }
    
    console.groupEnd();

    // 触发自定义事件
    const event = new CustomEvent('themeEnforcementResult', {
      detail: result
    });
    window.dispatchEvent(event);
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): string {
    const body = document.body;
    if (body.classList.contains('dark-theme')) return 'dark';
    if (body.classList.contains('light-theme')) return 'light';
    return this.config.fallbackTheme;
  }

  /**
   * 设置主题
   */
  setTheme(theme: string): void {
    const body = document.body;
    
    // 移除现有主题类
    body.classList.remove('light-theme', 'dark-theme');
    
    // 添加新主题类
    body.classList.add(`${theme}-theme`);
    
    // 重新检查
    this.performInitialCheck();
  }

  /**
   * 获取执行结果
   */
  getResult(): EnforcementResult {
    return {
      success: this.violations.size === 0,
      violations: Array.from(this.violations),
      fixes: Array.from(this.fixes),
      warnings: Array.from(this.warnings)
    };
  }

  /**
   * 重置结果
   */
  reset(): void {
    this.violations.clear();
    this.fixes.clear();
    this.warnings.clear();
  }
}

// 创建全局实例
let globalEnforcer: ThemeEnforcer | null = null;

/**
 * 获取全局主题包强制器
 */
export function getThemeEnforcer(config?: Partial<ThemeEnforcerConfig>): ThemeEnforcer {
  if (!globalEnforcer) {
    globalEnforcer = new ThemeEnforcer(config);
  }
  return globalEnforcer;
}

/**
 * 初始化主题包强制器
 */
export function initializeThemeEnforcer(config?: Partial<ThemeEnforcerConfig>): ThemeEnforcer {
  globalEnforcer = new ThemeEnforcer(config);
  return globalEnforcer;
}

/**
 * 检查样式合规性
 */
export function checkStyleCompliance(): EnforcementResult {
  const enforcer = getThemeEnforcer();
  return enforcer.getResult();
}

/**
 * 强制应用主题
 */
export function enforceTheme(theme: string): void {
  const enforcer = getThemeEnforcer();
  enforcer.setTheme(theme);
}

// 导出类型和类
export type { ThemeEnforcerConfig, EnforcementResult };
export { ThemeEnforcer };
