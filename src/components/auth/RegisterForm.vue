<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import PinInput from './PinInput.vue'

const { register, checkPinAvailability, isLoading } = useAuth()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  pin_code: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const toastMessage = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const pinStatus = ref<{ checking: boolean; available: boolean | null; msg: string }>({
  checking: false,
  available: true,
  msg: '',
})

const showToast = (msg: string) => {
  if (toastTimer) clearTimeout(toastTimer)
  toastMessage.value = msg
  toastTimer = setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

const passwordsMatch = computed(() => {
  if (!form.value.password || !form.value.confirmPassword) return true
  return form.value.password === form.value.confirmPassword
})

const isFormValid = computed(() => {
  return (
    form.value.first_name.trim() !== '' &&
    form.value.last_name.trim() !== '' &&
    form.value.email.trim() !== '' &&
    form.value.password.length >= 6 &&
    passwordsMatch.value &&
    form.value.pin_code.length === 4 &&
    pinStatus.value.available !== false
  )
})

const handlePinUpdate = async (pin: string) => {
  form.value.pin_code = pin
  if (pin.length === 4 && checkPinAvailability) {
    pinStatus.value = { checking: true, available: null, msg: '' }
    const free = await checkPinAvailability(pin)
    pinStatus.value = {
      checking: false,
      available: free,
      msg: free ? '' : 'PIN ocupado, elige otro',
    }
  } else {
    pinStatus.value = { checking: false, available: true, msg: '' }
  }
}

const emit = defineEmits<{
  (e: 'success'): void
}>()

const handleRegister = async () => {
  if (!isFormValid.value) return
  try {
    await register({
      firstName: form.value.first_name,
      lastName: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
      pin: form.value.pin_code,
    })
    emit('success')
  } catch (err: any) {
    showToast(err.message || 'Error al completar el registro.')
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-3.5 w-full relative">
    <!-- Nombre y Apellido -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div class="relative">
        <label class="block text-xs font-bold text-zinc-700 mb-1">Nombre</label>
        <div class="flex items-center border-b-2 border-zinc-300 focus-within:border-black transition-colors py-1">
          <input
            type="text"
            v-model="form.first_name"
            required
            placeholder="Daniel"
            class="bg-transparent text-zinc-900 font-medium w-full outline-none text-sm md:text-base placeholder:text-zinc-400"
          />
        </div>
      </div>

      <div class="relative">
        <label class="block text-xs font-bold text-zinc-700 mb-1">Apellido</label>
        <div class="flex items-center border-b-2 border-zinc-300 focus-within:border-black transition-colors py-1">
          <input
            type="text"
            v-model="form.last_name"
            required
            placeholder="González"
            class="bg-transparent text-zinc-900 font-medium w-full outline-none text-sm md:text-base placeholder:text-zinc-400"
          />
        </div>
      </div>
    </div>

    <!-- Correo Electrónico -->
    <div class="relative">
      <label class="block text-xs font-bold text-zinc-700 mb-1">Correo Electrónico</label>
      <div class="flex items-center border-b-2 border-zinc-300 focus-within:border-black transition-colors py-1">
        <input
          type="email"
          v-model="form.email"
          required
          placeholder="correo@ejemplo.com"
          class="bg-transparent text-zinc-900 font-medium w-full outline-none text-sm md:text-base placeholder:text-zinc-400"
        />
      </div>
    </div>

    <!-- Contraseña y Confirmación -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div class="relative">
        <label class="block text-xs font-bold text-zinc-700 mb-1">Contraseña</label>
        <div class="flex items-center border-b-2 border-zinc-300 focus-within:border-black transition-colors py-1">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            required
            placeholder="Mínimo 6 caracteres"
            class="bg-transparent text-zinc-900 font-medium w-full outline-none text-sm md:text-base placeholder:text-zinc-400"
          />
          <button type="button" @click="showPassword = !showPassword" class="p-1 text-zinc-400 hover:text-black">
            <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.959 8.959 0 013.682-.787c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.54 1.541l-11-11" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="relative">
        <label class="block text-xs font-bold text-zinc-700 mb-1">Confirmar Contraseña</label>
        <div class="flex items-center border-b-2 border-zinc-300 focus-within:border-black transition-colors py-1">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="form.confirmPassword"
            required
            placeholder="Repite tu contraseña"
            class="bg-transparent text-zinc-900 font-medium w-full outline-none text-sm md:text-base placeholder:text-zinc-400"
          />
        </div>
        <span v-if="!passwordsMatch" class="text-[11px] text-red-500 mt-0.5 block font-semibold">Las contraseñas no coinciden</span>
      </div>
    </div>

    <!-- Entrada de PIN de 4 dígitos -->
    <div class="pt-2">
      <PinInput
        :model-value="form.pin_code"
        :loading="pinStatus.checking"
        :error-msg="pinStatus.msg"
        :is-error="pinStatus.available === false"
        hint-text="Crea tu PIN personal de 4 dígitos"
        @update:model-value="handlePinUpdate"
      />
    </div>

    <!-- Botón Principal -->
    <button
      type="submit"
      :disabled="!isFormValid || isLoading"
      class="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-2"
    >
      {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
    </button>

    <!-- Toast Flotante -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-4 opacity-0 scale-95"
    >
      <div
        v-if="toastMessage"
        class="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-2xl flex items-center gap-2"
      >
        <svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </form>
</template>