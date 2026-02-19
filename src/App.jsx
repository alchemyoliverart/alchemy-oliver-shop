import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Nav from './Nav.jsx';
import PrintPage from './PrintPage.jsx';
import projects from './projects.js';
import './App.css';

function HomePage() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const [exitingProject, setExitingProject] = useState(null);
  const [mobileExpandedId, setMobileExpandedId] = useState(null);
  const [polaroidFanned, setPolaroidFanned] = useState(false);
  const aboutRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPolaroidFanned(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const exitTimer = React.useRef(null);

  const handleMouseEnter = (project) => {
    // Cancel any pending exit cleanup for this project
    if (exitingProject?.id === project.id) {
      clearTimeout(exitTimer.current);
      setExitingProject(null);
    }
    setHoveredProject(project);
  };

  const handleMouseLeave = () => {
    if (hoveredProject) {
      setExitingProject(hoveredProject);
      exitTimer.current = setTimeout(() => setExitingProject(null), 600);
    }
    setHoveredProject(null);
  };

  const handleProjectSwitch = (project) => {
    // Switching directly from one title to another
    if (hoveredProject && hoveredProject.id !== project.id) {
      setExitingProject(hoveredProject);
      clearTimeout(exitTimer.current);
      exitTimer.current = setTimeout(() => setExitingProject(null), 600);
    }
    setHoveredProject(project);
  };

  return (
    <div className="app">
      {/* Active hover image — no fade-out animation, stays while hovering */}
      {hoveredProject && !isPastHero && (
        <div
          key={`active-${hoveredProject.id}`}
          className={`floating-image floating-image-${hoveredProject.position}`}
        >
          <img
            src={hoveredProject.image}
            alt={hoveredProject.title}
            className="floating-image-content"
          />
          <div className="scan-line"></div>
        </div>
      )}

      {/* Exiting image — plays fade-out animation */}
      {exitingProject && !isPastHero && (
        <div
          key={`exit-${exitingProject.id}`}
          className={`floating-image floating-image-${exitingProject.position}`}
        >
          <div className="glitch-disperse">
            <img
              src={exitingProject.image}
              alt={exitingProject.title}
              className="floating-image-content"
            />
          </div>
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
        </div>

        {/* Available prints menu — top right, absolute inside hero */}
        <div className="projects-menu">
          <div className="projects-header">Available prints</div>
          <div className="projects-list">
            {projects.map((project) => (
              <React.Fragment key={project.id}>
                <div
                  className={`project-item-compact ${hoveredProject?.id === project.id ? 'active' : ''} ${mobileExpandedId === project.id ? 'mobile-active' : ''}`}
                  onMouseEnter={() => handleProjectSwitch(project)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setMobileExpandedId(prev => prev === project.id ? null : project.id);
                    } else {
                      navigate(`/print/${project.id}`, { state: { direction: 'forward' } });
                    }
                  }}
                >
                  <span className="project-number-compact">{String(project.id).padStart(2, '0')}</span>
                  <span className="project-title-compact">{project.title}</span>
                  <span className="project-inquire">inquire →</span>
                </div>
                {mobileExpandedId === project.id && (
                  <div className="mobile-project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Store */}
      <section className="store" id="store">
        <div className="store-content">
          <h2 className="section-title">ordering</h2>
          <p className="store-text">
            print orders are now back open for 2026.
          </p>
          <p className="store-text">
            each arrangement is either created just for you,<br />
            or drawn from my own life —<br />
            moments lived, memories held —<br />
            re-imagined as florals that don't fade.
          </p>
          <p className="store-text">
            available as unframed prints or professionally framed.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="about" id="about" ref={aboutRef}>
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
              into afternoon shade —<br />
              soft against something<br />
              that tries to hold them back.
            </p>
            <p className="about-paragraph">
              pressed light, kept carefully —<br />
              flowers for grief,<br />
              flowers for staying.
            </p>
          </div>

          <div className={`polaroid-stack ${polaroidFanned ? 'fanned' : ''}`}>
            <div className="polaroid polaroid-back">
              <img src="/polaroid1.png" alt="" className="polaroid-img" />
            </div>
            <div className="polaroid polaroid-front">
              <img src="/polaroid2.png" alt="" className="polaroid-img" />
            </div>
          </div>
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

function playMacClick() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 0.018;

  // Short filtered noise burst — the mechanical "tick"
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800;
  filter.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + duration);
  source.onended = () => ctx.close();
}

function App() {
  const location = useLocation();
  const direction = location.state?.direction;
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest('a, button')) {
        playMacClick();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 700);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const isPrintPage = location.pathname.startsWith('/print/');
  const transitionClass = direction === 'back' ? 'slide-from-left' : 'slide-from-right';

  return (
    <div className={isGlitching && !isPrintPage ? 'glitch' : ''}>
      {/* Shared nav */}
      <Nav />

      {/* Page content with slide transition */}
      <div key={location.key} className={`page-transition ${transitionClass}`}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/print/:id" element={<PrintPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
