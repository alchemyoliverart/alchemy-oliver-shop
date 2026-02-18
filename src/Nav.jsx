import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Nav() {
  const [isGlitching, setIsGlitching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname.startsWith('/print/');

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <nav className={`nav ${isGlitching ? 'glitch' : ''}`}>
      <div className="nav-left">
        {showBack && (
          <button
            className="nav-back"
            onClick={() => navigate('/', { state: { direction: 'back' } })}
          >
            ←
          </button>
        )}
        <span className="nav-label">Alchemy_oliver</span>
      </div>
      <div className="nav-center">
        <a href="mailto:hello@alchemyoliver.com" className="nav-contact">hello@alchemyoliver.com</a>
      </div>
      <div className="nav-right">
        <a href="https://instagram.com/alchemyoliver" target="_blank" rel="noopener noreferrer" className="nav-contact">Instagram</a>
      </div>
    </nav>
  );
}

export default Nav;
