// BugModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import toast, { Toaster } from 'react-hot-toast'; //https://react-hot-toast.com/

const BugModal = ({ show, handleClose, handleSaveBug, project, resetBugData }) => {
    const getCurrentDateTime = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 16);
        return formattedDate;
      };

  const [bugData, setBugData] = useState({
    name: '',
    status: 'Nerezolvat',
    priority: 'Low',
    creationdate: getCurrentDateTime(),
    description: '', // Adăugat câmpul pentru descriere
    commitLink: '', // Adăugat câmpul pentru link commit
    allocatedto: null, // Setat pe null ca valoare implicită
    userId: null, //placeholder deoarece am facut actiunea de setare userId pe partea de Dashboard.js ca sa nu mai fac inca o incarcare de verificare token.
    projectId: project.id,
    fixLink: null,
  });


  useEffect(() => {
    if (resetBugData) {
      // Reset the bugData state
      setBugData({
        name: '',
        status: 'Nerezolvat',
        priority: 'Low',
        creationdate: getCurrentDateTime(),
        userId: null,
        projectId: project.id,
      });
      // Reset the flag after using it
      resetBugData();
    }
  }, [resetBugData, project.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBugData({ ...bugData, [name]: value });
  };

  const handleSave = async () => {
    if (validateBugData()) {
      handleSaveBug(bugData);
      handleClose();
      
    } else {
      //alert('Invalid bug data. Please check the fields.');
      toast.error('S-a intampinat o eroare. Verifica datele introduse!')
    }
  };

  const validateBugData = () => {
    // Implementează logica de validare a datelor
    return (
      bugData.name.trim() !== '' &&
      bugData.status.trim() !== '' &&
      bugData.priority.trim() !== '' &&
      bugData.creationdate.trim() !== ''
    );
  };

  
  return (
    
    <Modal show={show} onHide={handleClose}>
        <Toaster />
      <Modal.Header closeButton>
        <Modal.Title>Add Bug</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="bugName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={bugData.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="bugStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={bugData.status}
              onChange={handleInputChange}
            >
              <option value="Nerezolvat">Nerezolvat</option>
              <option value="Rezolvat">Rezolvat</option>
              <option value="Preluat">Preluat</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="bugPriority">
            <Form.Label>Priority</Form.Label>
            <Form.Control
              as="select"
              name="priority"
              value={bugData.priority}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="bugCreationDate">
            <Form.Label>Creation Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="creationdate"
              value={bugData.creationdate}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="bugDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={bugData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="bugCommitLink">
            <Form.Label>Commit Link</Form.Label>
            <Form.Control
              type="text"
              name="commitLink"
              value={bugData.commitLink}
              onChange={handleInputChange}
            />
          </Form.Group>

          {/* Alte câmpuri și formulare, după nevoie */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Bug
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BugModal;
