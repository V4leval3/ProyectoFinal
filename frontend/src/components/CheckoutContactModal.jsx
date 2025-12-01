import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const API_CHECKOUT = '/api/checkout';

const CheckoutContactModal = ({ show, onHide, onSuccess }) => {
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    industria: '',
    perfiles: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!form.nombre || !form.empresa || !form.email || !form.telefono || !form.industria || !form.perfiles) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        nombre: form.nombre,
        empresa: form.empresa,
        email: form.email,
        telefono: form.telefono,
        industria: form.industria,
        perfiles: form.perfiles
      };

      const response = await axios.post(`${API_CHECKOUT}/contacto-reclutamiento`, payload);
      setSuccess('✅ Petición registrada. Nuestro equipo lo revisará y te contactaremos pronto.');
      setTimeout(() => {
        onSuccess?.();
        onHide();
        setForm({ nombre: '', empresa: '', email: '', telefono: '', industria: '', perfiles: '' });
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(`❌ Error: ${err.response?.data || 'Error al procesar la petición'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🤝 Petición de Contacto (Reclutamiento de Talento)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo del Contacto *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Juan Pérez García"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Empresa *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: TechCorp Solutions"
              value={form.empresa}
              onChange={(e) => handleChange('empresa', e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico Corporativo *</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ej: contacto@empresa.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono Corporativo (con código de país) *</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Ej: +51 987654321"
              value={form.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Industria de la Empresa *</Form.Label>
            <Form.Select
              value={form.industria}
              onChange={(e) => handleChange('industria', e.target.value)}
              disabled={loading}
            >
              <option value="">-- Selecciona una industria --</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Salud">Salud</option>
              <option value="Educación">Educación</option>
              <option value="Retail">Retail</option>
              <option value="Manufactura">Manufactura</option>
              <option value="Logística">Logística</option>
              <option value="Energía">Energía</option>
              <option value="Telecomunicaciones">Telecomunicaciones</option>
              <option value="Otra">Otra</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>¿Qué perfiles buscas? *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ej: Desarrolladores Full-Stack, QA Engineers, Product Managers..."
              value={form.perfiles}
              onChange={(e) => handleChange('perfiles', e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Alert variant="info">
            ℹ️ Esta información se compartirá con nuestro equipo de reclutamiento. Te contactaremos pronto con opciones de talento disponible.
          </Alert>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading || !form.nombre || !form.empresa || !form.email || !form.telefono || !form.industria || !form.perfiles}
        >
          {loading ? <Spinner size="sm" className="me-2" /> : null}
          {loading ? 'Enviando...' : '✅ Enviar Petición de Contacto'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutContactModal;
