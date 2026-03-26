const { Webinaire, Reservation } = require('../models')
const emailService = require('../services/emailService')

// GET /api/webinaires
exports.getAll = async (req, res) => {
  try {
    const webinaires = await Webinaire.findAll({
      include: [{ model: Reservation, as: 'reservations', attributes: ['id'] }],
      order: [['date', 'ASC']],
    })
    // Ajouter le nombre de places restantes
    const result = webinaires.map(w => ({
      ...w.toJSON(),
      placesRestantes: w.nombrePlaces - (w.reservations?.length || 0),
    }))
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// GET /api/webinaires/:id
exports.getOne = async (req, res) => {
  try {
    const webinaire = await Webinaire.findByPk(req.params.id, {
      include: [{ model: Reservation, as: 'reservations' }],
    })
    if (!webinaire) return res.status(404).json({ message: 'Webinaire introuvable' })
    res.json(webinaire)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// POST /api/webinaires/:id/reserver
exports.reserver = async (req, res) => {
  try {
    const { nom, prenom, email } = req.body
    const webinaire = await Webinaire.findByPk(req.params.id, {
      include: [{ model: Reservation, as: 'reservations' }],
    })
    if (!webinaire) return res.status(404).json({ message: 'Webinaire introuvable' })

    const placesRestantes = webinaire.nombrePlaces - webinaire.reservations.length
    if (placesRestantes <= 0) return res.status(400).json({ message: 'Plus de places disponibles' })

    // Vérifier doublon
    const dejainscrit = webinaire.reservations.find(r => r.email === email)
    if (dejainscrit) return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce webinaire' })

    const reservation = await Reservation.create({ nom, prenom, email, webinaireId: webinaire.id })
    await emailService.sendReservationEmail(email, prenom, webinaire)
    res.status(201).json({ message: 'Réservation confirmée', id: reservation.id })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}