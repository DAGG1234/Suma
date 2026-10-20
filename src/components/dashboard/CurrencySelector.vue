<!-- src/components/dashboard/CurrencySelector.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { CurrencyType } from '../../stores/useBalanceStore'

const props = defineProps<{
  modelValue: CurrencyType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: CurrencyType): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currencies: { code: CurrencyType; label: string }[] = [
  { code: 'VES', label: 'VES' },
  { code: 'USD', label: 'USD' },
  { code: 'USDT', label: 'USDT' },
  { code: 'EUR', label: 'EUR' }
]

const selectCurrency = (code: CurrencyType) => {
  emit('update:modelValue', code)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="flex items-center gap-1 py-1 px-2.5 rounded-xl bg-zinc-200/80 hover:bg-zinc-300 dark:bg-zinc-800/60 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer shadow-sm"
    >
      <span>{{ modelValue }}</span>
      <svg 
        :class="['w-3.5 h-3.5 transition-transform duration-200 text-zinc-500 dark:text-zinc-400', isOpen ? 'rotate-180' : '']" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-28 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden backdrop-blur-md transition-colors"
    >
      <button
        v-for="curr in currencies"
        :key="curr.code"
        type="button"
        @click="selectCurrency(curr.code)"
        :class="[
          'w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer',
          modelValue === curr.code
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80'
        ]"
      >
        {{ curr.label }}
      </button>
    </div>
  </div>
</template>