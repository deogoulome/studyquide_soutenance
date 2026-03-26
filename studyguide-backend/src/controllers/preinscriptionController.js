const { Preinscription, Filiere, SiteUniversite, Apprenant } = require('../models')
const emailService = require('../services/emailService')
const pdfService = require('../services/pdfService')

// POST /api/preinscriptions
exports.create = async (req, res) => {
  try {
    const { nom, prenom, sexe, telephone, email, description, descriptUni, filiereId, siteUniversiteId } = req.body
    const imgReleve = req.file ? req.file.filename : null

    const preinscription = await Preinscription.create({
      nom, prenom, sexe, telephone, email,
      imgReleve, description, descriptUni,
      filiereId, siteUniversiteId,
      apprenantId: req.user?.id || null,
      status: 'pending',
    })

    // Envoyer email de confirmation
    await emailService.sendConfirmationPreinscription(email, prenom, preinscription.id)

    res.status(201).json({ message: 'Préinscription soumise avec succès', id: preinscription.id })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/preinscriptions/mes - préinscriptions de l'apprenant connecté
exports.getMes = async (req, res) => {
  try {
    const preinscriptions = await Preinscription.findAll({
      where: { apprenantId: req.user.id },
      include: [
        { model: Filiere, as: 'filiere', attributes: ['id', 'nom'] },
        { model: SiteUniversite, as: 'site', attributes: ['id', 'nom', 'ville'] },
      ],
      order: [['createdAt', 'DESC']],
    })
    res.json(preinscriptions)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/preinscriptions/site/:siteId - pour le RU (toutes les préinscriptions de son site)
exports.getBySite = async (req, res) => {
  try {
    const preinscriptions = await Preinscription.findAll({
      where: { siteUniversiteId: req.params.siteId },
      include: [
        { model: Filiere, as: 'filiere', attributes: ['id', 'nom'] },
        { model: SiteUniversite, as: 'site', attributes: ['id', 'nom'] },
      ],
      order: [['createdAt', 'DESC']],
    })
    res.json(preinscriptions)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// PUT /api/preinscriptions/:id/valider
exports.valider = async (req, res) => {
  try {
    const preinscription = await Preinscription.findByPk(req.params.id, {
      include: [{ model: Filiere, as: 'filiere' }, { model: SiteUniversite, as: 'site' }],
    })
    if (!preinscription) return res.status(404).json({ message: 'Préinscription introuvable' })

    await preinscription.update({ status: 'validee', dateValidation: new Date() })
    await emailService.sendValidationEmail(preinscription.email, preinscription.prenom, 'validée')
    res.json({ message: 'Préinscription validée' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// PUT /api/preinscriptions/:id/annuler
exports.annuler = async (req, res) => {
  try {
    const preinscription = await Preinscription.findByPk(req.params.id)
    if (!preinscription) return res.status(404).json({ message: 'Préinscription introuvable' })

    await preinscription.update({ status: 'annulee' })
    await emailService.sendValidationEmail(preinscription.email, preinscription.prenom, 'annulée')
    res.json({ message: 'Préinscription annulée' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/preinscriptions/:id/pdf
exports.generatePDF = async (req, res) => {
  try {
    const preinscription = await Preinscription.findByPk(req.params.id, {
      include: [
        { model: Filiere, as: 'filiere' },
        { model: SiteUniversite, as: 'site' },
      ],
    })
    if (!preinscription) return res.status(404).json({ message: 'Préinscription introuvable' })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="preinscription-${preinscription.id}.pdf"`)
    pdfService.generatePreinscriptionPDF(preinscription, res)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}