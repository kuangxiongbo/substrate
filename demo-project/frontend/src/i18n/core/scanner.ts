/**
 * 国际化扫描器
 * 扫描代码中的硬编码文本和翻译键使用情况
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import type { Violation, TranslationKey, HardcodedTextDetection } from './types';

export interface ScanOptions {
  include: string[];
  exclude: string[];
  extensions: string[];
  maxFileSize: number;
  patterns: HardcodedTextDetection[];
}

export interface ScanResult {
  files: ScanFileResult[];
  summary: ScanSummary;
  violations: Violation[];
  translationKeys: TranslationKey[];
}

export interface ScanFileResult {
  path: string;
  size: number;
  violations: Violation[];
  translationKeys: string[];
  hardcodedTexts: string[];
}

export interface ScanSummary {
  totalFiles: number;
  scannedFiles: number;
  skippedFiles: number;
  totalViolations: number;
  totalTranslationKeys: number;
  totalHardcodedTexts: number;
  scanTime: number;
}

export class I18nScanner {
  private options: ScanOptions;

  constructor(options: Partial<ScanOptions> = {}) {
    this.options = {
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['node_modules/**', 'dist/**', 'build/**'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      maxFileSize: 1024 * 1024, // 1MB
      patterns: this.getDefaultPatterns(),
      ...options,
    };
  }

  /**
   * 扫描目录
   */
  async scanDirectory(rootPath: string): Promise<ScanResult> {
    const startTime = Date.now();
    const files: ScanFileResult[] = [];
    const violations: Violation[] = [];
    const translationKeys: TranslationKey[] = [];

    // 获取所有文件
    const filePaths = this.getFilePaths(rootPath);
    
    // 扫描每个文件
    for (const filePath of filePaths) {
      try {
        const result = await this.scanFile(filePath);
        files.push(result);
        violations.push(...result.violations);
        
        // 收集翻译键
        for (const key of result.translationKeys) {
          translationKeys.push({
            key,
            value: '',
            language: 'unknown',
            category: this.extractCategory(key),
          });
        }
      } catch (error) {
        console.warn(`扫描文件失败: ${filePath}`, error);
      }
    }

    const scanTime = Date.now() - startTime;

    return {
      files,
      summary: {
        totalFiles: filePaths.length,
        scannedFiles: files.length,
        skippedFiles: filePaths.length - files.length,
        totalViolations: violations.length,
        totalTranslationKeys: translationKeys.length,
        totalHardcodedTexts: files.reduce((sum, file) => sum + file.hardcodedTexts.length, 0),
        scanTime,
      },
      violations,
      translationKeys,
    };
  }

  /**
   * 扫描单个文件
   */
  async scanFile(filePath: string): Promise<ScanFileResult> {
    const content = readFileSync(filePath, 'utf-8');
    const stat = statSync(filePath);
    
    const violations: Violation[] = [];
    const translationKeys: string[] = [];
    const hardcodedTexts: string[] = [];

    // 检测硬编码文本
    const hardcodedResults = this.detectHardcodedText(content, filePath);
    violations.push(...hardcodedResults.violations);
    hardcodedTexts.push(...hardcodedResults.texts);

    // 提取翻译键
    const keys = this.extractTranslationKeys(content);
    translationKeys.push(...keys);

    return {
      path: filePath,
      size: stat.size,
      violations,
      translationKeys,
      hardcodedTexts,
    };
  }

  /**
   * 检测硬编码文本
   */
  private detectHardcodedText(content: string, filePath: string): {
    violations: Violation[];
    texts: string[];
  } {
    const violations: Violation[] = [];
    const texts: string[] = [];

    // 检测 JSX 文本节点
    const jsxTextRegex = /<[^>]*>([^<]+)<\/[^>]*>/g;
    let match;
    while ((match = jsxTextRegex.exec(content)) !== null) {
      const text = match[1].trim();
      if (this.isUserVisibleText(text)) {
        texts.push(text);
        violations.push({
          type: 'hardcoded-text',
          severity: 'error',
          message: `发现硬编码文本: "${text}"`,
          file: filePath,
          line: this.getLineNumber(content, match.index),
          column: match.index,
          suggestion: `使用 t('${this.generateTranslationKey(text)}') 替代`,
        });
      }
    }

    // 检测字符串字面量
    const stringLiteralRegex = /(["'`])([^"'`\n]*)\1/g;
    while ((match = stringLiteralRegex.exec(content)) !== null) {
      const text = match[2];
      if (this.isUserVisibleText(text) && !this.isInTranslationCall(content, match.index)) {
        texts.push(text);
        violations.push({
          type: 'hardcoded-text',
          severity: 'error',
          message: `发现硬编码文本: "${text}"`,
          file: filePath,
          line: this.getLineNumber(content, match.index),
          column: match.index,
          suggestion: `使用 t('${this.generateTranslationKey(text)}') 替代`,
        });
      }
    }

    return { violations, texts };
  }

  /**
   * 提取翻译键
   */
  private extractTranslationKeys(content: string): string[] {
    const keys: string[] = [];
    const translationKeyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    let match;
    
    while ((match = translationKeyRegex.exec(content)) !== null) {
      keys.push(match[1]);
    }

    return keys;
  }

  /**
   * 获取文件路径列表
   */
  private getFilePaths(rootPath: string): string[] {
    const paths: string[] = [];
    
    const scanDirectory = (dirPath: string) => {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 检查是否应该排除此目录
          if (!this.shouldExcludeDirectory(fullPath)) {
            scanDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          // 检查文件扩展名
          if (this.options.extensions.includes(extname(fullPath))) {
            // 检查文件大小
            if (stat.size <= this.options.maxFileSize) {
              paths.push(fullPath);
            }
          }
        }
      }
    };

    scanDirectory(rootPath);
    return paths;
  }

  /**
   * 判断是否应该排除目录
   */
  private shouldExcludeDirectory(dirPath: string): boolean {
    for (const excludePattern of this.options.exclude) {
      if (dirPath.includes(excludePattern.replace('**/', '').replace('/**', ''))) {
        return true;
      }
    }
    return false;
  }

  /**
   * 判断是否为用户可见文本
   */
  private isUserVisibleText(text: string): boolean {
    if (!text || text.trim().length === 0) {
      return false;
    }

    // 排除技术标识符
    const technicalPatterns = [
      /^[A-Z_]+$/, // 常量
      /^[a-z][a-zA-Z0-9]*$/, // 变量名
      /^https?:\/\//, // URL
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 邮箱
      /^\d{4}-\d{2}-\d{2}$/, // 日期格式
      /^\d+$/, // 纯数字
      /^[a-zA-Z0-9._-]+$/, // 文件名
    ];

    for (const pattern of technicalPatterns) {
      if (pattern.test(text)) {
        return false;
      }
    }

    // 包含中文字符或常见英文单词的文本
    return /[\u4e00-\u9fa5]/.test(text) || 
           /^(Loading|Save|Cancel|Confirm|Delete|Edit|Add|Search|Reset|Submit|Back|Next|Previous|Success|Error|Warning|Info|Yes|No|OK)$/i.test(text);
  }

  /**
   * 判断是否在翻译函数调用中
   */
  private isInTranslationCall(content: string, index: number): boolean {
    const beforeIndex = content.substring(0, index);
    const afterIndex = content.substring(index);
    
    // 检查前后是否有 t( 或 useTranslation
    return beforeIndex.includes('t(') || afterIndex.includes(')');
  }

  /**
   * 生成翻译键
   */
  private generateTranslationKey(text: string): string {
    // 简单的翻译键生成逻辑
    const cleanText = text.replace(/[^\w\s]/g, '').toLowerCase();
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 1) {
      return `common.${words[0]}`;
    } else if (words.length === 2) {
      return `${words[0]}.${words[1]}`;
    } else {
      return `${words[0]}.${words.slice(1).join('_')}`;
    }
  }

  /**
   * 提取类别
   */
  private extractCategory(key: string): string {
    const parts = key.split('.');
    return parts[0] || 'unknown';
  }

  /**
   * 获取行号
   */
  private getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * 获取默认检测模式
   */
  private getDefaultPatterns(): HardcodedTextDetection[] {
    return [
      {
        pattern: /<[^>]*>([^<]+)<\/[^>]*>/g,
        description: 'JSX 文本节点',
        severity: 'error',
        fixable: true,
      },
      {
        pattern: /(["'`])([^"'`\n]*)\1/g,
        description: '字符串字面量',
        severity: 'error',
        fixable: true,
      },
    ];
  }
}

// 导出扫描器实例
export const i18nScanner = new I18nScanner();



