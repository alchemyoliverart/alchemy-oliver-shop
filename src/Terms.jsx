import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="contact-page policy-page">
      <h1 className="contact-heading">terms & conditions</h1>
      <p className="contact-text">atomic alchemy</p>
      <p className="contact-text">ABN: 21 481 257 887</p>
      <p className="contact-text" style={{ fontStyle: 'italic', marginBottom: '2rem' }}>last updated: 4 march 2026</p>

      <div className="contact-section">
        <h2 className="contact-subheading">1. about us</h2>
        <p className="contact-text">Atomic Alchemy (ABN 21 481 257 887) is an Australian sole trader selling original scanography art prints via www.alchemyoliver.com. by placing an order or using our website, you agree to these Terms & Conditions.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">2. products</h2>
        <p className="contact-text">all prints are produced and shipped by us. while we take care to accurately represent our products, colours may vary slightly between screens and printed output due to monitor calibration and printing processes.</p>
        <p className="contact-text">purchasing a print does not transfer copyright or any reproduction rights. all artwork remains the intellectual property of Atomic Alchemy. you may not reproduce, distribute, or create derivative works from our prints without written permission.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">3. pricing</h2>
        <p className="contact-text">all prices are listed in Australian Dollars (AUD). Atomic Alchemy is not currently registered for GST; prices shown are the total price with no GST component.</p>
        <p className="contact-text">we reserve the right to change prices at any time. the price at the time of your order is the price you pay.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">4. orders and payment</h2>
        <p className="contact-text">orders are processed once payment is confirmed. we accept payment via Stripe (credit and debit cards). payment information is processed securely by Stripe and is not stored by us.</p>
        <p className="contact-text">we reserve the right to cancel any order at our discretion, in which case a full refund will be issued.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">5. shipping</h2>
        <p className="contact-text" style={{ fontStyle: 'italic' }}>processing time</p>
        <p className="contact-text">orders are typically dispatched within 3–5 business days of payment confirmation.</p>
        <p className="contact-text" style={{ fontStyle: 'italic', marginTop: '0.75rem' }}>delivery estimates</p>
        <p className="contact-text">— Australia: 3–10 business days after dispatch</p>
        <p className="contact-text">— International: 10–21 business days after dispatch (varies by destination)</p>
        <p className="contact-text" style={{ marginTop: '0.75rem' }}>delivery times are estimates only and are not guaranteed. we are not responsible for delays caused by carriers, customs, or circumstances outside our control.</p>
        <p className="contact-text" style={{ fontStyle: 'italic', marginTop: '0.75rem' }}>tracking</p>
        <p className="contact-text">where available, tracking information will be provided via email after dispatch.</p>
        <p className="contact-text" style={{ fontStyle: 'italic', marginTop: '0.75rem' }}>international orders</p>
        <p className="contact-text">international customers are responsible for any customs duties, taxes, or import fees applicable in their country. we are not responsible for orders held or delayed by customs.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">6. Australian consumer law</h2>
        <p className="contact-text">our products come with guarantees that cannot be excluded under the Australian Consumer Law. nothing in these Terms limits or excludes your statutory rights. please refer to our <Link to="/refund-policy" className="contact-email">Refund & Returns Policy</Link> for full details.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">7. intellectual property</h2>
        <p className="contact-text">all content on www.alchemyoliver.com, including images, text, and artwork, is the property of Atomic Alchemy and is protected by Australian and international copyright law. you may not use our content without written permission.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">8. limitation of liability</h2>
        <p className="contact-text">to the extent permitted by law, our liability for any claim arising from a purchase is limited to the purchase price of the relevant product. we are not liable for any indirect, incidental, or consequential loss.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">9. privacy</h2>
        <p className="contact-text">your use of our website is also governed by our <Link to="/privacy-policy" className="contact-email">Privacy Policy</Link>, available at www.alchemyoliver.com.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">10. governing law</h2>
        <p className="contact-text">these Terms are governed by the laws of Victoria, Australia. any disputes will be subject to the exclusive jurisdiction of the courts of Victoria.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">11. changes to these terms</h2>
        <p className="contact-text">we may update these Terms at any time. changes take effect when posted to our website. continued use of our website after changes constitutes acceptance of the updated Terms.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">12. contact</h2>
        <p className="contact-text">for any questions about these Terms, contact Atomic Alchemy at <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a>.</p>
      </div>

      <Link to="/" className="policy-back">← back home</Link>
    </div>
  );
}
