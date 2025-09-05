# 🚀 Setup Netlify Functions con Gmail

## Prerequisiti Gmail

### 1. Attivare Autenticazione a 2 Fattori
1. Vai su [myaccount.google.com](https://myaccount.google.com)
2. **Sicurezza** → **Verifica in due passaggi**
3. **Attiva** se non è già attivo

### 2. Generare App Password
1. **Sicurezza** → **Password per le app**
2. Seleziona **Mail** e **Altro (nome personalizzato)**
3. Inserisci **"Netlify Functions"**
4. **Copia la password** di 16 caratteri generata
5. **Salvala** (non sarà più visibile)

## Deploy su Netlify

### Opzione A: Da Repository Git
1. **Carica tutti i file** in un repository GitHub/GitLab
2. **Connetti repository** a Netlify
3. **Build settings** sono già configurati in `netlify.toml`

### Opzione B: Deploy Manuale
1. **Comprimi tutti i file** in un ZIP
2. **Trascina il ZIP** su netlify.com/drop
3. **Netlify** farà il deploy automaticamente

## Configurazione Variabili Ambiente

### Nel Dashboard Netlify:
1. Vai al tuo **sito** → **Site settings**
2. **Environment variables** → **Add variable**
3. Aggiungi queste variabili:

```
GMAIL_USER = centrimanna2@gmail.com
GMAIL_APP_PASSWORD = [la password di 16 caratteri generata]
```

### ⚠️ Importante:
- **NON** mettere mai le credenziali nei file di codice
- **Usa solo** le variabili ambiente di Netlify
- **La App Password** è diversa dalla password normale Gmail

## Test del Sistema

### Dopo il deploy:
1. **Apri la tua app** Netlify
2. **Aggiungi un paziente test** con la tua email
3. **Crea un esame scaduto** (data passata)
4. **Tab Scadenze** → verifica che appaia
5. **Tab Email** → **"Invia Reminder Scaduti"**
6. **Controlla la tua email** per verificare l'invio

## Struttura File Deploy

```
/
├── index.html                    # App principale
├── style.css                    # Stili
├── app.js                       # Logica JavaScript
├── package.json                 # Dipendenze Node
├── netlify.toml                 # Config Netlify
├── netlify/
│   └── functions/
│       └── send-email.js        # Function email
├── .env.example                 # Template variabili
├── SETUP-NETLIFY.md            # Questa guida
└── README.md                   # Documentazione

```

## Troubleshooting

### Email non arrivano?
- ✅ **Variabili ambiente** configurate correttamente
- ✅ **App Password** Gmail valida
- ✅ **Funzioni Netlify** attive
- ✅ **Controlla spam/junk**

### Errori Functions?
- Controlla **Functions log** nel dashboard Netlify
- Verifica **sintassi** in `send-email.js`
- Testa **endpoint** manualmente

### Problemi CORS?
- Headers CORS già configurati
- Se persiste, controlla **dominio** Netlify

## Vantaggi Netlify Functions

✅ **100 invocazioni/mese** gratis  
✅ **Serverless** - nessun server da gestire  
✅ **Scaling automatico**  
✅ **Sicurezza** variabili ambiente  
✅ **Logs integrati**  
✅ **HTTPS** automatico  

## Costi

- **Netlify**: Gratuito fino a 100 Functions/mese
- **Gmail**: Gratuito (limiti standard Gmail)
- **Hosting**: Gratuito su Netlify

La soluzione è **completamente gratuita** per uso normale! 🎉