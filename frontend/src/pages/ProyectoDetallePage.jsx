// src/pages/ProyectoDetallePage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_SPRING_BOOT = 'http://localhost:8080/api/proyectos';
const API_LISTA_INTERES = 'http://localhost:8080/api/lista-interes';
const MOCK_USER_ID = 1; // ID temporal de AdminTest

const ProyectoDetallePage = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [integrantes, setIntegrantes] = useState([]);

    useEffect(() => {
        // 1. Carga del Proyecto
        axios.get(`${API_SPRING_BOOT}/${id}`)
            .then(response => {
                const data = response.data;
                setProyecto(data);
                
                // 2. Parsear el JSON de Integrantes
                try {
                    setIntegrantes(JSON.parse(data.integrantesDetalle || '[]'));
                } catch (e) {
                    console.error("Error al parsear JSON de integrantes", e);
                    setIntegrantes([]);
                }
            })
            .catch(err => {
                console.error("Error al cargar proyecto:", err);
                setError("Proyecto no encontrado o error de conexión.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Función para añadir a la lista de interés
    const handleAddToLista = async () => {
        if (!token) {
            alert("Debes iniciar sesión para añadir a la Lista de Interés.");
            navigate('/login');
            return;
        }

        try {
            // Llama al POST /api/lista-interes/add/{usuarioId}/{proyectoId}
            await axios.post(`${API_LISTA_INTERES}/add/${MOCK_USER_ID}/${id}`);
            alert('✅ Proyecto añadido a tu Lista de Interés con éxito. Revisa tu carrito.');
        } catch (error) {
            const errorMessage = error.response?.data || 'Error al añadir proyecto. Verifica que no exceda el límite.';
            alert(`❌ Error: ${errorMessage}`);
        }
    };


    if (loading) return <Container className="my-5 text-center"><Spinner animation="border" /> Cargando detalles...</Container>;
    if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!proyecto) return null; // Debería ser atrapado por el error, pero por seguridad.

    const disponible = proyecto.disponibleParaPatrocinio;

    return (
        <Container className="my-5">
            <Row>
                <Col md={8}>
                    <h2>{proyecto.nombre}</h2>
                    <p className="lead">{proyecto.areaCarrera}</p>
                    <hr />
                    
                    {/* Sección de Imagen Mockup */}
                    <Card className="mb-4">
                        <Card.Img 
                            variant="top" 
                            src="https://via.placeholder.com/800x400.png?text=Imagen+Mockup+del+Proyecto" 
                            alt={`Imagen del proyecto ${proyecto.nombre}`}
                        />
                        <Card.Body>
                            <Card.Text>{proyecto.descripcionCorta}</Card.Text>
                        </Card.Body>
                    </Card>

                    {/* Descripción Detallada */}
                    <h3>Descripción Completa</h3>
                    <p>{proyecto.descripcionCompleta}</p>
                    
                    {/* Integrantes */}
                    <h3 className="mt-4">👥 Equipo de Desarrollo (Integrantes)</h3>
                    <ListGroup variant="flush">
                        {integrantes.map((i, index) => (
                            <ListGroup.Item key={index}>
                                <strong>{i.nombre}</strong> (Carrera: {i.carrera}, Ciclo: {i.ciclo})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                </Col>

                {/* Columna Lateral con Información y Botón */}
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Información Clave</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    **Disponibilidad:** <span className={`fw-bold text-${disponible ? 'success' : 'danger'}`}>{disponible ? 'Abierto' : 'Contactado'}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    **Popularidad:** {proyecto.popularidadVistas} vistas
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    **Complejidad:** {proyecto.complejidadNivel === 3 ? 'Avanzado' : 'Medio'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    **Tecnologías:** {proyecto.tecnologiasUsadas}
                                </ListGroup.Item>
                            </ListGroup>
                            
                            <div className="d-grid gap-2 mt-4">
                                <Button 
                                    variant={disponible ? 'primary' : 'secondary'} 
                                    onClick={handleAddToLista}
                                    disabled={!disponible || !token}
                                >
                                    {disponible ? '➕ Añadir a Lista de Interés' : 'No Disponible'}
                                </Button>
                                {!token && <Alert variant="warning" className="p-2 mt-2">Inicia sesión para añadir.</Alert>}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProyectoDetallePage;