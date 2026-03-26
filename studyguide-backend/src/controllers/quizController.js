const { QuizQuestion, Filiere } = require('../models')

// GET /api/quiz
exports.getQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.findAll({
      include: [{ model: Filiere, as: 'filiere', attributes: ['id', 'nom'] }],
      order: sequelize.random ? [sequelize.fn('RANDOM')] : [['id', 'ASC']],
    })
    // Masquer la bonne réponse
    const result = questions.map(q => ({
      id: q.id,
      question: q.question,
      choixA: q.choixA,
      choixB: q.choixB,
      choixC: q.choixC,
      choixD: q.choixD,
    }))
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// POST /api/quiz/resultat
exports.calculerResultat = async (req, res) => {
  try {
    const { reponses } = req.body // [{ questionId, reponse }]
    const questions = await QuizQuestion.findAll({
      include: [{ model: Filiere, as: 'filiere', attributes: ['id', 'nom'] }],
    })

    const scores = {}
    reponses.forEach(({ questionId, reponse }) => {
      const question = questions.find(q => q.id === questionId)
      if (question && question.bonneReponse === reponse) {
        const filiereNom = question.filiere?.nom || 'Général'
        scores[filiereNom] = (scores[filiereNom] || 0) + 1
      }
    })

    // Trier par score
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([filiere, score]) => ({ filiere, score }))

    res.json({ scores: sorted, recommandation: sorted[0]?.filiere || 'Aucune recommandation' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}