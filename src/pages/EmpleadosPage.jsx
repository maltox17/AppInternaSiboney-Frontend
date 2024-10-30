import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState(null);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await api.get('/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar los empleados:', error);
    }
  };

  const handleShowForm = (empleado = null) => {
    setCurrentEmpleado(empleado);
    setShowForm(true);
  };

  const handleDeleteEmpleado = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await api.delete(`/empleados/${id}`);
        fetchEmpleados();
      } catch (error) {
        console.error('Error al eliminar el empleado:', error);
      }
    }
  };

  // Esquema de validación usando Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters") // Solo letras y espacios
      .min(3, 'Name must be at least 3 characters') // Longitud mínima de 3 caracteres
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    telefono: Yup.string()
      .matches(/^[0-9]+$/, "Phone must be a valid number")
      .min(9, 'Phone number must be at least 9 digits')
      .required('Phone is required'),
    horasContrato: Yup.number()
      .positive('Contract hours must be positive')
      .integer('Contract hours must be an integer')
      .required('Contract hours are required'),
    rol: Yup.string().required('Role is required'),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (currentEmpleado) {
        await api.put(`/empleados/${currentEmpleado.id}`, values);
      } else {
        await api.post('/empleados', values);
      }
      setShowForm(false);
      fetchEmpleados();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Empleados</h2>
      <div className="table-responsive mt-4 d-none d-md-block">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.id}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.email}</td>
                <td>{empleado.telefono}</td>
                <td>
                  <div> 
                  <OverlayTrigger placement="top" overlay={<Tooltip>Editar empleado</Tooltip>}>
                    <Button variant="warning" className="me-2 mb-2" onClick={() => handleShowForm(empleado)} size="sm" style={{marginTop: '4%'}}>
                      <FaEdit />
                    </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar empleado</Tooltip>}>
                    <Button variant="danger" onClick={() => handleDeleteEmpleado(empleado.id)} size="sm">
                      <FaTrash />
                    </Button>
                    </OverlayTrigger>
                  </div>                 
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Button onClick={() => handleShowForm()} className="mt-3 w-50 d-flex m-auto justify-content-center buttonBgPrimary">
        Crear Empleado
      </Button>

      {/* Modal para el formulario de creación/edición */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentEmpleado ? 'Editar Empleado' : 'Agregar Empleado'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              nombre: currentEmpleado ? currentEmpleado.nombre : '',
              email: currentEmpleado ? currentEmpleado.email : '',
              telefono: currentEmpleado ? currentEmpleado.telefono : '',
              horasContrato: currentEmpleado ? currentEmpleado.horasContrato : '',
              rol: currentEmpleado ? currentEmpleado.rol : '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, handleChange, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Field type="text" name="nombre" as={Form.Control} onChange={handleChange} value={values.nombre} />
                  <ErrorMessage name="nombre" component="div" className="text-danger" />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Field type="email" name="email" as={Form.Control} onChange={handleChange} value={values.email} />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Field type="tel" name="telefono" as={Form.Control} onChange={handleChange} value={values.telefono} />
                  <ErrorMessage name="telefono" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Horas de Contrato</Form.Label>
                  <Field type="number" name="horasContrato" as={Form.Control} onChange={handleChange} value={values.horasContrato} />
                  <ErrorMessage name="horasContrato" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Field as="select" name="rol" className="form-control" onChange={handleChange} value={values.rol}>
                    <option value="">Selecciona un rol</option>
                    <option value="CAMARERO">Camarero</option>
                    <option value="ENCARGADO">Encargado</option>
                    <option value="COCINERO">Cocinero</option>
                    <option value="JEFE">Jefe</option>
                  </Field>
                  <ErrorMessage name="rol" component="div" className="text-danger" />
                </Form.Group>

                <Button type="submit" className="w-100 buttonBgPrimary">
                  {currentEmpleado ? 'Actualizar' : 'Crear'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmpleadosPage;

