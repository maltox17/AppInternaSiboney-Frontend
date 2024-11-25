import api from '../services/api';

// Función para decodificar el token recibido de la API
export const decodeToken = (token) => {
  try {
    // Obtenemos el payload del token
    const base64Url = token.split('.')[1];
    
    // Reemplazamos los caracteres específicos de Base64Url para convertirlo a un formato Base64 estándar
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodificamos el Base64 en texto legible, luego lo transformamos de URI para asegurar que está en UTF-8
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    // Convertimos el texto decodificado en un objeto JSON para retornarlo
    return JSON.parse(jsonPayload);
  } catch (error) {

    console.error("Fallo al decodificar el token:", error);
    return null;
  }
};


export const hasRole = (token, requiredRole) => {

  const decodedToken = decodeToken(token);
  
  // comprobamos si se tiene el rol requerido
  if (decodedToken && decodedToken.rol) {
    return decodedToken.rol === requiredRole;
  }


  return false;
};


export const getUserInfo = (token) => {

  const decodedToken = decodeToken(token);
  

  if (decodedToken) {
    return {
      name: decodedToken.nombre || 'Usuario', // Si no hay nombre, se usa 'Usuario' por defecto
      email: decodedToken.sub || '',          
      id: decodedToken.id || '',              
    };
  }

  // Si el token no es válido, retornamos valores por defecto
  return { name: 'Usuario', email: '', id: '' };
};

export const getCentroEncargado = async (empleadoId) => {
  try {
    const response = await api.get(`/empleados-centro/empleado/${empleadoId}`);
    const data = response.data;

    // Retorna la información del centro si es encargado
    if (data.esEncargado) {
      return data.centroNombre;
    }

    return null; // No es encargado
  } catch (error) {
    console.error('Error al obtener el centro del encargado:', error);
    return null;
  }
};

export const getCentroEncId = async (empleadoId) => {
 try {
    const response = await api.get(`/empleados-centro/empleado/${empleadoId}`);
    const data = response.data;


      const encargadoInfo = data[0];

      if (encargadoInfo.esEncargado) {

        return encargadoInfo.centroTrabajoId; // Devuelve el ID del centro
      }
    

    return null;
  } catch (error) {
    console.error('Error al obtener el ID del centro del encargado:', error);
    return null;
  }
};


import axios from 'axios';

export const getCentroEncIddd = async (empleadoId) => {
  try {
    // Configuración de la URL base
    const baseURL = 'http://localhost:8080/api'; // Sustituye con tu URL base de la API
    const token = localStorage.getItem('token'); // Obtenemos el token de localStorage

    // Configuración de Axios
    const response = await axios.get(`${baseURL}/empleados-centro/empleado/${empleadoId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
      },
    });

    const data = response.data;

    // Verificamos la información del encargado
    const encargadoInfo = data[0];
    if (encargadoInfo.esEncargado) {
      return encargadoInfo.centroTrabajoId; // Devuelve el ID del centro
    }

    return null; // Retorna null si no es encargado
  } catch (error) {
    console.error('Error al obtener el ID del centro del encargado:', error);
    return null;
  }
};