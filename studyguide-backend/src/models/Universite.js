const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Universite = sequelize.define('Universite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(150), allowNull: false },
  messagePDG: { type: DataTypes.TEXT, field: 'message_pdg' },
  documents: { type: DataTypes.TEXT },
  fraisScolariteImg: { type: DataTypes.STRING(255), field: 'frais_scolarite_img' },
  image: { type: DataTypes.STRING(255) },
}, {
  tableName: 'universites',
  timestamps: true,
})

module.exports = Universite