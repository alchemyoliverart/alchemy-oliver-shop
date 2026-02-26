// v2
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Nav from './Nav.jsx';
import PrintPage from './PrintPage.jsx';
import ContactPage from './Contact.jsx';
import CheckoutSuccess from './CheckoutSuccess.jsx';
import projects from './projects.js';
import './App.css';

function HomePage() {
  const [collageImages, setCollageImages] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [mobileExpandedIds, setMobileExpandedIds] = useState(new Set());
  const [polaroidFanned, setPolaroidFanned] = useState(false);
  const aboutRef = React.useRef(null);
  const navigate = useNavigate();
  const dragging = React.useRef(null);
  const hasDragged = React.useRef(false);

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
    const handleMouseMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragging.current.startMouseX;
      const dy = e.clientY - dragging.current.startMouseY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true;
      const { id, startDragX, startDragY } = dragging.current;
      setCollageImages(prev => prev.map(item =>
        item.id === id
          ? { ...item, dragX: startDragX + dx, dragY: startDragY + dy }
          : item
      ));
    };
    const handleMouseUp = () => {
      if (dragging.current) {
        dragging.current = null;
        setDraggingId(null);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e, item) => {
    if (e.button !== 0) return;
    e.preventDefault();
    hasDragged.current = false;
    dragging.current = {
      id: item.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startDragX: item.dragX || 0,
      startDragY: item.dragY || 0,
    };
    setDraggingId(item.id);
  };

  const toggleCollage = (project) => {
    setCollageImages(prev => {
      if (prev.find(item => item.id === project.id)) {
        return prev.filter(item => item.id !== project.id);
      }
      const rotation = (Math.random() * 24) - 12;
      const top = 8 + Math.random() * 62;
      const left = 5 + Math.random() * 55;
      return [...prev, { id: project.id, src: project.images[0], title: project.title, rotation, top, left, dragX: 0, dragY: 0 }];
    });
  };

  return (
    <div className="app">
      {/* Preload all project images */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {projects.map((project) =>
          project.images.map((src, i) => (
            <img key={`${project.id}-${i}`} src={src} alt="" />
          ))
        )}
      </div>

      {/* Hero — first room */}
      <section className="hero" id="hero">
        {/* Collage images — desktop only, built up by clicking print links */}
        {collageImages.map((item, index) => (
          <div
            key={item.id}
            className={`collage-wrapper${draggingId === item.id ? ' dragging' : ''}`}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              transform: `translate(${item.dragX || 0}px, ${item.dragY || 0}px)`,
              zIndex: draggingId === item.id ? 850 : 700 + index,
            }}
            onMouseDown={(e) => handleMouseDown(e, item)}
            onClick={() => { if (!hasDragged.current) navigate(`/print/${item.id}`, { state: { direction: 'forward' } }); }}
            role="link"
            aria-label={`View ${item.title}`}
          >
            <div className="collage-image" style={{ '--img-rotation': `${item.rotation}deg` }}>
              <img src={item.src} alt={item.title} className="collage-image-content" />
            </div>
          </div>
        ))}
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
                  className={`project-item-compact ${collageImages.some(img => img.id === project.id) ? 'active' : ''} ${mobileExpandedIds.has(project.id) ? 'mobile-active' : ''}`}
                  role="button"
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setMobileExpandedIds(prev => {
                        const next = new Set(prev);
                        next.has(project.id) ? next.delete(project.id) : next.add(project.id);
                        return next;
                      });
                    } else {
                      toggleCollage(project);
                    }
                  }}
                >
                  <span className="project-number-compact">{String(project.id).padStart(2, '0')}</span>
                  <span className="project-title-compact">{project.title}</span>
                  {project.soldOut && <span className="project-sold">sold</span>}
                  <span
                    className="project-inquire"
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/print/${project.id}`, { state: { direction: 'forward' } });
                    }}
                  >→</span>
                </div>
                {mobileExpandedIds.has(project.id) && (
                  <div
                    className="mobile-project-image"
                    onClick={() => navigate(`/print/${project.id}`, { state: { direction: 'forward' } })}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={project.images[0]} alt={project.title} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Collage tip — desktop only */}
        <div className="collage-tip">
          click the prints to place them — drag to rearrange. enjoy :,)
        </div>

        {/* Ordering box */}
        <div className="ordering-box">
          <div className="ordering-header">ordering</div>
          <p className="ordering-text">print orders are now open for 2026.</p>
          <p className="ordering-text">available unframed or professionally framed.</p>
        </div>

        </div>{/* end hero-right-panels */}
      </section>


      {/* About */}
      <section className="about" id="about" ref={aboutRef}>
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">about</h2>
            <p className="about-paragraph">
              i am a multidisciplinary artist working across digital collage, photography, and poetic text. my practice explores fragmented memory through scanned flora, soft textures, and layered imagery. gathering flowers from walks, gardens, and fleeting encounters with the natural world, i form an intimate connection with each botanical fragment. every bloom carries its own story - a quiet trace of time, presence, and impermanence.
            </p>
            <p className="about-paragraph">
              working with a flatbed scanner, these delicate forms are preserved directly in light, capturing intricate details and textures in a suspended space between presence and disappearance. through digital manipulation and layering, they are transformed into luminous compositions that exist between the organic and the digital.
            </p>
            <p className="about-paragraph">
              engaging themes of grief, light, and transformation, i describe my process as a form of 'fragmented reflection' - a way of holding onto fleeting moments and creating visual archives of what cannot remain. my work seeks to evoke a sense of tranquility, awe, and quiet reverence for the natural world, while exploring the subtle harmony that can emerge from the intersection of art, technology, and botany.
            </p>
            <p className="about-paragraph">
              i hold a bachelor of fine arts from monash university, including study abroad in prato, italy (2013). i am drawn to the space where nature meets technology - where something living becomes pixel, where a fleeting moment becomes an archive. each work is a quiet act of preservation. a way of holding onto light.
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
      if (e.target.closest('a, button, select, [role="button"]')) {
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

  const isPrintPage = location.pathname.startsWith('/print/') || location.pathname === '/contact' || location.pathname.startsWith('/checkout');
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
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
        </Routes>
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
