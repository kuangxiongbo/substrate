/**
 * 自动化修复工具
 * 自动修复样式违规项
 */

export interface FixRule {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  replacement: string;
  type: 'inline-style' | 'hardcoded-value' | 'missing-theme' | 'duplicate-key';
  priority: number; // 优先级，数字越小优先级越高
}

export interface FixResult {
  success: boolean;
  file: string;
  fixes: Array<{
    rule: string;
    line: number;
    original: string;
    fixed: string;
  }>;
  errors: string[];
}

export class AutoFixer {
  private rules: FixRule[] = [];

  constructor() {
    this.initializeRules();
  }

  /**
   * 初始化修复规则
   */
  private initializeRules(): void {
    this.rules = [
      // 内联样式修复规则
      {
        id: 'remove-inline-style',
        name: '移除内联样式',
        description: '将内联样式替换为CSS类',
        pattern: /style=\{\{[^}]+\}\}/g,
        replacement: 'className="styled-element"',
        type: 'inline-style',
        priority: 1
      },
      {
        id: 'flex-container',
        name: 'Flex容器样式',
        description: '将flex布局内联样式替换为CSS类',
        pattern: /style=\{\{\s*display:\s*['"]flex['"]\s*\}\}/g,
        replacement: 'className="flex-container"',
        type: 'inline-style',
        priority: 2
      },
      {
        id: 'justify-center',
        name: '居中对齐样式',
        description: '将justify-content: center替换为CSS类',
        pattern: /style=\{\{\s*justifyContent:\s*['"]center['"]\s*\}\}/g,
        replacement: 'className="justify-center"',
        type: 'inline-style',
        priority: 2
      },
      {
        id: 'align-center',
        name: '垂直对齐样式',
        description: '将alignItems: center替换为CSS类',
        pattern: /style=\{\{\s*alignItems:\s*['"]center['"]\s*\}\}/g,
        replacement: 'className="align-center"',
        type: 'inline-style',
        priority: 2
      },
      {
        id: 'full-width',
        name: '全宽样式',
        description: '将width: 100%替换为CSS类',
        pattern: /style=\{\{\s*width:\s*['"]100%['"]\s*\}\}/g,
        replacement: 'className="full-width"',
        type: 'inline-style',
        priority: 2
      },
      {
        id: 'padding-lg',
        name: '大内边距样式',
        description: '将padding: 24px替换为CSS类',
        pattern: /style=\{\{\s*padding:\s*['"]24px['"]\s*\}\}/g,
        replacement: 'className="padding-lg"',
        type: 'inline-style',
        priority: 3
      },
      {
        id: 'padding-md',
        name: '中等内边距样式',
        description: '将padding: 16px替换为CSS类',
        pattern: /style=\{\{\s*padding:\s*['"]16px['"]\s*\}\}/g,
        replacement: 'className="padding-md"',
        type: 'inline-style',
        priority: 3
      },
      {
        id: 'padding-sm',
        name: '小内边距样式',
        description: '将padding: 8px替换为CSS类',
        pattern: /style=\{\{\s*padding:\s*['"]8px['"]\s*\}\}/g,
        replacement: 'className="padding-sm"',
        type: 'inline-style',
        priority: 3
      },
      {
        id: 'margin-lg',
        name: '大外边距样式',
        description: '将margin: 24px替换为CSS类',
        pattern: /style=\{\{\s*margin:\s*['"]24px['"]\s*\}\}/g,
        replacement: 'className="margin-lg"',
        type: 'inline-style',
        priority: 3
      },
      {
        id: 'margin-md',
        name: '中等外边距样式',
        description: '将margin: 16px替换为CSS类',
        pattern: /style=\{\{\s*margin:\s*['"]16px['"]\s*\}\}/g,
        replacement: 'className="margin-md"',
        type: 'inline-style',
        priority: 3
      },
      {
        id: 'margin-sm',
        name: '小外边距样式',
        description: '将margin: 8px替换为CSS类',
        pattern: /style=\{\{\s*margin:\s*['"]8px['"]\s*\}\}/g,
        replacement: 'className="margin-sm"',
        type: 'inline-style',
        priority: 3
      },
      {
        id: 'rounded-lg',
        name: '大圆角样式',
        description: '将borderRadius: 8px替换为CSS类',
        pattern: /style=\{\{\s*borderRadius:\s*['"]8px['"]\s*\}\}/g,
        replacement: 'className="rounded-lg"',
        type: 'inline-style',
        priority: 4
      },
      {
        id: 'rounded-md',
        name: '中等圆角样式',
        description: '将borderRadius: 6px替换为CSS类',
        pattern: /style=\{\{\s*borderRadius:\s*['"]6px['"]\s*\}\}/g,
        replacement: 'className="rounded-md"',
        type: 'inline-style',
        priority: 4
      },
      {
        id: 'rounded-sm',
        name: '小圆角样式',
        description: '将borderRadius: 4px替换为CSS类',
        pattern: /style=\{\{\s*borderRadius:\s*['"]4px['"]\s*\}\}/g,
        replacement: 'className="rounded-sm"',
        type: 'inline-style',
        priority: 4
      },

      // 硬编码值修复规则
      {
        id: 'color-primary',
        name: '主色调变量',
        description: '将#1890ff替换为CSS变量',
        pattern: /#1890ff/g,
        replacement: 'var(--color-primary)',
        type: 'hardcoded-value',
        priority: 5
      },
      {
        id: 'color-success',
        name: '成功色变量',
        description: '将#52c41a替换为CSS变量',
        pattern: /#52c41a/g,
        replacement: 'var(--color-success)',
        type: 'hardcoded-value',
        priority: 5
      },
      {
        id: 'color-warning',
        name: '警告色变量',
        description: '将#faad14替换为CSS变量',
        pattern: /#faad14/g,
        replacement: 'var(--color-warning)',
        type: 'hardcoded-value',
        priority: 5
      },
      {
        id: 'color-error',
        name: '错误色变量',
        description: '将#ff4d4f替换为CSS变量',
        pattern: /#ff4d4f/g,
        replacement: 'var(--color-error)',
        type: 'hardcoded-value',
        priority: 5
      },
      {
        id: 'color-white',
        name: '白色变量',
        description: '将#ffffff替换为CSS变量',
        pattern: /#ffffff/g,
        replacement: 'var(--color-bg-base)',
        type: 'hardcoded-value',
        priority: 5
      },
      {
        id: 'color-black',
        name: '黑色变量',
        description: '将#000000替换为CSS变量',
        pattern: /#000000/g,
        replacement: 'var(--color-text)',
        type: 'hardcoded-value',
        priority: 5
      },
      {
        id: 'spacing-lg',
        name: '大间距变量',
        description: '将24px替换为CSS变量',
        pattern: /24px/g,
        replacement: 'var(--spacing-lg)',
        type: 'hardcoded-value',
        priority: 6
      },
      {
        id: 'spacing-md',
        name: '中等间距变量',
        description: '将16px替换为CSS变量',
        pattern: /16px/g,
        replacement: 'var(--spacing-md)',
        type: 'hardcoded-value',
        priority: 6
      },
      {
        id: 'spacing-sm',
        name: '小间距变量',
        description: '将8px替换为CSS变量',
        pattern: /8px/g,
        replacement: 'var(--spacing-sm)',
        type: 'hardcoded-value',
        priority: 6
      },
      {
        id: 'border-radius-lg',
        name: '大圆角变量',
        description: '将8px圆角替换为CSS变量',
        pattern: /border-radius:\s*8px/g,
        replacement: 'border-radius: var(--border-radius-lg)',
        type: 'hardcoded-value',
        priority: 6
      },
      {
        id: 'border-radius-md',
        name: '中等圆角变量',
        description: '将6px圆角替换为CSS变量',
        pattern: /border-radius:\s*6px/g,
        replacement: 'border-radius: var(--border-radius-base)',
        type: 'hardcoded-value',
        priority: 6
      },
      {
        id: 'border-radius-sm',
        name: '小圆角变量',
        description: '将4px圆角替换为CSS变量',
        pattern: /border-radius:\s*4px/g,
        replacement: 'border-radius: var(--border-radius-sm)',
        type: 'hardcoded-value',
        priority: 6
      },

      // 主题包支持修复规则
      {
        id: 'add-theme-hook',
        name: '添加主题Hook',
        description: '为组件添加useTheme hook',
        pattern: /import React[^;]+;/,
        replacement: '$&\nimport { useTheme } from \'../contexts/ThemeContext\';',
        type: 'missing-theme',
        priority: 7
      },
      {
        id: 'add-theme-class',
        name: '添加主题类名',
        description: '为组件添加主题类名',
        pattern: /className="([^"]*)"/,
        replacement: 'className={`$1 ${currentTheme?.meta.id || \'light\'}-theme`}',
        type: 'missing-theme',
        priority: 7
      },

      // 重复键修复规则
      {
        id: 'remove-duplicate-key',
        name: '移除重复键',
        description: '移除主题包中的重复键',
        pattern: /(\w+):\s*[^,]+,\s*\n\s*\1:\s*[^,]+/g,
        replacement: '$1: $2', // 保留第二个定义
        type: 'duplicate-key',
        priority: 8
      }
    ];

    // 按优先级排序
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 自动修复文件
   */
  async fixFile(filePath: string, content: string): Promise<FixResult> {
    const result: FixResult = {
      success: true,
      file: filePath,
      fixes: [],
      errors: []
    };

    try {
      let fixedContent = content;
      const lines = content.split('\n');

      // 应用所有修复规则
      for (const rule of this.rules) {
        const matches = [...content.matchAll(rule.pattern)];
        
        for (const match of matches) {
          const original = match[0];
          const fixed = original.replace(rule.pattern, rule.replacement);
          
          if (original !== fixed) {
            // 计算行号
            const lineNumber = content.substring(0, match.index).split('\n').length;
            
            result.fixes.push({
              rule: rule.name,
              line: lineNumber,
              original,
              fixed
            });

            fixedContent = fixedContent.replace(original, fixed);
          }
        }
      }

      // 如果有修复，返回修复后的内容
      if (result.fixes.length > 0) {
        return {
          ...result,
          fixedContent
        } as FixResult & { fixedContent: string };
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`修复失败: ${error}`);
    }

    return result;
  }

  /**
   * 批量修复文件
   */
  async fixFiles(files: Array<{ path: string; content: string }>): Promise<FixResult[]> {
    const results: FixResult[] = [];

    for (const file of files) {
      try {
        const result = await this.fixFile(file.path, file.content);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          file: file.path,
          fixes: [],
          errors: [`处理文件失败: ${error}`]
        });
      }
    }

    return results;
  }

  /**
   * 获取修复规则
   */
  getRules(): FixRule[] {
    return [...this.rules];
  }

  /**
   * 添加自定义修复规则
   */
  addRule(rule: FixRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 移除修复规则
   */
  removeRule(ruleId: string): boolean {
    const index = this.rules.findIndex(rule => rule.id === ruleId);
    if (index > -1) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 生成修复报告
   */
  generateReport(results: FixResult[]): string {
    let report = '# 自动修复报告\n\n';
    
    const totalFiles = results.length;
    const successFiles = results.filter(r => r.success).length;
    const totalFixes = results.reduce((sum, r) => sum + r.fixes.length, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    report += `## 修复统计\n`;
    report += `- 处理文件数: ${totalFiles}\n`;
    report += `- 成功文件数: ${successFiles}\n`;
    report += `- 总修复数: ${totalFixes}\n`;
    report += `- 错误数: ${totalErrors}\n\n`;

    if (totalFixes > 0) {
      report += `## 修复详情\n`;
      results.forEach(result => {
        if (result.fixes.length > 0) {
          report += `### ${result.file}\n`;
          result.fixes.forEach(fix => {
            report += `- **${fix.rule}** (第${fix.line}行)\n`;
            report += `  - 原值: \`${fix.original}\`\n`;
            report += `  - 修复: \`${fix.fixed}\`\n`;
          });
          report += `\n`;
        }
      });
    }

    if (totalErrors > 0) {
      report += `## 错误信息\n`;
      results.forEach(result => {
        if (result.errors.length > 0) {
          report += `### ${result.file}\n`;
          result.errors.forEach(error => {
            report += `- ${error}\n`;
          });
          report += `\n`;
        }
      });
    }

    return report;
  }
}

// 全局自动修复器实例
export const globalAutoFixer = new AutoFixer();
