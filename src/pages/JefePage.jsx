import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasRole, getUserInfo } from '../utils/utils';

const JefePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

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
            <h5 className="card-header text-center bgPrimary text-white">Horarios</h5>
            <div className="card-body">
              <p>Visualiza y gestiona los horarios semanales</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/horarios/calendarios')}
              >
                Ver Horarios
              </button>
            </div>
          </div>
        </div>

        {/* Calendario Vacaciones */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">Calendario Vacaciones</h5>
            <div className="card-body">
              <p>Consulta el calendario de vacaciones</p>
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

      {/* Empleados */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">Empleados</h5>
            <div className="card-body">
              <p>Gestiona tus empleados</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/empleados')}
              >
                Ver Empleados
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">Solicitudes Vacaciones</h5>
            <div className="card-body">
              <p>Aprueba o rechaza solicitudes de vacaciones de los empleados.</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/vacaciones/solicitudes')}
              >
                Ver Solicitudes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cafeterías y Horarios Establecidos */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">Cafeterías</h5>
            <div className="card-body">
              <p>Gestiona las cafeterías</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/centros')}
              >
                Ver Centros
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">Horarios Fijos</h5>
            <div className="card-body">
              <p>Configura y revisa los horarios fijos para los empleados.</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/horariosEstablecidos')}
              >
                Ver Horarios Establecidos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empleados-Centro */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">Empleados - Centro</h5>
            <div className="card-body">
              <p>Asigna empleados a centros</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/empleadosCentro')}
              >
                Ver Empleado-Centro
              </button>
            </div>
          </div>
        </div>

        {/* Horas Extras o Deudas  */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <h5 className="card-header text-center bgPrimary text-white">Horas Extras - Deuda</h5>
            <div className="card-body">
              <p>Consulta las horas extras y deudas acumuladas por cada empleado.</p>
              <button
                className="btn btn-outline-secondary buttonOutlinePrimary"
                onClick={() => handleNavigation('/jefe/horasExtras')}
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
