const Stripe = require('stripe');
const nodemailer = require('nodemailer');

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const handler = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.payment_status === 'paid') {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const customerName = fullSession.customer_details?.name || 'Customer';
      const customerEmail = fullSession.customer_details?.email;
      const shippingAddr = fullSession.shipping_details?.address;
      const amountTotal = (fullSession.amount_total / 100).toFixed(2);
      const lineItems = fullSession.line_items?.data || [];

      const itemsText = lineItems
        .map(item => `  • ${item.description} x${item.quantity} — $${(item.amount_total / 100).toFixed(2)} AUD`)
        .join('\n');

      const shippingText = shippingAddr
        ? [
            shippingAddr.line1,
            shippingAddr.line2,
            shippingAddr.city,
            shippingAddr.state,
            shippingAddr.postal_code,
            shippingAddr.country,
          ].filter(Boolean).join(', ')
        : 'Not provided';

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Notify artist
      await transporter.sendMail({
        from: `"Alchemy Oliver" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO_EMAIL,
        subject: `New order from ${customerName} — $${amountTotal} AUD`,
        text: [
          `New order received!`,
          ``,
          `Customer: ${customerName}`,
          `Email: ${customerEmail || 'unknown'}`,
          `Total: $${amountTotal} AUD`,
          ``,
          `Items:`,
          itemsText,
          ``,
          `Ship to: ${shippingText}`,
          ``,
          `Stripe session: ${session.id}`,
          `Stripe dashboard: https://dashboard.stripe.com/payments/${session.payment_intent}`,
        ].join('\n'),
      });

      // Confirm to customer
      if (customerEmail) {
        await transporter.sendMail({
          from: `"Alchemy Oliver" <${process.env.SMTP_USER}>`,
          to: customerEmail,
          subject: `Your order from Alchemy Oliver`,
          text: [
            `Hi ${customerName},`,
            ``,
            `Thank you for your order — it truly means the world.`,
            ``,
            `Here's what you ordered:`,
            itemsText,
            ``,
            `Total: $${amountTotal} AUD`,
            `Ship to: ${shippingText}`,
            ``,
            `Each print is hand-signed and carefully packaged. You can expect despatch within 2–3 weeks.`,
            ``,
            `If you have any questions, feel free to reach out at alchemyoliver.com/contact`,
            ``,
            `With love,`,
            `Alchemy Oliver`,
          ].join('\n'),
        });
      }
    }
  }

  res.status(200).json({ received: true });
};

// Disable Vercel's automatic body parsing so Stripe can verify the raw body signature
handler.config = { api: { bodyParser: false } };

module.exports = handler;
