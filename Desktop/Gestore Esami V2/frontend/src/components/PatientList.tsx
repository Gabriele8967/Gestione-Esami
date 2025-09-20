
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Define the type for a patient based on our API response
interface Patient {
    id: number;
    name: string;
    category: string;
}

const PatientList: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/patients/')
            .then(response => {
                setPatients(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('There was an error fetching the patients!');
                setLoading(false);
                console.error('Error fetching patients:', error);
            });
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return <p>Loading patients...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <ListGroup>
            {patients.map(patient => (
                <ListGroup.Item key={patient.id} action>
                    <Link to={`/patients/${patient.id}`}>
                        {patient.name} ({patient.category})
                    </Link>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default PatientList;
