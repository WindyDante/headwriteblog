import { createRouter, createWebHistory } from 'vue-router'
import SpaceBlog from '@/views/SpaceBlog.vue'
import SpaceBlogContent from '@/components/SpaceBlogContent.vue'
import Twikoo from '@/components/Twikoo.vue'

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
    },
    {
      path: '/comments',
      name: 'comments',
      component: Twikoo
    }
  ]
})

export default router