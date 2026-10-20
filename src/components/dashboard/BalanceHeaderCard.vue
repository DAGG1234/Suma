<!-- src/components/dashboard/BalanceHeaderCard.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTransactionStore } from '../../stores/useTransactionStore'
import { useBalanceStore } from '../../stores/useBalanceStore'
import CurrencySelector from './CurrencySelector.vue'
import BalanceSparkline from './BalanceSparkline.vue'

const transactionStore = useTransactionStore()
const balanceStore = useBalanceStore()

const showBalance = ref<boolean>(true)

// 1. Saldo total acumulado en Bolívares (VES)
const rawBalanceVES = computed<number>(() => {
  if (!transactionStore.transactions || transactionStore.transactions.length === 0) return 0
  return transactionStore.transactions.reduce((acc, curr) => {
    const amount = Number(curr.amount) || 0
    return curr.type === 'income' ? acc + amount : acc - amount
  }, 0)
})

// 2. Tasa activa desde el store
const currentRate = computed<number>(() => {
  return balanceStore.currentRate || 1
})

// 3. Saldo convertido y formateado
const formattedBalance = computed<string>(() => {
  return balanceStore.formatAmount(rawBalanceVES.value)
})

// 4. Cálculo de PnL de hoy
const todayPnL = computed(() => {
  const todayStr = new Date().toISOString().split('T')[0]
  
  const todayTransactions = transactionStore.transactions.filter(t => {
    if (!t.created_at) return false
    const tDate = new Date(t.created_at).toISOString().split('T')[0]
    return tDate === todayStr
  })

  const netTodayVES = todayTransactions.reduce((acc, curr) => {
    const amount = Number(curr.amount) || 0
    return curr.type === 'income' ? acc + amount : acc - amount
  }, 0)

  const netTodayConverted = netTodayVES / currentRate.value

  const formattedNum = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(netTodayConverted))

  const sign = netTodayConverted >= 0 ? '+' : '-'
  const prefix = balanceStore.currencySymbol
  
  const previousBalanceVES = rawBalanceVES.value - netTodayVES
  const percentage = previousBalanceVES > 0 
    ? ((netTodayVES / previousBalanceVES) * 100).toFixed(2) 
    : '0.00'
  const percentageSign = Number(percentage) >= 0 ? '+' : ''

  return {
    valueText: `${sign}${prefix}${formattedNum}`,
    percentText: `(${percentageSign}${percentage}%)`
  }
})
</script>

<template>
  <div class="w-full bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-white rounded-3xl p-4 sm:p-6 transition-colors border border-zinc-200 dark:border-zinc-800/80 relative shadow-sm">
    
    <!-- FILA 1: Encabezado -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 transition-colors">
          Valor total estimado
        </span>

        <button
          @click="showBalance = !showBalance"
          class="p-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Alternar visibilidad"
        >
          <svg v-if="showBalance" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.959 8.959 0 013.682-.787c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.54 1.541l-11-11" />
          </svg>
        </button>
      </div>

      <button class="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer" title="Historial">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h3m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    </div>

    <!-- FILA 2: Saldo + Selector + Sparkline en contenedor delimitado -->
    <div class="flex items-center justify-between gap-3">
      
      <div class="flex flex-col min-w-0 flex-1">
        <div class="flex items-baseline flex-wrap gap-1.5">
          <h2 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white truncate transition-colors">
            <template v-if="showBalance">
              {{ formattedBalance }}
            </template>
            <template v-else>
              ••••••••
            </template>
          </h2>

          <CurrencySelector
            :model-value="balanceStore.selectedCurrency"
            @update:model-value="balanceStore.setSelectedCurrency($event)"
          />
        </div>

        <!-- FILA 3: PnL de hoy -->
        <div class="flex items-center gap-1 mt-1.5">
          <span class="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 border-b border-dashed border-zinc-300 dark:border-zinc-600 pb-0.5 shrink-0 transition-colors">
            PnL de hoy
          </span>
          <div class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold ml-1 truncate">
            <span>{{ todayPnL.valueText }}</span>
            <span class="hidden xs:inline">{{ todayPnL.percentText }}</span>
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Minigráfica Sparkline encapsulada -->
      <div class="shrink-0 overflow-hidden">
        <BalanceSparkline />
      </div>
    </div>

  </div>
</template>