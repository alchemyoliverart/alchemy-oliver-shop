import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isGlitching, setIsGlitching] = useState(false);

  // Each project has its own image position
  const projects = [
    { id: 1, title: 'petals leaning into a fence', image: '/api/placeholder/600/750', position: 'bottom-left' },
    { id: 2, title: 'another fragment', image: '/api/placeholder/600/750', position: 'top-center' },
    { id: 3, title: 'what the light showed', image: '/api/placeholder/600/750', position: 'middle-right' },
    { id: 4, title: 'they fall like whispers', image: '/api/placeholder/600/750', position: 'top-left' },
    { id: 5, title: 'pressed light', image: '/api/placeholder/600/750', position: 'center' },
    { id: 6, title: 'flowers for grief', image: '/api/placeholder/600/750', position: 'bottom-right' },
    { id: 7, title: 'memory filed gently', image: '/api/placeholder/600/750', position: 'middle-left' },
    { id: 8, title: 'the afterglow', image: '/api/placeholder/600/750', position: 'top-right' },
    { id: 9, title: 'where love lingers', image: '/api/placeholder/600/750', position: 'bottom-center' },
    { id: 10, title: 'a binder of time', image: '/api/placeholder/600/750', position: 'center-right' },
  ];

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
    <div className="app">
      {/* Slim Contact Nav */}
      <nav className={`nav ${isGlitching ? 'glitch' : ''}`}>
        <div className="nav-left">
          <span className="nav-label">alchemy_oliver</span>
        </div>
        <div className="nav-center">
          <a href="mailto:hello@alchemyoliver.com" className="nav-contact">hello@alchemyoliver.com</a>
        </div>
        <div className="nav-right">
          <a href="https://instagram.com/alchemyoliver" target="_blank" rel="noopener noreferrer" className="nav-contact">Instagram</a>
        </div>
      </nav>

      {/* Compact Project List - Top Right */}
      <div className="projects-menu">
        <div className="projects-header">available prints</div>
        <div className="projects-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project-item-compact ${hoveredProject?.id === project.id ? 'active' : ''}`}
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <span className="project-number-compact">{String(project.id).padStart(2, '0')}</span>
              <span className="project-title-compact">{project.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Image Display - Position changes per project */}
      {hoveredProject && (
        <div className={`floating-image floating-image-${hoveredProject.position}`}>
          <img 
            src={hoveredProject.image} 
            alt={hoveredProject.title}
            className="floating-image-content"
          />
          <div className="scan-line"></div>
        </div>
      )}

      {/* Hero Section with Logo */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="logo-container">
            <img src="/logo.png" alt="Alchemy Oliver" className="hero-logo" />
          </div>
          <h1 className={`hero-title ${isGlitching ? 'glitch-text' : ''}`}>
            scanography and multi-media artist
          </h1>
          <p className="hero-subtitle">
            flowers that last forever.
          </p>
          <p className="hero-description">
            memories held, re-imagined as florals that don't fade.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">about</h2>
            <p className="about-paragraph">
              a binder of time,<br />
              plastic sleeves whispering<br />
              remember this.
            </p>
            <p className="about-paragraph">
              petals leaning into a fence,<br />
              into wire,<br />
              into afternoon shade -<br />
              soft against something<br />
              that tries to hold them back.
            </p>
            <p className="about-paragraph">
              pressed light, kept carefully -<br />
              flowers for grief,<br />
              flowers for staying.
            </p>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="store" id="store">
        <div className="store-content">
          <h2 className="section-title">ordering</h2>
          <p className="store-text">
            print orders are now back open for 2026.
          </p>
          <p className="store-text">
            each arrangement is either created just for you,<br />
            or drawn from my own life -<br />
            moments lived, memories held -<br />
            re-imagined as florals that don't fade.
          </p>
          <p className="store-text">
            available as unframed prints or professionally framed.<br />
            dm for prints & commissions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">Â© 2026 alchemy oliver</p>
          <p className="footer-text">scanography and multi-media artist</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
