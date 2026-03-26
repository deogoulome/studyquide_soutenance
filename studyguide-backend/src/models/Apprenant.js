const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')

const Apprenant = sequelize.define('Apprenant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(100), allowNull: false },
  prenom: { type: DataTypes.STRING(100), allowNull: false },
  sexe: { type: DataTypes.ENUM('Masculin', 'Feminin'), allowNull: false },
  dateNaissance: { type: DataTypes.DATEONLY, field: 'date_naissance' },
  telephone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  motDePasse: { type: DataTypes.STRING(255), allowNull: false, field: 'mot_de_passe' },
  adresse: { type: DataTypes.STRING(255) },
  photo: { type: DataTypes.STRING(255) },
  resetToken: { type: DataTypes.STRING(255), field: 'reset_token' },
  resetTokenExpiry: { type: DataTypes.DATE, field: 'reset_token_expiry' },
}, {
  tableName: 'apprenants',
  timestamps: true,
})

module.exports = Apprenant