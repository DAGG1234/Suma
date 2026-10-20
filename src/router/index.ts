// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import SettingsView from '../views/SettingsView.vue'
import AuditView from '../views/AuditView.vue'   // Asegúrate de tener o crear esta vista si la usas
import BalanceView from '../views/BalanceView.vue' // La vista donde montamos nuestro carrusel

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    // Rutas hijas dentro del layout del dashboard para soportar auditoría y balance
    children: [
      {
        path: 'audit',
        name: 'audit',
        component: AuditView,
      },
      {
        path: 'balance',
        name: 'balance',
        component: BalanceView,
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
  },
  // Comodín para redirigir rutas no encontradas al login
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router