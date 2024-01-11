import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'; // Modifică importurile aici
import './index.css';
import Login from './Login';
import Dashboard from './Dashboard'; // Asigură-te că ai această importare
import ProjectsListPage from './ProjectsListPage';
import ProjectDetails from './ProjectDetails';
import verifyToken from './authService';
import BugDetails from './BugDetails';

const App = () => {
  const user = verifyToken();

  return (
    
    <Router>
    <Routes> 
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects-list" element={<ProjectsListPage />} />
      <Route path="/proiect/:projectId" element={<ProjectDetails />} />
      <Route path="/bugs/:id" element={<BugDetails/>} />
    </Routes> 
  </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
);