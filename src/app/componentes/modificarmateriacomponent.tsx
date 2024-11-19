import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTrash, FaUserPlus } from 'react-icons/fa';

interface ModificarMateriaComponentProps {
  subjectId: number;
  handleSetActiveView: (view: string, subjectId?: number) => void;
  onChangeTitle: (newTitle: string) => void;
}

const ModificarMateriaComponent: React.FC<ModificarMateriaComponentProps> = ({ subjectId, handleSetActiveView, onChangeTitle }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horario, setHorario] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        //const response = await fetch(`http://127.0.0.1:8000/subjects/${subjectId}`, {
        const response = await fetch(`https://regzusapi.onrender.com/subjects/${subjectId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
          },
        });
        if (!response.ok) throw new Error('No se pudo cargar la materia');

        const data = await response.json();
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setHorario(data.horario);
      } catch (error) {
        console.error('Error al cargar materia:', error);
      }
    };

    fetchSubject();
  }, [subjectId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const subjectData = { nombre, descripcion, horario };

    try {
      //const response = await fetch(`http://127.0.0.1:8000/subjects/${subjectId}`, {
      const response = await fetch(`https://regzusapi.onrender.com/subjects/${subjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
        },
        body: JSON.stringify(subjectData),
      });
      if (response.ok) {
        setMessage('Materia actualizada con éxito');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail || 'No se pudo actualizar la materia'}`);
      }
    } catch{
      setMessage('Error al actualizar la materia');
    }
  };

  const handleDelete = async () => {
    try {
      //const response = await fetch(`http://127.0.0.1:8000/subjects/${subjectId}`, {
      const response = await fetch(`https://regzusapi.onrender.com/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
        },
      });
      if (response.ok) {
        setMessage('Materia eliminada con éxito');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail || 'No se pudo eliminar la materia'}`);
      }
    } catch{
      setMessage('Error al eliminar la materia');
    }
  };

  const handleMatricularAlumno = () => {
    handleSetActiveView('matricularEstudiante', subjectId);
    onChangeTitle('Matricular Estudiante');
  };

  return (
    <section className="container mt-4" style={{ backgroundColor: 'white', padding: '5%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ marginBottom: '2%' }}>Modificar Materia</h3>
      <form onSubmit={handleUpdate}>
        <div className="form-group" style={{ marginBottom: '5%' }}>
          <label htmlFor="nombre">Nombre</label>
          <input type="text" id="nombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div className="form-group" style={{ marginBottom: '5%' }}>
          <label htmlFor="descripcion">Descripción</label>
          <input type="text" id="descripcion" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </div>

        <div className="form-group" style={{ marginBottom: '5%' }}>
          <label htmlFor="horario">Horario</label>
          <input type="text" id="horario" className="form-control" value={horario} onChange={(e) => setHorario(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary d-flex align-items-center" style={{ marginRight: '1rem', padding: '2% 5%', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
          <FaCheckCircle className="me-2" /> Guardar Cambios
        </button>

        <button type="button" onClick={handleDelete} className="btn btn-danger d-flex align-items-center" style={{ marginRight: '1rem', padding: '2% 5%', borderRadius: '8px' }}>
          <FaTrash className="me-2" /> Eliminar Materia
        </button>

        <button type="button" onClick={handleMatricularAlumno} className="btn btn-secondary d-flex align-items-center" style={{ padding: '2% 5%', borderRadius: '8px' }}>
          <FaUserPlus className="me-2" /> Matricular Alumno
        </button>
      </form>

      {message && <p style={{ marginTop: '2%', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </section>
  );
};

export default ModificarMateriaComponent;
