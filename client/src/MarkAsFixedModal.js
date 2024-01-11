// MarkAsFixedModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const MarkAsFixedModal = ({ show, handleClose, handleMarkAsFixed }) => {
  const [commitLink, setCommitLink] = useState('');

  const handleConfirm = () => {
    // Trimite commitLink către funcția handleMarkAsFixed din componenta părinte
    handleMarkAsFixed(commitLink);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Marchează ca Rezolvat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="commitLink">
            <Form.Label>Link commit rezolvare</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduceți link-ul commit-ului"
              value={commitLink}
              onChange={(e) => setCommitLink(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Anulează
        </Button>
        <Button variant="success" onClick={handleConfirm}>
          Confirmă
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MarkAsFixedModal;