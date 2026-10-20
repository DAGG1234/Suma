<!-- src/components/balance/savings/SavingsCardPanel.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSavingsStore, type SavingsGoal } from '../../../stores/useSavingsStore'
import { useBalanceStore } from '../../../stores/useBalanceStore'
import SavingsSummaryCard from './SavingsSummaryCard.vue'
import SavingsGoalCard from './SavingsGoalCard.vue'
import SavingsModal from './SavingsModal.vue'

const savingsStore = useSavingsStore()
const balanceStore = useBalanceStore()

const isModalOpen = ref(false)
const isTxModalOpen = ref(false)
const isDeleteModalOpen = ref(false) // Estado para el modal de confirmación de eliminación

const txType = ref<'deposit' | 'withdraw'>('deposit')
const activeGoal = ref<SavingsGoal | null>(null)
const goalToDelete = ref<SavingsGoal | null>(null) // Meta seleccionada para borrar
const txAmountVES = ref<number | ''>('')
const warningMessage = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([
    balanceStore.fetchRates(),
    balanceStore.fetchTransactions?.(),
    savingsStore.fetchGoals()
  ])
})

const handleSaveGoal = async (newGoal: { title: string; description: string; currency: 'VES' | 'USD' | 'USDT' | 'EUR'; target_amount: number; current_saved_amount: number; goal_type: 'fixed' | 'rotative' }) => {
  await savingsStore.addGoal(newGoal)
  isModalOpen.value = false
}

const handleDeposit = (goal: SavingsGoal) => {
  if (!goal.id) return
  activeGoal.value = goal
  txType.value = 'deposit'
  txAmountVES.value = ''
  warningMessage.value = null
  isTxModalOpen.value = true
}

const handleWithdraw = (goal: SavingsGoal) => {
  if (!goal.id) return
  activeGoal.value = goal
  txType.value = 'withdraw'
  txAmountVES.value = ''
  warningMessage.value = null
  isTxModalOpen.value = true
}

const executeTransaction = async () => {
  if (!activeGoal.value?.id || typeof txAmountVES.value !== 'number' || txAmountVES.value <= 0) return

  const inputBs = txAmountVES.value
  let finalAmountToSave = inputBs

  let rate = 36.5
  if (activeGoal.value.currency === 'USD') rate = Number(balanceStore.rates.USD) || 36.5
  if (activeGoal.value.currency === 'USDT') rate = Number(balanceStore.rates.USDT || 38.0)
  if (activeGoal.value.currency === 'EUR') rate = Number(balanceStore.rates.EUR) || 39.8

  if (txType.value === 'deposit') {
    if (activeGoal.value.currency !== 'VES') {
      finalAmountToSave = inputBs / rate
    }

    if (activeGoal.value.goal_type !== 'rotative' && activeGoal.value.currency !== 'VES') {
      const target = Number(activeGoal.value.target_amount) || 0
      const saved = Number(activeGoal.value.current_saved_amount) || 0
      const remainingForeign = Math.max(0, target - saved)

      if (finalAmountToSave > remainingForeign) {
        const remainingBs = remainingForeign * rate
        const currencySymbol = activeGoal.value.currency === 'USD' ? '$' : activeGoal.value.currency === 'EUR' ? '€' : 'USDT'
        
        warningMessage.value = `Faltan ${remainingForeign.toFixed(2)} ${currencySymbol} (~Bs. ${remainingBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`
        return
      }
    } else if (activeGoal.value.goal_type !== 'rotative' && activeGoal.value.currency === 'VES') {
      const target = Number(activeGoal.value.target_amount) || 0
      const saved = Number(activeGoal.value.current_saved_amount) || 0
      const remainingBs = Math.max(0, target - saved)

      if (inputBs > remainingBs) {
        warningMessage.value = `Faltan Bs. ${remainingBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
        return
      }
    }

    const result = await savingsStore.depositToGoal(
      activeGoal.value.id, 
      inputBs, 
      activeGoal.value.title, 
      finalAmountToSave
    )

    if (!result.success) {
      warningMessage.value = result.message || 'Saldo insuficiente'
      return
    }
  } else {
    if (activeGoal.value.currency !== 'VES') {
      finalAmountToSave = inputBs / rate
    }
    await savingsStore.withdrawFromGoal(activeGoal.value.id, finalAmountToSave)
  }

  isTxModalOpen.value = false
  activeGoal.value = null
  txAmountVES.value = ''
  warningMessage.value = null
}

// Abrir el modal personalizado de eliminación
const handleDeleteRequest = (goal: SavingsGoal) => {
  if (!goal.id) return
  goalToDelete.value = goal
  isDeleteModalOpen.value = true
}

// Confirmar la eliminación en Supabase
const confirmDelete = async () => {
  if (!goalToDelete.value?.id) return
  await savingsStore.deleteGoal(goalToDelete.value.id)
  isDeleteModalOpen.value = false
  goalToDelete.value = null
}
</script>

<template>
  <div class="w-full space-y-4">
    <SavingsSummaryCard />

    <div class="flex items-center justify-between pt-2">
      <h3 class="text-sm sm:text-base font-black tracking-tight text-zinc-900 dark:text-white">Metas de ahorro</h3>
      <button
        type="button"
        @click="isModalOpen = true"
        class="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full transition-colors cursor-pointer shadow-sm active:scale-95"
      >
        Nueva meta
      </button>
    </div>

    <div v-if="savingsStore.goals.length === 0" class="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
      <p class="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider">No hay metas registradas</p>
    </div>

    <div v-else class="space-y-3">
      <SavingsGoalCard
        v-for="goal in savingsStore.goals"
        :key="goal.id || goal.title"
        :goal="goal"
        @deposit="handleDeposit"
        @withdraw="handleWithdraw"
        @delete="handleDeleteRequest"
      />
    </div>

    <SavingsModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @save="handleSaveGoal"
    />

    <!-- Modal de Transacción (Depositar / Retirar) -->
    <div v-if="isTxModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
      <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 class="text-base sm:text-lg font-black text-zinc-900 dark:text-white capitalize">
          {{ txType === 'deposit' ? 'Depositar' : 'Retirar' }}: {{ activeGoal?.title }}
        </h3>
        
        <div v-if="warningMessage" class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium leading-relaxed">
          {{ warningMessage }}
        </div>

        <div>
          <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">
            Monto en Bolívares (Bs.)
          </label>
          <input
            v-model.number="txAmountVES"
            type="number"
            step="0.01"
            placeholder="0.00"
            autofocus
            @input="warningMessage = null"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white font-bold outline-none"
          />
          <p v-if="activeGoal?.currency !== 'VES' && typeof txAmountVES === 'number' && txAmountVES > 0" class="text-[11px] sm:text-xs text-zinc-400 mt-1.5">
            Equivalente: 
            <span class="font-bold text-zinc-700 dark:text-zinc-200">
              {{ (txAmountVES / (activeGoal?.currency === 'USD' ? (balanceStore.rates.USD || 36.5) : activeGoal?.currency === 'USDT' ? (balanceStore.rates.USDT || 38.0) : (balanceStore.rates.EUR || 39.8))).toFixed(2) }} {{ activeGoal?.currency }}
            </span>
          </p>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <button
            type="button"
            @click="isTxModalOpen = false"
            class="flex-1 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="executeTransaction"
            class="flex-1 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs sm:text-sm font-bold cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Personalizado de Confirmación de Eliminación -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
      <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 class="text-base sm:text-lg font-black text-zinc-900 dark:text-white">Eliminar meta</h3>
        <p class="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          ¿Deseas eliminar <span class="font-bold text-zinc-800 dark:text-zinc-200">"{{ goalToDelete?.title }}"</span>? Esta acción no se puede deshacer.
        </p>

        <div class="flex items-center gap-2 pt-2">
          <button
            type="button"
            @click="isDeleteModalOpen = false"
            class="flex-1 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>