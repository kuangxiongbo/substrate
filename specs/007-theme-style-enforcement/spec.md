# Spec-Kit 样式强制规范

## 概述
本规范定义了 Spec-Kit 项目中样式控制的强制要求，确保所有样式必须通过主题包形式控制，禁止内联样式和硬编码样式。

## 核心原则

### 1. 主题包优先原则
- **所有样式必须通过主题包定义**
- **禁止在组件中使用内联样式 (style 属性)**
- **禁止在 CSS 文件中硬编码颜色、尺寸等样式值**
- **所有样式值必须来自主题包配置**

### 2. 样式分层控制
```
主题包配置 (最高优先级)
    ↓
主题包生成的 CSS 变量
    ↓
组件 className 应用
    ↓
全局 CSS 基础样式 (最低优先级)
```

### 3. 强制验证机制
- **开发时验证**: ESLint 规则检测内联样式
- **构建时验证**: 构建工具检查样式来源
- **运行时验证**: 主题包验证器确保样式一致性

## 技术规范

### 1. 主题包样式定义
```typescript
// 正确的主题包样式定义
export const lightTheme = {
  meta: {
    id: 'light',
    name: 'Light Theme',
    displayName: '浅色主题'
  },
  tokens: {
    // 颜色令牌
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorText: '#1f1f1f',
    
    // 尺寸令牌
    borderRadius: 8,
    spacing: 16,
    
    // 阴影令牌
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  components: {
    // 组件样式
    Button: {
      colorBg: 'var(--color-bg-base)',
      colorText: 'var(--color-text)',
      borderRadius: 'var(--border-radius)'
    },
    Layout: {
      bodyBg: 'var(--color-bg-base)',
      headerBg: 'var(--color-bg-container)'
    }
  }
};
```

### 2. 组件样式应用
```typescript
// ✅ 正确: 使用主题包样式
const MyComponent = () => {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`my-component ${currentTheme?.meta.id}-theme`}>
      <button className="theme-button primary">
        按钮
      </button>
    </div>
  );
};

// ❌ 错误: 使用内联样式
const MyComponent = () => {
  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      <button style={{ padding: '8px 16px' }}>
        按钮
      </button>
    </div>
  );
};
```

### 3. CSS 样式定义
```css
/* ✅ 正确: 使用主题包变量 */
.my-component {
  background-color: var(--color-bg-base);
  color: var(--color-text);
  border-radius: var(--border-radius);
}

.my-component.light-theme {
  --color-bg-base: #ffffff;
  --color-text: #1f1f1f;
  --border-radius: 8px;
}

.my-component.dark-theme {
  --color-bg-base: #1a1a2e;
  --color-text: #f8fafc;
  --border-radius: 8px;
}

/* ❌ 错误: 硬编码样式值 */
.my-component {
  background-color: #ffffff;
  color: #000000;
  border-radius: 8px;
}
```

## 验证机制

### 1. ESLint 规则
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // 禁止内联样式
    'react/forbid-component-props': [
      'error',
      {
        forbid: ['style']
      }
    ],
    
    // 自定义规则：检查样式来源
    'spec-kit/no-inline-styles': 'error',
    'spec-kit/theme-package-required': 'error'
  }
};
```

### 2. 构建时验证
```javascript
// vite.config.js
export default {
  plugins: [
    // 主题包样式验证插件
    themeStyleValidator({
      enforceThemePackage: true,
      forbidInlineStyles: true,
      validateStyleSource: true
    })
  ]
};
```

### 3. 运行时验证
```typescript
// 主题包验证器
export class ThemeStyleValidator {
  static validateComponent(component: React.ComponentType): ValidationResult {
    // 检查组件是否使用内联样式
    // 检查样式是否来自主题包
    // 返回验证结果
  }
  
  static validateCSS(cssContent: string): ValidationResult {
    // 检查 CSS 中是否有硬编码值
    // 检查是否使用主题包变量
    // 返回验证结果
  }
}
```

## 迁移指南

### 1. 现有代码迁移
```typescript
// 迁移前
const OldComponent = () => {
  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '8px'
    }}>
      内容
    </div>
  );
};

// 迁移后
const NewComponent = () => {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`content-card ${currentTheme?.meta.id}-theme`}>
      内容
    </div>
  );
};
```

### 2. CSS 迁移
```css
/* 迁移前 */
.content-card {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
}

/* 迁移后 */
.content-card {
  background-color: var(--color-bg-container);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
}

.content-card.light-theme {
  --color-bg-container: #ffffff;
  --spacing-md: 16px;
  --border-radius: 8px;
}

.content-card.dark-theme {
  --color-bg-container: #1a1a2e;
  --spacing-md: 16px;
  --border-radius: 8px;
}
```

## 工具支持

### 1. 开发工具
- **主题包生成器**: 自动生成主题包配置
- **样式验证器**: 实时检查样式合规性
- **迁移工具**: 自动迁移现有样式

### 2. 调试工具
- **主题包调试器**: 可视化主题包应用
- **样式来源追踪**: 追踪样式来源
- **一致性检查**: 检查样式一致性

## 违规处理

### 1. 开发阶段
- **警告**: 检测到内联样式时显示警告
- **阻止**: 阻止不符合规范的代码提交
- **建议**: 提供修复建议

### 2. 构建阶段
- **错误**: 构建失败并显示详细错误信息
- **报告**: 生成违规报告
- **修复**: 提供自动修复选项

### 3. 运行时
- **降级**: 自动降级到默认主题
- **日志**: 记录违规信息
- **监控**: 监控样式合规性

## 最佳实践

### 1. 主题包设计
- **语义化命名**: 使用语义化的样式名称
- **层次化结构**: 建立清晰的样式层次
- **一致性保证**: 确保主题间的一致性

### 2. 组件开发
- **样式分离**: 将样式逻辑与业务逻辑分离
- **主题感知**: 组件应该感知当前主题
- **响应式设计**: 支持不同屏幕尺寸

### 3. 团队协作
- **代码审查**: 审查样式合规性
- **文档更新**: 及时更新样式文档
- **培训**: 培训团队成员遵循规范

## 总结
本规范确保了 Spec-Kit 项目中样式的统一性和可维护性，通过强制使用主题包控制样式，避免了样式混乱和不一致的问题。所有开发人员必须严格遵循此规范，确保项目的高质量交付。
