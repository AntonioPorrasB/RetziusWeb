import React, { useEffect, useState } from 'react';
import AlumnoCard from './cards/alumnoscards';
import { FaPlus } from 'react-icons/fa';

interface Student {
  id: number;
  nombre: string;
  apellido: string;
  numero_control: string;
  foto_url: string;
}

interface AlumnosComponentProps {
  handleSetActiveView: (view: string) => void;
  onChangeTitle: (newTitle: string) => void;
}

const AlumnosComponent: React.FC<AlumnosComponentProps> = ({ handleSetActiveView, onChangeTitle }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://regzusapi.onrender.com/students/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    fetchStudents();
  }, []);

  // Filtrar estudiantes en base al término de búsqueda
  const filteredStudents = students.filter((student) =>
    `${student.nombre} ${student.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    handleSetActiveView('agregarEstudiante');
    onChangeTitle('Agregar Estudiante');
  };

  return (
    <main className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center" style={{ padding: '2%' }}>
        <h3 style={{ margin: 0 }}>Estudiantes Registrados</h3>
        <button
          className="btn d-flex align-items-center"
          style={{ backgroundColor: '#1abc9c', color: 'white', padding: '1% 2%', border: 'none', borderRadius: '8px' }}
          onClick={handleAddStudent}
        >
          <FaPlus className="me-2" />Nuevo Estudiante
        </button>
      </div>

      {/* Search Bar */}
      <div className="d-flex justify-content-center mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar estudiante..."
          style={{ width: '80%' }}
          value={searchTerm} // Asignar el valor del estado de búsqueda
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el estado de búsqueda
        />
      </div>

      {/* Student Cards */}
      <div className="d-flex flex-wrap gap-4 mt-4">
        {filteredStudents.map((student) => ( // Renderizar estudiantes filtrados
          <div key={student.id} className="col-12 col-md-6">
            <AlumnoCard
              nombre={student.nombre}
              matricula={student.numero_control}
              imagenUrl={student.foto_url}
              apellido={student.apellido}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default AlumnosComponent;
