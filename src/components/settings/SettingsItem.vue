<!-- src/components/settings/SettingsItem.vue -->
<script setup lang="ts">
defineProps<{
  label: string
  value?: string
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    type="button"
    @click="emit('click')"
    class="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer group text-left gap-2 sm:gap-4 overflow-hidden"
  >
    <div class="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink">
      <div v-if="$slots.icon" class="w-8 h-8 rounded-xl bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-zinc-300 border flex items-center justify-center shrink-0 transition-colors">
        <slot name="icon" />
      </div>
      <span class="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white tracking-tight truncate transition-colors">
        {{ label }}
      </span>
    </div>

    <div class="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
      <span v-if="value" class="text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs transition-colors">
        {{ value }}
      </span>
      <svg class="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-white transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
</template>