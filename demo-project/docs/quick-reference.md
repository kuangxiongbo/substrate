# 主题包样式强制规范 - 快速参考

## 🚀 快速开始

### 1. 导入主题包
```tsx
import { useTheme } from '../contexts/ThemeContext';
```

### 2. 使用Hook
```tsx
const { currentTheme } = useTheme();
```

### 3. 应用主题类名
```tsx
<div className={`my-component ${currentTheme?.meta.id}-theme`}>
  内容
</div>
```

## ❌ 禁止使用

### 内联样式
```tsx
// ❌ 错误
<div style={{ padding: '16px', color: '#000' }}>

// ✅ 正确
<div className="padding-md text-black">
```

### 硬编码值
```css
/* ❌ 错误 */
.my-class { color: #1890ff; padding: 8px; }

/* ✅ 正确 */
.my-class { color: var(--color-primary); padding: var(--spacing-sm); }
```

## ✅ 推荐使用

### 通用样式类
```tsx
// 布局
<div className="flex-container justify-center align-center">

// 间距
<div className="padding-lg margin-md">

// 颜色
<div className="bg-primary text-white">

// 圆角
<div className="rounded-lg">
```

### CSS变量
```css
.my-component {
  color: var(--color-text);
  background: var(--color-bg-container);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-base);
}
```

## 🛠️ 常用工具

### 样式验证器
```bash
npm run dev  # 自动运行验证器
```

### 修复工具
```typescript
import { generateFixReport } from '../utils/style-fixer';
const report = generateFixReport();
```

### ESLint检查
```bash
npm run lint
```

## 📋 检查清单

- [ ] 导入 `useTheme` hook
- [ ] 应用主题类名 `${currentTheme?.meta.id}-theme`
- [ ] 使用通用样式类替代内联样式
- [ ] 使用CSS变量替代硬编码值
- [ ] 测试主题切换效果
- [ ] 通过样式验证器检查

## 🔧 常见修复

### 内联样式 → CSS类
```tsx
// 修复前
<div style={{ display: 'flex', justifyContent: 'center' }}>

// 修复后
<div className="flex-container justify-center">
```

### 硬编码颜色 → CSS变量
```css
/* 修复前 */
.button { background-color: #1890ff; }

/* 修复后 */
.button { background-color: var(--color-primary); }
```

### 缺少主题支持 → 添加Hook
```tsx
// 修复前
const Component = () => <div className="my-component">内容</div>;

// 修复后
const Component = () => {
  const { currentTheme } = useTheme();
  return <div className={`my-component ${currentTheme?.meta.id}-theme`}>内容</div>;
};
```

## 📞 获取帮助

- 查看完整指南：`docs/theme-style-enforcement-guide.md`
- 运行修复工具：`generateFixReport()`
- 检查验证器输出：浏览器控制台
- 参考样式变量：`src/styles/theme-variables.css`
