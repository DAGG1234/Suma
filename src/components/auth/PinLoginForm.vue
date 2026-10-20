<script setup lang="ts">
import { ref } from 'vue'
import PinInput from './PinInput.vue'
import { useAuth } from '../../composables/useAuth'

const pin = ref('')
const { loginWithPin, errorMessage, isLoading } = useAuth()

const handlePinComplete = async (completedPin: string) => {
  if (isLoading.value) return
  pin.value = completedPin
  await loginWithPin(completedPin)
}

const handleSubmit = async () => {
  if (pin.value.length === 4 && !isLoading.value) {
    await loginWithPin(pin.value)
  }
}
</script>

<template>
  <div class="space-y-6 w-full max-w-sm mx-auto">
    <div class="text-center">
      <p class="text-sm font-semibold text-zinc-600">
        Ingresa tu PIN personal de 4 dígitos
      </p>
    </div>

    <PinInput
      v-model="pin"
      :loading="isLoading"
      :is-error="!!errorMessage"
      :error-msg="errorMessage"
      hint-text="Introduce los 4 dígitos configurados en tu cuenta"
      @complete="handlePinComplete"
    />

    <button 
      type="button"
      @click="handleSubmit"
      :disabled="pin.length !== 4 || isLoading"
      class="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-2"
    >
      {{ isLoading ? 'Verificando PIN...' : 'Iniciar Sesión (PIN)' }}
    </button>
  </div>
</template>