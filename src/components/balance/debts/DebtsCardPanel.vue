<!-- src/components/balance/debts/DebtsCardPanel.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDebtsStore, type Debt } from '../../../stores/useDebtsStore'
import { useBalanceStore } from '../../../stores/useBalanceStore'
import DebtsSummaryCard from './DebtsSummaryCard.vue'
import DebtCard from './DebtCard.vue'
import DebtModal from './DebtModal.vue'

const debtsStore = useDebtsStore()
const balanceStore = useBalanceStore()

const isModalOpen = ref(false)
const isPaymentModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const activeDebt = ref<Debt | null>(null)
const debtToDelete = ref<Debt | null>(null)
const paymentAmountVES = ref<number | ''>('')
const warningMessage = ref<string | null>(null)

onMounted(async () => {
  await Promise.all([
    balanceStore.fetchRates(),
    balanceStore.fetchTransactions?.(),
    debtsStore.fetchDebts()
  ])
})

const handleSaveDebt = async (newDebt: { title: string; person_name: string; description?: string; currency: 'VES' | 'USD' | 'USDT' | 'EUR'; total_amount: number; debt_type: 'payable' | 'receivable' }) => {
  await debtsStore.addDebt(newDebt)
  isModalOpen.value = false
}

const handlePay = (debt: Debt) => {
  if (!debt.id) return
  activeDebt.value = debt
  paymentAmountVES.value = ''
  warningMessage.value = null
  isPaymentModalOpen.value = true
}

const executePayment = async () => {
  if (!activeDebt.value?.id || typeof paymentAmountVES.value !== 'number' || paymentAmountVES.value <= 0) return

  const inputBs = paymentAmountVES.value
  let finalForeignAmount = inputBs

  let rate = 36.5
  if (activeDebt.value.currency === 'USD') rate = Number(balanceStore.rates.USD) || 36.5
  if (activeDebt.value.currency === 'USDT') rate = Number(balanceStore.rates.USDT || 38.0)
  if (activeDebt.value.currency === 'EUR') rate = Number(balanceStore.rates.EUR || 39.8)

  if (activeDebt.value.currency !== 'VES') {
    finalForeignAmount = inputBs / rate
  }

  const currentPaid = Number(activeDebt.value.paid_amount) || 0
  const total = Number(activeDebt.value.total_amount) || 0
  const remaining = Math.max(0, total - currentPaid)

  if (finalForeignAmount > remaining + 0.001) {
    warningMessage.value = `El abono excede el monto restante (${remaining.toFixed(2)} ${activeDebt.value.currency}).`
    return
  }

  const result = await debtsStore.payDebt(
    activeDebt.value.id,
    inputBs,
    activeDebt.value.title,
    finalForeignAmount
  )

  if (!result.success) {
    warningMessage.value = result.message || 'Error al procesar el abono'
    return
  }

  // Refrescar al instante en la vista sin recargar la página
  await Promise.all([
    debtsStore.fetchDebts(),
    balanceStore.fetchTransactions?.()
  ])

  isPaymentModalOpen.value = false
  activeDebt.value = null
  paymentAmountVES.value = ''
  warningMessage.value = null
}

const handleDeleteRequest = (debt: Debt) => {
  if (!debt.id) return
  debtToDelete.value = debt
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!debtToDelete.value?.id) return
  await debtsStore.deleteDebt(debtToDelete.value.id)
  isDeleteModalOpen.value = false
  debtToDelete.value = null
}
</script>

<template>
  <div class="w-full space-y-4">
    <DebtsSummaryCard />

    <div class="flex items-center justify-between pt-2">
      <h3 class="text-sm sm:text-base font-black tracking-tight text-zinc-900 dark:text-white">Listado de deudas y préstamos</h3>
      <button
        type="button"
        @click="isModalOpen = true"
        class="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full transition-colors cursor-pointer shadow-sm active:scale-95"
      >
        Nueva deuda
      </button>
    </div>

    <div v-if="debtsStore.debts.length === 0" class="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
      <p class="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider">No hay deudas ni préstamos registrados</p>
    </div>

    <div v-else class="space-y-3">
      <DebtCard
        v-for="debt in debtsStore.debts"
        :key="debt.id || debt.title"
        :debt="debt"
        @pay="handlePay"
        @delete="handleDeleteRequest"
      />
    </div>

    <DebtModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @save="handleSaveDebt"
    />

    <!-- Modal de Abono -->
    <div v-if="isPaymentModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
      <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 class="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
          Abonar a: {{ activeDebt?.title }}
        </h3>
        
        <div v-if="warningMessage" class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium leading-relaxed">
          {{ warningMessage }}
        </div>

        <div>
          <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">
            Monto del abono en Bolívares (Bs.)
          </label>
          <input
            v-model.number="paymentAmountVES"
            type="number"
            step="0.01"
            placeholder="0.00"
            autofocus
            @input="warningMessage = null"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white font-bold outline-none"
          />
          <p v-if="activeDebt?.currency !== 'VES' && typeof paymentAmountVES === 'number' && paymentAmountVES > 0" class="text-[11px] sm:text-xs text-zinc-400 mt-1.5">
            Equivalente: 
            <span class="font-bold text-zinc-700 dark:text-zinc-200">
              {{ (paymentAmountVES / (activeDebt?.currency === 'USD' ? (balanceStore.rates.USD || 36.5) : activeDebt?.currency === 'USDT' ? (balanceStore.rates.USDT || 38.0) : (balanceStore.rates.EUR || 39.8))).toFixed(2) }} {{ activeDebt?.currency }}
            </span>
          </p>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <button
            type="button"
            @click="isPaymentModalOpen = false"
            class="flex-1 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="executePayment"
            class="flex-1 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs sm:text-sm font-bold cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
      <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 class="text-base sm:text-lg font-black text-zinc-900 dark:text-white">Eliminar deuda</h3>
        <p class="text-xs sm:text-sm text-zinc-500 leading-relaxed">
          ¿Deseas eliminar <span class="font-bold text-zinc-800 dark:text-zinc-200">"{{ debtToDelete?.title }}"</span>? Esta acción no se puede deshacer.
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