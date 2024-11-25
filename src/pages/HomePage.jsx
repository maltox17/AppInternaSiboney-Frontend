import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid, decodeToken } from '../utils/utils';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Si no hay token, redirige al login
    if (!token || !isTokenValid(token)) {
      console.warn("Token inválido o no encontrado.");
      navigate('/login');
      return;
    }

    // Decodifica el token para obtener el rol
    const decodedToken = decodeToken(token);

    // Redirige a la página adecuada según el rol del usuario
    switch (decodedToken.rol) {
      case 'ROLE_JEFE':
        navigate('/jefe');
        break;
      case 'ROLE_CAMARERO':
      case 'ROLE_COCINERO':
      case 'ROLE_ENCARGADO':
        navigate('/empleado');
        break;
      default:
        console.warn("Rol desconocido o no autorizado.");
        navigate('/login');
    }
  }, [navigate]);

  return null; // La página no muestra contenido, solo redirige
};

export default HomePage;
