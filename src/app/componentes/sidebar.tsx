import React, { useState } from 'react';
import { FaHome, FaUserCircle, FaBook, FaSignOutAlt, FaCheckSquare, FaUserGraduate } from 'react-icons/fa';
import Cookies from 'js-cookie';

interface SidebarProps {
    onChangeTitle: (newTitle: string) => void;
    onSetActiveView: (view: string) => void; // Nueva función para cambiar la vista activa
}

const Sidebar: React.FC<SidebarProps> = ({ onChangeTitle, onSetActiveView }) => {
  const [activeLink, setActiveLink] = useState('inicio');

  const handleClick = (link: string, title: string) => {
    setActiveLink(link);
    onChangeTitle(title);
    onSetActiveView(link);  // Cambiar la vista activa al hacer clic
  };

  const handleLogout = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    Cookies.remove('token');
    window.location.href = '/login';
    
  };

  const getLinkStyle = (link: string) => {
    return `d-flex align-items-center text-white p-2 mb-2 rounded-3 text-decoration-none ${
      activeLink === link 
        ? 'bg-success bg-opacity-25' 
        : 'hover-bg'
    }`;
  };

  return (
    <div
      className="position-fixed h-100"
      style={{
        width: '20%',
        backgroundColor: '#2f3640',
        paddingTop: '20px',
      }}
    >
      {/* Logo Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <div className="d-flex align-items-center">
          <FaCheckSquare className="fs-1 text-success" />
          <div className="text-white ms-2 fs-4">SaaS Lista</div>
        </div>
        <i className="fas fa-bars text-white fs-4" id="btn" style={{ cursor: 'pointer' }} />
      </div>

      {/* Navigation List */}
      <ul className="nav-list align-items-center">
        <li>
          <a 
            href='#' 
            onClick={(e) => { 
              e.preventDefault(); 
              handleClick('inicio', 'Inicio');
            }} 
            className={getLinkStyle('inicio')}
          >
            <FaHome className="fs-4 me-3" />
            <span>Inicio</span>
          </a>
        </li>
        <li>
          <a 
            href="#perfil" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleClick('perfil', 'Perfil');
            }} 
            className={getLinkStyle('perfil')}
          >
            <FaUserCircle className="fs-4 me-3" />
            <span>Perfil</span>
          </a>
        </li>
        <li>
          <a 
            href="#materias" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleClick('materias', 'Materias');
            }} 
            className={getLinkStyle('materias')}
          >
            <FaBook className="fs-4 me-3" />
            <span>Materias</span>
          </a>
        </li>
        <li>
          <a 
            href="#estudiantes" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleClick('estudiantes', 'Estudiantes');
            }} 
            className={getLinkStyle('Estudiantes')}
          >
            <FaUserGraduate className="fs-4 me-3" />
            <span>Estudiantes</span>
          </a>
        </li>
        <li>
          <a 
            href="/login" 
            onClick={ handleLogout
            }
            className={getLinkStyle('logout')}
          >
            <FaSignOutAlt className="fs-4 me-3" />
            <span>Cerrar Sesión</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
