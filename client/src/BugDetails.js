// BugDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import Sidebar from './SidebarMenu';
import Header from './Header';
import toast, { Toaster } from 'react-hot-toast';

import './sidebar.css';
import ConfirmationModal from './ConfirmationModal';
import MarkAsFixedModal from './MarkAsFixedModal';
import verifyToken from './authService';

const BugDetails = () => {
  const { id } = useParams();
  const [bugDetails, setBugDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMarkAsFixedModal, setShowMarkAsFixedModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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

  useEffect(() => {
    const fetchBugDetails = async () => {
      try {

        const tokenVerification = await verifyToken();
        if (tokenVerification.success) {
          setCurrentUser(tokenVerification.user);
        } else {
          console.error('Failed to verify token:', tokenVerification.error);
        }

        const response = await fetch(`http://localhost:8080/api/bug/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bug details');
        }

        const bugData = await response.json();
        setBugDetails(bugData);
        } catch (error) {
        console.error('Error fetching bug details:', error.message);
        } finally {
        setLoading(false);
      }
    };

    fetchBugDetails();
  }, [id]);


  
  const handleEditClick = () => {
    // Implementează logica pentru editare
    console.log('Edit bug');
  };


  const handleMarkAsFixed = async (fixLink) => {
    try {
      // Faceți solicitarea API pentru a marca bug-ul ca rezolvat
      const response = await fetch(`http://localhost:8080/api/bugs/${id}/markAsFixed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fixLink: fixLink,
        }),
      });
  
      if (response.ok) {
        // Actualizați starea bug-ului pentru a reflecta rezolvarea
        setBugDetails((prevDetails) => ({
          ...prevDetails,
          status: 'Rezolvat',
          fixLink: fixLink,
        }));
  
        // Închideți modalul de confirmare
        setShowMarkAsFixedModal(false);
        toast.success('Bug-ul a fost marcat ca rezolvat cu succes!');
      } else {
        toast.error('Failed to mark bug as fixed');
      }
    } catch (error) {
      toast.error('Error marking bug as fixed:', error.message);
    }
  };

  const handleCommentClick = () => {
    // Implementează logica pentru adăugare comentariu
    console.log('Comment');
  };

  const handleAssignClick = () => {
    setShowAssignModal(true);
  };

  const [showAssignModal, setShowAssignModal] = useState(false);
  const handleAssignConfirm = async () => {
    try {
      // Faceți solicitarea API pentru a obține cele mai recente informații despre bug
      const bugResponse = await fetch(`http://localhost:8080/api/bug/${id}`);
      const bugData = await bugResponse.json();
  
      // Verificăm dacă bugul este deja atribuit
      if (bugData.allocatedto) {
        toast.error('Bug already assigned to someone else');
        return;
      }
  
      // Faceți o altă solicitare API pentru a atribui bug-ul utilizatorului curent
      const response = await fetch(`http://localhost:8080/api/bugs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bugData,  // Utilizăm cele mai recente informații despre bug
          allocatedto: currentUser.id,
          status: 'Preluat',
        }),
      });
  
      if (response.ok) {
        // Actualizați starea bug-ului pentru a reflecta atribuirea
        setBugDetails((prevDetails) => ({
          ...prevDetails,
          ...bugData,  // Actualizăm cu cele mai recente informații
          allocatedto: currentUser.id,
          status: 'Preluat',
        }));
  
        // Închideți modalul de confirmare
        setShowAssignModal(false);
        toast.success('Bug-ul ți-a fost atribuit cu succes!');
      } else {
        toast.error('Failed to assign bug');
      }
    } catch (error) {
      toast.error('Error assigning bug:', error.message);
    }
  };

  const handleAssignCancel = () => {
    // Închideți modalul de confirmare fără a face nicio acțiune
    setShowAssignModal(false);
  };

  const isBugAssignedToCurrentUser = bugDetails && bugDetails.allocatedto === currentUser.id;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow-1">
        {/* Header */}
        <Header />

        {/* Conținut principal */}
        <main className="container-fluid p-3">
        <Toaster />
          {loading && <div>Loading...</div>}

          {!loading && (
            <Card>
          <Card.Body>
            <Card.Title>
                <span className={`status-indicator ${bugDetails.status.toLowerCase()}`}>
                    {bugDetails.status}
                </span>
                - {bugDetails.name}
                </Card.Title>
            <Card.Text>
              <strong>Priority:</strong> {bugDetails.priority}
              <br />
              <strong>Creation Date:</strong> {bugDetails.creationdate}
            
              <br />
              <strong>Commit Link:</strong> {bugDetails.commitLink || 'N/A'}
              <br />
              <strong>Allocated To:</strong> {userDetails.username || 'Bugul nu este alocat'}
              <br />
              <strong>Created By(userId):</strong> {bugDetails.userId}
              <br />
              <strong>Project ID:</strong> {bugDetails.projectId}
              <br />
              <strong>Description:</strong> {bugDetails.description}
              <br />
              <strong>fix link:</strong> {bugDetails.fixLink}
            </Card.Text>
                <Button variant="success" onClick={handleAssignClick}>
                  Assign to Me
                </Button> {' '}
                <Button variant="warning" onClick={handleEditClick}>
                  Edit
                </Button> {' '}
                {isBugAssignedToCurrentUser && (
                  <>
                    <Button variant="secondary" onClick={() => setShowMarkAsFixedModal(true)}>
                      Mark as Fixed
                    </Button> {' '}
                    <MarkAsFixedModal
                      show={showMarkAsFixedModal}
                      handleClose={() => setShowMarkAsFixedModal(false)}
                      handleMarkAsFixed={handleMarkAsFixed}
                    />
                  </>
                )}
                <Button variant="primary" onClick={handleCommentClick}>
                  Comment
                </Button>
                <ConfirmationModal
                  show={showAssignModal}
                  handleClose={handleAssignCancel}
                  handleConfirm={handleAssignConfirm}
                  itemName="Assign this bug to yourself?"
                  itemTitle="Assign Bug"
                />
          </Card.Body>
        </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default BugDetails;