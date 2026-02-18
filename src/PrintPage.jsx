import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projects from './projects.js';

function PrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('A2');
  const [framed, setFramed] = useState(false);

  const currentIndex = projects.findIndex(p => p.id === parseInt(id));
  const project = projects[currentIndex];

  if (!project) {
    return <div className="print-page-missing">Print not found.</div>;
  }

  const goTo = (index, direction) => {
    navigate(`/print/${projects[index].id}`, { state: { direction } });
  };

  return (
    <div className="print-page">
      <div className="print-layout">

        {/* Left — image + prev/next */}
        <div className="print-left">
          <img
            src={project.image}
            alt={project.title}
            className="print-detail-image"
          />
          <div className="print-arrows">
            <button
              className="arrow-btn"
              onClick={() => goTo(currentIndex - 1, 'back')}
              disabled={currentIndex === 0}
            >
              ← prev
            </button>
            <button
              className="arrow-btn"
              onClick={() => goTo(currentIndex + 1, 'forward')}
              disabled={currentIndex === projects.length - 1}
            >
              next →
            </button>
          </div>
        </div>

        {/* Right — details + purchase */}
        <div className="print-right">
          <h1 className="print-title">{project.title}</h1>
          <p className="print-description">{project.description}</p>

          <div className="print-options">
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

          <button className="dm-button">DM to purchase</button>
        </div>

      </div>
    </div>
  );
}

export default PrintPage;
