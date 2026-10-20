<!-- src/components/dashboard/TransactionHistoryPreview.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionStore } from '../../stores/useTransactionStore'
import { useBalanceStore } from '../../stores/useBalanceStore'

const emit = defineEmits<{
  (e: 'open-full-history'): void
}>()

const transactionStore = useTransactionStore()
const balanceStore = useBalanceStore()

// Obtener las últimas 5 transacciones de forma reactiva
const recentTransactions = computed(() => {
  return transactionStore.transactions.slice(0, 5)
})

// Formato de fecha seguro para TypeScript
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Encabezado con Botón Píldora -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors">
        Transacciones
      </h3>
      <button
        @click="emit('open-full-history')"
        class="bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-bold py-1.5 px-4 rounded-full text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer select-none active:scale-95 shadow-sm"
      >
        Ver todo
      </button>
    </div>

    <!-- Lista de Transacciones -->
    <div v-if="recentTransactions.length === 0" class="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-8 text-center transition-colors shadow-sm">
      <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        No hay movimientos registrados
      </p>
    </div>

    <div v-else class="space-y-2.5">
      <div
        v-for="item in recentTransactions"
        :key="item.id"
        class="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between transition-all hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm"
      >
        <!-- Izquierda: Icono unificado + Información -->
        <div class="flex items-center gap-3.5 overflow-hidden">
          <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700/50 text-zinc-800 dark:text-white transition-colors">
            <!-- SVG Flecha Abajo (Ingreso) -->
            <svg v-if="item.type === 'income'" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <!-- SVG Flecha Arriba (Egreso) -->
            <svg v-else class="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>

          <div class="overflow-hidden">
            <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate leading-snug transition-colors">
              {{ item.category }}
            </p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate transition-colors">
              {{ item.description || formatDate(item.created_at) }}
            </p>
          </div>
        </div>

        <!-- Derecha: Monto Global Convertido -->
        <div class="text-right shrink-0 pl-2">
          <span :class="['text-sm font-black tracking-tight block transition-colors', item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white']">
            {{ balanceStore.formatAmount(Number(item.amount), item.type) }}
          </span>
          <span class="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 block uppercase transition-colors">
            {{ formatDate(item.created_at) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>