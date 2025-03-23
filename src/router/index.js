import { createRouter, createWebHistory } from 'vue-router'
import SpaceBlog from '@/views/SpaceBlog.vue'
import SpaceBlogContent from '@/components/SpaceBlogContent.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SpaceBlog
    },
    {
      path: '/blog/:id',
      name: 'blog-content',
      component: SpaceBlogContent
    }
  ]
})

export default router