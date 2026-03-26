<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Préinscription en ligne</h1>
      <p class="text-gray-500 mt-2">Remplissez le formulaire pour soumettre votre demande</p>
    </div>

    <!-- Étapes -->
    <div class="flex items-center gap-2 mb-10">
      <div v-for="(s, i) in etapes" :key="i" class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            :class="etapeActuelle > i
              ? 'bg-green-500 text-white'
              : etapeActuelle === i
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-400'">
            {{ etapeActuelle > i ? '✓' : i + 1 }}
          </div>
          <span class="text-sm font-medium hidden sm:block"
            :class="etapeActuelle === i ? 'text-blue-600' : 'text-gray-400'">
            {{ s }}
          </span>
        </div>
        <div v-if="i < etapes.length - 1" class="flex-1 h-px bg-gray-200 w-8 mx-2"></div>
      </div>
    </div>

    <div class="card shadow-lg">

      <!-- Étape 1 : Infos personnelles -->
      <div v-if="etapeActuelle === 0">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Informations personnelles</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
              <input v-model="form.nom" class="input-field" placeholder="DUPONT" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
              <input v-model="form.prenom" class="input-field" placeholder="Jean" required />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Sexe *</label>
            <select v-model="form.sexe" class="input-field" required>
              <option value="">Sélectionner</option>
              <option value="Masculin">Masculin</option>
              <option value="Feminin">Féminin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="votre@email.com" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
            <input v-model="form.telephone" class="input-field" placeholder="+229 00000000" />
          </div>
        </div>
      </div>

      <!-- Étape 2 : Choix académique -->
      <div v-if="etapeActuelle === 1">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Choix académique</h2>
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Filière souhaitée *</label>
            <select v-model="form.filiereId" class="input-field" required>
              <option value="">Sélectionner une filière</option>
              <option v-for="f in filieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Site universitaire *</label>
            <select v-model="form.siteUniversiteId" class="input-field" required>
              <option value="">Sélectionner un site</option>
              <option v-for="s in sitesFiltres" :key="s.id" :value="s.id">
                {{ s.nom }} — {{ s.ville }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Motivation</label>
            <textarea v-model="form.description" class="input-field min-h-24 resize-none"
              placeholder="Pourquoi cette filière ?"></textarea>
          </div>
        </div>
      </div>

      <!-- Étape 3 : Documents -->
      <div v-if="etapeActuelle === 2">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Document requis</h2>
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Relevé de notes (JPG, PNG ou PDF — max 5Mo)
            </label>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors cursor-pointer"
              @click="$refs.fileInput.click()">
              <div v-if="!fichierNom">
                <div class="text-4xl mb-3">📎</div>
                <p class="text-gray-500 text-sm">Cliquez pour sélectionner un fichier</p>
              </div>
              <div v-else class="flex items-center justify-center gap-3 text-green-600">
                <span class="text-2xl">✅</span>
                <span class="font-medium text-sm">{{ fichierNom }}</span>
              </div>
            </div>
            <input ref="fileInput" type="file" class="hidden"
              accept="image/*,.pdf" @change="handleFile" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Note complémentaire</label>
            <textarea v-model="form.descriptUni" class="input-field min-h-20 resize-none"
              placeholder="Informations supplémentaires..."></textarea>
          </div>
        </div>
      </div>

      <!-- Succès -->
      <div v-if="etapeActuelle === 3" class="text-center py-8">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          🎉
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Préinscription envoyée !</h2>
        <p class="text-gray-500 mb-6 max-w-md mx-auto">
          Votre demande a été soumise avec succès. Vous recevrez un email de confirmation et serez notifié(e) de l'avancement.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <router-link to="/profil" class="btn-primary">Voir mes préinscriptions</router-link>
          <router-link to="/" class="btn-secondary">Retour à l'accueil</router-link>
        </div>
      </div>

      <!-- Erreur -->
      <div v-if="erreur" class="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
        {{ erreur }}
      </div>

      <!-- Navigation -->
      <div v-if="etapeActuelle < 3" class="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button v-if="etapeActuelle > 0" @click="etapeActuelle--" class="btn-secondary">
          ← Précédent
        </button>
        <div v-else></div>
        <button v-if="etapeActuelle < 2" @click="suivant" class="btn-primary">
          Suivant →
        </button>
        <button v-else @click="soumettre" :disabled="loading" class="btn-primary">
          {{ loading ? 'Envoi en cours...' : 'Soumettre ma demande' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const etapeActuelle = ref(0)
const etapes = ['Informations', 'Choix académique', 'Documents']
const filieres = ref([])
const sites = ref([])
const loading = ref(false)
const erreur = ref('')
const fichierNom = ref('')
const fichier = ref(null)

const form = ref({
  nom: '', prenom: '', sexe: '', email: '', telephone: '',
  filiereId: '', siteUniversiteId: '', description: '', descriptUni: '',
})

const sitesFiltres = computed(() => {
  if (!form.value.filiereId) return sites.value
  const filiere = filieres.value.find(f => f.id === Number(form.value.filiereId))
  if (!filiere?.sites?.length) return sites.value
  const siteIds = filiere.sites.map(s => s.id)
  return sites.value.filter(s => siteIds.includes(s.id))
})

function handleFile(e) {
  const f = e.target.files[0]
  if (!f) return
  fichier.value = f
  fichierNom.value = f.name
}

function suivant() {
  erreur.value = ''
  if (etapeActuelle.value === 0) {
    if (!form.value.nom || !form.value.prenom || !form.value.sexe || !form.value.email) {
      erreur.value = 'Veuillez remplir tous les champs obligatoires.'
      return
    }
  }
  if (etapeActuelle.value === 1) {
    if (!form.value.filiereId || !form.value.siteUniversiteId) {
      erreur.value = 'Veuillez sélectionner une filière et un site.'
      return
    }
  }
  etapeActuelle.value++
}

async function soumettre() {
  loading.value = true
  erreur.value = ''
  try {
    const formData = new FormData()
    Object.entries(form.value).forEach(([k, v]) => formData.append(k, v))
    if (fichier.value) formData.append('releve', fichier.value)
    await api.post('/preinscriptions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    etapeActuelle.value = 3
  } catch (e) {
    erreur.value = e.response?.data?.message || 'Erreur lors de la soumission'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const [f, s] = await Promise.all([api.get('/filieres'), api.get('/universites/sites')])
    filieres.value = f.data
    sites.value = s.data
  } catch (e) {
    console.error(e)
  }
})
</script>