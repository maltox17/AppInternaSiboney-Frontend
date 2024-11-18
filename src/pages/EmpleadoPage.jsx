import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, Button, ListGroup, Spinner, Modal, Form } from 'react-bootstrap';
import { FaBuilding, FaClock, FaPlane, FaUser, FaArrowLeft } from 'react-icons/fa';
import moment from 'moment';

const EmpleadoPage = () => {
  const navigate = useNavigate();
  const { idEmpleado } = useParams();
  const currentYear = moment().year();
  const [empleado, setEmpleado] = useState(null);
  const [vacacionesTotales, setVacacionesTotales] = useState(0);
  const [vacacionesAprobadas, setVacacionesAprobadas] = useState([]); // Nuevo estado
  const [centrosAsignados, setCentrosAsignados] = useState([]);
  const [centrosDisponibles, setCentrosDisponibles] = useState([]);
  const [horariosEstablecidos, setHorariosEstablecidos] = useState([]);
  const [formValues, setFormValues] = useState({
    centroTrabajoId: '',
    esEncargado: false,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formHorario, setFormHorario] = useState({
    diaSemana: '',
    horaEntrada: '',
    horaSalida: '',
    turno: '',
  });
  const [showModalHorario, setShowModalHorario] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          empleadoData,
          vacacionesData,
          centrosAsignadosData,
          centrosDisponiblesData,
          horariosData
        ] = await Promise.all([
          api.get(`/empleados/${idEmpleado}`),
          api.get(`/vacaciones/empleado/${idEmpleado}`),
          api.get(`/empleados-centro/empleado/${idEmpleado}`),
          api.get('/centros'),
          api.get(`/horariosEstablecidos/empleado/${idEmpleado}`)
        ]);

        setEmpleado(empleadoData.data);

        // Procesar vacaciones aprobadas
        const vacacionesAprobadas = vacacionesData.data.filter(
          vacacion => vacacion.estado === 'APROBADA' && moment(vacacion.fechaInicio).year() === currentYear
        );
        setVacacionesAprobadas(vacacionesAprobadas);

        // Calcular total de días de vacaciones aprobadas
        const acumuladas = vacacionesAprobadas.reduce((total, vacacion) => {
          if (vacacion.fechaInicio && vacacion.fechaFin) {
            const inicio = moment(vacacion.fechaInicio);
            const fin = moment(vacacion.fechaFin);
            total += fin.diff(inicio, 'days') + 1; // Sumar duración
          }
          return total;
        }, 0);

        setVacacionesTotales(acumuladas);

        // Centros asignados
        setCentrosAsignados(centrosAsignadosData.data);

        // Centros disponibles
        setCentrosDisponibles(centrosDisponiblesData.data);

        // Horarios establecidos
        setHorariosEstablecidos(horariosData.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idEmpleado]);

  const handleCreateHorario = async () => {
    if (!formHorario.diaSemana || !formHorario.centroTrabajoId || !formHorario.horaEntrada || !formHorario.horaSalida || !formHorario.turno) {
      alert('Por favor, complete todos los campos antes de guardar.');
      return;
    }

    try {
      await api.post('/horariosEstablecidos', {
        diaSemana: formHorario.diaSemana,
        horaEntrada: formHorario.horaEntrada,
        horaSalida: formHorario.horaSalida,
        turno: formHorario.turno,
        empleadoId: parseInt(idEmpleado, 10),
        centroTrabajoId: parseInt(formHorario.centroTrabajoId, 10),
      });

      setShowModalHorario(false);
      const response = await api.get(`/horariosEstablecidos/empleado/${idEmpleado}`);
      setHorariosEstablecidos(response.data); // Refrescar horarios establecidos
    } catch (error) {
      console.error('Error al crear el horario establecido:', error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <Button variant="secondary" className="bgSecondary" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </Button>
        <h2 className="text-center flex-grow-1 m-0">Perfil del Empleado {empleado?.nombre}</h2>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {/* Información del empleado */}
          <div className="col-md-6 mt-2">
            <Card>
              <Card.Body>
                <Card.Title>Información Personal <FaUser className="colorPrimary" /></Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Email:</strong> {empleado?.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Teléfono:</strong> {empleado?.telefono}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Rol:</strong> {empleado?.rol}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Horas de contrato:</strong> {empleado?.horasContrato}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>

          {/* Vacaciones Totales */}
          <div className="col-md-6 mt-2">
            <Card>
              <Card.Body>
                <Card.Title>Vacaciones Aprobadas en {currentYear} <FaPlane className="colorPrimary" /></Card.Title>
                <p className="display-4 text-center colorSecondary">
                  {vacacionesTotales} días
                </p>
                {/* Lista de vacaciones aprobadas */}
                {vacacionesAprobadas.length > 0 ? (
                  <ListGroup variant="flush">
                    {vacacionesAprobadas.map((vacacion, index) => (
                      <ListGroup.Item key={index}>
                        <strong>Del:</strong> {moment(vacacion.fechaInicio).format('DD/MM/YYYY')} {' '}
                        <strong>al:</strong> {moment(vacacion.fechaFin).format('DD/MM/YYYY')}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted text-center mt-3">No hay vacaciones aprobadas.</p>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Centros asignados */}
          <div className="col-md-6 mt-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  Centros Asignados <FaBuilding className="colorPrimary" />
                </Card.Title>
                {centrosAsignados.length > 0 ? (
                  <ListGroup variant="flush">
                    {centrosAsignados.map((centro, index) => (
                      <ListGroup.Item key={index}>
                        <strong>{centro.centroNombre}</strong>{' '}
                        {centro.esEncargado && <span>(Encargado)</span>}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">Sin centros asignados</p>
                )}
                <Button
                  variant="secondary"
                  className="mt-3 buttonBgPrimary"
                  onClick={() => setShowModal(true)}
                >
                  Asignar Centro
                </Button>
              </Card.Body>
            </Card>
          </div>

          {/* Horarios establecidos */}
          <div className="col-md-6 mt-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  Horarios Establecidos <FaClock className="colorPrimary" />
                </Card.Title>
                <ListGroup variant="flush">
                  {horariosEstablecidos.length > 0 ? (
                    horariosEstablecidos.map((horario, index) => (
                      <ListGroup.Item key={index}>
                        <strong>{horario.diaSemana}:</strong>{' '}
                        {`${horario.horaEntrada}`} - {`${horario.horaSalida}`} ({horario.turno})
                      </ListGroup.Item>
                    ))
                  ) : (
                    <p className="text-muted">Sin horarios establecidos</p>
                  )}
                </ListGroup>
                <Button
                  variant="secondary"
                  className="mt-3 buttonBgPrimary"
                  onClick={() => setShowModalHorario(true)}
                >
                  Agregar Horario
                </Button>
              </Card.Body>
            </Card>
          </div>

          {/* Modal para asignar centro */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Asignar un Centro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Centro de Trabajo</Form.Label>
                  <Form.Select
                    value={formValues.centroTrabajoId}
                    onChange={(e) =>
                      setFormValues({ ...formValues, centroTrabajoId: e.target.value })
                    }
                  >
                    <option value="">Seleccione un centro</option>
                    {centrosDisponibles.map((centro) => (
                      <option key={centro.id} value={centro.id}>
                        {centro.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Es encargado"
                    checked={formValues.esEncargado}
                    onChange={(e) =>
                      setFormValues({ ...formValues, esEncargado: e.target.checked })
                    }
                  />
                </Form.Group>
                <Button variant="primary" onClick={() => setShowModal(false)} className="buttonBgPrimary">
                  Guardar
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          {/* Modal para agregar horario */}
          <Modal show={showModalHorario} onHide={() => setShowModalHorario(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Agregar Horario Establecido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Select para el día de la semana */}
                <Form.Group className="mb-3">
                  <Form.Label>Día de la Semana</Form.Label>
                  <Form.Select
                    value={formHorario.diaSemana}
                    onChange={(e) =>
                      setFormHorario({ ...formHorario, diaSemana: e.target.value })
                    }
                  >
                    <option value="">Seleccione un día</option>
                    {['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'].map(
                      (dia, index) => (
                        <option key={index} value={dia}>
                          {dia}
                        </option>
                      )
                    )}
                  </Form.Select>
                </Form.Group>

                {/* Select para los centros asignados */}
                <Form.Group className="mb-3">
                  <Form.Label>Centro de Trabajo</Form.Label>
                  <Form.Select
                    value={formHorario.centroTrabajoId}
                    onChange={(e) =>
                      setFormHorario({ ...formHorario, centroTrabajoId: e.target.value })
                    }
                  >
                    <option value="">Seleccione un centro</option>
                    {centrosAsignados.map((centro) => (
                      <option key={centro.id} value={centro.centroTrabajoId}>
                        {centro.centroNombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Input para la hora de entrada */}
                <Form.Group className="mb-3">
                  <Form.Label>Hora de Entrada</Form.Label>
                  <Form.Control
                    type="time"
                    value={formHorario.horaEntrada}
                    onChange={(e) =>
                      setFormHorario({ ...formHorario, horaEntrada: e.target.value })
                    }
                  />
                </Form.Group>

                {/* Input para la hora de salida */}
                <Form.Group className="mb-3">
                  <Form.Label>Hora de Salida</Form.Label>
                  <Form.Control
                    type="time"
                    value={formHorario.horaSalida}
                    onChange={(e) =>
                      setFormHorario({ ...formHorario, horaSalida: e.target.value })
                    }
                  />
                </Form.Group>

                {/* Select para el turno */}
                <Form.Group className="mb-3">
                  <Form.Label>Turno</Form.Label>
                  <Form.Select
                    value={formHorario.turno}
                    onChange={(e) =>
                      setFormHorario({ ...formHorario, turno: e.target.value })
                    }
                  >
                    <option value="">Seleccione un turno</option>
                    <option value="MAÑANA">MAÑANA</option>
                    <option value="TARDE">TARDE</option>
                  </Form.Select>
                </Form.Group>

                {/* Botón para guardar */}
                <Button
                  variant="primary"
                  onClick={handleCreateHorario}
                  className="buttonBgPrimary"
                >
                  Guardar
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

        </div>
      )}
    </div>
  );
};

export default EmpleadoPage;
