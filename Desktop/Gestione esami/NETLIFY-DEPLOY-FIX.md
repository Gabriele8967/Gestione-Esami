# 🚀 Netlify Deploy - Risoluzione Errore 404

## ❌ Problema
`Page not found (404)` su Netlify indica che il deploy non è configurato correttamente.

## ✅ Soluzioni Applicate

### 1. File `_redirects` Aggiunto
- Reindirizza tutti i path verso `index.html`
- Necessario per SPA (Single Page Applications)

### 2. `netlify.toml` Aggiornato
- Build command esplicito
- Headers di sicurezza aggiunti
- Configurazione functions migliorata

### 3. Struttura File Verificata
```
/
├── index.html              ← File principale (DEVE esistere)
├── _redirects              ← Redirect rules (NUOVO)
├── netlify.toml            ← Config Netlify (AGGIORNATO)
└── tutti gli altri file...
```

## 📋 Checklist Netlify Deploy

### Opzione A: Deploy da Repository GitHub
1. **Vai su [netlify.com](https://netlify.com)**
2. **"New site from Git"**
3. **Autorizza GitHub** se richiesto
4. **Seleziona repository**: `Gabriele8967/Gestione-Esami`
5. **Build settings**:
   - Branch: `main`
   - Publish directory: `. (root)`
   - Build command: `echo 'Build complete'`
6. **Deploy**

### Opzione B: Deploy Manuale (VELOCE)
1. **Scarica ZIP** dal repository GitHub
2. **Vai su [netlify.com/drop](https://netlify.com/drop)**
3. **Trascina ZIP** nell'area
4. **Deploy automatico**

### Opzione C: Netlify CLI
```bash
# Installa Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy dalla cartella
cd "/mnt/c/Users/cucin/Desktop/Gestione esami"
netlify deploy --prod --dir .
```

## ⚙️ Configurazione Variabili Ambiente

**DOPO IL DEPLOY**, configura le variabili:

1. **Site settings** → **Environment variables**
2. **Add variable**:
   ```
   GMAIL_USER = centrimanna2@gmail.com
   GMAIL_APP_PASSWORD = vlxy nrtn tiqi faxn
   ```

## 🔍 Troubleshooting

### Build Fails?
- Controlla che `index.html` sia nella root
- Verifica `netlify.toml` syntax
- Controlla log build in Netlify dashboard

### Functions Non Funzionano?
- Variabili ambiente configurate?
- Path functions corretto: `netlify/functions/`
- Check log functions in Netlify

### 404 Persiste?
- File `_redirects` presente?
- `publish` directory = "." nel `netlify.toml`
- Cache browser: Ctrl+F5

## 🎯 URL di Test
Dopo deploy, testa:
- `https://your-site.netlify.app/` → Dovrebbe caricare l'app
- `https://your-site.netlify.app/pazienti` → Dovrebbe reindirizzare all'app
- `https://your-site.netlify.app/.netlify/functions/send-email` → Endpoint email

## 📞 Se Problemi Persistono

1. **Controlla build log** nel dashboard Netlify
2. **Verifica file structure** nel sito deployato
3. **Test API endpoints** manualmente
4. **Check browser console** per errori JS

Il deploy dovrebbe funzionare perfettamente ora! 🚀