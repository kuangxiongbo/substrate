/**
 * 国际化验证器类型定义
 */

export interface I18nValidator {
  validateCompliance(code: string, filePath: string): ValidationResult;
  detectHardcodedText(code: string, filePath: string): ValidationResult;
  validateTranslationKeys(code: string, filePath: string): ValidationResult;
  validateLanguagePackSync(): ValidationResult;
  loadLanguagePack(language: string, pack: LanguagePack): void;
  getTranslationCoverage(): TranslationCoverage;
  generateFixSuggestions(code: string, filePath: string): FixSuggestions;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  violations?: Violation[];
}

export interface Violation {
  type: ViolationType;
  severity: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line: number;
  column: number;
  suggestion?: string;
}

export type ViolationType =
  | 'hardcoded-text'
  | 'invalid-translation-key'
  | 'missing-translation-key'
  | 'unused-translation-key'
  | 'language-pack-sync-error';

export interface TranslationKey {
  key: string;
  value: string;
  language: string;
  category: string;
  subcategory?: string;
}

export interface LanguagePack {
  [key: string]: any;
}

export interface TranslationCoverage {
  totalKeys: number;
  usedKeys: number;
  coverage: number;
  unusedKeys: string[];
}

export interface FixSuggestions {
  file: string;
  suggestions: Array<{
    original: string;
    replacement: string;
    reason: string;
  }>;
}

export interface HardcodedTextDetection {
  pattern: RegExp;
  description: string;
  severity: 'error' | 'warning' | 'info';
  fixable: boolean;
}

export interface TranslationKeyRule {
  pattern: RegExp;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fixable: boolean;
}

export interface LanguagePackValidation {
  structure: {
    required: string[];
    optional: string[];
    forbidden: string[];
  };
  naming: {
    pattern: RegExp;
    message: string;
  };
  sync: {
    requiredLanguages: string[];
    checkStructure: boolean;
    checkKeys: boolean;
  };
}

export interface I18nValidationConfig {
  enabled: boolean;
  rules: {
    hardcodedText: {
      enabled: boolean;
      patterns: HardcodedTextDetection[];
    };
    translationKeys: {
      enabled: boolean;
      rules: TranslationKeyRule[];
    };
    languagePacks: {
      enabled: boolean;
      validation: LanguagePackValidation;
    };
  };
  autoFix: {
    enabled: boolean;
    backup: boolean;
    confirm: boolean;
  };
  reporting: {
    format: 'console' | 'json' | 'html';
    output: string;
    includeWarnings: boolean;
  };
}

export interface I18nValidationReport {
  timestamp: string;
  config: I18nValidationConfig;
  summary: {
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    totalViolations: number;
    errors: number;
    warnings: number;
  };
  files: Array<{
    path: string;
    valid: boolean;
    violations: Violation[];
    suggestions: FixSuggestions;
  }>;
  coverage: TranslationCoverage;
  recommendations: string[];
}



