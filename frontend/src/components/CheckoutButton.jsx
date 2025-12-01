// src/components/CheckoutButton.jsx

import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const CheckoutButton = ({ itemsInList, currentUserId }) => {
    return (
        <div className="text-center text-muted small">
            <p>💡 Usa los botones en la tabla para interactuar con cada proyecto:</p>
            <ul className="text-start">
                <li><strong>Quitar:</strong> Elimina de tu lista</li>
                <li><strong>Invertir:</strong> Invierte en el proyecto</li>
                <li><strong>Enviar petición de contacto:</strong> Solicita información</li>
            </ul>
        </div>
    );
};

export default CheckoutButton;