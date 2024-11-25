import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImage from '../assets/Logotipo-Siboney.png';
import validator from 'validator';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true); 
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setUsername(e.target.value);
    setIsEmailValid(true); // Restablece el estado de validez mientras el usuario escribe
  };

  const handleEmailBlur = () => {
    // Validar el email cuando el campo pierde el foco
    setIsEmailValid(validator.isEmail(username));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validación adicional en el envío por seguridad
    if (!isEmailValid) {
      setErrorMessage('Por favor ingresa un email válido.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { username, password });
      const { accessToken, rol } = response.data;

      localStorage.setItem('token', accessToken);

      // Redirige según el rol del usuario
      if (rol === 'ROLE_JEFE') {
        navigate('/jefe');
      } else if (rol === 'ROLE_EMPLEADO') {
        navigate('/empleado');
      } else if (rol === 'ROLE_COCINERO') {
        navigate('/empleado');
      } else if (rol === 'ROLE_ENCARGADO') {
        navigate('/empleado');
      } else {
        navigate('/');
      }
    } catch (error) {
      setErrorMessage('Credenciales incorrectas, por favor intenta de nuevo.');
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card p-4 m-1" style={{ maxWidth: '550px', width: '100%', minHeight: '500px' }}>
          <div className="text-center mb-4">
            <img src={logoImage} alt="Logo" className="logo-image mb-3" />
            <h2 className="fw-bold">Ingresa a tu cuenta</h2>
            <p className="text-muted">Siboney App Interna</p>
          </div>

          {/* Mostrar alerta de error si existe */}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${isEmailValid ? '' : 'is-invalid'}`} // Añadir clase de error si no es válido
                id="username"
                placeholder="email"
                value={username}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur} // Activar la validación al perder el foco
              />
              {!isEmailValid && (
                <div className="invalid-feedback">Por favor ingresa un email válido.</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-end">
                <a href="#" className="text-decoration-none colorSecondary">Recuperar contraseña</a>
              </div>
            </div>

            <button type="submit" className="btn buttonBgPrimary btn-lg w-100" style={{ color: '#fff' }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
