import React from 'react';
import { Link } from 'react-router-dom';

function CheckoutSuccess() {
  return (
    <div className="contact-page" style={{ textAlign: 'center' }}>
      <img src="/Logo.png" alt="Alchemy Oliver" className="contact-logo" />
      <h2 className="contact-heading">thank you</h2>
      <p className="contact-intro">
        your order has been received. a confirmation has been sent to your email.
      </p>
      <p className="contact-intro">
        each print is hand-signed and carefully packaged. you can expect despatch within 2–3 weeks.
      </p>
      <Link to="/" className="dm-button" style={{ marginTop: '1.5rem' }}>
        back to prints
      </Link>
    </div>
  );
}

export default CheckoutSuccess;
