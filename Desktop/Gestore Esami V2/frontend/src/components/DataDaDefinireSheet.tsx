import React, { useState, useEffect } from 'react';

interface DataDaDefinireData {
  col1: string;
  paziente: string;
  note: string;
  problemi: string;
  ciclo: string;
  col6: string;
  tipoPma: string;
  col8: string;
  col9: string;
  col10: string;
  col11: string;
  col12: string;
  col13: string;
  col14: string;
  col15: string;
  stato: string;
}

const DataDaDefinireSheet: React.FC = () => {
  const [data, setData] = useState<DataDaDefinireData[]>([]);

  const headers = [
    '',
    'PAZIENTE',
    'NOTE GENERALI',
    'PROBLEMI/REQUISITI',
    'CICLO',
    '',
    'TIPO PMA',
    '',
    '',
    '',
    '',
    '',
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
    const newRow: DataDaDefinireData = {
      col1: '',
      paziente: '',
      note: '',
      problemi: '',
      ciclo: '',
      col6: '',
      tipoPma: '',
      col8: '',
      col9: '',
      col10: '',
      col11: '',
      col12: '',
      col13: '',
      col14: '',
      col15: '',
      stato: ''
    };
    setData(prev => [...prev, newRow]);
  };

  const handleCellChange = (rowIndex: number, field: keyof DataDaDefinireData, value: string) => {
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
              value={row.col1}
              onChange={(e) => handleCellChange(rowIndex, 'col1', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.paziente}
              onChange={(e) => handleCellChange(rowIndex, 'paziente', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent', fontWeight: 'bold' }}
            />
          </div>
          
          <div className="excel-cell">
            <textarea
              value={row.note}
              onChange={(e) => handleCellChange(rowIndex, 'note', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent', resize: 'none', minHeight: '60px' }}
            />
          </div>
          
          <div className="excel-cell">
            <textarea
              value={row.problemi}
              onChange={(e) => handleCellChange(rowIndex, 'problemi', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent', resize: 'none', minHeight: '40px' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.ciclo}
              onChange={(e) => handleCellChange(rowIndex, 'ciclo', e.target.value)}
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
            <textarea
              value={row.tipoPma}
              onChange={(e) => handleCellChange(rowIndex, 'tipoPma', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent', resize: 'none', minHeight: '40px' }}
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
              value={row.col10}
              onChange={(e) => handleCellChange(rowIndex, 'col10', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col11}
              onChange={(e) => handleCellChange(rowIndex, 'col11', e.target.value)}
              style={{ border: 'none', width: '100%', background: 'transparent' }}
            />
          </div>
          
          <div className="excel-cell">
            <input
              type="text"
              value={row.col12}
              onChange={(e) => handleCellChange(rowIndex, 'col12', e.target.value)}
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
              <option value="X">X</option>
              <option value="PIANIFICATO">PIANIFICATO</option>
              <option value="SOSPESO">SOSPESO</option>
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
              col1: '',
              paziente: '',
              note: '',
              problemi: '',
              ciclo: '',
              col6: '',
              tipoPma: '',
              col8: '',
              col9: '',
              col10: '',
              col11: '',
              col12: '',
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

export default DataDaDefinireSheet;