import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken, hasRole } from '../utils/utils'; 

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn("Token not found in localStorage.");
      navigate('/login');
      return;
    }

    // Redirige a la página adecuada según el rol del usuario
    if (hasRole(token, 'ROLE_JEFE')) {
      navigate('/jefe');
    } else if (
      hasRole(token, 'ROLE_CAMARERO') ||
      hasRole(token, 'ROLE_COCINERO') ||
      hasRole(token, 'ROLE_ENCARGADO')
    ) {
      navigate('/empleado');
    } else {
      console.warn("Unrecognized or missing role in token.");
      navigate('/login');
    }
  }, [navigate]);

  return null; // No muestra contenido, solo redirige basado en el rol
};

export default HomePage;
