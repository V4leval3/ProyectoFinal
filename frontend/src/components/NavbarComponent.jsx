// src/components/NavbarComponent.jsx (CORREGIDO)

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // ⬅️ IMPORTAR useNavigate
import { useAuth } from '../context/AuthContext';

const NavbarComponent = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // ⬅️ Usar el hook de navegación

    // Funciones para manejar el clic en los botones
    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">🚀 Tecsup Showcase</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Proyectos</Nav.Link>
                        <Nav.Link as={Link} to="/lista">Lista de Interés</Nav.Link>
                        <Nav.Link as={Link} to="/soporte">Soporte</Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Bienvenido: <strong>{user.username}</strong>
                                </Navbar.Text>
                                <Button variant="outline-danger" onClick={logout}>
                                    Salir
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* 🚨 Solución de Navegación: Usar onClick + navigate */}
                                <Button 
                                    variant="outline-primary" 
                                    onClick={handleLoginClick} 
                                    className="me-2"
                                >
                                    Login
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={handleRegisterClick} 
                                >
                                    Registrarme
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;