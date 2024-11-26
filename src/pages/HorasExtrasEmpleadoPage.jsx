import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import api from '../services/api';
import { getUserInfo } from '../utils/utils';

const HorasExtrasEmpleadoPage = () => {
  const [horasExtras, setHorasExtras] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHorasExtras = async () => {
      try {
        const userInfo = getUserInfo(localStorage.getItem('token')); 
        const response = await api.get(`/horasExtrasDeuda/empleado/${userInfo.id}`); 
        setHorasExtras(response.data);
      } catch (error) {
        console.error('Error al obtener las horas extras del empleado:', error);
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchHorasExtras();
  }, []);


  return (
    <Container className="mt-5">
      <h2 className="text-center">Tus Horas Extras y Deudas</h2>
      {horasExtras ? (
        horasExtras.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center mt-4">
            {horasExtras.map((registro) => (
              <Card key={registro.id} style={{ width: '18rem', margin: '1rem' }}>
                <Card.Body>
                  <Card.Text>
                    <strong>Horas a Favor:</strong> {registro.horasExtras}H
                  </Card.Text>
                  <Card.Text>
                    <strong>Horas a Deber:</strong> {registro.horasDeuda}H
                  </Card.Text>
                  <Card.Text>
                    <strong>Total:</strong>{' '}
                    {registro.horasExtras - registro.horasDeuda > 0
                      ? `tienes a favor: ${registro.horasExtras - registro.horasDeuda}H`
                      : `debes: ${Math.abs(registro.horasExtras - registro.horasDeuda)}H`}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center mt-5">Sin registros.</div>
        )
      ) : (
        <div className="text-center mt-5">Sin registros.</div>
      )}
    </Container>
  );
};

export default HorasExtrasEmpleadoPage;
