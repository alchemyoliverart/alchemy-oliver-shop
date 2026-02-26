import React, { useState } from 'react';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'print enquiry', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:atomic.alchemyo@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`name: ${form.name}\nemail: ${form.email}\n\n${form.message}`)}`;
  };

  return (
    <div className="contact-page">
      <img src="/Logo.png" alt="Alchemy Oliver" className="contact-logo" />

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
            <option value="other">other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">message</label>
          <textarea className="form-input form-textarea" name="message" value={form.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="dm-button">send</button>
      </form>
    </div>
  );
}

export default ContactPage;
