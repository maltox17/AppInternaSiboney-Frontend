import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasRole, getUserInfo } from '../utils/utils';

const TrabajadorPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
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
      {/* Jumbotron */}
      <div className="jumbotron text-center py-5 text-white rounded jumbotron-background">
        <h1>Bienvenido</h1> 
        <p className="lead">{userName}</p>
      </div>

      {/* Horarios */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Horarios</h5>
            <div className="card-body">
              <p>Visualiza tu horario de la semana</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/empleado/horario')}
              >
                Ver Horarios
              </button>
            </div>
          </div>
        </div>

         {/* Calendario Vacaciones */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Calendario Vacaciones</h5>
            <div className="card-body">
              <p>Visualiza el calendario de vacaciones </p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/vacaciones/calendario')}
              >
                Ver Calendario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Solicitar Vacaciones */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Solicitar y Consultar Vacaciones</h5>
            <div className="card-body">
              <p>Solicita vacaciones para que sean aprobadas y ve el estado de tus solicitudes</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/empleado/vacaciones')}
              >
                Ver Vacaciones
              </button>
            </div>
          </div>
        </div>


         {/* Horas Extras */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Horas Extrasssss</h5>
            <div className="card-body">
              <p>Consulta las horas extras y deudas acumuladas que tienes en la empresa</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/empleado/horas')}
              >
                Ver Horas Extras / Deuda
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">
              Encargado: Ver Horario del centro
            </h5>
            <div className="card-body">
              <p>Mira el horario del personal de tu centro como encargado </p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/empleado/encargado/horarios')}
              >
                Ver Horarios
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>

    

    
  );
};

export default TrabajadorPage;
