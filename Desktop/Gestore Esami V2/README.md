# 🏥 Sistema Gestione Esami Centro Biofertility

Un'applicazione web moderna che replica l'interfaccia Excel del centro medico, con funzionalità avanzate per la gestione digitale dei pazienti e checklist mediche.

## ✨ Caratteristiche Principali

- 📊 **Interfaccia Excel-like** identica al vostro foglio attuale
- 🔄 **Drag & Drop** per riorganizzare righe e colonne
- ✅ **Sistema Checklist** integrato con template medici predefiniti
- 🎨 **Colonne ESAMI** distintive (azzurro/rosa) per Lui/Lei
- 📱 **Design Responsive** per desktop, tablet e mobile
- 🖨️ **Stampa professionale** delle checklist
- ♿ **Accessibilità completa** con supporto screen reader
- 💾 **Salvataggio automatico** di tutte le modifiche

## 🚀 Quick Start

### 📋 Prerequisiti

```bash
# Node.js 18+ per frontend
node --version  # >= 18.0.0

# Python 3.10+ per backend (opzionale)
python --version  # >= 3.10.0
```

### ⚡ Installazione Rapida

```bash
# 1. Clone del repository
git clone https://github.com/Gabriele8967/Gestione-Esami.git
cd "Gestore Esami V2"

# 2. Installa dipendenze frontend
cd frontend/
npm install

# 3. Avvia il sistema
npm run dev
```

🎉 **Il sistema sarà disponibile su:** `http://localhost:3000`

### 🔧 Setup Backend (Opzionale)

```bash
# In un terminale separato
cd backend/
pip install -r requirements.txt
python main.py
```

Backend disponibile su: `http://localhost:8000`

## 📊 Struttura Fogli

Il sistema presenta **4 fogli principali** identici al vostro Excel:

1. **🔵 HIGH RESP** - Pazienti alta responsività
2. **🔴 LOW RESP** - Pazienti bassa responsività (con colonne ESAMI speciali)
3. **✅ PMA fatte 2024** - Procedure PMA completate
4. **📅 Data da definire** - Pazienti in attesa di programmazione

## ✅ Sistema Checklist

### 🎯 Template Predefiniti

- **👨‍⚕️ Esami Lui**: Seminale, spermiogramma, cariotipo, ecc.
- **👩‍⚕️ Esami Lei**: Dosaggi ormonali, ecografie, isteroscopia, ecc.  
- **🏥 Preparazione PMA**: Consensi, farmaci, monitoraggi, ecc.

### 🛠️ Funzionalità

- ✅ **Task completion** con progress tracking
- 📅 **Date di scadenza** per ogni task
- 📝 **Note personalizzate** per ogni elemento
- 🔍 **Filtri** (tutti/completati/da fare)
- 🖨️ **Stampa formattata** delle checklist

## 🔄 Drag & Drop

### 📋 Riordino Righe
- Trascinare l'icona ⋮⋮ nella colonna numerica
- Spostare il paziente nella posizione desiderata

### 📊 Riordino Colonne  
- Trascinare l'icona ⋮⋮ nell'intestazione della colonna
- Riorganizzare i campi secondo le preferenze

## 🎨 Colonne ESAMI Speciali

Nel foglio **LOW RESP**, le colonne esami sono divise in:

- **🔵 ESAMI LUI** (sfondo azzurro con icona ♂)
- **🌸 ESAMI LEI** (sfondo rosa con icona ♀)

Questo aiuta a distinguere rapidamente gli esami per partner maschile e femminile.

## 📱 Compatibilità

- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Tablet**: Supporto touch completo
- ✅ **Mobile**: Interface ottimizzata per smartphone
- ✅ **Accessibilità**: Screen reader, keyboard navigation

## 💾 Gestione Dati

### 🔄 Salvataggio
- **Automatico**: Ogni modifica viene salvata istantaneamente
- **Locale**: I dati rimangono nel browser (localStorage)
- **Backup**: Ready per integrazione con database

### 📤 Export/Import
- **Stampa**: Layout ottimizzato per stampa professionale
- **Future**: Export Excel/CSV in sviluppo

## 🛠️ Sviluppo

### 📁 Struttura Progetto

```
frontend/
├── src/
│   ├── components/           # Componenti React
│   │   ├── ChecklistModal.tsx     # Gestione checklist
│   │   ├── HighRespSheet.tsx      # Foglio HIGH RESP
│   │   ├── LowRespSheet.tsx       # Foglio LOW RESP
│   │   ├── PmaFatte2024Sheet.tsx  # Foglio PMA fatte
│   │   └── DataDaDefinireSheet.tsx # Foglio Data da definire
│   ├── App.tsx              # Componente principale
│   ├── ExcelInterface.css   # Stili Excel-like
│   └── index.tsx           # Entry point
└── package.json            # Dipendenze

backend/                    # API Python/FastAPI (opzionale)
├── main.py                # Server principale
├── models.py              # Modelli database
├── schemas.py             # Validazione dati
└── requirements.txt       # Dipendenze Python
```

### 🔧 Scripts Disponibili

```bash
# Sviluppo
npm run dev         # Avvia dev server con hot reload

# Build produzione
npm run build       # Crea build ottimizzato in dist/

# Linting
npm run lint        # Controlla qualità codice

# Preview build
npm run preview     # Anteprima build produzione
```

### 🧪 Testing

```bash
# Test unitari (in sviluppo)
npm run test

# Test E2E (in sviluppo)  
npm run test:e2e
```

## 🚀 Deploy in Produzione

### 📦 Build & Deploy

```bash
# 1. Build produzione
npm run build

# 2. I file sono in dist/
ls dist/
# index.html
# assets/app-[hash].js
# assets/app-[hash].css

# 3. Deploy su web server
# Copia contenuto dist/ nella root del web server
```

### 🌐 Web Server Configuration

#### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/gestione-esami/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/gestione-esami/dist
    
    <Directory /var/www/gestione-esami/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## 📞 Supporto

### 📚 Documentazione
- 📖 **[Manuale Utente](MANUALE_UTENTE.md)** - Guida completa per utilizzatori
- 🛠️ **[Documentazione Tecnica](DOCUMENTAZIONE_TECNICA.md)** - Dettagli per sviluppatori

### 🆘 Risoluzione Problemi

#### Il sistema non si carica
1. Verificare connessione internet
2. Aggiornare la pagina (F5)
3. Provare browser diverso
4. Svuotare cache browser

#### Performance lente
1. Chiudere altre applicazioni pesanti
2. Verificare RAM disponibile
3. Aggiornare browser all'ultima versione

#### Dati non si salvano
1. Verificare che JavaScript sia abilitato
2. Controllare spazio disponibile browser
3. Disabilitare modalità incognito

### 📧 Contatti
- **Repository**: [GitHub](https://github.com/Gabriele8967/Gestione-Esami)
- **Issues**: [Report Bug/Feature Request](https://github.com/Gabriele8967/Gestione-Esami/issues)

## 🎯 Roadmap

### 🚧 In Sviluppo
- [ ] **Database persistente** (PostgreSQL)
- [ ] **Autenticazione utenti** 
- [ ] **Export Excel/CSV**
- [ ] **Notifiche scadenze**

### 🔮 Future Features
- [ ] **Real-time collaboration**
- [ ] **Mobile app nativa**
- [ ] **AI-powered suggestions**
- [ ] **Advanced reporting**

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. **Fork** del repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

## 📄 Licenza

Questo progetto è sviluppato specificamente per **Centro Biofertility** e non è distribuito sotto licenza open source.

## 🙏 Riconoscimenti

- **Centro Biofertility** per la fiducia e collaborazione
- **Team medico** per feedback e requisiti funzionali
- **React Team** per l'eccellente framework
- **Community Open Source** per strumenti e librerie

---

## 📊 Badge Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Private-red)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey)

---

**Sistema Gestione Esami Centro Biofertility** - Sviluppato con ❤️ per il miglioramento delle cure mediche.

*Ultimo aggiornamento: Settembre 2024*