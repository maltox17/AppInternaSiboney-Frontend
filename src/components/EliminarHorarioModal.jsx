import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EliminarHorarioModal = ({ show, handleClose, handleEliminar, horario }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas eliminar el horario para {horario?.empleadoNombre}?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={() => handleEliminar(horario.id)}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EliminarHorarioModal;
