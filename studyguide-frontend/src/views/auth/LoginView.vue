<template>
  <div class="min-h-screen bg-slate-950 flex overflow-hidden">

    <!-- Panneau gauche décoratif -->
    <div class="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow animate-delay-300"></div>
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      <div class="relative text-center max-w-md">
        <div class="w-20 h-20 bg-gradient-to-br from-brand-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-lg animate-float">
          <span class="text-white font-black text-3xl">SG</span>
        </div>
        <h2 class="text-4xl font-black text-white mb-4 leading-tight">
          Bienvenue sur <span class="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">StudyGuide</span>
        </h2>
        <p class="text-slate-400 text-lg">La plateforme qui t'aide à choisir ton avenir académique.</p>
        <div class="mt-10 grid grid-cols-2 gap-4">
          <div v-for="s in sideStats" :key="s.label"
            class="bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
            <div class="text-2xl font-black text-white mb-1">{{ s.value }}</div>
            <div class="text-slate-400 text-sm">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panneau droit — formulaire -->
    <div class="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12 bg-white">
      <div class="max-w-sm mx-auto w-full">

        <!-- Logo mobile -->
        <div class="lg:hidden flex items-center gap-2 mb-10">
          <div class="w-9 h-9 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-black text-sm">SG</span>
          </div>
          <span class="font-bold text-gray-900 text-lg">Study<span class="gradient-text">Guide</span></span>
        </div>

        <h1 class="text-3xl font-black text-gray-900 mb-2">Connexion</h1>
        <p class="text-gray-500 mb-8">Pas encore de compte ?
          <router-link to="/register" class="text-brand-600 font-semibold hover:underline">S'inscrire</router-link>
        </p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" placeholder="votre@email.com"
              class="input-field text-base" required />
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold text-gray-700">Mot de passe</label>
              <router-link to="/forgot-password" class="text-xs text-brand-600 hover:underline font-medium">
                Oublié ?
              </router-link>
            </div>
            <div class="relative">
              <input v-model="form.motDePasse" :type="showPwd ? 'text' : 'password'"
                placeholder="••••••••" class="input-field text-base pr-12" required />
              <button type="button" @click="showPwd = !showPwd"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                {{ showPwd ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div v-if="erreur"
            class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <span>⚠️</span> {{ erreur }}
          </div>

          <button type="submit" :disabled="loading"
            class="btn-primary w-full py-3.5 text-base mt-2">
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Se connecter →</span>
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ email: '', motDePasse: '' })
const loading = ref(false)
const erreur = ref('')
const showPwd = ref(false)

const sideStats = [
  { value: '7+', label: 'Filières' },
  { value: '2', label: 'Universités' },
  { value: '3', label: 'Sites' },
  { value: '100%', label: 'Gratuit' },
]

async function handleLogin() {
  loading.value = true
  erreur.value = ''
  try {
    await auth.login(form.value.email, form.value.motDePasse)
    router.push(auth.isRU ? '/dashboard' : '/profil')
  } catch (e) {
    erreur.value = e.response?.data?.message || 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>