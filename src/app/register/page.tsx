'use client';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    contraseña: '',
    confirmarContraseña: '',
  });
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Verificar si las contraseñas coinciden
    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      //const response = await fetch('http://127.0.0.1:8000/register', {
        const response = await fetch('https://regzusapi.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          usuario: formData.usuario,
          contraseña: formData.contraseña,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.detail || 'Error desconocido');
        alert(errorData.detail || 'Error registrando usuario');
        return;
      }

      const data = await response.json();
      console.log('Éxito:', data);
      alert('¡Cuenta creada exitosamente!');
      router.push('/login');
    } catch (error) {
      console.error('Error registrando usuario:', error);
      alert('Error registrando usuario');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#1e1e2f', color: 'white' }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{
          width: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2>Crear Cuenta</h2>
        <p style={{ fontSize: '14px', color: '#bdbdbd', marginBottom: '20px' }}>
          Ingresa tus datos para registrarte en el sistema
        </p>
        <form onSubmit={handleSubmit}>
          <div
            className="d-flex align-items-center mb-3"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <i className="fas fa-user" style={{ color: '#1abc9c', marginRight: '10px' }}></i>
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '16px',
                width: '100%',
              }}
            />
          </div>
          <div
            className="d-flex align-items-center mb-3"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <i className="fas fa-user" style={{ color: '#1abc9c', marginRight: '10px' }}></i>
            <input
              type="text"
              placeholder="Usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '16px',
                width: '100%',
              }}
            />
          </div>
          <div
            className="d-flex align-items-center mb-3"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <i className="fas fa-lock" style={{ color: '#1abc9c', marginRight: '10px' }}></i>
            <input
              type="password"
              placeholder="Contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '16px',
                width: '100%',
              }}
            />
          </div>
          <div
            className="d-flex align-items-center mb-3"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <i className="fas fa-lock" style={{ color: '#1abc9c', marginRight: '10px' }}></i>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              required
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '16px',
                width: '100%',
              }}
            />
          </div>
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              backgroundColor: '#1abc9c',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            Registrarse
          </button>
        </form>
        <div className="mt-3">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" style={{ color: '#1abc9c', textDecoration: 'none' }}>
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
