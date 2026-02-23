import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Nav from './Nav.jsx';
import PrintPage from './PrintPage.jsx';
import ContactPage from './Contact.jsx';
import projects from './projects.js';
import './App.css';

function HomePage() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const [topProject, setTopProject] = useState(null);
  const [topOpacity, setTopOpacity] = useState(0);
  const [bottomProject, setBottomProject] = useState(null);
  const [bottomOpacity, setBottomOpacity] = useState(0);
  const [mobileExpandedIds, setMobileExpandedIds] = useState(new Set());
  const [polaroidFanned, setPolaroidFanned] = useState(false);
  const aboutRef = React.useRef(null);
  const navigate = useNavigate();
  const cleanupTimer = React.useRef(null);

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

  const showProject = (project) => {
    setHoveredProject(project);
    clearTimeout(cleanupTimer.current);

    if (topProject && topProject.id !== project.id) {
      // Move current image to background (slow fade out), bring new one in on top
      setBottomProject(topProject);
      setBottomOpacity(1);
      setTopProject(project);
      setTopOpacity(0);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setTopOpacity(1);
        setBottomOpacity(0);
      }));
      // Unmount background image after it finishes fading
      cleanupTimer.current = setTimeout(() => setBottomProject(null), 800);
    } else if (!topProject) {
      // Nothing shown yet — fade straight in
      setTopProject(project);
      requestAnimationFrame(() => requestAnimationFrame(() => setTopOpacity(1)));
    }
  };

  const hideProject = () => {
    setHoveredProject(null);
    clearTimeout(cleanupTimer.current);
    setTopOpacity(0);
    setBottomOpacity(0);
    cleanupTimer.current = setTimeout(() => {
      setTopProject(null);
      setBottomProject(null);
    }, 800);
  };

  return (
    <div className="app">
      {/* Bottom layer — outgoing image, fades out slowly */}
      {bottomProject && !isPastHero && (
        <div
          key={`bottom-${bottomProject.id}`}
          className={`floating-image floating-image-${bottomProject.position}`}
          style={{ opacity: bottomOpacity, transition: 'opacity 800ms ease' }}
        >
          <img src={bottomProject.images[0]} alt={bottomProject.title} className="floating-image-content" />
        </div>
      )}

      {/* Top layer — incoming image, fades in quickly on a fresh element per project */}
      {topProject && !isPastHero && (
        <div
          key={`top-${topProject.id}`}
          className={`floating-image floating-image-${topProject.position}`}
          style={{ opacity: topOpacity, transition: 'opacity 350ms ease' }}
        >
          <img src={topProject.images[0]} alt={topProject.title} className="floating-image-content" />
          <div className="scan-line"></div>
        </div>
      )}

      {/* Hero — first room */}
      <section className="hero" id="hero">
        {/* Left panel: tagline + about */}
        <div className="top-left-panel">
          <img src="/Logo.png" alt="Alchemy Oliver" className="panel-logo" />
          <div className="panel-tagline">
            <p>'petals, pixels, memory'</p>
            <p>a practice of preserving light, memory, and the quiet traces of grief.</p>
          </div>
          <div className="panel-about">
            <p>i gather flowers from passing moments<br />and preserve them in light<br />through scanning and digital layering,<br />creating quiet archives<br />of memory and impermanence.</p>
          </div>
        </div>

        {/* Right side: two boxes stacked */}
        <div className="hero-right-panels">

        {/* Available prints menu */}
        <div className="projects-menu">
          <div className="projects-header">Available prints</div>
          <div className="projects-list">
            {projects.map((project) => (
              <React.Fragment key={project.id}>
                <div
                  className={`project-item-compact ${hoveredProject?.id === project.id ? 'active' : ''} ${mobileExpandedIds.has(project.id) ? 'mobile-active' : ''}`}
                  onMouseEnter={() => showProject(project)}
                  onMouseLeave={hideProject}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setMobileExpandedIds(prev => {
                        const next = new Set(prev);
                        next.has(project.id) ? next.delete(project.id) : next.add(project.id);
                        return next;
                      });
                    } else {
                      navigate(`/print/${project.id}`, { state: { direction: 'forward' } });
                    }
                  }}
                >
                  <span className="project-number-compact">{String(project.id).padStart(2, '0')}</span>
                  <span className="project-title-compact">{project.title}</span>
                  {project.soldOut && <span className="project-sold">sold</span>}
                  <span
                    className="project-inquire"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/print/${project.id}`, { state: { direction: 'forward' } });
                    }}
                  >→</span>
                </div>
                {mobileExpandedIds.has(project.id) && (
                  <div className="mobile-project-image">
                    <img src={project.images[0]} alt={project.title} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Ordering box */}
        <div className="ordering-box">
          <div className="ordering-header">ordering</div>
          <p className="ordering-text">print orders are now open for 2026.</p>
          <p className="ordering-text">available as unframed prints or professionally framed.</p>
        </div>

        </div>{/* end hero-right-panels */}
      </section>


      {/* About */}
      <section className="about" id="about" ref={aboutRef}>
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">about</h2>
            <p className="about-paragraph">
              i am a multidisciplinary artist working across digital collage, photography, and poetic text.
              my practice explores fragmented memory through scanned flora, soft textures, and layered imagery.
              gathering flowers from walks, gardens, and fleeting encounters with the natural world,
              i form an intimate connection with each botanical fragment.
              every bloom carries its own story —
              a quiet trace of time, presence, and impermanence.
            </p>
            <p className="about-paragraph">
              using a flatbed scanner as my primary tool,
              these delicate forms are preserved directly in light,
              capturing intricate details and textures in a suspended space
              between presence and disappearance.
              through digital manipulation and layering,
              they are transformed into luminous compositions
              that exist between the organic and the digital.
            </p>
            <p className="about-paragraph">
              engaging themes of grief, light, and transformation,
              i describe my process as a form of "fragmented reflection" —
              a way of holding onto fleeting moments
              and creating visual archives of what cannot remain.
              my work seeks to evoke a sense of tranquillity, awe,
              and quiet reverence for the natural world,
              while exploring the subtle harmony that can emerge
              from the intersection of art, technology, and botany.
            </p>
            <p className="about-paragraph">
              i hold a bachelor of fine arts from monash university,
              including study abroad in prato, italy (2013).
              i am interested in the space where nature meets technology —
              where something living becomes pixel,
              where a fleeting moment becomes an archive.
              each work acts as a quiet act of preservation.
              a way of holding onto light.
              a way of remembering.
            </p>
          </div>

          <div className="about-images">
            <img src="/The innocent 1.jpeg" alt="The innocent 1" className="about-image" />
            <img src="/The innocent 2.jpeg" alt="The innocent 2" className="about-image" />
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

  const isPrintPage = location.pathname.startsWith('/print/') || location.pathname === '/contact';
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
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
