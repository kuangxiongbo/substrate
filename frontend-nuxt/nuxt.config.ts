// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 基础配置
  ssr: true,
  
  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  },
  
  // CSS 配置
  css: [
    '~/assets/css/main.css'
  ],
  
  // 模块配置
  modules: [
    // 后续添加 Tailwind CSS 和 Pinia
  ],
  
  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // 开发服务器配置
  devServer: {
    port: 3001, // 避免与现有 React 项目冲突
    host: '0.0.0.0'
  }
})
