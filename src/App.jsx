import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Nav from './Nav.jsx';
import PrintPage from './PrintPage.jsx';
import projects from './projects.js';
import './App.css';

function HomePage() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const [exitingProject, setExitingProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectHover = (project) => {
    if (hoveredProject && hoveredProject.id !== project.id) {
      setExitingProject(hoveredProject);
      setTimeout(() => setExitingProject(null), 1050);
    }
    setHoveredProject(project);
  };

  return (
    <div className="app">
      {/* Floating image — only in hero */}
      {hoveredProject && !isPastHero && (
        <div
          key={hoveredProject.id}
          className={`floating-image floating-image-${hoveredProject.position}`}
        >
          <div className="glitch-disperse">
            <img
              src={hoveredProject.image}
              alt={hoveredProject.title}
              className="floating-image-content"
            />
          </div>
          <div className="scan-line"></div>
        </div>
      )}

      {/* Hero — first room */}
      <section className="hero" id="hero">
        {/* Top-left panel: tagline + logo */}
        <div className="top-left-panel">
          <div className="panel-tagline">
            <p>Scanography and multi-media artist.</p>
            <p>Flowers that last forever.</p>
            <p>Memories held, re-imagined as florals that don't fade.</p>
          </div>
          <img src="/logo.png" alt="Alchemy Oliver" className="panel-logo" />
        </div>

        {/* Available prints menu — top right, absolute inside hero */}
        <div className="projects-menu">
          <div className="projects-header">Available prints</div>
          <div className="projects-list">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-item-compact ${hoveredProject?.id === project.id ? 'active' : ''}`}
                onMouseEnter={() => handleProjectHover(project)}
                onClick={() => navigate(`/print/${project.id}`, { state: { direction: 'forward' } })}
              >
                <span className="project-number-compact">{String(project.id).padStart(2, '0')}</span>
                <span className="project-title-compact">{project.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about" id="about">
        <div className="about-content">
          <h2 className="section-title">About</h2>
          <p className="about-paragraph">
            A binder of time,<br />
            plastic sleeves whispering<br />
            remember this.
          </p>
          <p className="about-paragraph">
            Petals leaning into a fence,<br />
            into wire,<br />
            into afternoon shade —<br />
            soft against something<br />
            that tries to hold them back.
          </p>
          <p className="about-paragraph">
            Pressed light, kept carefully —<br />
            flowers for grief,<br />
            flowers for staying.
          </p>
        </div>
      </section>

      {/* Store */}
      <section className="store" id="store">
        <div className="store-content">
          <h2 className="section-title">Ordering</h2>
          <p className="store-text">
            Print orders are now back open for 2026.
          </p>
          <p className="store-text">
            Each arrangement is either created just for you,<br />
            or drawn from my own life —<br />
            moments lived, memories held —<br />
            re-imagined as florals that don't fade.
          </p>
          <p className="store-text">
            Available as unframed prints or professionally framed.<br />
            DM for prints &amp; commissions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2026 Alchemy Oliver</p>
        <p className="footer-text">Scanography and multi-media artist</p>
      </footer>
    </div>
  );
}

function App() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const location = useLocation();
  const direction = location.state?.direction;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const transitionClass = direction === 'back' ? 'slide-from-left' : 'slide-from-right';

  return (
    <>
      {/* Custom cursor — persists across all routes */}
      <div
        className="custom-cursor"
        style={{ left: mousePosition.x - 10, top: mousePosition.y - 10 }}
      />

      {/* Shared nav */}
      <Nav />

      {/* Page content with slide transition */}
      <div key={location.key} className={`page-transition ${transitionClass}`}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/print/:id" element={<PrintPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
