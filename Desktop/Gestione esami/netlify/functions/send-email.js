const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Solo POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  try {
    const { patientName, patientEmail, examsList, type, centroName } = JSON.parse(event.body);

    // Validazione input
    if (!patientName || !patientEmail || !examsList || !type) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Parametri mancanti' })
      };
    }

    // Configurazione Gmail
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // centrimanna2@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD // App Password di Gmail
      }
    });

    // Template email
    const subject = `${centroName || 'Centro Biofertility'} - Promemoria Esami ${type === 'scaduto' ? 'Scaduti' : 'in Scadenza'}`;
    
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #e91e63, #c2185b); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">
          <span style="color: #ff9800;">♥</span> ${centroName || 'Centro Biofertility'}
        </h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Promemoria Esami</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Gentile <strong>${patientName}</strong>,
        </p>
        
        <p style="color: #666; margin-bottom: 20px;">
          Le segnaliamo che i seguenti esami risultano <strong style="color: ${type === 'scaduto' ? '#f44336' : '#ff9800'};">${type === 'scaduto' ? 'scaduti' : 'in scadenza'}</strong>:
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid ${type === 'scaduto' ? '#f44336' : '#ff9800'}; margin: 20px 0;">
          <ul style="margin: 0; padding-left: 20px; color: #333;">
            ${examsList.split('\n').filter(line => line.trim()).map(line => 
              `<li style="margin-bottom: 8px; line-height: 1.4;">${line.replace('- ', '')}</li>`
            ).join('')}
          </ul>
        </div>
        
        <p style="color: #666; margin: 20px 0;">
          <strong>Si prega di provvedere quanto prima.</strong>
        </p>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #1976d2;">
            <strong>📞 Per prenotazioni o informazioni:</strong><br>
            Email: centrimanna2@gmail.com<br>
            Centro Biofertility - Promemoria Esami
          </p>
        </div>
        
        <p style="color: #666; font-size: 16px; margin: 20px 0 10px 0;">
          Cordiali saluti,<br>
          <strong>Lo Staff del ${centroName || 'Centro Biofertility'}</strong>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
          Questo è un messaggio automatico generato dal sistema di gestione esami.<br>
          Non rispondere a questa email.
        </p>
      </div>
    </div>
    `;

    const textBody = `
${centroName || 'Centro Biofertility'} - Promemoria Esami

Gentile ${patientName},

Le segnaliamo che i seguenti esami risultano ${type === 'scaduto' ? 'scaduti' : 'in scadenza'}:

${examsList}

Si prega di provvedere quanto prima.

Per prenotazioni o informazioni:
Email: centrimanna2@gmail.com

Cordiali saluti,
Lo Staff del Centro Biofertility

---
Questo è un messaggio automatico. Non rispondere a questa email.
    `;

    // Opzioni email
    const mailOptions = {
      from: `"Centro Biofertility" <${process.env.GMAIL_USER}>`,
      to: patientEmail,
      subject: subject,
      text: textBody,
      html: htmlBody
    };

    // Invia email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        success: true, 
        message: `Email inviata a ${patientName} (${patientEmail})` 
      })
    };

  } catch (error) {
    console.error('Errore invio email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Errore interno del server',
        details: error.message 
      })
    };
  }
};