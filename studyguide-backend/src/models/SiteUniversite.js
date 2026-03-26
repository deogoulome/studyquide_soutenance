const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const SiteUniversite = sequelize.define('SiteUniversite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  ville: { type: DataTypes.STRING(100) },
  adresse: { type: DataTypes.STRING(255) },
  telephone: { type: DataTypes.STRING(50) },
  image: { type: DataTypes.STRING(255) },
  universiteId: { type: DataTypes.INTEGER, field: 'universite_id' },
}, {
  tableName: 'sites_universite',
  timestamps: true,
})

module.exports = SiteUniversite