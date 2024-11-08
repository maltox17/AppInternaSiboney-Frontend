import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarioFullCalendar = ({ resources, events, selectedDate }) => {
  const calendarRef = useRef(null);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(selectedDate.format('YYYY-MM-DD')); // Centrar en la fecha seleccionada
    }
  }, [selectedDate]);

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
