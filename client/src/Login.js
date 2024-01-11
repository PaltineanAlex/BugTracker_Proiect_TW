import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import verifyToken from './authService'; // Importă funcția de verificare a tokenului

import toast, { Toaster } from 'react-hot-toast'; //https://react-hot-toast.com/

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);


  const navigate = useNavigate();

  // Verifică dacă utilizatorul este deja autentificat la încărcarea paginii
  useEffect(() => {
    verifyToken()
      .then((result) => {
        if (result.success) {
          setLoggedIn(true);
          setUsername(result.user.username);
          navigate('/dashboard');
        } else {
          console.error('Eroare la verificarea tokenului:', result.error);
        }
      })
      .catch((error) => {
        console.error('Eroare la verificarea tokenului:', error.message);
      });
  }, [navigate]);

  const handleLogin = () => {
    if (username && password) {
      fetch('http://localhost:8080/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

           if (data.token) {
            toast.success('Te-ai autentificat cu succes!');
            setLoggedIn(true);
            
            // Salvare în localStorage
            localStorage.setItem('jwtToken', data.token);

            navigate('/dashboard');
          } else {
            console.error('Tokenul JWT este indefinit sau lipsă.');
            //alert('Autentificare eșuată. Tokenul JWT este indefinit sau lipsă.');
            toast.error('Eroare la autentificare. Date invalide!');
            
          }
        })
        .catch((error) => {
          console.error('Eroare la autentificare:', error.message);
          //alert(error.message);
          toast.error(error.message);
        });
    } else {
      alert('Vă rugăm să completați toate câmpurile.');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);

    // Ștergere din localStorage
    localStorage.removeItem('jwtToken');
  };

  return (
    <div className="container mt-5">
      <Toaster />
      {loggedIn ? (
        <div>
          <h1>Bun venit, {username}!</h1>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}

      

    </div>
  );
}

export default Login;
