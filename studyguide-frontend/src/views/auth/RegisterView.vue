<template>
  <div class="min-h-screen bg-slate-950 flex overflow-hidden">

    <!-- Gauche décorative -->
    <div class="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-1/3 left-1/4 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow animate-delay-200"></div>
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      <div class="relative text-center max-w-md">
        <div class="text-6xl mb-6 animate-float">🎓</div>
        <h2 class="text-4xl font-black text-white mb-4 leading-tight">
          Rejoins des milliers d'étudiants
        </h2>
        <p class="text-slate-400 text-lg mb-10">Crée ton compte en 2 minutes et trouve ta voie.</p>
        <div class="space-y-3">
          <div v-for="avantage in avantages" :key="avantage"
            class="flex items-center gap-3 text-left bg-white/5 border border-white/10 rounded-xl px-5 py-3">
            <span class="text-green-400 font-bold">✓</span>
            <span class="text-slate-300 text-sm">{{ avantage }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Droite formulaire -->
    <div class="flex-1 lg:max-w-lg flex flex-col justify-center px-8 py-12 bg-white overflow-y-auto">
      <div class="max-w-sm mx-auto w-full">

        <div class="lg:hidden flex items-center gap-2 mb-10">
          <div class="w-9 h-9 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-black text-sm">SG</span>
          </div>
          <span class="font-bold text-gray-900 text-lg">Study<span class="gradient-text">Guide</span></span>
        </div>

        <h1 class="text-3xl font-black text-gray-900 mb-2">Créer un compte</h1>
        <p class="text-gray-500 mb-8">Déjà inscrit ?
          <router-link to="/login" class="text-brand-600 font-semibold hover:underline">Se connecter</router-link>
        </p>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
              <input v-model="form.nom" class="input-field" placeholder="DUPONT" required />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
              <input v-model="form.prenom" class="input-field" placeholder="Jean" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Sexe</label>
            <select v-model="form.sexe" class="input-field" required>
              <option value="">Sélectionner</option>
              <option value="Masculin">Masculin</option>
              <option value="Feminin">Féminin</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="votre@email.com" required />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
            <input v-model="form.telephone" class="input-field" placeholder="+229 00000000" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
            <input v-model="form.motDePasse" type="password" class="input-field" placeholder="Min. 6 caractères" required minlength="6" />
          </div>

          <div v-if="erreur"
            class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <span>⚠️</span> {{ erreur }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full py-3.5 text-base mt-2">
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Créer mon compte →</span>
          </button>

          <p class="text-center text-xs text-gray-400 mt-2">
            En créant un compte, vous acceptez nos conditions d'utilisation.
          </p>
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
const form = ref({ nom: '', prenom: '', sexe: '', email: '', telephone: '', motDePasse: '' })
const loading = ref(false)
const erreur = ref('')

const avantages = [
  'Accès à toutes les filières et universités',
  'Préinscription en ligne simplifiée',
  'Suivi en temps réel de votre dossier',
  'Notifications par email à chaque étape',
]

async function handleRegister() {
  loading.value = true
  erreur.value = ''
  try {
    await auth.register(form.value)
    router.push('/profil')
  } catch (e) {
    erreur.value = e.response?.data?.message || 'Erreur lors de la création du compte'
  } finally {
    loading.value = false
  }
}
</script>