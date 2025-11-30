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

// ⚠️ DEFINICIÓN TEMPORAL Y CRÍTICA:
// Esta es la definición temporal de SoportePage. 
// La dejamos aquí hasta que creemos el archivo src/pages/Soporte.jsx
const SoportePage = () => <div className="p-5"><h2>Área de Soporte (Pendiente)</h2><p>Aquí irá el formulario de tickets, conectado a la API de Django.</p></div>;


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
                <Route path="/soporte" element={<SoportePage />} />
                <Route path="/proyecto/:id" element={<ProyectoDetallePage />} />
            </Routes>
        </Router>
    );
}

export default App;