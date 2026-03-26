<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">Webinaires d'orientation</h1>
      <p class="text-gray-500 mt-2">Sessions en ligne pour t'aider à choisir ta voie</p>
    </div>

    <div v-if="loading" class="grid md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="card animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-6">
      <div v-for="w in webinaires" :key="w.id"
        class="card hover:shadow-lg transition-all duration-300 flex flex-col">
        <div class="flex justify-between items-start mb-4">
          <span class="text-xs font-semibold px-3 py-1 rounded-full"
            :class="w.placesRestantes > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
            {{ w.placesRestantes > 0 ? `${w.placesRestantes} places restantes` : 'Complet' }}
          </span>
        </div>

        <h2 class="text-lg font-bold text-gray-900 mb-3">{{ w.titre }}</h2>
        <p class="text-sm text-gray-500 leading-relaxed flex-1 mb-5">{{ w.description }}</p>

        <div class="flex gap-4 text-sm text-gray-500 mb-5 pt-4 border-t border-gray-100">
          <span class="flex items-center gap-1.5">
            📅 {{ formatDate(w.date) }}
          </span>
          <span class="flex items-center gap-1.5">
            🕐 {{ w.heure }}
          </span>
        </div>

        <button
          v-if="w.placesRestantes > 0"
          @click="ouvrirReservation(w)"
          class="btn-primary w-full text-center">
          S'inscrire au webinaire
        </button>
        <button v-else disabled class="btn-secondary w-full opacity-50 cursor-not-allowed">
          Complet
        </button>
      </div>
    </div>

    <!-- Modal réservation -->
    <div v-if="webinaireSelectionne"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="webinaireSelectionne = null">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h3 class="text-xl font-bold text-gray-900 mb-1">Réserver une place</h3>
        <p class="text-sm text-gray-500 mb-6">{{ webinaireSelectionne.titre }}</p>

        <form @submit.prevent="soumettre" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
              <input v-model="form.nom" class="input-field" required placeholder="DUPONT" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
              <input v-model="form.prenom" class="input-field" required placeholder="Jean" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input v-model="form.email" type="email" class="input-field" required placeholder="votre@email.com" />
          </div>

          <div v-if="succes" class="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
            ✅ Réservation confirmée ! Un email vous a été envoyé.
          </div>
          <div v-if="erreur" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {{ erreur }}
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="webinaireSelectionne = null" class="btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" :disabled="loading || succes" class="btn-primary flex-1">
              {{ loading ? 'Envoi...' : 'Confirmer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const webinaires = ref([])
const loading = ref(true)
const webinaireSelectionne = ref(null)
const form = ref({ nom: '', prenom: '', email: '' })
const succes = ref(false)
const erreur = ref('')

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ouvrirReservation(w) {
  webinaireSelectionne.value = w
  succes.value = false
  erreur.value = ''
  form.value = { nom: '', prenom: '', email: '' }
}

async function soumettre() {
  loading.value = true
  erreur.value = ''
  try {
    await api.post(`/webinaires/${webinaireSelectionne.value.id}/reserver`, form.value)
    succes.value = true
    setTimeout(() => { webinaireSelectionne.value = null }, 2000)
  } catch (e) {
    erreur.value = e.response?.data?.message || 'Erreur lors de la réservation'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/webinaires')
    webinaires.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>