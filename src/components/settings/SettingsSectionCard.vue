<!-- src/components/settings/SettingsSectionCard.vue -->
<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="space-y-2">
    <h2 v-if="title" class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-3 transition-colors duration-200">
      {{ title }}
    </h2>
    <div class="bg-white border-zinc-200/80 text-zinc-900 dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-white border rounded-3xl p-1.5 space-y-1 transition-colors duration-200">
      <slot />
    </div>
  </div>
</template>