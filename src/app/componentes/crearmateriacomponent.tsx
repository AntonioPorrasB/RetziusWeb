import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const CrearMateriaComponent: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horario, setHorario] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const subjectData = {
      nombre: nombre,
      descripcion: descripcion,
      horario: horario
    };
  
    console.log('Datos que se están enviando:', subjectData);
  
    try {
      //const response = await fetch('http://127.0.0.1:8000/subjects/', {
      const response = await fetch('https://regzusapi.onrender.com/subjects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica que los datos se envían como JSON
          'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
        },
        body: JSON.stringify(subjectData), // Convertir el objeto a JSON
      });
  
      if (response.ok) {
        setMessage('Materia creada con éxito');
      } else {
        const errorData = await response.json();
        console.log('Error completo:', errorData);  // Para ver detalles
        setMessage(`Error: ${errorData.detail || 'No se pudo crear la materia'}`);
      }
    } catch (error) {
      setMessage('Error al crear la materia');
    }
  };

  return (
    <section className="container mt-4" style={{ backgroundColor: 'white', padding: '5%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ marginBottom: '2%' }}>Registrar Materia</h3>
      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="btn btn-primary d-flex align-items-center" style={{ padding: '2% 5%', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', transition: '0.3s' }}>
          <FaCheckCircle className="me-2" /> Guardar Materia
        </button>
      </form>

      {message && <p style={{ marginTop: '2%', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </section>
  );
};

export default CrearMateriaComponent;
