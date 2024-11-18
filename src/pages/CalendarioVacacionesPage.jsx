import React, { useEffect, useState } from 'react';
import CalendarioVacacionesBase from '../components/CalendarioVacacionesBase';
import api from '../services/api';

const CalendarioVacaciones = ({ recargar }) => {
  const [eventos, setEventos] = useState([]);

  const fetchVacaciones = async () => {
    try {
      // Llamada a la API para obtener las vacaciones
      const response = await api.get('/vacaciones/empleados/nombre');
      
      // Filtramos solo las vacaciones aprobadas
      const vacacionesAprobadas = response.data.filter(vacacion => vacacion.estado === 'APROBADA');
      
      // Formateamos los datos para que el calendario los pueda utilizar correctamente
      const eventosFormateados = vacacionesAprobadas.map(vacacion => ({
        title: `${vacacion.empleadoNombre}`, // Título del evento con el nombre del empleado
        start: new Date(vacacion.fechaInicio), // Fecha de inicio
        end: new Date(vacacion.fechaFin), // Fecha de fin 
        allDay: true, // Define que el evento ocupa todo el día
      }));

      // Actualizamos el estado con los eventos formateados
      setEventos(eventosFormateados);
    } catch (error) {
      console.error('Error al cargar las vacaciones:', error);
    }
  };

  useEffect(() => {
    fetchVacaciones(); // Llama a la función cada vez que `recargar` cambie
  }, [recargar]);

  // Función para contar los eventos que ocurren en la misma semana
  const countEventsInSameWeek = (currentEvent) => {
    const startOfWeek = new Date(currentEvent.start);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Lunes como inicio de semana
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Domingo como fin de semana

    // Contamos los eventos que se superponen con la semana actual
    return eventos.filter(event => 
      (event.start >= startOfWeek && event.start <= endOfWeek) || 
      (event.end >= startOfWeek && event.end <= endOfWeek) ||
      (event.start <= startOfWeek && event.end >= endOfWeek)
    ).length;
  };

  // Configuración del estilo visual de los eventos de vacaciones
  const eventPropGetter = (event) => {
    const eventsInWeek = countEventsInSameWeek(event);

    // Asigna colores en función de la cantidad de eventos en la misma semana
    let backgroundColor = '#2E5B57'; // Default color
    if (eventsInWeek >= 3) {
      backgroundColor = '#b52219'; // Rojo si hay 3 o más personas
    } else if (eventsInWeek === 1) {
      backgroundColor = '#1d7a51'; // Verde si hay solo una persona
    } else if (eventsInWeek === 2) {
      backgroundColor = '#e6a522'; // Amarillo si hay dos personas
    }

    return { style: { backgroundColor } };
  };

  return (
    <div className="container mt-5">
      {/* Renderizamos el componente de calendario con los eventos */}
      <CalendarioVacacionesBase eventos={eventos} eventPropGetter={eventPropGetter} />
    </div>
  );
};

export default CalendarioVacaciones;
