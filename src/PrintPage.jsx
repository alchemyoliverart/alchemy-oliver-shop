import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projects from './projects.js';

function PrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('A2');
  const [framed, setFramed] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);

  const prices = {
    A3: { unframed: 100, framed: 160 },
    A2: { unframed: 150, framed: 210 },
    A1: { unframed: 200, framed: 260 },
  };

  const currentPrice = prices[selectedSize][framed ? 'framed' : 'unframed'];

  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return <div className="print-page-missing">Print not found.</div>;
  }

  // 4 placeholder thumbnails using the same image
  const thumbnails = [project.image, project.image, project.image, project.image];

  const otherProjects = projects.filter(p => p.id !== project.id);

  return (
    <div className="print-page">
      <div className="print-layout">

        {/* Left — image gallery */}
        <div className="print-left">
          <img
            src={thumbnails[selectedThumb]}
            alt={project.title}
            className="print-detail-image"
          />
          <div className="print-thumbnails">
            {thumbnails.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${project.title} view ${i + 1}`}
                className={`print-thumb ${selectedThumb === i ? 'active' : ''}`}
                onClick={() => setSelectedThumb(i)}
              />
            ))}
          </div>
        </div>

        {/* Right — details + purchase */}
        <div className="print-right">
          <h1 className="print-title">{project.title}</h1>
          <p className="print-description">{project.description}</p>

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

            <div className="option-group">
              <div className="option-label">Finish</div>
              <div className="option-buttons">
                <button
                  className={`option-btn ${!framed ? 'active' : ''}`}
                  onClick={() => setFramed(false)}
                >
                  Unframed
                </button>
                <button
                  className={`option-btn ${framed ? 'active' : ''}`}
                  onClick={() => setFramed(true)}
                >
                  Framed
                </button>
              </div>
            </div>
          </div>

          <button className="dm-button">Purchase</button>
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
              onClick={() => navigate(`/print/${p.id}`, { state: { direction: 'forward' } })}
            >
              <img src={p.image} alt={p.title} className="other-print-img" />
              <div className="other-print-title">{p.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrintPage;
