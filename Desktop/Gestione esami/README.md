# Sistema Gestione Esami - Centro Biofertility

Web app per la gestione unificata di pazienti ed esami medici con sistema di promemoria automatico.

## Funzionalità Principali

### 🏥 Gestione Pazienti Unificata
- **Vista singola riga per paziente** come richiesto nelle istruzioni
- Dati completi: nome, email, telefono, partner, data inizio, note
- Visualizzazione esami LEI/LUI integrata nella tabella pazienti
- Ricerca e filtri avanzati

### 📋 Sistema Checklist Esami
- **Calcolo automatico scadenze** basato su data prescrizione + giorni validità
- Esami pre-configurati per LEI e LUI
- Stati: Da fare, Fatto, Scaduto (calcolato automaticamente)
- Gestione note e dettagli per ogni esame

### ⚠️ Monitoraggio Scadenze
- **Dashboard dedicata** per esami scaduti e in scadenza
- Separazione automatica LEI/LUI
- Contatori in tempo reale
- Azioni rapide per segnare esami come completati

### 📧 Sistema Email Automatico
- **Integrazione EmailJS** (no server backend richiesto)
- Email automatiche per esami scaduti
- Email automatiche per esami in scadenza (7 giorni)
- Template personalizzabile
- Log completo degli invii

### 📊 Import/Export Excel
- **Importazione dati** da file Excel esistenti
- **Esportazione completa** in formato compatibile Excel
- Formato unificato per integrazione con file attuali
- Esportazione separata: pazienti, esami, tutto insieme

## Configurazione

### Setup Email (EmailJS)
1. Registrati su [EmailJS](https://www.emailjs.com/)
2. Crea un servizio email
3. Configura un template email con questi parametri:
   - `{{to_name}}` - Nome paziente
   - `{{to_email}}` - Email paziente  
   - `{{centro_name}}` - Nome centro
   - `{{exams_list}}` - Lista esami
   - `{{type}}` - Tipo reminder (scaduti/in scadenza)
4. Inserisci Service ID, Template ID e Public Key nella sezione Email dell'app

### Deploy su Netlify
1. Carica tutti i file in un repository Git
2. Connetti il repository a Netlify
3. La configurazione è già pronta in `netlify.toml`
4. L'app sarà disponibile al dominio assegnato da Netlify

## Struttura File
```
/
├── index.html          # Interfaccia principale
├── style.css          # Stili responsive  
├── app.js             # Logica applicazione
├── netlify.toml       # Configurazione Netlify
└── README.md          # Questa documentazione
```

## Utilizzo

### Aggiungere Pazienti
1. Tab "Pazienti" → "Aggiungi Paziente"
2. Compila i dati richiesti (nome ed email obbligatori)
3. Salva - il paziente apparirà nella tabella unificata

### Gestire Esami
1. Tab "Esami" → "Aggiungi Esame"
2. Seleziona paziente e tipo (LEI/LUI)
3. Scegli l'esame dalla lista predefinita
4. La scadenza viene calcolata automaticamente
5. Gli esami appariranno anche nella vista paziente

### Monitorare Scadenze
1. Tab "Scadenze" mostra automaticamente:
   - Esami già scaduti (rosso)
   - Esami in scadenza nei prossimi 7 giorni (arancione)
2. Possibilità di segnare rapidamente come "Fatto"

### Inviare Promemoria
1. Configura EmailJS nella sezione "Email"
2. Usa i pulsanti per inviare:
   - Promemoria esami scaduti
   - Promemoria esami in scadenza
3. Controlla il log per verificare gli invii

### Import/Export
1. **Import**: Carica file Excel esistenti (adatta il formato se necessario)
2. **Export**: Scarica dati in Excel per backup o uso con altri sistemi

## Vantaggi della Soluzione

✅ **Completamente client-side** - nessun server necessario  
✅ **Dati locali sicuri** - tutto salvato nel browser  
✅ **Vista unificata** come richiesto nelle istruzioni  
✅ **Calcolo automatico scadenze** senza controlli manuali frequenti  
✅ **Email automatiche** per ridurre il carico di lavoro  
✅ **Compatibile con file Excel esistenti**  
✅ **Interfaccia mobile-friendly**  
✅ **Deploy gratuito su Netlify**  

## Personalizzazioni Possibili

- Modificare la lista degli esami nel file `app.js`
- Personalizzare i template email
- Aggiungere nuovi campi paziente
- Modificare i giorni di validità default per gli esami
- Personalizzare l'aspetto modificando `style.css`

## Supporto

Per modifiche o supporto, contatta lo sviluppatore o modifica direttamente i file seguendo la documentazione nel codice.