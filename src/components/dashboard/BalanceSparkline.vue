<!-- src/components/dashboard/BalanceSparkline.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionStore } from '../../stores/useTransactionStore'

const transactionStore = useTransactionStore()

const sparklinePath = computed(() => {
  const txs = transactionStore.transactions
  if (!txs || txs.length === 0) {
    return 'M 0 20 Q 30 10, 60 20 T 120 20'
  }

  const points = [...txs].slice(0, 10).reverse()
  let currentAccum = 0
  const values: number[] = []

  points.forEach(t => {
    const amt = Number(t.amount) || 0
    currentAccum += t.type === 'income' ? amt : -amt
    values.push(currentAccum)
  })

  if (values.length === 1) {
    values.unshift(values[0] * 0.9)
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min === 0 ? 1 : max - min

  const width = 120
  const height = 40
  const padding = 4

  const coords = values.map((val, index) => {
    const x = (index / (values.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((val - min) / range) * (height - padding * 2)
    return { x, y }
  })

  return coords.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x} ${point.y}`
    const prev = a[i - 1]
    const cx = (prev.x + point.x) / 2
    return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`
  }, '')
})
</script>

<template>
  <div class="w-24 sm:w-28 h-10 flex items-center justify-center shrink-0 overflow-hidden">
    <svg 
      class="w-full h-full text-zinc-900 dark:text-white transition-colors duration-200" 
      viewBox="0 0 120 40" 
      preserveAspectRatio="none"
    >
      <path
        :d="sparklinePath"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-all duration-300"
      />
    </svg>
  </div>
</template>