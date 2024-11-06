import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarioHBase.css';

const localizer = momentLocalizer(moment);

const CalendarioHBase = ({ horarios }) => {
  const eventosFormateados = horarios.map(horario => {
    // Creamos fechas completas para el inicio y fin del evento usando fecha, horaEntrada y horaSalida
    const startDate = new Date(`${horario.fecha}T${horario.horaEntrada}`);
    const endDate = new Date(`${horario.fecha}T${horario.horaSalida}`);

    return {
      title: `${horario.empleadoNombre} (${horario.turno})`,
      start: startDate,
      end: endDate,
      allDay: false, // Esto indica que el evento no es "todo el día"
      resource: horario
    };
  });

  const eventPropGetter = (event) => {
    // Cambiamos el color de fondo según el turno
    const backgroundColor = event.resource.turno === "MAÑANA" ? '#ff9f89' : '#2E5B57';
    return { style: { backgroundColor } };
  };

  return (
    <Calendar
      localizer={localizer}
      events={eventosFormateados}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      eventPropGetter={eventPropGetter}
      popup
      messages={{
        today: 'Hoy',
        previous: 'Anterior',
        next: 'Siguiente',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
        noEventsInRange: 'No hay eventos en este rango',
        allDay: 'Todo el día',
        showMore: total => `+ Ver más (${total})`
      }}
    />
  );
};

export default CalendarioHBase;
