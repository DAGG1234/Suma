// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'SumaApp Finance Suite',
        short_name: 'SumaApp',
        description: 'Gestor de finanzas personales, deudas y metas',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: '/logoSuma.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logoSuma.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/logoSuma.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})