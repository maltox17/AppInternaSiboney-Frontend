import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

const CalendarioFullCalendar = ({ horarios }) => {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedDay, setSelectedDay] = useState(moment().date());
  const calendarRef = useRef(null); // Ref para acceder a la instancia del calendario

  useEffect(() => {
    // Mapea los empleados como recursos
    const uniqueEmpleados = [...new Set(horarios.map(horario => horario.empleadoNombre))];
    const resourcesData = uniqueEmpleados.map((empleadoNombre, index) => ({
      id: String(index + 1),
      title: empleadoNombre
    }));
    setResources(resourcesData);

    // Mapea los horarios como eventos
    const eventsData = horarios.map((horario, index) => {
      const startDate = moment(`${horario.fecha}T${horario.horaEntrada}`).format();
      const endDate = moment(`${horario.fecha}T${horario.horaSalida}`).format();

      return {
        id: String(index + 1),
        resourceId: resourcesData.find(resource => resource.title === horario.empleadoNombre).id,
        title: `${moment(horario.horaEntrada, 'HH:mm:ss').format('HH:mm')} - ${moment(horario.horaSalida, 'HH:mm:ss').format('HH:mm')}`,
        start: startDate,
        end: endDate,
        backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' : '#2E5B57',
        borderColor: '#000',
        textColor: 'white'
      };
    });
    setEvents(eventsData);
  }, [horarios]);

  const handleDateChange = () => {
    // Ajusta la visualización de FullCalendar al día seleccionado
    const selectedDate = moment([selectedYear, selectedMonth, selectedDay]).startOf('day').toDate();
    const calendarApi = calendarRef.current.getApi(); // Accede a la instancia del calendario
    calendarApi.gotoDate(selectedDate); // Cambia la fecha del calendario
  };

  useEffect(handleDateChange, [selectedYear, selectedMonth, selectedDay]);

  return (
    <div>
      <FullCalendar
        ref={calendarRef} 
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        initialView="resourceTimelineDay"
        headerToolbar={{
          left: 'prev',
          center: 'title', 
          right: 'next'
        }}
        resources={resources}
        events={events}
        editable={false} 
        height="auto"
        locale="es"
        slotMinTime="08:00:00"
        slotMaxTime="23:30:00"
        resourceAreaHeaderContent="Empleados" 
        resourceAreaWidth="150px" 
      />
    </div>
  );
};

export default CalendarioFullCalendar;


