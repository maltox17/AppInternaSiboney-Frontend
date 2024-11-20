import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import api from '../services/api';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState(null);
  const navigate = useNavigate(); // Hook para la navegación

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

  const handleNavigateToProfile = (idEmpleado) => {
    navigate(`/jefe/empleados/${idEmpleado}`);
  };

  // Esquema de validación usando Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .required('Nombre es obligatorio'),
    email: Yup.string()
      .email('Formato de email inválido')
      .required('Email es obligatorio'),
    telefono: Yup.string()
      .matches(/^[0-9]+$/, 'El teléfono debe tener un formato válido')
      .min(9, 'El teléfono debe tener al menos 9 caracteres')
      .required('El teléfono es obligatorio'),
    horasContrato: Yup.number()
      .positive('Las horas de contrato deben ser positivas')
      .integer('Las horas de contrato no pueden tener decimales')
      .required('Horas de contrato obligatorias'),
    rol: Yup.string().required('Rol es obligatorio'),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const payload = { ...values, clave: 'siboney' };
      if (currentEmpleado) {
        await api.put(`/empleados/${currentEmpleado.id}`, payload);
      } else {
        await api.post('/empleados', payload);
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

      {/* Tabla para dispositivos grandes */}
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
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleShowForm(empleado)}
                      size="sm"
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => handleDeleteEmpleado(empleado.id)}
                      size="sm"
                      className="mr-2 me-2"
                    >
                      <FaTrash />
                    </Button>

                    <Button
                      variant="primary"
                      className="ml-2"
                      onClick={() => handleNavigateToProfile(empleado.id)}
                      size="sm"
                    >
                      <FaUserPlus />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Vista en cards para dispositivos móviles */}
      <div className="d-block d-md-none">
        {empleados.map((empleado) => (
          <div key={empleado.id} className="border rounded p-3 mb-3">
            <p>
              <strong>ID:</strong> {empleado.id}
            </p>
            <p>
              <strong>Nombre:</strong> {empleado.nombre}
            </p>
            <p>
              <strong>Email:</strong> {empleado.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {empleado.telefono}
            </p>
            <div className="d-flex justify-content-end">
              <Button
                variant="warning"
                className="me-2"
                onClick={() => handleShowForm(empleado)}
                size="sm"
              >
                <FaEdit />
              </Button>

              <Button
                variant="danger"
                className="me-2"
                onClick={() => handleDeleteEmpleado(empleado.id)}
                size="sm"
              >
                <FaTrash />
              </Button>

              <Button
                variant="primary"
                onClick={() => handleNavigateToProfile(empleado.id)}
                size="sm"
              >
                <FaUserPlus />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => handleShowForm()}
        className="mt-3 mb-5 w-50 d-flex m-auto justify-content-center buttonBgPrimary"
        variant='secondary'
      >
        Crear Empleado
      </Button>

      {/* Modal para el formulario de creación/edición */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentEmpleado ? 'Editar Empleado' : 'Agregar Empleado'}
          </Modal.Title>
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
                  <Field
                    type="text"
                    name="nombre"
                    as={Form.Control}
                    onChange={handleChange}
                    value={values.nombre}
                  />
                  <ErrorMessage name="nombre" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Field
                    type="email"
                    name="email"
                    as={Form.Control}
                    onChange={handleChange}
                    value={values.email}
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Field
                    type="tel"
                    name="telefono"
                    as={Form.Control}
                    onChange={handleChange}
                    value={values.telefono}
                  />
                  <ErrorMessage name="telefono" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Horas de Contrato</Form.Label>
                  <Field
                    type="number"
                    name="horasContrato"
                    as={Form.Control}
                    onChange={handleChange}
                    value={values.horasContrato}
                  />
                  <ErrorMessage name="horasContrato" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Field
                    as="select"
                    name="rol"
                    className="form-control"
                    onChange={handleChange}
                    value={values.rol}
                  >
                    <option value="">Selecciona un rol</option>
                    <option value="CAMARERO">Camarero</option>
                    <option value="ENCARGADO">Encargado</option>
                    <option value="COCINERO">Cocinero</option>
                    <option value="JEFE">Jefe</option>
                  </Field>
                  <ErrorMessage name="rol" component="div" className="text-danger" />
                </Form.Group>

                <Button type="submit" className="w-100 buttonBgPrimary" variant='secondary'>
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


