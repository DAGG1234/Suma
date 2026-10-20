<!-- src/components/settings/PinConfirmModal.vue -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title?: string
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', pin: string): void
}>()

const digits = ref<string[]>(['', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

const setInputRef = (el: any, index: number) => {
  if (el) {
    inputRefs.value[index] = el as HTMLInputElement
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    digits.value = ['', '', '', '']
    nextTick(() => {
      inputRefs.value[0]?.focus()
    })
  }
})

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const rawValue = target.value.replace(/\D/g, '')
  const lastDigit = rawValue.slice(-1)

  digits.value[index] = lastDigit
  target.value = lastDigit

  if (lastDigit && index < 3) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }

  if (digits.value.every(d => d !== '')) {
    submitPin()
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      inputRefs.value[index - 1]?.focus()
    } else {
      digits.value[index] = ''
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').trim().replace(/\D/g, '') || ''
  
  if (pastedData) {
    const pastedDigits = pastedData.slice(0, 4).split('')
    pastedDigits.forEach((char, i) => {
      if (i < 4) digits.value[i] = char
    })

    const nextIndex = Math.min(pastedDigits.length, 3)
    inputRefs.value[nextIndex]?.focus()

    if (digits.value.every(d => d !== '')) {
      submitPin()
    }
  }
}

const submitPin = () => {
  const fullPin = digits.value.join('')
  if (fullPin.length === 4) {
    emit('confirm', fullPin)
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-900 dark:text-white transition-colors">
      
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-black tracking-tight text-zinc-900 dark:text-white">
          Confirmación de Seguridad
        </h3>
        <button
          type="button"
          @click="emit('close')"
          class="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-6">
        Ingresa tu PIN de 4 dígitos para editar <span class="text-zinc-900 dark:text-white font-bold">{{ title }}</span>
      </p>

      <div class="flex justify-center gap-3 mb-6" @paste="handlePaste">
        <input
          v-for="(_, index) in 4"
          :key="index"
          :ref="(el) => setInputRef(el, index)"
          type="password"
          inputmode="numeric"
          pattern="[0-9]*"
          maxLength="1"
          v-model="digits[index]"
          @input="handleInput(index, $event)"
          @keydown="handleKeyDown(index, $event)"
          class="w-12 h-14 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl text-center text-xl font-black text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors select-none"
        />
      </div>

      <p v-if="errorMessage" class="text-xs font-bold text-rose-500 dark:text-rose-400 text-center mb-4">
        {{ errorMessage }}
      </p>

      <div class="flex gap-2">
        <button
          type="button"
          @click="emit('close')"
          class="flex-1 py-3 rounded-2xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="submitPin"
          class="flex-1 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-black text-xs transition-colors cursor-pointer"
        >
          Confirmar
        </button>
      </div>

    </div>
  </div>
</template>