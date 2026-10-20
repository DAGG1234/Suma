<!-- src/components/audit/AuditLogItem.vue -->
<script setup lang="ts">
defineProps<{
  log: {
    id: string
    type: string
    title: string
    description: string
    amount?: number
    currency?: string
    date: Date
    badgeText: string
    badgeClass: string
  }
}>()

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-VE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all">
    <div class="flex items-start gap-3">
      <span :class="['text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mt-0.5 shrink-0', log.badgeClass]">
        {{ log.badgeText }}
      </span>
      <div class="space-y-0.5">
        <h4 class="text-sm font-bold text-zinc-900 dark:text-white">{{ log.title }}</h4>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ log.description }}</p>
        <span class="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium block sm:hidden">
          {{ formatDate(log.date) }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between sm:justify-end gap-4 shrink-0">
      <span class="text-xs sm:text-sm font-black text-zinc-900 dark:text-white" v-if="log.amount !== undefined">
        {{ log.currency }} {{ log.amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
      </span>
      <span class="text-xs text-zinc-400 dark:text-zinc-500 font-medium hidden sm:block">
        {{ formatDate(log.date) }}
      </span>
    </div>
  </div>
</template>