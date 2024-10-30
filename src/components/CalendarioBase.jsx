// CalendarioBase.js
import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configura manualmente el idioma español para moment.js
moment.updateLocale('es', {
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  weekdays: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
});

const localizer = momentLocalizer(moment);

const CalendarioBase = ({ eventos, eventPropGetter }) => {
  return (
    <Calendar
      localizer={localizer}
      events={eventos}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      eventPropGetter={eventPropGetter}
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

export default CalendarioBase;
