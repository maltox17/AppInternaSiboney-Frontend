import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Configuración del idioma en español para moment con inicio de semana en lunes
moment.updateLocale('es', {
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  weekdays: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  week: {
    dow: 1, // Define el lunes como el primer día de la semana
  }
});

//Configuramos a moment nuestra ubicacion
const localizer = momentLocalizer(moment);

const CustomToolbar = ({ date, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(date);

  // Función para manejar el cambio de mes
  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value, 10);
    const newDate = new Date(currentDate.getFullYear(), month, 1);
    setCurrentDate(newDate);
    onNavigate('date', newDate);
  };

  // Función para manejar el cambio de año
  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    const newDate = new Date(year, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    onNavigate('date', newDate);
  };

  // Función para avanzar o retroceder un mes
  const navigateMonth = (direction) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1
    );
    setCurrentDate(newDate);
    onNavigate('date', newDate);
  };

  return (
    <div className="rbc-toolbar d-flex justify-content-center align-items-center">
      {/* Botón de anterior */}
      <button onClick={() => navigateMonth(-1)} className="btn">
        <FaChevronLeft />
      </button>

      {/* Selectores de mes y año */}
      <div className="rbc-toolbar-label d-flex justify-content-center">
        <select onChange={handleMonthChange} value={currentDate.getMonth()} className="calendar-selector mx-2 urderline text-black">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{moment().month(i).format("MMMM")}</option>
          ))}
        </select>

        <select onChange={handleYearChange} value={currentDate.getFullYear()} className="calendar-selector mx-2 urderline text-black">
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={year} value={year}>{year}</option>
            );
          })}
        </select>
      </div>

      {/* Botón de siguiente */}
      <button onClick={() => navigateMonth(1)} className="btn btn-link">
        <FaChevronRight />
      </button>
    </div>
  );
};

const CalendarioVacacionesBase = ({ eventos, eventPropGetter }) => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 642, marginBottom: 30 }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        eventPropGetter={eventPropGetter}
        components={{
          toolbar: CustomToolbar, // Usamos el Toolbar personalizado
        }}
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
    </div>
  );
};

export default CalendarioVacacionesBase;
