const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Filiere = sequelize.define('Filiere', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(150), allowNull: false },
  serieBac: { type: DataTypes.STRING(100), field: 'serie_bac' },
  matieres: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  debouches: { type: DataTypes.TEXT },
  departementId: { type: DataTypes.INTEGER, field: 'departement_id' },
}, {
  tableName: 'filieres',
  timestamps: true,
})

module.exports = Filiere