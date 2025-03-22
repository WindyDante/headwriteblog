import { createRouter, createWebHistory } from 'vue-router'
import SpaceBlog from '../views/SpaceBlog.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SpaceBlog
    }
  ]
})

export default router