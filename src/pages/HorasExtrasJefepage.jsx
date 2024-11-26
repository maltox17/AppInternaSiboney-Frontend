import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const HorasExtrasJefePage = () => {
  const [registros, setRegistros] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(null);

  // Validación del formulario
  const validationSchema = Yup.object({
    horasExtras: Yup.number().min(0, 'Debe ser un valor positivo').required('Campo obligatorio'),
    horasDeuda: Yup.number().min(0, 'Debe ser un valor positivo').required('Campo obligatorio'),
    empleadoId: Yup.number().required('Empleado requerido'),
  });

  useEffect(() => {
    fetchRegistros();
    fetchEmpleados();
  }, []);

  const fetchRegistros = async () => {
    try {
      const response = await api.get('/horasExtrasDeuda');
      setRegistros(response.data);
    } catch (error) {
      console.error('Error al obtener los registros de horas extras y deuda:', error);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await api.get('/empleados'); // Asume que hay un endpoint para obtener empleados
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  const handleShowForm = (registro = null) => {
    setCurrentRegistro(registro);
    setShowForm(true);
  };

  const handleDeleteRegistro = async (id) => {
    try {
      await api.delete(`/horasExtrasDeuda/${id}`);
      fetchRegistros();
      setShowEliminarModal(false);
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (currentRegistro) {
        await api.put(`/horasExtrasDeuda/${currentRegistro.id}`, values);
      } else {
        await api.post('/horasExtrasDeuda', values);
      }
      setShowForm(false);
      fetchRegistros();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el registro:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Horas Extras y Deuda</h2>

      <Button
        onClick={() => handleShowForm()}
        variant="secondary"
        className="mt-3 mb-2 w-50 d-flex m-auto justify-content-center buttonBgPrimary"
      >
        Crear Registro
      </Button>

      {/* Tabla para dispositivos grandes */}
      <div className="table-responsive mt-4 d-none d-md-block">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>Horas a Favor</th>
              <th>Horas a Deber</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length > 0 ? (
              registros.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.id}</td>
                  <td>{registro.empleadoNombre}</td>
                  <td>{registro.horasExtras}</td>
                  <td>{registro.horasDeuda}</td>
                  <td>
                    {registro.horasExtras - registro.horasDeuda > 0
                      ? `a favor: ${registro.horasExtras - registro.horasDeuda}H`
                      : `debe: ${Math.abs(registro.horasExtras - registro.horasDeuda)}H`}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleShowForm(registro)}
                      size="sm"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setCurrentRegistro(registro);
                        setShowEliminarModal(true);
                      }}
                      size="sm"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay registros.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Vista en cards para dispositivos pequeños */}
      <div className="d-block d-md-none">
        {registros.length > 0 ? (
          registros.map((registro) => (
            <Card key={registro.id} className="mb-3">
              <Card.Body>
                <Card.Title>
                  <strong>ID:</strong> {registro.id}
                </Card.Title>
                <Card.Text>
                  <strong>Empleado:</strong> {registro.empleadoNombre}
                </Card.Text>
                <Card.Text>
                  <strong>Horas a Favor:</strong> {registro.horasExtras}
                </Card.Text>
                <Card.Text>
                  <strong>Horas a Deber:</strong> {registro.horasDeuda}
                </Card.Text>
                <Card.Text>
                  <strong>Total:</strong>{' '}
                  {registro.horasExtras - registro.horasDeuda > 0
                    ? `a favor: ${registro.horasExtras - registro.horasDeuda}H`
                    : `debe: ${Math.abs(registro.horasExtras - registro.horasDeuda)}H`}
                </Card.Text>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowForm(registro)}
                    size="sm"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setCurrentRegistro(registro);
                      setShowEliminarModal(true);
                    }}
                    size="sm"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="text-center">No hay registros.</div>
        )}
      </div>

      {/* Modal Formulario */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentRegistro ? 'Editar Registro' : 'Crear Registro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              horasExtras: currentRegistro ? currentRegistro.horasExtras : 0,
              horasDeuda: currentRegistro ? currentRegistro.horasDeuda : 0,
              empleadoId: currentRegistro ? currentRegistro.empleadoId : '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, handleChange, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Horas a Favor</Form.Label>
                  <Field type="number" name="horasExtras" as={Form.Control} />
                  <ErrorMessage name="horasExtras" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Horas a Deber</Form.Label>
                  <Field type="number" name="horasDeuda" as={Form.Control} />
                  <ErrorMessage name="horasDeuda" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Empleado</Form.Label>
                  <Field as="select" name="empleadoId" className="form-control" onChange={handleChange}>
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.id} value={empleado.id}>
                        {empleado.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="empleadoId" component="div" className="text-danger" />
                </Form.Group>

                <Button type="submit" className="w-100 buttonBgPrimary" variant="secondary">
                  {currentRegistro ? 'Actualizar' : 'Crear'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Modal Delete */}
      <Modal show={showEliminarModal} onHide={() => setShowEliminarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de eliminar este registro?</p>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => setShowEliminarModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteRegistro(currentRegistro.id)}
            >
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HorasExtrasJefePage;
