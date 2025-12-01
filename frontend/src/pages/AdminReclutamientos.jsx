import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:8080/api/checkout'
  : '/api/checkout';

const AdminReclutamientos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.isAdmin && !localStorage.getItem('admin_jwt')) { setLoading(false); return; }
    const adminJwt = localStorage.getItem('admin_jwt');
    const headers = adminJwt ? { Authorization: `Bearer ${adminJwt}` } : { 'X-Is-Admin': 'true' };
    axios.get(`${API}/reclutamientos`, { headers })
      .then(res => setItems(res.data))
      .catch(err => setError('No se pudo cargar las peticiones'))
      .finally(() => setLoading(false));
  }, [user?.isAdmin]);

  const updateEstado = (id, estado) => {
    const adminJwt = localStorage.getItem('admin_jwt');
    const headers = adminJwt ? { Authorization: `Bearer ${adminJwt}` } : { 'X-Is-Admin': 'true' };
    axios.put(`${API}/reclutamientos/${id}/status`, { status: estado }, { headers })
      .then(res => setItems(prev => prev.map(i => i.id === id ? { ...i, estado: res.data.estado } : i)))
      .catch(err => setError('No se pudo actualizar el estado'));
  };

  if (loading) return <Container className="mt-5 text-center"><Spinner animation="border"/> Cargando...</Container>;
  if (!user?.isAdmin) return <Container className="mt-5"><Alert variant="warning">Acceso denegado. Debes ser administrador para ver esta página.</Alert></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-4">
      <h3>📥 Peticiones de Reclutamiento</h3>
      {items.length === 0 ? (
        <Alert variant="info">No hay solicitudes pendientes.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Industria</th>
              <th>Perfiles</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td>{r.empresa}</td>
                <td>{r.email}</td>
                <td>{r.telefono}</td>
                <td>{r.industria}</td>
                <td style={{maxWidth:300}}>{r.perfiles}</td>
                <td>{r.estado}</td>
                <td>
                  <Button size="sm" variant="success" className="me-2" onClick={() => updateEstado(r.id, 'CONFIRMADO')}>Confirmar</Button>
                  <Button size="sm" variant="danger" onClick={() => updateEstado(r.id, 'RECHAZADO')}>Rechazar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminReclutamientos;
