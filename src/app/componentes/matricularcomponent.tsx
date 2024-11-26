import React, { useEffect, useState } from 'react';
import AlumnoCard from './cards/alumnoscards';

interface Student {
  id: number;
  nombre: string;
  apellido: string;
  numero_control: string;
  foto_url: string;
}

interface MatricularComponentProps {
  subjectId: number;
}

const MatricularComponent: React.FC<MatricularComponentProps> = ({ subjectId }) => {
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [nonEnrolledStudents, setNonEnrolledStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        //const response = await fetch(`http://127.0.0.1:8000/subjects/${subjectId}/enrollments/`, {
        const response = await fetch(`https://regzusapi.onrender.com/subjects/${subjectId}/enrollments/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        }); 
        if (!response.ok) {
          throw new Error('Error al obtener las matrículas');
        }

        const enrolled = await response.json();

        // Supongamos que hay otro endpoint para obtener todos los estudiantes
        //const allStudentsResponse = await fetch('http://127.0.0.1:8000/students/', {
        const allStudentsResponse = await fetch('https://regzusapi.onrender.com/students/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        });
        if (!allStudentsResponse.ok) {
          throw new Error('Error al obtener estudiantes');
        }
        const allStudents = await allStudentsResponse.json();

        // Dividir entre matriculados y no matriculados
        const nonEnrolled = allStudents.filter(
          (student: Student) => !enrolled.some((e: Student) => e.id === student.id)
        );

        setEnrolledStudents(enrolled);
        setNonEnrolledStudents(nonEnrolled);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchStudents();
  }, [subjectId]);

  const handleMatricular = async (studentId: number) => {
    try {
      //const response = await fetch(`http://127.0.0.1:8000/subjects/${subjectId}/enrollments/`, {
      const response = await fetch(`https://regzusapi.onrender.com/subjects/${subjectId}/enrollments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al matricular al estudiante');
      }

      const newEnrollment = await response.json();
      console.log('Estudiante matriculado:', newEnrollment);

      // Actualizar las listas
      const student = nonEnrolledStudents.find((s) => s.id === studentId);
      if (student) {
        setNonEnrolledStudents(nonEnrolledStudents.filter((s) => s.id !== studentId));
        setEnrolledStudents([...enrolledStudents, student]);
      }
    } catch (error) {
      console.error('Error al matricular estudiante:', error);
    }
  };

  const handleDeleteMatricula = async (studentId: number) => {
    try {
      const response = await fetch(
        `https://regzusapi.onrender.com/subjects/${subjectId}/enrollments/${studentId}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al desmatricular al estudiante');
      }
  
      console.log(`Estudiante con ID ${studentId} desmatriculado.`);
  
      // Actualizar las listas
      const student = enrolledStudents.find((s) => s.id === studentId);
      if (student) {
        setEnrolledStudents(enrolledStudents.filter((s) => s.id !== studentId));
        setNonEnrolledStudents([...nonEnrolledStudents, student]);
      }
    } catch (error) {
      console.error('Error al desmatricular estudiante:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEnrolledStudents = enrolledStudents.filter((student) =>
    `${student.nombre} ${student.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center" style={{ padding: '2%' }}>
        <h3 style={{ margin: 0 }}>Matricular Estudiante</h3>
      </div>

      {/* Section: Alumnos No Matriculados */}
      <h5 className="mt-4">Alumnos No Matriculados</h5>
      <div className="d-flex flex-wrap gap-4 mt-2">
        {nonEnrolledStudents.map((student) => (
          <div
            key={student.id}
            className="col-12 col-md-6"
            onClick={() => handleMatricular(student.id)}
            style={{ cursor: 'pointer' }}
          >
            <AlumnoCard
              nombre={student.nombre}
              matricula={student.numero_control}
              imagenUrl={student.foto_url}
              apellido={student.apellido}
            />
          </div>
        ))}
      </div>

      {/* Section: Alumnos Matriculados */}
      <h5 className="mt-5">Alumnos Matriculados</h5>
      <div className="d-flex justify-content-center mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar alumno matriculado..."
          style={{ width: '80%' }}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="d-flex flex-wrap gap-4 mt-2">
        {filteredEnrolledStudents.map((student) => (
          <div key={student.id} className="col-12 col-md-6" onClick={() => handleDeleteMatricula(student.id)} style={{ cursor: 'pointer' }}>
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

export default MatricularComponent;
