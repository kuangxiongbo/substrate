# 主题包样式强制规范指南

## 📋 概述

本指南详细说明了项目中实施的主题包样式强制规范，旨在确保所有样式都通过主题包系统进行统一管理，禁止使用内联样式和硬编码值。

## 🎯 核心原则

### 1. 禁止内联样式
```tsx
// ❌ 错误 - 使用内联样式
<div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
  内容
</div>

// ✅ 正确 - 使用CSS类
<div className="content-container">
  内容
</div>
```

### 2. 禁止硬编码值
```css
/* ❌ 错误 - 硬编码颜色 */
.button {
  background-color: #1890ff;
  padding: 8px;
}

/* ✅ 正确 - 使用主题包变量 */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-sm);
}
```

### 3. 必须使用主题包
```tsx
// ❌ 错误 - 不使用主题包
const Component = () => {
  return <div className="my-component">内容</div>;
};

// ✅ 正确 - 使用主题包
const Component = () => {
  const { currentTheme } = useTheme();
  return (
    <div className={`my-component ${currentTheme?.meta.id}-theme`}>
      内容
    </div>
  );
};
```

## 🛠️ 实施方法

### 1. 导入主题包
```tsx
import { useTheme } from '../contexts/ThemeContext';
```

### 2. 使用主题包Hook
```tsx
const { currentTheme } = useTheme();
```

### 3. 应用主题类名
```tsx
<div className={`component-name ${currentTheme?.meta.id}-theme`}>
  内容
</div>
```

### 4. 使用CSS变量
```css
.my-component {
  color: var(--color-text);
  background-color: var(--color-bg-container);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-base);
}
```

## 📚 通用样式类库

项目提供了丰富的通用样式类，可以直接使用：

### 布局类
```css
.flex-container      /* display: flex */
.justify-center      /* justify-content: center */
.align-center        /* align-items: center */
.full-width          /* width: 100% */
.full-height         /* height: 100vh */
```

### 间距类
```css
.padding-xs          /* padding: var(--spacing-xs) */
.padding-sm          /* padding: var(--spacing-sm) */
.padding-md          /* padding: var(--spacing-md) */
.padding-lg          /* padding: var(--spacing-lg) */
.margin-xs           /* margin: var(--spacing-xs) */
.margin-sm           /* margin: var(--spacing-sm) */
.margin-md           /* margin: var(--spacing-md) */
.margin-lg           /* margin: var(--spacing-lg) */
```

### 颜色类
```css
.bg-primary          /* background-color: var(--color-primary) */
.bg-success          /* background-color: var(--color-success) */
.bg-warning          /* background-color: var(--color-warning) */
.bg-error            /* background-color: var(--color-error) */
.text-primary        /* color: var(--color-primary) */
.text-secondary      /* color: var(--color-text-secondary) */
.text-tertiary       /* color: var(--color-text-tertiary) */
```

### 圆角类
```css
.rounded-sm          /* border-radius: var(--border-radius-sm) */
.rounded-md          /* border-radius: var(--border-radius-base) */
.rounded-lg          /* border-radius: var(--border-radius-lg) */
.rounded-xl          /* border-radius: var(--border-radius-xl) */
```

## 🔧 开发工具

### 1. 样式验证器
项目集成了实时样式验证器，会在开发过程中检测违规项：

```bash
# 启动开发服务器时会自动运行验证器
npm run dev
```

### 2. 样式修复工具
使用内置的样式修复工具获取修复建议：

```typescript
import { generateFixReport } from '../utils/style-fixer';

// 生成修复报告
const report = generateFixReport();
console.log(report);
```

### 3. ESLint规则
项目配置了自定义ESLint规则，会在代码检查时发现样式违规：

```bash
# 运行ESLint检查
npm run lint
```

## 📝 最佳实践

### 1. 组件开发流程
1. 设计组件结构
2. 导入 `useTheme` hook
3. 使用通用样式类
4. 创建专用CSS类（如需要）
5. 应用主题类名
6. 测试主题切换效果

### 2. 样式命名规范
```css
/* 组件样式 */
.component-name {
  /* 基础样式 */
}

.component-name.light-theme {
  /* 浅色主题样式 */
}

.component-name.dark-theme {
  /* 深色主题样式 */
}

/* 状态样式 */
.component-name:hover {
  /* 悬停状态 */
}

.component-name.active {
  /* 激活状态 */
}
```

### 3. 主题包扩展
当需要新的主题包时：

1. 在 `src/themes/packages/` 下创建新主题包
2. 定义主题配置
3. 更新主题注册
4. 测试主题切换

## 🚫 常见错误

### 1. 内联样式
```tsx
// ❌ 错误
<div style={{ color: 'red', padding: '10px' }}>

// ✅ 正确
<div className="error-message padding-sm">
```

### 2. 硬编码颜色
```css
/* ❌ 错误 */
.error { color: #ff0000; }

/* ✅ 正确 */
.error { color: var(--color-error); }
```

### 3. 缺少主题支持
```tsx
// ❌ 错误
const Component = () => <div className="my-component">内容</div>;

// ✅ 正确
const Component = () => {
  const { currentTheme } = useTheme();
  return <div className={`my-component ${currentTheme?.meta.id}-theme`}>内容</div>;
};
```

## 🔍 验证检查

### 1. 开发时检查
- 实时验证器会显示违规警告
- 浏览器控制台会显示修复建议
- 热重载时会检查样式合规性

### 2. 构建时检查
- Vite插件会在构建时验证样式
- 发现违规项会阻止构建
- 提供详细的修复建议

### 3. 代码审查
- 检查是否使用了内联样式
- 验证是否使用了主题包
- 确认CSS变量使用正确

## 📊 监控和报告

### 1. 违规统计
验证器会统计：
- 内联样式违规数量
- 硬编码值违规数量
- 缺少主题包支持的组件数量

### 2. 修复建议
自动生成：
- 样式类映射建议
- 主题包使用指导
- CSS变量替换建议

### 3. 持续改进
- 定期审查样式合规性
- 更新通用样式类库
- 优化主题包配置

## 🎓 培训要点

### 1. 理解主题包系统
- 主题包的作用和优势
- 主题切换的实现原理
- 样式变量的管理方式

### 2. 掌握开发工具
- 样式验证器的使用方法
- 修复工具的功能和用法
- ESLint规则的配置和使用

### 3. 遵循最佳实践
- 组件开发的标准化流程
- 样式命名的规范要求
- 主题包扩展的步骤

## 🔗 相关资源

- [主题包配置文档](./theme-package-config.md)
- [样式变量参考](./style-variables-reference.md)
- [组件开发指南](./component-development-guide.md)
- [工具使用说明](./tools-usage-guide.md)

---

**记住：一致性是UI/UX成功的关键，主题包样式强制规范确保了我们项目的样式一致性和可维护性。**
