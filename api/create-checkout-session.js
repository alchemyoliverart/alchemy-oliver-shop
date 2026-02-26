const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { items } = req.body;
  const origin = req.headers.origin || 'https://alchemy-oliver-shop.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(({ title, size, amount, imageUrl, quantity }) => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: `${title} — ${size}`,
            description: 'Limited edition fine art print, hand-signed with certificate of authenticity.',
            ...(imageUrl ? { images: [imageUrl] } : {}),
          },
          unit_amount: amount * 100,
        },
        quantity,
      })),
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
