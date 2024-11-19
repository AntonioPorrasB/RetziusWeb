import React from 'react';
import MateriasActivCard from './cards/materiasactivcard';
import AlumnosRegisCard from './cards/alumnosregiscard';

const InicioComponent = () => {
  return (
    <div className="d-flex flex-wrap gap-5" style={{marginLeft:'5%', paddingBottom:'16%'}}>
      <div className="col-12 col-md-5" style={{marginRight:'8%'}}>
        <MateriasActivCard />
      </div>
      <div className="col-12 col-md-5">
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
