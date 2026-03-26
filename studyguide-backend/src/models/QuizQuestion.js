const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const QuizQuestion = sequelize.define('QuizQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question: { type: DataTypes.TEXT, allowNull: false },
  choixA: { type: DataTypes.STRING(255), field: 'choix_a' },
  choixB: { type: DataTypes.STRING(255), field: 'choix_b' },
  choixC: { type: DataTypes.STRING(255), field: 'choix_c' },
  choixD: { type: DataTypes.STRING(255), field: 'choix_d' },
  bonneReponse: { type: DataTypes.CHAR(1), field: 'bonne_reponse' },
  filiereSuggereId: { type: DataTypes.INTEGER, field: 'filiere_suggere_id' },
}, {
  tableName: 'quiz_questions',
  timestamps: true,
})

module.exports = QuizQuestion