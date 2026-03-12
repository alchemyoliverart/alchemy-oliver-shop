import React, { useState, useEffect, useRef } from 'react';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23D9D9D9'/%3E%3C/svg%3E";

const SERIES = [
  {
    title: 'petals, pixels, and memory_orchid',
    images: ['/petels-Pixels-andmemory_orchid.jpg', '/petels-pixels-andmemory_orchid.1.jpg'],
  },
  {
    title: 'another fragment_orchid',
    images: ['/another_fragment.jpg', '/another_fragment1.jpg'],
  },
  {
    title: 'floral_fragments',
    images: ['/floral_fragments.jpg', '/Generative Fill 2.jpg'],
  },
  {
    title: 'home_grown',
    images: ['/HomeGrown.jpg', '/Home_Grown01.jpg', '/homegrown03.jpg'],
  },
  {
    title: 'oh_poppies',
    images: ['/Poppies1_A0.jpg', '/Poppies2_A0.jpg', '/Poppiess2.jpg'],
  },
  {
    title: 'the innocent',
    images: ['/The innocent.jpeg', '/The innocent 1.jpeg', '/The innocent 2.jpeg', '/The innocent 9.jpg'],
  },
  {
    title: 'film stills',
    images: ['/FilmStill1.jpg', '/FilmStill6.jpg'],
  },
  {
    title: 'black & white',
    images: ['/Black & White 1.jpg'],
  },
  {
    title: 'layer studies',
    images: ['/Layer 2.jpg', '/Layer 3.jpg', '/Layer 4.jpg', '/Layer 5.jpg', '/Layer 9.jpg'],
  },
  {
    title: 'clarity',
    images: ['/clarity-and-dehaze-1.jpg'],
  },
  {
    title: 'glitch',
    images: ['/glitch2.jpg'],
  },
  {
    title: 'polaroid',
    images: ['/polaroid.jpeg'],
  },
];

function ArchiveCell({ series, index }) {
  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef(null);
  const { images } = series;

  const startCycle = () => {
    if (images.length <= 1) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setImgIdx(i => (i + 1) % images.length);
    }, 3000);
  };

  useEffect(() => {
    const timeout = setTimeout(startCycle, index * 300);
    return () => {
      clearTimeout(timeout);
      clearInterval(intervalRef.current);
    };
  }, []);

  const go = (dir) => {
    setImgIdx(i => Math.max(0, Math.min(images.length - 1, i + dir)));
    startCycle(); // reset timer after manual nav
  };

  return (
    <div className="archive-cell">
      <div className="archive-cell-img-wrap">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`archive-cell-img${i === imgIdx ? ' active' : ''}`}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
          />
        ))}
        {images.length > 1 && (
          <div className="archive-arrows">
            <button className="archive-arrow" onClick={() => go(-1)} disabled={imgIdx === 0}>←</button>
            <button className="archive-arrow" onClick={() => go(1)} disabled={imgIdx === images.length - 1}>→</button>
          </div>
        )}
      </div>
      <span className="archive-fig">fig. {String(index + 1).padStart(2, '0')}</span>
    </div>
  );
}

function Archive() {
  return (
    <div className="archive-page">
      <div className="archive-grid">
        {SERIES.map((series, i) => (
          <ArchiveCell key={i} series={series} index={i} />
        ))}
      </div>
    </div>
  );
}

export default Archive;
