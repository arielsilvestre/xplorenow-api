const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const sendVerificationEmail = async (toEmail, code) => {
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: 'Verificá tu cuenta en XploreNow',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
        <h2 style="color:#1565C0">XploreNow</h2>
        <p>Gracias por registrarte. Ingresá el siguiente código para verificar tu cuenta:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#00897B;text-align:center;padding:24px 0">${code}</div>
        <p style="color:#666;font-size:13px">Este código vence en 10 minutos. Si no te registraste en XploreNow, ignorá este email.</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (toEmail, code) => {
  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: 'Recuperá tu contraseña — XploreNow',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
        <h2 style="color:#1565C0">XploreNow</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña. Usá el siguiente código:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#00897B;text-align:center;padding:24px 0">${code}</div>
        <p style="color:#666;font-size:13px">Este código vence en 10 minutos. Si no solicitaste esto, ignorá este email.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
