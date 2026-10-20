<!-- src/components/settings/SettingsHeader.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../../services/supabase'

const route = useRoute()
const fullName = ref<string>('Daniel González')

const panelTitle = computed(() => {
  const path = route.path
  if (path.includes('/audit')) return 'Auditoría'
  if (path.includes('/balance')) return 'Balance'
  if (path.includes('/settings')) return 'Configuración'
  return 'Dashboard'
})

const fetchUserProfile = async () => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', currentUser.id)
      .maybeSingle()

    if (profile) {
      const first = profile.first_name || ''
      const last = profile.last_name || ''
      if (first || last) fullName.value = `${first} ${last}`.trim()
    }
  } catch (err) {
    console.error(err)
  }
}

const subtitle = computed(() => {
  return `Ajustes y preferencias de la cuenta de ${fullName.value}`
})

onMounted(fetchUserProfile)
</script>

<template>
  <header class="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 mb-2 border-b border-zinc-200 dark:border-zinc-800/80 gap-2 transition-colors duration-200">
    <div class="flex flex-col">
      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors">
        {{ panelTitle }}
      </h1>
      <span class="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors">
        {{ subtitle }}
      </span>
    </div>
  </header>
</template>