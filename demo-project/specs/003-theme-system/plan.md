# Implementation Plan: 主题系统

## 项目概述
基于Spec-Kit方法，实现一个完整的主题系统，移除所有内嵌样式，支持动态主题切换和主题配置管理。

## 实施阶段

### 阶段1: 基础架构搭建 (2天)

#### 1.1 创建主题配置接口 (0.5天)
- 定义TypeScript接口
- 创建主题配置类型
- 设置主题验证规则

#### 1.2 实现主题上下文 (0.5天)
- 创建React Context
- 实现主题状态管理
- 添加主题切换逻辑

#### 1.3 设置CSS变量系统 (1天)
- 定义CSS自定义属性
- 创建主题变量映射
- 实现主题变量更新机制

### 阶段2: 样式重构 (3天)

#### 2.1 移除内嵌样式 (1天)
- 扫描所有组件文件
- 识别内嵌样式
- 移除内联style属性

#### 2.2 重构组件样式 (1.5天)
- 将内嵌样式转换为CSS类
- 使用主题变量替换硬编码值
- 确保样式响应式设计

#### 2.3 实现主题变量应用 (0.5天)
- 更新CSS变量值
- 测试主题切换效果
- 修复样式问题

### 阶段3: 主题功能实现 (2天)

#### 3.1 主题切换器组件 (0.5天)
- 创建主题选择器
- 实现主题预览
- 添加切换动画

#### 3.2 主题配置页面 (1天)
- 创建主题配置界面
- 实现颜色选择器
- 添加实时预览功能

#### 3.3 主题存储功能 (0.5天)
- 实现本地存储
- 添加主题导入/导出
- 创建主题重置功能

### 阶段4: 测试优化 (1天)

#### 4.1 功能测试 (0.5天)
- 测试主题切换功能
- 验证样式正确性
- 检查响应式设计

#### 4.2 性能优化 (0.5天)
- 优化主题切换性能
- 减少重绘和重排
- 优化内存使用

## 技术实现细节

### 1. 主题配置结构
```typescript
// types/theme.ts
export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  borderRadius: BorderRadiusConfig;
  shadows: ShadowConfig;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}
```

### 2. 主题上下文实现
```typescript
// contexts/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  
  const setTheme = useCallback((themeName: string) => {
    const theme = availableThemes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('selectedTheme', themeName);
    }
  }, [availableThemes]);
  
  return (
    <ThemeContext.Provider value={{
      currentTheme,
      availableThemes,
      setTheme,
      toggleTheme,
      isDarkMode: currentTheme.name.includes('dark')
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 3. CSS变量系统
```css
/* styles/theme-variables.css */
:root {
  /* 颜色变量 */
  --color-primary: #1890ff;
  --color-secondary: #722ed1;
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-text: #262626;
  --color-text-secondary: #8c8c8c;
  --color-border: #d9d9d9;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #ff4d4f;
  --color-info: #1890ff;
  
  /* 字体变量 */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-xxl: 24px;
  
  /* 间距变量 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  /* 圆角变量 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  
  /* 阴影变量 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### 4. 主题应用函数
```typescript
// utils/theme.ts
export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  // 应用颜色变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // 应用字体变量
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });
  
  // 应用间距变量
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
  
  // 应用圆角变量
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--border-radius-${key}`, value);
  });
  
  // 应用阴影变量
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
};
```

## 文件结构
```
src/
├── types/
│   └── theme.ts                 # 主题类型定义
├── contexts/
│   └── ThemeContext.tsx         # 主题上下文
├── hooks/
│   └── useTheme.ts              # 主题Hook
├── components/
│   ├── ThemeSwitcher.tsx        # 主题切换器
│   └── ThemeConfig.tsx          # 主题配置组件
├── pages/
│   └── ThemeSettings.tsx        # 主题设置页面
├── styles/
│   ├── theme-variables.css      # 主题变量
│   ├── theme-light.css          # 浅色主题
│   ├── theme-dark.css           # 深色主题
│   └── theme-custom.css         # 自定义主题
├── utils/
│   └── theme.ts                 # 主题工具函数
└── themes/
    ├── light.ts                 # 浅色主题配置
    ├── dark.ts                  # 深色主题配置
    └── custom.ts                # 自定义主题配置
```

## 质量保证

### 1. 代码质量
- TypeScript严格模式
- ESLint规则检查
- Prettier代码格式化
- 单元测试覆盖

### 2. 性能优化
- 主题切换性能监控
- 内存使用优化
- 渲染性能优化
- 包大小优化

### 3. 用户体验
- 主题切换动画
- 加载状态提示
- 错误处理机制
- 无障碍访问支持

## 风险控制

### 1. 技术风险
- 大量样式重构可能影响现有功能
- 主题切换性能问题
- 浏览器兼容性问题

### 2. 缓解措施
- 分阶段实施，逐步迁移
- 充分的测试覆盖
- 性能监控和优化
- 渐进式增强

### 3. 回滚计划
- 保留原有样式作为备份
- 实现主题开关功能
- 快速回滚机制

## 成功标准
- 所有内嵌样式移除完成率: 100%
- 主题切换功能正常率: 100%
- 性能指标达标率: 100%
- 用户满意度: > 90%
- 代码质量评分: > 90%
