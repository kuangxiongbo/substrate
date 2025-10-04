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
  plugins: ['react-refresh'],
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
    }
  ]
};
