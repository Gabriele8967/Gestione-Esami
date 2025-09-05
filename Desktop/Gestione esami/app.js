class ExamManagementApp {
    constructor() {
        this.patients = JSON.parse(localStorage.getItem('patients') || '[]');
        this.exams = JSON.parse(localStorage.getItem('exams') || '[]');
        this.emailConfig = JSON.parse(localStorage.getItem('emailConfig') || '{}');
        this.currentEditingPatient = null;
        this.currentEditingExam = null;
        
        this.init();
    }

    init() {
        this.initEventListeners();
        this.renderPatients();
        this.renderExams();
        this.updateScadenze();
        this.updatePatientSelectors();
        this.loadEmailConfig();
        
        // Auto-save ogni 30 secondi
        setInterval(() => this.saveData(), 30000);
    }

    initEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Search functionality
        document.getElementById('searchPatients').addEventListener('input', (e) => {
            this.filterPatients(e.target.value);
        });

        // Form submissions
        document.getElementById('patientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePatient();
        });

        document.getElementById('examForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExam();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Filters for exams
        document.getElementById('patientFilter').addEventListener('change', () => this.filterExams());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterExams());
        document.getElementById('typeFilter').addEventListener('change', () => this.filterExams());

        // Import file
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.handleFileImport(e.target.files[0]);
        });

        // Auto-update exam validity when prescription date changes
        document.getElementById('examPrescriptionDate').addEventListener('change', (e) => {
            this.updateExamExpiry();
        });

        document.getElementById('examValidityDays').addEventListener('input', (e) => {
            this.updateExamExpiry();
        });
    }

    switchTab(tabName) {
        // Remove active from all tabs and contents
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Update data when switching tabs
        if (tabName === 'scadenze') {
            this.updateScadenze();
        }
    }

    // GESTIONE PAZIENTI
    showAddPatientModal() {
        this.currentEditingPatient = null;
        document.getElementById('patientModalTitle').textContent = 'Aggiungi Paziente';
        document.getElementById('patientForm').reset();
        this.showModal('patientModal');
    }

    editPatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        this.currentEditingPatient = patientId;
        document.getElementById('patientModalTitle').textContent = 'Modifica Paziente';
        
        // Popola il form
        document.getElementById('patientName').value = patient.name || '';
        document.getElementById('patientEmail').value = patient.email || '';
        document.getElementById('patientPhone').value = patient.phone || '';
        document.getElementById('patientPartner').value = patient.partner || '';
        document.getElementById('patientStartDate').value = patient.startDate || '';
        document.getElementById('patientAddress').value = patient.address || '';
        document.getElementById('patientNotes').value = patient.notes || '';

        this.showModal('patientModal');
    }

    savePatient() {
        const formData = {
            name: document.getElementById('patientName').value.trim(),
            email: document.getElementById('patientEmail').value.trim(),
            phone: document.getElementById('patientPhone').value.trim(),
            partner: document.getElementById('patientPartner').value.trim(),
            startDate: document.getElementById('patientStartDate').value,
            address: document.getElementById('patientAddress').value.trim(),
            notes: document.getElementById('patientNotes').value.trim()
        };

        if (!formData.name || !formData.email) {
            alert('Nome e email sono obbligatori');
            return;
        }

        if (this.currentEditingPatient) {
            // Modifica paziente esistente
            const index = this.patients.findIndex(p => p.id === this.currentEditingPatient);
            if (index !== -1) {
                this.patients[index] = { ...this.patients[index], ...formData };
            }
        } else {
            // Nuovo paziente
            const patient = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString()
            };
            this.patients.push(patient);
        }

        this.saveData();
        this.renderPatients();
        this.updatePatientSelectors();
        this.closeModal('patientModal');
        this.showNotification('Paziente salvato con successo', 'success');
    }

    deletePatient(patientId) {
        if (!confirm('Sei sicuro di voler eliminare questo paziente? Verranno eliminati anche tutti i suoi esami.')) {
            return;
        }

        this.patients = this.patients.filter(p => p.id !== patientId);
        this.exams = this.exams.filter(e => e.patientId !== patientId);
        
        this.saveData();
        this.renderPatients();
        this.renderExams();
        this.updatePatientSelectors();
        this.showNotification('Paziente eliminato', 'success');
    }

    renderPatients() {
        const tbody = document.getElementById('patientsTableBody');
        if (this.patients.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>Nessun paziente</h3>
                        <p>Aggiungi il primo paziente per iniziare</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.patients.map(patient => {
            const examiLei = this.getPatientExams(patient.id, 'lei');
            const examiLui = this.getPatientExams(patient.id, 'lui');

            return `
                <tr>
                    <td><strong>${patient.name}</strong></td>
                    <td>${patient.email}</td>
                    <td>${patient.phone || '-'}</td>
                    <td>${patient.partner || '-'}</td>
                    <td>${patient.startDate ? this.formatDate(patient.startDate) : '-'}</td>
                    <td>${patient.notes || '-'}</td>
                    <td>
                        <div class="exam-summary">
                            ${examiLei.map(e => `
                                <div class="exam-item-small ${e.status}">
                                    ${e.name} - ${e.status === 'fatto' ? 'OK' : this.formatDate(e.expiryDate)}
                                </div>
                            `).join('') || '<em>Nessun esame</em>'}
                        </div>
                    </td>
                    <td>
                        <div class="exam-summary">
                            ${examiLui.map(e => `
                                <div class="exam-item-small ${e.status}">
                                    ${e.name} - ${e.status === 'fatto' ? 'OK' : this.formatDate(e.expiryDate)}
                                </div>
                            `).join('') || '<em>Nessun esame</em>'}
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-edit" onclick="app.editPatient('${patient.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-delete" onclick="app.deletePatient('${patient.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    filterPatients(searchTerm) {
        const rows = document.querySelectorAll('#patientsTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    // GESTIONE ESAMI
    showExamModal() {
        this.currentEditingExam = null;
        document.getElementById('examModalTitle').textContent = 'Aggiungi Esame';
        document.getElementById('examForm').reset();
        document.getElementById('examPrescriptionDate').value = new Date().toISOString().split('T')[0];
        this.showModal('examModal');
    }

    editExam(examId) {
        const exam = this.exams.find(e => e.id === examId);
        if (!exam) return;

        this.currentEditingExam = examId;
        document.getElementById('examModalTitle').textContent = 'Modifica Esame';
        
        document.getElementById('examPatient').value = exam.patientId;
        document.getElementById('examType').value = exam.type;
        document.getElementById('examName').value = exam.name;
        document.getElementById('examPrescriptionDate').value = exam.prescriptionDate;
        document.getElementById('examValidityDays').value = exam.validityDays || 365;
        document.getElementById('examStatus').value = exam.status;
        document.getElementById('examNotes').value = exam.notes || '';

        this.showModal('examModal');
    }

    saveExam() {
        const formData = {
            patientId: document.getElementById('examPatient').value,
            type: document.getElementById('examType').value,
            name: document.getElementById('examName').value,
            prescriptionDate: document.getElementById('examPrescriptionDate').value,
            validityDays: parseInt(document.getElementById('examValidityDays').value) || 365,
            status: document.getElementById('examStatus').value,
            notes: document.getElementById('examNotes').value.trim()
        };

        if (!formData.patientId || !formData.type || !formData.name || !formData.prescriptionDate) {
            alert('Tutti i campi obbligatori devono essere compilati');
            return;
        }

        // Calcola data di scadenza
        const prescriptionDate = new Date(formData.prescriptionDate);
        const expiryDate = new Date(prescriptionDate);
        expiryDate.setDate(expiryDate.getDate() + formData.validityDays);

        if (this.currentEditingExam) {
            // Modifica esame esistente
            const index = this.exams.findIndex(e => e.id === this.currentEditingExam);
            if (index !== -1) {
                this.exams[index] = { 
                    ...this.exams[index], 
                    ...formData,
                    expiryDate: expiryDate.toISOString().split('T')[0]
                };
            }
        } else {
            // Nuovo esame
            const exam = {
                id: Date.now().toString(),
                ...formData,
                expiryDate: expiryDate.toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            };
            this.exams.push(exam);
        }

        this.saveData();
        this.renderExams();
        this.renderPatients(); // Aggiorna anche la vista pazienti
        this.closeModal('examModal');
        this.showNotification('Esame salvato con successo', 'success');
    }

    deleteExam(examId) {
        if (!confirm('Sei sicuro di voler eliminare questo esame?')) {
            return;
        }

        this.exams = this.exams.filter(e => e.id !== examId);
        this.saveData();
        this.renderExams();
        this.renderPatients();
        this.showNotification('Esame eliminato', 'success');
    }

    renderExams() {
        const tbody = document.getElementById('examsTableBody');
        if (this.exams.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <i class="fas fa-calendar-check"></i>
                        <h3>Nessun esame</h3>
                        <p>Aggiungi il primo esame per iniziare</p>
                    </td>
                </tr>
            `;
            return;
        }

        const examsWithPatients = this.exams.map(exam => {
            const patient = this.patients.find(p => p.id === exam.patientId);
            return { ...exam, patientName: patient ? patient.name : 'Paziente non trovato' };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        tbody.innerHTML = examsWithPatients.map(exam => {
            const isOverdue = exam.status === 'da_fare' && new Date(exam.expiryDate) < new Date();
            const statusClass = isOverdue ? 'scaduto' : exam.status;

            return `
                <tr>
                    <td><strong>${exam.patientName}</strong></td>
                    <td>${exam.name}</td>
                    <td><span class="type-badge type-${exam.type}">${exam.type.toUpperCase()}</span></td>
                    <td>${this.formatDate(exam.prescriptionDate)}</td>
                    <td>${this.formatDate(exam.expiryDate)}</td>
                    <td><span class="status-badge status-${statusClass}">${this.getStatusText(statusClass)}</span></td>
                    <td>${exam.notes || '-'}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-edit" onclick="app.editExam('${exam.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-delete" onclick="app.deleteExam('${exam.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    filterExams() {
        const patientFilter = document.getElementById('patientFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;

        const rows = document.querySelectorAll('#examsTableBody tr');
        rows.forEach(row => {
            if (row.querySelector('.empty-state')) return;
            
            let show = true;
            const cells = row.querySelectorAll('td');
            
            if (patientFilter && !cells[0].textContent.toLowerCase().includes(patientFilter.toLowerCase())) {
                show = false;
            }
            
            if (statusFilter) {
                const statusBadge = cells[5].querySelector('.status-badge');
                if (statusBadge && !statusBadge.className.includes(statusFilter)) {
                    show = false;
                }
            }
            
            if (typeFilter) {
                const typeBadge = cells[2].querySelector('.type-badge');
                if (typeBadge && !typeBadge.className.includes(typeFilter)) {
                    show = false;
                }
            }
            
            row.style.display = show ? '' : 'none';
        });
    }

    updateExamExpiry() {
        const prescriptionDate = document.getElementById('examPrescriptionDate').value;
        const validityDays = document.getElementById('examValidityDays').value;
        
        if (prescriptionDate && validityDays) {
            const prescription = new Date(prescriptionDate);
            const expiry = new Date(prescription);
            expiry.setDate(expiry.getDate() + parseInt(validityDays));
            
            // Mostra la data di scadenza calcolata (opzionale)
            const expiryInfo = document.getElementById('examExpiryInfo');
            if (expiryInfo) {
                expiryInfo.textContent = `Scadenza: ${this.formatDate(expiry.toISOString().split('T')[0])}`;
            }
        }
    }

    // GESTIONE SCADENZE
    updateScadenze() {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const overdueExams = [];
        const upcomingExams = [];

        this.exams.forEach(exam => {
            if (exam.status === 'fatto') return;

            const expiryDate = new Date(exam.expiryDate);
            const patient = this.patients.find(p => p.id === exam.patientId);
            const examWithPatient = { ...exam, patientName: patient ? patient.name : 'N/A' };

            if (expiryDate < today) {
                overdueExams.push(examWithPatient);
            } else if (expiryDate <= nextWeek) {
                upcomingExams.push(examWithPatient);
            }
        });

        // Aggiorna contatori
        document.getElementById('overdueCount').textContent = overdueExams.length;
        document.getElementById('upcomingCount').textContent = upcomingExams.length;

        // Renderizza liste
        this.renderExamList('overdueExams', overdueExams, 'overdue');
        this.renderExamList('upcomingExams', upcomingExams, 'upcoming');
    }

    renderExamList(containerId, exams, type) {
        const container = document.getElementById(containerId);
        
        if (exams.length === 0) {
            container.innerHTML = '<p class="text-muted">Nessun esame</p>';
            return;
        }

        container.innerHTML = exams.map(exam => `
            <div class="exam-item ${type}">
                <div class="exam-info">
                    <strong>${exam.patientName} - ${exam.name}</strong>
                    <div class="exam-details">
                        Tipo: ${exam.type.toUpperCase()} | Scadenza: ${this.formatDate(exam.expiryDate)}
                        ${exam.notes ? ` | Note: ${exam.notes}` : ''}
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-edit" onclick="app.editExam('${exam.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="app.markExamDone('${exam.id}')">
                        <i class="fas fa-check"></i> Fatto
                    </button>
                </div>
            </div>
        `).join('');
    }

    markExamDone(examId) {
        const examIndex = this.exams.findIndex(e => e.id === examId);
        if (examIndex !== -1) {
            this.exams[examIndex].status = 'fatto';
            this.saveData();
            this.renderExams();
            this.renderPatients();
            this.updateScadenze();
            this.showNotification('Esame segnato come completato', 'success');
        }
    }

    // SISTEMA EMAIL
    saveEmailConfig() {
        this.showNotification('Configurazione email gestita automaticamente da Netlify', 'info');
        this.addEmailLog('Sistema email configurato con Netlify Functions + Gmail', 'success');
    }

    loadEmailConfig() {
        // Email configurata automaticamente via Netlify Functions
        this.addEmailLog('Sistema email pronto - usando centrimanna2@gmail.com', 'success');
    }

    async sendOverdueReminders() {
        const today = new Date();
        const overdueExams = this.exams.filter(exam => {
            return exam.status === 'da_fare' && new Date(exam.expiryDate) < today;
        });

        if (overdueExams.length === 0) {
            this.showNotification('Nessun esame scaduto da notificare', 'info');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const exam of overdueExams) {
            const patient = this.patients.find(p => p.id === exam.patientId);
            if (!patient || !patient.email) {
                errorCount++;
                this.addEmailLog(`Errore: Email non trovata per ${patient?.name || 'paziente sconosciuto'}`, 'error');
                continue;
            }

            try {
                await this.sendEmail(patient, [exam], 'scaduto');
                successCount++;
                this.addEmailLog(`Email inviata a ${patient.name} per esame scaduto: ${exam.name}`, 'success');
            } catch (error) {
                errorCount++;
                this.addEmailLog(`Errore invio email a ${patient.name}: ${error.message}`, 'error');
            }

            // Pausa tra invii per evitare rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.showNotification(`Email inviate: ${successCount} successi, ${errorCount} errori`, successCount > 0 ? 'success' : 'warning');
    }

    async sendUpcomingReminders() {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const upcomingExams = this.exams.filter(exam => {
            const expiryDate = new Date(exam.expiryDate);
            return exam.status === 'da_fare' && expiryDate > today && expiryDate <= nextWeek;
        });

        if (upcomingExams.length === 0) {
            this.showNotification('Nessun esame in scadenza da notificare', 'info');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const exam of upcomingExams) {
            const patient = this.patients.find(p => p.id === exam.patientId);
            if (!patient || !patient.email) {
                errorCount++;
                this.addEmailLog(`Errore: Email non trovata per ${patient?.name || 'paziente sconosciuto'}`, 'error');
                continue;
            }

            try {
                await this.sendEmail(patient, [exam], 'in_scadenza');
                successCount++;
                this.addEmailLog(`Email inviata a ${patient.name} per esame in scadenza: ${exam.name}`, 'success');
            } catch (error) {
                errorCount++;
                this.addEmailLog(`Errore invio email a ${patient.name}: ${error.message}`, 'error');
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.showNotification(`Email inviate: ${successCount} successi, ${errorCount} errori`, successCount > 0 ? 'success' : 'warning');
    }

    async sendEmail(patient, exams, type) {
        const emailData = {
            patientName: patient.name,
            patientEmail: patient.email,
            examsList: exams.map(exam => 
                `- ${exam.name} (Scadenza: ${this.formatDate(exam.expiryDate)})`
            ).join('\n'),
            type: type,
            centroName: 'Centro Biofertility'
        };

        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Errore invio email');
        }

        return await response.json();
    }

    addEmailLog(message, type) {
        const logContainer = document.getElementById('emailLogContent');
        const timestamp = new Date().toLocaleString('it-IT');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        // Mantieni solo gli ultimi 50 log
        while (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }

    // IMPORT/EXPORT
    handleFileImport(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(worksheet);
                
                this.importData(data);
            } catch (error) {
                console.error('Errore import:', error);
                alert('Errore durante l\'importazione del file');
            }
        };
        reader.readAsBinaryString(file);
    }

    importData(data) {
        // Implementa logica di importazione basata sulla struttura dei tuoi file Excel
        // Questo è un esempio base che dovrai adattare
        let importedPatients = 0;
        let importedExams = 0;

        data.forEach(row => {
            // Cerca di identificare se è un paziente o un esame
            if (row.Nome || row.name) {
                const patient = {
                    id: Date.now().toString() + Math.random(),
                    name: row.Nome || row.name,
                    email: row.Email || row.email || '',
                    phone: row.Telefono || row.phone || '',
                    partner: row.Partner || row.partner || '',
                    startDate: row.DataInizio || row.startDate || '',
                    notes: row.Note || row.notes || '',
                    createdAt: new Date().toISOString()
                };
                
                this.patients.push(patient);
                importedPatients++;
            }
        });

        this.saveData();
        this.renderPatients();
        this.updatePatientSelectors();
        
        this.showNotification(`Importati: ${importedPatients} pazienti, ${importedExams} esami`, 'success');
    }

    exportToExcel(type) {
        let data = [];
        let filename = '';

        switch (type) {
            case 'patients':
                data = this.patients.map(p => ({
                    Nome: p.name,
                    Email: p.email,
                    Telefono: p.phone,
                    Partner: p.partner,
                    DataInizio: p.startDate,
                    Indirizzo: p.address,
                    Note: p.notes
                }));
                filename = 'pazienti.xlsx';
                break;
                
            case 'exams':
                data = this.exams.map(e => {
                    const patient = this.patients.find(p => p.id === e.patientId);
                    return {
                        Paziente: patient?.name || 'N/A',
                        Esame: e.name,
                        Tipo: e.type.toUpperCase(),
                        DataPrescrizione: e.prescriptionDate,
                        Scadenza: e.expiryDate,
                        Stato: this.getStatusText(e.status),
                        Note: e.notes
                    };
                });
                filename = 'esami.xlsx';
                break;
                
            case 'complete':
                data = this.patients.map(patient => {
                    const examiLei = this.getPatientExams(patient.id, 'lei');
                    const examiLui = this.getPatientExams(patient.id, 'lui');
                    
                    return {
                        Paziente: patient.name,
                        Email: patient.email,
                        Telefono: patient.phone,
                        Partner: patient.partner,
                        DataInizio: patient.startDate,
                        Note: patient.notes,
                        EsamiLEI: examiLei.map(e => `${e.name} (${this.formatDate(e.expiryDate)})`).join('; '),
                        EsamiLUI: examiLui.map(e => `${e.name} (${this.formatDate(e.expiryDate)})`).join('; ')
                    };
                });
                filename = 'gestione_esami_completa.xlsx';
                break;
        }

        if (data.length === 0) {
            alert('Nessun dato da esportare');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dati');
        
        XLSX.writeFile(workbook, filename);
        this.showNotification(`File ${filename} scaricato`, 'success');
    }

    // UTILITY FUNCTIONS
    getPatientExams(patientId, type = null) {
        return this.exams.filter(exam => {
            return exam.patientId === patientId && (!type || exam.type === type);
        });
    }

    updatePatientSelectors() {
        const selectors = ['examPatient', 'patientFilter'];
        selectors.forEach(selectorId => {
            const select = document.getElementById(selectorId);
            if (!select) return;
            
            const currentValue = select.value;
            select.innerHTML = selectorId === 'patientFilter' ? '<option value="">Tutti i pazienti</option>' : '<option value="">Seleziona paziente</option>';
            
            this.patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = patient.name;
                select.appendChild(option);
            });
            
            select.value = currentValue;
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        modal.style.display = 'none';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT');
    }

    getStatusText(status) {
        const statusMap = {
            'da_fare': 'Da fare',
            'fatto': 'Fatto',
            'scaduto': 'Scaduto'
        };
        return statusMap[status] || status;
    }

    saveData() {
        localStorage.setItem('patients', JSON.stringify(this.patients));
        localStorage.setItem('exams', JSON.stringify(this.exams));
    }

    showNotification(message, type = 'info') {
        // Crea elemento notifica
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Stile notifica
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            backgroundColor: this.getNotificationColor(type),
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px',
            animation: 'slideInRight 0.3s ease'
        });

        document.body.appendChild(notification);

        // Auto-remove dopo 5 secondi
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Click per chiudere
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#4caf50',
            'error': '#f44336',
            'warning': '#ff9800',
            'info': '#2196f3'
        };
        return colors[type] || '#2196f3';
    }
}

// Global functions per i click handlers
function showAddPatientModal() {
    app.showAddPatientModal();
}

function showExamModal() {
    app.showExamModal();
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

function saveEmailConfig() {
    app.saveEmailConfig();
}

function sendOverdueReminders() {
    app.sendOverdueReminders();
}

function sendUpcomingReminders() {
    app.sendUpcomingReminders();
}

function exportToExcel(type) {
    app.exportToExcel(type);
}

// CSS per le notifiche
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        margin-left: 10px;
    }
    
    .exam-summary .exam-item-small {
        font-size: 0.8rem;
        padding: 2px 6px;
        margin: 2px 0;
        border-radius: 3px;
        display: inline-block;
        margin-right: 5px;
    }
    
    .exam-item-small.da_fare {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .exam-item-small.fatto {
        background-color: #d4edda;
        color: #155724;
    }
    
    .exam-item-small.scaduto {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .type-badge {
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .type-lei {
        background-color: #e91e63;
        color: white;
    }
    
    .type-lui {
        background-color: #2196f3;
        color: white;
    }
`;

// Aggiungi CSS dinamicamente
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Inizializza app quando DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ExamManagementApp();
});