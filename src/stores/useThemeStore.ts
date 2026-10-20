// src/stores/useThemeStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref<boolean>(true)

  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('suma_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('suma_theme', 'light')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('suma_theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      isDarkMode.value = true
    }
    applyTheme()
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }

  return {
    isDarkMode,
    initTheme,
    toggleTheme
  }
})