/**
 * Vite 国际化验证插件
 * 基于 Spec-Kit 方法的构建时国际化验证
 */

import { readFileSync } from 'fs';
import { join, resolve } from 'path';

export function i18nValidator(options = {}) {
  const {
    enabled = true,
    failOnError = true,
    failOnWarning = false,
    include = ['src/**/*.{ts,tsx,js,jsx}'],
    exclude = ['node_modules/**', 'dist/**', 'build/**'],
    languagePacks = ['src/i18n/locales/**/*.json'],
    reportViolations = true,
    autoFix = false,
  } = options;

  let violations = [];
  let translationKeys = new Set();
  let languagePacksData = new Map();

  // 定义加载语言包的函数
  const loadLanguagePacks = () => {
    try {
      // 加载中文语言包
      const zhCNPath = resolve(process.cwd(), 'src/i18n/locales/zh-CN.json');
      const zhCNData = JSON.parse(readFileSync(zhCNPath, 'utf-8'));
      languagePacksData.set('zh-CN', zhCNData);

      // 加载英文语言包
      const enUSPath = resolve(process.cwd(), 'src/i18n/locales/en-US.json');
      const enUSData = JSON.parse(readFileSync(enUSPath, 'utf-8'));
      languagePacksData.set('en-US', enUSData);

      console.log('✅ 语言包加载完成');
    } catch (error) {
      console.warn('⚠️ 语言包加载失败:', error.message);
    }
  };

  // 定义其他辅助函数
  const shouldValidateFile = (id) => {
    // 检查是否在包含列表中
    const isIncluded = include.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      return regex.test(id);
    });

    if (!isIncluded) {
      return false;
    }

    // 检查是否在排除列表中
    const isExcluded = exclude.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      return regex.test(id);
    });

    return !isExcluded;
  };

  const validateFile = (code, filePath) => {
    const violations = [];
    const translationKeys = [];
    const fixes = [];

    // 检测硬编码文本
    const hardcodedResult = detectHardcodedText(code, filePath);
    violations.push(...hardcodedResult.violations);
    fixes.push(...hardcodedResult.fixes);

    // 提取翻译键
    const keys = extractTranslationKeys(code);
    translationKeys.push(...keys);

    // 验证翻译键
    const keyValidationResult = validateTranslationKeys(code, filePath);
    violations.push(...keyValidationResult.violations);

    return {
      violations,
      translationKeys,
      fixes,
    };
  };

  const detectHardcodedText = (code, filePath) => {
    const violations = [];
    const fixes = [];

    // 检测 JSX 文本节点
    const jsxTextRegex = /<[^>]*>([^<]+)<\/[^>]*>/g;
    let match;
    while ((match = jsxTextRegex.exec(code)) !== null) {
      const text = match[1].trim();
      if (isUserVisibleText(text)) {
        const line = getLineNumber(code, match.index);
        const column = match.index;
        
        violations.push({
          type: 'hardcoded-text',
          severity: 'error',
          message: `发现硬编码文本: "${text}"`,
          file: filePath,
          line,
          column,
          suggestion: `使用 t('${generateTranslationKey(text)}') 替代`,
        });

        fixes.push({
          type: 'replace',
          start: match.index,
          end: match.index + match[0].length,
          replacement: `{t('${generateTranslationKey(text)}')}`,
        });
      }
    }

    // 检测字符串字面量
    const stringLiteralRegex = /(["'`])([^"'`\n]*)\1/g;
    while ((match = stringLiteralRegex.exec(code)) !== null) {
      const text = match[2];
      if (isUserVisibleText(text) && !isInTranslationCall(code, match.index)) {
        const line = getLineNumber(code, match.index);
        const column = match.index;
        
        violations.push({
          type: 'hardcoded-text',
          severity: 'error',
          message: `发现硬编码文本: "${text}"`,
          file: filePath,
          line,
          column,
          suggestion: `使用 t('${generateTranslationKey(text)}') 替代`,
        });

        fixes.push({
          type: 'replace',
          start: match.index,
          end: match.index + match[0].length,
          replacement: `t('${generateTranslationKey(text)}')`,
        });
      }
    }

    return { violations, fixes };
  };

  const extractTranslationKeys = (code) => {
    const keys = [];
    const translationKeyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    let match;
    
    while ((match = translationKeyRegex.exec(code)) !== null) {
      keys.push(match[1]);
    }

    return keys;
  };

  const validateTranslationKeys = (code, filePath) => {
    const violations = [];
    const translationKeyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    let match;
    
    while ((match = translationKeyRegex.exec(code)) !== null) {
      const key = match[1];
      
      // 验证翻译键格式
      if (!isValidTranslationKey(key)) {
        violations.push({
          type: 'invalid-translation-key',
          severity: 'error',
          message: `翻译键格式无效: "${key}"`,
          file: filePath,
          line: getLineNumber(code, match.index),
          column: match.index,
          suggestion: `使用层级格式，如: 'category.subcategory.key'`,
        });
      }

      // 验证翻译键是否存在
      if (!translationKeyExists(key)) {
        violations.push({
          type: 'missing-translation-key',
          severity: 'error',
          message: `翻译键不存在: "${key}"`,
          file: filePath,
          line: getLineNumber(code, match.index),
          column: match.index,
          suggestion: `在语言包中添加翻译键: "${key}"`,
        });
      }
    }

    return { violations };
  };

  const validateLanguagePackSync = () => {
    const violations = [];
    const languages = Array.from(languagePacksData.keys());
    
    if (languages.length < 2) {
      return;
    }

    // 获取所有翻译键
    const allKeys = new Set();
    for (const [lang, pack] of languagePacksData) {
      const keys = extractTranslationKeysFromPack(pack);
      keys.forEach(key => allKeys.add(key));
    }

    // 检查每个语言包是否包含所有键
    for (const [lang, pack] of languagePacksData) {
      const keys = extractTranslationKeysFromPack(pack);
      
      for (const key of allKeys) {
        if (!keys.has(key)) {
          violations.push({
            type: 'missing-translation-key',
            severity: 'error',
            message: `语言包 "${lang}" 缺少翻译键: "${key}"`,
            file: `locales/${lang}.json`,
            line: 0,
            column: 0,
            suggestion: `在 ${lang}.json 中添加翻译键: "${key}"`,
          });
        }
      }
    }

    if (violations.length > 0) {
      reportViolationsToConsole(violations);
    }
  };

  const extractTranslationKeysFromPack = (obj, prefix = '') => {
    const keys = new Set();
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        const nestedKeys = extractTranslationKeysFromPack(value, fullKey);
        nestedKeys.forEach(k => keys.add(k));
      } else if (typeof value === 'string') {
        keys.add(fullKey);
      }
    }
    
    return keys;
  };

  const isUserVisibleText = (text) => {
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
  };

  const isInTranslationCall = (code, index) => {
    const beforeIndex = code.substring(0, index);
    const afterIndex = code.substring(index);
    
    return beforeIndex.includes('t(') || afterIndex.includes(')');
  };

  const isValidTranslationKey = (key) => {
    return /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/.test(key);
  };

  const translationKeyExists = (key) => {
    for (const pack of languagePacksData.values()) {
      if (hasTranslationKey(pack, key)) {
        return true;
      }
    }
    return false;
  };

  const hasTranslationKey = (obj, key) => {
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
  };

  const generateTranslationKey = (text) => {
    const cleanText = text.replace(/[^\w\s]/g, '').toLowerCase();
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 1) {
      return `common.${words[0]}`;
    } else if (words.length === 2) {
      return `${words[0]}.${words[1]}`;
    } else {
      return `${words[0]}.${words.slice(1).join('_')}`;
    }
  };

  const getLineNumber = (content, index) => {
    return content.substring(0, index).split('\n').length;
  };

  const applyFixes = (code, fixes) => {
    let result = code;
    
    // 按位置倒序应用修复，避免位置偏移
    fixes.sort((a, b) => b.start - a.start);
    
    for (const fix of fixes) {
      if (fix.type === 'replace') {
        result = result.substring(0, fix.start) + fix.replacement + result.substring(fix.end);
      }
    }
    
    return result;
  };

  const reportViolationsToConsole = (violations) => {
    for (const violation of violations) {
      const severity = violation.severity === 'error' ? '❌' : '⚠️';
      console.log(`${severity} ${violation.file}:${violation.line}:${violation.column} - ${violation.message}`);
      if (violation.suggestion) {
        console.log(`   💡 ${violation.suggestion}`);
      }
    }
  };

  const generateReport = () => {
    const errorCount = violations.filter(v => v.severity === 'error').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    
    console.log('\n🌐 国际化验证报告:');
    console.log(`📊 总违规数: ${violations.length}`);
    console.log(`❌ 错误: ${errorCount}`);
    console.log(`⚠️ 警告: ${warningCount}`);
    console.log(`🔑 翻译键: ${translationKeys.size}`);
    
    if (violations.length === 0) {
      console.log('✅ 国际化验证通过！');
    }
  };

  return {
    name: 'i18n-validator',
    
    buildStart() {
      if (!enabled) {
        return;
      }

      console.log('🌐 国际化验证器已启动');
      
      // 加载语言包
      loadLanguagePacks();
    },

    transform(code, id) {
      if (!enabled || !shouldValidateFile(id)) {
        return null;
      }

      try {
        // 验证文件
        const result = validateFile(code, id);
        
        if (result.violations.length > 0) {
          violations.push(...result.violations);
          
          if (reportViolations) {
            reportViolationsToConsole(result.violations);
          }
        }

        // 收集翻译键
        result.translationKeys.forEach(key => translationKeys.add(key));

        // 自动修复
        if (autoFix && result.fixes.length > 0) {
          return {
            code: applyFixes(code, result.fixes),
            map: null,
          };
        }

      } catch (error) {
        console.warn(`国际化验证失败: ${id}`, error);
      }

      return null;
    },

    buildEnd() {
      if (!enabled) {
        return;
      }

      // 验证语言包同步
      validateLanguagePackSync();

      // 生成报告
      if (reportViolations) {
        generateReport();
      }

      // 检查是否应该失败构建
      if (failOnError && violations.some(v => v.severity === 'error')) {
        throw new Error('国际化验证失败，发现错误级别违规');
      }

      if (failOnWarning && violations.some(v => v.severity === 'warning')) {
        throw new Error('国际化验证失败，发现警告级别违规');
      }
    },
  };
}
