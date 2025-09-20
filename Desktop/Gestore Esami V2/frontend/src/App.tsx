
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ExcelInterface.css';
import HighRespSheet from './components/HighRespSheet';
import LowRespSheet from './components/LowRespSheet';
import PmaFatte2024Sheet from './components/PmaFatte2024Sheet';
import DataDaDefinireSheet from './components/DataDaDefinireSheet';

function App() {
  const [activeSheet, setActiveSheet] = useState('HIGH_RESP');

  const sheets = [
    { id: 'HIGH_RESP', label: 'HIGH RESP' },
    { id: 'LOW_RESP', label: 'LOW RESP' },
    { id: 'PMA_FATTE_2024', label: 'PMA fatte 2024' },
    { id: 'DATA_DA_DEFINIRE', label: 'Data da definire' }
  ];

  const renderActiveSheet = () => {
    switch (activeSheet) {
      case 'HIGH_RESP':
        return <HighRespSheet />;
      case 'LOW_RESP':
        return <LowRespSheet />;
      case 'PMA_FATTE_2024':
        return <PmaFatte2024Sheet />;
      case 'DATA_DA_DEFINIRE':
        return <DataDaDefinireSheet />;
      default:
        return <HighRespSheet />;
    }
  };

  return (
    <div className="excel-interface" role="application" aria-label="Sistema Gestione Esami Centro Biofertility">
      <header className="excel-header">
        <h1 className="excel-title">PROGRAMMA CENTRO BIOFERTILITY</h1>
      </header>
      
      <nav className="sheet-tabs" role="tablist" aria-label="Fogli di lavoro">
        {sheets.map(sheet => (
          <button
            key={sheet.id}
            className={`sheet-tab ${activeSheet === sheet.id ? 'active' : ''}`}
            onClick={() => setActiveSheet(sheet.id)}
            role="tab"
            aria-selected={activeSheet === sheet.id}
            aria-controls={`sheet-${sheet.id}`}
            tabIndex={activeSheet === sheet.id ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                const currentIndex = sheets.findIndex(s => s.id === activeSheet);
                const nextIndex = (currentIndex + 1) % sheets.length;
                setActiveSheet(sheets[nextIndex].id);
              } else if (e.key === 'ArrowLeft') {
                const currentIndex = sheets.findIndex(s => s.id === activeSheet);
                const prevIndex = currentIndex === 0 ? sheets.length - 1 : currentIndex - 1;
                setActiveSheet(sheets[prevIndex].id);
              }
            }}
          >
            {sheet.label}
          </button>
        ))}
      </nav>

      <main 
        className="sheet-content" 
        role="tabpanel" 
        id={`sheet-${activeSheet}`}
        aria-labelledby={`tab-${activeSheet}`}
      >
        {renderActiveSheet()}
      </main>
    </div>
  );
}

export default App;
