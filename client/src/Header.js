import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import verifyToken from './authService';

import './sidebar.css';


const Header = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    const checkToken = async () => {
      const result = await verifyToken();
      if (result.success) {
        setLoggedInUser(result.user);
      } else {
        console.error('Eroare la verificarea tokenului:', result.error);
      }
    };

    checkToken();
  }, []);

  const handleLogoutClick = () => {
    setLoggedInUser(false);

    // Ștergere din localStorage
    localStorage.removeItem('jwtToken');

    navigate('/login');
  };
    
  return (
    <header className="d-flex justify-content-between align-items-center bg-dark text-light p-3"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.77)), url("https://cdn.discordapp.com/attachments/1142386657681756160/1189605753275809872/image.png?ex=659ec5b1&is=658c50b1&hm=aa7c9e3d6310f829844c1f67d0dc4ebb7677bf573ade8241dd8c10e371bd1a6d&")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        flexDirection: 'row',  // Aici adăugat pentru a forța direcția orizontală a elementelor
        justifyContent: 'space-between',  // Aliniere la dreapta
      }}>
      <h0>Header</h0>
      <Dropdown className="my-custom-dropdown">
        <Dropdown.Toggle
          variant="light"
          id="dropdown-basic"
          className="text-light hover"
          style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
        >
          {loggedInUser ? loggedInUser.username : 'Utilizator'}
        </Dropdown.Toggle>
        <Dropdown.Menu className="bg-secondary">
          <Dropdown.Item
            as="button"
            onClick={handleLogoutClick}
            className="text-white my-custom-dropdown"
            style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </header>
  );
};

export default Header;