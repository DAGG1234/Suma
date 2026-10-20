<!-- src/components/audit/AuditHeader.vue -->
<script setup lang="ts">
defineProps<{
  searchQuery: string
  selectedFilter: 'all' | 'transactions' | 'debts' | 'savings' | 'system'
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:selectedFilter', value: 'all' | 'transactions' | 'debts' | 'savings' | 'system'): void
}>()
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">Panel de Auditoría</h2>
        <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Trazabilidad completa de operaciones financieras, deudas, metas y eventos del sistema.
        </p>
      </div>
      
      <!-- Buscador -->
      <div class="w-full sm:w-72">
        <input
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Buscar en auditoría..."
          class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
        />
      </div>
    </div>

    <!-- Pestañas de Filtro -->
    <div class="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
      <button
        type="button"
        @click="emit('update:selectedFilter', 'all')"
        :class="[
          'px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
          selectedFilter === 'all' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        ]"
      >
        Todo el registro
      </button>
      <button
        type="button"
        @click="emit('update:selectedFilter', 'transactions')"
        :class="[
          'px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
          selectedFilter === 'transactions' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        ]"
      >
        Transacciones
      </button>
      <button
        type="button"
        @click="emit('update:selectedFilter', 'debts')"
        :class="[
          'px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
          selectedFilter === 'debts' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        ]"
      >
        Deudas y Préstamos
      </button>
      <button
        type="button"
        @click="emit('update:selectedFilter', 'savings')"
        :class="[
          'px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
          selectedFilter === 'savings' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        ]"
      >
        Metas de Ahorro
      </button>
      <button
        type="button"
        @click="emit('update:selectedFilter', 'system')"
        :class="[
          'px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
          selectedFilter === 'system' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        ]"
      >
        Sistema y Tasas
      </button>
    </div>
  </div>
</template>