import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasRole, getUserInfo } from '../utils/utils';

const EmpleadosPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !hasRole(token, 'ROLE_JEFE')) {
      navigate('/');
      return;
    }
    const { name } = getUserInfo(token);
    setUserName(name);
  }, [navigate]);

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container my-5">
      {/* Bienvenida */}
      <div className="jumbotron text-center py-5 text-white rounded jumbotron-background">
        <h1>Bienvenido</h1> 
        <p className="lead">{userName}</p>
      </div>

      {/* Panel de Gestión */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Horarios</h5>
            <div className="card-body">
              <p>Visualiza tu horario de la semana</p>
              <button
                className="btn btn-outline-success colorPrimary"
                onClick={() => handleNavigation('/empleado/horarios')}
              >
                Ir al Panel de Horarios
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Vacaciones</h5>
            <div className="card-body">
              <p>Visualiza el calendario de vacaciones, solicita y ve el estado de tus vacaciones solicitadas</p>
              <button
                className="btn btn-outline-success colorPrimary"
                onClick={() => handleNavigation('/empleado/vacaciones')}
              >
                Ir al Panel de Vacaciones
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Horas Extras</h5>
            <div className="card-body">
              <p>Consulta las horas extras y deudas acumuladas que tienes en la empresa</p>
              <button
                className="btn btn-outline-success colorPrimary"
                onClick={() => handleNavigation('/empleado/horas')}
              >
                Ver Horas Extras / Deuda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadosPage;
