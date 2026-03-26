<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <button @click="$router.back()" class="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors">
      ← Retour aux filières
    </button>

    <div v-if="loading" class="card animate-pulse space-y-4">
      <div class="h-6 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-100 rounded w-full"></div>
    </div>

    <div v-else-if="filiere">
      <!-- En-tête -->
      <div class="card mb-6 border-l-4 border-l-blue-600">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 mb-3 inline-block">
              {{ filiere.departement?.nom }}
            </span>
            <h1 class="text-2xl font-bold text-gray-900">{{ filiere.nom }}</h1>
            <p class="text-sm text-gray-500 mt-1">Séries acceptées : <strong>{{ filiere.serieBac }}</strong></p>
          </div>
          <router-link to="/preinscription"
            class="btn-primary whitespace-nowrap">
            Se préinscrire
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Description -->
        <div class="card">
          <h2 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-sm">📚</span>
            Description
          </h2>
          <p class="text-gray-600 text-sm leading-relaxed">{{ filiere.description }}</p>
        </div>

        <!-- Matières -->
        <div class="card">
          <h2 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-sm">📖</span>
            Matières
          </h2>
          <div class="flex flex-wrap gap-2">
            <span v-for="matiere in matieres" :key="matiere"
              class="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg font-medium">
              {{ matiere }}
            </span>
          </div>
        </div>

        <!-- Débouchés -->
        <div class="card md:col-span-2">
          <h2 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-7 h-7 bg-yellow-100 rounded-lg flex items-center justify-center text-sm">🎯</span>
            Débouchés professionnels
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="debouche in debouches" :key="debouche"
              class="flex items-start gap-2 text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg">
              <span class="text-yellow-500 mt-0.5">✓</span>
              {{ debouche }}
            </div>
          </div>
        </div>

        <!-- Sites -->
        <div v-if="filiere.sites?.length" class="card md:col-span-2">
          <h2 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center text-sm">🏛️</span>
            Disponible sur ces sites
          </h2>
          <div class="flex flex-wrap gap-3">
            <span v-for="site in filiere.sites" :key="site.id"
              class="px-4 py-2 bg-purple-50 text-purple-700 text-sm rounded-lg font-medium border border-purple-100">
              {{ site.nom }} — {{ site.ville }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const filiere = ref(null)
const loading = ref(true)

const matieres = computed(() =>
  filiere.value?.matieres?.split('\n').map(m => m.trim()).filter(Boolean) || []
)
const debouches = computed(() =>
  filiere.value?.debouches?.split('\n').map(d => d.trim()).filter(Boolean) || []
)

onMounted(async () => {
  try {
    const { data } = await api.get(`/filieres/${route.params.id}`)
    filiere.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>