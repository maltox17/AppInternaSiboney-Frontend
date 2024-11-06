import React from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

const CalendarioHTimeline = ({ horarios }) => {
  const empleados = Array.from(new Set(horarios.map(horario => horario.empleadoNombre))).map((empleadoNombre, index) => ({
    id: index + 1,
    title: empleadoNombre
  }));

  const items = horarios.map((horario, index) => {
    const startDate = moment(`${horario.fecha}T${horario.horaEntrada}`).toDate();
    const endDate = moment(`${horario.fecha}T${horario.horaSalida}`).toDate();

    return {
      id: index + 1,
      group: empleados.find(empleado => empleado.title === horario.empleadoNombre).id,
      // Usamos moment para formatear las horas en formato HH:mm
      title: `${moment(horario.horaEntrada, 'HH:mm:ss').format('HH:mm')} / ${moment(horario.horaSalida, 'HH:mm:ss').format('HH:mm')}`,
      start_time: startDate,
      end_time: endDate,
      canMove: false,
      canResize: false,
      itemProps: {
        style: {
          backgroundColor: horario.turno === "MAÑANA" ? '#ff9f89' : '#2E5B57',
          color: 'white',
          borderRadius: '4px',
          padding: '5px'
        }
      }
    };
  });

  return (
    <Timeline
      groups={empleados}
      items={items}
      defaultTimeStart={moment().startOf('day').toDate()}
      defaultTimeEnd={moment().endOf('day').toDate()}
      lineHeight={60}
      itemHeightRatio={0.75}
      stackItems
      calendarHeaderStyle={{ backgroundColor: '#2E5B57' }} 
    />
  );
};

export default CalendarioHTimeline;
