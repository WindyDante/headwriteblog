import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import SpaceBlog from '@/views/SpaceBlog.vue'
import SpaceBlogContent from '@/components/SpaceBlogContent.vue'
import Twikoo from '@/components/Twikoo.vue'
import SpaceBlogCategory from '@/components/SpaceBlogCategory.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
    },
    {
      path: '/category/:name',
      name: 'blog-category',
      component: SpaceBlogCategory,
      props: true
    }
  ]
})

export default router