import React, { useEffect, useState } from 'react';
import MateriasCard from './cards/materiascard';
import { FaPlus } from 'react-icons/fa';

interface Subject {
  id: number;
  nombre: string;
  descripcion: string;
  horario: string;
}

interface MateriasComponentProps {
  handleSetActiveView: (view: string, subjectId?: number) => void;
  onChangeTitle: (newTitle: string) => void;
}

const MateriasComponent: React.FC<MateriasComponentProps> = ({ handleSetActiveView, onChangeTitle }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('https://regzusapi.onrender.com/subjects/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error al obtener materias:', error);
      }
    };

    fetchSubjects();
  }, []);

  // Filtrar materias según el término de búsqueda
  const filteredSubjects = subjects.filter((subject) =>
    subject.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    handleSetActiveView('agregarMateria');
    onChangeTitle('Agregar Materia');
  };

  // Función para manejar el clic en la tarjeta de materia
  const handleCardClick = (subjectId: number) => {
    handleSetActiveView('modificarMateria', subjectId);
    onChangeTitle('Modificar Materia');
  };

  return (
    <main className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center" style={{ padding: '2%' }}>
        <h3 style={{ margin: 0 }}>Materias Registradas</h3>
        <button
          className="btn d-flex align-items-center"
          style={{ backgroundColor: '#1abc9c', color: 'white', padding: '1% 2%', border: 'none', borderRadius: '8px' }}
          onClick={handleAddSubject}
        >
          <FaPlus className="me-2" />Nueva Materia
        </button>
      </div>

      {/* Search Bar */}
      <div className="d-flex justify-content-center mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar materia..."
          style={{ width: '80%' }}
          value={searchTerm} // Asociar el estado de búsqueda
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el estado de búsqueda
        />
      </div>

      {/* Subject Cards */}
      <div className="d-flex flex-wrap gap-4 mt-4">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="col-12 col-md-6" onClick={() => handleCardClick(subject.id)}>
            <MateriasCard nombre={subject.nombre} horario={subject.horario} />
          </div>
        ))}
      </div>
    </main>
  );
};

export default MateriasComponent;
