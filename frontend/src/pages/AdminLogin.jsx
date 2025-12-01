import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      const token = res.data?.token;
      if (!token) throw new Error('No token returned');
      localStorage.setItem('admin_jwt', token);
      localStorage.setItem('is_admin', 'true');
      // Navigate to admin panel
      navigate('/admin/reclutamientos');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error de login');
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: 480 }}>
      <h3>Admin Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <div className="d-grid">
          <Button type="submit">Entrar como Admin</Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminLogin;
