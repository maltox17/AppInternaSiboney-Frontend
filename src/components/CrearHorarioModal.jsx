import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../services/api';
import moment from 'moment';

const CrearHorarioModal = ({ show, handleClose, centroSeleccionado, fechaSeleccionada, onHorarioCreado }) => {
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
    const [horaEntrada, setHoraEntrada] = useState('');
    const [horaSalida, setHoraSalida] = useState('');
    const [turno, setTurno] = useState(''); // Estado para el turno

    // Fetch empleados basados en el ID del centro seleccionado
    useEffect(() => {
        if (centroSeleccionado) {
            const fetchEmpleados = async () => {
                try {
                    const response = await api.get(`/empleados-centro/centro/${centroSeleccionado}`); // Usar ID directamente
                    setEmpleados(response.data);
                } catch (error) {
                    console.error('Error al cargar los empleados del centro:', error);
                }
            };

            fetchEmpleados();
        }
    }, [centroSeleccionado]);

    const handleSubmit = async () => {
        if (!empleadoSeleccionado || !horaEntrada || !horaSalida || !turno) {
            alert('Por favor, completa todos los campos');
            return;
        }

        const nuevoHorario = {
            empleadoId: empleadoSeleccionado,
            fecha: moment(fechaSeleccionada).format('YYYY-MM-DD'),
            horaEntrada,
            horaSalida,
            turno, // Incluir el turno en el objeto
            centroTrabajoId: centroSeleccionado, // Incluir el ID del centro
        };

        try {
            await api.post('/horarios', nuevoHorario); // Enviar horario al servidor
            onHorarioCreado(); // Notificar al componente padre que un horario fue creado
            handleClose(); // Cerrar el modal
        } catch (error) {
            console.error('Error al crear el horario:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear Horario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Empleado</Form.Label>
                        <Form.Select
                            value={empleadoSeleccionado}
                            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccionar Empleado</option>
                            {empleados.map((empleado) => (
                                <option key={empleado.empleadoId} value={empleado.empleadoId}>
                                    {empleado.empleadoNombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Turno</Form.Label>
                        <Form.Select
                            value={turno}
                            onChange={(e) => setTurno(e.target.value)}
                        >
                            <option value="">Seleccionar Turno</option>
                            <option value="MAÑANA">MAÑANA</option>
                            <option value="TARDE">TARDE</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Hora de Entrada</Form.Label>
                        <Form.Control
                            type="time"
                            value={horaEntrada}
                            onChange={(e) => setHoraEntrada(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Hora de Salida</Form.Label>
                        <Form.Control
                            type="time"
                            value={horaSalida}
                            onChange={(e) => setHoraSalida(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="secondary" className='buttonBgPrimary' onClick={handleSubmit}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CrearHorarioModal;
