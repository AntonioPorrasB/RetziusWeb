import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    nombre: '',
    usuario: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = async () => {
    const token = Cookies.get('token');
    try {
      //const response = await fetch('http://127.0.0.1:8000/update/me', {
      const response = await fetch('https://regzusapi.onrender.com/update/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: user.nombre,
          usuario: user.usuario,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos del usuario');
      }

      alert('Datos actualizados exitosamente');
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Hubo un error al actualizar los datos');
    }
  };

  const handlePasswordUpdate = async () => {
    const token = Cookies.get('token');

    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert('Las nuevas contraseñas no coinciden');
    }

    try {
      //const response = await fetch('http://127.0.0.1:8000/update_password', {
      const response = await fetch('https://regzusapi.onrender.com/update_password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
          confirm_password: passwords.confirmPassword
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la contraseña');
      }

      alert('Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Hubo un error al actualizar la contraseña');
    }
  };

  const fetchUserData = async () => {
    const token = Cookies.get('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      //const response = await fetch('http://127.0.0.1:8000/users/me', {
      const response = await fetch('https://regzusapi.onrender.com/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
        }
        throw new Error('Error al obtener los datos del usuario');
      }

      const data = await response.json();
      setUser({
        nombre: data.nombre,
        usuario: data.usuario
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="container mt-5">
      <form className="w-75 mx-auto">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={user.nombre}
            onChange={(e) => setUser({ ...user, nombre: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={user.usuario}
            onChange={(e) => setUser({ ...user, usuario: e.target.value })}
          />
        </div>

        <button type="button" className="btn btn-primary w-100" onClick={handleUpdate}>
          Actualizar Datos
        </button>

        <hr className="my-4" />

        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
          <input
            type="password"
            className="form-control"
            id="currentPassword"
            value={passwords.currentPassword || ''}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={passwords.newPassword || ''}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={passwords.confirmPassword || ''}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          />
        </div>

        <button type="button" className="btn btn-secondary w-100" onClick={handlePasswordUpdate}>
          Actualizar Contraseña
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
