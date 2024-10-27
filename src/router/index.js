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
    {
      path: '/sign',
      name: 'sign',
      component: () => import('../views/SignView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/add',
      name: 'addTask',
      component: () => import('../views/CreateTaskView.vue')
    },
    {
      path: '/task/:id',
      name: 'updateTask',
      component: () => import('../views/CreateTaskView.vue'),
      props: route => ({ id: route.params.id, ...route.params })
    },
  ]
})

export default router
