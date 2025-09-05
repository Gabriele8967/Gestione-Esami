# Adeguamenti GDPR Necessari

## 1. BANNER CONSENSO GDPR

Aggiungere in index.html prima del tag </body>:

```html
<!-- GDPR Consent Banner -->
<div id="gdprBanner" class="gdpr-banner" style="display: none;">
    <div class="gdpr-content">
        <h4><i class="fas fa-shield-alt"></i> Privacy e Dati Personali</h4>
        <p>Questo sistema salva i dati dei pazienti solo nel tuo browser (LocalStorage). 
        Nessun dato viene inviato a server esterni, eccetto per l'invio email.</p>
        <div class="gdpr-actions">
            <button class="btn btn-primary" onclick="acceptGDPR()">Accetto</button>
            <button class="btn btn-secondary" onclick="showPrivacyPolicy()">Leggi Informativa</button>
        </div>
    </div>
</div>
```

## 2. INFORMATIVA PRIVACY COMPLETA

Modal da aggiungere:

```html
<!-- Privacy Policy Modal -->
<div id="privacyModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Informativa Privacy - Centro Biofertility</h3>
            <span class="close" onclick="closeModal('privacyModal')">&times;</span>
        </div>
        <div class="modal-body privacy-content">
            <h4>Finalità del Trattamento</h4>
            <p>I dati vengono utilizzati per la gestione degli esami medici e l'invio di promemoria.</p>
            
            <h4>Base Giuridica</h4>
            <p>Consenso dell'interessato (Art. 6.1.a GDPR) e interesse legittimo per cure mediche.</p>
            
            <h4>Modalità di Conservazione</h4>
            <p>I dati sono salvati esclusivamente nel browser locale (LocalStorage). 
            Nessun dato viene trasmesso a server esterni, eccetto per l'invio email tramite Gmail.</p>
            
            <h4>I Tuoi Diritti</h4>
            <ul>
                <li><strong>Accesso:</strong> Puoi visualizzare tutti i tuoi dati nell'applicazione</li>
                <li><strong>Rettifica:</strong> Puoi modificare i dati tramite le funzioni di modifica</li>
                <li><strong>Cancellazione:</strong> Puoi eliminare tutti i dati con il pulsante "Elimina Tutti i Dati"</li>
                <li><strong>Portabilità:</strong> Puoi esportare i dati in Excel</li>
            </ul>
            
            <h4>Contatti</h4>
            <p>Per questioni privacy: centrimanna2@gmail.com</p>
        </div>
    </div>
</div>
```

## 3. FUNZIONI JAVASCRIPT DA AGGIUNGERE

```javascript
// GDPR Consent Management
class GDPRManager {
    constructor() {
        this.consentKey = 'gdpr-consent';
        this.checkConsent();
    }

    checkConsent() {
        const consent = localStorage.getItem(this.consentKey);
        if (!consent) {
            this.showGDPRBanner();
        }
    }

    showGDPRBanner() {
        document.getElementById('gdprBanner').style.display = 'block';
    }

    acceptGDPR() {
        localStorage.setItem(this.consentKey, 'accepted');
        document.getElementById('gdprBanner').style.display = 'none';
    }

    revokeConsent() {
        localStorage.removeItem(this.consentKey);
        this.deleteAllData();
        location.reload();
    }

    deleteAllData() {
        localStorage.removeItem('patients');
        localStorage.removeItem('exams');
        localStorage.removeItem('emailConfig');
    }
}
```

## 4. PULSANTE ELIMINA TUTTI I DATI

Aggiungere nella sezione Import/Export:

```html
<div class="gdpr-section">
    <h3>Gestione Privacy</h3>
    <button class="btn btn-danger" onclick="deleteAllData()">
        <i class="fas fa-trash"></i> Elimina Tutti i Dati
    </button>
    <button class="btn btn-info" onclick="showPrivacyPolicy()">
        <i class="fas fa-shield-alt"></i> Informativa Privacy
    </button>
</div>
```

## 5. CSS DA AGGIUNGERE

```css
.gdpr-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #2c3e50;
    color: white;
    padding: 20px;
    z-index: 10000;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
}

.gdpr-content h4 {
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.gdpr-actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
}

.privacy-content {
    max-height: 60vh;
    overflow-y: auto;
}

.privacy-content h4 {
    color: var(--primary-color);
    margin-top: 20px;
    margin-bottom: 10px;
}

.gdpr-section {
    background: #fff5f5;
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid #f44336;
    margin-bottom: 20px;
}
```

## 6. REGISTRO TRATTAMENTI

Documentare:
- Finalità: Gestione esami medici
- Base giuridica: Consenso + Interesse legittimo
- Categorie dati: Anagrafici + Sanitari
- Conservazione: Browser locale
- Destinatari: Solo Gmail per invio email
- Misure sicurezza: HTTPS, LocalStorage, No server