<!-- src/components/settings/EditProfileModal.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'

export interface SecurityAction {
  type: 'name' | 'email' | 'password' | 'pin'
  title: string
}

const props = defineProps<{
  isOpen: boolean
  action: SecurityAction | null
  currentName?: string
  currentEmail?: string
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: {
    type: 'name' | 'email' | 'password' | 'pin'
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    pin?: string
  }): void
}>()

const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const pin = ref<string>('')
const localError = ref<string>('')

watch(() => props.isOpen, (open) => {
  if (open && props.action) {
    localError.value = ''
    if (props.action.type === 'name') {
      const parts = (props.currentName || '').split(' ')
      firstName.value = parts[0] || ''
      lastName.value = parts.slice(1).join(' ') || ''
    } else if (props.action.type === 'email') {
      email.value = props.currentEmail || ''
    } else if (props.action.type === 'password') {
      password.value = ''
      confirmPassword.value = ''
    } else if (props.action.type === 'pin') {
      pin.value = ''
    }
  }
})

const handleSave = () => {
  localError.value = ''
  if (!props.action) return

  if (props.action.type === 'name') {
    if (!firstName.value.trim()) {
      localError.value = 'El nombre no puede estar vacío.'
      return
    }
    emit('save', { type: 'name', firstName: firstName.value.trim(), lastName: lastName.value.trim() })
  } else if (props.action.type === 'email') {
    if (!email.value.includes('@')) {
      localError.value = 'Ingresa un correo electrónico válido.'
      return
    }
    emit('save', { type: 'email', email: email.value.trim() })
  } else if (props.action.type === 'password') {
    if (password.value.length < 6) {
      localError.value = 'La contraseña debe tener al menos 6 caracteres.'
      return
    }
    if (password.value !== confirmPassword.value) {
      localError.value = 'Las contraseñas no coinciden.'
      return
    }
    emit('save', { type: 'password', password: password.value })
  } else if (props.action.type === 'pin') {
    if (pin.value.length !== 4 || !/^\d+$/.test(pin.value)) {
      localError.value = 'El PIN debe ser exactamente de 4 números.'
      return
    }
    emit('save', { type: 'pin', pin: pin.value })
  }
}
</script>

<template>
  <div v-if="isOpen && action" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm">
    <div class="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-900 dark:text-white space-y-4 transition-colors">
      
      <div class="flex items-center justify-between">
        <h3 class="text-base font-black tracking-tight text-zinc-900 dark:text-white">
          Editar {{ action.title }}
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

      <!-- Formulario Nombre -->
      <div v-if="action.type === 'name'" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nombre</label>
          <input
            v-model="firstName"
            type="text"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Apellido</label>
          <input
            v-model="lastName"
            type="text"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      <!-- Formulario Correo -->
      <div v-else-if="action.type === 'email'" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nuevo Correo Electrónico</label>
          <input
            v-model="email"
            type="email"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      <!-- Formulario Contraseña -->
      <div v-else-if="action.type === 'password'" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nueva Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Confirmar Contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      <!-- Formulario PIN -->
      <div v-else-if="action.type === 'pin'" class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Nuevo PIN (4 dígitos)</label>
          <input
            v-model="pin"
            type="password"
            maxlength="4"
            inputmode="numeric"
            class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-center text-lg font-black tracking-widest text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      <p v-if="localError || errorMessage" class="text-xs font-bold text-rose-500 dark:text-rose-400 text-center">
        {{ localError || errorMessage }}
      </p>

      <div class="flex gap-2 pt-2">
        <button
          type="button"
          @click="emit('close')"
          class="flex-1 py-3 rounded-2xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="handleSave"
          class="flex-1 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-black text-xs transition-colors cursor-pointer"
        >
          Guardar
        </button>
      </div>

    </div>
  </div>
</template>