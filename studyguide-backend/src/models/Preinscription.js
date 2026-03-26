const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Preinscription = sequelize.define('Preinscription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  prenom: { type: DataTypes.STRING(100), allowNull: false },
  sexe: { type: DataTypes.ENUM('Masculin', 'Feminin'), allowNull: false },
  telephone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100), allowNull: false },
  imgReleve: { type: DataTypes.STRING(255), field: 'img_releve' },
  description: { type: DataTypes.TEXT },
  descriptUni: { type: DataTypes.TEXT, field: 'descript_uni' },
  status: {
    type: DataTypes.ENUM('pending', 'validee', 'annulee'),
    defaultValue: 'pending',
  },
  dateValidation: { type: DataTypes.DATE, field: 'date_validation' },
  filiereId: { type: DataTypes.INTEGER, field: 'filiere_id' },
  siteUniversiteId: { type: DataTypes.INTEGER, field: 'site_universite_id' },
  apprenantId: { type: DataTypes.INTEGER, field: 'apprenant_id' },
}, {
  tableName: 'preinscriptions',
  timestamps: true,
})

module.exports = Preinscription