<!-- src/views/DashboardView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionStore } from '../stores/useTransactionStore'
import { useBalanceStore } from '../stores/useBalanceStore'

// Componentes de Navegación
import Sidebar from '../components/navigation/Sidebar.vue'
import MobileNavbar from '../components/navigation/MobileNavbar.vue'

// Componentes del Dashboard Principal
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'
import BalanceHeaderCard from '../components/dashboard/BalanceHeaderCard.vue'
import QuickActionButtons from '../components/dashboard/QuickActionButtons.vue'
import TransactionHistoryPreview from '../components/dashboard/TransactionHistoryPreview.vue'

// Modales Globales
import TransactionModal from '../components/dashboard/TransactionModal.vue'
import FullHistoryModal from '../components/dashboard/FullHistoryModal.vue'

const route = useRoute()
const transactionStore = useTransactionStore()
const balanceStore = useBalanceStore()

const isFullHistoryOpen = ref(false)

onMounted(async () => {
  await Promise.all([
    balanceStore.fetchRates(),
    transactionStore.fetchTransactions()
  ])
})
</script>

<template>
  <div class="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-200">
    <!-- Sidebar de escritorio -->
    <Sidebar />

    <!-- Contenedor Principal -->
    <div class="flex-1 flex flex-col md:pl-64 min-h-screen">
      <main class="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 pb-28 md:pb-8 flex flex-col gap-6">
        
        <!-- Si estamos en la ruta raíz /dashboard, mostramos los widgets principales -->
        <template v-if="route.path === '/dashboard'">
          <!-- Encabezado con Saludo y Nombre -->
          <DashboardHeader />

          <!-- Tarjeta de Saldo Principal -->
          <BalanceHeaderCard />

          <!-- Botones de Acción Rápida (Ingreso / Egreso) -->
          <QuickActionButtons />

          <!-- Vista previa del Historial -->
          <TransactionHistoryPreview @open-full-history="isFullHistoryOpen = true" />
        </template>

        <!-- Si estamos navegando a una sub-ruta (/dashboard/balance o /dashboard/audit), se pinta aquí -->
        <router-view v-else />

      </main>
    </div>

    <!-- Barra Navegación Móvil -->
    <MobileNavbar />

    <!-- Modales Globales -->
    <TransactionModal />

    <FullHistoryModal
      :is-open="isFullHistoryOpen"
      @close="isFullHistoryOpen = false"
    />
  </div>
</template>