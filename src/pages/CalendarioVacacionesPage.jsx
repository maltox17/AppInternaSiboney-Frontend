// CalendarioVacaciones.js
import React, { useEffect, useState } from 'react';
import CalendarioBase from '../components/CalendarioBase';
import api from '../services/api';

const CalendarioVacaciones = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchVacaciones = async () => {
      try {
        const response = await api.get('/vacaciones');
        const vacacionesAprobadas = response.data.filter(vacacion => vacacion.estado === 'APROBADA');

        const eventosFormateados = vacacionesAprobadas.map(vacacion => ({
          title: `Vacaciones - ${vacacion.empleadoNombre}`,
          start: new Date(vacacion.fechaInicio),
          end: new Date(vacacion.fechaFin),
          allDay: true,
        }));

        setEventos(eventosFormateados);
      } catch (error) {
        console.error('Error al cargar las vacaciones:', error);
      }
    };

    fetchVacaciones();
  }, []);

  // Configuración del estilo de los eventos de vacaciones
  const eventPropGetter = (event) => {
    const backgroundColor = '#ff9f89';
    return { style: { backgroundColor } };
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Calendario de Vacaciones</h2>
      <CalendarioBase eventos={eventos} eventPropGetter={eventPropGetter} />
    </div>
  );
};

export default CalendarioVacaciones;
