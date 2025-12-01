// src/pages/ProyectoDetallePage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CheckoutDonationModal from '../components/CheckoutDonationModal';
import CheckoutInvestModal from '../components/CheckoutInvestModal';

const API_SPRING_BOOT = '/api/proyectos';
const API_LISTA_INTERES = '/api/lista-interes';


const ProyectoDetallePage = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [integrantes, setIntegrantes] = useState([]);
    const [showDonation, setShowDonation] = useState(false);
    const [showInvest, setShowInvest] = useState(false);

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
                setError("Proyecto no encontrado o error de conexiÃ³n.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Función para añadir a la lista de interés
    const handleAddToLista = async () => {
        if (!token || !user || !user.id) {
            alert("Debes iniciar sesión para añadir a la Lista de Interés.");
            navigate('/login');
            return;
        }

        try {
            // Llama al POST /api/lista-interes/add/{usuarioId}/{proyectoId}
            await axios.post(`${API_LISTA_INTERES}/add/${user.id}/${id}`);
            alert('✅ Proyecto añadido a tu Lista de Interés con éxito. Revisa tu carrito.');
        } catch (error) {
            const errorMessage = error.response?.data || 'Error al añadir proyecto. Verifica que no exceda el límite.';
            alert(`❌ Error: ${errorMessage}`);
        }
    };


    if (loading) return <Container className="my-5 text-center"><Spinner animation="border" /> Cargando detalles...</Container>;
    if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!proyecto) return null; // DeberÃ­a ser atrapado por el error, pero por seguridad.

    const disponible = proyecto.disponibleParaPatrocinio;

    return (
        <Container className="my-5">
            <Row>
                <Col md={8}>
                    <h2 className="fw-bold mb-3">{proyecto.nombre}</h2>
                    <p className="lead text-muted">{proyecto.areaCarrera}</p>
                    <hr />
                    
                    {/* SecciÃ³n de Imagen Mockup */}
                    <Card className="mb-4 shadow-sm">
                        <Card.Img 
                            variant="top" 
                            src="https://via.placeholder.com/800x400.png?text=Imagen+Mockup+del+Proyecto" 
                            alt={`Imagen del proyecto ${proyecto.nombre}`}
                        />
                        <Card.Body>
                            <Card.Text className="text-muted">{proyecto.descripcionCorta}</Card.Text>
                        </Card.Body>
                    </Card>

                    {/* DescripciÃ³n Detallada */}
                    <h3 className="fw-bold mt-4 mb-3">Descripción Completa</h3>
                    <p className="text-justify text-muted" style={{ lineHeight: '1.8' }}>{proyecto.descripcionCorta}</p>
                    
                    {/* Integrantes */}
                    <h3 className="mt-4">👥 Equipo de Desarrollo (Integrantes)</h3>
                    {integrantes && integrantes.length > 0 ? (
                        <div className="row g-3 mb-4">
                            {integrantes.map((i, index) => (
                                <div className="col-12" key={index}>
                                    <Card className="border-left-primary">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <Card.Title className="mb-1">{i.nombre}</Card.Title>
                                                    <p className="text-muted mb-1">
                                                        <strong>Carrera:</strong> {i.carrera}
                                                    </p>
                                                    <p className="text-muted mb-0">
                                                        <strong>Ciclo:</strong> {i.ciclo}
                                                    </p>
                                                </div>
                                                <span className="badge bg-primary">Ciclo {i.ciclo}</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Alert variant="info">No hay integrantes registrados</Alert>
                    )}

                </Col>

                {/* Columna Lateral con InformaciÃ³n y BotÃ³n */}
                <Col md={4}>
                    <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
                        <Card.Body>
                            <Card.Title className="fw-bold">Información Clave</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Disponibilidad:</strong> <span className={`fw-bold text-${disponible ? 'success' : 'danger'}`}>{disponible ? 'Abierto' : 'Contactado'}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Miembros del equipo:</strong> {proyecto.miembrosDisponibles || 0}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Inversiones:</strong> {(proyecto.miembrosDisponibles || 0) > 0 ? '✅ Disponibles' : '❌ No disponibles'}
                                </ListGroup.Item>
                                {/* Popularidad removida por requerimiento: ocultamos vistasContador */}
                                <ListGroup.Item>
                                    <strong>Complejidad:</strong> {proyecto.complejidadNivel === 3 ? 'Avanzada' : (proyecto.complejidadNivel === 2 ? 'Intermedia' : 'Básica')}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Tecnologías:</strong> {proyecto.tecnologiasUsadas}
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
                                
                                <Button 
                                    variant="success"
                                    onClick={() => setShowDonation(true)}
                                    disabled={!token}
                                >
                                    💝 Hacer una Donación
                                </Button>

                                <Button 
                                    variant="info"
                                    onClick={() => setShowInvest(true)}
                                    disabled={!token || (proyecto.miembrosDisponibles || 0) <= 0}
                                >
                                    💼 Invertir en este Proyecto
                                </Button>
                                
                                {!token && <Alert variant="warning" className="p-2 mt-2">Inicia sesión para interactuar.</Alert>}
                            </div>

                            {/* Modales de donación e inversión */}
                            <CheckoutDonationModal
                                show={showDonation}
                                onHide={() => setShowDonation(false)}
                                proyectoId={parseInt(id)}
                            />
                            <CheckoutInvestModal
                                show={showInvest}
                                onHide={() => setShowInvest(false)}
                                proyectoId={parseInt(id)}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProyectoDetallePage;
