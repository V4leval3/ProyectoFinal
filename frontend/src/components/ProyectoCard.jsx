// src/components/ProyectoCard.jsx (CORRECCIÓN FINAL)

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

const ProyectoCard = ({ proyecto }) => {
    const { user } = useAuth();
    
    // Helper para convertir el nivel (número) en texto
    const getNivel = (nivel) => {
        if (nivel === 3) return 'Avanzado';
        if (nivel === 2) return 'Medio';
        return 'Básico';
    };

    const disponible = proyecto.disponibleParaPatrocinio;
    const buttonText = disponible ? 'Ver Detalles' : 'No disponible';
    const buttonVariant = disponible ? 'success' : 'secondary';


    return (
        <Card className="h-100 shadow-sm" style={{ width: '18rem', margin: '15px' }}>
            <Card.Body>
                <Card.Title>{proyecto.nombre}</Card.Title>
                
                <Card.Text>
                    {proyecto.descripcionCorta}
                    <br/>
                    **Disponibilidad:** {disponible ? 'Abierto' : 'Contactado'}
                </Card.Text>

                <ul className="list-unstyled">
                    <li>**Popularidad:** {proyecto.vistasContador} vistas</li>
                    <li>**Complejidad:** {getNivel(proyecto.complejidadNivel)}</li>
                </ul>
                
                <div className="d-grid gap-2 mt-3">
                    <Button 
                        as={Link} 
                        to={`/proyecto/${proyecto.id}`} 
                        variant={buttonVariant} 
                        disabled={!disponible} 
                    >
                        {buttonText} 
                    </Button> 
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProyectoCard;