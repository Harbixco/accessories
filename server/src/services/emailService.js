const nodemailer = require('nodemailer');

// Create transporter from environment variables or create simulated transporter
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    // Development mode fallback (logs formatted emails cleanly)
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n============================================================');
        console.log('📧 [EMAIL NOTIFICATION SERVICE - DISPATCH]');
        console.log(`TO: ${mailOptions.to}`);
        console.log(`SUBJECT: ${mailOptions.subject}`);
        console.log('------------------------------------------------------------');
        console.log(`TEXT PREVIEW: ${mailOptions.text || mailOptions.html?.substring(0, 200)}...`);
        console.log('============================================================\n');
        return { messageId: 'simulated-' + Date.now(), accepted: [mailOptions.to] };
      },
    };
  }

  return transporter;
};

/**
 * 1. Alert BC Accessories Admin when a new dealer submits a registration
 */
const sendDealerRegistrationAdminAlert = async (dealer) => {
  const mailer = getTransporter();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'b2b-admin@bc-accessories.de';
  const fromEmail = process.env.SMTP_FROM || '"BC Accessories System" <noreply@bc-accessories.de>';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const billing = dealer.billingAddress || {};
  const addressStr = `${billing.street || ''}, ${billing.postalCode || ''} ${billing.city || ''}, ${billing.country || 'Deutschland'}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #212529; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #dee2e6; border-radius: 6px; overflow: hidden; }
        .header { background: #0B1E3F; color: #ffffff; padding: 20px 24px; }
        .header h2 { margin: 0; font-size: 18px; }
        .content { padding: 24px; font-size: 13px; line-height: 1.6; }
        .table { width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 20px; font-size: 12px; }
        .table td { padding: 8px 10px; border-bottom: 1px solid #edf2f7; }
        .table td.label { font-weight: bold; width: 35%; color: #4a5568; background-color: #f8fafc; }
        .badge { display: inline-block; background: #fef3c7; color: #92400e; font-weight: bold; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
        .btn { display: inline-block; background: #0B1E3F; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 10px; }
        .footer { background: #f8f9fa; border-top: 1px solid #edf2f7; padding: 14px 24px; font-size: 11px; color: #718096; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>Neuer Händler-Registrierungsantrag</h2>
        </div>
        <div class="content">
          <p>Hallo Admin-Team,</p>
          <p>ein neuer gewerblicher Fachhändler hat soeben ein B2B-Konto beantragt und wartet auf Freischaltung:</p>
          
          <table class="table">
            <tr>
              <td class="label">Unternehmen:</td>
              <td><strong>${dealer.companyName}</strong> (${dealer.legalForm || 'GmbH'})</td>
            </tr>
            <tr>
              <td class="label">USt-IdNr.:</td>
              <td><strong style="font-family: monospace; font-size: 13px; color: #0B1E3F;">${dealer.vatId}</strong></td>
            </tr>
            <tr>
              <td class="label">Ansprechpartner:</td>
              <td>${dealer.contactName}</td>
            </tr>
            <tr>
              <td class="label">E-Mail:</td>
              <td><a href="mailto:${dealer.email}">${dealer.email}</a></td>
            </tr>
            <tr>
              <td class="label">Telefon:</td>
              <td>${dealer.phone}</td>
            </tr>
            <tr>
              <td class="label">Anschrift:</td>
              <td>${addressStr}</td>
            </tr>
            <tr>
              <td class="label">Aktueller Status:</td>
              <td><span class="badge">In Prüfung (pending)</span></td>
            </tr>
          </table>

          <p>Bitte prüfen Sie die USt-IdNr. im VIES / BZSt Portal und schalten Sie das Händlerkonto im Admin-Dashboard frei:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${clientUrl}/admin" class="btn">Antrag im Admin-Portal prüfen & freigeben →</a>
          </div>
        </div>
        <div class="footer">
          BC Accessories GmbH &bull; B2B Distribution &bull; Industriestraße 18, 60327 Frankfurt am Main
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    return await mailer.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: `[BC Accessories] Neuer Händlerantrag: ${dealer.companyName} (${dealer.vatId})`,
      html,
    });
  } catch (err) {
    console.error('Failed to send admin alert email:', err.message);
  }
};

/**
 * 2. Notify Dealer once their B2B account has been verified and approved
 */
const sendDealerApprovalNotification = async (dealer) => {
  const mailer = getTransporter();
  const fromEmail = process.env.SMTP_FROM || '"BC Accessories Fachhandel" <b2b@bc-accessories.de>';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #212529; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #dee2e6; border-radius: 6px; overflow: hidden; }
        .header { background: #0B1E3F; color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: bold; }
        .content { padding: 28px 24px; font-size: 13px; line-height: 1.6; }
        .benefits { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 18px 0; }
        .benefits ul { margin: 0; padding-left: 18px; }
        .benefits li { margin-bottom: 6px; }
        .btn { display: inline-block; background: #00d2c4; color: #061224 !important; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-weight: bold; font-size: 13px; margin: 16px 0; }
        .footer { background: #f8f9fa; border-top: 1px solid #edf2f7; padding: 16px 24px; font-size: 11px; color: #718096; text-align: center; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Herzlich willkommen bei BC Accessories!</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #00d2c4; font-weight: 600;">Ihr Fachhändlerkonto wurde erfolgreich freigeschaltet</p>
        </div>
        <div class="content">
          <p>Guten Tag ${dealer.contactName || 'Partner'},</p>
          <p>wir freuen uns, Ihnen mitteilen zu können, dass Ihre gewerbliche Registrierung für <strong>${dealer.companyName}</strong> (USt-IdNr.: ${dealer.vatId}) geprüft und für den Großhandel freigeschaltet wurde.</p>
          
          <div class="benefits">
            <strong style="color: #0B1E3F; display: block; margin-bottom: 8px;">Ihre B2B-Konditionen sind ab sofort aktiv:</strong>
            <ul>
              <li><strong>Großhandelspreise netto:</strong> Exklusive Händlereinkaufspreise und Mengenstaffeln ab Stück 1.</li>
              <li><strong>Schnellbestellung per CSV-Liste:</strong> Laden Sie Hunderte Artikel direkt per Excel/CSV hoch.</li>
              <li><strong>Same-Day Versand:</strong> Bestellen Sie Mo–Fr bis 14:00 Uhr für den sofortigen Versand per DHL & UPS Express.</li>
              <li><strong>Frachtfrei ab 500 € netto:</strong> Kostenlose Lieferung ab unserem deutschen Zentrallager Frankfurt.</li>
            </ul>
          </div>

          <p style="text-align: center;">
            <a href="${clientUrl}/login" class="btn">Jetzt anmelden & Händlerpreise einsehen →</a>
          </p>

          <p>Bei Fragen steht Ihnen unser Großhandels-Support jederzeit gerne zur Verfügung:<br>
          Telefon: <strong>+49 (0) 69 98765432</strong> (Mo–Fr 09:00 – 16:00 Uhr)<br>
          E-Mail: <a href="mailto:b2b@bc-accessories.de">b2b@bc-accessories.de</a></p>
        </div>
        <div class="footer">
          BC Accessories GmbH &bull; Großhandelszentrum für Mobilfunkzubehör<br>
          Industriestraße 18, 60327 Frankfurt am Main &bull; Amtsgericht Frankfurt HRB 114829
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    return await mailer.sendMail({
      from: fromEmail,
      to: dealer.email,
      subject: `Ihre B2B-Freischaltung bei BC Accessories GmbH (${dealer.companyName})`,
      html,
    });
  } catch (err) {
    console.error('Failed to send dealer approval email:', err.message);
  }
};

module.exports = {
  sendDealerRegistrationAdminAlert,
  sendDealerApprovalNotification,
};
