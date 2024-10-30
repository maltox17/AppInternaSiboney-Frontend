import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CentrosPage = () => {
  const [centros, setCentros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentCentro, setCurrentCentro] = useState(null);

  useEffect(() => {
    fetchCentros();
  }, []);

  const fetchCentros = async () => {
    try {
      const response = await api.get('/centros');
      setCentros(response.data);
    } catch (error) {
      console.error('Error al cargar los centros de trabajo:', error);
    }
  };

  const handleShowForm = (centro = null) => {
    setCurrentCentro(centro);
    setShowForm(true);
  };

  const handleDeleteCentro = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este centro de trabajo?')) {
      try {
        await api.delete(`/centros/${id}`);
        fetchCentros();
      } catch (error) {
        console.error('Error al eliminar el centro de trabajo:', error);
      }
    }
  };

  // Esquema de validación usando Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    direccion: Yup.string()
      .min(5, 'Address must be at least 5 characters')
      .required('Address is required'),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (currentCentro) {
        await api.put(`/centros/${currentCentro.id}`, values);
      } else {
        await api.post('/centros', values);
      }
      setShowForm(false);
      fetchCentros();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el centro de trabajo:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Centros de Trabajo</h2>
      <div className="table-responsive mt-4 d-none d-md-block">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {centros.map((centro) => (
              <tr key={centro.id}>
                <td>{centro.id}</td>
                <td>{centro.nombre}</td>
                <td>{centro.direccion}</td>
                <td>
                  <div>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Editar centro</Tooltip>}>
                      <Button variant="warning" className="me-2 mb-2" onClick={() => handleShowForm(centro)} size="sm" style={{ marginTop: '3%' }}>
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar centro</Tooltip>}>
                      <Button variant="danger" onClick={() => handleDeleteCentro(centro.id)} size="sm">
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
        Crear Centro
      </Button>

      {/* Modal para el formulario de creación/edición */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentCentro ? 'Editar Centro' : 'Agregar Centro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              nombre: currentCentro ? currentCentro.nombre : '',
              direccion: currentCentro ? currentCentro.direccion : '',
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
                  <Form.Label>Dirección</Form.Label>
                  <Field type="text" name="direccion" as={Form.Control} onChange={handleChange} value={values.direccion} />
                  <ErrorMessage name="direccion" component="div" className="text-danger" />
                </Form.Group>

                <Button type="submit" className="w-100 buttonBgPrimary">
                  {currentCentro ? 'Actualizar' : 'Crear'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CentrosPage;
