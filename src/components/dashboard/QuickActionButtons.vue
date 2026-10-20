<!-- src/components/dashboard/QuickActionButtons.vue -->
<script setup lang="ts">
import { useTransactionStore } from '../../stores/useTransactionStore'

const transactionStore = useTransactionStore()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:gap-4 w-full">
    <!-- Botón Ingreso -->
    <button
      @click="transactionStore.openModal('income')"
      class="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-zinc-100 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm active:scale-95 cursor-pointer group"
    >
      <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      <div class="text-left">
        <span class="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block transition-colors">Registrar</span>
        <span class="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight transition-colors">Ingreso</span>
      </div>
    </button>

    <!-- Botón Egreso -->
    <button
      @click="transactionStore.openModal('expense')"
      class="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-zinc-100 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm active:scale-95 cursor-pointer group"
    >
      <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 group-hover:scale-110 transition-transform">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
      <div class="text-left">
        <span class="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block transition-colors">Registrar</span>
        <span class="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight transition-colors">Egreso</span>
      </div>
    </button>
  </div>
</template>