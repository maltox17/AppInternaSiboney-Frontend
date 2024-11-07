import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CalendarioFullCalendar from '../components/CalendarioFullCalendar';
import { Button } from 'react-bootstrap';
import moment from 'moment';

const HorariosPage = () => {
  const [centros, setCentros] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState(null);

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

  const horariosFiltrados = centroSeleccionado
    ? horarios.filter(horario => horario.centroNombre === centroSeleccionado)
    : [];

  const resources = [...new Set(horariosFiltrados.map(h => h.empleadoNombre))].map((empleadoNombre, index) => ({
    id: String(index + 1),
    title: empleadoNombre
  }));

  const events = horariosFiltrados.map((horario, index) => {
    const startDate = moment(`${horario.fecha}T${horario.horaEntrada}`).format();
    const endDate = moment(`${horario.fecha}T${horario.horaSalida}`).format();

    return {
      id: String(index + 1),
      resourceId: resources.find(resource => resource.title === horario.empleadoNombre).id,
      title: `${moment(horario.horaEntrada, 'HH:mm:ss').format('HH:mm')} - ${moment(horario.horaSalida, 'HH:mm:ss').format('HH:mm')}`,
      start: startDate,
      end: endDate,
      backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' : '#2E5B57'
    };
  });

  return (
    <div className="container mt-3 mb-3">
      <h2 className="text-center">Horarios</h2>
      <div className="d-flex justify-content-center mb-4">
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
      {centroSeleccionado ? (
        <CalendarioFullCalendar resources={resources} events={events} />
      ) : (
        <p className="text-center">Seleccione un centro para ver los horarios</p>
      )}
    </div>
  );
};

export default HorariosPage;
