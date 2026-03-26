<template>
  <div class="overflow-hidden">

    <!-- HERO -->
    <section class="relative min-h-screen flex items-center bg-slate-950 overflow-hidden">
      <!-- Fond animé -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow animate-delay-300"></div>
        <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow animate-delay-500"></div>
        <!-- Grille -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
        <div class="max-w-4xl mx-auto text-center">

          <!-- Badge -->
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white/80 text-sm px-4 py-2 rounded-full mb-8 animate-fade-in">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Plateforme d'orientation universitaire au Bénin
          </div>

          <!-- Titre -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6 animate-fade-up">
            Trouve ta
            <span class="bg-gradient-to-r from-brand-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              filière idéale
            </span>
            dès aujourd'hui
          </h1>

          <p class="text-slate-400 text-xl mb-10 max-w-2xl mx-auto animate-fade-up animate-delay-100">
            Explore les filières, compare les universités et préinscris-toi en ligne en quelques minutes.
          </p>

          <!-- CTA -->
          <div class="flex flex-wrap gap-4 justify-center animate-fade-up animate-delay-200">
            <router-link to="/filieres"
              class="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-glow hover:shadow-glow-lg hover:-translate-y-1 text-lg">
              Explorer les filières
              <span>→</span>
            </router-link>
            <router-link to="/quiz"
              class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 text-lg">
              Faire le quiz
              <span class="text-yellow-400">✦</span>
            </router-link>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-up animate-delay-300">
            <div v-for="stat in stats" :key="stat.label"
              class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300">
              <div class="text-3xl font-black text-white mb-1">{{ stat.value }}</div>
              <div class="text-slate-400 text-sm">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs animate-bounce">
        <span>Défiler</span>
        <div class="w-5 h-8 border-2 border-slate-600 rounded-full flex items-start justify-center pt-1.5">
          <div class="w-1 h-2 bg-slate-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>

    <!-- FONCTIONNALITÉS -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <span class="badge bg-brand-50 text-brand-600 mb-4">Fonctionnalités</span>
          <h2 class="section-title">Tout ce dont tu as besoin</h2>
          <p class="section-sub mx-auto">Une plateforme complète pour t'aider à choisir et t'inscrire dans la meilleure formation.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(feature, i) in features" :key="feature.title"
            class="group relative p-8 rounded-3xl border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 cursor-pointer overflow-hidden"
            @click="$router.push(feature.link)">
            <!-- Fond hover -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              :class="feature.gradientBg"></div>
            <div class="relative">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 group-hover:scale-110"
                :class="feature.iconBg">
                {{ feature.icon }}
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                {{ feature.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                {{ feature.desc }}
              </p>
              <div class="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-500 group-hover:text-white transition-colors duration-300">
                En savoir plus <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FILIÈRES -->
    <section class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span class="badge bg-green-50 text-green-600 mb-3">Formations</span>
            <h2 class="section-title">Filières populaires</h2>
          </div>
          <router-link to="/filieres" class="btn-secondary self-start md:self-auto">
            Voir toutes les filières →
          </router-link>
        </div>

        <div v-if="loadingFilieres" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="card animate-pulse h-48"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="filiere in filieres.slice(0,6)" :key="filiere.id"
            class="card-hover group"
            @click="$router.push(`/filieres/${filiere.id}`)">
            <div class="flex items-start justify-between mb-4">
              <span class="badge" :class="deptBadge(filiere.departement?.nom)">
                {{ filiere.departement?.nom }}
              </span>
              <span class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">→</span>
            </div>
            <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-brand-600 transition-colors leading-snug">
              {{ filiere.nom }}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed line-clamp-2">{{ filiere.description }}</p>
            <div class="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400 font-medium">
              Séries : {{ filiere.serieBac }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WEBINAIRES -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span class="badge bg-purple-50 text-purple-600 mb-3">Événements</span>
            <h2 class="section-title">Prochains webinaires</h2>
          </div>
          <router-link to="/webinaires" class="btn-secondary self-start md:self-auto">
            Voir tous →
          </router-link>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="w in webinaires.slice(0,2)" :key="w.id"
            class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            @click="$router.push('/webinaires')">
            <div class="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
            <div class="relative">
              <div class="flex justify-between items-start mb-4">
                <span class="badge bg-white/10 text-white/80 border border-white/10">
                  {{ formatDate(w.date) }}
                </span>
                <span class="badge"
                  :class="w.placesRestantes > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
                  {{ w.placesRestantes > 0 ? `${w.placesRestantes} places` : 'Complet' }}
                </span>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">{{ w.titre }}</h3>
              <p class="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6">{{ w.description }}</p>
              <div class="flex items-center gap-3">
                <span class="text-slate-400 text-sm">🕐 {{ w.heure }}</span>
                <span class="ml-auto text-brand-400 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block">
                  S'inscrire →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="py-24 bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 relative overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div class="relative max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
          Prêt à démarrer ton avenir ?
        </h2>
        <p class="text-blue-100 text-xl mb-10">
          Rejoins des centaines d'étudiants qui ont trouvé leur voie grâce à StudyGuide.
        </p>
        <router-link to="/register"
          class="inline-flex items-center gap-3 bg-white text-brand-700 font-black px-10 py-5 rounded-2xl hover:bg-blue-50 transition-all duration-200 shadow-2xl hover:-translate-y-1 text-lg">
          Commencer gratuitement
          <span>→</span>
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const filieres = ref([])
const webinaires = ref([])
const loadingFilieres = ref(true)

const stats = [
  { value: '7+', label: 'Filières disponibles' },
  { value: '2', label: 'Universités partenaires' },
  { value: '3', label: 'Sites universitaires' },
  { value: '100%', label: 'Gratuit' },
]

const features = [
  {
    icon: '🎓', title: 'Explorer les filières',
    desc: 'Découvre toutes les formations avec leurs débouchés et matières requises.',
    link: '/filieres', iconBg: 'bg-blue-50',
    gradientBg: 'bg-gradient-to-br from-blue-600 to-blue-700',
  },
  {
    icon: '🏛️', title: 'Choisir son université',
    desc: 'Compare les établissements et leurs sites pour faire le meilleur choix.',
    link: '/universites', iconBg: 'bg-violet-50',
    gradientBg: 'bg-gradient-to-br from-violet-600 to-violet-700',
  },
  {
    icon: '📝', title: 'Préinscription en ligne',
    desc: 'Soumets ta candidature directement depuis la plateforme, en quelques clics.',
    link: '/preinscription', iconBg: 'bg-green-50',
    gradientBg: 'bg-gradient-to-br from-green-600 to-emerald-700',
  },
  {
    icon: '🧠', title: 'Quiz d\'orientation',
    desc: 'Découvre la filière qui correspond à ton profil grâce à notre quiz intelligent.',
    link: '/quiz', iconBg: 'bg-yellow-50',
    gradientBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
  },
  {
    icon: '📡', title: 'Webinaires',
    desc: 'Participe à des sessions d\'orientation animées par des experts.',
    link: '/webinaires', iconBg: 'bg-purple-50',
    gradientBg: 'bg-gradient-to-br from-purple-600 to-pink-600',
  },
  {
    icon: '📊', title: 'Suivi en temps réel',
    desc: 'Suis le statut de ta préinscription depuis ton espace personnel.',
    link: '/profil', iconBg: 'bg-cyan-50',
    gradientBg: 'bg-gradient-to-br from-cyan-600 to-teal-700',
  },
]

function deptBadge(nom) {
  return {
    'Gestion': 'bg-emerald-50 text-emerald-700',
    'Informatique': 'bg-blue-50 text-blue-700',
    'Electronique': 'bg-orange-50 text-orange-700',
  }[nom] || 'bg-gray-100 text-gray-600'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

onMounted(async () => {
  try {
    const [f, w] = await Promise.all([api.get('/filieres'), api.get('/webinaires')])
    filieres.value = f.data
    webinaires.value = w.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingFilieres.value = false
  }
})
</script>