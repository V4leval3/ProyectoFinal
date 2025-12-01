import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const API_CHECKOUT = '/api/checkout';
const API_PROYECTO = '/api/proyectos';

const CheckoutDonationModal = ({ show, onHide, onSuccess, proyectoId }) => {
  const [monto, setMonto] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [proyecto, setProyecto] = useState(null);
  const [loadingProyecto, setLoadingProyecto] = useState(true);
  const [step, setStep] = useState('form'); // 'form', 'payment', 'success'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    if (show && proyectoId) {
      setLoadingProyecto(true);
      setStep('form');
      setError(null);
      setSuccess(null);
      axios.get(`${API_PROYECTO}/${proyectoId}`)
        .then(res => setProyecto(res.data))
        .catch(err => console.error('Error cargando proyecto:', err))
        .finally(() => setLoadingProyecto(false));
    }
  }, [show, proyectoId]);

  const tieneCuentaBancaria = proyecto?.cuentaBancaria ? true : false;

  const handleSubmitForm = async () => {
    if (!monto || monto <= 0) {
      setError('Por favor ingresa un monto válido');
      return;
    }

    if (paymentMethod === 'tarjeta' && (!cardNumber || !cardExp || !cardCvc)) {
      setError('Por favor completa los datos de la tarjeta');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('payment');

    // Simular procesamiento de pago - esperar 2 segundos
    setTimeout(async () => {
      try {
        const response = await axios.post(`${API_CHECKOUT}/donar`, {
          monto: parseFloat(monto),
          proyectoId: proyectoId,
          metodo: paymentMethod
        });

        setSuccess(response.data.mensaje || '✅ Donación procesada exitosamente');
        setStep('success');
        setMonto('');
        setCardNumber('');
        setCardExp('');
        setCardCvc('');
        
        setTimeout(() => {
          onSuccess?.();
          resetModal();
          onHide();
        }, 2500);
      } catch (err) {
        setError(`❌ Error: ${err.response?.data?.mensaje || 'Error al procesar donación'}`);
        setStep('form');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const resetModal = () => {
    setMonto('');
    setPaymentMethod('tarjeta');
    setCardNumber('');
    setCardExp('');
    setCardCvc('');
    setError(null);
    setSuccess(null);
    setStep('form');
  };

  const handleClose = () => {
    resetModal();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>💝 Sistema de Donación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingProyecto ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : !tieneCuentaBancaria ? (
          <Alert variant="warning" className="text-center mb-0">
            <h5>😔 Donación no disponible por el momento :(</h5>
            <p className="mb-0">Este proyecto aún no tiene una cuenta bancaria configurada.</p>
          </Alert>
        ) : (
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {step === 'form' && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Monto a Donar (S/.)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ej: 100"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    disabled={loading}
                    min="10"
                    step="10"
                  />
                  <Form.Text className="text-muted">Mínimo: S/. 10</Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Método de Pago</Form.Label>
                  <Form.Select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={loading}
                  >
                    <option value="tarjeta">💳 Tarjeta de Crédito/Débito</option>
                    <option value="yape">📱 Yape (QR)</option>
                    <option value="transferencia">🏦 Transferencia Bancaria</option>
                  </Form.Select>
                </Form.Group>

                {paymentMethod === 'tarjeta' && (
                  <div className="border rounded p-3 mb-3">
                    <small className="text-muted d-block mb-3">💡 Tarjeta de prueba: 4242 4242 4242 4242 | Exp: 12/25 | CVC: 123</small>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de Tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                        disabled={loading}
                        maxLength="16"
                      />
                    </Form.Group>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Vencimiento (MM/AA)</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="12/25"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            disabled={loading}
                            maxLength="5"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>CVC</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="123"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            disabled={loading}
                            maxLength="4"
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'yape' && (
                  <Alert variant="info" className="text-center">
                    <div className="py-3">
                      <div style={{
                        width: '200px',
                        height: '200px',
                        background: '#f0f0f0',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}>
                        QR Yape
                      </div>
                    </div>
                    <p className="mt-3 mb-0"><strong>Escanea este código QR con tu app Yape</strong></p>
                  </Alert>
                )}

                {paymentMethod === 'transferencia' && (
                  <Alert variant="info">
                    <strong>Datos para Transferencia:</strong>
                    <ListGroup className="mt-2">
                      <ListGroup.Item>Banco: Interbank</ListGroup.Item>
                      <ListGroup.Item>Cuenta: {proyecto?.cuentaBancaria}</ListGroup.Item>
                      <ListGroup.Item>Titular: Tecsup Showcase</ListGroup.Item>
                    </ListGroup>
                  </Alert>
                )}
              </Form>
            )}

            {step === 'payment' && (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" className="mb-3">
                  <span className="visually-hidden">Procesando...</span>
                </Spinner>
                <h5>Procesando tu donación...</h5>
                <p className="text-muted">No cierres esta ventana</p>
                <div className="mt-4 p-3 bg-light rounded">
                  <p><strong>Monto:</strong> S/. {monto}</p>
                  <p><strong>Método:</strong> {paymentMethod === 'tarjeta' ? 'Tarjeta' : paymentMethod === 'yape' ? 'Yape' : 'Transferencia'}</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-4">
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h5 className="mt-3">¡Donación Exitosa!</h5>
                <p className="text-muted">{success}</p>
                <div className="mt-3 p-3 bg-light rounded">
                  <p><strong>Monto donado:</strong> S/. {monto}</p>
                  <p className="text-success"><strong>Estado:</strong> Completado</p>
                </div>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading || loadingProyecto}>
          Cancelar
        </Button>
        {tieneCuentaBancaria && step === 'form' && (
          <Button 
            variant="success" 
            onClick={handleSubmitForm} 
            disabled={loading || !monto || loadingProyecto}
          >
            {loading ? <Spinner size="sm" className="me-2" /> : null}
            {loading ? 'Procesando...' : '💳 Continuar al Pago'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutDonationModal;
