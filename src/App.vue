<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from './stores/useThemeStore'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white transition-colors duration-200">
    <RouterView />
  </div>
</template>