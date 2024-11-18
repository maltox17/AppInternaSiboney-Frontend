import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Card, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const HorariosEstablecidosPage = () => {
  const [centros, setCentros] = useState([]);
  const [horariosEstablecidos, setHorariosEstablecidos] = useState([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formValues, setFormValues] = useState({
    id: '',
    diaSemana: '',
    horaEntrada: '',
    horaSalida: '',
    turno: '',
  });
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchHorariosEstablecidos = async () => {
      try {
        const response = await api.get('/horariosEstablecidos'); // Llama al endpoint para obtener horarios establecidos
        setHorariosEstablecidos(response.data);

        // Extrae nombres únicos de centros
        const centrosUnicos = [...new Set(response.data.map(horario => horario.centroNombre))];
        setCentros(centrosUnicos);
      } catch (error) {
        console.error('Error al cargar los horarios establecidos:', error);
      }
    };

    fetchHorariosEstablecidos();
  }, []);

  const horariosFiltrados = centroSeleccionado
    ? horariosEstablecidos.filter(horario => horario.centroNombre === centroSeleccionado)
    : [];

  const empleadosDelCentro = horariosFiltrados.reduce((acc, horario) => {
    const { empleadoId, empleadoNombre } = horario;
    if (!acc[empleadoId]) {
      acc[empleadoId] = { empleadoNombre, horarios: [] };
    }
    acc[empleadoId].horarios.push(horario);
    return acc;
  }, {});

  const handleEdit = (horario) => {
    setFormValues({
      id: horario.id,
      diaSemana: horario.diaSemana,
      horaEntrada: horario.horaEntrada,
      horaSalida: horario.horaSalida,
      turno: horario.turno,
      empleadoId: horario.empleadoId,
      centroTrabajoId: horario.centroTrabajoId
    });
    setHorarioSeleccionado(horario);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/horariosEstablecidos/${formValues.id}`, formValues);
      setShowEditModal(false);
      setHorarioSeleccionado(null);
      const response = await api.get('/horariosEstablecidos'); // Actualizar datos
      setHorariosEstablecidos(response.data);
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
    }
  };

  const handleDelete = (horario) => {
    setHorarioSeleccionado(horario);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await api.delete(`/horariosEstablecidos/${horarioSeleccionado.id}`);
      setShowDeleteModal(false);
      setHorarioSeleccionado(null);
      const response = await api.get('/horariosEstablecidos'); // Actualizar datos
      setHorariosEstablecidos(response.data);
    } catch (error) {
      console.error('Error al eliminar el horario:', error);
    }
  };

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center">Horarios Establecidos</h2>

      {/* Selector de Centros */}
      <div className="d-flex justify-content-center mb-3">
        {centros.map((centro, index) => (
          <Button
            key={index}
            onClick={() => setCentroSeleccionado(centro)}
            variant={centro === centroSeleccionado ? 'button' : 'outline'}
            className={`mx-1 buttonOutlinePrimary ${centro === centroSeleccionado ? 'active' : ''}`}
          >
            {centro}
          </Button>
        ))}
      </div>

      {/* Tablas de Empleados */}
      {Object.values(empleadosDelCentro).length > 0 ? (
        Object.values(empleadosDelCentro).map(({ empleadoNombre, horarios }, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{empleadoNombre}</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Día de la Semana</th>
                    <th>Horario</th>
                    <th>Turno</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((horario, index) => (
                    <tr key={index}>
                      <td>{horario.diaSemana}</td>
                      <td>{`${horario.horaEntrada} - ${horario.horaSalida}`}</td>
                      <td>{horario.turno}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(horario)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(horario)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center">
          <p>No hay horarios establecidos para el centro seleccionado.</p>
        </div>
      )}

      {/* Modal Editar */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Horario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Día de la Semana</Form.Label>
              <Form.Select
                value={formValues.diaSemana}
                onChange={(e) => setFormValues({ ...formValues, diaSemana: e.target.value })}
              >
                <option value="LUNES">LUNES</option>
                <option value="MARTES">MARTES</option>
                <option value="MIERCOLES">MIÉRCOLES</option>
                <option value="JUEVES">JUEVES</option>
                <option value="VIERNES">VIERNES</option>
                <option value="SABADO">SÁBADO</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora de Entrada</Form.Label>
              <Form.Control
                type="time"
                value={formValues.horaEntrada}
                onChange={(e) => setFormValues({ ...formValues, horaEntrada: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora de Salida</Form.Label>
              <Form.Control
                type="time"
                value={formValues.horaSalida}
                onChange={(e) => setFormValues({ ...formValues, horaSalida: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Turno</Form.Label>
              <Form.Select
                value={formValues.turno}
                onChange={(e) => setFormValues({ ...formValues, turno: e.target.value })}
              >
                <option value="MAÑANA">MAÑANA</option>
                <option value="TARDE">TARDE</option>
              </Form.Select>
            </Form.Group>
            <Button variant='secondary' onClick={handleEditSubmit} className='buttonBgPrimary'>
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Horario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de que desea eliminar este horario?</p>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Eliminar
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HorariosEstablecidosPage;
