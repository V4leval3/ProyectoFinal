// src/components/Login.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, setError, token } = useAuth(); // token se actualiza en AuthContext
  const navigate = useNavigate();

  // 🚨 CORRECCIÓN: La redirección está bien en useEffect.
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]); // Se ejecuta cuando el token cambia.

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 
    
    const success = await login(username, password);

    // 🚨 Redirección forzada aquí para manejo inmediato de la UI, ya que el estado es síncrono.
    if (success) {
      console.log('Login exitoso. Forzando redirección...');
      navigate('/'); 
    } 
  };

  return (
    <Container className="my-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Iniciar Sesión (Empresas/Usuarios)</h2>
      
      {/* Muestra el mensaje de error si existe */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Introduce tu usuario" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </Form.Group>
        
        <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
                Entrar
            </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoginPage;