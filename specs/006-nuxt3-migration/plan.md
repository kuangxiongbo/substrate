# Nuxt 3 迁移实施计划

## 项目概述

本计划详细描述了从 React + Vite 到 Nuxt 3 的迁移过程，包括技术选型、实施步骤、时间安排和风险控制。

## 技术架构设计

### 整体架构
```
┌─────────────────────────────────────────┐
│                Nuxt 3 应用                │
├─────────────────────────────────────────┤
│  Presentation Layer (Vue 3 + TypeScript) │
├─────────────────────────────────────────┤
│  State Management (Pinia)                │
├─────────────────────────────────────────┤
│  UI Components (Ant Design Vue)          │
├─────────────────────────────────────────┤
│  Styling (Tailwind CSS + CSS Variables)  │
├─────────────────────────────────────────┤
│  Routing (Nuxt Router)                   │
├─────────────────────────────────────────┤
│  API Layer (Axios + Interceptors)        │
└─────────────────────────────────────────┘
```

### 目录结构设计
```
frontend-nuxt/
├── assets/                 # 静态资源
├── components/             # 可复用组件
│   ├── layout/            # 布局组件
│   ├── ui/                # UI 组件
│   └── forms/             # 表单组件
├── composables/           # 组合式函数
├── layouts/               # 布局模板
├── middleware/            # 路由中间件
├── pages/                 # 页面组件
├── plugins/               # 插件配置
├── public/                # 公共静态文件
├── server/                # 服务端代码
├── stores/                # 状态管理
├── types/                 # TypeScript 类型
├── utils/                 # 工具函数
├── nuxt.config.ts         # Nuxt 配置
├── tailwind.config.js     # Tailwind 配置
└── package.json           # 依赖管理
```

## 实施阶段

### 阶段 1: 项目初始化 (第1天)

#### 1.1 创建 Nuxt 3 项目
```bash
# 创建新项目
npx nuxi@latest init frontend-nuxt
cd frontend-nuxt

# 安装基础依赖
npm install @nuxtjs/tailwindcss @pinia/nuxt
npm install ant-design-vue @ant-design/icons-vue
npm install axios @vueuse/core
npm install -D @types/node
```

#### 1.2 配置 Nuxt 3
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  css: [
    'ant-design-vue/dist/reset.css',
    '~/assets/css/main.css'
  ],
  typescript: {
    strict: true,
    typeCheck: true
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  }
})
```

#### 1.3 配置 Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  },
  plugins: []
}
```

### 阶段 2: 核心功能迁移 (第2天)

#### 2.1 状态管理设置
```typescript
// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginCredentials) => {
    // 登录逻辑
  }

  const logout = () => {
    // 登出逻辑
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})
```

#### 2.2 API 服务配置
```typescript
// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  
  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: 10000
  })

  // 请求拦截器
  api.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  // 响应拦截器
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )

  return { api }
}
```

#### 2.3 路由中间件
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

### 阶段 3: 页面和组件迁移 (第3天)

#### 3.1 布局组件
```vue
<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <div class="flex">
      <AppSidebar v-if="showSidebar" />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore()
const showSidebar = computed(() => layoutStore.layout.type === 'sidebar')
</script>
```

#### 3.2 登录页面
```vue
<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>
```

#### 3.3 系统设置页面
```vue
<!-- pages/system-settings.vue -->
<template>
  <div class="space-y-6">
    <PageHeader title="系统设置" />
    <Tabs :items="settingsTabs" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const settingsTabs = [
  { key: 'basic', label: '基础配置', component: 'BasicConfig' },
  { key: 'admin', label: '管理员管理', component: 'AdminManagement' },
  { key: 'security', label: '安全配置', component: 'SecurityConfig' },
  { key: 'email', label: '邮箱配置', component: 'EmailConfig' },
  { key: 'layout', label: '布局配置', component: 'LayoutConfig' }
]
</script>
```

### 阶段 4: 高级功能 (第4天)

#### 4.1 主题系统
```typescript
// composables/useTheme.ts
export const useTheme = () => {
  const theme = ref('light')
  
  const setTheme = (newTheme: string) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme
  }
}
```

#### 4.2 布局系统
```typescript
// stores/layout.ts
export const useLayoutStore = defineStore('layout', () => {
  const layout = ref({
    type: 'sidebar',
    collapsed: false,
    theme: 'light'
  })

  const setLayout = (newLayout: LayoutConfig) => {
    layout.value = { ...layout.value, ...newLayout }
    localStorage.setItem('layout', JSON.stringify(layout.value))
  }

  const toggleLayout = () => {
    const newType = layout.value.type === 'sidebar' ? 'top' : 'sidebar'
    setLayout({ type: newType })
  }

  return {
    layout: readonly(layout),
    setLayout,
    toggleLayout
  }
})
```

### 阶段 5: 测试和优化 (第5天)

#### 5.1 单元测试
```typescript
// tests/stores/auth.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should login successfully', async () => {
    const store = useAuthStore()
    await store.login({ email: 'test@example.com', password: 'password' })
    expect(store.isAuthenticated).toBe(true)
  })
})
```

#### 5.2 端到端测试
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[data-testid="email"]', 'demo@example.com')
  await page.fill('[data-testid="password"]', 'MySecure2024!')
  await page.click('[data-testid="login-button"]')
  await expect(page).toHaveURL('/overview')
})
```

## 时间安排

### 详细时间表
| 阶段 | 任务 | 预计时间 | 负责人 | 状态 |
|------|------|----------|--------|------|
| 第1天 | 项目初始化 | 8小时 | 开发者 | 待开始 |
| 第2天 | 核心功能迁移 | 8小时 | 开发者 | 待开始 |
| 第3天 | 页面组件迁移 | 8小时 | 开发者 | 待开始 |
| 第4天 | 高级功能开发 | 8小时 | 开发者 | 待开始 |
| 第5天 | 测试和优化 | 8小时 | 开发者 | 待开始 |

### 里程碑
- **第1天结束**: 基础项目结构完成
- **第2天结束**: 核心功能可用
- **第3天结束**: 主要页面完成
- **第4天结束**: 高级功能完成
- **第5天结束**: 项目可部署

## 风险控制

### 技术风险
- **Vue 3 学习曲线**: 提供详细文档和示例
- **依赖兼容性**: 使用稳定版本，充分测试
- **性能问题**: 定期性能监控和优化

### 时间风险
- **功能复杂度**: 分阶段实施，优先核心功能
- **测试时间**: 并行开发测试用例
- **集成问题**: 早期集成测试

### 质量风险
- **代码质量**: 严格的代码审查
- **功能完整性**: 详细的测试计划
- **用户体验**: 用户测试和反馈

## 成功标准

### 功能标准
- 所有现有功能正常工作
- 用户认证流程完整
- 系统设置功能可用
- 主题和布局切换正常

### 性能标准
- 首屏加载时间 < 2秒
- 页面切换时间 < 500ms
- 构建时间 < 3分钟
- 包大小优化 20%

### 质量标准
- TypeScript 类型检查通过
- ESLint 检查通过
- 测试覆盖率 > 80%
- 零构建错误

## 部署策略

### 开发环境
- 本地开发服务器
- 热重载支持
- 开发工具集成

### 生产环境
- 静态站点生成 (SSG)
- CDN 部署
- 自动构建和部署

### 监控和日志
- 错误监控
- 性能监控
- 用户行为分析

## 后续维护

### 代码维护
- 定期依赖更新
- 安全补丁应用
- 性能优化

### 功能扩展
- 新功能开发
- 用户体验改进
- 性能优化

### 文档维护
- API 文档更新
- 用户手册更新
- 开发文档维护
