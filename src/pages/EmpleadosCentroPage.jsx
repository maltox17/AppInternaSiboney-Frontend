import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EmpleadosCentroPage = () => {
  const [empleadosCentro, setEmpleadosCentro] = useState([]);
  const [centros, setCentros] = useState([]); // Centros disponibles para el select
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSingleCenterDelete, setIsSingleCenterDelete] = useState(false); // Nuevo estado
  const [formValues, setFormValues] = useState({
    empleadoId: '',
    centroTrabajoId: '',
    esEncargado: false,
  });

  useEffect(() => {
    fetchEmpleadosCentro();
    fetchCentros();
  }, []);

  const fetchEmpleadosCentro = async () => {
    try {
      const response = await api.get('/empleados-centro');
      const rawData = response.data;

      // Agrupar datos por empleadoId
      const groupedData = rawData.reduce((acc, curr) => {
        const existingEmpleado = acc.find((e) => e.empleadoId === curr.empleadoId);
        if (existingEmpleado) {
          existingEmpleado.centros.push({
            nombre: curr.centroNombre,
            id: curr.centroTrabajoId, // Asegúrate de usar un identificador para el centro
            esEncargado: curr.esEncargado,
          });
        } else {
          acc.push({
            empleadoId: curr.empleadoId,
            empleadoNombre: curr.empleadoNombre,
            centros: [
              {
                nombre: curr.centroNombre,
                id: curr.centroTrabajoId, // Agregar identificador del centro
                esEncargado: curr.esEncargado,
              },
            ],
          });
        }
        return acc;
      }, []);

      setEmpleadosCentro(groupedData);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  const fetchCentros = async () => {
    try {
      const response = await api.get('/centros'); // Endpoint para obtener los centros
      setCentros(response.data);
    } catch (error) {
      console.error('Error al cargar los centros:', error);
    }
  };

  const handleFormCreate = (empleado) => {
    setFormValues({
      empleadoId: empleado.empleadoId,
      centroTrabajoId: '', // Vacío para elegir un nuevo centro
      esEncargado: false,
    });
    setShowCreateModal(true);
  };

  const handleCreate = async () => {
    try {
      await api.post(`/empleados-centro`, {
        empleadoId: formValues.empleadoId,
        centroTrabajoId: formValues.centroTrabajoId,
        esEncargado: formValues.esEncargado,
      });
      setShowCreateModal(false);
      fetchEmpleadosCentro(); // Refrescar los datos después de la actualización
    } catch (error) {
      console.error('Error al crear la asignación:', error);
    }
  };

  const handleFormDelete = (empleado) => {
    const centrosEmpleado = empleado.centros;

    setFormValues({
      empleadoId: empleado.empleadoId,
      centroTrabajoId: centrosEmpleado.length === 1 ? centrosEmpleado[0].id : '', // Preselecciona el único centro si solo hay uno
    });

    if (centrosEmpleado.length === 1) {
      setIsSingleCenterDelete(true); // Indica que es un caso de centro único
    } else {
      setIsSingleCenterDelete(false); // Indica que hay múltiples centros
    }

    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/empleados-centro/${formValues.empleadoId}/${formValues.centroTrabajoId}`);
      setShowDeleteModal(false);
      fetchEmpleadosCentro(); // Actualiza los datos después de eliminar
    } catch (error) {
      console.error('Error al eliminar la asignación:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Empleados asignados a centros</h2>

      {/* Tabla */}
      <div className="table-responsive mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Centros</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosCentro.map((empleado) => (
              <tr key={empleado.empleadoId}>
                <td>{empleado.empleadoId}</td>
                <td>{empleado.empleadoNombre}</td>
                <td>
                  {empleado.centros.map((centro, index) => (
                    <div key={`${empleado.empleadoId}-${index}`}>
                      {centro.nombre} {centro.esEncargado && <strong>(Encargado)</strong>}
                    </div>
                  ))}
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleFormCreate(empleado)}
                  >
                    <FaPlus />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleFormDelete(empleado)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal Crear */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo centro para empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Centro de Trabajo</Form.Label>
              <Form.Select
                value={formValues.centroTrabajoId}
                onChange={(e) => setFormValues({ ...formValues, centroTrabajoId: e.target.value })}
              >
                <option value="">Seleccione un centro</option>
                {centros.map((centro) => (
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
                onChange={(e) => setFormValues({ ...formValues, esEncargado: e.target.checked })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreate}>
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar empleado de centro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isSingleCenterDelete ? (
            <div>
              <p>
                ¿Está seguro de que desea eliminar el centro para este
                empleado?
              </p>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          ) : (
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
                  {empleadosCentro
                    .find((e) => e.empleadoId === formValues.empleadoId)
                    ?.centros.map((centro) => (
                      <option key={centro.id} value={centro.id}>
                        {centro.nombre}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmpleadosCentroPage;
