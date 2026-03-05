import React, { useState } from 'react';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23D9D9D9'/%3E%3C/svg%3E";

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'print enquiry', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'something went wrong — please try again.');
        setStatus('error');
      } else {
        setStatus('success');
        setForm({ name: '', email: '', subject: 'print enquiry', message: '' });
      }
    } catch {
      setErrorMsg('could not reach the server — please try again or email directly.');
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <img src="/Logo.png" alt="Alchemy Oliver" className="contact-logo" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />

      <h1 className="contact-heading">contact</h1>

      <p className="contact-intro">
        i welcome enquiries for commissions, collections, and creative collaborations.
        if you'd like to work together or have any questions about the work,
        please get in touch via the form below or email:{' '}
        <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a>
      </p>

      <div className="contact-section">
        <h2 className="contact-subheading">framing</h2>
        <p className="contact-text">framing can be arranged on request and quoted individually depending on size and style.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">commissions</h2>
        <p className="contact-text">i offer bespoke commissions for individuals, interiors, and creative collaborations. each project begins with a conversation - exploring colour, botanical elements, atmosphere, and the story or space the work will inhabit.</p>
        <p className="contact-text">flowers may be gathered in response to a place, a memory, or a moment, so that the finished piece carries something personal within it.</p>
        <p className="contact-text">i also work with brands and creative partners on licensed designs, adapted prints, and site-specific installations - always with care, and always in keeping with the quiet language of my practice.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">returns & refunds</h2>
        <p className="contact-text">each alchemy oliver piece is original, digitally handcrafted and printed to order, so all sales are final. we don't offer refunds or returns for change of mind.</p>
        <p className="contact-text">if your order arrives damaged, email us directly at <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a> within 7 days with your order number, photos of the item and packaging, and a description of the issue. you can also use the form below (subject: returns/refunds) but please send photos via direct email so they reach us. we'll work with you to find a resolution.</p>
        <p className="contact-text">nothing in this policy limits your rights under australian consumer law.</p>
        <p className="contact-text">thank you for supporting independent art and alchemy oliver.</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">name</label>
          <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">email</label>
          <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">subject</label>
          <select className="form-input" name="subject" value={form.subject} onChange={handleChange}>
            <option value="print enquiry">print enquiry</option>
            <option value="commission">commission</option>
            <option value="framing">framing</option>
            <option value="collaboration">collaboration</option>
            <option value="returns/refunds">returns/refunds</option>
            <option value="other">other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">message</label>
          <textarea className="form-input form-textarea" name="message" value={form.message} onChange={handleChange} required />
        </div>
        {status === 'error' && (
          <p className="contact-form-error">{errorMsg}</p>
        )}
        <button type="submit" className="dm-button" disabled={status === 'sending'}>
          {status === 'sending' ? 'sending...' : 'send'}
        </button>
      </form>

      {status === 'success' && (
        <p className="contact-form-success">message sent — i'll be in touch soon :)</p>
      )}
    </div>
  );
}

export default ContactPage;
