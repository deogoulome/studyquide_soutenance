<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">Nos universités partenaires</h1>
      <p class="text-gray-500 mt-2">Découvrez les établissements disponibles sur la plateforme</p>
    </div>

    <div v-if="loading" class="space-y-6">
      <div v-for="i in 2" :key="i" class="card animate-pulse h-64"></div>
    </div>

    <div v-else class="space-y-10">
      <div v-for="uni in universites" :key="uni.id" class="card hover:shadow-lg transition-all duration-300 overflow-hidden p-0">

        <!-- Banner image université -->
        <div class="relative h-48 overflow-hidden">
          <img
            v-if="uni.image"
            :src="`http://localhost:5000/img/${uni.image.trim()}`"
            :alt="uni.nom"
            class="w-full h-full object-cover"
            @error="e => e.target.style.display='none'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <div class="absolute bottom-4 left-6 flex items-center gap-3">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-brand-600 text-xl shadow-lg">
              {{ uni.nom?.[0] }}
            </div>
            <h2 class="text-xl font-bold text-white">{{ uni.nom }}</h2>
          </div>
        </div>

        <div class="p-6">
          <!-- Description -->
          <p class="text-gray-500 text-sm leading-relaxed mb-6">{{ uni.messagePDG }}</p>

          <!-- Sites -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Sites disponibles
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="site in uni.sites" :key="site.id"
                class="rounded-xl overflow-hidden border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all">
                <!-- Image site -->
                <div class="h-28 bg-gray-100 overflow-hidden">
                  <img
                    v-if="site.image"
                    :src="`http://localhost:5000/img/${site.image.trim()}`"
                    :alt="site.nom"
                    class="w-full h-full object-cover"
                    @error="e => e.target.parentElement.classList.add('bg-brand-50')"
                  />
                  <div v-else class="w-full h-full bg-brand-50 flex items-center justify-center text-brand-300 text-3xl">
                    🏛️
                  </div>
                </div>
                <div class="p-4">
                  <div class="font-semibold text-gray-900 mb-1">{{ site.nom }}</div>
                  <div class="text-sm text-gray-500 mb-1">{{ site.ville }}</div>
                  <div class="text-xs text-gray-400 mb-3 line-clamp-2">{{ site.adresse }}</div>
                  <div v-if="site.filieres?.length" class="flex flex-wrap gap-1">
                    <span v-for="f in site.filieres.slice(0,2)" :key="f.id"
                      class="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                      {{ f.nom?.substring(0, 18) }}...
                    </span>
                    <span v-if="site.filieres.length > 2"
                      class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      +{{ site.filieres.length - 2 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div v-if="uni.documents" class="pt-5 border-t border-gray-100">
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