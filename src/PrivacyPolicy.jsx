import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="contact-page policy-page">
      <h1 className="contact-heading">privacy policy</h1>
      <p className="contact-text">atomic alchemy</p>
      <p className="contact-text">ABN: 21 481 257 887</p>
      <p className="contact-text" style={{ fontStyle: 'italic', marginBottom: '2rem' }}>last updated: 4 march 2026</p>

      <div className="contact-section">
        <h2 className="contact-subheading">1. introduction</h2>
        <p className="contact-text">Atomic Alchemy ("we", "us", "our") operates www.alchemyoliver.com and is committed to protecting your personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). this Privacy Policy explains what information we collect, how we use it, and your rights.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">2. information we collect</h2>
        <p className="contact-text" style={{ fontStyle: 'italic' }}>2.1 information you provide directly</p>
        <p className="contact-text">— name and email address submitted via the contact form</p>
        <p className="contact-text">— name, email address, and shipping address provided at checkout</p>
        <p className="contact-text">— payment information (processed securely by Stripe — we do not store card details)</p>
        <p className="contact-text" style={{ fontStyle: 'italic', marginTop: '0.75rem' }}>2.2 information collected automatically</p>
        <p className="contact-text">— basic analytics data via Vercel Analytics (privacy-focused, no cookies, no personal identifiers)</p>
        <p className="contact-text">— server logs including IP address and browser type for security and performance monitoring</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">3. how we use your information</h2>
        <p className="contact-text">we use your personal information to:</p>
        <p className="contact-text">— process and fulfil your orders</p>
        <p className="contact-text">— communicate with you about your order or enquiry</p>
        <p className="contact-text">— improve our website and customer experience</p>
        <p className="contact-text">— comply with legal obligations</p>
        <p className="contact-text" style={{ marginTop: '0.75rem' }}>we do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">4. third-party services</h2>
        <p className="contact-text">we use the following third-party services that may process your data:</p>
        <p className="contact-text">— Stripe (payment processing) — stripe.com/privacy</p>
        <p className="contact-text">— Vercel (website hosting and analytics) — vercel.com/legal/privacy-policy</p>
        <p className="contact-text">— Google (email via Gmail SMTP) — policies.google.com/privacy</p>
        <p className="contact-text" style={{ marginTop: '0.75rem' }}>each of these providers has their own privacy policy. we only share the minimum information necessary for them to provide their services.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">5. data storage and security</h2>
        <p className="contact-text">your data is stored on secure servers hosted by Vercel in the United States. we take reasonable steps to protect your personal information from misuse, interference, loss, and unauthorised access. however, no internet transmission is completely secure.</p>
        <p className="contact-text">we retain your order information for 7 years to comply with Australian tax law. contact form submissions are retained for 12 months then deleted.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">6. international transfers</h2>
        <p className="contact-text">as our hosting and payment providers are based overseas, your data may be transferred to and stored in countries outside Australia, including the United States. these countries may not have equivalent privacy protections to Australia. by using our website, you consent to this transfer.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">7. your rights</h2>
        <p className="contact-text">under the Privacy Act, you have the right to:</p>
        <p className="contact-text">— access the personal information we hold about you</p>
        <p className="contact-text">— request correction of inaccurate information</p>
        <p className="contact-text">— request deletion of your information (subject to legal retention requirements)</p>
        <p className="contact-text">— complain about a breach of your privacy</p>
        <p className="contact-text" style={{ marginTop: '0.75rem' }}>to exercise any of these rights, contact us at <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a>. we will respond within 30 days.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">8. cookies</h2>
        <p className="contact-text">our website does not use tracking cookies. Vercel Analytics collects anonymous, aggregated data only and does not identify individual users.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">9. complaints</h2>
        <p className="contact-text">if you are unsatisfied with our handling of your personal information, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">10. contact</h2>
        <p className="contact-text">for any privacy enquiries, contact Atomic Alchemy at <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a>.</p>
      </div>

      <Link to="/" className="policy-back">← back home</Link>
    </div>
  );
}
