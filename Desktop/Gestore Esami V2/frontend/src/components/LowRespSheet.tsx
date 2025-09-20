import React, { useState, useCallback } from 'react';
import { MdDragIndicator, MdAdd, MdDelete, MdChecklistRtl } from 'react-icons/md';
import ChecklistModal from './ChecklistModal';

interface LowRespData {
  id: string;
  paziente: string;
  sincro: string;
  invio: string;
  domicilio: string;
  note: string;
  esami: string;
  scheda: string;
  nota74: string;
  pma: string;
  sed: string;
  paga: string;
  agopuntura: string;
  mail: string;
  checklist?: any[];
}

interface HeaderColumn {
  id: string;
  label: string;
  field: keyof LowRespData;
  width?: number;
  isEsami?: boolean;
  esamiType?: 'lui' | 'lei';
}

const LowRespSheet: React.FC = () => {
  const [data, setData] = useState<LowRespData[]>([]);
  const [headers, setHeaders] = useState<HeaderColumn[]>([
    { id: '1', label: 'PAZIENTE', field: 'paziente', width: 150 },
    { id: '2', label: 'SINCRO DURATA EP, Progyn-Ovam o altro Protocollo', field: 'sincro', width: 250 },
    { id: '3', label: 'INVIO SINC', field: 'invio', width: 120 },
    { id: '4', label: 'DOMICILIO', field: 'domicilio', width: 120 },
    { id: '5', label: 'NOTE', field: 'note', width: 200 },
    { id: '6', label: 'ESAMI LUI', field: 'esami', width: 150, isEsami: true, esamiType: 'lui' },
    { id: '7', label: 'ESAMI LEI', field: 'esami', width: 150, isEsami: true, esamiType: 'lei' },
    { id: '8', label: 'SCHEDA STIM', field: 'scheda', width: 120 },
    { id: '9', label: 'NOTA 74', field: 'nota74', width: 120 },
    { id: '10', label: 'PMA', field: 'pma', width: 150 },
    { id: '11', label: 'SED', field: 'sed', width: 80 },
    { id: '12', label: 'PAGA', field: 'paga', width: 100 },
    { id: '13', label: 'agopuntura', field: 'agopuntura', width: 100 },
    { id: '14', label: 'MAIL CONSENSI E DOCUMENTI', field: 'mail', width: 200 }
  ]);
  
  const [draggedHeader, setDraggedHeader] = useState<string | null>(null);
  const [draggedRow, setDraggedRow] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState<string | null>(null);

  // Inizializza con riga vuota
  React.useEffect(() => {
    if (data.length === 0) {
      addNewRow();
    }
  }, []);

  const addNewRow = useCallback(() => {
    const newRow: LowRespData = {
      id: Date.now().toString(),
      paziente: '',
      sincro: '',
      invio: '',
      domicilio: '',
      note: '',
      esami: '|',
      scheda: '',
      nota74: '',
      pma: '',
      sed: '',
      paga: '',
      agopuntura: '',
      mail: '',
      checklist: []
    };
    setData(prev => [...prev, newRow]);
  }, []);

  const deleteRow = useCallback((rowId: string) => {
    setData(prev => prev.filter(row => row.id !== rowId));
  }, []);

  const handleCellChange = useCallback((rowId: string, field: keyof LowRespData, value: string) => {
    setData(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  }, []);

  const handleEsamiChange = useCallback((rowId: string, type: 'lui' | 'lei', value: string) => {
    setData(prev => prev.map(row => {
      if (row.id === rowId) {
        const parts = (row.esami || '|').split('|');
        const luiPart = parts[0] || '';
        const leiPart = parts[1] || '';
        
        const newEsami = type === 'lui' ? `${value}|${leiPart}` : `${luiPart}|${value}`;
        return { ...row, esami: newEsami };
      }
      return row;
    }));
  }, []);

  const getEsamiParts = (esami: string) => {
    const parts = (esami || '|').split('|');
    return {
      lui: parts[0] || '',
      lei: parts[1] || ''
    };
  };

  // Drag & Drop per headers
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

  // Drag & Drop per righe
  const handleRowDragStart = (e: React.DragEvent, rowId: string) => {
    setDraggedRow(rowId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRowDrop = (e: React.DragEvent, targetRowId: string) => {
    e.preventDefault();
    if (!draggedRow || draggedRow === targetRowId) return;

    const draggedIndex = data.findIndex(row => row.id === draggedRow);
    const targetIndex = data.findIndex(row => row.id === targetRowId);
    
    const newData = [...data];
    const [draggedItem] = newData.splice(draggedIndex, 1);
    newData.splice(targetIndex, 0, draggedItem);
    
    setData(newData);
    setDraggedRow(null);
  };

  return (
    <>
      <div className="excel-toolbar">
        <button 
          className="toolbar-btn"
          onClick={addNewRow}
          title="Aggiungi nuova riga"
        >
          <MdAdd /> Aggiungi Riga
        </button>
      </div>

      <div className="excel-grid" role="table" aria-label="Dati pazienti LOW RESP">
        {/* Header Row */}
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
              draggable
              onDragStart={(e) => handleHeaderDragStart(e, header.id)}
              onDrop={(e) => handleHeaderDrop(e, header.id)}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: header.width }}
            >
              <MdDragIndicator className="drag-handle" />
              {header.label}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {data.map((row, rowIndex) => {
          const esamiParts = getEsamiParts(row.esami);
          return (
            <div 
              key={row.id} 
              className="excel-row draggable-row" 
              role="row"
              draggable
              onDragStart={(e) => handleRowDragStart(e, row.id)}
              onDrop={(e) => handleRowDrop(e, row.id)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="excel-cell row-number" role="rowheader">
                <div className="row-actions">
                  <MdDragIndicator className="drag-handle" />
                  <span>{rowIndex + 1}</span>
                  <button 
                    className="action-btn checklist-btn"
                    onClick={() => setShowChecklist(row.id)}
                    title="Gestisci checklist"
                  >
                    <MdChecklistRtl />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteRow(row.id)}
                    title="Elimina riga"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
              
              {headers.map((header) => {
                if (header.isEsami) {
                  return (
                    <div 
                      key={`${row.id}-${header.id}`}
                      className={`excel-cell ${header.esamiType === 'lui' ? 'esami-lui' : 'esami-lei'}`} 
                      role="gridcell"
                      style={{ width: header.width }}
                    >
                      <input
                        type="text"
                        value={header.esamiType === 'lui' ? esamiParts.lui : esamiParts.lei}
                        onChange={(e) => handleEsamiChange(row.id, header.esamiType!, e.target.value)}
                        placeholder={`Esami ${header.esamiType === 'lui' ? 'Lui' : 'Lei'}`}
                        aria-label={`Esami per ${header.esamiType}, paziente riga ${rowIndex + 1}`}
                        title={`Esami per il partner ${header.esamiType === 'lui' ? 'maschile' : 'femminile'}`}
                      />
                    </div>
                  );
                }
                
                return (
                  <div 
                    key={`${row.id}-${header.id}`}
                    className="excel-cell" 
                    role="gridcell"
                    style={{ width: header.width }}
                  >
                    {header.field === 'sincro' || header.field === 'note' ? (
                      <textarea
                        value={row[header.field] as string}
                        onChange={(e) => handleCellChange(row.id, header.field, e.target.value)}
                        placeholder={header.label}
                        aria-label={`${header.label} riga ${rowIndex + 1}`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[header.field] as string}
                        onChange={(e) => handleCellChange(row.id, header.field, e.target.value)}
                        placeholder={header.label}
                        aria-label={`${header.label} riga ${rowIndex + 1}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Checklist Modal */}
      {showChecklist && (
        <ChecklistModal
          rowId={showChecklist}
          patientData={data.find(row => row.id === showChecklist)}
          onClose={() => setShowChecklist(null)}
          onSave={(checklist) => {
            setData(prev => prev.map(row => 
              row.id === showChecklist ? { ...row, checklist } : row
            ));
            setShowChecklist(null);
          }}
        />
      )}
    </>
  );
};

export default LowRespSheet;