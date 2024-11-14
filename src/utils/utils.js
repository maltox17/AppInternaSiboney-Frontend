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
