
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
    console.error("Failed to decode token:", error);
    return null;
  }
};


export const hasRole = (token, requiredRole) => {
  const decodedToken = decodeToken(token);
  if (decodedToken && decodedToken.rol) {
    return decodedToken.rol === requiredRole;
  }
  return false;
};


export const getUserInfo = (token) => {
  const decodedToken = decodeToken(token);
  if (decodedToken) {
    return {
      name: decodedToken.nombre || 'Usuario', 
      email: decodedToken.sub || '',
      id: decodedToken.id || '',          
    };
  }
  return { name: 'Usuario', email: '', id: '' };
};
