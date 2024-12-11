import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditarHorarioModal = ({ show, handleClose, handleEditar, horario }) => {
    const [horaEntrada, setHoraEntrada] = useState('');
    const [horaSalida, setHoraSalida] = useState('');
    const [turno, setTurno] = useState(''); 

    useEffect(() => {
        setHoraEntrada(horario?.horaEntrada || '');
        setHoraSalida(horario?.horaSalida || '');
        setTurno(horario?.turno || ''); 
    }, [horario]);

    const handleSubmit = () => {
        const updatedHorario = {
            ...horario,
            horaEntrada,
            horaSalida,
            turno, 
        };
        handleEditar(updatedHorario);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Horario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
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
                    <Form.Group className="mb-3">
                        <Form.Label>Turno</Form.Label>
                        <Form.Select
                            value={turno}
                            onChange={(e) => setTurno(e.target.value)}
                        >
                            <option value="">Selecciona un turno</option>
                            <option value="MAÑANA">Mañana</option>
                            <option value="TARDE">Tarde</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="secondary" className='buttonBgPrimary' onClick={handleSubmit}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditarHorarioModal;


