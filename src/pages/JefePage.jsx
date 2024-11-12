import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasRole, getUserInfo } from '../utils/utils';

const JefePage = () => {
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
              <p>Visualiza y gestiona los horarios semanales</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/horarios/calendarios')}
              >
                Ir al Panel de Horarios
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Calendario Vacaciones</h5>
            <div className="card-body">

              <p>Consulta el calendario de vacaciones</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/vacaciones/calendario')}
              >
                Ir al Calendario
              </button>
            </div>
          </div>
        </div>
      </div>

 
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Empleados</h5>
            <div className="card-body">

              <p>Agrega, edita y elimina empleados de la base de datos.</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/empleados')}
              >
                Ir a Empleados
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Cafeterias</h5>
            <div className="card-body">
              <p>Gestiona las cafeterias</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/centros')}
              >
                Ir a Centros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Gestión de Horarios Establecidos y Empleado-Centro */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Horarios Fijos</h5>
            <div className="card-body">
              <p>Configura y revisa los horarios fijos para los empleados.</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/horariosEstablecidos')}
              >
                Ir a Horarios Establecidos
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Empleados - Centro </h5>
            <div className="card-body">
              <p>Asigna empleados a centros</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/empleadosCentro')}
              >
                Ir a Empleado-Centro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Horas Extras/Deuda */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm mb-4">
          <h5 class="card-header text-center bgPrimary text-white">Horas extras - deuda</h5>
            <div className="card-body">
              <p>Consulta las horas extras y deudas acumuladas por cada empleado.</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/horasExtrasDeuda')}
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

export default JefePage;
