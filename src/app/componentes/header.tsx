
import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Realiza la llamada a la API para obtener los datos del usuario
    const fetchUserName = async () => {
      try {
        //const response = await fetch('http://127.0.0.1:8000/users/me', {
        const response = await fetch('https://regzusapi.onrender.com/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`, // Asumiendo que el token está en la cookie
          },
        });
        const data = await response.json();
        setUserName(data.nombre); // Asignamos el nombre del usuario al estado
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUserName();
  }, []); // El efecto se ejecuta solo una vez, cuando el componente se monta

  return (
    <div
      className="p-3 d-flex justify-content-between align-items-center bg-white shadow-sm"
    >
      <h2 className="m-0" style={{ color: 'black' }}>
        {title} {/* Título dinámico */}
      </h2>
      <div className="d-flex align-items-center">
        <FaBell size={20} className="me-3" style={{ color: 'black' }} />
        <div>
          <h4 className="m-0" style={{ color: 'black' }}>
            {userName || 'Cargando...'} {/* Mostramos el nombre o un texto de carga */}
          </h4>
          <small style={{ color: 'black' }}>Docente</small>
        </div>
      </div>
    </div>
  );
};

export default Header;
