const { Universite, SiteUniversite, Filiere } = require('../models')

// GET /api/universites
exports.getAll = async (req, res) => {
  try {
    const universites = await Universite.findAll({
      include: [{ model: SiteUniversite, as: 'sites', include: [{ model: Filiere, as: 'filieres' }] }],
    })
    res.json(universites)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/universites/:id
exports.getOne = async (req, res) => {
  try {
    const universite = await Universite.findByPk(req.params.id, {
      include: [{ model: SiteUniversite, as: 'sites', include: [{ model: Filiere, as: 'filieres' }] }],
    })
    if (!universite) return res.status(404).json({ message: 'Université introuvable' })
    res.json(universite)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/universites/sites
exports.getSites = async (req, res) => {
  try {
    const sites = await SiteUniversite.findAll({
      include: [
        { model: Universite, as: 'universite', attributes: ['id', 'nom'] },
        { model: Filiere, as: 'filieres', attributes: ['id', 'nom'] },
      ],
    })
    res.json(sites)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}