// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Importaciones de Componentes Funcionales ---
import NavbarComponent from './components/NavbarComponent';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import HomePage from './pages/Home';
import { useAuth } from './context/AuthContext'; 
import ListaInteresPage from './pages/ListaInteresPage';
import ProyectoDetallePage from './pages/ProyectoDetallePage';
import AdminReclutamientos from './pages/AdminReclutamientos';
import SoportePage from './pages/Soporte';
import AdminLogin from './pages/AdminLogin';


function App() {
    const { user } = useAuth(); // Obtenemos el usuario del contexto
    return (
        <Router>
            <NavbarComponent />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />      
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/soporte" element={<SoportePage />} />
                <Route path="/lista" element={<ListaInteresPage />} />
                <Route path="/admin/reclutamientos" element={<AdminReclutamientos />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/proyecto/:id" element={<ProyectoDetallePage />} />
            </Routes>
        </Router>
    );
}

export default App;