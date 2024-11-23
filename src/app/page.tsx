'use client'
import React, { useState } from "react";
import Sidebar from "./componentes/sidebar";
import Header from "./componentes/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import InicioComponent from "./componentes/iniciocomponent";
import AlumnosComponent from "./componentes/alumnoscomponent";
import CrearAlumnoComponent from "./componentes/crearalumnocomponent";
import MateriasComponent from "./componentes/materiascomponent";
import CrearMateriaComponent from "./componentes/crearmateriacomponent";
import ModificarMateriaComponent from "./componentes/modificarmateriacomponent"; // Importa el nuevo componente
import MatricularComponent from "./componentes/matricularcomponent";
import ProfilePage from "./componentes/perfilcomponent";
import AsistenciasMateriaComponent from "./componentes/asistenciasmateriacomponent";

export default function Home() {
  const [title, setTitle] = useState('Inicio');
  const [activeView, setActiveView] = useState('inicio'); // Estado para manejar la vista activa
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null); // Estado para el ID de la materia seleccionada

  // Función para cambiar el título
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  // Función para cambiar la vista activa y el título
  const handleSetActiveView = (view: string, subjectId?: number) => {
    setActiveView(view);
    setSelectedSubjectId(subjectId || null); // Guarda el subjectId si se proporciona

    // Cambiar el título en función de la vista activa
    const viewTitles: Record<string, string> = {
      inicio: 'Inicio',
      estudiantes: 'Estudiantes',
      agregarEstudiante: 'Agregar Estudiante',
      perfil: 'Perfil',
      materias: 'Materias',
      configuracion: 'Configuración',
      logout: 'Cerrar Sesión',
      modificarMateria: 'Modificar Materia',
      matricularEstudiante: 'Matricular Estudiante',
      asistencias: 'Asistencias'
    };

    setTitle(viewTitles[view] || ''); // Cambia el título según el valor de `view`
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#f4f4f9' }}>
      {/* Sidebar */}
      <Sidebar onChangeTitle={handleTitleChange} onSetActiveView={handleSetActiveView} />

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          marginLeft: '20%', // Deja espacio para el sidebar
          width: 'calc(100% - 20%)', // Ocupa el espacio restante
          padding: '1%'
        }}
      >
        {/* Header */}
        <Header title={title} />

        {/* Renderizar contenido según la vista activa */}
        {activeView === 'inicio' && (
          <div className="mt-4">
            <InicioComponent />
          </div>
        )}

        {activeView === 'estudiantes' && (
          <div className="mt-4">
            <AlumnosComponent handleSetActiveView={handleSetActiveView} onChangeTitle={handleTitleChange} />
          </div>
        )}

        {activeView === 'agregarEstudiante' && (
          <div className="mt-4">
            <CrearAlumnoComponent />
          </div>
        )}

        {activeView === 'materias' && (
          <div className="mt-4">
            <MateriasComponent handleSetActiveView={handleSetActiveView} onChangeTitle={handleTitleChange} />
          </div>
        )}

        {activeView === 'agregarMateria' && (
          <div className="mt-4">
            <CrearMateriaComponent />
          </div>
        )}

        {activeView === 'modificarMateria' && selectedSubjectId !== null && (
          <div className="mt-4">
            <ModificarMateriaComponent handleSetActiveView={handleSetActiveView} onChangeTitle={handleTitleChange} subjectId={selectedSubjectId} /> {/* Renderiza ModificarMateriaComponent con el ID */}
          </div>
        )}

        {activeView === 'matricularEstudiante' && selectedSubjectId !== null && (
          <div className="mt-4">
            <MatricularComponent subjectId={selectedSubjectId}/>
          </div>
        )}

       {activeView === 'perfil' && (
          <div className="mt-4">
            <ProfilePage />
          </div>
        )}

       {activeView === 'asistencias' && selectedSubjectId !== null && (
          <div className="mt-4">
            <AsistenciasMateriaComponent subjectId={selectedSubjectId}/>
          </div>
        )} 

        {/* Puedes agregar otros componentes según la vista activa */}
      </div>
    </div>
  );
}
