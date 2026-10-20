<!-- src/components/balance/savings/SavingsModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', goal: { title: string; description: string; currency: 'VES' | 'USD' | 'USDT' | 'EUR'; target_amount: number; current_saved_amount: number; goal_type: 'fixed' | 'rotative' }): void
}>()

const title = ref('')
const description = ref('')
const currency = ref<'VES' | 'USD' | 'USDT' | 'EUR'>('USD')
const goalType = ref<'fixed' | 'rotative'>('fixed')
const targetAmount = ref<number | ''>('')
const initialSaved = ref<number | ''>('')

const handleSubmit = () => {
  if (!title.value || !targetAmount.value || Number(targetAmount.value) <= 0) return

  emit('save', {
    title: title.value,
    description: description.value,
    currency: currency.value,
    target_amount: Number(targetAmount.value),
    current_saved_amount: Number(initialSaved.value) || 0,
    goal_type: goalType.value
  })

  title.value = ''
  description.value = ''
  currency.value = 'USD'
  goalType.value = 'fixed'
  targetAmount.value = ''
  initialSaved.value = ''
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
    <div class="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
      <h3 class="text-base sm:text-lg font-black text-zinc-900 dark:text-white">Nueva meta</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">Título</label>
          <input v-model="title" type="text" placeholder="Ej. Cochinito médico" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">Moneda</label>
            <select v-model="currency" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-3 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none">
              <option value="USD">USD ($)</option>
              <option value="VES">VES (Bs.)</option>
              <option value="USDT">USDT</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">Tipo</label>
            <select v-model="goalType" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-3 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none">
              <option value="fixed">Fija</option>
              <option value="rotative">Cochinito</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">Objetivo</label>
          <input v-model="targetAmount" type="number" step="0.01" placeholder="0.00" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white font-bold outline-none" />
        </div>

        <div>
          <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">Ahorro inicial</label>
          <input v-model="initialSaved" type="number" step="0.01" placeholder="0.00" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none" />
        </div>

        <div>
          <label class="block text-[11px] sm:text-xs font-bold text-zinc-500 uppercase mb-1.5">Descripción</label>
          <input v-model="description" type="text" placeholder="Opcional" class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none" />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="button" @click="emit('close')" class="flex-1 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">Cancelar</button>
        <button type="button" @click="handleSubmit" class="flex-1 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs sm:text-sm font-bold cursor-pointer">Guardar</button>
      </div>
    </div>
  </div>
</template>