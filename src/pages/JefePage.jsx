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
      <div className="jumbotron text-center py-5 text-white rounded bg-primary">
        <h1>Bienvenido, {userName}</h1> 
        <p className="lead">Panel de control de administración</p>
      </div>

      {/* Panel de Gestión */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Horarios</h5>
              <p>Visualiza y gestiona los horarios semanales en un calendario o tabla.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleNavigation('/admin/horarios')}
              >
                Ir al Panel de Horarios
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Vacaciones</h5>
              <p>Aprueba o rechaza solicitudes de vacaciones y visualiza el calendario de ausencias.</p>
              <button
                className="btn btn-outline-success"
                onClick={() => handleNavigation('/admin/vacaciones')}
              >
                Ir al Panel de Vacaciones
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos Directos a CRUD */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Gestión de Empleados</h5>
              <p>Agrega, edita y elimina empleados de la base de datos.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleNavigation('/admin/empleados')}
              >
                Ir a Empleados
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Centros de Trabajo</h5>
              <p>Gestiona los centros de trabajo y sus datos asociados.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleNavigation('/admin/centros')}
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
            <div className="card-body">
              <h5 className="card-title">Horarios Establecidos</h5>
              <p>Configura y revisa los horarios fijos para los empleados.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleNavigation('/admin/horariosEstablecidos')}
              >
                Ir a Horarios Establecidos
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Relación Empleado-Centro</h5>
              <p>Asigna empleados a centros y gestiona su relación.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleNavigation('/admin/empleadosCentro')}
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
            <div className="card-body">
              <h5 className="card-title">Horas Extra / Deuda</h5>
              <p>Consulta las horas extras y deudas acumuladas por cada empleado.</p>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleNavigation('/admin/horasExtrasDeuda')}
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
