import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import projects from './projects.js';

function PrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('A2');
  const [selectedThumb, setSelectedThumb] = useState(0);

  const prices = { A3: 280, A2: 400, A1: 650 };

  const currentPrice = prices[selectedSize];

  const project = projects.find(p => p.id === parseInt(id));

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
          <div className="print-detail-image-wrap">
            <img
              src={thumbnails[selectedThumb]}
              alt={project.title}
              className="print-detail-image"
            />
            <div className="scan-line"></div>
          </div>
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
            : <Link to="/contact" className="dm-button">enquire</Link>
          }
          <div className="print-fine-print-group">
            <p className="print-fine-print">
              all prints are unframed by default.<br />
              framing can be arranged on request<br />
              and quoted individually depending on size and style.<br />
              each print is hand-signed<br />
              and comes with a certificate of authenticity.
            </p>
            <p className="print-fine-print">
              all prints are professionally produced using archival pigment inks<br />
              on museum-grade gold fibre pearl baryta paper.<br />
              this premium fine-art paper offers exceptional colour depth,<br />
              rich blacks, and long-term archival stability,<br />
              ensuring each artwork is made to last for generations.
            </p>
            <p className="print-fine-print">
              orders are fulfilled with care. from printing to signing to packaging,<br />
              each piece is given the time it deserves —<br />
              typically 2–3 weeks before dispatch.
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
