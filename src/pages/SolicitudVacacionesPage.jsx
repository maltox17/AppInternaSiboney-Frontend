import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import api from '../services/api';
import { getUserInfo } from '../utils/utils'; 

const SolicitudVacacionesPage = () => {
  const [solicitudesVacaciones, setSolicitudesVacaciones] = useState([]);
  const [nuevaSolicitud, setNuevaSolicitud] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: 'PENDIENTE',
  });
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false); // Estado para controlar el modal

  // Obtener empleadoId desde el token
  const empleadoId = getUserInfo(localStorage.getItem('token')).id;

  // useEffect para cargar las solicitudes de vacaciones cuando empleadoId esté disponible
  useEffect(() => {
    const obtenerMisVacaciones = async () => {
      try {
        if (empleadoId) {
          const response = await api.get(`/vacaciones/empleado/${empleadoId}`);
          // Ordenamos las solicitudes por estado primero (pendiente) y luego por fecha de inicio de más reciente a más antigua
          const solicitudesOrdenadas = response.data.sort((a, b) => {
            if (a.estado === 'PENDIENTE' && b.estado !== 'PENDIENTE') return -1;
            if (a.estado !== 'PENDIENTE' && b.estado === 'PENDIENTE') return 1;
            return new Date(b.fechaInicio) - new Date(a.fechaInicio); // Orden de fecha descendente
          });
          setSolicitudesVacaciones(solicitudesOrdenadas);
        }
      } catch (error) {
        console.error('Error al obtener mis vacaciones:', error);
      }
    };
    obtenerMisVacaciones();
  }, [empleadoId]);

  const manejarSolicitudVacaciones = async () => {
    try {
      const solicitudConEmpleadoId = { ...nuevaSolicitud, empleadoId }; // Incluir empleadoId en la solicitud
      const response = await api.post('/vacaciones', solicitudConEmpleadoId);
      setSolicitudesVacaciones((prevSolicitudes) => {
        const solicitudesActualizadas = [...prevSolicitudes, response.data];
        // Ordenamos las solicitudes nuevamente después de añadir la nueva
        return solicitudesActualizadas.sort((a, b) => {
          if (a.estado === 'PENDIENTE' && b.estado !== 'PENDIENTE') return -1;
          if (a.estado !== 'PENDIENTE' && b.estado === 'PENDIENTE') return 1;
          return new Date(b.fechaInicio) - new Date(a.fechaInicio);
        });
      });

      // Reiniciar los valores de fecha y cerrar el modal
      setNuevaSolicitud({
        fechaInicio: '',
        fechaFin: '',
        estado: 'PENDIENTE',
      });
      setMostrarModalConfirmacion(false);
    } catch (error) {
      console.error('Error al solicitar vacaciones:', error);
    }
  };

  const mostrarModalConfirmacionSolicitud = () => {
    setMostrarModalConfirmacion(true);
  };

  const cerrarModalConfirmacion = () => {
    setMostrarModalConfirmacion(false);
  };

  return (
    <div className="container mt-3">
      <h2 className='text-center'>Solicitar Vacaciones</h2>
      <Form className="mb-3">
        <Form.Group controlId="startDate">
          <Form.Label>Fecha de Inicio</Form.Label>
          <Form.Control
            type="date"
            value={nuevaSolicitud.fechaInicio}
            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, fechaInicio: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="endDate" className="mt-2">
          <Form.Label>Fecha de Fin</Form.Label>
          <Form.Control
            type="date"
            value={nuevaSolicitud.fechaFin}
            onChange={(e) => setNuevaSolicitud({ ...nuevaSolicitud, fechaFin: e.target.value })}
          />
        </Form.Group>
        <Button className="mt-3 buttonBgPrimary" onClick={mostrarModalConfirmacionSolicitud}>
          Solicitar
        </Button>
      </Form>

      <h3 className='text-center mt-5 mb-4'>Mis Solicitudes</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {solicitudesVacaciones.map((solicitud, index) => (
            <tr key={index}>
              <td>{solicitud.fechaInicio}</td>
              <td>{solicitud.fechaFin}</td>
              <td>{solicitud.estado}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Confirmación */}
      <Modal show={mostrarModalConfirmacion} onHide={cerrarModalConfirmacion}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Solicitud de Vacaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de solicitar vacaciones desde el <strong>{nuevaSolicitud.fechaInicio}</strong> hasta el <strong>{nuevaSolicitud.fechaFin}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalConfirmacion}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={manejarSolicitudVacaciones}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SolicitudVacacionesPage;
