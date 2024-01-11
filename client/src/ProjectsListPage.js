// ProjectsListPage.js
import React, { useState, useEffect } from 'react';
import { Button, Card, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import verifyToken from './authService';

import Sidebar from './SidebarMenu';
import Header from './Header';
import AddProjectModal from './ProjectModal';
import EditProjectModal from './EditProjectModal'; // Import the modal for editing projects

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false); // State for showing the edit project modal
  const [selectedProject, setSelectedProject] = useState(null); // State to store the selected project for editing
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
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        toast.error('Error fetching projects');
      }
    };

    fetchData();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const date = await verifyToken();
      const userResponse = await fetch(`http://localhost:8080/api/users/${date.user.id}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userDetails = await userResponse.json();
      const response = userDetails.usertype === 'MP'
      ? await fetch(`http://localhost:8080/api/projects/user/${date.user.id}`)
      : await fetch('http://localhost:8080/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      toast.error('Error fetching projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (projectData) => {
    try {
      const date = await verifyToken();
      projectData.userId = date.user.id;
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        toast.success('Project added successfully.');
        fetchProjects();
      } else {
        throw new Error('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error.message);
      toast.error('Error adding project');
    }
  };

  const handleEditProject = (projectId) => {
    const projectToEdit = projects.find((project) => project.id === projectId);
    setSelectedProject(projectToEdit);
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async (updatedProjectData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjectData),
      });

      if (response.ok) {
        toast.success('Project updated successfully.');
        fetchProjects();
        setShowEditProjectModal(false);
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error.message);
      toast.error('Error updating project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Project deleted successfully.');
        fetchProjects();
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error.message);
      toast.error('Error deleting project');
    }
  };

  const handleShowAddProjectModal = () => {
    setShowAddProjectModal(true);
  };

  const handleCloseAddProjectModal = () => {
    setShowAddProjectModal(false);
  };

  const handleShowEditProjectModal = () => {
    setShowEditProjectModal(true);
  };

  const handleCloseEditProjectModal = () => {
    setShowEditProjectModal(false);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid p-3">
          <h1>Projects List</h1>

          {userDetails && userDetails.usertype === 'MP' && (
            <Button variant="primary" className="mb-3" onClick={handleShowAddProjectModal}>
              Add New Project
            </Button>
          )}

          <Accordion>
            {projects.map((project) => (
              <Accordion.Item key={project.id} eventKey={project.id.toString()}>
                <Accordion.Header>{project.name}</Accordion.Header>
                <Accordion.Body>
                  <Card className="mb-3">
                    <Card.Header>{project.name}</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <strong>Id:</strong> {project.id}<br />
                        <strong>Link:</strong> {project.link}<br />
                        <strong>Created By (userId):</strong> {project.userId}<br />
                        <strong>Other Members:</strong> {project.additionalMembers || 'None'}
                      </Card.Text>
                      {userDetails.usertype === 'MP' && (
                        <>
                          <Button variant="warning" onClick={() => handleEditProject(project.id)}>
                            Edit Project
                          </Button>{' '}
                          <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>
                            Delete Project
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <AddProjectModal
            show={showAddProjectModal}
            handleClose={handleCloseAddProjectModal}
            handleAddProject={handleAddProject}
          />
          
          <EditProjectModal
            show={showEditProjectModal}
            handleClose={handleCloseEditProjectModal}
            handleUpdateProject={handleUpdateProject}
            project={selectedProject}
          />
        </main>
      </div>
    </div>
  );
};

export default ProjectsListPage;
