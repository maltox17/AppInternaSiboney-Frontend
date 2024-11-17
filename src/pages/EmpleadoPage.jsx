import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { Card, Button, ListGroup, Spinner, Modal, Form } from 'react-bootstrap';
import { FaBuilding } from 'react-icons/fa';
import moment from 'moment';

const EmpleadoPage = () => {
  const { idEmpleado } = useParams();
  const currentYear = moment().year();
  const [empleado, setEmpleado] = useState(null);
  const [vacacionesTotales, setVacacionesTotales] = useState(0);
  const [centrosAsignados, setCentrosAsignados] = useState([]);
  const [centrosDisponibles, setCentrosDisponibles] = useState([]);
  const [formValues, setFormValues] = useState({
    centroTrabajoId: '',
    esEncargado: false,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empleadoData, vacacionesData, centrosAsignadosData, centrosDisponiblesData] = await Promise.all([
          api.get(`/empleados/${idEmpleado}`),
          api.get(`/vacaciones/empleado/${idEmpleado}`),
          api.get(`/empleados-centro/empleado/${idEmpleado}`),
          api.get('/centros'),
        ]);

        setEmpleado(empleadoData.data);

        // Calcular vacaciones disfrutadas en el año actual
        const acumuladas = vacacionesData.data.reduce((total, vacacion) => {
          const inicio = moment(vacacion.fechaInicio);
          const fin = moment(vacacion.fechaFin);
          if (inicio.year() === currentYear) {
            total += fin.diff(inicio, 'days') + 1; // Sumar duración
          }
          return total;
        }, 0);
        setVacacionesTotales(acumuladas);

        // Centros asignados
        setCentrosAsignados(centrosAsignadosData.data);

        // Centros disponibles
        setCentrosDisponibles(centrosDisponiblesData.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idEmpleado]);

  const handleAsignarCentro = () => {
    setShowModal(true);
  };

  const handleCreateCentro = async () => {
    try {
      await api.post('/empleados-centro', {
        empleadoId: idEmpleado,
        centroTrabajoId: formValues.centroTrabajoId,
        esEncargado: formValues.esEncargado,
      });
      setShowModal(false);
      const response = await api.get(`/empleados-centro/empleado/${idEmpleado}`);
      setCentrosAsignados(response.data); // Actualizar centros asignados
    } catch (error) {
      console.error('Error al asignar el centro:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Perfil del Empleado {empleado?.nombre}</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {/* Información del empleado */}
          <div className="col-md-6">
            <Card>
              <Card.Body>
                <Card.Title>Información Personal</Card.Title>
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
          <div className="col-md-6 mt-4">
            <Card>
              <Card.Body>
                <Card.Title>Vacaciones Disfrutadas en {currentYear}</Card.Title>
                <p className="display-4 text-center colorSecondary">
                  {vacacionesTotales} días
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* Centros asignados */}
          <div className="col-md-6 mt-4">
            <Card>
              <Card.Body>
                <Card.Title>
                  Centros Asignados <FaBuilding />
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
                  variant="primary"
                  className="mt-3 buttonBgPrimary"
                  onClick={handleAsignarCentro}
                >
                  Asignar Centro
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
                <Button variant="primary" onClick={handleCreateCentro} className='buttonBgPrimary'>
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


