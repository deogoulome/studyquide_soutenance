const PDFDocument = require('pdfkit')

exports.generatePreinscriptionPDF = (preinscription, stream) => {
  const doc = new PDFDocument({ margin: 0, size: 'A4' })
  doc.pipe(stream)

  const W = doc.page.width
  const H = doc.page.height

  // ── BANDE SUPÉRIEURE ──────────────────────────────────
  doc.rect(0, 0, W, 140).fill('#1a56db')

  // Cercle décoratif haut droite
  doc.circle(W - 60, -30, 120).fill('#1448c4')
  doc.circle(W - 20, 80, 60).fill('#0e3a9e')

  // Logo texte
  doc.fontSize(28).fillColor('#ffffff').font('Helvetica-Bold')
  doc.text('STUDYGUIDE', 50, 40)

  doc.fontSize(11).fillColor('#93c5fd').font('Helvetica')
  doc.text('Plateforme d\'orientation universitaire', 50, 76)

  // Ligne séparatrice blanche
  doc.rect(50, 100, 80, 3).fill('#ffffff')

  // Titre document
  doc.fontSize(13).fillColor('#bfdbfe').font('Helvetica')
  doc.text('FICHE DE PRÉINSCRIPTION', 50, 112)

  // Numéro de référence en haut à droite
  doc.fontSize(11).fillColor('#ffffff').font('Helvetica-Bold')
  doc.text(`Réf. #${preinscription.id}`, W - 120, 50, { width: 90, align: 'right' })
  doc.fontSize(9).fillColor('#bfdbfe').font('Helvetica')
  doc.text(new Date(preinscription.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  }), W - 140, 68, { width: 110, align: 'right' })

  // ── BADGE STATUT ──────────────────────────────────────
  const statutColors = {
    pending:  { bg: '#fef3c7', text: '#92400e', label: 'EN ATTENTE' },
    validee:  { bg: '#d1fae5', text: '#065f46', label: 'VALIDÉE' },
    annulee:  { bg: '#fee2e2', text: '#991b1b', label: 'ANNULÉE' },
  }
  const statut = statutColors[preinscription.status] || statutColors.pending
  doc.roundedRect(W - 140, 95, 110, 26, 13).fill(statut.bg)
  doc.fontSize(10).fillColor(statut.text).font('Helvetica-Bold')
  doc.text(statut.label, W - 140, 103, { width: 110, align: 'center' })

  // ── SECTION : INFOS PERSONNELLES ─────────────────────
  let y = 165

  const sectionTitle = (titre, iconY) => {
    doc.rect(50, iconY, 4, 22).fill('#1a56db')
    doc.fontSize(13).fillColor('#1e293b').font('Helvetica-Bold')
    doc.text(titre, 62, iconY + 3)
    return iconY + 32
  }

  const champ = (label, valeur, xLeft, xRight, yPos) => {
    // Fond gris léger
    doc.roundedRect(xLeft, yPos, xRight - xLeft, 48, 6).fill('#f8fafc')
    doc.rect(xLeft, yPos, 3, 48).fill('#1a56db')
    doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold')
    doc.text(label.toUpperCase(), xLeft + 12, yPos + 10)
    doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold')
    doc.text(valeur || '—', xLeft + 12, yPos + 24, { width: xRight - xLeft - 24, ellipsis: true })
    return yPos + 58
  }

  y = sectionTitle('Informations personnelles', y)

  // Nom complet — pleine largeur
  doc.roundedRect(50, y, W - 100, 52, 6).fill('#f8fafc')
  doc.rect(50, y, 3, 52).fill('#1a56db')
  doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold')
  doc.text('NOM COMPLET', 62, y + 10)
  doc.fontSize(16).fillColor('#0f172a').font('Helvetica-Bold')
  doc.text(`${preinscription.prenom} ${preinscription.nom}`, 62, y + 26)
  y += 62

  // Sexe | Téléphone | Email sur une ligne
  const col1 = 50, col2 = 50 + (W - 120) / 3 + 10, col3 = 50 + (W - 120) * 2 / 3 + 20
  const colW = (W - 130) / 3

  doc.roundedRect(col1, y, colW, 48, 6).fill('#f8fafc')
  doc.rect(col1, y, 3, 48).fill('#7c3aed')
  doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold').text('SEXE', col1 + 12, y + 10)
  doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold').text(preinscription.sexe || '—', col1 + 12, y + 24)

  doc.roundedRect(col2, y, colW, 48, 6).fill('#f8fafc')
  doc.rect(col2, y, 3, 48).fill('#0891b2')
  doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold').text('TÉLÉPHONE', col2 + 12, y + 10)
  doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold').text(preinscription.telephone || '—', col2 + 12, y + 24)

  doc.roundedRect(col3, y, colW, 48, 6).fill('#f8fafc')
  doc.rect(col3, y, 3, 48).fill('#059669')
  doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold').text('EMAIL', col3 + 12, y + 10)
  doc.fontSize(11).fillColor('#0f172a').font('Helvetica-Bold').text(preinscription.email || '—', col3 + 12, y + 24, { width: colW - 20, ellipsis: true })

  y += 62

  // ── SECTION : CHOIX ACADÉMIQUES ──────────────────────
  y = sectionTitle('Choix académiques', y)

  // Filière — pleine largeur
  doc.roundedRect(50, y, W - 100, 52, 6).fill('#eff6ff')
  doc.rect(50, y, 3, 52).fill('#1a56db')
  doc.fontSize(8).fillColor('#1d4ed8').font('Helvetica-Bold').text('FILIÈRE CHOISIE', 62, y + 10)
  doc.fontSize(15).fillColor('#1e40af').font('Helvetica-Bold')
  doc.text(preinscription.filiere?.nom || '—', 62, y + 26, { width: W - 140 })
  y += 62

  // Site | Ville
  const halfW = (W - 115) / 2
  doc.roundedRect(50, y, halfW, 48, 6).fill('#f0fdf4')
  doc.rect(50, y, 3, 48).fill('#059669')
  doc.fontSize(8).fillColor('#166534').font('Helvetica-Bold').text('SITE UNIVERSITAIRE', 62, y + 10)
  doc.fontSize(12).fillColor('#14532d').font('Helvetica-Bold').text(preinscription.site?.nom || '—', 62, y + 24, { width: halfW - 20 })

  doc.roundedRect(55 + halfW, y, halfW, 48, 6).fill('#fdf4ff')
  doc.rect(55 + halfW, y, 3, 48).fill('#9333ea')
  doc.fontSize(8).fillColor('#6b21a8').font('Helvetica-Bold').text('VILLE', 67 + halfW, y + 10)
  doc.fontSize(12).fillColor('#581c87').font('Helvetica-Bold').text(preinscription.site?.ville || '—', 67 + halfW, y + 24)

  y += 62

  // Motivation si présente
  if (preinscription.description) {
    y = sectionTitle('Motivation', y)
    doc.roundedRect(50, y, W - 100, 60, 6).fill('#f8fafc')
    doc.rect(50, y, 3, 60).fill('#f59e0b')
    doc.fontSize(11).fillColor('#374151').font('Helvetica')
    doc.text(preinscription.description, 62, y + 12, { width: W - 134, height: 40 })
    y += 70
  }

  // ── BANDE INFÉRIEURE ──────────────────────────────────
  const footerY = H - 70
  doc.rect(0, footerY, W, 70).fill('#0f172a')

  // Ligne décorative
  doc.rect(0, footerY, W, 3).fill('#1a56db')

  doc.fontSize(9).fillColor('#94a3b8').font('Helvetica')
  doc.text('Document officiel généré par StudyGuide', 50, footerY + 15)
  doc.text('Plateforme d\'orientation universitaire au Bénin', 50, footerY + 30)

  doc.fontSize(9).fillColor('#64748b').font('Helvetica')
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, W - 200, footerY + 15)
  doc.text(`Réf. #${preinscription.id}`, W - 200, footerY + 30)

  // Filigrane statut si annulée
  if (preinscription.status === 'annulee') {
    doc.save()
    doc.rotate(-45, { origin: [W / 2, H / 2] })
    doc.fontSize(80).fillColor('#ef444420').font('Helvetica-Bold')
    doc.text('ANNULÉE', 100, H / 2 - 40, { width: W - 200, align: 'center' })
    doc.restore()
  }

  doc.end()
}

// Génère le PDF en buffer (pour l'attacher à un email)
// Génère le PDF en buffer (pour l'attacher à un email)
exports.generatePreinscriptionBuffer = (preinscription) => {
  return new Promise((resolve, reject) => {
    const PDFDocument = require('pdfkit')
    const chunks = []
    const doc = new PDFDocument({ margin: 0, size: 'A4' })

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // On recopie la logique directement ici sans appeler generatePreinscriptionPDF
    const W = doc.page.width
    const H = doc.page.height

    doc.rect(0, 0, W, 140).fill('#1a56db')
    doc.circle(W - 60, -30, 120).fill('#1448c4')
    doc.circle(W - 20, 80, 60).fill('#0e3a9e')
    doc.fontSize(28).fillColor('#ffffff').font('Helvetica-Bold').text('STUDYGUIDE', 50, 40)
    doc.fontSize(11).fillColor('#93c5fd').font('Helvetica').text('Plateforme d\'orientation universitaire', 50, 76)
    doc.rect(50, 100, 80, 3).fill('#ffffff')
    doc.fontSize(13).fillColor('#bfdbfe').font('Helvetica').text('FICHE DE PRÉINSCRIPTION', 50, 112)
    doc.fontSize(11).fillColor('#ffffff').font('Helvetica-Bold').text(`Réf. #${preinscription.id}`, W - 120, 50, { width: 90, align: 'right' })
    doc.fontSize(9).fillColor('#bfdbfe').font('Helvetica').text(
      new Date(preinscription.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      W - 140, 68, { width: 110, align: 'right' }
    )

    const statutColors = {
      pending: { bg: '#fef3c7', text: '#92400e', label: 'EN ATTENTE' },
      validee: { bg: '#d1fae5', text: '#065f46', label: 'VALIDÉE' },
      annulee: { bg: '#fee2e2', text: '#991b1b', label: 'ANNULÉE' },
    }
    const statut = statutColors[preinscription.status] || statutColors.pending
    doc.roundedRect(W - 140, 95, 110, 26, 13).fill(statut.bg)
    doc.fontSize(10).fillColor(statut.text).font('Helvetica-Bold').text(statut.label, W - 140, 103, { width: 110, align: 'center' })

    let y = 165

    const sectionTitle = (titre, sy) => {
      doc.rect(50, sy, 4, 22).fill('#1a56db')
      doc.fontSize(13).fillColor('#1e293b').font('Helvetica-Bold').text(titre, 62, sy + 3)
      return sy + 32
    }

    y = sectionTitle('Informations personnelles', y)

    doc.roundedRect(50, y, W - 100, 52, 6).fill('#f8fafc')
    doc.rect(50, y, 3, 52).fill('#1a56db')
    doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold').text('NOM COMPLET', 62, y + 10)
    doc.fontSize(16).fillColor('#0f172a').font('Helvetica-Bold').text(`${preinscription.prenom} ${preinscription.nom}`, 62, y + 26)
    y += 62

    const colW = (W - 130) / 3
    const col1 = 50, col2 = 50 + colW + 10, col3 = 50 + (colW + 10) * 2

    doc.roundedRect(col1, y, colW, 48, 6).fill('#f8fafc')
    doc.rect(col1, y, 3, 48).fill('#7c3aed')
    doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold').text('SEXE', col1 + 12, y + 10)
    doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold').text(preinscription.sexe || '—', col1 + 12, y + 24)

    doc.roundedRect(col2, y, colW, 48, 6).fill('#f8fafc')
    doc.rect(col2, y, 3, 48).fill('#0891b2')
    doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold').text('TÉLÉPHONE', col2 + 12, y + 10)
    doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold').text(preinscription.telephone || '—', col2 + 12, y + 24)

    doc.roundedRect(col3, y, colW, 48, 6).fill('#f8fafc')
    doc.rect(col3, y, 3, 48).fill('#059669')
    doc.fontSize(8).fillColor('#64748b').font('Helvetica-Bold').text('EMAIL', col3 + 12, y + 10)
    doc.fontSize(11).fillColor('#0f172a').font('Helvetica-Bold').text(preinscription.email || '—', col3 + 12, y + 24, { width: colW - 20, ellipsis: true })
    y += 62

    y = sectionTitle('Choix académiques', y)

    doc.roundedRect(50, y, W - 100, 52, 6).fill('#eff6ff')
    doc.rect(50, y, 3, 52).fill('#1a56db')
    doc.fontSize(8).fillColor('#1d4ed8').font('Helvetica-Bold').text('FILIÈRE CHOISIE', 62, y + 10)
    doc.fontSize(15).fillColor('#1e40af').font('Helvetica-Bold').text(preinscription.filiere?.nom || '—', 62, y + 26, { width: W - 140 })
    y += 62

    const halfW = (W - 115) / 2
    doc.roundedRect(50, y, halfW, 48, 6).fill('#f0fdf4')
    doc.rect(50, y, 3, 48).fill('#059669')
    doc.fontSize(8).fillColor('#166534').font('Helvetica-Bold').text('SITE UNIVERSITAIRE', 62, y + 10)
    doc.fontSize(12).fillColor('#14532d').font('Helvetica-Bold').text(preinscription.site?.nom || '—', 62, y + 24, { width: halfW - 20 })

    doc.roundedRect(55 + halfW, y, halfW, 48, 6).fill('#fdf4ff')
    doc.rect(55 + halfW, y, 3, 48).fill('#9333ea')
    doc.fontSize(8).fillColor('#6b21a8').font('Helvetica-Bold').text('VILLE', 67 + halfW, y + 10)
    doc.fontSize(12).fillColor('#581c87').font('Helvetica-Bold').text(preinscription.site?.ville || '—', 67 + halfW, y + 24)
    y += 62

    if (preinscription.description) {
      y = sectionTitle('Motivation', y)
      doc.roundedRect(50, y, W - 100, 60, 6).fill('#f8fafc')
      doc.rect(50, y, 3, 60).fill('#f59e0b')
      doc.fontSize(11).fillColor('#374151').font('Helvetica').text(preinscription.description, 62, y + 12, { width: W - 134, height: 40 })
      y += 70
    }

    const footerY = H - 70
    doc.rect(0, footerY, W, 70).fill('#0f172a')
    doc.rect(0, footerY, W, 3).fill('#1a56db')
    doc.fontSize(9).fillColor('#94a3b8').font('Helvetica').text('Document officiel généré par StudyGuide', 50, footerY + 15)
    doc.fontSize(9).fillColor('#64748b').font('Helvetica').text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      W - 200, footerY + 15
    )
    doc.text(`Réf. #${preinscription.id}`, W - 200, footerY + 30)

    doc.end()
  })
}