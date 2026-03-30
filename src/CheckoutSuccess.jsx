import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23D9D9D9'/%3E%3C/svg%3E";

function CheckoutSuccess() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'paid' | 'invalid'

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId || !sessionId.startsWith('cs_')) {
      setStatus('invalid');
      return;
    }

    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.paid) {
          clearCart();
          setStatus('paid');
        } else {
          setStatus('invalid');
        }
      })
      .catch(() => setStatus('invalid'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="contact-page" style={{ textAlign: 'center' }}>
        <p className="contact-intro">verifying your order...</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="contact-page" style={{ textAlign: 'center' }}>
        <img src="/Logo.png" alt="Alchemy Oliver" className="contact-logo" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
        <h2 className="contact-heading">order not found</h2>
        <p className="contact-intro">
          we couldn't verify this order. if you believe this is an error, please <Link to="/contact" className="footer-link">get in touch</Link>.
        </p>
        <Link to="/" className="dm-button" style={{ marginTop: '1.5rem' }}>
          back to prints
        </Link>
      </div>
    );
  }

  return (
    <div className="contact-page" style={{ textAlign: 'center' }}>
      <img src="/Logo.png" alt="Alchemy Oliver" className="contact-logo" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
      <h2 className="contact-heading">thank you ;')</h2>
      <p className="contact-intro">
        your order has been received. a confirmation has been sent to your email.
      </p>
      <p className="contact-intro">
        each print is hand-signed and carefully packaged. you can expect despatch within 2–3 weeks.
      </p>
      <p className="contact-intro">
        thank you for choosing to support an independent artist and small business — it truly means the world ✨
      </p>
      <Link to="/" className="dm-button" style={{ marginTop: '1.5rem' }}>
        back to prints
      </Link>
    </div>
  );
}

export default CheckoutSuccess;
