<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { loginWithEmail, isLoading } = useAuth()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const toastMessage = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const emit = defineEmits<{
  (e: 'success'): void
}>()

const showToast = (msg: string) => {
  if (toastTimer) clearTimeout(toastTimer)
  toastMessage.value = msg
  toastTimer = setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

const handleLogin = async () => {
  try {
    await loginWithEmail(email.value, password.value)
    emit('success')
  } catch (err: any) {
    showToast(err.message || 'Credenciales incorrectas.')
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-4 w-full relative">
    <!-- Correo Electrónico -->
    <div class="relative">
      <label class="block text-xs font-bold text-zinc-700 mb-1">Correo Electrónico</label>
      <div class="flex items-center border-b-2 border-zinc-300 focus-within:border-black transition-colors py-1">
        <svg class="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
        <input
          type="email"
          v-model="email"
          required
          placeholder="correo@ejemplo.com"
          class="bg-transparent text-zinc-900 font-medium w-full outline-none text-sm md:text-base placeholder:text-zinc-400"
        />
      </div>
    </div>

    <!-- Contraseña -->
    <div class="relative">
      <label class="block text-xs font-bold text-zinc-700 mb-1">Contraseña</label>
      <div class="flex items-center border-b-2 border-zinc-300 focus-within:border-black transition-colors py-1">
        <svg class="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <input
          type="password"
          v-model="password"
          required
          placeholder="••••••••"
          class="bg-transparent text-zinc-900 font-medium w-full outline-none text-sm md:text-base placeholder:text-zinc-400"
        />
      </div>
    </div>

    <!-- Recordarme / Olvidó contraseña -->
    <div class="flex items-center justify-between text-xs py-1">
      <label class="flex items-center space-x-2 text-zinc-600 cursor-pointer select-none">
        <input type="checkbox" v-model="rememberMe" class="rounded border-zinc-400 text-black focus:ring-0 w-3.5 h-3.5 cursor-pointer" />
        <span>Recordarme</span>
      </label>
      <a href="#" class="text-zinc-500 hover:text-black font-medium transition-colors">¿Olvidaste tu contraseña?</a>
    </div>

    <!-- Botón Principal en Negro Brutalista -->
    <button
      type="submit"
      :disabled="isLoading"
      class="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-black py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-2"
    >
      {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
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