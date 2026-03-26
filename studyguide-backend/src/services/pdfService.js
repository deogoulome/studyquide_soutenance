const PDFDocument = require('pdfkit')

exports.generatePreinscriptionPDF = (preinscription, stream) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  doc.pipe(stream)

  // En-tête
  doc.rect(0, 0, doc.page.width, 120).fill('#1a56db')
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('STUDYGUIDE', 50, 35)
  doc.fontSize(12).fillColor('#cbd5e1').font('Helvetica').text('Fiche de Préinscription', 50, 70)
  doc.fillColor('#000000').moveDown(4)

  const ligne = (label, valeur) => {
    doc.fontSize(10).fillColor('#64748b').font('Helvetica-Bold').text(label.toUpperCase(), { continued: false })
    doc.fontSize(12).fillColor('#1e293b').font('Helvetica').text(valeur || '—')
    doc.moveDown(0.5)
  }

  doc.rect(50, doc.y, doc.page.width - 100, 1).fill('#e2e8f0').moveDown(0.5)
  doc.fontSize(14).fillColor('#1a56db').font('Helvetica-Bold').text('Informations personnelles').moveDown(0.5)

  ligne('Nom complet', `${preinscription.prenom} ${preinscription.nom}`)
  ligne('Sexe', preinscription.sexe)
  ligne('Téléphone', preinscription.telephone)
  ligne('Email', preinscription.email)

  doc.moveDown(0.5)
  doc.rect(50, doc.y, doc.page.width - 100, 1).fill('#e2e8f0').moveDown(0.5)
  doc.fontSize(14).fillColor('#1a56db').font('Helvetica-Bold').text('Choix académiques').moveDown(0.5)

  ligne('Filière choisie', preinscription.filiere?.nom)
  ligne('Site universitaire', preinscription.site?.nom)
  ligne('Ville', preinscription.site?.ville)

  doc.moveDown(0.5)
  doc.rect(50, doc.y, doc.page.width - 100, 1).fill('#e2e8f0').moveDown(0.5)
  doc.fontSize(14).fillColor('#1a56db').font('Helvetica-Bold').text('Statut').moveDown(0.5)

  const statutColor = {
    pending: '#f59e0b',
    validee: '#10b981',
    annulee: '#ef4444',
  }
  const couleur = statutColor[preinscription.status] || '#64748b'
  doc.fontSize(13).fillColor(couleur).font('Helvetica-Bold').text(
    preinscription.status === 'validee' ? 'Validée' :
    preinscription.status === 'annulee' ? 'Annulée' : 'En attente'
  )

  ligne('Date', new Date(preinscription.createdAt).toLocaleDateString('fr-FR'))
  ligne('Référence', `#${preinscription.id}`)

  // Pied de page
  const bottom = doc.page.height - 60
  doc.rect(0, bottom, doc.page.width, 60).fill('#f8fafc')
  doc.fontSize(9).fillColor('#94a3b8').text(
    'Document généré par StudyGuide — Plateforme d\'orientation universitaire',
    50, bottom + 20, { align: 'center', width: doc.page.width - 100 }
  )

  doc.end()
}