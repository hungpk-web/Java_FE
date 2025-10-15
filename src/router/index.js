import { createRouter, createWebHistory } from 'vue-router'
import ScreenLogin from '../views/ScreenLogin.vue'
import ScreenRegister from '../views/ScreenRegisterUser.vue'
import ScreenList from '../views/ScreenList.vue'
import ScreenRegisterUpdate from '../views/ScreenRegister-Update.vue'
import { useAuth } from '../stores/auth.js'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: ScreenLogin },
    { path: '/register', name: 'register', component: ScreenRegister },
    { 
      path: '/list', 
      name: 'list', 
      component: ScreenList,
      meta: { requiresAuth: true }
    },
    { 
      path: '/student/:id?', 
      name: 'student-edit', 
      component: ScreenRegisterUpdate, 
      props: true,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth()
  checkAuth()
  if (to.meta.requiresAuth) {
    if (isAuthenticated.value) {
      next()
    } else {
      next('/login')
    }
  } else {
    if ((to.name === 'login' || to.name === 'register') && isAuthenticated.value) {
      next('/list')
    } else {
      next()
    }
  }
})

export default router
