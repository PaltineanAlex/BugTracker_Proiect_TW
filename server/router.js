const express = require('express');
const router = express.Router();
const {
  getBug,
  getBugs,
  getUser,
  getUsers,
  getProjectsByUserId,
  getProjects,
  postBug,
  postUser,
  postProject,
  putBug,
  putUser,
  putProject,
  deleteBug,
  deleteUser,
  deleteProject,
  authenticateUser,
  verifyUser,
  getBugsByProjectId,
  getProject,
  putMarkAsFixed,
} = require('./service'); // Adjust the path based on your actual file structure

// Routes for Bugs
router.get('/bug/:id', getBug);
router.get('/bugs', getBugs);
router.get('/bugs/:projectId', getBugsByProjectId);
router.post('/bugAdd', postBug);
router.put('/bugs/:id', putBug);
router.put('/bugs/:id/markAsFixed', putMarkAsFixed);
router.delete('/bugs/:id', deleteBug);

// Routes for Users
router.get('/users/:id', getUser);
router.get('/users', getUsers);
router.post('/users', postUser);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);

// Routes for Projects
router.get('/projects/user/:id', getProjectsByUserId);
router.get('/projects', getProjects);
router.post('/projects', postProject);
router.put('/projects/:id', putProject);
router.delete('/projects/:id', deleteProject);

//Authentificate
router.post('/authenticate', authenticateUser);

// Verificare token și obținere informații despre utilizator
router.get('/me', verifyUser);
router.get('/project/:id', getProject);

module.exports = router;
