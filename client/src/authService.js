const verifyToken = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
  
      if (token) {
        const response = await fetch('http://localhost:8080/api/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Utilizator autentificat:', data.user);
          return { success: true, user: data.user };
        } else {
          console.log('Token invalid sau expirat');
          return { success: false, error: 'Token invalid sau expirat' };
        }
      } else {
        console.log('Nu există token în localStorage');
        return { success: false, error: 'Nu există token în localStorage' };
      }
    } catch (error) {
      console.error('Eroare la verificarea tokenului:', error.message);
      return { success: false, error: error.message };
    }
  };
  
  export default verifyToken;
  