import React from 'react';
import Image from 'next/image';

interface AlumnoCardProps {
  nombre: string;
  apellido: string;
  matricula: string;
  imagenUrl: string;
}

const AlumnoCard: React.FC<AlumnoCardProps> = ({ nombre, matricula, imagenUrl, apellido }) => {
  console.log("Datos del alumno:", { nombre, matricula, imagenUrl, apellido }); // Agrega esta línea para verificar
  return (
    <div className="card p-3 shadow-sm rounded-3">
      <div className="d-flex align-items-center">
        <Image
          src={imagenUrl}
          alt={nombre}
          style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1%' }}
        />
        <div>
          <h5>{nombre} {apellido}</h5>
          <p>{matricula}</p>
        </div>
      </div>
    </div>
  );
};

export default AlumnoCard;
