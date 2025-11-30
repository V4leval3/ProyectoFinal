// src/components/CheckoutButton.jsx

import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const CheckoutButton = ({ itemsInList }) => {
    const MOCK_USER_ID = 1; 

    const handleCheckout = async () => {
        if (itemsInList === 0) return;

        if (window.confirm(`¿Confirmas el envío de la petición de contacto para ${itemsInList} proyectos? Esto vaciará tu lista.`)) {
            try {
                // Llama al POST /api/lista-interes/checkout/{usuarioId}
                const response = await axios.post(`http://localhost:8080/api/lista-interes/checkout/${MOCK_USER_ID}`);
                alert(`✅ Transacción Exitosa: ${response.data}`);
                window.location.reload(); // Recarga para vaciar la lista y ver los cambios
            } catch (error) {
                const errorMessage = error.response.data || 'Error al procesar el contacto.';
                alert(`❌ Error: ${errorMessage}`);
            }
        }
    };

    return (
        <Button variant="danger" onClick={handleCheckout} disabled={itemsInList === 0} className="w-100">
            Simular Contacto (Pasarela de Datos)
        </Button>
    );
};

export default CheckoutButton;