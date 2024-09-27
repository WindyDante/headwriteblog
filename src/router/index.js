import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component:Home,
      children:[
        {
          path:'/',
          name:'main',
          component:()=>import("@/components/Main.vue")
        },
         {
          path:'/life',
          name:'life',
          component:()=>import("@/views/Life.vue")
      },
      {
          path:'/messageBoard',
          name:'messageBoard',
          component:()=>import("@/views/MessageBoard.vue")
      },
     {
          path:"/friends",
          name:"friends",
          component:()=>import("@/views/FriendLinks.vue")
     } 
      ]
    }
   
  ]
})

export default router
