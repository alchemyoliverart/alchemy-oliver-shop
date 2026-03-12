// v2
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Nav from './Nav.jsx';
import PrintPage from './PrintPage.jsx';
import ContactPage from './Contact.jsx';
import CheckoutSuccess from './CheckoutSuccess.jsx';
import NotFound from './NotFound.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import RefundPolicy from './RefundPolicy.jsx';
import Terms from './Terms.jsx';
import projects from './projects.js';
import './App.css';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23D9D9D9'/%3E%3C/svg%3E";

function SplashScreen({ onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const [fading, setFading] = useState(false);
  const text = "'petals, pixels, and memory'";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setFading(true);
          setTimeout(onComplete, 600);
        }, 900);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`splash${fading ? ' splash-fade' : ''}`}>
      <span className="splash-text">
        {displayed}<span className="splash-cursor">_</span>
      </span>
    </div>
  );
}

function HomePage({ mobileExpandedIds, setMobileExpandedIds, splashDone }) {
  const [collageImages, setCollageImages] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
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
              <img src={item.src} alt={item.title} className="collage-image-content" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
            </div>
          </div>
        ))}
        {/* Left panel: tagline + about */}
        <div className="top-left-panel">
          <img src="/Logo.png" alt="Alchemy Oliver" className="panel-logo" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
          <div className="panel-poem">
            <p>
              'petals, pixels, and memory'<br />
              <br />
              a practice of preservation -<br />
              <br />
              light,<br />
              memory,<br />
              grief.<br />
              <br />
              flowers gathered<br />
              from moments already fading,<br />
              held in light<br />
              through scanning<br />
              and digital layering.<br />
              quiet records<br />
              of impermanence.
            </p>
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
                    <img src={project.images[0]} alt={project.title} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Collage tip — desktop only */}
        <div className={`collage-tip${splashDone ? ' collage-tip-animate' : ''}`}>
          click the prints to place them - drag to rearrange. enjoy :,)
        </div>

        {/* Ordering box */}
        <div className="ordering-box">
          <div className="ordering-header">ordering</div>
          <p className="ordering-text">print orders are now open for 2026.</p>
          <p className="ordering-text">available unframed. framing available on request — <span style={{cursor:'pointer', textDecoration:'underline'}} onClick={() => navigate('/contact')}>get in touch</span> for a quote.</p>
          <p className="ordering-text">local pickup available - <span style={{cursor:'pointer', textDecoration:'underline'}} onClick={() => navigate('/contact')}>get in touch</span> to arrange.</p>
        </div>

        </div>{/* end hero-right-panels */}
      </section>


      {/* About */}
      <section className="about" id="about" ref={aboutRef}>
        {(collageImages.length > 0 || mobileExpandedIds.size > 0) && (
          <button
            className="close-prints-tab"
            onClick={() => {
              setCollageImages([]);
              setMobileExpandedIds(new Set());
            }}
          >
            *close prints*
          </button>
        )}
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
            <img src="/me.png" alt="Alchemy Oliver" className="about-image" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2026 Alchemy Oliver</p>
        <p className="footer-text">Scanography and multi-media artist</p>
        <div className="footer-links">
          <Link to="/privacy-policy" className="footer-link">privacy policy</Link>
          <Link to="/refund-policy" className="footer-link">refund policy</Link>
          <Link to="/terms" className="footer-link">terms</Link>
        </div>
      </footer>
    </div>
  );
}

let sharedAudioCtx = null;

async function playMacClick() {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedAudioCtx.state === 'suspended') {
    await sharedAudioCtx.resume();
  }
  const ctx = sharedAudioCtx;
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
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  const direction = location.state?.direction;
  const [isGlitching, setIsGlitching] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

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

  const [mobileExpandedIds, setMobileExpandedIds] = useState(new Set());
  const isPrintPage = location.pathname.startsWith('/print/') || location.pathname === '/contact' || location.pathname.startsWith('/checkout') || location.pathname === '/privacy-policy' || location.pathname === '/refund-policy' || location.pathname === '/terms';
  const transitionClass = direction === 'back' ? 'slide-from-left' : 'slide-from-right';

  useEffect(() => {
    if (isPrintPage) setMobileExpandedIds(new Set());
  }, [location.pathname]);

  return (
    <>
      {splashDone && <Nav />}
      {mobileExpandedIds.size > 0 && !isPrintPage && createPortal(
        <button
          className="close-prints-mobile"
          onClick={() => setMobileExpandedIds(new Set())}
        >
          *close prints*
        </button>,
        document.body
      )}
      <div className={isGlitching && !isPrintPage ? 'glitch' : ''}>
        {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
        <ScrollToTop />

        {/* Page content with slide transition */}
        <div key={location.key} className={`page-transition ${transitionClass}`}>
          <Routes location={location}>
            <Route path="/" element={<HomePage mobileExpandedIds={mobileExpandedIds} setMobileExpandedIds={setMobileExpandedIds} splashDone={splashDone} />} />
            <Route path="/print/:id" element={<PrintPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
