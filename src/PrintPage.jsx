import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projects from './projects.js';

function PrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('A2');
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const touchStartX = useRef(null);

  const prices = { A3: 280, A2: 400, A1: 650 };
  const currentPrice = prices[selectedSize];
  const project = projects.find(p => p.id === parseInt(id));

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e, total) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      setSelectedThumb(prev =>
        delta > 0
          ? Math.min(prev + 1, total - 1)
          : Math.max(prev - 1, 0)
      );
    }
    touchStartX.current = null;
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          size: selectedSize,
          amount: prices[selectedSize],
          printId: project.id,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setPurchasing(false);
    }
  };

  if (!project) {
    return <div className="print-page-missing">Print not found.</div>;
  }

  const thumbnails = project.images;

  const otherProjects = projects.filter(p => p.id !== project.id);

  return (
    <div className="print-page">
      <div className="print-layout">

        {/* Left — image gallery */}
        <div className="print-left">
          <div
            className="print-detail-image-wrap"
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => handleTouchEnd(e, thumbnails.length)}
          >
            <img
              src={thumbnails[selectedThumb]}
              alt={project.title}
              className="print-detail-image"
            />
            <div className="scan-line"></div>
          </div>
          <div className="image-dots">
            {thumbnails.map((_, i) => (
              <button
                key={i}
                className={`image-dot ${selectedThumb === i ? 'active' : ''}`}
                onClick={() => setSelectedThumb(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
          <div className="print-thumbnails">
            {thumbnails.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${project.title} view ${i + 1}`}
                className={`print-thumb ${selectedThumb === i ? 'active' : ''}`}
                role="button"
                onClick={() => setSelectedThumb(i)}
              />
            ))}
          </div>
        </div>

        {/* Right — details + purchase */}
        <div className="print-right">
          <h1 className="print-title">{project.title}</h1>
          {project.description && (
            <p className="print-description" style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
          )}

          <div className="print-options">
            <div className="print-price">${currentPrice}</div>

            <div className="option-group">
              <div className="option-label">Size</div>
              <div className="option-buttons">
                {['A3', 'A2', 'A1'].map(size => (
                  <button
                    key={size}
                    className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {project.soldOut
            ? <span className="dm-button dm-button-sold">sold out</span>
            : <button className="dm-button" onClick={handlePurchase} disabled={purchasing}>
                {purchasing ? 'loading...' : 'purchase'}
              </button>
          }
          <div className="print-fine-print-group">
            <p className="print-fine-print">
              all prints are unframed (framing available on request, quoted by size and style). each is a limited-edition, hand-signed print with a certificate of authenticity.
            </p>
            <p className="print-fine-print">
              printed with archival pigment inks on museum-grade baryta paper for exceptional colour, deep blacks, and long-term stability.
            </p>
            <p className="print-fine-print">
              orders are fulfilled with care. from printing to signing to packaging, each piece is given the time it deserves. typically 2–3 weeks before despatch.
            </p>
          </div>
        </div>

      </div>

      {/* Other prints strip */}
      <div className="other-prints">
        <div className="other-prints-heading">other prints</div>
        <div className="other-prints-scroll">
          {otherProjects.map(p => (
            <div
              key={p.id}
              className="other-print-card"
              role="button"
              onClick={() => navigate(`/print/${p.id}`, { state: { direction: 'forward' } })}
            >
              <img src={p.images[0]} alt={p.title} className="other-print-img" />
              <div className="other-print-title">{p.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrintPage;
