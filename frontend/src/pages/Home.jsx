// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProyectoCard from '../components/ProyectoCard'; 
import { Container, Row, Col, Alert, Form, Button } from 'react-bootstrap';

const API_SPRING_BOOT = '/api/proyectos';

function HomePage() { 
  const [proyectos, setProyectos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    axios.get(API_SPRING_BOOT)
      .then(response => {
        setProyectos(response.data);
        setFiltrados(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar proyectos:", err);
        setError("No se pudo conectar al servidor de proyectos (Spring Boot).");
        setLoading(false);
      });
  }, []);

  // Mapa de complejidad para display legible
  const getComplejidadLabel = (nivel) => {
    const map = { 1: 'Básica', 2: 'Intermedia', 3: 'Avanzada' };
    return map[nivel] || 'Desconocida';
  };

  // Función para realizar la búsqueda y filtrado
  const realizarBusqueda = () => {
    let resultados = proyectos;

    // Filtrar por término de búsqueda (nombre, descripción, tecnologías)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      resultados = resultados.filter(p =>
        (p.nombre && p.nombre.toLowerCase().includes(term)) ||
        (p.descripcionCorta && p.descripcionCorta.toLowerCase().includes(term)) ||
        (p.tecnologiasUsadas && p.tecnologiasUsadas.toLowerCase().includes(term))
      );
    }

    // Filtrar por complejidad si está seleccionada
    if (selectedComplexity) {
      resultados = resultados.filter(p => p.complejidadNivel === parseInt(selectedComplexity));
    }

    setFiltrados(resultados);
  };

  // Búsqueda debounced (350ms) en tiempo real
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Limpiar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Establecer nuevo timeout para realizar búsqueda después de 350ms sin escribir
    const newTimeout = setTimeout(() => {
      realizarBusqueda();
    }, 350);

    setSearchTimeout(newTimeout);
  };

  // Re-ejecutar búsqueda cuando cambien los filtros
  useEffect(() => {
    realizarBusqueda();
  }, [selectedComplexity]);

  if (loading) return <Container className="mt-5">Cargando proyectos...</Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Proyectos destacados hechos por alumnos Tecsup</h1>

      {/* Formulario de búsqueda y filtros */}
      <Row className="mb-4">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Buscar proyectos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Busca por nombre, tecnología o descripción..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filtrar por complejidad</Form.Label>
            <Form.Select
              value={selectedComplexity}
              onChange={(e) => {
                setSelectedComplexity(e.target.value);
              }}
            >
              <option value="">Todas las complejidades</option>
              <option value="1">Básica</option>
              <option value="2">Intermedia</option>
              <option value="3">Avanzada</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Resultados */}
      <Row>
        {filtrados.length === 0 ? (
          <Alert variant="info" className="w-100">
            {proyectos.length === 0 ? 'Aún no hay proyectos publicados.' : 'No se encontraron proyectos con esos criterios.'}
          </Alert>
        ) : (
          filtrados.map(p => (
            <Col key={p.id} sm={12} md={6} lg={4}>
              <ProyectoCard proyecto={p} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default HomePage;