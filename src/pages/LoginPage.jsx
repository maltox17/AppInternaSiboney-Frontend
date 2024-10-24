import React, { useState } from 'react';
import api from '../services/api';

const LoginPage = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('Login successful', response.data);
      localStorage.setItem('token', response.data.accessToken);
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" value={username} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Clave:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default LoginPage;