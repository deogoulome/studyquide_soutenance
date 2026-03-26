const sequelize = require('../config/sequelize')

const Apprenant = require('./Apprenant')
const ResponsableUni = require('./ResponsableUni')
const Universite = require('./Universite')
const SiteUniversite = require('./SiteUniversite')
const Departement = require('./Departement')
const Filiere = require('./Filiere')
const Preinscription = require('./Preinscription')
const Webinaire = require('./Webinaire')
const Reservation = require('./Reservation')
const QuizQuestion = require('./QuizQuestion')
const Avis = require('./Avis')
const Activite = require('./Activite')

// Universite <-> SiteUniversite
Universite.hasMany(SiteUniversite, { foreignKey: 'universite_id', as: 'sites' })
SiteUniversite.belongsTo(Universite, { foreignKey: 'universite_id', as: 'universite' })

// SiteUniversite <-> ResponsableUni
SiteUniversite.hasMany(ResponsableUni, { foreignKey: 'site_universite_id', as: 'responsables' })
ResponsableUni.belongsTo(SiteUniversite, { foreignKey: 'site_universite_id', as: 'site' })

// Departement <-> Filiere
Departement.hasMany(Filiere, { foreignKey: 'departement_id', as: 'filieres' })
Filiere.belongsTo(Departement, { foreignKey: 'departement_id', as: 'departement' })

// Filiere <-> SiteUniversite (many-to-many)
Filiere.belongsToMany(SiteUniversite, {
  through: 'filieres_sites',
  foreignKey: 'filiere_id',
  otherKey: 'site_universite_id',
  as: 'sites',
})
SiteUniversite.belongsToMany(Filiere, {
  through: 'filieres_sites',
  foreignKey: 'site_universite_id',
  otherKey: 'filiere_id',
  as: 'filieres',
})

// Apprenant <-> Preinscription
Apprenant.hasMany(Preinscription, { foreignKey: 'apprenant_id', as: 'preinscriptions' })
Preinscription.belongsTo(Apprenant, { foreignKey: 'apprenant_id', as: 'apprenant' })

// Filiere <-> Preinscription
Filiere.hasMany(Preinscription, { foreignKey: 'filiere_id', as: 'preinscriptions' })
Preinscription.belongsTo(Filiere, { foreignKey: 'filiere_id', as: 'filiere' })

// SiteUniversite <-> Preinscription
SiteUniversite.hasMany(Preinscription, { foreignKey: 'site_universite_id', as: 'preinscriptions' })
Preinscription.belongsTo(SiteUniversite, { foreignKey: 'site_universite_id', as: 'site' })

// Webinaire <-> Reservation
Webinaire.hasMany(Reservation, { foreignKey: 'webinaire_id', as: 'reservations' })
Reservation.belongsTo(Webinaire, { foreignKey: 'webinaire_id', as: 'webinaire' })

// Apprenant <-> Activite
Apprenant.hasMany(Activite, { foreignKey: 'apprenant_id', as: 'activites' })
Activite.belongsTo(Apprenant, { foreignKey: 'apprenant_id', as: 'apprenant' })

// Filiere <-> QuizQuestion
Filiere.hasMany(QuizQuestion, { foreignKey: 'filiere_suggere_id', as: 'questions' })
QuizQuestion.belongsTo(Filiere, { foreignKey: 'filiere_suggere_id', as: 'filiere' })

module.exports = {
  sequelize,
  Apprenant,
  ResponsableUni,
  Universite,
  SiteUniversite,
  Departement,
  Filiere,
  Preinscription,
  Webinaire,
  Reservation,
  QuizQuestion,
  Avis,
  Activite,
}