import React, { useState } from 'react';
import { FaHome, FaUserCircle, FaBook, FaSignOutAlt, FaCheckSquare, FaUserGraduate } from 'react-icons/fa';
import Cookies from 'js-cookie';

interface SidebarProps {
  onChangeTitle: (newTitle: string) => void;
  onSetActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChangeTitle, onSetActiveView }) => {
  const [activeLink, setActiveLink] = useState('inicio');

  const handleClick = (link: string, title: string) => {
    setActiveLink(link);
    onChangeTitle(title);
    onSetActiveView(link);
  };

  const handleLogout = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    Cookies.remove('token', { domain: 'retzius-web.vercel.app' });
    window.location.replace('/login');
  };

  const getLinkStyle = (link: string) => {
    return `d-flex align-items-center text-white p-2 mb-2 rounded-3 text-decoration-none ${
      activeLink === link ? 'bg-success bg-opacity-25' : 'hover-bg'
    }`;
  };

  return (
    <div
      className="position-fixed h-100"
      style={{
        width: '20%',
        backgroundColor: '#2f3640',
        paddingTop: '20px',
        overflow: 'auto',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3 px-3">
        <div className="d-flex align-items-center">
          <FaCheckSquare className="fs-3 text-success" />
          <div className="text-white ms-2 fs-5">SaaS Lista</div>
        </div>
      </div>

      <ul className="nav-list align-items-center" style={{ fontSize: '0.9rem', padding: '0 1rem' }}>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); handleClick('inicio', 'Inicio'); }} className={getLinkStyle('inicio')}>
            <span>Inicio</span>
          </a>
        </li>
        <li>
          <a href="#perfil" onClick={(e) => { e.preventDefault(); handleClick('perfil', 'Perfil'); }} className={getLinkStyle('perfil')}>
            <span>Perfil</span>
          </a>
        </li>
        <li>
          <a href="#materias" onClick={(e) => { e.preventDefault(); handleClick('materias', 'Materias'); }} className={getLinkStyle('materias')}>
            <span>Materias</span>
          </a>
        </li>
        <li>
          <a href="#estudiantes" onClick={(e) => { e.preventDefault(); handleClick('estudiantes', 'Estudiantes'); }} className={getLinkStyle('Estudiantes')}>
            <span>Estudiantes</span>
          </a>
        </li>
        <li>
          <a href="/login" onClick={handleLogout} className={getLinkStyle('logout')}>
            <span>Cerrar Sesión</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;