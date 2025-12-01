import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '../config';

const API_CHECKOUT = '/api/checkout';
const API_PROYECTO = '/api/proyectos';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutDonationModal = ({ show, onHide, onSuccess, proyectoId }) => {
  const [monto, setMonto] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [proyecto, setProyecto] = useState(null);
  const [loadingProyecto, setLoadingProyecto] = useState(true);
  const [step, setStep] = useState('form'); // 'form', 'payment', 'success'
  const [processingPayment, setProcessingPayment] = useState(false);

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

    setLoading(true);
    setError(null);
    setStep('payment');

    // If user selected card, prepare to collect card details via Stripe Elements
    if (paymentMethod === 'tarjeta') {
      setProcessingPayment(true);
      setLoading(false);
      return; // actual processing continues in StripePayment component
    }

    // For non-card methods we keep the simulated flow
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
        setProcessingPayment(false);
      }
    }, 1500);
  };

  const resetModal = () => {
    setMonto('');
    setPaymentMethod('tarjeta');
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

                {paymentMethod === 'tarjeta' && processingPayment && (
                  <Elements stripe={stripePromise}>
                    <StripePayment monto={monto} proyectoId={proyectoId} onSuccess={() => {
                      setSuccess('✅ Donación procesada exitosamente');
                      setStep('success');
                      setMonto('');
                      setTimeout(() => { onSuccess?.(); resetModal(); onHide(); }, 1500);
                    }} onError={(msg) => { setError(msg); setStep('form'); setProcessingPayment(false); }} />
                  </Elements>
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

function StripePayment({ monto, proyectoId, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    if (!monto || monto <= 0) { onError('Monto inválido'); return; }
    setLoading(true);
    try {
      // Create PaymentIntent on server
      const resp = await axios.post(`${API_CHECKOUT}/create-payment-intent`, {
        monto: parseFloat(monto),
        currency: 'PEN',
        proyectoId
      });
      const clientSecret = resp.data.clientSecret;
      if (!clientSecret) throw new Error('No se obtuvo clientSecret');

      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card }
      });

      if (result.error) {
        onError(result.error.message || 'Error al procesar el pago');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        onSuccess();
      } else {
        onError('Pago no completado');
      }
    } catch (e) {
      onError(e.message || 'Error al procesar pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-3">
      <div className="mb-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {msg && <Alert variant="danger">{msg}</Alert>}
      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={() => onError('Pago cancelado')} className="me-2">Cancelar</Button>
        <Button variant="primary" onClick={handlePay} disabled={!stripe || loading}>{loading ? 'Procesando...' : `Pagar S/. ${monto}`}</Button>
      </div>
    </div>
  );
}
