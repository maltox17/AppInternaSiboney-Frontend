import React, { useEffect, useState } from 'react';
import api from '../services/api';  // Ajusta la ruta de acuerdo a la ubicación del archivo

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await api.get('/empleados');
        setEmpleados(response.data);
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    };

    fetchEmpleados();
  }, []);

  return (
    <div>
      <h1>Lista de Empleados</h1>
      <ul>
        {empleados.map((empleado) => (
          <li key={empleado.id}>{empleado.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default Empleados;
