const { Filiere, Departement, SiteUniversite } = require('../models')

// GET /api/filieres
exports.getAll = async (req, res) => {
  try {
    const filieres = await Filiere.findAll({
      include: [
        { model: Departement, as: 'departement' },
        { model: SiteUniversite, as: 'sites', attributes: ['id', 'nom', 'ville'] },
      ],
      order: [['nom', 'ASC']],
    })
    res.json(filieres)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/filieres/:id
exports.getOne = async (req, res) => {
  try {
    const filiere = await Filiere.findByPk(req.params.id, {
      include: [
        { model: Departement, as: 'departement' },
        { model: SiteUniversite, as: 'sites' },
      ],
    })
    if (!filiere) return res.status(404).json({ message: 'Filière introuvable' })
    res.json(filiere)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/filieres/departement/:departementId
exports.getByDepartement = async (req, res) => {
  try {
    const filieres = await Filiere.findAll({
      where: { departementId: req.params.departementId },
      include: [{ model: Departement, as: 'departement' }],
    })
    res.json(filieres)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}