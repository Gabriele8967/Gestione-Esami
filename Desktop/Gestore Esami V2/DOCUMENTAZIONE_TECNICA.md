# 🛠️ Documentazione Tecnica - Sistema Gestione Esami Centro Biofertility

## 🏗️ Architettura del Sistema

### 📁 Struttura del Progetto

```
Gestore Esami V2/
├── frontend/                     # Applicazione React/TypeScript
│   ├── src/
│   │   ├── components/          # Componenti React
│   │   │   ├── ChecklistModal.tsx       # Modal gestione checklist
│   │   │   ├── DataDaDefinireSheet.tsx  # Foglio "Data da definire"
│   │   │   ├── HighRespSheet.tsx        # Foglio "HIGH RESP"
│   │   │   ├── LowRespSheet.tsx         # Foglio "LOW RESP" 
│   │   │   ├── PmaFatte2024Sheet.tsx    # Foglio "PMA fatte 2024"
│   │   │   ├── PatientDetail.tsx        # Dettaglio paziente (legacy)
│   │   │   └── PatientList.tsx          # Lista pazienti (legacy)
│   │   ├── App.tsx              # Componente principale con tab navigation
│   │   ├── ExcelInterface.css   # Stili Excel-like e responsive
│   │   ├── index.tsx           # Entry point React
│   │   └── react-app-env.d.ts  # Type definitions
│   ├── public/                 # Asset statici
│   ├── package.json           # Dipendenze frontend
│   ├── tsconfig.json          # Configurazione TypeScript
│   └── vite.config.ts         # Configurazione Vite
├── backend/                   # API Python/FastAPI
│   ├── main.py               # Server FastAPI principale
│   ├── models.py             # Modelli database SQLAlchemy
│   ├── schemas.py            # Schemi Pydantic per validazione
│   ├── crud.py               # Operazioni CRUD database
│   ├── database.py           # Configurazione database
│   ├── seed.py               # Popolamento dati iniziali
│   ├── gestore_esami.db      # Database SQLite
│   └── requirements.txt      # Dipendenze Python
├── *.csv                     # File Excel originali convertiti
├── MANUALE_UTENTE.md         # Documentazione utente
└── DOCUMENTAZIONE_TECNICA.md # Questo documento
```

### 🎯 Stack Tecnologico

#### Frontend
- **React 19.1.1** - Framework UI
- **TypeScript 4.9.5** - Type safety
- **Vite 7.1.5** - Build tool moderno e veloce
- **Bootstrap 5.3.8** - CSS framework di base
- **React Icons 5.5.0** - Libreria icone
- **Axios 1.12.2** - HTTP client (ready per API)

#### Backend
- **Python 3.10+** - Linguaggio principale
- **FastAPI** - Framework API REST
- **SQLAlchemy** - ORM per database
- **SQLite** - Database file-based
- **Pydantic** - Validazione dati

#### Hosting & Deploy
- **Development:** Vite dev server (localhost:3000)
- **Production Ready:** Build statico deployabile
- **Database:** SQLite locale, migrazione a PostgreSQL facilmente

---

## 🚀 Setup e Installazione

### 📋 Prerequisiti

```bash
# Node.js 18+ per frontend
node --version  # >= 18.0.0
npm --version   # >= 8.0.0

# Python 3.10+ per backend
python --version  # >= 3.10.0
pip --version     # latest
```

### ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Gabriele8967/Gestione-Esami.git
cd "Gestore Esami V2"

# 2. Setup Frontend
cd frontend/
npm install
npm run dev     # Server su http://localhost:3000

# 3. Setup Backend (terminale separato)
cd ../backend/
pip install -r requirements.txt
python main.py  # Server su http://localhost:8000
```

### 🔧 Configurazione Ambiente

#### Frontend (.env)
```env
# Variabili ambiente frontend (opzionali)
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Sistema Gestione Esami Centro Biofertility
```

#### Backend (.env)
```env
# Configurazione database
DATABASE_URL=sqlite:///./gestore_esami.db

# Configurazione CORS
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Configurazione sicurezza
SECRET_KEY=your-secret-key-here
DEBUG=True
```

---

## 🏛️ Architettura Frontend

### 🎨 Pattern di Design

#### Component Structure
```typescript
// Esempio: LowRespSheet.tsx
interface LowRespData {
  id: string;           // UUID univoco
  paziente: string;     // Nome paziente
  sincro: string;       // Sincronizzazione
  // ... altri campi
  checklist?: ChecklistItem[];  // Checklist associata
}

interface HeaderColumn {
  id: string;           // UUID colonna
  label: string;        // Titolo visualizzato
  field: keyof LowRespData;  // Campo dati
  width?: number;       // Larghezza pixel
  isEsami?: boolean;    // Flag colonne speciali ESAMI
  esamiType?: 'lui' | 'lei';  // Tipo esame
}
```

#### State Management
```typescript
// Hook pattern per gestione stato
const [data, setData] = useState<LowRespData[]>([]);
const [headers, setHeaders] = useState<HeaderColumn[]>([]);
const [draggedHeader, setDraggedHeader] = useState<string | null>(null);
const [draggedRow, setDraggedRow] = useState<string | null>(null);
const [showChecklist, setShowChecklist] = useState<string | null>(null);
```

### 🔄 Drag & Drop Implementation

#### HTML5 Drag API
```typescript
// Drag handlers per header columns
const handleHeaderDragStart = (e: React.DragEvent, headerId: string) => {
  setDraggedHeader(headerId);
  e.dataTransfer.effectAllowed = 'move';
};

const handleHeaderDrop = (e: React.DragEvent, targetHeaderId: string) => {
  e.preventDefault();
  if (!draggedHeader || draggedHeader === targetHeaderId) return;

  const draggedIndex = headers.findIndex(h => h.id === draggedHeader);
  const targetIndex = headers.findIndex(h => h.id === targetHeaderId);
  
  const newHeaders = [...headers];
  const [draggedItem] = newHeaders.splice(draggedIndex, 1);
  newHeaders.splice(targetIndex, 0, draggedItem);
  
  setHeaders(newHeaders);
  setDraggedHeader(null);
};
```

### 📱 Responsive Design Strategy

#### CSS Grid + Flexbox
```css
/* Approccio mobile-first */
.excel-grid {
  display: table;
  width: 100%;
  min-width: 100%;
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .excel-cell {
    min-width: 80px;
    font-size: 12px;
  }
}

/* Mobile breakpoint */
@media (max-width: 768px) {
  .sheet-tabs {
    flex-wrap: wrap;
  }
  
  .excel-cell {
    min-width: 60px;
    font-size: 10px;
  }
}
```

---

## 🏥 Sistema Checklist

### 🎯 Template Engine

#### Struttura Template
```typescript
const checklistTemplates = {
  'esami-lui': [
    'Esame seminale completo',
    'Spermiogramma secondo OMS',
    'Test di capacitazione',
    // ...
  ],
  'esami-lei': [
    'Dosaggi ormonali (FSH, LH, E2, AMH)',
    'Ecografia pelvica transvaginale',
    // ...
  ],
  'preparazione-pma': [
    'Consenso informato firmato',
    'Documentazione ISEE',
    // ...
  ]
};
```

#### ChecklistItem Interface
```typescript
interface ChecklistItem {
  id: string;              // UUID univoco
  task: string;            // Descrizione task
  completed: boolean;      // Stato completamento
  category: string;        // Categoria template
  dueDate?: string;        // Data scadenza (ISO string)
  notes?: string;          // Note aggiuntive
}
```

### 🖨️ Print System

#### Template HTML per Stampa
```typescript
const printChecklist = () => {
  const checklistHtml = `
    <html>
      <head>
        <title>Checklist - ${patientData?.paziente}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; }
          .task { margin: 10px 0; }
          .completed { text-decoration: line-through; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Checklist Esami</h1>
          <p><strong>Paziente:</strong> ${patientData?.paziente}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Completamento:</strong> ${completionPercentage}%</p>
        </div>
        ${checklist.map(item => `<div class="task">...</div>`).join('')}
      </body>
    </html>
  `;
  // Apri finestra stampa
  const printWindow = window.open('', '_blank');
  printWindow?.document.write(checklistHtml);
  printWindow?.print();
};
```

---

## 🗄️ Backend Architecture

### 🏗️ FastAPI Structure

#### Main Application
```python
# main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, crud
from database import SessionLocal, engine

# Crea tabelle database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestione Esami API", version="1.0.0")

# Configurazione CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection per database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints REST
@app.get("/patients/", response_model=List[schemas.Patient])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_patients(db, skip=skip, limit=limit)

@app.post("/patients/", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db=db, patient=patient)

# ... altri endpoints
```

#### Database Models
```python
# models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    paziente = Column(String, index=True)
    sincro = Column(Text)
    domicilio = Column(String)
    note = Column(Text)
    sheet_type = Column(String)  # 'HIGH_RESP', 'LOW_RESP', etc.
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    # Relazione con checklist
    checklist_items = relationship("ChecklistItem", back_populates="patient")

class ChecklistItem(Base):
    __tablename__ = "checklist_items"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    task = Column(String)
    completed = Column(Boolean, default=False)
    category = Column(String)
    due_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relazione
    patient = relationship("Patient", back_populates="checklist_items")
```

#### Validation Schemas
```python
# schemas.py
from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime

class ChecklistItemBase(BaseModel):
    task: str
    completed: bool = False
    category: str
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

class ChecklistItemCreate(ChecklistItemBase):
    pass

class ChecklistItem(ChecklistItemBase):
    id: int
    patient_id: int
    
    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    paziente: str
    sincro: Optional[str] = None
    domicilio: Optional[str] = None
    note: Optional[str] = None
    sheet_type: str
    
    @validator('sheet_type')
    def validate_sheet_type(cls, v):
        allowed = ['HIGH_RESP', 'LOW_RESP', 'PMA_FATTE_2024', 'DATA_DA_DEFINIRE']
        if v not in allowed:
            raise ValueError(f'sheet_type must be one of {allowed}')
        return v

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    checklist_items: List[ChecklistItem] = []
    
    class Config:
        from_attributes = True
```

---

## 🔌 API Integration

### 🌐 Frontend-Backend Communication

#### Axios Configuration
```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors per gestione errori
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Service Layer
```typescript
// services/patientService.ts
import apiClient from './client';
import { LowRespData, ChecklistItem } from '../types';

export const patientService = {
  // GET /patients/
  async getPatients(sheetType: string): Promise<LowRespData[]> {
    const response = await apiClient.get(`/patients/?sheet_type=${sheetType}`);
    return response.data;
  },

  // POST /patients/
  async createPatient(patient: Partial<LowRespData>): Promise<LowRespData> {
    const response = await apiClient.post('/patients/', patient);
    return response.data;
  },

  // PUT /patients/{id}
  async updatePatient(id: string, patient: Partial<LowRespData>): Promise<LowRespData> {
    const response = await apiClient.put(`/patients/${id}`, patient);
    return response.data;
  },

  // DELETE /patients/{id}
  async deletePatient(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  },

  // Checklist endpoints
  async getChecklist(patientId: string): Promise<ChecklistItem[]> {
    const response = await apiClient.get(`/patients/${patientId}/checklist`);
    return response.data;
  },

  async updateChecklist(patientId: string, checklist: ChecklistItem[]): Promise<void> {
    await apiClient.put(`/patients/${patientId}/checklist`, { items: checklist });
  }
};
```

### 🔄 Real-time Sync (Future Enhancement)

#### WebSocket Integration
```typescript
// hooks/useRealTimeSync.ts
import { useEffect, useState } from 'react';

export const useRealTimeSync = (patientId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/patients/${patientId}`);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Aggiorna stato locale con modifiche remote
      handleRemoteUpdate(update);
    };
    
    return () => ws.close();
  }, [patientId]);
  
  return { isConnected };
};
```

---

## 🎨 CSS Architecture

### 🏗️ Styling Strategy

#### CSS Custom Properties
```css
/* ExcelInterface.css - Design System */
:root {
  /* Colori principali */
  --primary-color: #217346;
  --primary-gradient: linear-gradient(135deg, #0f6b3f 0%, #217346 100%);
  
  /* Colori ESAMI */
  --esami-lui-bg: linear-gradient(135deg, #e8f4fd 0%, #dbeafe 100%);
  --esami-lui-border: #3b82f6;
  --esami-lei-bg: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  --esami-lei-border: #ec4899;
  
  /* Spacing */
  --cell-padding: 8px 10px;
  --border-radius: 6px;
  
  /* Shadows */
  --shadow-light: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-heavy: 0 10px 25px rgba(0, 0, 0, 0.2);
}
```

#### Component-Scoped Styles
```css
/* Excel Grid Layout */
.excel-grid {
  display: table;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  border: 2px solid #e1e5e9;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}

.excel-cell {
  display: table-cell;
  border-right: 1px solid #e1e5e9;
  border-bottom: 1px solid #e1e5e9;
  padding: var(--cell-padding);
  vertical-align: middle;
  transition: all 0.15s ease-in-out;
}

/* Hover effects */
.excel-cell:hover {
  background-color: #e8f4fd !important;
  border-color: #4da6ff;
  z-index: 5;
}

/* ESAMI columns special styling */
.esami-lui {
  background: var(--esami-lui-bg) !important;
  border-left: 4px solid var(--esami-lui-border);
  position: relative;
}

.esami-lui::before {
  content: "♂";
  position: absolute;
  top: 2px;
  right: 4px;
  color: var(--esami-lui-border);
  font-weight: bold;
  font-size: 10px;
}
```

#### Responsive Mixins
```css
/* Responsive breakpoints */
@media (max-width: 1024px) {
  .excel-cell {
    min-width: 80px;
    font-size: 12px;
    padding: 6px 8px;
  }
}

@media (max-width: 768px) {
  .sheet-content {
    padding: 4px;
    height: calc(100vh - 120px);
  }
  
  .sheet-tabs {
    flex-wrap: wrap;
  }
  
  .sheet-tab {
    margin-bottom: 2px;
    flex: 1;
    min-width: 60px;
  }
}
```

---

## ♿ Accessibility Implementation

### 🎯 ARIA Labels & Roles

```typescript
// Esempio implementation in LowRespSheet.tsx
return (
  <div className="excel-grid" role="table" aria-label="Dati pazienti LOW RESP">
    <div className="excel-row excel-header-row" role="row">
      <div className="excel-cell row-number" role="columnheader" aria-label="Azioni">
        <MdDragIndicator />
      </div>
      {headers.map((header) => (
        <div 
          key={header.id} 
          className="excel-cell draggable-header" 
          role="columnheader" 
          aria-label={header.label}
          tabIndex={0}
          onKeyDown={handleKeyboardNavigation}
        >
          {header.label}
        </div>
      ))}
    </div>
    
    {data.map((row, rowIndex) => (
      <div key={row.id} className="excel-row" role="row">
        {/* Cells with proper ARIA labels */}
        <div className="excel-cell" role="gridcell">
          <input
            aria-label={`${header.label} riga ${rowIndex + 1}`}
            // ...
          />
        </div>
      </div>
    ))}
  </div>
);
```

### ⌨️ Keyboard Navigation

```typescript
// Keyboard navigation implementation
const handleKeyboardNavigation = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      focusNextTab();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      focusPreviousTab();
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      activateCurrentTab();
      break;
    case 'Escape':
      e.preventDefault();
      cancelCurrentEdit();
      break;
  }
};
```

### 🎨 High Contrast Support

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  .excel-cell {
    border-color: #000;
  }
  
  .excel-header-row .excel-cell {
    background: #000;
    color: #fff;
  }
  
  .esami-lui {
    background: #0066cc !important;
    color: #fff;
  }
  
  .esami-lei {
    background: #cc0066 !important;
    color: #fff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚀 Performance Optimization

### ⚡ React Optimization

#### Memoization Strategy
```typescript
// useMemo per calcoli pesanti
const filteredData = useMemo(() => {
  return data.filter(item => item.paziente.toLowerCase().includes(searchTerm));
}, [data, searchTerm]);

// useCallback per event handlers
const handleCellChange = useCallback((rowId: string, field: keyof LowRespData, value: string) => {
  setData(prev => prev.map(row => 
    row.id === rowId ? { ...row, [field]: value } : row
  ));
}, []);

// React.memo per componenti pesanti
const ExpensiveComponent = React.memo(({ data }: { data: LowRespData[] }) => {
  return <div>{/* rendering pesante */}</div>;
});
```

#### Virtual Scrolling (Future Enhancement)
```typescript
// Per dataset molto grandi
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable = ({ items }: { items: LowRespData[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <PatientRow data={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### 🗄️ Database Optimization

#### Indexing Strategy
```sql
-- Indici per performance query
CREATE INDEX idx_patients_sheet_type ON patients(sheet_type);
CREATE INDEX idx_patients_paziente ON patients(paziente);
CREATE INDEX idx_patients_created_at ON patients(created_at);
CREATE INDEX idx_checklist_patient_id ON checklist_items(patient_id);
CREATE INDEX idx_checklist_completed ON checklist_items(completed);
```

#### Query Optimization
```python
# CRUD ottimizzato con eager loading
def get_patients_with_checklist(db: Session, sheet_type: str):
    return db.query(models.Patient)\
        .options(joinedload(models.Patient.checklist_items))\
        .filter(models.Patient.sheet_type == sheet_type)\
        .all()

# Pagination per dataset grandi
def get_patients_paginated(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient)\
        .offset(skip)\
        .limit(limit)\
        .all()
```

---

## 🔐 Security Implementation

### 🛡️ Frontend Security

#### Input Sanitization
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // Solo testo
    ALLOWED_ATTR: []
  });
};

// Validate input length
const validatePatientName = (name: string): boolean => {
  const sanitized = sanitizeInput(name);
  return sanitized.length > 0 && sanitized.length <= 100;
};
```

#### XSS Prevention
```typescript
// Escape HTML in dynamic content
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

### 🏰 Backend Security

#### CORS Configuration
```python
# main.py - Configurazione CORS sicura
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

#### SQL Injection Prevention
```python
# Uso di SQLAlchemy ORM previene SQL injection
def get_patient_by_name(db: Session, patient_name: str):
    # SICURO - parametrizzato
    return db.query(models.Patient)\
        .filter(models.Patient.paziente == patient_name)\
        .first()

# EVITARE - concatenazione diretta
# query = f"SELECT * FROM patients WHERE paziente = '{patient_name}'"  # VULNERABILE
```

#### Data Validation
```python
# schemas.py - Validazione rigorosa
class PatientCreate(BaseModel):
    paziente: str = Field(..., min_length=1, max_length=100, regex=r'^[a-zA-Z\s]+$')
    domicilio: Optional[str] = Field(None, max_length=50)
    note: Optional[str] = Field(None, max_length=1000)
    
    @validator('paziente')
    def validate_patient_name(cls, v):
        if not v.strip():
            raise ValueError('Il nome paziente non può essere vuoto')
        return v.strip().title()
```

---

## 📊 Monitoring & Logging

### 📈 Performance Monitoring

#### Frontend Metrics
```typescript
// Performance monitoring
const measurePerformance = (operation: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${operation} took ${end - start} milliseconds`);
};

// Component render time
const PerformanceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`Component render time: ${end - start}ms`);
    };
  });
  
  return <>{children}</>;
};
```

#### Backend Logging
```python
# main.py - Logging configurato
import logging
from datetime import datetime

# Configurazione logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Middleware per logging richieste
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.utcnow()
    
    # Log richiesta
    logger.info(f"Request: {request.method} {request.url}")
    
    response = await call_next(request)
    
    # Log risposta
    process_time = (datetime.utcnow() - start_time).total_seconds()
    logger.info(f"Response: {response.status_code} - {process_time:.4f}s")
    
    return response
```

### 🔍 Error Tracking

#### Global Error Boundary
```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Send to logging service
    sendErrorToLoggingService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Qualcosa è andato storto.</h2>
          <button onClick={() => window.location.reload()}>
            Ricarica la pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🚀 Deployment

### 📦 Production Build

#### Frontend Build
```bash
# Build per produzione
cd frontend/
npm run build

# Output in dist/
# - index.html
# - assets/
#   - app-[hash].js
#   - app-[hash].css
#   - [vendor]-[hash].js
```

#### Backend Packaging
```bash
# Requirements.txt freeze
cd backend/
pip freeze > requirements.txt

# Docker container (opzionale)
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 🌐 Server Configuration

#### Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name yourdomain.com;
    
    # Frontend statico
    location / {
        root /var/www/gestione-esami/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API backend
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Database Migration
```python
# Produzione: PostgreSQL
# settings.py
import os
from sqlalchemy import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/gestione_esami")

engine = create_engine(DATABASE_URL)

# Migration script
def migrate_from_sqlite():
    # 1. Export data da SQLite
    # 2. Create PostgreSQL schema
    # 3. Import data
    pass
```

---

## 🧪 Testing Strategy

### ⚡ Unit Testing

#### Frontend Tests
```typescript
// LowRespSheet.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LowRespSheet from './LowRespSheet';

describe('LowRespSheet', () => {
  test('renders empty sheet correctly', () => {
    render(<LowRespSheet />);
    
    expect(screen.getByText('PAZIENTE')).toBeInTheDocument();
    expect(screen.getByText('ESAMI LUI')).toBeInTheDocument();
    expect(screen.getByText('ESAMI LEI')).toBeInTheDocument();
  });

  test('adds new patient row', async () => {
    render(<LowRespSheet />);
    
    const addButton = screen.getByText('Aggiungi Riga');
    fireEvent.click(addButton);
    
    // Verifica che una nuova riga sia stata aggiunta
    const patientInputs = screen.getAllByPlaceholderText('Nome paziente');
    expect(patientInputs).toHaveLength(2); // 1 iniziale + 1 aggiunta
  });

  test('drag and drop functionality', () => {
    render(<LowRespSheet />);
    
    const dragHandle = screen.getByTestId('drag-handle-0');
    const dropTarget = screen.getByTestId('drop-target-1');
    
    fireEvent.dragStart(dragHandle);
    fireEvent.drop(dropTarget);
    
    // Verifica che l'ordine sia cambiato
    // ...
  });
});
```

#### Backend Tests
```python
# test_main.py
import pytest
from fastapi.testclient import TestClient
from main import app, get_db
from database import SessionLocal

client = TestClient(app)

def test_create_patient():
    response = client.post(
        "/patients/",
        json={
            "paziente": "Test Patient",
            "sheet_type": "LOW_RESP",
            "domicilio": "Test City"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["paziente"] == "Test Patient"
    assert "id" in data

def test_get_patients():
    response = client.get("/patients/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_patient():
    # Crea paziente
    create_response = client.post("/patients/", json={"paziente": "Test", "sheet_type": "LOW_RESP"})
    patient_id = create_response.json()["id"]
    
    # Aggiorna
    update_response = client.put(
        f"/patients/{patient_id}",
        json={"paziente": "Updated Test", "sheet_type": "LOW_RESP"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["paziente"] == "Updated Test"
```

### 🔗 Integration Testing

#### End-to-End Tests
```typescript
// e2e/checklist.spec.ts (Playwright/Cypress)
describe('Checklist Functionality', () => {
  test('complete checklist workflow', async () => {
    // 1. Naviga alla pagina
    await page.goto('http://localhost:3000');
    
    // 2. Aggiungi nuovo paziente
    await page.click('[data-testid="add-row-button"]');
    await page.fill('[data-testid="patient-input-0"]', 'Test Patient');
    
    // 3. Apri checklist
    await page.click('[data-testid="checklist-button-0"]');
    
    // 4. Aggiungi template
    await page.click('[data-testid="template-esami-lui"]');
    
    // 5. Completa task
    await page.click('[data-testid="checkbox-0"]');
    
    // 6. Verifica progresso
    const progressText = await page.textContent('[data-testid="progress-text"]');
    expect(progressText).toContain('14%'); // 1/7 task completati
    
    // 7. Stampa checklist
    await page.click('[data-testid="print-button"]');
    // Verifica che si apra finestra stampa
  });
});
```

---

## 🔮 Future Enhancements

### 🚀 Roadmap Tecnica

#### Fase 1: Stabilizzazione (Q1 2024)
- [ ] **Database migration** da SQLite a PostgreSQL
- [ ] **Authentication & Authorization** sistema
- [ ] **Backup automatico** schedulato
- [ ] **Monitoring dashboard** per amministratori

#### Fase 2: Features Avanzate (Q2 2024)
- [ ] **Real-time collaboration** con WebSocket
- [ ] **Advanced search** e filtri
- [ ] **Export/Import** Excel/CSV
- [ ] **Notifiche** per scadenze checklist
- [ ] **Mobile app** nativa

#### Fase 3: AI Integration (Q3 2024)
- [ ] **Auto-completion** campi basato su storico
- [ ] **Predictive analytics** per tempistiche PMA
- [ ] **OCR** per digitalizzazione documenti cartacei
- [ ] **Smart templates** checklist basati su profilo paziente

#### Fase 4: Enterprise Features (Q4 2024)
- [ ] **Multi-tenant** per più centri
- [ ] **Advanced reporting** e analytics
- [ ] **Integration** con sistemi ospedalieri
- [ ] **Compliance audit** automatizzato

### 🛠️ Architettura Scalabile

#### Microservices Migration
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   React SPA     │────│   (Kong/Nginx)  │────│   (JWT/OAuth)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │  Patients   │ │  Checklist  │ │ Notification│
            │  Service    │ │  Service    │ │  Service    │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │         │         │
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ PostgreSQL  │ │   Redis     │ │  RabbitMQ   │
            │ Database    │ │   Cache     │ │   Queue     │
            └─────────────┘ └─────────────┘ └─────────────┘
```

#### Cloud Infrastructure
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api-gateway
  
  api-gateway:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
  
  patient-service:
    build: ./services/patients
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/patients
    depends_on:
      - postgres
  
  checklist-service:
    build: ./services/checklist
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/checklist
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=gestione_esami
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 📞 Supporto e Manutenzione

### 🛠️ Procedure di Manutenzione

#### Database Backup
```bash
#!/bin/bash
# backup_database.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/gestione-esami"

# Backup SQLite
cp gestore_esami.db "$BACKUP_DIR/backup_$DATE.db"

# Backup PostgreSQL (produzione)
pg_dump -h localhost -U admin gestione_esami > "$BACKUP_DIR/backup_$DATE.sql"

# Cleanup vecchi backup (conserva 30 giorni)
find "$BACKUP_DIR" -name "backup_*.db" -mtime +30 -delete
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +30 -delete
```

#### Monitoring Script
```python
# health_check.py
import requests
import smtplib
from datetime import datetime

def check_api_health():
    try:
        response = requests.get('http://localhost:8000/health', timeout=5)
        return response.status_code == 200
    except:
        return False

def check_frontend_health():
    try:
        response = requests.get('http://localhost:3000', timeout=5)
        return response.status_code == 200
    except:
        return False

def send_alert(message):
    # Invia email di allerta
    smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
    smtp_server.starttls()
    smtp_server.login('admin@biofertility.com', 'password')
    smtp_server.send_message(message)
    smtp_server.quit()

if __name__ == "__main__":
    api_ok = check_api_health()
    frontend_ok = check_frontend_health()
    
    if not api_ok or not frontend_ok:
        alert_message = f"System Health Alert - {datetime.now()}\n"
        alert_message += f"API: {'OK' if api_ok else 'FAILED'}\n"
        alert_message += f"Frontend: {'OK' if frontend_ok else 'FAILED'}"
        
        send_alert(alert_message)
```

### 📋 Checklist Deployment

```markdown
## Pre-Deploy Checklist
- [ ] Test tutti i fogli funzionano correttamente
- [ ] Test sistema checklist (template, stampa, filtri)
- [ ] Test drag & drop colonne e righe
- [ ] Test responsive su mobile/tablet
- [ ] Test accessibilità con screen reader
- [ ] Backup database corrente
- [ ] Verifica SSL certificate valido
- [ ] Test load balancer configurazione
- [ ] Monitoring alerts configurati

## Post-Deploy Checklist  
- [ ] Verifica tutti i servizi attivi
- [ ] Test funzionalità critiche
- [ ] Monitoring dashboard verificato
- [ ] Backup post-deploy completato
- [ ] Staff training programmato
- [ ] Documentazione aggiornata
- [ ] Rollback plan testato
```

---

*Documento creato: Settembre 2024*  
*Versione: 1.0*  
*Sistema: Gestione Esami Centro Biofertility*  
*Autore: Claude Code Assistant*

---

## 📚 Risorse Aggiuntive

### 📖 Documentazione di Riferimento
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Vite Documentation](https://vitejs.dev/)

### 🛠️ Tool di Sviluppo
- **IDE Consigliato:** Visual Studio Code
- **Extensions:** ES7+ React/Redux/React-Native snippets, Prettier, ESLint
- **Database Tool:** DB Browser for SQLite, pgAdmin per PostgreSQL  
- **API Testing:** Postman, Insomnia
- **Performance:** React DevTools, Chrome DevTools

### 🎯 Best Practices
- **Git Flow:** Feature branches, Pull Requests, Code Review
- **Code Style:** Prettier + ESLint configurazione
- **Commit Messages:** Conventional Commits standard
- **Security:** Regular dependency updates, security audits
- **Performance:** Lighthouse audits, Bundle analysis