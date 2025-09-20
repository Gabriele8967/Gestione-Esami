import React, { useState, useEffect } from 'react';
import { MdClose, MdCheck, MdAdd, MdDelete, MdPrint } from 'react-icons/md';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  notes?: string;
}

interface ChecklistModalProps {
  rowId: string;
  patientData: any;
  onClose: () => void;
  onSave: (checklist: ChecklistItem[]) => void;
}

const checklistTemplates = {
  'esami-lui': [
    'Esame seminale completo',
    'Spermiogramma secondo OMS',
    'Test di capacitazione',
    'Ricerca batteri e miceti',
    'Frammentazione DNA spermatico',
    'Cariotipo',
    'Micro delezioni cromosoma Y'
  ],
  'esami-lei': [
    'Dosaggi ormonali (FSH, LH, E2, AMH)',
    'Ecografia pelvica transvaginale',
    'Isterosalpingografia',
    'Isteroscopia diagnostica',
    'Cariotipo',
    'Screening infettivologico',
    'Dosaggio TSH, glicemia',
    'Test di ovulazione'
  ],
  'preparazione-pma': [
    'Consenso informato firmato',
    'Documentazione ISEE',
    'Prescrizione farmaci',
    'Programmazione monitoraggi',
    'Prenotazione sala operatoria',
    'Informazioni post-transfer',
    'Programmazione beta-HCG'
  ]
};

const ChecklistModal: React.FC<ChecklistModalProps> = ({ 
  rowId, 
  patientData, 
  onClose, 
  onSave 
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    if (patientData?.checklist) {
      setChecklist(patientData.checklist);
    }
  }, [patientData]);

  const addTaskFromTemplate = (template: string) => {
    const tasks = checklistTemplates[template as keyof typeof checklistTemplates];
    const newTasks: ChecklistItem[] = tasks.map(task => ({
      id: Date.now().toString() + Math.random(),
      task,
      completed: false,
      category: template,
      dueDate: '',
      notes: ''
    }));
    setChecklist(prev => [...prev, ...newTasks]);
  };

  const addCustomTask = () => {
    if (newTask.trim()) {
      const newTaskItem: ChecklistItem = {
        id: Date.now().toString(),
        task: newTask,
        completed: false,
        category: 'custom',
        dueDate: '',
        notes: ''
      };
      setChecklist(prev => [...prev, newTaskItem]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === taskId ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteTask = (taskId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== taskId));
  };

  const updateTask = (taskId: string, field: keyof ChecklistItem, value: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === taskId ? { ...item, [field]: value } : item
    ));
  };

  const filteredChecklist = checklist.filter(item => {
    if (filter === 'completed') return item.completed;
    if (filter === 'pending') return !item.completed;
    return true;
  });

  const completionPercentage = checklist.length > 0 
    ? Math.round((checklist.filter(item => item.completed).length / checklist.length) * 100)
    : 0;

  const printChecklist = () => {
    const printWindow = window.open('', '_blank');
    const checklistHtml = `
      <html>
        <head>
          <title>Checklist - ${patientData?.paziente}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; }
            .task { margin: 10px 0; }
            .completed { text-decoration: line-through; color: #666; }
            .category { font-weight: bold; color: #0066cc; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Checklist Esami</h1>
            <p><strong>Paziente:</strong> ${patientData?.paziente}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Completamento:</strong> ${completionPercentage}%</p>
          </div>
          ${checklist.map(item => `
            <div class="task ${item.completed ? 'completed' : ''}">
              <span>${item.completed ? '✓' : '☐'}</span>
              <strong>${item.task}</strong>
              ${item.category !== 'custom' ? `<span class="category">[${item.category}]</span>` : ''}
              ${item.dueDate ? `<br><small>Scadenza: ${item.dueDate}</small>` : ''}
              ${item.notes ? `<br><small>Note: ${item.notes}</small>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;
    printWindow?.document.write(checklistHtml);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checklist-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Checklist Esami - {patientData?.paziente}</h2>
          <div className="modal-actions">
            <button className="btn-icon" onClick={printChecklist} title="Stampa checklist">
              <MdPrint />
            </button>
            <button className="btn-icon" onClick={onClose} title="Chiudi">
              <MdClose />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="checklist-stats">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{completionPercentage}% completato</span>
          </div>

          <div className="template-section">
            <h3>Template Checklist</h3>
            <div className="template-buttons">
              <button 
                className="template-btn"
                onClick={() => addTaskFromTemplate('esami-lui')}
              >
                Esami Lui
              </button>
              <button 
                className="template-btn"
                onClick={() => addTaskFromTemplate('esami-lei')}
              >
                Esami Lei
              </button>
              <button 
                className="template-btn"
                onClick={() => addTaskFromTemplate('preparazione-pma')}
              >
                Preparazione PMA
              </button>
            </div>
          </div>

          <div className="custom-task-section">
            <h3>Aggiungi Task Personalizzato</h3>
            <div className="custom-task-input">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Inserisci nuovo task..."
                onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
              />
              <button onClick={addCustomTask} className="btn-add">
                <MdAdd />
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>Tasks ({filteredChecklist.length})</h3>
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                Tutti
              </button>
              <button 
                className={filter === 'pending' ? 'active' : ''}
                onClick={() => setFilter('pending')}
              >
                Da fare
              </button>
              <button 
                className={filter === 'completed' ? 'active' : ''}
                onClick={() => setFilter('completed')}
              >
                Completati
              </button>
            </div>
          </div>

          <div className="checklist-items">
            {filteredChecklist.map(item => (
              <div key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
                <div className="item-main">
                  <button 
                    className="checkbox"
                    onClick={() => toggleTask(item.id)}
                  >
                    {item.completed ? <MdCheck /> : null}
                  </button>
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) => updateTask(item.id, 'task', e.target.value)}
                    className="task-input"
                  />
                  <span className="category-badge">{item.category}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteTask(item.id)}
                    title="Elimina task"
                  >
                    <MdDelete />
                  </button>
                </div>
                <div className="item-details">
                  <input
                    type="date"
                    value={item.dueDate}
                    onChange={(e) => updateTask(item.id, 'dueDate', e.target.value)}
                    className="date-input"
                    placeholder="Scadenza"
                  />
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateTask(item.id, 'notes', e.target.value)}
                    className="notes-input"
                    placeholder="Note..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Annulla
          </button>
          <button className="btn-primary" onClick={() => onSave(checklist)}>
            Salva Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistModal;