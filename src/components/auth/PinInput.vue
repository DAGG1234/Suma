<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  loading?: boolean
  errorMsg?: string
  isError?: boolean
  hintText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'complete', val: string): void
}>()

const digits = ref<string[]>(['', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      digits.value = ['', '', '', '']
    } else if (newVal.length === 4) {
      digits.value = newVal.split('')
    }
  },
  { immediate: true }
)

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value.replace(/[^0-9]/g, '')
  
  if (val) {
    digits.value[index] = val.slice(-1)
    if (index < 3) {
      inputRefs.value[index + 1]?.focus()
    }
  } else {
    digits.value[index] = ''
  }

  const combined = digits.value.join('')
  emit('update:modelValue', combined)

  if (combined.length === 4) {
    emit('complete', combined)
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').slice(0, 4) || ''
  
  if (pastedData) {
    const newDigits = ['', '', '', '']
    pastedData.split('').forEach((char, idx) => {
      newDigits[idx] = char
    })
    digits.value = newDigits
    
    const combined = digits.value.join('')
    emit('update:modelValue', combined)

    if (combined.length === 4) {
      inputRefs.value[3]?.focus()
      emit('complete', combined)
    } else {
      inputRefs.value[combined.length]?.focus()
    }
  }
}
</script>

<template>
  <div class="space-y-3 w-full flex flex-col items-center">
    <div class="flex justify-center gap-3 md:gap-4">
      <template v-for="(_, index) in 4" :key="index">
        <input
          :ref="(el) => { if (el) inputRefs[index] = el as HTMLInputElement }"
          type="password"
          maxlength="1"
          inputmode="numeric"
          v-model="digits[index]"
          :disabled="loading"
          @input="handleInput(index, $event)"
          @keydown="handleKeydown(index, $event)"
          @paste="handlePaste"
          :class="[
            'w-11 h-12 md:w-13 md:h-14 text-center text-2xl font-black tracking-widest bg-transparent border-b-2 transition-all outline-none',
            isError 
              ? 'border-red-500 text-red-500' 
              : 'border-zinc-300 focus:border-zinc-950 text-zinc-900'
          ]"
        />
      </template>
    </div>

    <div class="text-xs font-medium tracking-wide text-center pt-1 min-h-[1.25rem]">
      <span v-if="loading" class="animate-pulse text-zinc-800 font-bold">Verificando PIN...</span>
      <span v-else-if="errorMsg" class="text-red-500 font-bold">{{ errorMsg }}</span>
      <span v-else class="text-zinc-500">{{ hintText || 'Ingresa tu PIN de 4 dígitos' }}</span>
    </div>
  </div>
</template>