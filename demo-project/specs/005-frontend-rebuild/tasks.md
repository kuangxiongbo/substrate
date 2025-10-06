# Task List: 前端重构 - 多布局系统

## 阶段 1: 基础架构重建

### 1.1 项目结构重组
- [ ] **task-1-1-1**: 创建新的目录结构
  - 创建 `src/components/layout` 目录
  - 创建 `src/components/ui` 目录
  - 创建 `src/components/forms` 目录
  - 创建 `src/pages/auth` 目录
  - 创建 `src/pages/admin` 目录
  - 创建 `src/pages/dashboard` 目录
  - 创建 `src/hooks` 目录
  - 创建 `src/constants` 目录

- [ ] **task-1-1-2**: 清理旧文件
  - 删除有问题的 `LayoutContext.tsx`
  - 删除有问题的 `utils/layout.ts`
  - 删除有问题的布局组件
  - 清理无用的类型定义文件

### 1.2 类型定义集中化
- [ ] **task-1-2-1**: 创建类型定义入口
  - 创建 `src/types/index.ts`
  - 定义 `LayoutConfig` 接口
  - 定义 `ThemeConfig` 接口
  - 定义 `User` 接口
  - 定义 `AuthState` 接口

- [ ] **task-1-2-2**: 导出所有类型
  - 导出布局相关类型
  - 导出主题相关类型
  - 导出用户相关类型
  - 导出认证相关类型
  - 导出通用类型

### 1.3 基础配置
- [ ] **task-1-3-1**: 更新 TypeScript 配置
  - 更新 `tsconfig.json`
  - 配置路径别名
  - 启用严格模式
  - 配置模块解析

- [ ] **task-1-3-2**: 配置开发工具
  - 更新 ESLint 配置
  - 配置 Prettier
  - 设置 Husky 钩子
  - 配置 lint-staged

- [ ] **task-1-3-3**: 更新 Vite 配置
  - 配置路径别名
  - 优化构建配置
  - 配置代理设置
  - 优化开发服务器

### 1.4 路由系统
- [ ] **task-1-4-1**: 重构路由配置
  - 创建 `src/router/index.tsx`
  - 配置路由结构
  - 实现路由懒加载
  - 添加路由守卫

- [ ] **task-1-4-2**: 实现路由组件
  - 创建 `ProtectedRoute` 组件
  - 创建 `PublicRoute` 组件
  - 实现路由重定向
  - 添加 404 页面

## 阶段 2: 核心系统重构

### 2.1 布局系统重构
- [ ] **task-2-1-1**: 创建布局状态管理
  - 创建 `src/stores/layoutStore.ts`
  - 实现布局状态管理
  - 添加状态持久化
  - 实现布局切换逻辑

- [ ] **task-2-1-2**: 创建布局提供者
  - 创建 `src/components/layout/LayoutProvider.tsx`
  - 实现布局上下文
  - 提供布局 Hook
  - 处理布局状态

- [ ] **task-2-1-3**: 实现侧边栏布局
  - 创建 `src/components/layout/SidebarLayout.tsx`
  - 实现侧边栏组件
  - 添加折叠功能
  - 实现响应式设计

- [ ] **task-2-1-4**: 实现顶部菜单布局
  - 创建 `src/components/layout/TopMenuLayout.tsx`
  - 实现顶部菜单组件
  - 添加菜单项
  - 实现响应式设计

- [ ] **task-2-1-5**: 创建布局切换器
  - 创建 `src/components/layout/LayoutSwitcher.tsx`
  - 实现布局切换 UI
  - 添加切换动画
  - 实现用户偏好保存

### 2.2 主题系统重构
- [ ] **task-2-2-1**: 创建主题状态管理
  - 创建 `src/stores/themeStore.ts`
  - 实现主题状态管理
  - 添加主题持久化
  - 实现主题切换逻辑

- [ ] **task-2-2-2**: 创建主题提供者
  - 创建 `src/components/theme/ThemeProvider.tsx`
  - 实现主题上下文
  - 提供主题 Hook
  - 处理主题状态

- [ ] **task-2-2-3**: 定义主题配置
  - 创建 `src/styles/themes/light.ts`
  - 创建 `src/styles/themes/dark.ts`
  - 创建 `src/styles/themes/high-contrast.ts`
  - 实现主题配置管理

- [ ] **task-2-2-4**: 创建主题切换器
  - 创建 `src/components/theme/ThemeSwitcher.tsx`
  - 实现主题切换 UI
  - 添加主题预览
  - 实现主题应用

### 2.3 状态管理重构
- [ ] **task-2-3-1**: 重构认证状态
  - 更新 `src/stores/authStore.ts`
  - 简化状态结构
  - 优化状态更新
  - 添加状态持久化

- [ ] **task-2-3-2**: 创建用户状态管理
  - 创建 `src/stores/userStore.ts`
  - 实现用户状态管理
  - 添加用户信息管理
  - 实现权限管理

- [ ] **task-2-3-3**: 创建应用状态管理
  - 创建 `src/stores/appStore.ts`
  - 实现应用全局状态
  - 添加加载状态管理
  - 实现错误状态管理

### 2.4 服务层重构
- [ ] **task-2-4-1**: 重构 API 服务
  - 更新 `src/services/api.ts`
  - 简化 API 配置
  - 优化请求拦截器
  - 添加响应拦截器

- [ ] **task-2-4-2**: 重构认证服务
  - 更新 `src/services/auth.ts`
  - 简化认证逻辑
  - 优化错误处理
  - 添加类型安全

- [ ] **task-2-4-3**: 创建用户服务
  - 创建 `src/services/user.ts`
  - 实现用户相关 API
  - 添加用户管理功能
  - 实现权限检查

## 阶段 3: 组件和页面重构

### 3.1 基础组件
- [ ] **task-3-1-1**: 创建 UI 组件库
  - 创建 `src/components/ui/Button.tsx`
  - 创建 `src/components/ui/Input.tsx`
  - 创建 `src/components/ui/Card.tsx`
  - 创建 `src/components/ui/Modal.tsx`

- [ ] **task-3-1-2**: 创建表单组件
  - 创建 `src/components/forms/LoginForm.tsx`
  - 创建 `src/components/forms/RegisterForm.tsx`
  - 创建 `src/components/forms/PasswordForm.tsx`
  - 创建 `src/components/forms/ProfileForm.tsx`

- [ ] **task-3-1-3**: 创建布局组件
  - 创建 `src/components/layout/Header.tsx`
  - 创建 `src/components/layout/Sidebar.tsx`
  - 创建 `src/components/layout/Footer.tsx`
  - 创建 `src/components/layout/Content.tsx`

### 3.2 页面组件
- [ ] **task-3-2-1**: 重构认证页面
  - 重构 `src/pages/auth/LoginPage.tsx`
  - 重构 `src/pages/auth/RegisterPage.tsx`
  - 重构 `src/pages/auth/ForgotPasswordPage.tsx`
  - 重构 `src/pages/auth/ResetPasswordPage.tsx`

- [ ] **task-3-2-2**: 重构管理页面
  - 重构 `src/pages/admin/DashboardPage.tsx`
  - 重构 `src/pages/admin/UserManagementPage.tsx`
  - 重构 `src/pages/admin/SystemConfigPage.tsx`
  - 重构 `src/pages/admin/LogsPage.tsx`

- [ ] **task-3-2-3**: 重构设置页面
  - 重构 `src/pages/settings/BasicConfigPage.tsx`
  - 重构 `src/pages/settings/SecurityConfigPage.tsx`
  - 重构 `src/pages/settings/EmailConfigPage.tsx`
  - 重构 `src/pages/settings/ThemeConfigPage.tsx`

### 3.3 业务组件
- [ ] **task-3-3-1**: 创建用户管理组件
  - 创建 `src/components/admin/UserList.tsx`
  - 创建 `src/components/admin/UserForm.tsx`
  - 创建 `src/components/admin/UserCard.tsx`
  - 创建 `src/components/admin/UserActions.tsx`

- [ ] **task-3-3-2**: 创建系统配置组件
  - 创建 `src/components/admin/SystemConfig.tsx`
  - 创建 `src/components/admin/SecurityConfig.tsx`
  - 创建 `src/components/admin/EmailConfig.tsx`
  - 创建 `src/components/admin/ThemeConfig.tsx`

- [ ] **task-3-3-3**: 创建仪表板组件
  - 创建 `src/components/dashboard/StatsCard.tsx`
  - 创建 `src/components/dashboard/Chart.tsx`
  - 创建 `src/components/dashboard/RecentActivity.tsx`
  - 创建 `src/components/dashboard/QuickActions.tsx`

### 3.4 自定义 Hooks
- [ ] **task-3-4-1**: 创建布局 Hooks
  - 创建 `src/hooks/useLayout.ts`
  - 创建 `src/hooks/useResponsive.ts`
  - 创建 `src/hooks/useBreakpoint.ts`
  - 创建 `src/hooks/useMediaQuery.ts`

- [ ] **task-3-4-2**: 创建认证 Hooks
  - 创建 `src/hooks/useAuth.ts`
  - 创建 `src/hooks/useUser.ts`
  - 创建 `src/hooks/usePermissions.ts`
  - 创建 `src/hooks/useSession.ts`

- [ ] **task-3-4-3**: 创建主题 Hooks
  - 创建 `src/hooks/useTheme.ts`
  - 创建 `src/hooks/useColorScheme.ts`
  - 创建 `src/hooks/useThemeToggle.ts`
  - 创建 `src/hooks/useThemeConfig.ts`

## 阶段 4: 优化和完善

### 4.1 性能优化
- [ ] **task-4-1-1**: 实现代码分割
  - 配置路由懒加载
  - 实现组件懒加载
  - 优化 Bundle 分割
  - 添加预加载策略

- [ ] **task-4-1-2**: 优化加载性能
  - 实现图片懒加载
  - 优化字体加载
  - 添加资源预加载
  - 实现缓存策略

- [ ] **task-4-1-3**: 优化运行时性能
  - 实现组件记忆化
  - 优化状态更新
  - 减少不必要的重渲染
  - 优化事件处理

### 4.2 错误处理
- [ ] **task-4-2-1**: 实现全局错误处理
  - 创建 `src/components/ErrorBoundary.tsx`
  - 实现错误边界
  - 添加错误日志
  - 实现错误恢复

- [ ] **task-4-2-2**: 优化错误提示
  - 创建 `src/components/ErrorMessage.tsx`
  - 实现错误提示组件
  - 添加错误类型处理
  - 优化用户体验

- [ ] **task-4-2-3**: 添加错误监控
  - 集成错误监控服务
  - 实现错误上报
  - 添加性能监控
  - 实现用户反馈

### 4.3 测试完善
- [ ] **task-4-3-1**: 添加单元测试
  - 测试工具函数
  - 测试自定义 Hooks
  - 测试组件逻辑
  - 测试状态管理

- [ ] **task-4-3-2**: 添加集成测试
  - 测试页面组件
  - 测试用户流程
  - 测试 API 集成
  - 测试状态同步

- [ ] **task-4-3-3**: 添加 E2E 测试
  - 测试完整用户流程
  - 测试跨浏览器兼容性
  - 测试响应式设计
  - 测试性能指标

### 4.4 文档和部署
- [ ] **task-4-4-1**: 编写技术文档
  - 编写架构文档
  - 编写组件文档
  - 编写 API 文档
  - 编写部署文档

- [ ] **task-4-4-2**: 优化构建流程
  - 优化构建配置
  - 添加构建优化
  - 实现自动化部署
  - 添加环境配置

- [ ] **task-4-4-3**: 准备生产部署
  - 配置生产环境
  - 优化生产构建
  - 添加监控配置
  - 实现回滚策略

## 验收标准

### 功能验收
- [ ] 所有页面正常显示
- [ ] 布局切换功能正常
- [ ] 主题切换功能正常
- [ ] 用户认证流程完整
- [ ] 系统管理功能正常
- [ ] 响应式设计完善
- [ ] 无障碍访问支持

### 技术验收
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 无模块导入错误
- [ ] 无控制台错误
- [ ] 测试覆盖率 > 80%
- [ ] 性能指标达标
- [ ] 代码质量达标

### 用户体验验收
- [ ] 界面美观现代
- [ ] 交互流畅自然
- [ ] 加载速度快
- [ ] 错误处理友好
- [ ] 操作直观简单
- [ ] 反馈及时准确

## 总结

这个任务列表涵盖了前端重构的所有关键步骤：

1. **基础架构重建**: 建立清晰的项目结构
2. **核心系统重构**: 重构布局、主题、状态管理
3. **组件和页面重构**: 重构所有组件和页面
4. **优化和完善**: 性能优化、错误处理、测试完善

通过这个系统性的重构，我们可以：
- 解决现有的模块导入问题
- 建立清晰的代码架构
- 提高代码质量和可维护性
- 确保项目的长期稳定性

每个任务都有明确的验收标准，确保重构的质量和效果。
