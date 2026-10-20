<!-- src/views/BalanceView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import BalanceHeader from '../components/balance/BalanceHeader.vue'
import SavingsCardPanel from '../components/balance/savings/SavingsCardPanel.vue'
import DebtsCardPanel from '../components/balance/debts/DebtsCardPanel.vue'

// Estado para controlar la pestaña activa: 'savings' o 'debts'
const activeTab = ref<'savings' | 'debts'>('savings')
</script>

<template>
  <div class="w-full space-y-6 pb-28">
    <!-- Encabezado unificado de Balance -->
    <BalanceHeader />

    <!-- Pestañas de Navegación Interna (Estilo Minimalista) -->
    <div class="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
      <button
        type="button"
        @click="activeTab = 'savings'"
        class="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
        :class="activeTab === 'savings' 
          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' 
          : 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
      >
        Ahorros y Metas
      </button>

      <button
        type="button"
        @click="activeTab = 'debts'"
        class="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
        :class="activeTab === 'debts' 
          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' 
          : 'bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 hover:text-zinc-900 dark:hover:text-white'"
      >
        Deudas y Préstamos
      </button>
    </div>

    <!-- Panel Dinámico según la pestaña seleccionada -->
    <div class="transition-all duration-300">
      <SavingsCardPanel v-show="activeTab === 'savings'" />
      <DebtsCardPanel v-show="activeTab === 'debts'" />
    </div>
  </div>
</template>