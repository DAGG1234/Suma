<!-- src/views/AuditView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBalanceStore } from '../stores/useBalanceStore'
import { useDebtsStore } from '../stores/useDebtsStore'
import { useSavingsStore } from '../stores/useSavingsStore'
import AuditHeader from '../components/audit/AuditHeader.vue'
import AuditLogList from '../components/audit/AuditLogList.vue'

const balanceStore = useBalanceStore()
const debtsStore = useDebtsStore()
const savingsStore = useSavingsStore()

const searchQuery = ref('')
const selectedFilter = ref<'all' | 'transactions' | 'debts' | 'savings' | 'system'>('all')

onMounted(async () => {
  await Promise.all([
    balanceStore.fetchRates(),
    balanceStore.fetchTransactions?.(),
    debtsStore.fetchDebts(),
    savingsStore.fetchGoals()
  ])
})

// Consolidar un historial unificado de auditoría
const auditLogs = computed(() => {
  const logs: Array<{
    id: string
    type: 'transactions' | 'debts' | 'savings' | 'system'
    title: string
    description: string
    amount?: number
    currency?: string
    date: Date
    badgeText: string
    badgeClass: string
  }> = []

  // 1. Transacciones financieras generales
  if (balanceStore.transactions) {
    balanceStore.transactions.forEach((tx: any) => {
      logs.push({
        id: tx.id || Math.random().toString(),
        type: 'transactions',
        title: tx.category || 'Movimiento Financiero',
        description: tx.description || 'Sin descripción',
        amount: Number(tx.amount) || 0,
        currency: tx.currency || 'VES',
        date: new Date(tx.created_at || Date.now()),
        badgeText: tx.type === 'income' ? 'Ingreso' : 'Egreso',
        badgeClass: tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
      })
    })
  }

  // 2. Registro de deudas y préstamos
  if (debtsStore.debts) {
    debtsStore.debts.forEach((debt: any) => {
      logs.push({
        id: debt.id || Math.random().toString(),
        type: 'debts',
        title: `Deuda: ${debt.title}`,
        description: `Tipo: ${debt.type === 'payable' ? 'Por pagar' : 'Por cobrar'} - Estado: ${debt.status}`,
        amount: Number(debt.total_amount) || 0,
        currency: debt.currency || 'USD',
        date: new Date(debt.created_at || Date.now()),
        badgeText: 'Deuda',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      })
    })
  }

  // 3. Metas de ahorro
  if (savingsStore.goals) {
    savingsStore.goals.forEach((goal: any) => {
      logs.push({
        id: goal.id || Math.random().toString(),
        type: 'savings',
        title: `Meta: ${goal.title}`,
        description: `Progreso registrado en ${goal.currency}`,
        amount: Number(goal.current_saved_amount) || 0,
        currency: goal.currency || 'USD',
        date: new Date(goal.created_at || Date.now()),
        badgeText: 'Ahorro',
        badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
      })
    })
  }

  // 4. Eventos del sistema
  logs.push({
    id: 'rate-sync',
    type: 'system',
    title: 'Sincronización de Tasas Cambiarias',
    description: `Tasa oficial BCV y Paralelo consultadas exitosamente`,
    date: new Date(),
    badgeText: 'Sistema',
    badgeClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
  })

  return logs.sort((a, b) => b.date.getTime() - a.date.getTime())
})

// Filtrado dinámico
const filteredLogs = computed(() => {
  return auditLogs.value.filter((log) => {
    const matchesFilter = selectedFilter.value === 'all' || log.type === selectedFilter.value
    const matchesSearch = 
      log.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesFilter && matchesSearch
  })
})
</script>

<template>
  <div class="w-full space-y-6">
    <AuditHeader
      v-model:searchQuery="searchQuery"
      v-model:selectedFilter="selectedFilter"
    />

    <AuditLogList
      :logs="filteredLogs"
    />
  </div>
</template>