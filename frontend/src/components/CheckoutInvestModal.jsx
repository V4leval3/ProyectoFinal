import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const API_CHECKOUT = '/api/checkout';

const CheckoutInvestModal = ({ show, onHide, onSuccess, proyectoId }) => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    monto: 'Menos de $1000',
    experiencia: 'Principiante',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState(null);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!form.nombre || !form.email || !form.telefono || !form.monto || !form.experiencia) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }

    setLoading(true);
    setError(null);
    setWhatsappLink(null);

    try {
      const payload = {
        proyectoId: proyectoId,
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        monto: form.monto,
        experiencia: form.experiencia,
        motivo: form.motivo
      };

      const response = await axios.post(`${API_CHECKOUT}/invertir`, payload);
      setWhatsappLink(response.data.enlaceWhatsApp);
    } catch (err) {
      setError(err.response?.data || 'Error al procesar la petición de inversión');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
      // Do not close immediately - allow user to return to SPA without 404
      onSuccess?.();
      onHide();
      setForm({ nombre: '', email: '', telefono: '', monto: 'Menos de $1000', experiencia: 'Principiante', motivo: '' });
      setWhatsappLink(null);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>💼 Invertir en Proyectos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {!whatsappLink ? (
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control type="text" value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Teléfono (con código país)</Form.Label>
              <Form.Control type="text" value={form.telefono} onChange={(e) => handleChange('telefono', e.target.value)} disabled={loading} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Monto dispuesto a Invertir (Aprox.)</Form.Label>
              <Form.Select value={form.monto} onChange={(e) => handleChange('monto', e.target.value)} disabled={loading}>
                <option>Menos de $1000</option>
                <option>Entre $1000 - $3000</option>
                <option>Más de $3000</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Experiencia en Inversión</Form.Label>
              <Form.Select value={form.experiencia} onChange={(e) => handleChange('experiencia', e.target.value)} disabled={loading}>
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Experto</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>¿Por qué te interesa este proyecto?</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.motivo} onChange={(e) => handleChange('motivo', e.target.value)} disabled={loading} />
            </Form.Group>

            <Alert variant="info">ℹ️ Se generará un enlace de WhatsApp para continuar el proceso de due diligence con el equipo responsable.</Alert>
          </Form>
        ) : (
          <Alert variant="success" className="text-center">
            <h5>✅ ¡Enlace generado!</h5>
            <p className="mb-0">Haz clic en el botón de abajo para contactarnos en WhatsApp</p>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        {!whatsappLink ? (
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            {loading ? 'Procesando...' : 'Solicitar Información para Invertir por WhatsApp'}
          </Button>
        ) : (
          <Button 
            variant="success" 
            onClick={handleOpenWhatsApp}
            className="d-flex align-items-center"
          >
            📱 Abrir WhatsApp
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutInvestModal;
