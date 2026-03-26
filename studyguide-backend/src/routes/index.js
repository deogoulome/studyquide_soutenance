const express = require('express')
const router = express.Router()
const { authMiddleware, ruMiddleware } = require('../middleware/auth')
const upload = require('../middleware/upload')

const authController = require('../controllers/authController')
const filiereController = require('../controllers/filiereController')
const universiteController = require('../controllers/universiteController')
const preinscriptionController = require('../controllers/preinscriptionController')
const webinaireController = require('../controllers/webinaireController')
const quizController = require('../controllers/quizController')
const avisController = require('../controllers/avisController')

// ─── AUTH ───────────────────────────────────────────────
router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.get('/auth/me', authMiddleware, authController.getMe)
router.post('/auth/forgot-password', authController.forgotPassword)
router.post('/auth/reset-password', authController.resetPassword)
router.put('/auth/change-password', authMiddleware, authController.changePassword)
router.put('/auth/profile', authMiddleware, upload.single('photo'), authController.updateProfile)

// ─── FILIÈRES ───────────────────────────────────────────
router.get('/filieres', filiereController.getAll)
router.get('/filieres/:id', filiereController.getOne)
router.get('/filieres/departement/:departementId', filiereController.getByDepartement)

// ─── UNIVERSITÉS ────────────────────────────────────────
router.get('/universites', universiteController.getAll)
router.get('/universites/sites', universiteController.getSites)
router.get('/universites/:id', universiteController.getOne)

// ─── PRÉINSCRIPTIONS ─────────────────────────────────────
router.post('/preinscriptions', authMiddleware, upload.single('releve'), preinscriptionController.create)
router.get('/preinscriptions/mes', authMiddleware, preinscriptionController.getMes)
router.get('/preinscriptions/site/:siteId', authMiddleware, ruMiddleware, preinscriptionController.getBySite)
router.put('/preinscriptions/:id/valider', authMiddleware, ruMiddleware, preinscriptionController.valider)
router.put('/preinscriptions/:id/annuler', authMiddleware, ruMiddleware, preinscriptionController.annuler)
router.get('/preinscriptions/:id/pdf', authMiddleware, preinscriptionController.generatePDF)

// ─── WEBINAIRES ─────────────────────────────────────────
router.get('/webinaires', webinaireController.getAll)
router.get('/webinaires/:id', webinaireController.getOne)
router.post('/webinaires/:id/reserver', webinaireController.reserver)

// ─── QUIZ ────────────────────────────────────────────────
router.get('/quiz', quizController.getQuestions)
router.post('/quiz/resultat', quizController.calculerResultat)

// ─── AVIS ────────────────────────────────────────────────
router.get('/avis', avisController.getAll)
router.post('/avis', avisController.create)

module.exports = router