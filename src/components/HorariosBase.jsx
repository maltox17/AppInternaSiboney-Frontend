import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form } from 'react-bootstrap';
import moment from 'moment';
import { hasRole } from '../utils/utils';
import CrearHorarioModal from './CrearHorarioModal';
import EliminarHorarioModal from './EliminarHorarioModal';
import EditarHorarioModal from './EditarHorarioModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const HorariosBase = () => {
    const [centros, setCentros] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [centroSeleccionado, setCentroSeleccionado] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(moment()); 
    const [esJefe, setEsJefe] = useState(false); 
    const [showCrearModal, setShowCrearModal] = useState(false); 
    const [showEliminarModal, setShowEliminarModal] = useState(false); 
    const [showEditarModal, setShowEditarModal] = useState(false); 
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null); 

    useEffect(() => {
        const verificarRolJefe = () => {
            const token = localStorage.getItem('token'); 
            setEsJefe(hasRole(token, 'ROLE_JEFE'));
        };

        verificarRolJefe();

        const fetchCentrosYHorarios = async () => {
            try {
               
                const centrosResponse = await api.get('/centros'); 
                setCentros(centrosResponse.data);

                
                const horariosResponse = await api.get('/horarios/nombres');
                setHorarios(horariosResponse.data);
            } catch (error) {
                console.error('Error al cargar los centros y horarios:', error);
            }
        };

        fetchCentrosYHorarios();
    }, []);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const handlePreviousDay = () => {
        setSelectedDate(prevDate => prevDate.clone().subtract(1, 'days'));
    };

    const handleNextDay = () => {
        setSelectedDate(prevDate => prevDate.clone().add(1, 'days'));
    };

    const handleHorarioCreado = async () => {
        try {
            const horariosResponse = await api.get('/horarios/nombres');
            setHorarios(horariosResponse.data);
        } catch (error) {
            console.error('Error al recargar los horarios:', error);
        }
    };

    const handleOpenEliminarModal = (horario) => {
        setHorarioSeleccionado(horario);
        setShowEliminarModal(true);
    };

    const handleOpenEditarModal = (horario) => {
        setHorarioSeleccionado(horario);
        setShowEditarModal(true);
    };

    const handleEliminarHorario = async (id) => {
        try {
            await api.delete(`/horarios/${id}`);
            setHorarios(prev => prev.filter(h => h.id !== id));
            setShowEliminarModal(false);
        } catch (error) {
            console.error('Error al eliminar el horario:', error);
        }
    };

    const handleEditarHorario = async (updatedHorario) => {
        try {
            await api.put(`/horarios/${updatedHorario.id}`, updatedHorario);
            setHorarios(prev =>
                prev.map(h => (h.id === updatedHorario.id ? updatedHorario : h))
            );
            setShowEditarModal(false);
        } catch (error) {
            console.error('Error al editar el horario:', error);
        }
    };

    const horariosFiltrados = centroSeleccionado
        ? horarios.filter(horario => horario.centroTrabajoId === centroSeleccionado.id)
        : [];

    const empleadosConHorarioHoy = horariosFiltrados
        .filter(horario => moment(horario.fecha).isSame(selectedDate, 'day'))
        .sort((a, b) => a.horaEntrada.localeCompare(b.horaEntrada)); // Ordena por hora de entrada

    return (
        <div className="container mt-3 mb-3">
            <h2 className="text-center">Horarios</h2>

            {/* Selector de Centros */}
            <div className="d-flex justify-content-center mb-3">
                {centros.map(centro => (
                    <Button
                        key={centro.id}
                        onClick={() => setCentroSeleccionado(centro)}
                        variant={centroSeleccionado?.id === centro.id ? 'button' : 'outline'}
                        className={`mx-1 buttonOutlinePrimary ${centroSeleccionado?.id === centro.id ? 'active' : ''}`}
                    >
                        {centro.nombre}
                    </Button>
                ))}
            </div>

            {centroSeleccionado && (
                <>
                    {/* Selector de Fecha */}
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <Button onClick={handlePreviousDay} variant="secondary" className="me-2 bgSecondary">&lt;</Button>
                        <Form.Select
                            value={selectedDate.date()}
                            onChange={(e) => handleDateChange(selectedDate.clone().date(parseInt(e.target.value)))}
                            className="calendar-selector mx-2 urderline text-black text-center selectHorario"
                        >
                            {Array.from({ length: selectedDate.daysInMonth() }, (_, i) => {
                                const dayDate = selectedDate.clone().date(i + 1);
                                return (
                                    <option key={i} value={i + 1}>
                                        {`${i + 1} - ${dayDate.format('dddd')}`}
                                    </option>
                                );
                            })}
                        </Form.Select>
                        <Form.Select
                            value={selectedDate.month()}
                            onChange={(e) => handleDateChange(selectedDate.clone().month(parseInt(e.target.value)))}
                            className="calendar-selector mx-2 urderline text-black text-center selectHorario"
                        >
                            {moment.months().map((month, index) => (
                                <option key={index} value={index}>
                                    {month}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={selectedDate.year()}
                            onChange={(e) => handleDateChange(selectedDate.clone().year(parseInt(e.target.value)))}
                            className="calendar-selector mx-2 urderline text-black text-center selectHorario"
                        >
                            {Array.from({ length: 5 }, (_, i) => moment().year() - 2 + i).map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </Form.Select>
                        <Button onClick={handleNextDay} variant="secondary" className="ms-2 bgSecondary">&gt;</Button>
                    </div>

                    {esJefe && (
                        <div className="d-flex justify-content-center mb-3">
                            <Button variant="secondary" className='buttonBgPrimary' onClick={() => setShowCrearModal(true)}>
                                Crear Horario
                            </Button>
                        </div>
                    )}

                    {/* Tabla de Horarios */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Horario</th>
                                {esJefe && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {empleadosConHorarioHoy.length > 0 ? (
                                empleadosConHorarioHoy.map((horario, index) => (
                                    <tr key={index}>
                                        <td>{horario.empleadoNombre}</td>
                                        <td style={{
                                            backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' : '#2E5B57',
                                            color: 'white'
                                        }}>
                                            {`${horario.horaEntrada} - ${horario.horaSalida}`}
                                        </td>
                                        {esJefe && (
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleOpenEditarModal(horario)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleOpenEliminarModal(horario)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={esJefe ? "3" : "2"} className="text-center">
                                        No hay empleados con horarios para esta fecha
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Modales */}
                    <CrearHorarioModal
                        show={showCrearModal}
                        handleClose={() => setShowCrearModal(false)}
                        centroSeleccionado={centroSeleccionado?.id} // Pasar ID del centro
                        fechaSeleccionada={selectedDate}
                        onHorarioCreado={handleHorarioCreado}
                    />
                    <EliminarHorarioModal
                        show={showEliminarModal}
                        handleClose={() => setShowEliminarModal(false)}
                        handleEliminar={handleEliminarHorario}
                        horario={horarioSeleccionado}
                    />
                    <EditarHorarioModal
                        show={showEditarModal}
                        handleClose={() => setShowEditarModal(false)}
                        handleEditar={handleEditarHorario}
                        horario={horarioSeleccionado}
                    />
                </>
            )}
        </div>
    );
};

export default HorariosBase;
