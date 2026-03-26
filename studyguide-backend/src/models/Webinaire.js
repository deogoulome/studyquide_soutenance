const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Webinaire = sequelize.define('Webinaire', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titre: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  heure: { type: DataTypes.TIME, allowNull: false },
  nombrePlaces: { type: DataTypes.INTEGER, defaultValue: 100, field: 'nombre_places' },
}, {
  tableName: 'webinaires',
  timestamps: true,
})

module.exports = Webinaire