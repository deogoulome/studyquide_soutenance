const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Avis = sequelize.define('Avis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'avis',
  timestamps: true,
})

module.exports = Avis