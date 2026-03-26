const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const ResponsableUni = sequelize.define('ResponsableUni', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  prenom: { type: DataTypes.STRING(100), allowNull: false },
  sexe: { type: DataTypes.CHAR(1) },
  telephone: { type: DataTypes.STRING(20) },
  adresse: { type: DataTypes.STRING(255) },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  motDePasse: { type: DataTypes.STRING(255), allowNull: false, field: 'mot_de_passe' },
  siteUniversiteId: { type: DataTypes.INTEGER, field: 'site_universite_id' },
}, {
  tableName: 'responsables_uni',
  timestamps: true,
})

module.exports = ResponsableUni