import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';

const MateriasActivCard: React.FC = () => {
  const [materiasCount, setMateriasCount] = useState<number>(0);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        //const response = await fetch('http://127.0.0.1:8000/subjects/', {
        const response = await fetch('https://regzusapi.onrender.com/subjects/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`, // Token desde las cookies
          },
        });
        if (!response.ok) {
          throw new Error('Error en la solicitud'); // Manejo de errores de respuesta
        }
        const data = await response.json();
        setMateriasCount(data.length || 0); // Aseguramos que siempre haya un número
      } catch (error) {
        console.error('Error al obtener materias:', error);
        setMateriasCount(0); // Mantenemos en 0 en caso de error
      }
    };

    fetchMaterias();
  }, []); // Ejecuta solo al montar el componente

  return (
    <div className="card p-3 shadow-sm rounded-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="card-content">
          <h3>{materiasCount}</h3>
          <p>Materias Activas</p>
        </div>
        <FaBook size={40} className="fs-3" style={{ color: '#1abc9c' }} />
      </div>
    </div>
  );
};

export default MateriasActivCard;
