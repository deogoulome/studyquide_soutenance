<template>
  <div class="max-w-3xl mx-auto px-4 py-12">

    <!-- Intro -->
    <div v-if="etape === 'intro'" class="text-center">
      <div class="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
        🧠
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Quiz d'orientation</h1>
      <p class="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        Réponds à quelques questions pour découvrir la filière qui correspond le mieux à ton profil.
      </p>
      <button @click="commencer" class="btn-primary px-10 py-3 text-lg">
        Commencer le quiz
      </button>
    </div>

    <!-- Quiz -->
    <div v-else-if="etape === 'quiz'">
      <!-- Barre de progression -->
      <div class="mb-8">
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {{ indexActuel + 1 }} / {{ questions.length }}</span>
          <span>{{ Math.round(((indexActuel) / questions.length) * 100) }}%</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-blue-600 rounded-full transition-all duration-500"
            :style="`width: ${(indexActuel / questions.length) * 100}%`">
          </div>
        </div>
      </div>

      <!-- Question -->
      <div class="card mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          {{ questionActuelle?.question }}
        </h2>
        <div class="space-y-3">
          <button
            v-for="choix in choix" :key="choix.key"
            @click="repondre(choix.key)"
            :class="reponseSelectionnee === choix.key
              ? 'bg-blue-600 text-white border-blue-600 scale-[1.02]'
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'"
            class="w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium">
            <span class="inline-block w-7 h-7 rounded-full mr-3 text-center text-sm font-bold"
              :class="reponseSelectionnee === choix.key ? 'bg-white/20' : 'bg-gray-100'">
              {{ choix.key.toUpperCase() }}
            </span>
            {{ choix.texte }}
          </button>
        </div>
      </div>

      <div class="flex justify-between">
        <button v-if="indexActuel > 0" @click="precedent" class="btn-secondary">
          ← Précédent
        </button>
        <div></div>
        <button @click="suivant" :disabled="!reponseSelectionnee"
          class="btn-primary disabled:opacity-50">
          {{ indexActuel === questions.length - 1 ? 'Voir les résultats' : 'Suivant →' }}
        </button>
      </div>
    </div>

    <!-- Résultats -->
    <div v-else-if="etape === 'resultat'" class="text-center">
      <div class="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
        🎯
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Ton profil</h1>
      <p class="text-gray-500 mb-8">Voici les filières qui correspondent le mieux à tes réponses</p>

      <div class="space-y-4 mb-8 text-left">
        <div v-for="(item, index) in resultats" :key="item.filiere"
          class="card flex items-center gap-4"
          :class="index === 0 ? 'border-2 border-blue-500 bg-blue-50' : ''">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
            :class="index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'">
            {{ index + 1 }}
          </div>
          <div class="flex-1">
            <div class="font-semibold text-gray-900">{{ item.filiere }}</div>
            <div class="text-sm text-gray-500">Score : {{ item.score }} point(s)</div>
          </div>
          <span v-if="index === 0" class="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
            Recommandé
          </span>
        </div>
      </div>

      <div class="flex gap-4 justify-center flex-wrap">
        <button @click="recommencer" class="btn-secondary">
          Refaire le quiz
        </button>
        <router-link to="/filieres" class="btn-primary">
          Explorer les filières
        </router-link>
      </div>
    </div>

    <!-- Chargement -->
    <div v-else class="text-center py-20">
      <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-500">Chargement...</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../services/api'

const etape = ref('intro')
const questions = ref([])
const indexActuel = ref(0)
const reponses = ref([])
const reponseSelectionnee = ref(null)
const resultats = ref([])

const questionActuelle = computed(() => questions.value[indexActuel.value])

const choix = computed(() => {
  const q = questionActuelle.value
  if (!q) return []
  return [
    { key: 'a', texte: q.choixA },
    { key: 'b', texte: q.choixB },
    { key: 'c', texte: q.choixC },
    { key: 'd', texte: q.choixD },
  ].filter(c => c.texte)
})

async function commencer() {
  etape.value = 'loading'
  try {
    const { data } = await api.get('/quiz')
    questions.value = data
    reponses.value = new Array(data.length).fill(null)
    indexActuel.value = 0
    etape.value = 'quiz'
  } catch (e) {
    console.error(e)
    etape.value = 'intro'
  }
}

function repondre(choix) {
  reponseSelectionnee.value = choix
  reponses.value[indexActuel.value] = {
    questionId: questionActuelle.value.id,
    reponse: choix,
  }
}

function suivant() {
  if (!reponseSelectionnee.value) return
  if (indexActuel.value === questions.value.length - 1) {
    soumettreResultat()
  } else {
    indexActuel.value++
    reponseSelectionnee.value = reponses.value[indexActuel.value]?.reponse || null
  }
}

function precedent() {
  indexActuel.value--
  reponseSelectionnee.value = reponses.value[indexActuel.value]?.reponse || null
}

async function soumettreResultat() {
  etape.value = 'loading'
  try {
    const { data } = await api.post('/quiz/resultat', {
      reponses: reponses.value.filter(Boolean),
    })
    resultats.value = data.scores
    etape.value = 'resultat'
  } catch (e) {
    console.error(e)
    etape.value = 'quiz'
  }
}

function recommencer() {
  etape.value = 'intro'
  reponses.value = []
  indexActuel.value = 0
  reponseSelectionnee.value = null
}
</script>