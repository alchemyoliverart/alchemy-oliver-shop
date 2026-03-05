import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="contact-page policy-page">
      <h1 className="contact-heading">refund & returns policy</h1>
      <p className="contact-text">atomic alchemy</p>
      <p className="contact-text">ABN: 21 481 257 887</p>
      <p className="contact-text" style={{ fontStyle: 'italic', marginBottom: '2rem' }}>last updated: 4 march 2026</p>

      <div className="contact-section">
        <h2 className="contact-subheading">1. your rights under Australian consumer law</h2>
        <p className="contact-text">our products come with guarantees that cannot be excluded under the Australian Consumer Law (ACL). you are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. you are also entitled to have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not amount to a major failure.</p>
        <p className="contact-text">nothing in this policy limits or excludes your rights under the ACL.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">2. change of mind</h2>
        <p className="contact-text">we do not offer refunds or exchanges for change of mind. each print is produced and shipped by us individually. please review product descriptions, dimensions, and images carefully before purchasing.</p>
        <p className="contact-text">if you are unsure about a print, please contact us before ordering and we will do our best to help.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">3. damaged or defective items</h2>
        <p className="contact-text">if your order arrives damaged or defective, we will offer a full replacement or refund at no cost to you. to be eligible:</p>
        <p className="contact-text">— contact us within 14 days of receiving your order</p>
        <p className="contact-text">— email <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a> with your order number and clear photos of the damage</p>
        <p className="contact-text">— we will assess your claim and respond within 3 business days</p>
        <p className="contact-text" style={{ marginTop: '0.75rem' }}>we may request the damaged item be returned before issuing a replacement or refund. if return shipping is required due to our error, we will cover that cost.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">4. incorrect item received</h2>
        <p className="contact-text">if you receive an item that is different from what you ordered, contact us within 14 days with your order number and a photo of the item received. we will arrange a replacement or refund at no cost to you.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">5. items lost in transit</h2>
        <p className="contact-text">if your order has not arrived within the estimated delivery window, please contact us. for orders confirmed as lost by the carrier, we will offer a replacement or refund.</p>
        <p className="contact-text">we are not responsible for delays caused by customs, natural disasters, or other circumstances beyond our control. however, we will always work with you to find a resolution.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">6. how to request a refund or replacement</h2>
        <p className="contact-text">email us at <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a> with:</p>
        <p className="contact-text">— your order number</p>
        <p className="contact-text">— a description of the issue</p>
        <p className="contact-text">— photos where relevant</p>
        <p className="contact-text" style={{ marginTop: '0.75rem' }}>approved refunds will be processed to your original payment method within 5–10 business days.</p>
      </div>

      <div className="contact-section">
        <h2 className="contact-subheading">7. contact</h2>
        <p className="contact-text">for any questions about this policy, contact Atomic Alchemy at <a href="mailto:atomic.alchemyo@gmail.com" className="contact-email">atomic.alchemyo@gmail.com</a>.</p>
      </div>

      <Link to="/" className="policy-back">← back home</Link>
    </div>
  );
}
