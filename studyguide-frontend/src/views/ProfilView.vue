<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Carte profil -->
      <div class="lg:col-span-1">
        <div class="card text-center">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {{ auth.user?.prenom?.[0] }}{{ auth.user?.nom?.[0] }}
          </div>
          <h2 class="text-xl font-bold text-gray-900">
            {{ auth.user?.prenom }} {{ auth.user?.nom }}
          </h2>
          <p class="text-gray-500 text-sm mt-1">{{ auth.user?.email }}</p>
          <span class="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full"
            :class="auth.user?.role === 'ru' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
            {{ auth.user?.role === 'ru' ? 'Responsable Universitaire' : 'Apprenant' }}
          </span>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Onglets -->
        <div class="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button v-for="tab in tabs" :key="tab.id"
            @click="tabActif = tab.id"
            :class="tabActif === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all">
            {{ tab.label }}
          </button>
        </div>

        <!-- Mes préinscriptions -->
        <div v-if="tabActif === 'preinscriptions'">
          <div v-if="loadingPre" class="space-y-3">
            <div v-for="i in 3" :key="i" class="card animate-pulse h-20"></div>
          </div>
          <div v-else-if="preinscriptions.length === 0" class="card text-center py-12">
            <div class="text-4xl mb-3">📋</div>
            <p class="text-gray-500 mb-4">Aucune préinscription pour le moment</p>
            <router-link to="/preinscription" class="btn-primary">
              Faire une préinscription
            </router-link>
          </div>
          <div v-else class="space-y-4">
            <div v-for="p in preinscriptions" :key="p.id"
              class="card hover:shadow-md transition-all">
              <div class="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ p.filiere?.nom }}</h3>
                  <p class="text-sm text-gray-500 mt-0.5">{{ p.site?.nom }} — {{ p.site?.ville }}</p>
                  <p class="text-xs text-gray-400 mt-1">
                    Soumis le {{ formatDate(p.createdAt) }}
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-semibold px-3 py-1.5 rounded-full"
                    :class="statutClass(p.status)">
                    {{ statutLabel(p.status) }}
                  </span>
                  <a v-if="p.imgReleve"
                    :href="`http://localhost:5000/uploads/${p.imgReleve}`"
                    target="_blank"
                    class="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
                    📎 Mon relevé
                  </a>
                  <!-- Fiche de préinscription PDF -->
                  <button @click="telechargerPDF(p.id)"
                    class="text-xs text-violet-600 hover:underline font-medium flex items-center gap-1">
                    📄 Fiche PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modifier le profil -->
        <div v-if="tabActif === 'profil'">
          <div class="card">
            <h3 class="font-bold text-gray-900 mb-6">Modifier mes informations</h3>
            <form @submit.prevent="sauvegarder" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                  <input v-model="editForm.nom" class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                  <input v-model="editForm.prenom" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                <input v-model="editForm.telephone" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
                <input v-model="editForm.adresse" class="input-field" />
              </div>
              <div v-if="succes" class="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                ✅ Profil mis à jour avec succès
              </div>
              <button type="submit" :disabled="loading" class="btn-primary">
                {{ loading ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Changer mot de passe -->
        <div v-if="tabActif === 'securite'">
          <div class="card">
            <h3 class="font-bold text-gray-900 mb-6">Changer le mot de passe</h3>
            <form @submit.prevent="changerMdp" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Ancien mot de passe</label>
                <input v-model="mdpForm.ancien" type="password" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
                <input v-model="mdpForm.nouveau" type="password" class="input-field" required minlength="6" />
              </div>
              <div v-if="erreurMdp" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {{ erreurMdp }}
              </div>
              <div v-if="succesMdp" class="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                ✅ Mot de passe modifié avec succès
              </div>
              <button type="submit" :disabled="loadingMdp" class="btn-primary">
                {{ loadingMdp ? 'Modification...' : 'Changer le mot de passe' }}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const auth = useAuthStore()
const tabActif = ref('preinscriptions')
const tabs = [
  { id: 'preinscriptions', label: 'Mes préinscriptions' },
  { id: 'profil', label: 'Mon profil' },
  { id: 'securite', label: 'Sécurité' },
]

const preinscriptions = ref([])
const loadingPre = ref(true)
const loading = ref(false)
const succes = ref(false)
const loadingMdp = ref(false)
const erreurMdp = ref('')
const succesMdp = ref(false)

const editForm = ref({
  nom: auth.user?.nom || '',
  prenom: auth.user?.prenom || '',
  telephone: auth.user?.telephone || '',
  adresse: auth.user?.adresse || '',
})

const mdpForm = ref({ ancien: '', nouveau: '' })

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

async function sauvegarder() {
  loading.value = true
  succes.value = false
  try {
    await api.put('/auth/profile', editForm.value)
    await auth.fetchMe()
    succes.value = true
    setTimeout(() => succes.value = false, 3000)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function changerMdp() {
  loadingMdp.value = true
  erreurMdp.value = ''
  succesMdp.value = false
  try {
    await api.put('/auth/change-password', {
      ancienMotDePasse: mdpForm.value.ancien,
      nouveauMotDePasse: mdpForm.value.nouveau,
    })
    succesMdp.value = true
    mdpForm.value = { ancien: '', nouveau: '' }
    setTimeout(() => succesMdp.value = false, 3000)
  } catch (e) {
    erreurMdp.value = e.response?.data?.message || 'Erreur lors du changement'
  } finally {
    loadingMdp.value = false
  }
}
async function telechargerPDF(id) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:5000/api/preinscriptions/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Erreur PDF')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch (e) {
    console.error('Erreur PDF:', e)
    alert('Impossible de générer le PDF')
  }
}



onMounted(async () => {
  try {
    const { data } = await api.get('/preinscriptions/mes')
    preinscriptions.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loadingPre.value = false
  }
})
</script>