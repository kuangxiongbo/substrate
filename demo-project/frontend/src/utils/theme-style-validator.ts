/**
 * 主题包样式验证器
 * 用于验证组件和样式是否符合主题包强制规范
 */

export interface ValidationResult {
  isValid: boolean;
  violations: Violation[];
  warnings: Warning[];
  suggestions: Suggestion[];
}

export interface Violation {
  type: 'inline-style' | 'hardcoded-value' | 'missing-theme' | 'invalid-theme-usage';
  message: string;
  severity: 'error' | 'warning';
  file?: string;
  line?: number;
  column?: number;
  code?: string;
}

export interface Warning {
  type: 'performance' | 'accessibility' | 'consistency';
  message: string;
  suggestion?: string;
}

export interface Suggestion {
  type: 'optimization' | 'best-practice' | 'migration';
  message: string;
  code?: string;
}

export class ThemeStyleValidator {
  private static instance: ThemeStyleValidator;
  private violations: Violation[] = [];
  private warnings: Warning[] = [];
  private suggestions: Suggestion[] = [];

  static getInstance(): ThemeStyleValidator {
    if (!ThemeStyleValidator.instance) {
      ThemeStyleValidator.instance = new ThemeStyleValidator();
    }
    return ThemeStyleValidator.instance;
  }

  /**
   * 验证组件是否使用内联样式
   */
  static validateComponent(componentCode: string, fileName: string): ValidationResult {
    const validator = ThemeStyleValidator.getInstance();
    validator.reset();

    // 检查内联样式
    validator.checkInlineStyles(componentCode, fileName);
    
    // 检查主题包使用
    validator.checkThemePackageUsage(componentCode, fileName);
    
    // 检查样式一致性
    validator.checkStyleConsistency(componentCode, fileName);

    return {
      isValid: validator.violations.length === 0,
      violations: validator.violations,
      warnings: validator.warnings,
      suggestions: validator.suggestions
    };
  }

  /**
   * 验证 CSS 文件
   */
  static validateCSS(cssContent: string, fileName: string): ValidationResult {
    const validator = ThemeStyleValidator.getInstance();
    validator.reset();

    // 检查硬编码值
    validator.checkHardcodedValues(cssContent, fileName);
    
    // 检查 CSS 变量使用
    validator.checkCSSVariables(cssContent, fileName);
    
    // 检查主题包应用
    validator.checkThemePackageApplication(cssContent, fileName);

    return {
      isValid: validator.violations.length === 0,
      violations: validator.violations,
      warnings: validator.warnings,
      suggestions: validator.suggestions
    };
  }

  /**
   * 检查内联样式
   */
  private checkInlineStyles(code: string, fileName: string): void {
    const inlineStyleRegex = /style\s*=\s*\{[^}]*\}/g;
    const matches = code.match(inlineStyleRegex);

    if (matches) {
      matches.forEach((match, index) => {
        const violation: Violation = {
          type: 'inline-style',
          message: '禁止使用内联样式，请使用主题包样式',
          severity: 'error',
          file: fileName,
          code: match
        };
        this.violations.push(violation);
      });
    }
  }

  /**
   * 检查主题包使用
   */
  private checkThemePackageUsage(code: string, fileName: string): void {
    const hasThemeImport = /import.*useTheme.*from.*ThemeContext/.test(code);
    const hasThemeUsage = /useTheme\(\)/.test(code);
    const hasThemeClassName = /className.*theme/.test(code);

    if (!hasThemeImport && !hasThemeUsage && !hasThemeClassName) {
      const violation: Violation = {
        type: 'missing-theme',
        message: '组件未使用主题包，请导入并使用 useTheme hook',
        severity: 'warning',
        file: fileName
      };
      this.violations.push(violation);

      const suggestion: Suggestion = {
        type: 'migration',
        message: '添加主题包支持：import { useTheme } from "../contexts/ThemeContext"',
        code: 'import { useTheme } from "../contexts/ThemeContext";'
      };
      this.suggestions.push(suggestion);
    }
  }

  /**
   * 检查样式一致性
   */
  private checkStyleConsistency(code: string, fileName: string): void {
    const hasHardcodedColors = /#[0-9a-fA-F]{3,6}/.test(code);
    const hasHardcodedSizes = /[0-9]+px/.test(code);

    if (hasHardcodedColors) {
      const violation: Violation = {
        type: 'hardcoded-value',
        message: '发现硬编码颜色值，请使用主题包变量',
        severity: 'error',
        file: fileName
      };
      this.violations.push(violation);
    }

    if (hasHardcodedSizes) {
      const warning: Warning = {
        type: 'consistency',
        message: '发现硬编码尺寸值，建议使用主题包变量',
        suggestion: '使用主题包中的间距和尺寸变量'
      };
      this.warnings.push(warning);
    }
  }

  /**
   * 检查硬编码值
   */
  private checkHardcodedValues(cssContent: string, fileName: string): void {
    // 检查硬编码颜色
    const hardcodedColors = cssContent.match(/#[0-9a-fA-F]{3,6}/g);
    if (hardcodedColors) {
      hardcodedColors.forEach(color => {
        const violation: Violation = {
          type: 'hardcoded-value',
          message: `发现硬编码颜色值: ${color}，请使用主题包变量`,
          severity: 'error',
          file: fileName,
          code: color
        };
        this.violations.push(violation);
      });
    }

    // 检查硬编码尺寸
    const hardcodedSizes = cssContent.match(/[0-9]+px/g);
    if (hardcodedSizes) {
      hardcodedSizes.forEach(size => {
        const warning: Warning = {
          type: 'consistency',
          message: `发现硬编码尺寸值: ${size}，建议使用主题包变量`,
          suggestion: '使用主题包中的间距和尺寸变量'
        };
        this.warnings.push(warning);
      });
    }
  }

  /**
   * 检查 CSS 变量使用
   */
  private checkCSSVariables(cssContent: string, fileName: string): void {
    const hasCSSVariables = /var\(--[^)]+\)/.test(cssContent);
    const hasThemeClasses = /\.(light-theme|dark-theme)/.test(cssContent);

    if (!hasCSSVariables && !hasThemeClasses) {
      const violation: Violation = {
        type: 'missing-theme',
        message: 'CSS 文件未使用主题包变量或主题类',
        severity: 'warning',
        file: fileName
      };
      this.violations.push(violation);
    }
  }

  /**
   * 检查主题包应用
   */
  private checkThemePackageApplication(cssContent: string, fileName: string): void {
    const hasLightTheme = /\.light-theme/.test(cssContent);
    const hasDarkTheme = /\.dark-theme/.test(cssContent);

    if (!hasLightTheme || !hasDarkTheme) {
      const warning: Warning = {
        type: 'consistency',
        message: 'CSS 文件缺少完整的主题支持',
        suggestion: '添加 .light-theme 和 .dark-theme 类样式'
      };
      this.warnings.push(warning);
    }
  }

  /**
   * 重置验证器状态
   */
  private reset(): void {
    this.violations = [];
    this.warnings = [];
    this.suggestions = [];
  }

  /**
   * 生成验证报告
   */
  static generateReport(results: ValidationResult[]): string {
    let report = '# 主题包样式验证报告\n\n';
    
    const totalFiles = results.length;
    const validFiles = results.filter(r => r.isValid).length;
    const invalidFiles = totalFiles - validFiles;
    
    report += `## 概览\n`;
    report += `- 总文件数: ${totalFiles}\n`;
    report += `- 通过验证: ${validFiles}\n`;
    report += `- 未通过验证: ${invalidFiles}\n`;
    report += `- 通过率: ${((validFiles / totalFiles) * 100).toFixed(1)}%\n\n`;

    // 违规详情
    const allViolations = results.flatMap(r => r.violations);
    if (allViolations.length > 0) {
      report += `## 违规详情\n\n`;
      allViolations.forEach((violation, index) => {
        report += `### ${index + 1}. ${violation.type}\n`;
        report += `- **文件**: ${violation.file}\n`;
        report += `- **严重级别**: ${violation.severity}\n`;
        report += `- **消息**: ${violation.message}\n`;
        if (violation.code) {
          report += `- **代码**: \`${violation.code}\`\n`;
        }
        report += `\n`;
      });
    }

    // 警告详情
    const allWarnings = results.flatMap(r => r.warnings);
    if (allWarnings.length > 0) {
      report += `## 警告详情\n\n`;
      allWarnings.forEach((warning, index) => {
        report += `### ${index + 1}. ${warning.type}\n`;
        report += `- **消息**: ${warning.message}\n`;
        if (warning.suggestion) {
          report += `- **建议**: ${warning.suggestion}\n`;
        }
        report += `\n`;
      });
    }

    // 建议详情
    const allSuggestions = results.flatMap(r => r.suggestions);
    if (allSuggestions.length > 0) {
      report += `## 改进建议\n\n`;
      allSuggestions.forEach((suggestion, index) => {
        report += `### ${index + 1}. ${suggestion.type}\n`;
        report += `- **消息**: ${suggestion.message}\n`;
        if (suggestion.code) {
          report += `- **代码示例**: \`\`\`typescript\n${suggestion.code}\n\`\`\`\n`;
        }
        report += `\n`;
      });
    }

    return report;
  }

  /**
   * 自动修复建议
   */
  static generateAutoFixSuggestions(result: ValidationResult): string[] {
    const suggestions: string[] = [];

    result.violations.forEach(violation => {
      switch (violation.type) {
        case 'inline-style':
          suggestions.push('将内联样式移动到主题包中，使用 className 替代');
          break;
        case 'hardcoded-value':
          suggestions.push('将硬编码值替换为主题包变量');
          break;
        case 'missing-theme':
          suggestions.push('添加主题包支持和主题类名');
          break;
        case 'invalid-theme-usage':
          suggestions.push('修正主题包使用方式');
          break;
      }
    });

    return suggestions;
  }
}

// 导出便捷函数
export const validateComponent = ThemeStyleValidator.validateComponent;
export const validateCSS = ThemeStyleValidator.validateCSS;
export const generateReport = ThemeStyleValidator.generateReport;
export const generateAutoFixSuggestions = ThemeStyleValidator.generateAutoFixSuggestions;
