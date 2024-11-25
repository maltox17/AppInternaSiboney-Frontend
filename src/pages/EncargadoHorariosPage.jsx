import React, { useEffect, useState } from 'react';
import {getCentroEncId, getUserInfo } from '../utils/utils';
import HorariosBase from '../components/HorariosBase';

const EncargadoHorariosPage = () => {

  const [centroId, setCentroId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchCentro = async () => {
      const userInfo = getUserInfo(token); 
      const centro = await getCentroEncId(userInfo.id); 
      
      if (centro) {
        setCentroId(centro); 
      }
    };

    fetchCentro();
  }, []);

  return centroId ? <HorariosBase role="encargado" centroId={centroId} /> : null;
};

export default EncargadoHorariosPage;
