import axios from 'axios';
import api from '../services/api';

// Decodifica el token JWT
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

// Verifica si un token contiene un rol específico
export const hasRole = (token, requiredRole) => {
  const decodedToken = decodeToken(token);
  return decodedToken?.rol === requiredRole || false;
};

// Verifica si un token es válido y contiene un rol permitido
export const isTokenValid = (token, allowedRoles = []) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  if (decodedToken.exp < currentTime) {
    console.warn('Token expirado.');
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    return false;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.rol)) {
    console.warn('Rol no autorizado.');
    return false;
  }

  return true;
};

// obtener información del usuario desde el token
export const getUserInfo = (token) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken) return { name: 'Usuario', email: '', id: '' };

  return {
    name: decodedToken.nombre || 'Usuario',
    email: decodedToken.sub || '',
    id: decodedToken.id || '',
    rol: decodedToken.rol || '',
  };
};

//obtener información del centro del encargado
export const getCentroEncId = async (empleadoId) => {
  try {
    const response = await api.get(`/empleados-centro/empleado/${empleadoId}`);
    const data = response.data[0];
    return data?.esEncargado ? data.centroTrabajoId : null;
  } catch (error) {
    console.error('Error al obtener el ID del centro del encargado:', error);
    return null;
  }
};
