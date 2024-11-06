// HorariosPage.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CalendarioHTimeline from '../components/CalendarioHTimeline'; // Importamos el nuevo componente de Timeline
import { Button } from 'react-bootstrap';

const HorariosPage = () => {
  const [centros, setCentros] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState(null);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await api.get('/horarios/nombres');
        console.log('Datos de horarios recibidos:', response.data);
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

  useEffect(() => {
    console.log('Horarios filtrados para el centro seleccionado:', horariosFiltrados);
  }, [horariosFiltrados]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Horarios</h2>
      <div className="d-flex justify-content-center mb-4">
        {centros.map((centro, index) => (
          <Button
            key={index}
            onClick={() => setCentroSeleccionado(centro)}
            variant={centro === centroSeleccionado ? 'primary' : 'outline-primary'}
            className="mx-1"
          >
            {centro}
          </Button>
        ))}
      </div>
      {centroSeleccionado ? (
        <CalendarioHTimeline horarios={horariosFiltrados} /> // Usamos el nuevo componente de Timeline
      ) : (
        <p className="text-center">Seleccione un centro para ver los horarios</p>
      )}
    </div>
  );
};

export default HorariosPage;

