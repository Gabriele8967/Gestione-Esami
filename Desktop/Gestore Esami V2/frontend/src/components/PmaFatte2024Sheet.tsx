import React, { useState, useEffect } from 'react';

interface PmaFatte2024Data {
  paziente: string;
  sincro: string;
  col3: string;
  note: string;
  scheda: string;
  col6: string;
  tipoPma: string;
  col8: string;
  col9: string;
  info: string;
  prezzo1: string;
  prezzo2: string;
  col13: string;
  col14: string;
  col15: string;
  stato: string;
}

const PmaFatte2024Sheet: React.FC = () => {
  const [data, setData] = useState<PmaFatte2024Data[]>([]);

  const headers = [
    'PAZIENTE',
    'SINCRO',
    '',
    'NOTE STIMOLAZIONE',
    'SCHEDA',
    '',
    'TIPO PMA',
    '',
    '',
    'INFO AGGIUNTIVE',
    'PREZZO 1',
    'PREZZO 2',
    '',
    '',
    '',
    'STATO'
  ];

  useEffect(() => {
    // Inizializza con una riga vuota
    if (data.length === 0) {
      addNewRow();
    }
  }, []);

  const addNewRow = () => {
    const newRow: PmaFatte2024Data = {
      paziente: '',
      sincro: '',
      col3: '',
      note: '',
      scheda: '',
      col6: '',
      tipoPma: '',
      col8: '',
      col9: '',
      info: '',
      prezzo1: '',
      prezzo2: '',
      col13: '',
      col14: '',
      col15: '',
      stato: ''
    };
    setData(prev => [...prev, newRow]);
  };

  const handleCellChange = (rowIndex: number, field: keyof PmaFatte2024Data, value: string) => {
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
            <input
              type="text"
              value={row.paziente}
              onChange={(e) => handleCellChange(rowIndex, 'paziente', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.sincro}
              onChange={(e) => handleCellChange(rowIndex, 'sincro', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col3}
              onChange={(e) => handleCellChange(rowIndex, 'col3', e.target.value)}
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
              value={row.scheda}
              onChange={(e) => handleCellChange(rowIndex, 'scheda', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col6}
              onChange={(e) => handleCellChange(rowIndex, 'col6', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.tipoPma}
              onChange={(e) => handleCellChange(rowIndex, 'tipoPma', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col8}
              onChange={(e) => handleCellChange(rowIndex, 'col8', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col9}
              onChange={(e) => handleCellChange(rowIndex, 'col9', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.info}
              onChange={(e) => handleCellChange(rowIndex, 'info', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.prezzo1}
              onChange={(e) => handleCellChange(rowIndex, 'prezzo1', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.prezzo2}
              onChange={(e) => handleCellChange(rowIndex, 'prezzo2', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col13}
              onChange={(e) => handleCellChange(rowIndex, 'col13', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col14}
              onChange={(e) => handleCellChange(rowIndex, 'col14', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col15}
              onChange={(e) => handleCellChange(rowIndex, 'col15', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <select
              value={row.stato}
              onChange={(e) => handleCellChange(rowIndex, 'stato', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            >
              <option value="">-</option>
              <option value="COMPLETATO">COMPLETATO</option>
              <option value="IN CORSO">IN CORSO</option>
              <option value="DECLINATO">DECLINATO</option>
            </select>
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
              col3: '',
              note: '',
              scheda: '',
              col6: '',
              tipoPma: '',
              col8: '',
              col9: '',
              info: '',
              prezzo1: '',
              prezzo2: '',
              col13: '',
              col14: '',
              col15: '',
              stato: ''
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

export default PmaFatte2024Sheet;