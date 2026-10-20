<!-- src/components/settings/SecuritySection.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import SettingsSectionCard from './SettingsSectionCard.vue'
import SettingsItem from './SettingsItem.vue'

type SecurityActionType = 'name' | 'email' | 'password' | 'pin'

interface SecurityItem {
  type: SecurityActionType
  title: string
  value: string
}

const props = withDefaults(defineProps<{
  userName?: string
  userEmail?: string
}>(), {
  userName: 'Daniel Gonzalez',
  userEmail: 'daniel@example.com'
})

const emit = defineEmits<{
  (e: 'trigger', action: { type: SecurityActionType; title: string }): void
}>()

const securityItems = computed<SecurityItem[]>(() => [
  { type: 'name', title: 'Nombre de usuario', value: props.userName },
  { type: 'email', title: 'Correo electrónico', value: props.userEmail },
  { type: 'password', title: 'Contraseña', value: '••••••••' },
  { type: 'pin', title: 'PIN de Seguridad', value: 'Configurado' }
])
</script>

<template>
  <SettingsSectionCard title="Seguridad">
    <SettingsItem
      v-for="item in securityItems"
      :key="item.type"
      :label="item.title"
      :value="item.value"
      @click="emit('trigger', { type: item.type, title: item.title })"
    >
      <template #icon>
        <svg v-if="item.type === 'name'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>

        <svg v-else-if="item.type === 'email'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>

        <svg v-else-if="item.type === 'password'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
        </svg>

        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </template>
    </SettingsItem>
  </SettingsSectionCard>
</template>