// Toaster.js
import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';

const Toaster = ({ alert, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getVariant = () => {
    switch (alert.type) {
      case 'success':
        return 'success';
      case 'warn':
        return 'warning';
      case 'error':
        return 'danger';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <Toast show={show} onClose={() => setShow(false)} delay={5000} autohide>
        <Toast.Header variant={getVariant()}>
          <strong className="me-auto">{alert.type}</strong>
        </Toast.Header>
        <Toast.Body>{alert.message}</Toast.Body>
      </Toast>
    </div>
  );
};

const Alerts = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div>
      {alert && <Toaster alert={alert} onClose={closeAlert} />}
      {/* Alte componente sau conținut */}
    </div>
  );
};

export { Alerts };