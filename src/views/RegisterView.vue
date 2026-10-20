<script setup lang="ts">
import { useRouter } from 'vue-router'
import AuthHeader from '../components/auth/AuthHeader.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const router = useRouter()

const handleSuccess = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="h-screen w-full bg-white text-zinc-900 flex flex-col justify-between overflow-hidden">
    <AuthHeader title="Crear Cuenta" />

    <main class="w-full max-w-xl mx-auto px-6 py-2 flex-1 flex flex-col items-center justify-center">
      <div class="w-full text-center md:text-left mb-4">
        <h2 class="text-2xl md:text-3xl font-extrabold text-black tracking-tight">¡Hola, Bienvenido!</h2>
        <p class="text-xs md:text-sm text-zinc-500 mt-0.5">Completa tus datos para registrarte en SumaApp</p>
      </div>

      <RegisterForm @success="handleSuccess" />

      <div class="mt-4 text-center text-xs text-zinc-500">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-black font-extrabold underline hover:text-zinc-700 ml-1">
          Inicia Sesión
        </router-link>
      </div>
    </main>
  </div>
</template>