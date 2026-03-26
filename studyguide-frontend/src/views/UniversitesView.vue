<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">Nos universités partenaires</h1>
      <p class="text-gray-500 mt-2">Découvrez les établissements disponibles sur la plateforme</p>
    </div>

    <div v-if="loading" class="space-y-6">
      <div v-for="i in 2" :key="i" class="card animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>

    <div v-else class="space-y-10">
      <div v-for="uni in universites" :key="uni.id" class="card hover:shadow-lg transition-all duration-300">
        <!-- Header université -->
        <div class="flex flex-col md:flex-row md:items-start gap-6 mb-6 pb-6 border-b border-gray-100">
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {{ uni.nom?.[0] }}
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-gray-900 mb-2">{{ uni.nom }}</h2>
            <p class="text-gray-500 text-sm leading-relaxed line-clamp-3">{{ uni.messagePDG }}</p>
          </div>
        </div>

        <!-- Sites -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Sites disponibles
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="site in uni.sites" :key="site.id"
              class="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
              <div class="font-semibold text-gray-900 mb-1">{{ site.nom }}</div>
              <div class="text-sm text-gray-500 mb-3">{{ site.ville }}</div>
              <div class="text-xs text-gray-400 mb-3">{{ site.adresse }}</div>
              <div v-if="site.filieres?.length" class="flex flex-wrap gap-1">
                <span v-for="f in site.filieres.slice(0,3)" :key="f.id"
                  class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {{ f.nom?.substring(0, 20) }}...
                </span>
                <span v-if="site.filieres.length > 3"
                  class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  +{{ site.filieres.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div v-if="uni.documents" class="mt-6 pt-6 border-t border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Documents délivrés
          </h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="doc in formatDocuments(uni.documents)" :key="doc"
              class="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
              {{ doc }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const universites = ref([])
const loading = ref(true)

function formatDocuments(docs) {
  return docs?.split('\n').map(d => d.trim()).filter(Boolean) || []
}

onMounted(async () => {
  try {
    const { data } = await api.get('/universites')
    universites.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>