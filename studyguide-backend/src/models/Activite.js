const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Activite = sequelize.define('Activite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING(255) },
  apprenantId: { type: DataTypes.INTEGER, field: 'apprenant_id' },
}, {
  tableName: 'activites',
  timestamps: true,
})

module.exports = Activite