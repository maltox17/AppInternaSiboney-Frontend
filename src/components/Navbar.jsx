import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logoImage from '../assets/logoBlancoSiboney.svg';
import { getUserInfo } from '../utils/utils';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(''); // Estado para almacenar el email del usuario
  const token = localStorage.getItem('token'); // Verifica si el token existe

  useEffect(() => {
    if (token) {
      const userInfo = getUserInfo(token); // Utiliza la función getUserInfo del utils
      setUserEmail(userInfo.email); // Almacena el email en el estado
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token de autenticación
    navigate('/'); // Redirige al usuario al inicio o página de login
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand as={Link} to="/">
        <img
          src={logoImage}
          alt="Logo"
          style={{ width: '60px', height: 'auto' }}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ms-auto">
          {/* Solo muestra el menú de opciones si el token está presente */}
          {token && (
            <NavDropdown title={userEmail || "Opciones"} id="nav-dropdown" menuVariant="dark">
              <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;



