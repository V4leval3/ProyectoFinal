// src/components/Register.jsx

import React, { useState, useEffect } from 'react'; // ⬅️ IMPORTAR useEffect
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, error, setError, token } = useAuth();
    const navigate = useNavigate();

    // 🚨 CORRECCIÓN: Usar useEffect para manejar la redirección
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]); // Dependencias

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const success = await register(username, email, password);

        if (success) {
            alert("Registro exitoso. ¡Bienvenido!");
            // navigate('/') ya se activará automáticamente vía useEffect
        } 
    };

    return (
        <Container className="my-5" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Crear Cuenta (Empresas/Alumnos)</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formRegisterUsername">
                    <Form.Label>Nombre de Usuario</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegisterEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegisterPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </Form.Group>
                
                <div className="d-grid gap-2">
                    <Button variant="success" type="submit">
                        Registrarme
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default RegisterPage;