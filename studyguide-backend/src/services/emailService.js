const nodemailer = require('nodemailer')
const pdfService = require('./pdfService')
const { Preinscription, Filiere, SiteUniversite } = require('../models')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const baseTemplate = (contenu) => `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family: 'Segoe UI', sans-serif; background: #f1f5f9; margin: 0; padding: 20px; }
  .wrap { max-width: 600px; margin: 0 auto; }
  .header { background: linear-gradient(135deg, #1a56db, #7c3aed); border-radius: 16px 16px 0 0; padding: 32px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
  .header p { color: #bfdbfe; margin: 6px 0 0; font-size: 13px; }
  .body { background: #fff; padding: 36px; border-radius: 0 0 16px 16px; }
  .btn { display: inline-block; background: #1a56db; color: #fff !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; margin-top: 20px; font-size: 15px; }
  .info-row { display: flex; gap: 12px; margin: 8px 0; }
  .info-box { flex: 1; background: #f8fafc; border-radius: 10px; padding: 14px; border-left: 3px solid #1a56db; }
  .info-box .label { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
  .info-box .value { font-size: 14px; color: #0f172a; font-weight: 600; }
  .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; }
  .badge-pending { background: #fef3c7; color: #92400e; }
  .badge-validee { background: #d1fae5; color: #065f46; }
  .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px; }
</style></head>
<body><div class="wrap">
  <div class="header">
    <h1>StudyGuide</h1>
    <p>Plateforme d'orientation universitaire au Bénin</p>
  </div>
  <div class="body">${contenu}</div>
  <div class="footer">© ${new Date().getFullYear()} StudyGuide — Tous droits réservés</div>
</div></body></html>`

exports.sendResetEmail = async (email, token, prenom) => {
  const lien = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`
  await transporter.sendMail({
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe — StudyGuide',
    html: baseTemplate(`
      <p style="font-size:16px;color:#0f172a;">Bonjour <strong>${prenom}</strong>,</p>
      <p style="color:#475569;">Vous avez demandé à réinitialiser votre mot de passe.</p>
      <a href="${lien}" class="btn">Réinitialiser mon mot de passe</a>
      <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `),
  })
}

exports.sendConfirmationPreinscription = async (email, prenom, preinscriptionId) => {
  // Récupérer les détails complets pour le PDF
  const preinscription = await Preinscription.findByPk(preinscriptionId, {
    include: [
      { model: Filiere, as: 'filiere' },
      { model: SiteUniversite, as: 'site' },
    ],
  })

  // Générer le PDF en buffer
  let pdfBuffer = null
  try {
    pdfBuffer = await pdfService.generatePreinscriptionBuffer(preinscription)
  } catch (e) {
    console.warn('⚠️ PDF non généré pour email:', e.message)
  }

  const mailOptions = {
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Confirmation de préinscription #${preinscriptionId} — StudyGuide`,
    html: baseTemplate(`
      <p style="font-size:16px;color:#0f172a;">Bonjour <strong>${prenom}</strong>,</p>
      <p style="color:#475569;line-height:1.7;">
        Votre préinscription a bien été reçue et est en cours de traitement.
        Vous trouverez ci-joint votre fiche de préinscription en PDF.
      </p>
      <div class="info-row">
        <div class="info-box">
          <div class="label">Référence</div>
          <div class="value">#${preinscriptionId}</div>
        </div>
        <div class="info-box">
          <div class="label">Filière</div>
          <div class="value">${preinscription?.filiere?.nom || '—'}</div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-box">
          <div class="label">Site</div>
          <div class="value">${preinscription?.site?.nom || '—'}</div>
        </div>
        <div class="info-box">
          <div class="label">Statut</div>
          <div class="value"><span class="badge badge-pending">En attente</span></div>
        </div>
      </div>
      <p style="color:#475569;margin-top:20px;font-size:14px;">
        Vous serez notifié(e) par email dès que votre dossier sera examiné par le responsable universitaire.
      </p>
    `),
  }

  // Attacher le PDF si généré
  if (pdfBuffer) {
    mailOptions.attachments = [{
      filename: `preinscription-${preinscriptionId}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }]
  }

  await transporter.sendMail(mailOptions)
}

exports.sendValidationEmail = async (email, prenom, statut) => {
  const estValide = statut === 'validée'
  await transporter.sendMail({
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Votre préinscription a été ${statut} — StudyGuide`,
    html: baseTemplate(`
      <p style="font-size:16px;color:#0f172a;">Bonjour <strong>${prenom}</strong>,</p>
      <p style="color:#475569;line-height:1.7;">
        Votre préinscription a été <strong>${statut}</strong>.
      </p>
      ${estValide
        ? `<div style="background:#d1fae5;border-radius:12px;padding:20px;margin:16px 0;border-left:4px solid #059669;">
            <p style="color:#065f46;margin:0;font-weight:600;">🎉 Félicitations !</p>
            <p style="color:#065f46;margin:8px 0 0;font-size:14px;">
              Veuillez vous rapprocher de votre site universitaire avec vos documents originaux pour finaliser votre inscription.
            </p>
           </div>`
        : `<div style="background:#fee2e2;border-radius:12px;padding:20px;margin:16px 0;border-left:4px solid #ef4444;">
            <p style="color:#991b1b;margin:0;font-size:14px;">
              Si vous avez des questions, n'hésitez pas à nous contacter ou à soumettre une nouvelle préinscription.
            </p>
           </div>`
      }
    `),
  })
}

exports.sendReservationEmail = async (email, prenom, webinaire) => {
  await transporter.sendMail({
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Réservation confirmée — ${webinaire.titre}`,
    html: baseTemplate(`
      <p style="font-size:16px;color:#0f172a;">Bonjour <strong>${prenom}</strong>,</p>
      <p style="color:#475569;">Votre réservation est confirmée !</p>
      <div class="info-row">
        <div class="info-box">
          <div class="label">Webinaire</div>
          <div class="value">${webinaire.titre}</div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-box">
          <div class="label">Date</div>
          <div class="value">${new Date(webinaire.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div class="info-box">
          <div class="label">Heure</div>
          <div class="value">${webinaire.heure}</div>
        </div>
      </div>
      <p style="color:#475569;font-size:14px;margin-top:16px;">
        Un lien de connexion vous sera envoyé la veille du webinaire.
      </p>
    `),
  })
}