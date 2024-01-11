import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const EditProjectModal = ({ show, handleClose, handleUpdateProject }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [additionalMembers, setAdditionalMembers] = useState('');

  const handleSave = async () => {
    if (name && link && additionalMembers) {
      // Trimite datele către funcția de adăugare a proiectului
      await handleUpdateProject({ name, link, additionalMembers });
      handleClose();
    } else {
      toast.error('Completați toate câmpurile.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formProjectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control type="text" placeholder="Enter project name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formProjectLink">
            <Form.Label>Project Link</Form.Label>
            <Form.Control type="text" placeholder="Enter project link" value={link} onChange={(e) => setLink(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formAdditionalMembers">
            <Form.Label>Additional Members</Form.Label>
            <Form.Control type="text" placeholder="Enter additional members" value={additionalMembers} onChange={(e) => setAdditionalMembers(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProjectModal;