<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
      <p class="text-gray-500 mt-1">Gestion des préinscriptions — {{ auth.user?.prenom }} {{ auth.user?.nom }}</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card text-center">
        <div class="text-3xl font-bold mb-1" :class="stat.color">{{ stat.value }}</div>
        <div class="text-sm text-gray-500">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button v-for="f in filtres" :key="f.value"
        @click="filtreActif = f.value"
        :class="filtreActif === f.value
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'"
        class="px-4 py-2 rounded-full border text-sm font-medium transition-all">
        {{ f.label }}
        <span class="ml-1.5 px-2 py-0.5 rounded-full text-xs"
          :class="filtreActif === f.value ? 'bg-white/20' : 'bg-gray-100'">
          {{ compter(f.value) }}
        </span>
      </button>
    </div>

    <!-- Tableau -->
    <div class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">Étudiant</th>
              <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">Filière</th>
              <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">Date</th>
              <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">Statut</th>
              <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="loading">
              <td colspan="5" class="text-center py-12 text-gray-400">
                <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Chargement...
              </td>
            </tr>
            <tr v-else-if="preinscriptionsFiltrees.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400">
                Aucune préinscription {{ filtreActif !== 'all' ? `avec ce statut` : '' }}
              </td>
            </tr>
            <tr v-else v-for="p in preinscriptionsFiltrees" :key="p.id"
              class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ p.prenom }} {{ p.nom }}</div>
                <div class="text-sm text-gray-500">{{ p.email }}</div>
                <div class="text-xs text-gray-400">{{ p.telephone }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ p.filiere?.nom }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(p.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-semibold px-3 py-1.5 rounded-full"
                  :class="statutClass(p.status)">
                  {{ statutLabel(p.status) }}
                </span>
              </td>
           <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <button v-if="p.status === 'pending'"
                @click="action(p.id, 'valider')"
                :disabled="actionEnCours === p.id"
                class="text-xs bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                Valider
              </button>
              <button v-if="p.status === 'pending'"
                @click="action(p.id, 'annuler')"
                :disabled="actionEnCours === p.id"
                class="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                Annuler
              </button>
              <!-- Relevé uploadé par l'étudiant -->
                <a v-if="p.imgReleve"
                :href="`http://localhost:5000/uploads/${p.imgReleve}`"
                target="_blank"
                class="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                📎 Relevé
              </a>
              <span v-else class="text-xs text-gray-300 italic">Pas de relevé</span>
            </div>
          </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const auth = useAuthStore()
const preinscriptions = ref([])
const loading = ref(true)
const filtreActif = ref('all')
const actionEnCours = ref(null)

const filtres = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'pending' },
  { label: 'Validées', value: 'validee' },
  { label: 'Annulées', value: 'annulee' },
]

const stats = computed(() => [
  { label: 'Total', value: preinscriptions.value.length, color: 'text-blue-600' },
  { label: 'En attente', value: compter('pending'), color: 'text-yellow-600' },
  { label: 'Validées', value: compter('validee'), color: 'text-green-600' },
  { label: 'Annulées', value: compter('annulee'), color: 'text-red-600' },
])

const preinscriptionsFiltrees = computed(() => {
  if (filtreActif.value === 'all') return preinscriptions.value
  return preinscriptions.value.filter(p => p.status === filtreActif.value)
})

function compter(statut) {
  if (statut === 'all') return preinscriptions.value.length
  return preinscriptions.value.filter(p => p.status === statut).length
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR')
}

function statutClass(s) {
  return {
    pending: 'bg-yellow-50 text-yellow-700',
    validee: 'bg-green-50 text-green-700',
    annulee: 'bg-red-50 text-red-700',
  }[s] || 'bg-gray-100 text-gray-600'
}

function statutLabel(s) {
  return { pending: 'En attente', validee: 'Validée', annulee: 'Annulée' }[s] || s
}

async function action(id, type) {
  actionEnCours.value = id
  try {
    await api.put(`/preinscriptions/${id}/${type}`)
    const p = preinscriptions.value.find(p => p.id === id)
    if (p) p.status = type === 'valider' ? 'validee' : 'annulee'
  } catch (e) {
    console.error(e)
  } finally {
    actionEnCours.value = null
  }
}

onMounted(async () => {
  try {
    const siteId = auth.user?.siteUniversiteId || 1
    const { data } = await api.get(`/preinscriptions/site/${siteId}`)
    preinscriptions.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>