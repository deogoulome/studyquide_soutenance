const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Departement = sequelize.define('Departement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
}, {
  tableName: 'departements',
  timestamps: true,
})

module.exports = Departement