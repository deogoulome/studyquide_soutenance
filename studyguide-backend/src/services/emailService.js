const nodemailer = require('nodemailer')

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
  body { font-family: 'Segoe UI', sans-serif; background: #f5f7fa; margin: 0; padding: 20px; }
  .card { background: #fff; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #1a56db, #0e3f9e); border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 28px; }
  .header h1 { color: #fff; margin: 0; font-size: 22px; }
  .btn { display: inline-block; background: #1a56db; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
  .footer { text-align: center; color: #888; font-size: 13px; margin-top: 32px; }
</style></head>
<body><div class="card">
  <div class="header"><h1>StudyGuide</h1></div>
  ${contenu}
  <div class="footer">© 2025 StudyGuide — Votre guide d'orientation</div>
</div></body></html>`

exports.sendResetEmail = async (email, token, prenom) => {
  const lien = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`
  await transporter.sendMail({
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
      <a href="${lien}" class="btn">Réinitialiser mon mot de passe</a>
      <p style="color:#888;font-size:13px;margin-top:16px;">Ce lien expire dans 1 heure.</p>
    `),
  })
}

exports.sendConfirmationPreinscription = async (email, prenom, id) => {
  await transporter.sendMail({
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Confirmation de votre préinscription',
    html: baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Votre préinscription <strong>#${id}</strong> a bien été reçue.</p>
      <p>Elle est en cours de traitement. Vous serez notifié(e) par email dès qu'elle sera examinée.</p>
    `),
  })
}

exports.sendValidationEmail = async (email, prenom, statut) => {
  const estValide = statut === 'validée'
  await transporter.sendMail({
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Votre préinscription a été ${statut}`,
    html: baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Votre préinscription a été <strong>${statut}</strong>.</p>
      ${estValide ? '<p>Félicitations ! Veuillez vous rapprocher de votre site universitaire pour finaliser votre inscription.</p>' : '<p>Si vous avez des questions, n\'hésitez pas à nous contacter.</p>'}
    `),
  })
}

exports.sendReservationEmail = async (email, prenom, webinaire) => {
  await transporter.sendMail({
    from: `"StudyGuide" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Réservation confirmée — ${webinaire.titre}`,
    html: baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Votre réservation pour le webinaire <strong>${webinaire.titre}</strong> est confirmée.</p>
      <p><strong>Date :</strong> ${new Date(webinaire.date).toLocaleDateString('fr-FR')}</p>
      <p><strong>Heure :</strong> ${webinaire.heure}</p>
    `),
  })
}