// src/components/ProyectoCard.jsx (CORRECCIÓN FINAL)

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

const ProyectoCard = ({ proyecto }) => {
    const { user } = useAuth();
    
    // Helper para convertir el nivel (número) en texto
    const getNivel = (nivel) => {
        if (nivel === 1) return 'Básica';
        if (nivel === 2) return 'Intermedia';
        if (nivel === 3) return 'Avanzada';
        return 'Desconocida';
    };

    const disponible = proyecto.disponibleParaPatrocinio;
    const buttonText = 'Ver Detalles';
    const buttonVariant = 'success';


    return (
        <Card className="h-100 shadow-sm" style={{ width: '18rem', margin: '15px' }}>
            <Card.Body>
                <Card.Title className="fw-bold">{proyecto.nombre}</Card.Title>
                
                <Card.Text className="text-muted small">
                    {proyecto.descripcionCorta}
                </Card.Text>

                <div className="mb-3">
                    <p className="mb-1"><strong>Disponibilidad:</strong> <span className={disponible ? 'text-success' : 'text-warning'}>{disponible ? 'Abierto' : 'Contactado'}</span></p>
                    <p className="mb-0"><strong>Complejidad:</strong> {getNivel(proyecto.complejidadNivel)}</p>
                </div>
                
                <div className="d-grid gap-2 mt-3">
                    <Button 
                        as={Link} 
                        to={`/proyecto/${proyecto.id}`} 
                        variant={buttonVariant} 
                    >
                        {buttonText}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProyectoCard;