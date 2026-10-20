<!-- src/views/SettingsView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import Sidebar from '../components/navigation/Sidebar.vue'
import MobileNavbar from '../components/navigation/MobileNavbar.vue'
import SettingsHeader from '../components/settings/SettingsHeader.vue'
import AppearanceSection from '../components/settings/AppearanceSection.vue'
import SecuritySection from '../components/settings/SecuritySection.vue'
import PinConfirmModal from '../components/settings/PinConfirmModal.vue'
import EditProfileModal, { type SecurityAction } from '../components/settings/EditProfileModal.vue'

const FALLBACK_USER_ID = '460940c2-e554-4f1a-a005-4a0187802804'

const userId = ref<string>(FALLBACK_USER_ID)
const userName = ref<string>('Daniel González')
const userEmail = ref<string>('daniel0agg@gmail.com')
const dbPinCode = ref<string>('2006')

const isPinModalOpen = ref<boolean>(false)
const isEditModalOpen = ref<boolean>(false)
const selectedAction = ref<SecurityAction | null>(null)
const pinError = ref<string>('')
const editError = ref<string>('')

const loadUserData = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const activeUser = sessionData?.session?.user

    if (activeUser) {
      userId.value = activeUser.id
      userEmail.value = activeUser.email ?? userEmail.value
    }

    const targetId = activeUser ? activeUser.id : FALLBACK_USER_ID

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, pin_code')
      .eq('id', targetId)
      .maybeSingle()

    if (profile) {
      const firstName = profile.first_name ?? 'Daniel'
      const lastName = profile.last_name ?? 'González'
      userName.value = `${firstName} ${lastName}`.trim()
      dbPinCode.value = profile.pin_code ?? '2006'
    }
  } catch (err) {
    console.error('Error al conectar con Supabase:', err)
  }
}

onMounted(() => {
  loadUserData()
})

const handleSecurityTrigger = (action: SecurityAction) => {
  selectedAction.value = action
  pinError.value = ''
  isPinModalOpen.value = true
}

const handlePinConfirmed = (enteredPin: string) => {
  if (enteredPin === dbPinCode.value) {
    isPinModalOpen.value = false
    pinError.value = ''
    editError.value = ''
    isEditModalOpen.value = true
  } else {
    pinError.value = 'PIN incorrecto. Revisa tu código en Supabase (2006).'
  }
}

const handleSaveProfile = async (payload: {
  type: 'name' | 'email' | 'password' | 'pin'
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  pin?: string
}) => {
  editError.value = ''

  if (payload.type === 'name') {
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: payload.firstName,
        last_name: payload.lastName
      })
      .eq('id', userId.value)

    if (!error) {
      userName.value = `${payload.firstName} ${payload.lastName}`.trim()
      isEditModalOpen.value = false
      selectedAction.value = null
    } else {
      editError.value = error.message
    }
  } else if (payload.type === 'email') {
    const { error } = await supabase.auth.updateUser({
      email: payload.email
    })

    if (!error) {
      if (payload.email) userEmail.value = payload.email
      isEditModalOpen.value = false
      selectedAction.value = null
    } else {
      editError.value = error.message
    }
  } else if (payload.type === 'password') {
    const { error } = await supabase.auth.updateUser({
      password: payload.password
    })

    if (!error) {
      isEditModalOpen.value = false
      selectedAction.value = null
    } else {
      editError.value = error.message
    }
  } else if (payload.type === 'pin') {
    const { error } = await supabase
      .from('profiles')
      .update({ pin_code: payload.pin })
      .eq('id', userId.value)

    if (!error) {
      if (payload.pin) dbPinCode.value = payload.pin
      isEditModalOpen.value = false
      selectedAction.value = null
    } else {
      editError.value = error.message
    }
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white transition-colors duration-200">
    <!-- Sidebar de Escritorio -->
    <Sidebar />

    <!-- Contenido Principal: pl-0 en móvil, lg:pl-64 para respetar la barra fija en escritorio -->
    <main class="w-full min-h-screen lg:pl-64 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-200">
      <div class="w-full max-w-4xl mx-auto space-y-6">
        <SettingsHeader :user-name="userName" />

        <AppearanceSection />

        <SecuritySection
          :user-name="userName"
          :user-email="userEmail"
          @trigger="handleSecurityTrigger"
        />
      </div>
    </main>

    <!-- Navegación Inferior Móvil -->
    <MobileNavbar />

    <!-- Modales -->
    <PinConfirmModal
      :is-open="isPinModalOpen"
      :title="selectedAction?.title"
      :error-message="pinError"
      @close="isPinModalOpen = false"
      @confirm="handlePinConfirmed"
    />

    <EditProfileModal
      :is-open="isEditModalOpen"
      :action="selectedAction"
      :current-name="userName"
      :current-email="userEmail"
      :error-message="editError"
      @close="isEditModalOpen = false"
      @save="handleSaveProfile"
    />
  </div>
</template>