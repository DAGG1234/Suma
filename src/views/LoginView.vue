<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthHeader from '../components/auth/AuthHeader.vue'
import EmailLoginForm from '../components/auth/EmailLoginForm.vue'
import PinLoginForm from '../components/auth/PinLoginForm.vue'

const router = useRouter()
const activeTab = ref<'pin' | 'email'>('pin')

const handleSuccess = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="h-screen w-full bg-white text-zinc-900 flex flex-col justify-between overflow-hidden">
    <AuthHeader title="Iniciar Sesión" />

    <main class="w-full max-w-lg mx-auto px-6 py-2 flex-1 flex flex-col items-center justify-center">
      <div class="w-full text-center md:text-left mb-4">
        <h2 class="text-2xl md:text-3xl font-extrabold text-black tracking-tight">¡Bienvenido de nuevo!</h2>
        <p class="text-xs md:text-sm text-zinc-500 mt-0.5">Ingresa tus datos para acceder a tu cuenta personal</p>
      </div>

      <div class="flex w-full bg-zinc-100 p-1 rounded-xl mb-4 border border-zinc-200">
        <button
          @click="activeTab = 'pin'"
          :class="[
            'flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all',
            activeTab === 'pin' ? 'bg-black text-white shadow' : 'text-zinc-500 hover:text-black'
          ]"
        >
          Acceso por PIN
        </button>
        <button
          @click="activeTab = 'email'"
          :class="[
            'flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all',
            activeTab === 'email' ? 'bg-black text-white shadow' : 'text-zinc-500 hover:text-black'
          ]"
        >
          Acceso por Correo
        </button>
      </div>

      <component
        :is="activeTab === 'pin' ? PinLoginForm : EmailLoginForm"
        @success="handleSuccess"
      />

      <div class="mt-4 text-center text-xs text-zinc-500">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-black font-extrabold underline hover:text-zinc-700 ml-1">
          Regístrate
        </router-link>
      </div>
    </main>
  </div>
</template>