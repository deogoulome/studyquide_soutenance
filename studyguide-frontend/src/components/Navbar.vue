<template>
  <nav class="sticky top-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
      : 'bg-white/70 backdrop-blur-md'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span class="text-white font-black text-sm tracking-tight">SG</span>
          </div>
          <span class="font-bold text-gray-900 text-lg tracking-tight">
            Study<span class="gradient-text">Guide</span>
          </span>
        </router-link>

        <!-- Menu desktop -->
        <div class="hidden md:flex items-center gap-1">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to="/filieres" class="nav-link">Filières</router-link>
          <router-link to="/universites" class="nav-link">Universités</router-link>
          <router-link to="/quiz" class="nav-link">
            <span class="flex items-center gap-1.5">
              Quiz
              <span class="badge bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5">NEW</span>
            </span>
          </router-link>
          <router-link to="/webinaires" class="nav-link">Webinaires</router-link>
          <router-link v-if="auth.isRU" to="/dashboard" class="nav-link">Dashboard</router-link>
        </div>

        <!-- Auth -->
        <div class="flex items-center gap-2">
          <template v-if="auth.isAuthenticated">
            <router-link to="/profil"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
              <div class="w-8 h-8 bg-gradient-to-br from-brand-400 to-violet-500 rounded-full flex items-center justify-center shadow-sm">
                <span class="text-white font-bold text-xs">
                  {{ auth.user?.prenom?.[0] }}{{ auth.user?.nom?.[0] }}
                </span>
              </div>
              <span class="hidden md:block text-sm font-medium text-gray-700">
                {{ auth.user?.prenom }}
              </span>
            </router-link>
            <button @click="handleLogout"
              class="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50">
              Déconnexion
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-ghost text-sm">Connexion</router-link>
            <router-link to="/register" class="btn-primary text-sm py-2">
              S'inscrire gratuitement
            </router-link>
          </template>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function handleLogout() {
  auth.logout()
  router.push('/')
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-lg text-sm font-medium text-gray-600
    hover:text-brand-600 hover:bg-brand-50
    transition-all duration-200;
}
.router-link-active.nav-link {
  @apply text-brand-600 bg-brand-50 font-semibold;
}
</style>