# 国际化强制规范实施指南

## 概述

本指南介绍如何实施 Spec-Kit 国际化强制规范，确保所有用户界面文本必须通过国际化(i18n)系统管理，禁止硬编码文本，保证多语言支持和本地化一致性。

## 规范要求

### 1. 核心原则

#### 1.1 文本国际化强制原则
- **禁止硬编码文本**: 所有用户可见文本必须使用 `t()` 函数
- **翻译键命名规范**: 使用层级结构 `category.subcategory.key`
- **语言包完整性**: 所有语言包必须包含相同的翻译键
- **动态文本处理**: 支持参数化翻译和复数形式

#### 1.2 代码规范要求

**React 组件规范**
```typescript
// ✅ 正确示例
const MyComponent = () => {
  const { t } = useTranslation();
  return <div>{t('common.loading')}</div>;
};

// ❌ 错误示例
const MyComponent = () => {
  return <div>加载中...</div>; // 硬编码文本
};
```

**翻译键命名规范**
```typescript
// ✅ 正确示例
t('userManagement.title')           // 页面标题
t('common.save')                    // 通用操作
t('validation.email.required')      // 验证消息
t('error.network.timeout')          // 错误消息

// ❌ 错误示例
t('title')                          // 过于简单
t('user_management_title')          // 使用下划线
t('UserManagementTitle')            // 驼峰命名
```

**参数化翻译**
```typescript
// ✅ 正确示例
t('user.welcome', { name: userName })
t('items.count', { count: itemCount })
t('date.format', { date: formattedDate })

// ❌ 错误示例
t('user.welcome') + ' ' + userName  // 字符串拼接
```

### 2. 语言包结构规范

#### 2.1 标准语言包结构
```json
{
  "common": {
    "loading": "加载中...",
    "save": "保存",
    "cancel": "取消",
    "confirm": "确认",
    "delete": "删除",
    "edit": "编辑",
    "add": "添加",
    "search": "搜索",
    "reset": "重置",
    "submit": "提交"
  },
  "navigation": {
    "overview": "概览",
    "userManagement": "用户管理",
    "systemSettings": "系统设置"
  },
  "validation": {
    "email": {
      "required": "邮箱是必填项",
      "invalid": "请输入有效的邮箱地址"
    }
  },
  "error": {
    "network": {
      "timeout": "网络请求超时",
      "unavailable": "网络不可用"
    }
  }
}
```

#### 2.2 语言包同步要求
- 所有语言包必须包含相同的键结构
- 新增翻译键时，所有语言包必须同步更新
- 删除翻译键时，需要确认所有语言包都已清理

## 验证工具

### 1. ESLint 规则

#### 1.1 配置 ESLint
```javascript
// .eslintrc.js
module.exports = {
  plugins: ['react-refresh', './frontend/src/i18n/plugins/eslint-plugin-i18n'],
  rules: {
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
};
```

#### 1.2 ESLint 规则说明

**no-hardcoded-text**
- 检测 JSX 文本节点中的硬编码文本
- 检测字符串字面量中的用户可见文本
- 自动生成翻译键建议
- 支持自动修复

**require-translation-key**
- 验证翻译键格式是否符合规范
- 检查翻译键是否包含必需类别
- 确保翻译键命名一致性

**validate-translation-structure**
- 验证翻译键层级深度
- 检查翻译键类别是否有效
- 确保翻译键结构合理性

### 2. Vite 插件

#### 2.1 配置 Vite 插件
```javascript
// vite.config.js
import { i18nValidator } from './src/i18n/plugins/vite-plugin-i18n-validator.js';

export default defineConfig({
  plugins: [
    react(),
    i18nValidator({
      enabled: true,
      failOnError: process.env.NODE_ENV === 'production',
      failOnWarning: false,
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['node_modules/**', 'dist/**', 'build/**'],
      languagePacks: ['src/i18n/locales/**/*.json'],
      reportViolations: true,
      autoFix: false,
    })
  ],
});
```

#### 2.2 Vite 插件功能

**构建时验证**
- 扫描所有 React 组件文件
- 检测硬编码文本违规
- 验证翻译键存在性
- 检查语言包同步状态

**错误报告**
- 详细的违规位置信息
- 修复建议和自动修复
- 翻译覆盖率统计
- 构建失败控制

### 3. 运行时验证器

#### 3.1 使用验证器
```typescript
import { I18nValidatorImpl } from './src/i18n/core/validator';
import zhCN from './src/i18n/locales/zh-CN.json';
import enUS from './src/i18n/locales/en-US.json';

const validator = new I18nValidatorImpl();

// 加载语言包
validator.loadLanguagePack('zh-CN', zhCN);
validator.loadLanguagePack('en-US', enUS);

// 验证代码合规性
const result = validator.validateCompliance(code, filePath);

if (!result.valid) {
  console.error('国际化验证失败:', result.errors);
  console.warn('警告:', result.warnings);
}
```

#### 3.2 验证器功能

**硬编码文本检测**
- 智能识别用户可见文本
- 排除技术标识符
- 生成翻译键建议
- 支持批量扫描

**翻译键验证**
- 验证翻译键格式
- 检查翻译键存在性
- 验证参数化翻译
- 检查语言包同步

**覆盖率统计**
- 翻译键使用统计
- 未使用翻译键检测
- 翻译覆盖率计算
- 质量评估报告

## 实施步骤

### 1. 安装和配置

#### 1.1 安装依赖
```bash
# 安装国际化相关依赖
npm install react-i18next i18next-browser-languagedetector

# 安装验证工具
npm install --save-dev eslint-plugin-i18n
```

#### 1.2 配置 ESLint
```bash
# 复制 ESLint 配置文件
cp .eslintrc.js.example .eslintrc.js

# 运行 ESLint 检查
npm run lint
```

#### 1.3 配置 Vite
```bash
# 复制 Vite 配置文件
cp vite.config.js.example vite.config.js

# 运行构建验证
npm run build
```

### 2. 代码迁移

#### 2.1 扫描现有代码
```bash
# 运行国际化扫描器
npx i18n-scanner scan src/

# 查看扫描报告
cat i18n-scan-report.json
```

#### 2.2 修复硬编码文本
```typescript
// 修复前
const MyComponent = () => {
  return (
    <div>
      <h1>用户管理</h1>
      <button>保存</button>
      <span>加载中...</span>
    </div>
  );
};

// 修复后
const MyComponent = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('userManagement.title')}</h1>
      <button>{t('common.save')}</button>
      <span>{t('common.loading')}</span>
    </div>
  );
};
```

#### 2.3 更新语言包
```json
// zh-CN.json
{
  "userManagement": {
    "title": "用户管理"
  },
  "common": {
    "save": "保存",
    "loading": "加载中..."
  }
}

// en-US.json
{
  "userManagement": {
    "title": "User Management"
  },
  "common": {
    "save": "Save",
    "loading": "Loading..."
  }
}
```

### 3. 验证和测试

#### 3.1 运行验证
```bash
# 运行 ESLint 验证
npm run lint

# 运行构建验证
npm run build

# 运行测试
npm run test
```

#### 3.2 检查覆盖率
```bash
# 生成翻译覆盖率报告
npx i18n-coverage report

# 查看未使用的翻译键
npx i18n-coverage unused
```

## 最佳实践

### 1. 翻译键设计

#### 1.1 命名规范
- 使用语义化命名
- 保持层级结构清晰
- 避免过深嵌套
- 统一命名风格

#### 1.2 结构设计
```typescript
// ✅ 好的结构
t('userManagement.list.title')
t('userManagement.list.actions.edit')
t('userManagement.list.actions.delete')

// ❌ 避免的结构
t('userManagementListTitle')
t('userManagementListActionsEdit')
t('userManagementListActionsDelete')
```

### 2. 参数化翻译

#### 2.1 插值使用
```typescript
// ✅ 正确使用
t('user.welcome', { name: userName })
t('items.count', { count: itemCount })
t('date.format', { date: formattedDate })

// ❌ 错误使用
t('user.welcome') + ' ' + userName
`${t('items.count')}: ${itemCount}`
```

#### 2.2 复数处理
```typescript
// ✅ 支持复数
t('items.count', { count: itemCount })

// 在语言包中
{
  "items": {
    "count": "{{count}} 项",
    "count_plural": "{{count}} 项"
  }
}
```

### 3. 性能优化

#### 3.1 按需加载
```typescript
// ✅ 按需加载语言包
const loadLanguagePack = async (language: string) => {
  const pack = await import(`./locales/${language}.json`);
  i18n.addResourceBundle(language, 'translation', pack.default);
};
```

#### 3.2 缓存优化
```typescript
// ✅ 缓存翻译结果
const useTranslation = () => {
  const { t } = useTranslation();
  
  return useMemo(() => ({
    t: (key: string, options?: any) => {
      return t(key, options);
    }
  }), [t]);
};
```

## 故障排除

### 1. 常见问题

#### 1.1 ESLint 规则不生效
```bash
# 检查插件是否正确安装
npm ls eslint-plugin-i18n

# 检查配置文件
cat .eslintrc.js

# 重新安装依赖
npm install
```

#### 1.2 Vite 插件验证失败
```bash
# 检查插件配置
cat vite.config.js

# 查看构建日志
npm run build -- --verbose

# 检查语言包文件
ls -la src/i18n/locales/
```

#### 1.3 翻译键不存在
```bash
# 检查语言包结构
cat src/i18n/locales/zh-CN.json | jq 'keys'

# 验证翻译键
npx i18n-validator validate-keys

# 生成缺失翻译键报告
npx i18n-validator missing-keys
```

### 2. 调试技巧

#### 2.1 启用调试模式
```javascript
// 在开发环境中启用调试
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  i18n.on('missingKey', (lng, ns, key) => {
    console.warn(`Missing translation key: ${key} in ${lng}`);
  });
}
```

#### 2.2 使用验证工具
```typescript
// 使用验证器调试
const validator = new I18nValidatorImpl();
const result = validator.validateCompliance(code, filePath);

console.log('验证结果:', result);
console.log('违规详情:', result.violations);
console.log('修复建议:', result.suggestions);
```

## 维护指南

### 1. 定期检查

#### 1.1 扫描硬编码文本
```bash
# 每周运行扫描
npx i18n-scanner scan src/ --report-format=json > weekly-scan.json

# 检查新增违规
npx i18n-scanner diff previous-scan.json weekly-scan.json
```

#### 1.2 验证翻译键
```bash
# 每月验证翻译键
npx i18n-validator validate-all

# 检查未使用翻译键
npx i18n-validator unused-keys --remove
```

### 2. 团队协作

#### 2.1 代码审查
- 检查新增代码的国际化合规性
- 验证翻译键命名规范
- 确保语言包同步更新

#### 2.2 培训支持
- 新成员国际化规范培训
- 定期最佳实践分享
- 工具使用指导

### 3. 持续改进

#### 3.1 规则优化
- 根据使用反馈优化验证规则
- 改进自动修复功能
- 增强错误提示信息

#### 3.2 工具升级
- 定期更新验证工具
- 优化构建性能
- 增强开发体验

## 总结

国际化强制规范是确保多语言应用质量的重要保障。通过实施本规范，可以：

1. **提高代码质量**: 消除硬编码文本，统一翻译管理
2. **保证多语言支持**: 确保所有语言包同步完整
3. **提升开发效率**: 自动化验证和修复工具
4. **降低维护成本**: 规范化的翻译键管理
5. **改善用户体验**: 一致的多语言界面

遵循本指南，结合 Spec-Kit 方法，可以建立完善的国际化开发流程，确保项目的长期可维护性和扩展性。



