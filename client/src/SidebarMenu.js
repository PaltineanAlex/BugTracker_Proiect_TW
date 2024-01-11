import React, {useState, useEffect} from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; //https://react-hot-toast.com/
import verifyToken from './authService';

import './sidebar.css';

const Sidebar = () => {

  const [projects, setProjects] = useState([]);
  useEffect(() => {
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
        console.error('Eroare la obținerea proiectelor:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <Toaster />
      <CDBSidebar textColor="#fff" backgroundColor="#333" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.77)), url("https://cdn.discordapp.com/attachments/1142386657681756160/1189576861878079571/image.png?ex=659eaac9&is=658c35c9&hm=2eb605a3c42ceb43e952fffafff630ff2c1e101203c9c8c3cdf067a22d33fc40&")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CDBSidebarHeader style={{ borderBottom: 'none' }} prefix={<i className="fa fa-bars fa-large hover-effect"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Sidebar
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="home" className="hover-effect">
                Dashboard
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink to="/projects-list">
              <CDBSidebarMenuItem icon="list" className="hover-effect">
                Projects List
              </CDBSidebarMenuItem>
            </NavLink>

            {projects.map((project) => (
              <NavLink key={project.id} to={`/proiect/${project.id}`} activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="code" className="hover-effect">
                  {project.name}
                </CDBSidebarMenuItem>
              </NavLink>
            ))}
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div style={{ padding: '20px 5px' }}>Bug Tracker v0.6</div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;