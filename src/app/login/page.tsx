'use client'
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const router = useRouter();

  // Función para manejar el inicio de sesión
  const handleLogin = async (username: string, password: string) => {
    try {
      // Solicitar inicio de sesión en el backend
      //const loginResponse = await fetch('http://127.0.0.1:8000/login', {
      const loginResponse = await fetch('https://regzusapi.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: username,
          contraseña: password,
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.detail || 'Error en el inicio de sesión');
      }

      // Obtener el token tras un login exitoso
      //const tokenResponse = await fetch('http://127.0.0.1:8000/token', {
      const tokenResponse = await fetch('https://regzusapi.onrender.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
        credentials: 'include',
      });

      if (!tokenResponse.ok) {
        throw new Error('Error al obtener el token');
      }

      const data = await tokenResponse.json();
      // Guardar el token en cookies

      console.log('Respuesta del servidor:', data);
      const cookies = document.cookie;
      console.log('Cookies después del login:', cookies);
      if (!cookies.includes('token=')) {
        Cookies.set('token', data.access_token, { expires: 7, secure: false, sameSite: 'Lax', httponly: false, domain: "localhost" });
        console.log('Cookie establecida manualmente');
      }
      // Redirigir al perfil del usuario
      router.push('/');
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      alert('Error iniciando sesión: ' + error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(formData.username, formData.password);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 flex-wrap"
      style={{
        backgroundColor: "#1e1e2f",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        className="text-center mx-auto"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          margin: "20px",
        }}
      >
        <h2>Iniciar Sesión</h2>
        <p style={{ fontSize: "14px", color: "#bdbdbd", marginBottom: "20px" }}>
          Bienvenido de nuevo, por favor ingresa tus credenciales
        </p>
        <form onSubmit={handleSubmit}>
          <div
            className="d-flex align-items-center mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <i className="fas fa-user" style={{ color: "#1abc9c", marginRight: "10px" }} />
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              required
              value={formData.username}
              onChange={handleChange}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "16px",
                width: "100%",
              }}
            />
          </div>
          <div
            className="d-flex align-items-center mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <i className="fas fa-lock" style={{ color: "#1abc9c", marginRight: "10px" }} />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              value={formData.password}
              onChange={handleChange}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "16px",
                width: "100%",
              }}
            />
          </div>
          <div className="text-end mb-3">
            <a href="#" style={{ color: "#1abc9c", fontSize: "12px", textDecoration: "none" }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#1abc9c",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16a085")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1abc9c")}
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-3">
          <p>
            ¿No tienes una cuenta?{" "}
            <a href="/register" style={{ color: "#1abc9c", textDecoration: "none" }}>
              Regístrate
            </a>
          </p>
        </div>
      </div>
      <div
        className="text-center mx-auto"
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "20px",
        }}
      >
        <h1 style={{ fontSize: "48px" }}>Sistema SaaS</h1>
        <p
          style={{
            fontSize: "16px",
            color: "#bdbdbd",
            marginTop: "10px",
            animation: "fadeIn 2s infinite alternate",
          }}
        >
          Gestión y Pase de Lista Automatizado
        </p>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0.6;
          }
          to {
            opacity: 1;
          }
        }

        @media (min-width: 992px) {
          .d-flex {
            flex-direction: row !important;
          }
        }

        @media (max-width: 991px) {
          .d-flex {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
