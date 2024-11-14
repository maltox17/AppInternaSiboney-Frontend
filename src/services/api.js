import axios from 'axios';

//Configuracion inicial de axios para comunicarnos con nuestra Api
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

//interceptor a las solicitudes para añadir el token de autenticación
api.interceptors.request.use(
    (config) => {

      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default api;