// src/context/AuthContext.jsx (VERSION FINAL Y CORREGIDA PARA UNICIDAD DE ID)

import React, { createContext, useState, useContext, useEffect } from 'react'; 
import axios from 'axios';

const AuthContext = createContext();
const API_DJANGO_BASE = 'http://127.0.0.1:8000/api'; 
const API_DJANGO_LOGIN = `${API_DJANGO_BASE}/token/`; 
const API_DJANGO_REGISTER = `${API_DJANGO_BASE}/register/`;

// 🚨 FUNCIÓN PARA GENERAR UN ID FICTICIO ÚNICO BASADO EN EL NOMBRE DE USUARIO
const generateMockId = (username) => {
    let hash = 0;
    if (username.length === 0) return 1;
    for (let i = 0; i < username.length; i++) {
        const char = username.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    // Asigna un ID entre 1 y 999 para evitar conflictos con IDs reales pequeños.
    return (Math.abs(hash) % 999) + 1; 
};


export const AuthProvider = ({ children }) => {
    // Lectura inicial del token
    const [token, setToken] = useState(localStorage.getItem('access_token') || null);
    
    // Lectura inicial del username y id activo para mantener la sesión al recargar
    const initialUserId = localStorage.getItem('active_user_id') ? parseInt(localStorage.getItem('active_user_id')) : null;
    const initialUsername = localStorage.getItem('active_username') || null;
    
    const [user, setUser] = useState(token && initialUserId ? { username: initialUsername, id: initialUserId } : null);
    const [error, setError] = useState(null);

    // Efecto para configurar Axios Headers al cambiar el token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // --- LOGIN (POST /api/token/) ---
    const login = async (username, password) => {
        try {
            const response = await axios.post(API_DJANGO_LOGIN, { username, password });
            const { access, refresh } = response.data;
            
            // 🚨 CRÍTICO: Gestionar el ID único por nombre de usuario
            let userId = localStorage.getItem(`user_id_for_${username}`) 
                        ? parseInt(localStorage.getItem(`user_id_for_${username}`)) 
                        : generateMockId(username);

            // Guardar tokens y el ID activo
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem(`user_id_for_${username}`, userId); // Guardamos el ID específico
            localStorage.setItem('active_user_id', userId); // ID activo para las peticiones
            localStorage.setItem('active_username', username);

            setToken(access);
            setUser({ username, id: userId }); 
            setError(null);
            return true;
        } catch (err) {
            console.error("Login Fallido:", err.response?.data || err.message);
            setError("Credenciales incorrectas o error de servidor.");
            return false;
        }
    };

    // --- LOGOUT ---
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('active_user_id');
        localStorage.removeItem('active_username');
        setToken(null);
        setUser(null);
    };

    // --- REGISTER (POST /api/register/) ---
    const register = async (username, email, password) => {
        try {
            await axios.post(API_DJANGO_REGISTER, { username, email, password });
            setError(null);
            return login(username, password); 
        } catch (err) {
            console.error("Registro Fallido:", err.response?.data || err.message);
            setError("Error al registrar usuario. El nombre de usuario o email ya existe.");
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, error, login, logout, register, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);