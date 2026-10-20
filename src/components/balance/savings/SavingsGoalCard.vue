<!-- src/components/balance/savings/SavingsGoalCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { SavingsGoal } from '../../../stores/useSavingsStore'

const props = defineProps<{
  goal: SavingsGoal
}>()

const emit = defineEmits<{
  (e: 'deposit', goal: SavingsGoal): void
  (e: 'withdraw', goal: SavingsGoal): void
  (e: 'delete', goal: SavingsGoal): void
}>()

const percentage = computed(() => {
  const saved = Number(props.goal.current_saved_amount) || 0
  const target = Number(props.goal.target_amount) || 1
  return Math.min(100, Math.round((saved / target) * 100))
})

const isCompleted = computed(() => {
  if (props.goal.goal_type === 'rotative') return false
  const saved = Number(props.goal.current_saved_amount) || 0
  const target = Number(props.goal.target_amount) || 0
  return Number(saved.toFixed(2)) >= Number(target.toFixed(2)) && target > 0
})

const formattedDate = computed(() => {
  if (!props.goal.created_at) return ''
  const date = new Date(props.goal.created_at)
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const formattedCurrentSaved = computed(() => {
  const saved = Number(props.goal.current_saved_amount) || 0
  if (props.goal.currency === 'VES') {
    return saved.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return saved.toFixed(2)
})

const formattedTarget = computed(() => {
  const target = Number(props.goal.target_amount) || 0
  return target.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const currencySymbol = computed(() => {
  if (props.goal.currency === 'USD') return '$'
  if (props.goal.currency === 'EUR') return '€'
  if (props.goal.currency === 'USDT') return 'USDT'
  return 'Bs.'
})
</script>

<template>
  <div 
    class="bg-white dark:bg-zinc-900 border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 transition-all"
    :class="isCompleted ? 'border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-50/10 dark:bg-emerald-950/10' : 'border-zinc-200 dark:border-zinc-800'"
  >
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5 flex-wrap">
          <h4 class="text-sm sm:text-base font-black text-zinc-900 dark:text-white">{{ goal.title }}</h4>
          <span 
            v-if="isCompleted" 
            class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
          >
            Completada
          </span>
          <span 
            v-else-if="goal.goal_type === 'rotative'" 
            class="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
          >
            Cochinito
          </span>
          <span v-if="formattedDate" class="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            {{ formattedDate }}
          </span>
        </div>
        <p v-if="goal.description" class="text-xs sm:text-sm text-zinc-500">{{ goal.description }}</p>
      </div>
      <button
        type="button"
        @click="emit('delete', goal)"
        class="text-zinc-400 hover:text-rose-600 transition-colors p-1.5 cursor-pointer shrink-0"
        title="Eliminar"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div>
      <div class="flex items-center justify-between text-xs sm:text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">
        <span>{{ currencySymbol }} {{ formattedCurrentSaved }} / {{ formattedTarget }}</span>
        <span>{{ percentage }}%</span>
      </div>
      <div class="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="isCompleted ? 'bg-emerald-500' : goal.goal_type === 'rotative' ? 'bg-blue-600' : 'bg-zinc-900 dark:bg-white'"
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-1">
      <template v-if="goal.goal_type === 'rotative'">
        <button
          type="button"
          @click="emit('deposit', goal)"
          class="flex-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center shadow-sm"
        >
          Depositar
        </button>
        <button
          type="button"
          @click="emit('withdraw', goal)"
          class="flex-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center shadow-sm"
        >
          Retirar
        </button>
      </template>

      <template v-else>
        <button
          v-if="!isCompleted"
          type="button"
          @click="emit('deposit', goal)"
          class="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center shadow-sm"
        >
          Depositar
        </button>

        <div 
          v-else 
          class="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold text-center select-none"
        >
          Meta cumplida
        </div>
      </template>
    </div>
  </div>
</template>