import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const CrearAlumnoComponent: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [numeroControl, setNumeroControl] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foto) {
      setMessage('Por favor, selecciona una foto.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('numero_control', numeroControl);
    formData.append('photo', foto); // Campo esperado por tu API para la foto

    try {
      //const response = await fetch('http://127.0.0.1:8000/students/', {
      const response = await fetch('https://regzusapi.onrender.com/students/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${document.cookie.split('token=')[1]}`,
        },
      });

      if (response.ok) {
        setMessage('Estudiante creado con éxito');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch{
      setMessage('Error al crear el estudiante');
    }
  };

  return (
    <section className="container mt-4" style={{ backgroundColor: 'white', padding: '5%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ marginBottom: '2%' }}>Registrar Estudiante</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '5%' }}>
          <label htmlFor="nombre">Nombre</label>
          <input type="text" id="nombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div className="form-group" style={{ marginBottom: '5%' }}>
          <label htmlFor="apellido">Apellidos</label>
          <input type="text" id="apellido" className="form-control" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        </div>

        <div className="form-group" style={{ marginBottom: '5%' }}>
          <label htmlFor="numero-control">Número de Control</label>
          <input type="text" id="numero-control" className="form-control" value={numeroControl} onChange={(e) => setNumeroControl(e.target.value)} required />
        </div>

        <div className="form-group" style={{ marginBottom: '5%' }}>
          <label htmlFor="foto">Subir Foto</label>
          <input type="file" id="foto" name="foto" accept="image/*" className="form-control" onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)} required />
        </div>

        <button type="submit" className="btn btn-primary d-flex align-items-center" style={{ padding: '2% 5%', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', transition: '0.3s' }}>
          <FaCheckCircle className="me-2" /> Guardar Estudiante
        </button>
      </form>

      {message && <p style={{ marginTop: '2%', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </section>
  );
};

export default CrearAlumnoComponent;
