import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component:()=> import("@/views/Home.vue"),
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
