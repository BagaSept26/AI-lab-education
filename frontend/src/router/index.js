// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // Nanti kita tambahkan rute untuk fitur-fitur lain di sini
    // Contoh:
    // {
    //   path: '/persona-chat',
    //   name: 'personaChat',
    //   component: () => import('../views/PersonaChatView.vue')
    // }
  ]
})

export default router