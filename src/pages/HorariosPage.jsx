import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import moment from 'moment';

const HorariosPage = () => {
  const [centros, setCentros] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState(null);
  const [empleados, setEmpleados] = useState([]); // Empleados filtrados por centro
  const [selectedDate, setSelectedDate] = useState(moment()); // Fecha seleccionada
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [newHorario, setNewHorario] = useState({
    empleadoId: '',
    turno: 'MAÑANA',
    horaEntrada: { hour: 8, minute: 0, second: 0, nano: 0 },
    horaSalida: { hour: 16, minute: 0, second: 0, nano: 0 }
  });

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await api.get('/horarios/nombres');
        
        // Agrupar centros con sus IDs y nombres
        const centrosUnicos = response.data.reduce((acc, horario) => {
          if (!acc.find(centro => centro.id === horario.centroTrabajoId)) {
            acc.push({ id: horario.centroTrabajoId, nombre: horario.centroNombre });
          }
          return acc;
        }, []);
        
        setHorarios(response.data);
        setCentros(centrosUnicos);
      } catch (error) {
        console.error('Error al cargar los horarios y centros:', error);
      }
    };

    fetchHorarios();
  }, []);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handlePreviousDay = () => {
    setSelectedDate(prevDate => prevDate.clone().subtract(1, 'days'));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => prevDate.clone().add(1, 'days'));
  };

  const handleCreateHorario = () => {
    setShowModal(true);
  };

  const handleCentroSeleccionado = async (centro) => {
    setCentroSeleccionado(centro);
    try {
      const response = await api.get(`/empleados-centro/centro/${centro.id}`);
      setEmpleados(response.data.map(emp => ({
        id: emp.empleadoId,
        nombre: emp.nombre
      })));
    } catch (error) {
      console.error('Error al cargar empleados del centro:', error);
    }
  };

  const handleSaveHorario = async () => {
    try {
      await api.post('/api/horarios', {
        fecha: selectedDate.format('YYYY-MM-DD'),
        horaEntrada: newHorario.horaEntrada,
        horaSalida: newHorario.horaSalida,
        turno: newHorario.turno,
        empleadoId: newHorario.empleadoId,
        centroTrabajoId: centroSeleccionado.id // Usar el id del centro seleccionado
      });
      setShowModal(false);
      fetchHorarios(); // Actualiza los horarios después de crear uno nuevo
    } catch (error) {
      console.error('Error al crear el horario:', error);
    }
  };

  const horariosFiltrados = centroSeleccionado
    ? horarios.filter(horario => horario.centroTrabajoId === centroSeleccionado.id)
    : [];

  const empleadosConHorarioHoy = horariosFiltrados.filter(horario =>
    moment(horario.fecha).isSame(selectedDate, 'day')
  );

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center">Horarios</h2>

      {/* Selector de Centros */}
      <div className="d-flex justify-content-center mb-3">
        {centros.map((centro) => (
          <Button
            key={centro.id}
            onClick={() => handleCentroSeleccionado(centro)}
            variant={centro.id === (centroSeleccionado?.id) ? 'primary' : 'outline-primary'}
            className="mx-1"
          >
            {centro.nombre}
          </Button>
        ))}
      </div>

      {/* Selector de Fecha */}
      <div className="d-flex justify-content-center align-items-center mb-3">
        <Button onClick={handlePreviousDay} variant="secondary" className="me-2">&lt;</Button>

        <Form.Select
          value={selectedDate.date()}
          onChange={(e) => handleDateChange(selectedDate.clone().date(parseInt(e.target.value)))}
          className="me-2"
        >
          {Array.from({ length: selectedDate.daysInMonth() }, (_, i) => {
            const dayDate = selectedDate.clone().date(i + 1);
            return (
              <option key={i} value={i + 1}>
                {`${i + 1} - ${dayDate.format('dddd')}`} {/* Muestra día de la semana */}
              </option>
            );
          })}
        </Form.Select>

        <Form.Select
          value={selectedDate.month()}
          onChange={(e) => handleDateChange(selectedDate.clone().month(parseInt(e.target.value)))}
          className="me-2"
        >
          {moment.months().map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </Form.Select>

        <Form.Select
          value={selectedDate.year()}
          onChange={(e) => handleDateChange(selectedDate.clone().year(parseInt(e.target.value)))}
          className="me-2"
        >
          {Array.from({ length: 5 }, (_, i) => moment().year() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>

        <Button onClick={handleNextDay} variant="secondary" className="ms-2">&gt;</Button>
      </div>

      {/* Botón para Crear Horario */}
      <div className="text-center mb-3">
        <Button onClick={handleCreateHorario} variant="primary">Crear Horario</Button>
      </div>

      {/* Tabla de Horarios */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Horario</th>
          </tr>
        </thead>
        <tbody>
          {empleadosConHorarioHoy.length > 0 ? (
            empleadosConHorarioHoy.map((horario, index) => (
              <tr key={index}>
                <td>{horario.empleadoNombre}</td>
                <td
                  style={{
                    backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' : '#2E5B57',
                    color: 'white'
                  }}
                >
                  {`${horario.horaEntrada} - ${horario.horaSalida}`}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">No hay empleados con horarios para esta fecha</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal para Crear Horario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Horario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmpleadoId">
              <Form.Label>Empleado</Form.Label>
              <Form.Control
                as="select"
                value={newHorario.empleadoId}
                onChange={(e) => setNewHorario({ ...newHorario, empleadoId: parseInt(e.target.value) })}
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>{empleado.nombre}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTurno">
              <Form.Label>Turno</Form.Label>
              <Form.Control
                as="select"
                value={newHorario.turno}
                onChange={(e) => setNewHorario({ ...newHorario, turno: e.target.value })}
              >
                <option value="MAÑANA">Mañana</option>
                <option value="TARDE">Tarde</option>
              </Form.Control>
            </Form.Group>

            {/* Hora de Entrada y Salida */}
            <Form.Group controlId="formHoraEntrada">
              <Form.Label>Hora Entrada</Form.Label>
              <Form.Control
                type="number"
                placeholder="8"
                onChange={(e) => setNewHorario({ ...newHorario, horaEntrada: { hour: parseInt(e.target.value), minute: 0, second: 0, nano: 0 } })}
              />
            </Form.Group>
            <Form.Group controlId="formHoraSalida">
              <Form.Label>Hora Salida</Form.Label>
              <Form.Control
                type="number"
                placeholder="16"
                onChange={(e) => setNewHorario({ ...newHorario, horaSalida: { hour: parseInt(e.target.value), minute: 0, second: 0, nano: 0 } })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveHorario}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HorariosPage;
