<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">Toutes les filières</h1>
      <p class="text-gray-500 mt-2">{{ filieres.length }} formations disponibles</p>
    </div>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-3 mb-8">
      <button
        v-for="dept in departements" :key="dept"
        @click="filtre = dept"
        :class="filtre === dept
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'"
        class="px-4 py-2 rounded-full border text-sm font-medium transition-all">
        {{ dept }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-100 rounded w-full mb-2"></div>
        <div class="h-3 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Grille filières -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="filiere in filieresFiltrees" :key="filiere.id"
        class="card hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group flex flex-col"
        @click="$router.push(`/filieres/${filiere.id}`)">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold px-3 py-1.5 rounded-full"
            :class="deptColor(filiere.departement?.nom)">
            {{ filiere.departement?.nom }}
          </span>
          <span class="text-xs text-gray-400">{{ filiere.serieBac }}</span>
        </div>
        <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg mb-3">
          {{ filiere.nom }}
        </h3>
        <p class="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {{ filiere.description }}
        </p>
        <div class="mt-5 pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-400 font-medium mb-2">DÉBOUCHÉS</p>
          <p class="text-sm text-gray-600 line-clamp-2">{{ filiere.debouches }}</p>
        </div>
        <div class="mt-4 flex items-center text-sm text-blue-600 font-medium group-hover:gap-2 transition-all">
          Voir les détails
          <span class="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
        </div>
      </div>
    </div>

    <!-- Vide -->
    <div v-if="!loading && filieresFiltrees.length === 0" class="text-center py-16">
      <div class="text-5xl mb-4">🔍</div>
      <p class="text-gray-500">Aucune filière dans ce département.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const filieres = ref([])
const loading = ref(true)
const filtre = ref('Tous')

const departements = computed(() => {
  const noms = [...new Set(filieres.value.map(f => f.departement?.nom).filter(Boolean))]
  return ['Tous', ...noms]
})

const filieresFiltrees = computed(() => {
  if (filtre.value === 'Tous') return filieres.value
  return filieres.value.filter(f => f.departement?.nom === filtre.value)
})

function deptColor(nom) {
  const colors = {
    'Gestion': 'bg-green-50 text-green-700',
    'Informatique': 'bg-blue-50 text-blue-700',
    'Electronique': 'bg-orange-50 text-orange-700',
  }
  return colors[nom] || 'bg-gray-100 text-gray-600'
}

onMounted(async () => {
  try {
    const { data } = await api.get('/filieres')
    filieres.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>