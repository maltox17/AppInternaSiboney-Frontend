import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenValid } from '../utils/utils';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('token');

  if (!token || !isTokenValid(token, allowedRoles)) {
    console.warn('Acceso denegado o token inválido.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

