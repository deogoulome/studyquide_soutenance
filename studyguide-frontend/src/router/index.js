import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', component: () => import('../views/auth/RegisterView.vue') },
  { path: '/forgot-password', component: () => import('../views/auth/ForgotPasswordView.vue') },
  { path: '/filieres', component: () => import('../views/FilieresView.vue') },
  { path: '/filieres/:id', component: () => import('../views/FiliereDetailView.vue') },
  { path: '/universites', component: () => import('../views/UniversitesView.vue') },
  { path: '/quiz', component: () => import('../views/QuizView.vue') },
  { path: '/webinaires', component: () => import('../views/WebinairesView.vue') },
  {
    path: '/preinscription',
    component: () => import('../views/PreinscriptionView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profil',
    component: () => import('../views/ProfilView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, requiresRU: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/login')
  if (to.meta.requiresRU && !auth.isRU) return next('/')
  next()
})

export default router