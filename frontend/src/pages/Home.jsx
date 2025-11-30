// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// RUTA CORREGIDA: Ahora ProyectoCard está un nivel arriba (../components)
import ProyectoCard from '../components/ProyectoCard'; 
import { Container, Row, Col, Alert } from 'react-bootstrap';

const API_SPRING_BOOT = 'http://localhost:8080/api/proyectos';

// 1. Cambiar el nombre de la función
function HomePage() { 
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(API_SPRING_BOOT) // Usamos la constante definida arriba
      .then(response => {
        setProyectos(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar proyectos:", err);
        setError("No se pudo conectar al servidor de proyectos (Spring Boot).");
        setLoading(false);
      });
  }, []);

  if (loading) return <Container className="mt-5">Cargando proyectos...</Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Proyectos destacados hechos por alumnos Tecsup</h1>
      <Row>
        {proyectos.length === 0 ? (
          <Alert variant="info">Aún no hay proyectos publicados.</Alert>
        ) : (
          proyectos.map(p => (
            <Col key={p.id} sm={12} md={6} lg={4}>
              <ProyectoCard proyecto={p} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

// 2. Exportar la nueva función
export default HomePage;