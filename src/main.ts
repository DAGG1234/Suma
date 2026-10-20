import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'

import './style.css'

const app = createApp(App)

// Usamos 'as any' temporalmente para evitar el conflicto de tipos entre versiones de plugins en TS
app.use(createPinia() as any)
app.use(router as any)

app.mount('#app')