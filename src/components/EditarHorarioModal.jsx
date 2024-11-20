import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditarHorarioModal = ({ show, handleClose, handleEditar, horario }) => {
    const [horaEntrada, setHoraEntrada] = useState(horario?.horaEntrada || '');
    const [horaSalida, setHoraSalida] = useState(horario?.horaSalida || '');

    const handleSubmit = () => {
        const updatedHorario = {
            ...horario,
            horaEntrada,
            horaSalida,
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
