// Dashboard.js

import React, { useState } from 'react';
import verifyToken from './authService';

import toast, { Toaster } from 'react-hot-toast'; //https://react-hot-toast.com/

import Sidebar from './SidebarMenu';
import Header from './Header';

import { Accordion, Button, Card } from 'react-bootstrap';

import { useProjectContext } from './ProjectContext';
import BugModal from './BugModal';

const Dashboard = () => {


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

            

                

          {/* ... alte componente sau conținut */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;