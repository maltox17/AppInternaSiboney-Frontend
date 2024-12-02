import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const NotificarHorariosModal = ({ show, handleClose, handleNotificarHorarios}) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Notificacion Horario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas enviar un correo a los empleados notificando nuevos horarios?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="secondary" className='buttonBgPrimary' onClick={() => handleNotificarHorarios()}>
                    Notificar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NotificarHorariosModal;
