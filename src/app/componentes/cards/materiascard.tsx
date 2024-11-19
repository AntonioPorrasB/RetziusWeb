import React from 'react';

interface MateriasCardProps {
  nombre: string;
  horario: string;
}

const MateriasCard: React.FC<MateriasCardProps> = ({ nombre, horario}) => {
  console.log("Datos del alumno:", { nombre, horario}); // Agrega esta línea para verificar
  return (
    <div className="card p-3 shadow-sm rounded-3">
      <div className="d-flex align-items-center">
        <div>
          <h5>{nombre}</h5>
          <p>{horario}</p>
        </div>
      </div>
    </div>
  );
};

export default MateriasCard;
