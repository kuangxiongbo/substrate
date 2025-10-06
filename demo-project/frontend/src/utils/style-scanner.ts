/**
 * 样式扫描器
 * 用于扫描和识别代码中的样式违规项
 */

import { ThemeStyleValidator, ValidationResult } from './theme-style-validator';

export interface ScanResult {
  totalFiles: number;
  violations: number;
  warnings: number;
  suggestions: number;
  files: FileScanResult[];
}

export interface FileScanResult {
  file: string;
  violations: ValidationResult['violations'];
  warnings: ValidationResult['warnings'];
  suggestions: ValidationResult['suggestions'];
  score: number; // 0-100, 100为完全合规
}

export class StyleScanner {
  private results: FileScanResult[] = [];

  /**
   * 扫描目录中的所有文件
   */
  async scanDirectory(dirPath: string): Promise<ScanResult> {
    this.results = [];
    
    // 扫描 TypeScript/JavaScript 文件
    await this.scanTSXFiles(dirPath);
    
    // 扫描 CSS 文件
    await this.scanCSSFiles(dirPath);
    
    return this.generateReport();
  }

  /**
   * 扫描 TSX 文件
   */
  private async scanTSXFiles(dirPath: string): Promise<void> {
    const files = await this.getFiles(dirPath, ['.tsx', '.ts', '.jsx', '.js']);
    
    for (const file of files) {
      try {
        const content = await this.readFile(file);
        const result = ThemeStyleValidator.validateComponent(content, file);
        
        this.results.push({
          file,
          violations: result.violations,
          warnings: result.warnings,
          suggestions: result.suggestions,
          score: this.calculateScore(result)
        });
      } catch (error) {
        console.error(`扫描文件失败: ${file}`, error);
      }
    }
  }

  /**
   * 扫描 CSS 文件
   */
  private async scanCSSFiles(dirPath: string): Promise<void> {
    const files = await this.getFiles(dirPath, ['.css', '.scss', '.less']);
    
    for (const file of files) {
      try {
        const content = await this.readFile(file);
        const result = ThemeStyleValidator.validateCSS(content, file);
        
        this.results.push({
          file,
          violations: result.violations,
          warnings: result.warnings,
          suggestions: result.suggestions,
          score: this.calculateScore(result)
        });
      } catch (error) {
        console.error(`扫描文件失败: ${file}`, error);
      }
    }
  }

  /**
   * 获取文件列表
   */
  private async getFiles(dirPath: string, extensions: string[]): Promise<string[]> {
    // 这里应该实现文件系统扫描
    // 由于在浏览器环境中，我们使用模拟数据
    return [
      'src/components/layout/SidebarLayout.tsx',
      'src/components/layout/TopMenuLayout.tsx',
      'src/components/QuickSettingsPanel.tsx',
      'src/styles/global.css',
      'src/styles/menu-theme.css'
    ];
  }

  /**
   * 读取文件内容
   */
  private async readFile(filePath: string): Promise<string> {
    // 这里应该实现文件读取
    // 由于在浏览器环境中，我们返回模拟内容
    return '// 模拟文件内容';
  }

  /**
   * 计算合规性分数
   */
  private calculateScore(result: ValidationResult): number {
    const totalIssues = result.violations.length + result.warnings.length;
    const errorWeight = result.violations.length * 10;
    const warningWeight = result.warnings.length * 5;
    
    const totalWeight = errorWeight + warningWeight;
    const maxWeight = 100; // 假设最大权重为100
    
    return Math.max(0, 100 - (totalWeight / maxWeight) * 100);
  }

  /**
   * 生成扫描报告
   */
  private generateReport(): ScanResult {
    const totalFiles = this.results.length;
    const violations = this.results.reduce((sum, result) => sum + result.violations.length, 0);
    const warnings = this.results.reduce((sum, result) => sum + result.warnings.length, 0);
    const suggestions = this.results.reduce((sum, result) => sum + result.suggestions.length, 0);

    return {
      totalFiles,
      violations,
      warnings,
      suggestions,
      files: this.results
    };
  }

  /**
   * 获取违规最多的文件
   */
  getTopViolationFiles(limit: number = 10): FileScanResult[] {
    return this.results
      .sort((a, b) => b.violations.length - a.violations.length)
      .slice(0, limit);
  }

  /**
   * 获取合规性最差的文件
   */
  getLowestScoreFiles(limit: number = 10): FileScanResult[] {
    return this.results
      .sort((a, b) => a.score - b.score)
      .slice(0, limit);
  }

  /**
   * 生成修复建议
   */
  generateFixSuggestions(): string[] {
    const suggestions: string[] = [];
    
    // 统计最常见的违规类型
    const violationTypes = new Map<string, number>();
    this.results.forEach(result => {
      result.violations.forEach(violation => {
        violationTypes.set(violation.type, (violationTypes.get(violation.type) || 0) + 1);
      });
    });

    // 生成修复建议
    violationTypes.forEach((count, type) => {
      switch (type) {
        case 'inline-style':
          suggestions.push(`发现 ${count} 个内联样式违规，建议使用主题包样式替代`);
          break;
        case 'hardcoded-value':
          suggestions.push(`发现 ${count} 个硬编码值违规，建议使用主题包变量`);
          break;
        case 'missing-theme':
          suggestions.push(`发现 ${count} 个缺少主题包的文件，建议添加主题包支持`);
          break;
        case 'invalid-theme-usage':
          suggestions.push(`发现 ${count} 个主题包使用错误，建议修正使用方式`);
          break;
      }
    });

    return suggestions;
  }

  /**
   * 导出扫描结果
   */
  exportResults(): string {
    const report = this.generateReport();
    let output = '# 样式扫描报告\n\n';
    
    output += `## 概览\n`;
    output += `- 总文件数: ${report.totalFiles}\n`;
    output += `- 违规数量: ${report.violations}\n`;
    output += `- 警告数量: ${report.warnings}\n`;
    output += `- 建议数量: ${report.suggestions}\n`;
    output += `- 平均合规分数: ${(report.files.reduce((sum, f) => sum + f.score, 0) / report.totalFiles).toFixed(1)}\n\n`;

    // 违规最多的文件
    const topViolations = this.getTopViolationFiles(5);
    if (topViolations.length > 0) {
      output += `## 违规最多的文件\n\n`;
      topViolations.forEach((result, index) => {
        output += `${index + 1}. **${result.file}** (${result.violations.length} 个违规)\n`;
      });
      output += `\n`;
    }

    // 合规性最差的文件
    const lowestScores = this.getLowestScoreFiles(5);
    if (lowestScores.length > 0) {
      output += `## 合规性最差的文件\n\n`;
      lowestScores.forEach((result, index) => {
        output += `${index + 1}. **${result.file}** (分数: ${result.score.toFixed(1)})\n`;
      });
      output += `\n`;
    }

    // 修复建议
    const fixSuggestions = this.generateFixSuggestions();
    if (fixSuggestions.length > 0) {
      output += `## 修复建议\n\n`;
      fixSuggestions.forEach((suggestion, index) => {
        output += `${index + 1}. ${suggestion}\n`;
      });
      output += `\n`;
    }

    return output;
  }
}

// 导出便捷函数
export const scanProject = async (dirPath: string): Promise<ScanResult> => {
  const scanner = new StyleScanner();
  return await scanner.scanDirectory(dirPath);
};

export const generateScanReport = async (dirPath: string): Promise<string> => {
  const scanner = new StyleScanner();
  await scanner.scanDirectory(dirPath);
  return scanner.exportResults();
};
