import React, { useEffect, useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';


const AlumnosRegisCard: React.FC = () => {
  const [alumnosCount, setAlumnosCount] = useState<number>(0);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        //const response = await fetch('http://127.0.0.1:8000/students/', {
        const response = await fetch('https://regzusapi.onrender.com/students/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`, // Token desde las cookies
          },
        });
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        setAlumnosCount(data.length || 0); // Asegura que siempre haya un número
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        setAlumnosCount(0); // Mantenemos en 0 en caso de error
      }
    };

    fetchAlumnos();
  }, []); // Ejecuta solo al montar el componente

  return (
    <div className="card p-3 shadow-sm rounded-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="card-content">
          <h3>{alumnosCount}</h3>
          <p>Estudiantes Registrados</p>
        </div>
        <FaUserFriends size={40} className="fs-3" style={{ color: '#1abc9c' }} />
      </div>
    </div>
  );
};

export default AlumnosRegisCard;
