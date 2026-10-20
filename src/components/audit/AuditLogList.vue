<!-- src/components/audit/AuditLogList.vue -->
<script setup lang="ts">
import AuditLogItem from './AuditLogItem.vue'

defineProps<{
  logs: Array<{
    id: string
    type: string
    title: string
    description: string
    amount?: number
    currency?: string
    date: Date
    badgeText: string
    badgeClass: string
  }>
}>()
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
    <div v-if="logs.length === 0" class="text-center py-12">
      <p class="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider">No se encontraron registros de auditoría</p>
    </div>

    <div v-else class="divide-y divide-zinc-100 dark:divide-zinc-800">
      <AuditLogItem
        v-for="log in logs"
        :key="log.id"
        :log="log"
      />
    </div>
  </div>
</template>