<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          🎉 Nuxt 3 项目创建成功！
        </h1>
        <p class="text-lg text-gray-600 mb-6">
          这是一个使用 Nuxt 3 构建的前端项目
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">✅ 项目结构</h3>
            <p class="text-gray-600">已创建完整的 Nuxt 3 项目结构</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">🚀 快速启动</h3>
            <p class="text-gray-600">避免了复杂的依赖安装问题</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">📦 渐进式迁移</h3>
            <p class="text-gray-600">可以逐步添加功能和依赖</p>
          </div>
        </div>
        
        <div class="mt-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">下一步计划：</h2>
          <ul class="text-left max-w-md mx-auto space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              创建基础项目结构
            </li>
            <li class="flex items-center">
              <span class="text-yellow-500 mr-2">⏳</span>
              安装核心依赖
            </li>
            <li class="flex items-center">
              <span class="text-gray-400 mr-2">○</span>
              迁移认证系统
            </li>
            <li class="flex items-center">
              <span class="text-gray-400 mr-2">○</span>
              迁移页面组件
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 首页配置
useHead({
  title: '首页 - Spec-Kit Demo'
})
</script>
