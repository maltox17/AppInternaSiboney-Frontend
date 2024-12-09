import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Table, Button, Form, Card } from 'react-bootstrap';
import moment from 'moment';
import { getUserInfo } from '../utils/utils';

const TrabajadorHorarioPage = () => {
  const [horarios, setHorarios] = useState([]); 
  const [selectedWeek, setSelectedWeek] = useState(moment().startOf('week')); 
  const empleadoId = getUserInfo(localStorage.getItem('token'))?.id; 

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await api.get(`/horarios/empleado/${empleadoId}`);
        
        setHorarios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error al cargar los horarios:', error);
        setHorarios([]); // En caso de error, inicializamos un array vacío
      }
    };

    if (empleadoId) {
      fetchHorarios();
    } else {
      setHorarios([]); // Si no hay empleadoId, incializamos con un array vacío
    }
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

  // Filtrar y agrupar los horarios para la semana seleccionada
  const horariosSemana = Array.from({ length: 7 }, (_, i) => {
    const day = selectedWeek.clone().add(i, 'days');
    const horariosDia = horarios.filter(h => moment(h.fecha).isSame(day, 'day'));

    if (horariosDia.length > 1) {
      return {
        day: day.format('dddd'),
        date: day.format('DD/MM/YYYY'),
        turno: 'PARTIDO',
        horario: horariosDia.map(h => `${h.horaEntrada} - ${h.horaSalida}`).join(' / '),
        centro: horariosDia.map(h => h.centroNombre).join(' / ')
      };
    }

    if (horariosDia.length === 1) {
      return {
        day: day.format('dddd'),
        date: day.format('DD/MM/YYYY'),
        turno: horariosDia[0].turno,
        horario: `${horariosDia[0].horaEntrada} - ${horariosDia[0].horaSalida}`,
        centro: horariosDia[0].centroNombre
      };
    }

    return {
      day: day.format('dddd'),
      date: day.format('DD/MM/YYYY'),
      turno: 'SIN HORARIO',
      horario: '--:--',
      centro: '--'
    };
  });

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center">Mi Horario Semanal</h2>

      {/* Selector de Fecha */}
      <div className="d-flex justify-content-center align-items-center mb-3">
        <Button onClick={handlePreviousWeek} variant="secondary" className="me-2 bgSecondary">&lt;</Button>

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

        <Button onClick={handleNextWeek} variant="secondary" className="ms-2 bgSecondary">&gt;</Button>
      </div>

      {/* Tabla de Horarios Semanal para pantallas grandes */}
      <div className="d-none d-md-block">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Día</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Horario</th>
              <th>Centro</th>
            </tr>
          </thead>
          <tbody>
            {horariosSemana.map((horario, index) => (
              <tr key={index}>
                <td>{horario.day}</td>
                <td>{horario.date}</td>
                <td
                  style={{
                    backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' :
                      horario.turno === "TARDE" ? '#2E5B57' :
                        horario.turno === "PARTIDO" ? '#FFD700' : '#ccc',
                    color: 'white'
                  }}
                >
                  {horario.turno}
                </td>
                <td>{horario.horario}</td>
                <td>{horario.centro}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Cards para pantallas pequeñas */}
      <div className="d-md-none">
        {horariosSemana.map((horario, index) => (
          <Card className="mb-3" key={index}>
            <Card.Body>
              <Card.Title>{horario.day}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{horario.date}</Card.Subtitle>
              <Card.Text>
                <strong>Turno:</strong>{' '}
                <span
                  style={{
                    backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' :
                      horario.turno === "TARDE" ? '#2E5B57' :
                        horario.turno === "PARTIDO" ? '#FFD700' : '#ccc',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {horario.turno}
                </span>
              </Card.Text>
              <Card.Text>
                <strong>Horario:</strong> {horario.horario}
              </Card.Text>
              <Card.Text>
                <strong>Centro:</strong> {horario.centro}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrabajadorHorarioPage;
