import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form } from 'react-bootstrap';
import moment from 'moment';
import { getUserInfo } from '../utils/utils';

const TrabajadorHorarioPage = () => {
  const [horarios, setHorarios] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(moment().startOf('week')); // Semana seleccionada (comienza en lunes)
  const empleadoId = getUserInfo(localStorage.getItem('token')).id; // Obtener empleadoId del token

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await api.get(`/horarios/empleados/${empleadoId}`);
        setHorarios(response.data);
      } catch (error) {
        console.error('Error al cargar los horarios:', error);
      }
    };

    fetchHorarios();
  }, [empleadoId]);

  const handlePreviousWeek = () => {
    setSelectedWeek(prevWeek => prevWeek.clone().subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prevWeek => prevWeek.clone().add(1, 'week'));
  };

  const handleDateChange = (newDate) => {
    setSelectedWeek(moment(newDate).startOf('week'));
  };

  // Filtra los horarios para la semana seleccionada (lunes a domingo)
  const horariosSemana = Array.from({ length: 7 }, (_, i) => {
    const day = selectedWeek.clone().add(i, 'days');
    const horario = horarios.find(h => moment(h.fecha).isSame(day, 'day'));
    return {
      day: day.format('dddd'),
      date: day.format('YYYY-MM-DD'),
      turno: horario ? horario.turno : 'SIN HORARIO',
      horaEntrada: horario ? horario.horaEntrada : { hour: '--', minute: '--' },
      horaSalida: horario ? horario.horaSalida : { hour: '--', minute: '--' }
    };
  });

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center">Mi Horario Semanal</h2>

      {/* Selector de Fecha */}
      <div className="d-flex justify-content-center align-items-center mb-3">
        <Button onClick={handlePreviousWeek} variant="secondary" className="me-2">&lt;</Button>

        <Form.Select
          value={selectedWeek.date()}
          onChange={(e) => handleDateChange(selectedWeek.clone().date(parseInt(e.target.value)))}
          className="me-2"
        >
          {Array.from({ length: selectedWeek.daysInMonth() }, (_, i) => {
            const dayDate = selectedWeek.clone().date(i + 1);
            return (
              <option key={i} value={i + 1}>
                {`${i + 1} - ${dayDate.format('dddd')}`} {/* Muestra día de la semana */}
              </option>
            );
          })}
        </Form.Select>

        <Form.Select
          value={selectedWeek.month()}
          onChange={(e) => handleDateChange(selectedWeek.clone().month(parseInt(e.target.value)))}
          className="me-2"
        >
          {moment.months().map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </Form.Select>

        <Form.Select
          value={selectedWeek.year()}
          onChange={(e) => handleDateChange(selectedWeek.clone().year(parseInt(e.target.value)))}
          className="me-2"
        >
          {Array.from({ length: 5 }, (_, i) => moment().year() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>

        <Button onClick={handleNextWeek} variant="secondary" className="ms-2">&gt;</Button>
      </div>

      {/* Tabla de Horarios Semanal */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Día</th>
            <th>Fecha</th>
            <th>Turno</th>
            <th>Hora Entrada</th>
            <th>Hora Salida</th>
          </tr>
        </thead>
        <tbody>
          {horariosSemana.map((horario, index) => (
            <tr key={index}>
              <td>{horario.day}</td>
              <td>{horario.date}</td>
              <td
                style={{
                  backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' : horario.turno === "TARDE" ? '#2E5B57' : '#ccc',
                  color: 'white'
                }}
              >
                {horario.turno}
              </td>
              <td>{`${horario.horaEntrada.hour}:${horario.horaEntrada.minute}`}</td>
              <td>{`${horario.horaSalida.hour}:${horario.horaSalida.minute}`}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TrabajadorHorarioPage;