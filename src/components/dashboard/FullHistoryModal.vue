<!-- src/components/dashboard/FullHistoryModal.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTransactionStore, type Transaction } from '../../stores/useTransactionStore'
import { useBalanceStore } from '../../stores/useBalanceStore'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const transactionStore = useTransactionStore()
const balanceStore = useBalanceStore()

const selectedType = ref<'all' | 'income' | 'expense'>('all')
const selectedDate = ref<string>('')
const isTypeMenuOpen = ref<boolean>(false)

const dropdownRef = ref<HTMLElement | null>(null)
const inputDateRef = ref<HTMLInputElement | null>(null)

const typeOptions = [
  { value: 'all', label: 'Tipo: Todos' },
  { value: 'income', label: 'Tipo: Ingresos' },
  { value: 'expense', label: 'Tipo: Egresos' }
]

const currentTypeLabel = computed(() => {
  const opt = typeOptions.find(o => o.value === selectedType.value)
  return opt ? opt.label : 'Tipo: Todos'
})

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const [year, month, day] = selectedDate.value.split('-')
  return `${day}/${month}/${year}`
})

const filteredTransactions = computed(() => {
  return transactionStore.transactions.filter((t: Transaction) => {
    if (selectedType.value !== 'all' && t.type !== selectedType.value) {
      return false
    }

    if (selectedDate.value) {
      if (!t.created_at) return false
      const tDateIso = new Date(t.created_at).toISOString().split('T')[0]
      if (tDateIso !== selectedDate.value) {
        return false
      }
    }

    return true
  })
})

const selectType = (type: 'all' | 'income' | 'expense') => {
  selectedType.value = type
  isTypeMenuOpen.value = false
}

const clearDateFilter = () => {
  selectedDate.value = ''
}

const openDatePicker = () => {
  const el = inputDateRef.value as HTMLInputElement | null
  if (el) {
    if (typeof (el as any).showPicker === 'function') {
      ;(el as any).showPicker()
    } else {
      el.focus()
    }
  }
}

const handleDelete = async (id?: string) => {
  if (!id) return
  await transactionStore.deleteTransaction(id)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isTypeMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm transition-colors"
  >
    <div
      class="w-full h-full sm:h-auto sm:max-h-[85vh] max-w-2xl bg-white dark:bg-zinc-900 border-0 sm:border border-zinc-200 dark:border-zinc-800 rounded-none sm:rounded-3xl p-5 sm:p-6 shadow-2xl text-zinc-900 dark:text-white flex flex-col overflow-visible relative transition-colors"
    >
      <!-- Cabecera del Modal -->
      <div class="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800/80 shrink-0">
        <div>
          <h3 class="text-lg font-black tracking-tight text-zinc-900 dark:text-white transition-colors">Historial de Movimientos</h3>
          <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block transition-colors">
            {{ filteredTransactions.length }} registros encontrados
          </span>
        </div>
        <button
          @click="emit('close')"
          class="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Cerrar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Barra de Filtros Compactos -->
      <div class="flex flex-wrap items-center justify-between gap-2 py-4 border-b border-zinc-200 dark:border-zinc-800/80 overflow-visible relative shrink-0">
        
        <!-- Filtro 1: Tipo de Movimiento -->
        <div class="relative" ref="dropdownRef">
          <button
            type="button"
            @click="isTypeMenuOpen = !isTypeMenuOpen"
            class="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl text-xs font-semibold px-4 py-2.5 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <span>{{ currentTypeLabel }}</span>
            <svg
              :class="['w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200', isTypeMenuOpen ? 'rotate-180' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="isTypeMenuOpen"
            class="absolute left-0 mt-2 w-40 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden backdrop-blur-md"
          >
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              type="button"
              @click="selectType(opt.value as any)"
              :class="[
                'w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer block',
                selectedType === opt.value
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800'
              ]"
            >
              {{ opt.label.replace('Tipo: ', '') }}
            </button>
          </div>
        </div>

        <!-- Filtro 2: Calendario -->
        <div class="relative flex items-center">
          <button
            type="button"
            @click="openDatePicker"
            class="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl text-xs font-semibold px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative"
          >
            <svg class="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>

            <span>{{ formattedSelectedDate || 'Seleccionar fecha' }}</span>

            <button
              v-if="selectedDate"
              type="button"
              @click.stop="clearDateFilter"
              class="ml-1 p-0.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Limpiar fecha"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <input
              ref="inputDateRef"
              type="date"
              v-model="selectedDate"
              class="absolute opacity-0 pointer-events-none w-0 h-0"
            />
          </button>
        </div>

      </div>

      <!-- Lista de Transacciones Globalmente Reactiva -->
      <div class="flex-1 overflow-y-auto my-4 pr-1 space-y-2">
        <template v-if="filteredTransactions.length > 0">
          <div
            v-for="t in filteredTransactions"
            :key="t.id || t.created_at"
            class="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/90 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors group shadow-sm"
          >
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-300 dark:border-zinc-700/50 text-zinc-900 dark:text-white transition-colors">
                <svg
                  v-if="t.type === 'income'"
                  class="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 text-rose-600 dark:text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>

              <div>
                <span class="text-sm font-bold text-zinc-900 dark:text-white block tracking-tight transition-colors">
                  {{ t.category }}
                </span>
                <span class="text-xs font-normal text-zinc-500 dark:text-zinc-400 block truncate max-w-45 sm:max-w-xs transition-colors">
                  {{ t.description || formatDate(t.created_at) }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-right">
                <!-- Usando el formateador y conversor global del store -->
                <span :class="['text-sm sm:text-base font-extrabold block tracking-tight transition-colors', t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white']">
                  {{ balanceStore.formatAmount(Number(t.amount), t.type) }}
                </span>
                <span class="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 block uppercase transition-colors">
                  {{ formatDate(t.created_at) }}
                </span>
              </div>

              <button
                type="button"
                @click.stop="handleDelete(t.id)"
                class="p-2 text-zinc-400 hover:text-rose-600 hover:bg-zinc-200 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                title="Eliminar transacción"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </template>

        <div v-else class="py-12 text-center flex flex-col items-center justify-center">
          <svg class="w-10 h-10 text-zinc-400 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase max-w-xs leading-relaxed transition-colors">
            NO HAY MOVIMIENTOS QUE COINCIDAN CON LOS FILTROS SELECCIONADOS
          </span>
        </div>
      </div>

      <!-- Pie del Modal -->
      <div class="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex justify-end shrink-0 transition-colors">
        <button
          @click="emit('close')"
          class="py-2.5 px-6 rounded-2xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>

    </div>
  </div>
</template>