const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Reservation = sequelize.define('Reservation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  prenom: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  webinaireId: { type: DataTypes.INTEGER, field: 'webinaire_id' },
}, {
  tableName: 'reservations',
  timestamps: true,
})

module.exports = Reservation