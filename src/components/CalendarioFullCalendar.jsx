import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

const CalendarioFullCalendar = ({ resources, events }) => {
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedDay, setSelectedDay] = useState(moment().date());
  const calendarRef = useRef(null);

  const handleDateChange = () => {
    const selectedDate = moment([selectedYear, selectedMonth, selectedDay]).startOf('day').toDate();
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(selectedDate);
  };

  useEffect(handleDateChange, [selectedYear, selectedMonth, selectedDay]);

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center mb-3">
        <select 
          value={selectedDay} 
          onChange={(e) => setSelectedDay(Number(e.target.value))} 
          className="form-select me-2"
        >
          {Array.from({ length: moment([selectedYear, selectedMonth]).daysInMonth() }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(Number(e.target.value))} 
          className="form-select me-2"
        >
          {moment.months().map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>

        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))} 
          className="form-select"
        >
          {Array.from({ length: 5 }, (_, i) => moment().year() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[resourceTimelinePlugin, interactionPlugin]}
        initialView="resourceTimelineDay"
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
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
