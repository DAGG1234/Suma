<!-- src/components/balance/savings/SavingsSummaryCard.vue -->
<script setup lang="ts">
import { useSavingsStore } from '../../../stores/useSavingsStore'
import { useBalanceStore } from '../../../stores/useBalanceStore'

const savingsStore = useSavingsStore()
const balanceStore = useBalanceStore()
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
    <div>
      <p class="text-[11px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">Ahorro total</p>
      <h3 class="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">
        {{ balanceStore.formatAmount(savingsStore.totalSavedVES) }}
      </h3>
    </div>
    <div class="text-right">
      <p class="text-[11px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider">Meta global</p>
      <h3 class="text-xl sm:text-3xl font-black text-zinc-500 dark:text-zinc-400 mt-1">
        {{ balanceStore.formatAmount(savingsStore.totalTargetVES) }}
      </h3>
    </div>
  </div>
</template>