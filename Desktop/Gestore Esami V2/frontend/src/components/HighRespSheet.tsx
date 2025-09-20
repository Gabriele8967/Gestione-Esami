import React, { useState, useEffect } from 'react';

interface HighRespData {
  paziente: string;
  sincro: string;
  yFino: string;
  inizioStim: string;
  invioSinc: string;
  domicilio: string;
  note: string;
  schStimFatta: string;
  nota74Invio: string;
  tipoDataPma: string;
  sed: string;
  agop: string;
  prezzo: string;
}

const HighRespSheet: React.FC = () => {
  const [data, setData] = useState<HighRespData[]>([]);

  const headers = [
    'PAZIENTE, 1 VIS, PROVENIENZA',
    'SINCRO',
    'Y fino a /arrivo Ciclo',
    'INIZIO STIM',
    'INVIO SINC cons e Lista esami',
    'DOMICILIO',
    'NOTE',
    'SCH STIM FATTA',
    'Nota74 INVIO',
    'TIPO e DATA PMA',
    'SED',
    'AGOP',
    'PREZZO'
  ];

  useEffect(() => {
    // Inizializza con una riga vuota
    if (data.length === 0) {
      addNewRow();
    }
  }, []);

  const addNewRow = () => {
    const newRow: HighRespData = {
      paziente: '',
      sincro: '',
      yFino: '',
      inizioStim: '',
      invioSinc: '',
      domicilio: '',
      note: '',
      schStimFatta: '',
      nota74Invio: '',
      tipoDataPma: '',
      sed: '',
      agop: '',
      prezzo: ''
    };
    setData(prev => [...prev, newRow]);
  };

  const handleCellChange = (rowIndex: number, field: keyof HighRespData, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setData(newData);
  };

  return (
    <div className="excel-grid">
      {/* Header Row */}
      <div className="excel-row excel-header-row">
        <div className="excel-cell row-number">#</div>
        {headers.map((header, index) => (
          <div key={index} className="excel-cell">
            {header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="excel-row">
          <div className="excel-cell row-number">{rowIndex + 1}</div>
          
          <div className="excel-cell">
            <textarea
              value={row.paziente}
              onChange={(e) => handleCellChange(rowIndex, 'paziente', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent', resize: 'none', minHeight: '40px' }}
            />
          </div>
          
          <div className="excel-cell">
            <textarea
              value={row.sincro}
              onChange={(e) => handleCellChange(rowIndex, 'sincro', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent', resize: 'none', minHeight: '40px' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.yFino}
              onChange={(e) => handleCellChange(rowIndex, 'yFino', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.inizioStim}
              onChange={(e) => handleCellChange(rowIndex, 'inizioStim', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.invioSinc}
              onChange={(e) => handleCellChange(rowIndex, 'invioSinc', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.domicilio}
              onChange={(e) => handleCellChange(rowIndex, 'domicilio', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <textarea
              value={row.note}
              onChange={(e) => handleCellChange(rowIndex, 'note', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent', resize: 'none', minHeight: '40px' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.schStimFatta}
              onChange={(e) => handleCellChange(rowIndex, 'schStimFatta', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.nota74Invio}
              onChange={(e) => handleCellChange(rowIndex, 'nota74Invio', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.tipoDataPma}
              onChange={(e) => handleCellChange(rowIndex, 'tipoDataPma', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.sed}
              onChange={(e) => handleCellChange(rowIndex, 'sed', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.agop}
              onChange={(e) => handleCellChange(rowIndex, 'agop', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.prezzo}
              onChange={(e) => handleCellChange(rowIndex, 'prezzo', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
        </div>
      ))}
      
      {/* Add new row button */}
      <div className="excel-row">
        <div className="excel-cell row-number">+</div>
        <div className="excel-cell" style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          <button 
            onClick={() => setData([...data, {
              paziente: '',
              sincro: '',
              yFino: '',
              inizioStim: '',
              invioSinc: '',
              domicilio: '',
              note: '',
              schStimFatta: '',
              nota74Invio: '',
              tipoDataPma: '',
              sed: '',
              agop: '',
              prezzo: ''
            }])}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: '100%' }}
          >
            Aggiungi nuova riga
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighRespSheet;