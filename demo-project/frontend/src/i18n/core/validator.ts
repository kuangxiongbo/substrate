/**
 * 国际化验证器
 * 基于 Spec-Kit 方法的国际化验证系统
 */

import type {
  I18nValidator,
  ValidationResult,
  Violation,
  TranslationKey,
  LanguagePack,
  HardcodedTextDetection,
} from './types';

export class I18nValidatorImpl implements I18nValidator {
  private translationKeys: Set<string> = new Set();
  private languagePacks: Map<string, LanguagePack> = new Map();
  private violations: Violation[] = [];

  /**
   * 验证国际化合规性
   */
  validateCompliance(code: string, filePath: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检测硬编码文本
    const hardcodedResult = this.detectHardcodedText(code, filePath);
    errors.push(...hardcodedResult.errors);
    warnings.push(...hardcodedResult.warnings);

    // 验证翻译键使用
    const translationResult = this.validateTranslationKeys(code, filePath);
    errors.push(...translationResult.errors);
    warnings.push(...translationResult.warnings);

    // 验证语言包同步
    const syncResult = this.validateLanguagePackSync();
    errors.push(...syncResult.errors);
    warnings.push(...syncResult.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      violations: this.violations,
    };
  }

  /**
   * 检测硬编码文本
   */
  detectHardcodedText(code: string, filePath: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const violations: Violation[] = [];

    // 检测 JSX 文本节点
    const jsxTextRegex = /<[^>]*>([^<]+)<\/[^>]*>/g;
    let match;
    while ((match = jsxTextRegex.exec(code)) !== null) {
      const text = match[1].trim();
      if (this.isUserVisibleText(text)) {
        const violation: Violation = {
          type: 'hardcoded-text',
          severity: 'error',
          message: `发现硬编码文本: "${text}"`,
          file: filePath,
          line: this.getLineNumber(code, match.index),
          column: match.index,
          suggestion: `使用 t('${this.generateTranslationKey(text)}') 替代`,
        };
        violations.push(violation);
        errors.push(violation.message);
      }
    }

    // 检测字符串字面量
    const stringLiteralRegex = /(["'`])([^"'`\n]*)\1/g;
    while ((match = stringLiteralRegex.exec(code)) !== null) {
      const text = match[2];
      if (this.isUserVisibleText(text) && !this.isInTranslationCall(code, match.index)) {
        const violation: Violation = {
          type: 'hardcoded-text',
          severity: 'error',
          message: `发现硬编码文本: "${text}"`,
          file: filePath,
          line: this.getLineNumber(code, match.index),
          column: match.index,
          suggestion: `使用 t('${this.generateTranslationKey(text)}') 替代`,
        };
        violations.push(violation);
        errors.push(violation.message);
      }
    }

    this.violations.push(...violations);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      violations,
    };
  }

  /**
   * 验证翻译键使用
   */
  validateTranslationKeys(code: string, filePath: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const violations: Violation[] = [];

    // 提取翻译键使用
    const translationKeyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    let match;
    while ((match = translationKeyRegex.exec(code)) !== null) {
      const key = match[1];
      
      // 验证翻译键格式
      if (!this.isValidTranslationKey(key)) {
        const violation: Violation = {
          type: 'invalid-translation-key',
          severity: 'error',
          message: `翻译键格式无效: "${key}"`,
          file: filePath,
          line: this.getLineNumber(code, match.index),
          column: match.index,
          suggestion: `使用层级格式，如: 'category.subcategory.key'`,
        };
        violations.push(violation);
        errors.push(violation.message);
      }

      // 验证翻译键是否存在
      if (!this.translationKeyExists(key)) {
        const violation: Violation = {
          type: 'missing-translation-key',
          severity: 'error',
          message: `翻译键不存在: "${key}"`,
          file: filePath,
          line: this.getLineNumber(code, match.index),
          column: match.index,
          suggestion: `在语言包中添加翻译键: "${key}"`,
        };
        violations.push(violation);
        errors.push(violation.message);
      }

      this.translationKeys.add(key);
    }

    this.violations.push(...violations);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      violations,
    };
  }

  /**
   * 验证语言包同步
   */
  validateLanguagePackSync(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const violations: Violation[] = [];

    const languagePackNames = Array.from(this.languagePacks.keys());
    
    if (languagePackNames.length < 2) {
      return {
        valid: true,
        errors,
        warnings: ['语言包数量不足，无法进行同步验证'],
        violations,
      };
    }

    // 获取所有翻译键
    const allKeys = new Set<string>();
    for (const [lang, pack] of this.languagePacks) {
      const keys = this.extractTranslationKeys(pack);
      keys.forEach(key => allKeys.add(key));
    }

    // 检查每个语言包是否包含所有键
    for (const [lang, pack] of this.languagePacks) {
      const keys = this.extractTranslationKeys(pack);
      
      for (const key of allKeys) {
        if (!keys.has(key)) {
          const violation: Violation = {
            type: 'missing-translation-key',
            severity: 'error',
            message: `语言包 "${lang}" 缺少翻译键: "${key}"`,
            file: `locales/${lang}.json`,
            line: 0,
            column: 0,
            suggestion: `在 ${lang}.json 中添加翻译键: "${key}"`,
          };
          violations.push(violation);
          errors.push(violation.message);
        }
      }
    }

    this.violations.push(...violations);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      violations,
    };
  }

  /**
   * 加载语言包
   */
  loadLanguagePack(language: string, pack: LanguagePack): void {
    this.languagePacks.set(language, pack);
  }

  /**
   * 获取翻译覆盖率
   */
  getTranslationCoverage(): {
    totalKeys: number;
    usedKeys: number;
    coverage: number;
    unusedKeys: string[];
  } {
    const allKeys = new Set<string>();
    for (const pack of this.languagePacks.values()) {
      const keys = this.extractTranslationKeys(pack);
      keys.forEach(key => allKeys.add(key));
    }

    const usedKeys = this.translationKeys;
    const unusedKeys = Array.from(allKeys).filter(key => !usedKeys.has(key));

    return {
      totalKeys: allKeys.size,
      usedKeys: usedKeys.size,
      coverage: allKeys.size > 0 ? (usedKeys.size / allKeys.size) * 100 : 0,
      unusedKeys,
    };
  }

  /**
   * 生成修复建议
   */
  generateFixSuggestions(code: string, filePath: string): {
    file: string;
    suggestions: Array<{
      original: string;
      replacement: string;
      reason: string;
    }>;
  } {
    const suggestions: Array<{
      original: string;
      replacement: string;
      reason: string;
    }> = [];

    // 为硬编码文本生成修复建议
    for (const violation of this.violations) {
      if (violation.type === 'hardcoded-text' && violation.suggestion) {
        suggestions.push({
          original: violation.message.split(': ')[1] || '',
          replacement: violation.suggestion,
          reason: '硬编码文本需要国际化',
        });
      }
    }

    return {
      file: filePath,
      suggestions,
    };
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
  private isInTranslationCall(code: string, index: number): boolean {
    const beforeIndex = code.substring(0, index);
    const afterIndex = code.substring(index);
    
    // 检查前后是否有 t( 或 useTranslation
    return beforeIndex.includes('t(') || afterIndex.includes(')');
  }

  /**
   * 验证翻译键格式
   */
  private isValidTranslationKey(key: string): boolean {
    // 翻译键应该是层级结构: category.subcategory.key
    return /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/.test(key);
  }

  /**
   * 检查翻译键是否存在
   */
  private translationKeyExists(key: string): boolean {
    for (const pack of this.languagePacks.values()) {
      if (this.hasTranslationKey(pack, key)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 检查对象中是否存在翻译键
   */
  private hasTranslationKey(obj: any, key: string): boolean {
    const keys = key.split('.');
    let current = obj;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return false;
      }
    }
    
    return typeof current === 'string';
  }

  /**
   * 提取翻译键
   */
  private extractTranslationKeys(obj: any, prefix = ''): Set<string> {
    const keys = new Set<string>();
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        const nestedKeys = this.extractTranslationKeys(value, fullKey);
        nestedKeys.forEach(k => keys.add(k));
      } else if (typeof value === 'string') {
        keys.add(fullKey);
      }
    }
    
    return keys;
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
   * 获取行号
   */
  private getLineNumber(code: string, index: number): number {
    return code.substring(0, index).split('\n').length;
  }
}

// 导出验证器实例
export const i18nValidator = new I18nValidatorImpl();



