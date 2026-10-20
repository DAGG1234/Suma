<!-- src/components/settings/SettingsToggleItem.vue -->
<script setup lang="ts">
defineProps<{
  label: string
  subtitle?: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <div class="flex items-center justify-between p-3.5 rounded-2xl">
    <div class="flex items-center gap-3">
      <div v-if="$slots.icon" class="w-8 h-8 rounded-xl bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-800/80 dark:border-zinc-700/50 dark:text-zinc-300 border flex items-center justify-center shrink-0 transition-colors">
        <slot name="icon" />
      </div>
      <div>
        <span class="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white block tracking-tight transition-colors">
          {{ label }}
        </span>
        <span v-if="subtitle" class="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block transition-colors">
          {{ subtitle }}
        </span>
      </div>
    </div>

    <button
      type="button"
      @click="emit('update:modelValue', !modelValue)"
      :class="[
        'w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer',
        modelValue
          ? 'bg-zinc-900 dark:bg-white justify-end'
          : 'bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/60 justify-start'
      ]"
    >
      <div
        :class="[
          'w-4 h-4 rounded-full transition-transform duration-200',
          modelValue ? 'bg-white dark:bg-zinc-950' : 'bg-zinc-500 dark:bg-zinc-400'
        ]"
      />
    </button>
  </div>
</template>