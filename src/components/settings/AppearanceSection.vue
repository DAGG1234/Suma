<!-- src/components/settings/AppearanceSection.vue -->
<script setup lang="ts">
import { useThemeStore } from '../../stores/useThemeStore'
import SettingsSectionCard from './SettingsSectionCard.vue'
import SettingsToggleItem from './SettingsToggleItem.vue'

const themeStore = useThemeStore()
</script>

<template>
  <SettingsSectionCard title="General">
    <SettingsToggleItem
      :model-value="themeStore.isDarkMode"
      @update:model-value="themeStore.toggleTheme"
      label="Modo Oscuro"
      :subtitle="themeStore.isDarkMode ? 'Interfaz B&W en modo oscuro' : 'Interfaz clara activada'"
    >
      <template #icon>
        <svg v-if="themeStore.isDarkMode" class="w-4 h-4 text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <svg v-else class="w-4 h-4 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </template>
    </SettingsToggleItem>
  </SettingsSectionCard>
</template>