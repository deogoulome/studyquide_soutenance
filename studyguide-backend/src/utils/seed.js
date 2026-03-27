require('dotenv').config()
const bcrypt = require('bcryptjs')
const { sequelize, Universite, SiteUniversite, Departement, Filiere, Apprenant, ResponsableUni, Webinaire, QuizQuestion } = require('../models')

async function seed() {
  try {
    console.log('🌱 Début de l\'insertion des données...')
    await sequelize.sync({ force: true })
    console.log('✅ Base de données réinitialisée')

    // ─── UNIVERSITÉS ─────────────────────────────────────
    const lcs = await Universite.create({
      nom: 'Institut Universitaire Les Cours Sonou (LCS)',
      messagePDG: "L'Institut Universitaire LES COURS SONOU est un Établissement Privé d'Enseignement Supérieur agréé par l'État du Bénin. Il offre un enseignement de qualité ouvert aux étudiants béninois et étrangers, inscrit dans le système LMD (Licence–Master–Doctorat).",
      documents: "Attestation de stage\nAttestation de services faits\nAttestation de travail\nLettre de recommandation\nCertificat de travail\nCertificat de Scolarité\nFiche d'inscription\nBulletins de notes",
      fraisScolariteImg: 'scolarite.png',
      image: 'sonou1.jpg',
    })

    const hecm = await Universite.create({
      nom: 'Haute École de Commerce et de Management (HECM)',
      messagePDG: "HECM offre une gamme complète de formations en management, gestion, communication, journalisme et technologie. Nous disposons de 20 filières de Licence et Master accréditées par le CAMES et homologuées par l'État.",
      documents: "Attestation de scolarité\nRelevé de notes\nDiplôme\nCertificat de présence",
      fraisScolariteImg: 'HECM-S.png',
      image: 'hecm1.png',
    })
    console.log('✅ Universités créées')

    // ─── SITES ───────────────────────────────────────────
    const siteCaboma = await SiteUniversite.create({
      nom: 'LCS Caboma',
      ville: 'Cotonou',
      adresse: 'Immeuble LES COURS SONOU - Parcelle b, Lot 66 du R.F.U Caboma - Atinkanmey',
      telephone: '+229 60412121 / 60412525',
      image: 'sonou1.jpg',
      universiteId: lcs.id,
    })

    const siteCalavi = await SiteUniversite.create({
      nom: 'LCS Calavi',
      ville: 'Calavi',
      adresse: "Situé entre l'UAC et le village SOS au bord du goudron",
      telephone: '+229 60412323',
      image: 'calavi.jpg',
      universiteId: lcs.id,
    })

    const siteAkpakpa = await SiteUniversite.create({
      nom: 'LCS Akpakpa',
      ville: 'Akpakpa',
      adresse: 'Akpakpa Aglangandan à 200m du carrefour le belier',
      telephone: '+229 60412121',
      image: 'Akpakpa.jpg',
      universiteId: lcs.id,
    })

    const siteHecmCotonou = await SiteUniversite.create({
      nom: 'HECM Cotonou',
      ville: 'Cotonou',
      adresse: 'Boulevard Saint Michel, Cotonou',
      telephone: '+229 97000000',
      image: 'hecm2.png',
      universiteId: hecm.id,
    })

    const siteHecmBohicon = await SiteUniversite.create({
      nom: 'HECM Bohicon',
      ville: 'Bohicon',
      adresse: 'Quartier Lissèzoun, Bohicon',
      telephone: '+229 97000001',
      image: 'hecm3.png',
      universiteId: hecm.id,
    })
    console.log('✅ Sites universitaires créés')

    // ─── DÉPARTEMENTS ────────────────────────────────────
    const deptGestion = await Departement.create({ nom: 'Gestion' })
    const deptInfo = await Departement.create({ nom: 'Informatique' })
    const deptElec = await Departement.create({ nom: 'Electronique' })
    console.log('✅ Départements créés')

    // ─── FILIÈRES ────────────────────────────────────────
    const grh = await Filiere.create({
      nom: 'Gestion des Ressources Humaines',
      serieBac: 'Toutes séries',
      matieres: "Mathématiques\nFrançais\nDroit du travail\nPsychologie des organisations",
      description: "Acquisition des bases théoriques et méthodologiques indispensables à une future pratique professionnelle en ressources humaines.",
      debouches: "Responsable RH\nChargé de recrutement\nConsultant en ressources humaines\nResponsable formation\nAdministrateur des ressources humaines",
      departementId: deptGestion.id,
    })

    const cegp = await Filiere.create({
      nom: "Création d'Entreprise et Gestion des Projets",
      serieBac: 'D, C, G2, G3',
      matieres: "Mathématiques\nFrançais\nGestion de projet\nEntrepreneuriat",
      description: "Formation aux bases théoriques et pratiques de la création d'entreprise et de la gestion de projets.",
      debouches: "Chef de projet\nEntrepreneur\nConsultant en gestion\nDirecteur de PME\nExpert-comptable",
      departementId: deptGestion.id,
    })

    const mac = await Filiere.create({
      nom: 'Marketing et Actions Commerciales',
      serieBac: 'D, C, G2, G3, B, A',
      matieres: "Français\nMathématiques\nAnglais\nMarketing digital",
      description: "Compréhension des marchés, stratégies marketing, techniques de vente et gestion de la relation client.",
      debouches: "Chargé de marketing\nChef de produit\nResponsable commercial\nChargé d'études marketing\nResponsable de la communication",
      departementId: deptGestion.id,
    })

    const cfe = await Filiere.create({
      nom: "Comptabilité et Finance d'Entreprise",
      serieBac: 'C, D, G2, G3',
      matieres: "Mathématiques\nFrançais\nAnglais\nComptabilité générale",
      description: "Maîtrise des concepts comptables, analyse financière et gestion financière des entreprises.",
      debouches: "Comptable\nContrôleur de gestion\nAnalyste financier\nTrésorier\nAuditeur\nDirecteur Financier (CFO)",
      departementId: deptGestion.id,
    })

    const sil = await Filiere.create({
      nom: 'Systèmes Informatiques et Logiciels',
      serieBac: 'D, C, E, DT, IMI',
      matieres: "Mathématiques\nFrançais\nAnglais\nAlgorithmique\nProgrammation",
      description: "Formation aux bases théoriques et méthodologiques du développement logiciel et des systèmes informatiques.",
      debouches: "Développeur logiciel\nAdministrateur de bases de données\nGestion des systèmes d'information\nIngénieur informatique",
      departementId: deptInfo.id,
    })

    const rit = await Filiere.create({
      nom: 'Réseau Informatique et Télécommunication',
      serieBac: 'C, D, E, F2',
      matieres: "Mathématiques\nFrançais\nAnglais\nRéseaux\nTélécommunications",
      description: "Formation aux infrastructures réseau, sécurité informatique et télécommunications.",
      debouches: "Administrateur réseau\nIngénieur en télécommunications\nResponsable sécurité informatique\nConsultant réseau",
      departementId: deptInfo.id,
    })

    const elec = await Filiere.create({
      nom: 'Électrotechnique',
      serieBac: 'C, D, IMI',
      matieres: "PCT\nMathématiques\nFrançais\nPhysique appliquée",
      description: "Compréhension des systèmes électriques, compétences techniques pour concevoir et maintenir des équipements électriques.",
      debouches: "Ingénieur électrotechnique\nTechnicien électricien\nChef de projet électrique\nIngénieur en énergies renouvelables",
      departementId: deptElec.id,
    })
    console.log('✅ Filières créées')

    // ─── ASSOCIATIONS FILIÈRES <-> SITES ─────────────────
    await grh.setSites([siteCaboma, siteCalavi, siteHecmCotonou])
    await cegp.setSites([siteCaboma, siteAkpakpa, siteHecmBohicon])
    await mac.setSites([siteCaboma, siteAkpakpa, siteHecmBohicon])
    await cfe.setSites([siteCalavi, siteAkpakpa, siteHecmCotonou, siteHecmBohicon])
    await sil.setSites([siteCaboma, siteCalavi])
    await rit.setSites([siteCaboma, siteCalavi, siteAkpakpa])
    await elec.setSites([siteCaboma, siteAkpakpa, siteHecmBohicon])
    console.log('✅ Associations filières-sites créées')

    // ─── APPRENANTS ──────────────────────────────────────
    const hash = await bcrypt.hash('Password123', 12)
    await Apprenant.bulkCreate([
      {
        nom: 'GOULOME', prenom: 'Gerardo', sexe: 'Masculin',
        dateNaissance: '2000-05-06', telephone: '54255848',
        email: 'gerardo@studyguide.com', motDePasse: hash,
        adresse: 'Calavi',
      },
      {
        nom: 'GBAGUIDI', prenom: 'Andre', sexe: 'Masculin',
        dateNaissance: '2001-03-15', telephone: '65251425',
        email: 'andre@studyguide.com', motDePasse: hash,
        adresse: 'Cotonou',
      },
      {
        nom: 'AHOUITONON', prenom: 'Hardie', sexe: 'Feminin',
        dateNaissance: '2002-01-02', telephone: '61245623',
        email: 'hardie@studyguide.com', motDePasse: hash,
        adresse: 'Calavi',
      },
    ])
    console.log('✅ Apprenants créés')

    // ─── RESPONSABLES UNIVERSITAIRES ─────────────────────
    const hashRU = await bcrypt.hash('Admin123', 12)
    await ResponsableUni.bulkCreate([
      {
        nom: 'GANGAN', prenom: 'Igor', sexe: 'M',
        telephone: '67241525', adresse: 'Calavi',
        email: 'ru.caboma@studyguide.com', motDePasse: hashRU,
        siteUniversiteId: siteCaboma.id,
      },
      {
        nom: 'AGBAN', prenom: 'Basile', sexe: 'M',
        telephone: '97245182', adresse: 'Cotonou',
        email: 'ru.calavi@studyguide.com', motDePasse: hashRU,
        siteUniversiteId: siteCalavi.id,
      },
      {
        nom: 'GOUDJO', prenom: 'Alphonse', sexe: 'M',
        telephone: '65214327', adresse: 'Bohicon',
        email: 'ru.akpakpa@studyguide.com', motDePasse: hashRU,
        siteUniversiteId: siteAkpakpa.id,
      },
    ])
    console.log('✅ Responsables universitaires créés')

    // ─── WEBINAIRES ──────────────────────────────────────
    await Webinaire.bulkCreate([
      {
        titre: "Choisir sa voie : Trouver sa filière idéale",
        description: "Ce webinaire d'orientation vous guidera dans le processus de choix de filière en mettant en lumière vos intérêts, compétences et aspirations.",
        date: '2025-06-15',
        heure: '14:00:00',
        nombrePlaces: 100,
      },
      {
        titre: "Métiers du futur : Les opportunités de demain",
        description: "Explorez les tendances émergentes du marché du travail et découvrez les métiers du futur lors de ce webinaire passionnant.",
        date: '2025-06-22',
        heure: '16:00:00',
        nombrePlaces: 150,
      },
      {
        titre: "Financer ses études : Bourses et aides disponibles",
        description: "Découvrez toutes les opportunités de financement disponibles pour vos études supérieures au Bénin et à l'international.",
        date: '2025-07-05',
        heure: '10:00:00',
        nombrePlaces: 80,
      },
    ])
    console.log('✅ Webinaires créés')

    // ─── QUIZ ────────────────────────────────────────────
    await QuizQuestion.bulkCreate([
      {
        question: "Quelle matière préfères-tu le plus ?",
        choixA: "Mathématiques et sciences",
        choixB: "Économie et gestion",
        choixC: "Informatique et technologie",
        choixD: "Langues et communication",
        bonneReponse: 'c',
        filiereSuggereId: sil.id,
      },
      {
        question: "Quel type de travail t'attire le plus ?",
        choixA: "Analyser des chiffres et des données",
        choixB: "Créer et innover",
        choixC: "Manager des équipes",
        choixD: "Réparer et construire des systèmes",
        bonneReponse: 'b',
        filiereSuggereId: cegp.id,
      },
      {
        question: "Dans quel environnement voudrais-tu travailler ?",
        choixA: "Bureau et entreprise",
        choixB: "Terrain et installations techniques",
        choixC: "Start-up et innovation",
        choixD: "Administration publique",
        bonneReponse: 'a',
        filiereSuggereId: grh.id,
      },
      {
        question: "Quel est ton objectif principal après tes études ?",
        choixA: "Créer ma propre entreprise",
        choixB: "Travailler dans une grande entreprise",
        choixC: "Devenir expert technique",
        choixD: "Travailler dans le secteur public",
        bonneReponse: 'a',
        filiereSuggereId: cegp.id,
      },
      {
        question: "Quelle compétence veux-tu développer en priorité ?",
        choixA: "Programmation et développement",
        choixB: "Finance et comptabilité",
        choixC: "Marketing et vente",
        choixD: "Électronique et systèmes électriques",
        bonneReponse: 'a',
        filiereSuggereId: sil.id,
      },
    ])
    console.log('✅ Questions quiz créées')

    console.log('\n🎉 Seed terminé avec succès !\n')
    console.log('📋 Comptes de test créés :')
    console.log('─────────────────────────────────────────')
    console.log('👤 Apprenant  : gerardo@studyguide.com   | Password123')
    console.log('👤 Apprenant  : andre@studyguide.com     | Password123')
    console.log('🏛️  Responsable : ru.caboma@studyguide.com | Admin123')
    console.log('🏛️  Responsable : ru.calavi@studyguide.com | Admin123')
    console.log('─────────────────────────────────────────')

    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur seed :', err)
    process.exit(1)
  }
}

seed()