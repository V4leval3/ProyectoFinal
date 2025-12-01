// src/pages/ListaInteresPage.jsx (VERSION FINAL Y CORREGIDA)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Alert, Table, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import CheckoutButton from '../components/CheckoutButton';
import CheckoutInvestModal from '../components/CheckoutInvestModal';
import CheckoutContactModal from '../components/CheckoutContactModal';

const API_LISTA_INTERES = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api/lista-interes'
    : '/api/lista-interes'; 

const ListaInteresPage = () => {
    const { user, token } = useAuth();
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvest, setShowInvest] = useState(false);
    const [investProjectId, setInvestProjectId] = useState(null);
    const [showContact, setShowContact] = useState(false);

    // Redirigir si no está logueado, o si el usuario no tiene ID (lo que no debería pasar ahora)
    if (!token || !user || !user.id) { 
        return <Alert variant="warning" className="m-5">Debes iniciar sesión para ver tu Lista de Interés.</Alert>;
    }
    
    // 🚨 CRÍTICO: Usamos el ID del usuario logueado del estado
    const currentUserId = user.id; 

    const fetchLista = async () => {
        setLoading(true);
        try {
            // Llama al GET /api/lista-interes/{usuarioId} usando el ID único
            const response = await axios.get(`${API_LISTA_INTERES}/${currentUserId}`); 
            setLista(response.data);
        } catch (error) {
            console.error("Error al cargar lista:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // La lista se recarga cuando el ID del usuario cambia (al hacer login/logout)
        fetchLista();
    }, [currentUserId]); 

    if (loading) return <Container className="mt-5">Cargando Lista...</Container>;

    return (
        <Container className="my-5">
            <h2 className="mb-4">🛒 Mi Lista de Interés (Límite: 3 Proyectos)</h2>
            
            {lista.length === 0 ? (
                <Alert variant="info">Tu lista está vacía. Añade proyectos desde la página principal.</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Proyecto</th>
                                <th>Complejidad</th>
                                <th>Tecnologías</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map(item => (
                                <tr key={item.id}>
                                    <td>{item.proyecto.id}</td>
                                    <td>{item.proyecto.nombre}</td>
                                    <td>{item.proyecto.complejidadNivel === 3 ? 'Avanzado' : (item.proyecto.complejidadNivel === 2 ? 'Intermedia' : 'Básica')}</td>
                                    <td>{item.proyecto.tecnologiasUsadas.substring(0, 40)}...</td>
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                                            <Button size="sm" variant="outline-danger" onClick={async () => {
                                                try {
                                                    await axios.delete(`${API_LISTA_INTERES}/remove/${item.id}`);
                                                    fetchLista();
                                                } catch (e) {
                                                    alert('Error al quitar proyecto');
                                                }
                                            }}>Quitar</Button>
                                            <Button size="sm" variant="primary" onClick={() => {
                                                setInvestProjectId(item.proyecto.id);
                                                setShowInvest(true);
                                            }}>Invertir</Button>
                                            <Button size="sm" variant="success" onClick={() => setShowContact(true)}>Enviar petición de contacto</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row className="mt-4 justify-content-end">
                        <Col md={4} className="text-end">
                            <Alert variant="success">Proyectos Seleccionados: **{lista.length}**</Alert>
                            {/* Pasamos el ID del usuario al botón de checkout */}
                            <CheckoutButton itemsInList={lista.length} currentUserId={currentUserId} />
                        </Col>
                    </Row>

                    {/* Modal para invertir en un proyecto desde la lista */}
                    <CheckoutInvestModal
                        show={showInvest}
                        onHide={() => setShowInvest(false)}
                        proyectoId={investProjectId}
                        onSuccess={fetchLista}
                    />
                    
                    {/* Modal para petición de contacto (reclutamiento) */}
                    <CheckoutContactModal
                        show={showContact}
                        onHide={() => setShowContact(false)}
                        onSuccess={fetchLista}
                    />
                </>
            )}
        </Container>
    );
};

export default ListaInteresPage;