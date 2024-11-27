import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import api from '../services/api';
import { FaCheckCircle, FaRegTimesCircle, FaPauseCircle } from 'react-icons/fa';
import CalendarioVacaciones from './CalendarioVacacionesPage'; 

const AprobarVacacionesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState('PENDIENTE'); // Por defecto, mostrar pendientes
  const [recargarCalendario, setRecargarCalendario] = useState(false);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await api.get('/vacaciones/empleados/nombre');
        const data = response.data;
        // Ordenar por ID (más reciente primero)
        const ordenadas = data.sort((a, b) => b.id - a.id);
        setSolicitudes(ordenadas);
      } catch (error) {
        console.error('Error al cargar las solicitudes de vacaciones:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleActualizarEstado = async (id, nuevoEstado) => {
    try {
      // Encontrar la solicitud actual para obtener los otros campos necesarios
      const solicitudActual = solicitudes.find((solicitud) => solicitud.id === id);

      if (!solicitudActual) {
        console.error('Solicitud no encontrada.');
        return;
      }

      // Preparar el payload para la API
      const payload = {
        fechaInicio: solicitudActual.fechaInicio,
        fechaFin: solicitudActual.fechaFin,
        estado: nuevoEstado,
        empleadoId: solicitudActual.empleadoId,
      };

      // Usar api.put para enviar los datos
      await api.put(`/vacaciones/${id}`, payload);

      // Actualizar la lista localmente
      setSolicitudes((prev) =>
        prev.map((solicitud) =>
          solicitud.id === id ? { ...solicitud, estado: nuevoEstado } : solicitud
        )
      );

      // Forzar la recarga del calendario
      setRecargarCalendario((prev) => !prev); // Cambiar el estado para disparar una recarga
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  // Filtrar las solicitudes según el estado seleccionado
  const solicitudesFiltradas = solicitudes.filter(
    (solicitud) => solicitud.estado === filtro
  );

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center mb-4">Solicitudes de Vacaciones</h2>

      {/* Botones de filtro */}
      <div className="d-flex justify-content-center mb-3">
        {['PENDIENTE', 'APROBADA', 'RECHAZADA'].map((estado) => (
          <Button
            key={estado}
            variant={estado === filtro ? 'button' : 'outline'}
            className={`mx-1 buttonOutlinePrimary ${estado === filtro ? 'active' : ''}`}
            onClick={() => setFiltro(estado)}
          >
            {estado}
          </Button>
        ))}
      </div>

      {/* Tabla de solicitudes */}
      <div className="table-responsive mt-4 d-none d-md-block">
        {solicitudesFiltradas.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Empleado</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesFiltradas.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>{solicitud.id}</td>
                  <td>{solicitud.empleadoNombre}</td>
                  <td>{new Date(solicitud.fechaInicio).toLocaleDateString()}</td>
                  <td>{new Date(solicitud.fechaFin).toLocaleDateString()}</td>
                  <td>{solicitud.estado}</td>
                  <td>
                    {filtro === 'PENDIENTE' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA')}
                        >
                          <FaCheckCircle />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleActualizarEstado(solicitud.id, 'RECHAZADA')}
                        >
                          <FaRegTimesCircle />
                        </Button>
                      </>
                    )}
                    {filtro === 'APROBADA' && (
                      <>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2 text-white"
                          onClick={() => handleActualizarEstado(solicitud.id, 'PENDIENTE')}
                        >
                          <FaPauseCircle />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleActualizarEstado(solicitud.id, 'RECHAZADA')}
                        >
                          <FaRegTimesCircle />
                        </Button>
                      </>
                    )}
                    {filtro === 'RECHAZADA' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA')}
                        >
                          <FaCheckCircle />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="text-white"
                          onClick={() => handleActualizarEstado(solicitud.id, 'PENDIENTE')}
                        >
                          <FaPauseCircle />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No hay solicitudes para mostrar.</p>
        )}
      </div>

      {/* Vista en cards para dispositivos móviles */}
      <div className="d-block d-md-none">
        {solicitudesFiltradas.length > 0 ? (
          solicitudesFiltradas.map((solicitud) => (
            <div key={solicitud.id} className="border rounded p-3 mb-3">
              <p>
                <strong>ID:</strong> {solicitud.id}
              </p>
              <p>
                <strong>Empleado:</strong> {solicitud.empleadoNombre}
              </p>
              <p>
                <strong>Fecha Inicio:</strong> {new Date(solicitud.fechaInicio).toLocaleDateString()}
              </p>
              <p>
                <strong>Fecha Fin:</strong> {new Date(solicitud.fechaFin).toLocaleDateString()}
              </p>
              <p>
                <strong>Estado:</strong> {solicitud.estado}
              </p>
              <div className="d-flex justify-content-end">
                {filtro === 'PENDIENTE' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA')}
                    >
                      <FaCheckCircle />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleActualizarEstado(solicitud.id, 'RECHAZADA')}
                    >
                      <FaRegTimesCircle />
                    </Button>
                  </>
                )}
                {filtro === 'APROBADA' && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2 text-white"
                      onClick={() => handleActualizarEstado(solicitud.id, 'PENDIENTE')}
                    >
                      <FaPauseCircle />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleActualizarEstado(solicitud.id, 'RECHAZADA')}
                    >
                      <FaRegTimesCircle />
                    </Button>
                  </>
                )}
                {filtro === 'RECHAZADA' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleActualizarEstado(solicitud.id, 'APROBADA')}
                    >
                      <FaCheckCircle />
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="text-white"
                      onClick={() => handleActualizarEstado(solicitud.id, 'PENDIENTE')}
                    >
                      <FaPauseCircle />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay solicitudes para mostrar.</p>
        )}
      </div>

      {/* Componente de Calendario de Vacaciones */}
      <CalendarioVacaciones recargar={recargarCalendario} />
    </div>
  );
};

export default AprobarVacacionesPage;
