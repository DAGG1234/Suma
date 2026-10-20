<!-- src/components/balance/debts/DebtModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useDebtsStore } from '../../../stores/useDebtsStore'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const debtsStore = useDebtsStore()

const title = ref('')
const personName = ref('')
const currency = ref<'VES' | 'USD' | 'USDT' | 'EUR'>('USD')
const totalAmount = ref<number | ''>('')
const debtType = ref<'payable' | 'receivable'>('payable')

const handleSubmit = async () => {
  if (!title.value || !personName.value || !totalAmount.value || Number(totalAmount.value) <= 0) return

  await debtsStore.addDebt({
    title: title.value,
    person_name: personName.value,
    currency: currency.value,
    total_amount: Number(totalAmount.value),
    debt_type: debtType.value
  })

  // Limpiar y cerrar
  title.value = ''
  personName.value = ''
  totalAmount.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-5 shadow-xl">
      <h3 class="text-xl font-bold text-zinc-900 dark:text-white">Nueva Deuda o Préstamo</h3>

      <div class="space-y-4">
        <!-- Tipo de operación -->
        <div class="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
          <button
            type="button"
            @click="debtType = 'payable'"
            :class="[
              'py-2.5 text-xs font-bold rounded-xl transition-all',
              debtType === 'payable' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'
            ]"
          >
            Por pagar (Debo)
          </button>
          <button
            type="button"
            @click="debtType = 'receivable'"
            :class="[
              'py-2.5 text-xs font-bold rounded-xl transition-all',
              debtType === 'receivable' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'
            ]"
          >
            Por cobrar (Me deben)
          </button>
        </div>

        <div class="space-y-1">
          <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Concepto o Título</label>
          <input
            v-model="title"
            type="text"
            placeholder="Ej. Prestamo de vehículo, Compra..."
            class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
          />
        </div>

        <div class="space-y-1">
          <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Persona (Acreedor / Deudor)</label>
          <input
            v-model="personName"
            type="text"
            placeholder="Ej. Juan Pérez"
            class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Divisa</label>
            <select
              v-model="currency"
              class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            >
              <option value="USD">USD ($)</option>
              <option value="VES">VES (Bs.)</option>
              <option value="USDT">USDT</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Monto Total</label>
            <input
              v-model.number="totalAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              class="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            />
          </div>
        </div>
      </div>

      <div class="flex space-x-3 pt-2">
        <button
          @click="emit('close')"
          class="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold py-3 rounded-2xl text-sm transition-all"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          class="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-3 rounded-2xl text-sm transition-all shadow-sm"
        >
          Guardar Deuda
        </button>
      </div>
    </div>
  </div>
</template>