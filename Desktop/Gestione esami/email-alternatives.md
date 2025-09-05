# Alternative Email per Sistema Gestione Esami

## 1. Gmail + Google Apps Script (CONSIGLIATO)

### Vantaggi:
- ✅ Completamente gratuito
- ✅ Usa direttamente il tuo Gmail
- ✅ Nessun limite significativo
- ✅ Più controllo e personalizzazione

### Setup:
1. Vai su [script.google.com](https://script.google.com)
2. Nuovo progetto → "Email Reminder System"
3. Incolla questo codice:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  const subject = `${data.centroName} - Promemoria Esami ${data.type}`;
  const body = `
Gentile ${data.patientName},

Le segnaliamo che i seguenti esami risultano ${data.type}:

${data.examsList}

Si prega di provvedere quanto prima.

Cordiali saluti,
${data.centroName}
  `;
  
  try {
    MailApp.sendEmail({
      to: data.patientEmail,
      subject: subject,
      body: body
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Deploy → "New deployment" → Web app
5. Autorizza accesso Gmail
6. Copia l'URL generato

### Modifiche nell'App:
Sostituire le funzioni email in `app.js` con chiamate al Google Apps Script.

## 2. Formspree (SEMPLICE)

### Vantaggi:
- ✅ Setup in 2 minuti
- ✅ 50 email/mese gratis
- ✅ Nessuna programmazione

### Setup:
1. Vai su [formspree.io](https://formspree.io)
2. Registrati con il tuo Gmail
3. Crea nuovo form
4. Usa l'endpoint per inviare email via fetch()

## 3. Netlify Forms + Functions

### Vantaggi:
- ✅ Integrato con hosting
- ✅ 100 submission/mese gratis
- ✅ Serverless functions

### Setup:
1. Aggiungi Netlify Functions
2. Configura form handler
3. Usa endpoint per email

## 4. SMTP.js (CLIENT-SIDE)

### ⚠️ SCONSIGLIATO per sicurezza
- Credenziali esposte nel browser
- Problemi CORS
- Vulnerabilità security

## 5. Webhook + Zapier/Make

### Vantaggi:
- ✅ Interfaccia grafica
- ✅ Integrazioni multiple
- ✅ Automazioni avanzate

### Setup:
1. Account Zapier gratuito
2. Trigger: Webhook
3. Action: Send Gmail
4. Configura nell'app

## RACCOMANDAZIONE: Gmail + Google Apps Script

È la soluzione migliore perché:
- **Gratuita completamente**
- **Usa il tuo Gmail direttamente**
- **Nessun limite reale**
- **Più sicura**
- **Facile da configurare**