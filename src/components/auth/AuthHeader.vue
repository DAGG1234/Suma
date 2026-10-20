<script setup lang="ts">
import logoSuma from '../../assets/logoSuma.svg'

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="relative w-full bg-zinc-950 text-white pt-6 pb-12 md:pt-8 md:pb-14 px-6 overflow-hidden shrink-0">
    <!-- Logo e Isotipo -->
    <div class="flex flex-col items-center text-center relative z-10 space-y-2">
      <img
        :src="logoSuma"
        alt="SumaApp Isotipo"
        class="w-12 h-12 md:w-14 md:h-14 brightness-0 invert filter drop-shadow-md transition-transform hover:scale-105 shrink-0"
      />
      <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
        {{ title }}
      </h1>
    </div>

    <!-- Onda SVG integrada perfectamente con la tarjeta inferior (blanca) -->
    <div class="absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
      <svg
        class="relative block w-full h-8 md:h-12 text-white fill-current"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z"
        ></path>
      </svg>
    </div>
  </div>
</template>