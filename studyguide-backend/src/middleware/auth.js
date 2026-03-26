const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token expiré ou invalide' })
  }
}

// Vérifie que l'utilisateur est un Responsable Universitaire
const ruMiddleware = (req, res, next) => {
  if (req.user?.role !== 'ru') {
    return res.status(403).json({ message: 'Accès réservé aux responsables universitaires' })
  }
  next()
}

module.exports = { authMiddleware, ruMiddleware }