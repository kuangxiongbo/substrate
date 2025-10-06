module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', './frontend/src/i18n/plugins/eslint-plugin-i18n'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    
    // Spec-Kit 样式强制规范
    // 禁止内联样式
    'react/forbid-component-props': [
      'error',
      {
        forbid: ['style'],
        message: '禁止使用内联样式，请使用主题包样式。使用 className 和主题包变量替代 style 属性。'
      }
    ],
    
    // 禁止硬编码颜色值
    'no-hardcoded-colors': 'error',
    
    // 要求使用主题包样式
    'require-theme-package': 'error',
    
    // 禁止在 CSS 中使用硬编码值
    'no-css-hardcoded-values': 'error',
    
    // 要求样式来源验证
    'validate-style-source': 'warn',
    
    // Spec-Kit 国际化强制规范
    // 禁止硬编码用户可见文本
    'i18n/no-hardcoded-text': [
      'error',
      {
        ignorePatterns: [
          '^[A-Z_]+$', // 常量
          '^[a-z][a-zA-Z0-9]*$', // 变量名
          '^https?://', // URL
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // 邮箱
          '^\\d{4}-\\d{2}-\\d{2}$', // 日期格式
          '^\\d+$', // 纯数字
          '^[a-zA-Z0-9._-]+$', // 文件名
        ],
        technicalPatterns: [
          '^[A-Z_]+$',
          '^[a-z][a-zA-Z0-9]*$',
          '^https?://',
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          '^\\d{4}-\\d{2}-\\d{2}$',
          '^\\d+$',
          '^[a-zA-Z0-9._-]+$',
        ],
        userVisiblePatterns: [
          '[\u4e00-\u9fa5]', // 中文字符
          '^(Loading|Save|Cancel|Confirm|Delete|Edit|Add|Search|Reset|Submit|Back|Next|Previous|Success|Error|Warning|Info|Yes|No|OK)$',
        ],
      }
    ],
    
    // 要求使用翻译键
    'i18n/require-translation-key': [
      'error',
      {
        keyPattern: '^[a-zA-Z][a-zA-Z0-9]*(\\.[a-zA-Z][a-zA-Z0-9]*)*$',
        requiredCategories: ['common', 'navigation', 'validation', 'error', 'user', 'admin', 'system'],
      }
    ],
    
    // 验证翻译键结构
    'i18n/validate-translation-structure': [
      'error',
      {
        maxDepth: 3,
        minDepth: 1,
        allowedCategories: ['common', 'navigation', 'validation', 'error', 'user', 'admin', 'system'],
      }
    ],
  },
  overrides: [
    {
      // 对 CSS 文件应用特殊规则
      files: ['*.css', '*.scss', '*.less'],
      rules: {
        'no-css-hardcoded-values': 'error',
        'require-css-variables': 'error',
      }
    },
    {
      // 对主题包文件应用特殊规则
      files: ['**/themes/**/*.ts', '**/themes/**/*.js'],
      rules: {
        'validate-theme-structure': 'error',
        'require-theme-tokens': 'error',
      }
    },
    {
      // 对国际化文件应用特殊规则
      files: ['**/i18n/**/*.ts', '**/i18n/**/*.js', '**/locales/**/*.json'],
      rules: {
        'i18n/validate-translation-structure': 'error',
      }
    }
  ]
};
