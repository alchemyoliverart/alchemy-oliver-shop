const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { items } = req.body;
  const origin = req.headers.origin || 'https://www.alchemyoliver.com';

  try {
    const session = await stripe.checkout.sessions.create({
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
      shipping_address_collection: {
        allowed_countries: [
          'AU', 'NZ',
          'US', 'CA', 'GB', 'IE',
          'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PT', 'PL', 'GR',
          'JP', 'SG', 'HK', 'KR', 'TW',
        ],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'aud' },
            display_name: 'AU Standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 3000, currency: 'aud' },
            display_name: 'AU Express',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 4500, currency: 'aud' },
            display_name: 'International Standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 10 },
              maximum: { unit: 'business_day', value: 21 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 8500, currency: 'aud' },
            display_name: 'International Express',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
