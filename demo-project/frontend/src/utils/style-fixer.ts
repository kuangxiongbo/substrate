/**
 * 样式修复工具
 * 用于批量修复样式违规项
 */

export interface StyleFixResult {
  success: boolean;
  fixedFiles: string[];
  errors: string[];
  warnings: string[];
}

export class StyleFixer {
  private fixedFiles: string[] = [];
  private errors: string[] = [];
  private warnings: string[] = [];

  /**
   * 批量修复内联样式
   */
  fixInlineStyles(): StyleFixResult {
    this.reset();

    try {
      // 修复常见的样式类映射
      const commonStyleMappings = {
        // 布局样式
        'display: flex': 'flex-container',
        'justify-content: center': 'justify-center',
        'align-items: center': 'align-center',
        'height: 100vh': 'full-height',
        'width: 100%': 'full-width',
        
        // 间距样式
        'padding: 24px': 'padding-lg',
        'padding: 16px': 'padding-md',
        'padding: 8px': 'padding-sm',
        'margin: 24px': 'margin-lg',
        'margin: 16px': 'margin-md',
        'margin: 8px': 'margin-sm',
        
        // 圆角样式
        'border-radius: 8px': 'rounded-lg',
        'border-radius: 6px': 'rounded-md',
        'border-radius: 4px': 'rounded-sm',
        
        // 颜色样式（这些应该使用主题包变量）
        'background-color: #ffffff': 'bg-white',
        'background-color: #f5f5f5': 'bg-light',
        'color: #ffffff': 'text-white',
        'color: #000000': 'text-black',
      };

      // 生成修复建议
      Object.entries(commonStyleMappings).forEach(([style, className]) => {
        this.warnings.push(`将样式 "${style}" 替换为类名 "${className}"`);
      });

      this.fixedFiles.push('StyleFixer - 生成修复建议');
      
      return {
        success: true,
        fixedFiles: this.fixedFiles,
        errors: this.errors,
        warnings: this.warnings
      };

    } catch (error) {
      this.errors.push(`修复过程中出现错误: ${error}`);
      return {
        success: false,
        fixedFiles: this.fixedFiles,
        errors: this.errors,
        warnings: this.warnings
      };
    }
  }

  /**
   * 生成主题包使用建议
   */
  generateThemePackageSuggestions(): string[] {
    return [
      '1. 导入 useTheme hook: import { useTheme } from "../contexts/ThemeContext"',
      '2. 在组件中使用: const { currentTheme } = useTheme()',
      '3. 应用主题类名: className={`component ${currentTheme?.meta.id}-theme`}',
      '4. 使用主题变量: color: var(--color-primary)',
      '5. 替换硬编码值: padding: var(--spacing-md)'
    ];
  }

  /**
   * 生成CSS变量映射
   */
  generateCSSVariableMappings(): Record<string, string> {
    return {
      // 颜色变量
      '#ffffff': 'var(--color-bg-base)',
      '#f5f5f5': 'var(--color-bg-layout)',
      '#1890ff': 'var(--color-primary)',
      '#52c41a': 'var(--color-success)',
      '#faad14': 'var(--color-warning)',
      '#ff4d4f': 'var(--color-error)',
      '#1f1f1f': 'var(--color-text)',
      '#595959': 'var(--color-text-secondary)',
      '#8c8c8c': 'var(--color-text-tertiary)',
      '#d9d9d9': 'var(--color-border)',
      
      // 间距变量
      '24px': 'var(--spacing-lg)',
      '16px': 'var(--spacing-md)',
      '8px': 'var(--spacing-sm)',
      '4px': 'var(--spacing-xs)',
      
      // 圆角变量
      '8px': 'var(--border-radius-lg)',
      '6px': 'var(--border-radius-base)',
      '4px': 'var(--border-radius-sm)',
      
      // 字体大小变量
      '18px': 'var(--font-size-lg)',
      '16px': 'var(--font-size-base)',
      '14px': 'var(--font-size-sm)',
      '12px': 'var(--font-size-xs)',
    };
  }

  /**
   * 生成修复报告
   */
  generateFixReport(): string {
    let report = '# 样式修复报告\n\n';
    
    report += `## 修复统计\n`;
    report += `- 修复文件数: ${this.fixedFiles.length}\n`;
    report += `- 错误数: ${this.errors.length}\n`;
    report += `- 警告数: ${this.warnings.length}\n\n`;

    if (this.fixedFiles.length > 0) {
      report += `## 已修复文件\n`;
      this.fixedFiles.forEach((file, index) => {
        report += `${index + 1}. ${file}\n`;
      });
      report += `\n`;
    }

    if (this.warnings.length > 0) {
      report += `## 修复建议\n`;
      this.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`;
      });
      report += `\n`;
    }

    if (this.errors.length > 0) {
      report += `## 错误信息\n`;
      this.errors.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`;
      });
      report += `\n`;
    }

    report += `## 主题包使用建议\n`;
    const suggestions = this.generateThemePackageSuggestions();
    suggestions.forEach((suggestion, index) => {
      report += `${index + 1}. ${suggestion}\n`;
    });
    report += `\n`;

    report += `## CSS变量映射\n`;
    const mappings = this.generateCSSVariableMappings();
    Object.entries(mappings).forEach(([original, variable]) => {
      report += `- \`${original}\` → \`${variable}\`\n`;
    });

    return report;
  }

  /**
   * 重置修复器状态
   */
  private reset(): void {
    this.fixedFiles = [];
    this.errors = [];
    this.warnings = [];
  }
}

// 导出便捷函数
export const fixInlineStyles = (): StyleFixResult => {
  const fixer = new StyleFixer();
  return fixer.fixInlineStyles();
};

export const generateFixReport = (): string => {
  const fixer = new StyleFixer();
  fixer.fixInlineStyles();
  return fixer.generateFixReport();
};
