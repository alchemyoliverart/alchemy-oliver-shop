import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname.startsWith('/print/') || location.pathname === '/contact';

  return (
    <nav className="nav">
      <div className="nav-left">
        {showBack && (
          <button
            className="nav-back"
            onClick={() => navigate('/', { state: { direction: 'back' } })}
          >
            ←
          </button>
        )}
        <img src="/Logo.png" alt="Alchemy Oliver" className="nav-logo" />
      </div>
      <div className="nav-center">
        <Link to="/contact" className="nav-contact">contact</Link>
      </div>
      <div className="nav-right">
        <a href="https://instagram.com/alchemyoliver" target="_blank" rel="noopener noreferrer" className="nav-contact">Instagram</a>
      </div>
    </nav>
  );
}

export default Nav;
