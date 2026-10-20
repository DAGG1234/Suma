<!-- src/components/dashboard/TransactionModal.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTransactionStore, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../stores/useTransactionStore'

const transactionStore = useTransactionStore()

const amount = ref<number | ''>('')
const type = ref<'income' | 'expense'>('income')
const category = ref<string>(INCOME_CATEGORIES[0])
const currency = ref<'VES' | 'USD' | 'USDT'>('VES')
const description = ref<string>('')

watch(() => transactionStore.isModalOpen, (isOpen) => {
  if (isOpen) {
    type.value = transactionStore.modalType
    amount.value = ''
    category.value = type.value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    currency.value = 'VES'
    description.value = ''
  }
})

const handleSubmit = async () => {
  if (!amount.value || Number(amount.value) <= 0) return

  await transactionStore.addTransaction({
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    currency: currency.value,
    description: description.value.trim()
  })

  transactionStore.closeModal()
}
</script>

<template>
  <div v-if="transactionStore.isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm transition-colors">
    <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-900 dark:text-white transition-colors">
      
      <!-- Cabecera -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-base font-black tracking-tight text-zinc-900 dark:text-white transition-colors">
          Registrar {{ type === 'income' ? 'Ingreso' : 'Egreso' }}
        </h3>
        <button 
          @click="transactionStore.closeModal()" 
          class="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <!-- Monto Campo Ancho Completo -->
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 transition-colors">
            Monto ({{ currency }})
          </label>
          <input
            v-model="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            required
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors text-sm font-bold"
          />
        </div>

        <!-- Selector de Categoría estilo Select -->
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 transition-colors">
            Categoría
          </label>
          <div class="relative">
            <select
              v-model="category"
              class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors text-xs font-bold appearance-none cursor-pointer pr-10"
            >
              <option 
                v-for="cat in (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)" 
                :key="cat" 
                :value="cat"
                class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
              >
                {{ cat }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-500 dark:text-zinc-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5 transition-colors">
            Descripción (Opcional)
          </label>
          <input
            v-model="description"
            type="text"
            placeholder="Ej. Pago de Freelance / Compra de supermercado"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>

        <!-- Botón Único Confirmar -->
        <div class="pt-2">
          <button
            type="submit"
            class="w-full py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-black text-xs transition-colors shadow-lg cursor-pointer"
          >
            Confirmar
          </button>
        </div>

      </form>
    </div>
  </div>
</template>