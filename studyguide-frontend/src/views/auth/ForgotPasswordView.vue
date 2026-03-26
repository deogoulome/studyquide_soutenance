<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-white font-bold text-xl">SG</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
        <p class="text-gray-500 mt-1">Entrez votre email pour recevoir un lien de réinitialisation</p>
      </div>

      <div class="card shadow-xl border-0">

        <div v-if="succes" class="text-center py-4">
          <div class="text-5xl mb-4">📧</div>
          <h2 class="text-lg font-bold text-gray-900 mb-2">Email envoyé !</h2>
          <p class="text-gray-500 text-sm mb-6">
            Si cet email existe, vous recevrez un lien de réinitialisation dans quelques minutes.
          </p>
          <router-link to="/login" class="btn-primary w-full block text-center">
            Retour à la connexion
          </router-link>
        </div>

        <form v-else @submit.prevent="envoyer" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
            <input v-model="email" type="email" placeholder="votre@email.com"
              class="input-field" required />
          </div>

          <div v-if="erreur" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {{ erreur }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full py-3">
            {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
          </button>

          <p class="text-center text-sm text-gray-500">
            <router-link to="/login" class="text-blue-600 hover:underline">
              ← Retour à la connexion
            </router-link>
          </p>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../services/api'

const email = ref('')
const loading = ref(false)
const erreur = ref('')
const succes = ref(false)

async function envoyer() {
  loading.value = true
  erreur.value = ''
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    succes.value = true
  } catch (e) {
    erreur.value = e.response?.data?.message || 'Erreur lors de l\'envoi'
  } finally {
    loading.value = false
  }
}
</script>