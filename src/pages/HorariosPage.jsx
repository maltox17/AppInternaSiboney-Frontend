import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form } from 'react-bootstrap';
import moment from 'moment';

const HorariosPage = () => {
  const [centros, setCentros] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment()); // Fecha seleccionada

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await api.get('/horarios/nombres');
        setHorarios(response.data);
        const centrosUnicos = [...new Set(response.data.map(horario => horario.centroNombre))];
        setCentros(centrosUnicos);
      } catch (error) {
        console.error('Error al cargar los horarios y centros:', error);
      }
    };

    fetchHorarios();
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

  const horariosFiltrados = centroSeleccionado
    ? horarios.filter(horario => horario.centroNombre === centroSeleccionado)
    : [];

  const empleadosConHorarioHoy = horariosFiltrados.filter(horario =>
    moment(horario.fecha).isSame(selectedDate, 'day')
  );

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center">Horarios</h2>

      {/* Selector de Centros */}
      <div className="d-flex justify-content-center mb-3">
        {centros.map((centro, index) => (
          <Button
            key={index}
            onClick={() => setCentroSeleccionado(centro)}
            variant={centro === centroSeleccionado ? 'button' : 'outline'}
            className={`mx-1 buttonOutlinePrimary ${centro === centroSeleccionado ? 'active' : ''}`}
          >
            {centro}
          </Button>
        ))}
      </div>

      {/* Selector de Fecha */}
      <div className="d-flex justify-content-center align-items-center mb-3">
        <Button onClick={handlePreviousDay} variant="secondary" className="me-2 bgSecondary">&lt;</Button>

        <Form.Select
          value={selectedDate.date()}
          onChange={(e) => handleDateChange(selectedDate.clone().date(parseInt(e.target.value)))}
          className="me-2 selectDate"
        >
          {Array.from({ length: selectedDate.daysInMonth() }, (_, i) => {
            const dayDate = selectedDate.clone().date(i + 1);
            return (
              <option key={i} value={i + 1}>
                {`${i + 1} - ${dayDate.format('dddd')}`} {/* Muestra día de la semana */}
              </option>
            );
          })}
        </Form.Select>

        <Form.Select
          value={selectedDate.month()}
          onChange={(e) => handleDateChange(selectedDate.clone().month(parseInt(e.target.value)))}
          className="me-2 selectDate"
        >
          {moment.months().map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </Form.Select>

        <Form.Select
          value={selectedDate.year()}
          onChange={(e) => handleDateChange(selectedDate.clone().year(parseInt(e.target.value)))}
          className="me-2 selectDate"
        >
          {Array.from({ length: 5 }, (_, i) => moment().year() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>

        <Button onClick={handleNextDay} variant="secondary" className="ms-2 bgSecondary">&gt;</Button>
      </div>

      {/* Tabla de Horarios */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Horario</th>
          </tr>
        </thead>
        <tbody>
          {empleadosConHorarioHoy.length > 0 ? (
            empleadosConHorarioHoy.map((horario, index) => (
              <tr key={index}>
                <td>{horario.empleadoNombre}</td>
                <td
                  style={{
                    backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' : '#2E5B57',
                    color: 'white'
                  }}
                >
                  {`${horario.horaEntrada} - ${horario.horaSalida}`}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">No hay empleados con horarios para esta fecha</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default HorariosPage;
