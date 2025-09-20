
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Row, Col, ListGroup, Button, Modal, Form } from 'react-bootstrap';

// Type definitions
interface PatientExam {
    exam_id: number;
    exam_date: string;
}

interface Patient {
    id: number;
    name: string;
    category: string;
    exams: PatientExam[];
}

interface Exam {
    id: number;
    name: string;
    gender: 'Uomo' | 'Donna';
    category: string;
    validity_months: number | null;
}

interface ProcessedExam {
    name: string;
    date: string;
}

const PatientDetail: React.FC = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [allExams, setAllExams] = useState<Exam[]>([]); // Master list of all exams
    const [womanExams, setWomanExams] = useState<ProcessedExam[]>([]);
    const [manExams, setManExams] = useState<ProcessedExam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { patientId } = useParams<{ patientId: string }>();

    // State for Add Exam Modal
    const [showAddExamModal, setShowAddExamModal] = useState<boolean>(false);
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [examDate, setExamDate] = useState<string>('');

    const fetchPatientAndExams = () => {
        if (patientId) {
            Promise.all([
                axios.get(`http://127.0.0.1:8000/api/patients/${patientId}`),
                axios.get('http://127.0.0.1:8000/api/exams/')
            ])
            .then(([patientResponse, examsResponse]) => {
                const patientData: Patient = patientResponse.data;
                const masterExams: Exam[] = examsResponse.data;
                setPatient(patientData);
                setAllExams(masterExams);

                // Process exams if the patient is in the LOW_RESP category
                if (patientData.category === 'LOW_RESP' && patientData.exams) {
                    const examsMap = new Map(masterExams.map(e => [e.id, e]));
                    const processedWomanExams: ProcessedExam[] = [];
                    const processedManExams: ProcessedExam[] = [];

                    patientData.exams.forEach(patientExam => {
                        const examDetails = examsMap.get(patientExam.exam_id);
                        if (examDetails) {
                            const processed = { name: examDetails.name, date: patientExam.exam_date };
                            if (examDetails.gender === 'Donna') {
                                processedWomanExams.push(processed);
                            } else {
                                processedManExams.push(processed);
                            }
                        }
                    });
                    setWomanExams(processedWomanExams);
                    setManExams(processedManExams);
                }

                setLoading(false);
            })
            .catch(err => {
                setError('There was an error fetching the data!');
                setLoading(false);
                console.error('Error fetching data:', err);
            });
        }
    };

    useEffect(() => {
        fetchPatientAndExams();
    }, [patientId]);

    const handleAddExam = async () => {
        if (!selectedExamId || !examDate || !patientId) {
            alert('Please select an exam and a date.');
            return;
        }

        try {
            await axios.post(`http://127.0.0.1:8000/api/patients/${patientId}/exams/`, {
                exam_id: parseInt(selectedExamId),
                exam_date: examDate,
            });
            setShowAddExamModal(false);
            setSelectedExamId('');
            setExamDate('');
            fetchPatientAndExams(); // Refresh data
        } catch (err) {
            alert('Failed to add exam.');
            console.error('Error adding exam:', err);
        }
    };

    if (loading) {
        return <p>Loading patient details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!patient) {
        return <p>Patient not found.</p>;
    }

    const womanMasterExams = allExams.filter(exam => exam.gender === 'Donna');
    const manMasterExams = allExams.filter(exam => exam.gender === 'Uomo');

    return (
        <Container>
            <Card>
                <Card.Header as="h2">{patient.name}</Card.Header>
                <Card.Body>
                    <Card.Title>Dettagli Paziente</Card.Title>
                    <Card.Text>
                        <strong>ID:</strong> {patient.id}<br />
                        <strong>Categoria:</strong> {patient.category}
                    </Card.Text>
                    <hr />
                    {patient.category === 'LOW_RESP' ? (
                        <>
                            <Row className="mb-3">
                                <Col>
                                    <Button variant="primary" onClick={() => setShowAddExamModal(true)}>
                                        Aggiungi Esame
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Card bg="lightpink" text="dark">
                                        <Card.Header as="h5">Esami Lei</Card.Header>
                                        <ListGroup variant="flush">
                                            {womanExams.length > 0 ? womanExams.map((exam, i) => (
                                                <ListGroup.Item key={i} style={{ backgroundColor: 'lightpink' }}>
                                                    {exam.name} - <i>{exam.date}</i>
                                                </ListGroup.Item>
                                            )) : <ListGroup.Item style={{ backgroundColor: 'lightpink' }}>Nessun esame registrato.</ListGroup.Item>}
                                        </ListGroup>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card bg="lightblue" text="dark">
                                        <Card.Header as="h5">Esami Lui</Card.Header>
                                        <ListGroup variant="flush">
                                            {manExams.length > 0 ? manExams.map((exam, i) => (
                                                <ListGroup.Item key={i} style={{ backgroundColor: 'lightblue' }}>
                                                    {exam.name} - <i>{exam.date}</i>
                                                </ListGroup.Item>
                                            )) : <ListGroup.Item style={{ backgroundColor: 'lightblue' }}>Nessun esame registrato.</ListGroup.Item>}
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <p>La gestione degli esami è disponibile solo per i pazienti LOW RESP.</p>
                    )}
                </Card.Body>
            </Card>

            {/* Add Exam Modal */}
            <Modal show={showAddExamModal} onHide={() => setShowAddExamModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Aggiungi Nuovo Esame</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Esame (Donna)</Form.Label>
                            <Form.Select
                                value={selectedExamId}
                                onChange={(e) => setSelectedExamId(e.target.value)}
                            >
                                <option value="">Seleziona un esame</option>
                                {womanMasterExams.map(exam => (
                                    <option key={exam.id} value={exam.id}>
                                        {exam.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Esame (Uomo)</Form.Label>
                            <Form.Select
                                value={selectedExamId}
                                onChange={(e) => setSelectedExamId(e.target.value)}
                            >
                                <option value="">Seleziona un esame</option>
                                {manMasterExams.map(exam => (
                                    <option key={exam.id} value={exam.id}>
                                        {exam.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Data Esame</Form.Label>
                            <Form.Control
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddExamModal(false)}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={handleAddExam}>
                        Salva Esame
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PatientDetail;
