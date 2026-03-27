require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')

const { sequelize } = require('./models')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 5000

// ─── SÉCURITÉ ────────────────────────────────────────────
app.use(helmet())
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
// }))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Ajoute ces headers pour les fichiers statiques
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

// ─── MIDDLEWARES ─────────────────────────────────────────
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use('/img', express.static(path.join(__dirname, '..', 'img')))

// ─── ROUTES ──────────────────────────────────────────────
app.use('/api', routes)

// Route de santé
app.get('/health', (req, res) => res.json({ status: 'OK', env: process.env.NODE_ENV }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }))

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur' })
})

// ─── DÉMARRAGE ───────────────────────────────────────────
const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connexion PostgreSQL OK')
    await sequelize.sync({ alter: true }) // sync auto en dev
    console.log('✅ Modèles synchronisés')
    app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`))
  } catch (err) {
    console.error('❌ Erreur démarrage :', err)
    process.exit(1)
  }
}

start()