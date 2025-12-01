import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SoportePage = () => {
  const { user, token } = useAuth();
  const [asunto, setAsunto] = useState('BUG');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tickets, setTickets] = useState([]);

  const API = '/api/tickets';

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get(API)
      .then(res => setTickets(res.data))
      .catch(err => console.error('No se pudieron cargar los tickets', err))
      .finally(() => setLoading(false));
  }, [token]);

  const submitTicket = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!token) {
      setError('Debes iniciar sesión para enviar un ticket.');
      return;
    }
    if (!mensaje.trim()) {
      setError('Escriba un mensaje antes de enviar.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(API + '/', { asunto, mensaje });
      setSuccess('Ticket enviado correctamente.');
      setMensaje('');
      // Reload list
      const res = await axios.get(API);
      setTickets(res.data);
    } catch (err) {
      setError(err.response?.data || 'Error al enviar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h3>Área de Soporte</h3>
      {!token && <Alert variant="warning">Debes iniciar sesión para crear tickets. Ve a Login.</Alert>}

      <Form onSubmit={submitTicket} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Asunto</Form.Label>
          <Form.Select value={asunto} onChange={e => setAsunto(e.target.value)} disabled={!token}>
            <option value="BUG">Error de Plataforma</option>
            <option value="INFO">Consulta de Contacto Empresarial</option>
            <option value="REPORT">Reporte de Proyecto</option>
            <option value="OTHER">Otro</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control as="textarea" rows={5} value={mensaje} onChange={e => setMensaje(e.target.value)} disabled={!token} />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <div className="d-grid">
          <Button type="submit" disabled={!token || loading}>{loading ? 'Enviando...' : 'Enviar Ticket'}</Button>
        </div>
      </Form>

      <h5>Mis tickets</h5>
      {loading && <Spinner animation="border" />}
      {!loading && tickets.length === 0 && <Alert variant="info">No tienes tickets aún.</Alert>}

      {tickets.length > 0 && (
        <Table striped bordered>
          <thead>
            <tr><th>ID</th><th>Asunto</th><th>Mensaje</th><th>Estado</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.asunto}</td>
                <td style={{maxWidth:300}}>{t.mensaje}</td>
                <td>{t.estado}</td>
                <td>{new Date(t.fecha_creacion).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default SoportePage;
