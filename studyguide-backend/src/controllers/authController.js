const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { Apprenant, ResponsableUni } = require('../models')
const emailService = require('../services/emailService')

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { nom, prenom, sexe, dateNaissance, telephone, email, motDePasse, adresse } = req.body
    const existe = await Apprenant.findOne({ where: { email } })
    if (existe) return res.status(400).json({ message: 'Email déjà utilisé' })

    const hash = await bcrypt.hash(motDePasse, 12)
    const apprenant = await Apprenant.create({ nom, prenom, sexe, dateNaissance, telephone, email, motDePasse: hash, adresse })
    const token = generateToken(apprenant.id, 'apprenant')
    res.status(201).json({ token, user: { id: apprenant.id, nom, prenom, email, role: 'apprenant' } })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body

    // Chercher d'abord dans apprenants
    let user = await Apprenant.findOne({ where: { email } })
    let role = 'apprenant'

    // Sinon chercher dans responsables
    if (!user) {
      user = await ResponsableUni.findOne({ where: { email } })
      role = 'ru'
    }

    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })

    const valide = await bcrypt.compare(motDePasse, user.motDePasse)
    if (!valide) return res.status(401).json({ message: 'Email ou mot de passe incorrect' })

    const token = generateToken(user.id, role)
    res.json({
      token,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const { id, role } = req.user
    let user
    if (role === 'ru') {
      user = await ResponsableUni.findByPk(id, { attributes: { exclude: ['motDePasse'] } })
    } else {
      user = await Apprenant.findByPk(id, { attributes: { exclude: ['motDePasse', 'resetToken', 'resetTokenExpiry'] } })
    }
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })
    res.json({ ...user.toJSON(), role })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const apprenant = await Apprenant.findOne({ where: { email } })
    if (!apprenant) return res.json({ message: 'Si cet email existe, un lien a été envoyé.' })

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1h
    await apprenant.update({ resetToken: token, resetTokenExpiry: expiry })

    await emailService.sendResetEmail(email, token, apprenant.prenom)
    res.json({ message: 'Lien de réinitialisation envoyé par email.' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, motDePasse } = req.body
    const apprenant = await Apprenant.findOne({ where: { resetToken: token } })

    if (!apprenant || new Date() > apprenant.resetTokenExpiry) {
      return res.status(400).json({ message: 'Token invalide ou expiré' })
    }

    const hash = await bcrypt.hash(motDePasse, 12)
    await apprenant.update({ motDePasse: hash, resetToken: null, resetTokenExpiry: null })
    res.json({ message: 'Mot de passe réinitialisé avec succès' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body
    const apprenant = await Apprenant.findByPk(req.user.id)
    if (!apprenant) return res.status(404).json({ message: 'Utilisateur introuvable' })

    const valide = await bcrypt.compare(ancienMotDePasse, apprenant.motDePasse)
    if (!valide) return res.status(400).json({ message: 'Ancien mot de passe incorrect' })

    const hash = await bcrypt.hash(nouveauMotDePasse, 12)
    await apprenant.update({ motDePasse: hash })
    res.json({ message: 'Mot de passe modifié avec succès' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body
    const apprenant = await Apprenant.findByPk(req.user.id)
    if (!apprenant) return res.status(404).json({ message: 'Utilisateur introuvable' })

    const photo = req.file ? req.file.filename : apprenant.photo
    await apprenant.update({ nom, prenom, telephone, adresse, photo })
    res.json({ message: 'Profil mis à jour', user: { ...apprenant.toJSON(), motDePasse: undefined } })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}