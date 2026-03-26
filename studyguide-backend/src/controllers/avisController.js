const { Avis } = require('../models')

// GET /api/avis
exports.getAll = async (req, res) => {
  try {
    const avis = await Avis.findAll({ order: [['createdAt', 'DESC']] })
    res.json(avis)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// POST /api/avis
exports.create = async (req, res) => {
  try {
    const { nom, email, message } = req.body
    const avis = await Avis.create({ nom, email, message })
    res.status(201).json({ message: 'Avis soumis avec succès', id: avis.id })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}