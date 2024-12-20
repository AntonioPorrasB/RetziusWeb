import React from 'react';
import MateriasActivCard from './cards/materiasactivcard';
import AlumnosRegisCard from './cards/alumnosregiscard';

interface inicioProps {
  handleSetActiveView: (newTitle: string) => void;
  onChangeTitle: (view: string) => void; // Nueva función para cambiar la vista activa
}

const InicioComponent: React.FC<inicioProps> = ({ handleSetActiveView, onChangeTitle }) => {

  const handleClickMaterias = () => {
    handleSetActiveView('materias');
    onChangeTitle('Materias');  // Cambiar la vista activa al hacer clic
  };

  const handleClickEstudiantes = () => {
    handleSetActiveView('estudiantes');
    onChangeTitle('Estudiantes');  // Cambiar la vista activa al hacer clic
  };


  return (
    <div className="d-flex flex-wrap gap-5" style={{marginLeft:'5%', paddingBottom:'16%'}}>
      <div className="col-12 col-md-5" style={{marginRight:'8%'}} onClick={handleClickMaterias}>
        <MateriasActivCard/>
      </div>
      <div className="col-12 col-md-5" onClick={handleClickEstudiantes}>
        <AlumnosRegisCard />
      </div>
      <div className="mt-5">
          <h4>Resumen General</h4>
          <p> Bienvenido al sistema de gestión de pases de lista. Explora tus opciones. </p>
       </div>
    </div>
  );
};

export default InicioComponent;
