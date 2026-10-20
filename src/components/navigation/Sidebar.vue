<!-- src/components/navigation/Sidebar.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import logoSuma from '../../assets/logoSuma.svg'

const route = useRoute()
const { logout } = useAuth()

interface NavItem {
  id: string
  label: string
  path: string
  section: 'menu' | 'apps'
  icon: string
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    section: 'menu',
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
  },
  {
    id: 'audit',
    label: 'Auditoría',
    path: '/dashboard/audit',
    section: 'menu',
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`
  },
  {
    id: 'balance',
    label: 'Balance',
    path: '/dashboard/balance',
    section: 'menu',
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006 000M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006 0M18 7l-3 9m3-9l-6-2m0-2v2m0 16V5"/></svg>`
  },
  {
    id: 'settings',
    label: 'Configuración',
    path: '/settings',
    section: 'apps',
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
  }
]

const menuItems = computed(() => navItems.filter((i) => i.section === 'menu'))
const appsItems = computed(() => navItems.filter((i) => i.section === 'apps'))

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 bg-white border-r border-zinc-200 dark:bg-zinc-950 dark:border-zinc-900 p-5 justify-between transition-colors duration-200">
    <div>
      <!-- Brand / Isotipo Logo -->
      <div class="flex items-center gap-3 px-3 py-2 mb-8">
        <img
          :src="logoSuma"
          alt="SumaApp Isotipo"
          class="w-10 h-10 transition-transform hover:scale-105 shrink-0 dark:brightness-0 dark:invert"
        />
        <div>
          <span class="text-xl font-black tracking-wider text-zinc-900 dark:text-zinc-100 block leading-none transition-colors">
            SumaApp
          </span>
          <span class="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
            Finance Suite
          </span>
        </div>
      </div>

      <!-- Sección Menú Principal -->
      <div class="mb-6">
        <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-3 mb-2 block">
          Menú
        </span>
        <div class="space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.id"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200 group',
              isActive(item.path)
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
            ]"
          >
            <span v-html="item.icon" class="shrink-0 transition-transform group-hover:scale-110"></span>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>

      <!-- Sección Apps -->
      <div>
        <span class="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-3 mb-2 block">
          Apps
        </span>
        <div class="space-y-1">
          <router-link
            v-for="item in appsItems"
            :key="item.id"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200 group',
              isActive(item.path)
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
            ]"
          >
            <span v-html="item.icon" class="shrink-0 transition-transform group-hover:scale-110"></span>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Botón Cerrar Sesión -->
    <div class="pt-4 border-t border-zinc-200 dark:border-zinc-900 transition-colors">
      <button
        @click="logout"
        class="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-zinc-100 border border-zinc-200 text-red-600 hover:bg-red-500/10 dark:bg-zinc-900 dark:border-zinc-800 dark:text-red-400 font-bold text-xs transition-all cursor-pointer"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>