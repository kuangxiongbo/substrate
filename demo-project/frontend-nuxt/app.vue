<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// 全局配置
useHead({
  title: 'Spec-Kit Demo - Nuxt 3',
  meta: [
    { name: 'description', content: 'Spec-Kit Demo Application built with Nuxt 3' }
  ]
})
</script>
