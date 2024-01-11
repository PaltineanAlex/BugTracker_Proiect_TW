// ProjectDetails.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, Button, Card, Toast } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import verifyToken from './authService';
import BugModal from './BugModal';

import Sidebar from './SidebarMenu';
import Header from './Header';

import ConfirmationModal from './ConfirmationModal';

import './sidebar.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [showBugModal, setShowBugModal] = useState(false);
  const [resetBugData, setResetBugData] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // Track user details separately

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = await verifyToken();
        const userResponse = await fetch(`http://localhost:8080/api/users/${date.user.id}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userDetailsData = await userResponse.json();
        setUserDetails(userDetailsData);

        const response = userDetailsData.usertype === 'MP'
          ? await fetch(`http://localhost:8080/api/projects/user/${date.user.id}`)
          : await fetch('http://localhost:8080/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        toast.error('Error fetching projects');
      }
    };

    fetchData();
  }, []);

  const handleShowBugModal = () => {
    if (selectedProject) {
      setResetBugData(true);
      setShowBugModal(true);
    } else {
      console.error('No project selected');
    }
  };

  const handleCloseBugModal = () => {
    setShowBugModal(false);
  };

  const handleSaveBug = async (bugData) => {
    try {
      const date = await verifyToken();
      bugData.userId = date.user.id;
      bugData.projectId = selectedProject.id;
      const response = await fetch('http://localhost:8080/api/bugAdd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bugData),
      });

      if (!response.ok) {
        throw new Error('Failed to save bug');
      }

      const responseBugs = await fetch(`http://localhost:8080/api/bugs/${selectedProject.id}`);
      if (responseBugs.ok) {
        const bugsData = await responseBugs.json();
        setBugs(bugsData);
      }
      toast.success('Bug-ul a fost introdus cu succes!');
    } catch (error) {
      console.error('Error saving bug:', error.message);
    }
  };


  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const responseProject = await fetch(`http://localhost:8080/api/project/${projectId}`);
        if (!responseProject.ok) {
          throw new Error('Failed to fetch project details');
        }

        const project = await responseProject.json();
        setSelectedProject(project);

        const responseBugs = await fetch(`http://localhost:8080/api/bugs/${projectId}`);
        if (!responseBugs.ok) {
          throw new Error('Failed to fetch bugs');
        }

        const bugsData = await responseBugs.json();
        setBugs(bugsData);

        const responseUser = await fetch(`http://localhost:8080/api/users/${project.userId}`);
        if (responseUser.ok) {
          const userDetails = await responseUser.json();
          setExpandedUserDetails(userDetails);
        } else {
          setExpandedUserDetails(null);
        }
      } catch (error) {
        console.error('Error fetching project details:', error.message);
        navigate('/');
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);


  const handleEditClick = (bugId) => {
    // Implementează logica pentru editare
    console.log(`Edit bug with ID ${bugId}`);
  };

  const handleOpenClick = (bugId) => {
    navigate(`/bugs/${bugId}`);
  };


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bugToDelete, setBugToDelete] = useState(null);
  const handleDeleteClick = (bugId) => {
    setBugToDelete(bugId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Apelați API-ul pentru ștergerea bug-ului
      const response = await fetch(`http://localhost:8080/api/bugs/${bugToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bug');
      }

      // Actualizați starea bugs după ștergere
      setBugs((prevBugs) => prevBugs.filter((bug) => bug.id !== bugToDelete));
      toast.success('Bug deleted successfully');
    } catch (error) {
      console.error('Error deleting bug:', error.message);
      toast.error('Error deleting bug');
    } finally {
      // Închideți modalul și resetați starea
      setShowDeleteModal(false);
      setBugToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    // Închideți doar modalul, fără a face ștergerea
    setShowDeleteModal(false);
    setBugToDelete(null);
  };

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [expandedUserDetails, setExpandedUserDetails] = useState(null);
  const handleAccordionToggle = async (index) => {
    try {
      const selectedBug = bugs[index];
      setExpandedUserId(selectedBug.userId);
  
      if (expandedUserId !== selectedBug.userId) {
        const responseUser = await fetch(`http://localhost:8080/api/users/${selectedBug.userId}`);
        if (responseUser.ok) {
          const userDetails = await responseUser.json();
          setExpandedUserDetails(userDetails);
        } else {
          setExpandedUserDetails(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      setExpandedUserDetails(null);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow-1">
        {/* Header */}
        <Header />

        {selectedProject && (
          <main className="container-fluid p-3">
            <Toaster />
            <Card className="mb-3 bg-secondary text-white">
              <Card.Header className='bg-dark text-white'>{selectedProject.name}</Card.Header>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Subtitle className="mb-2">Project id: {selectedProject.id}</Card.Subtitle>
                  <Card.Text>
                    <strong>Link:</strong> {selectedProject.link}<br />
                    <strong>Created By:</strong> {selectedProject.userId} ({expandedUserDetails ? expandedUserDetails.username : 'Unknown User'})
                    <br />
                    <strong>Other Members:</strong> {selectedProject.additionalMembers || 'None'}
                  </Card.Text>
                </div>
                <div className="d-flex align-self-end">
                {userDetails && userDetails.usertype === 'TS' && (
                  <Button variant="success" onClick={handleShowBugModal}>
                    Add Bug
                  </Button>
                )}
                  <BugModal
					          show={showBugModal}
					          handleClose={handleCloseBugModal}
					          handleSaveBug={handleSaveBug}
					          project={selectedProject}
					          resetBugData={() => setResetBugData(false)}
					        />

                </div>
              </Card.Body>
            </Card>


      <Accordion>
        {bugs.map((bug, index) => (
          <Accordion.Item key={bug.id} eventKey={index.toString()}>
            <Accordion.Header onClick={() => handleAccordionToggle(index)}>
              <span className={`status-indicator ${bug.status.toLowerCase()}`}>
                {bug.status}
              </span>
              {bug.name}
            </Accordion.Header>
            <Accordion.Body>
                      <p>
                        <strong>Description:</strong> {bug.description}
                      </p>
                      <p>
                        <strong>Priority:</strong> {bug.priority}
                      </p>
                      <p>
                        <strong>Creation Date:</strong> {bug.creationdate},{' '}
                        <strong>Created by:</strong>{' '}
                        {expandedUserDetails ? expandedUserDetails.username : expandedUserId || 'Unknown User'}
                      </p>
                      <p>
                        <strong>Allocated To:</strong> {bug.allocatedto || 'Bugul nu este alocat'}
                      </p>
                      <p>
                        <strong>Commit Link:</strong> {bug.commitLink || 'N/A'}
                      </p>
                      <p>
                        <strong>Bug id:</strong> {bug.id}
                      </p>
                      <Button variant="success" onClick={() => handleOpenClick(bug.id)}>
                        Open
                      </Button>{' '}
                      <Button variant="warning" onClick={() => handleEditClick(bug.id)}>
                        Edit
                      </Button>{' '}
                      <Button variant="danger" onClick={() => handleDeleteClick(bug.id)}>
                        Delete
                      </Button>
                    </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <ConfirmationModal
              show={showDeleteModal}
              handleClose={handleCancelDelete}
              handleConfirm={handleConfirmDelete}
              itemName="Are you sure you want to delete this bug?"
              itemTitle="Confirm delete"
            />
      </main>
      )}
    </div>
    </div>
  );
};

export default ProjectDetails;