// ---------------------------------------------------------------------------
// Rate limiter — in-memory, per Vercel instance.
// ---------------------------------------------------------------------------
const rateLimitMap = new Map();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Strip newlines / control chars to prevent header injection
function sanitizeEmail(val) {
  return String(val ?? '')
    .replace(/[\r\n\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
    .trim()
    .slice(0, 254);
}

// ---------------------------------------------------------------------------
// Welcome email HTML — blue bg, white text, mono font
// ---------------------------------------------------------------------------
function welcomeEmailHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>welcome :,)</title>
</head>
<body style="margin:0;padding:0;background:#0000FF;font-family:'JetBrains Mono',Menlo,Monaco,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0000FF;padding:40px 32px;">
    <tr>
      <td align="left">
        <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

          <!-- Flower graphic top left -->
          <tr>
            <td style="padding-bottom:16px;">
              <img src="https://www.alchemyoliver.com/FlowerGRaphic.png"
                   alt=""
                   width="80"
                   style="display:block;border:0;max-width:80px;" />
            </td>
          </tr>

          <!-- Welcome + subtitle -->
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0 0 6px;font-size:14px;font-weight:400;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:lowercase;line-height:1.4;">
                welcome :,)
              </h1>
              <p style="margin:0;font-size:11px;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:lowercase;line-height:1.5;">
                you are now a part of the alchemy oliver studio
              </p>
            </td>
          </tr>

          <!-- Body text -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0 0 10px;font-size:11px;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:lowercase;line-height:1.8;">
                thank you for subscribing.<br />
                you'll be the first to hear about new prints,<br />
                limited releases, and occasional notes from the studio.
              </p>
            </td>
          </tr>

          <!-- Discount -->
          <tr>
            <td style="padding-bottom:6px;">
              <p style="margin:0 0 12px;font-size:11px;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:lowercase;line-height:1.8;">
                as a welcome gift, here is 10% off your first order:
              </p>
              <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.08em;">
                WELCOME10
              </p>
              <p style="margin:0 0 20px;font-size:10px;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:lowercase;opacity:0.75;">
                enter at checkout &mdash; one use per customer
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding-bottom:40px;">
              <a href="https://www.alchemyoliver.com"
                 style="font-size:11px;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:lowercase;text-decoration:underline;">
                shop now &rarr;
              </a>
            </td>
          </tr>

          <!-- Bottom logo -->
          <tr>
            <td style="padding-bottom:24px;">
              <img src="https://www.alchemyoliver.com/Black_White_Logo.png"
                   alt="alchemy oliver"
                   width="200"
                   style="display:block;border:0;max-width:200px;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <p style="margin:0;font-size:10px;color:#ffffff;font-family:'JetBrains Mono',Menlo,Monaco,monospace;text-transform:lowercase;opacity:0.5;line-height:1.8;">
                &copy; 2026 alchemy oliver &mdash; scanography &amp; multimedia artist<br />
                you're receiving this because you subscribed at alchemyoliver.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — please wait a few minutes and try again.' });
  }

  const { email } = req.body ?? {};
  const cleanEmail = sanitizeEmail(email);

  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Email service not configured.' });
  }

  // Add to Resend audience — auto-discover the audience ID if not set
  let audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    const listRes = await fetch('https://api.resend.com/audiences', {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (listRes.ok) {
      const listData = await listRes.json().catch(() => ({}));
      audienceId = listData?.data?.[0]?.id;
    }
  }

  if (audienceId) {
    const contactRes = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail, audience_id: audienceId, unsubscribed: false }),
    });

    // 409 = already subscribed — not an error worth surfacing
    if (!contactRes.ok && contactRes.status !== 409) {
      const err = await contactRes.json().catch(() => ({}));
      console.error('Resend contacts error:', err);
      return res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
    }
  }

  // Send welcome email via Resend
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'Alchemy Oliver <hello@alchemyoliver.com>';
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [cleanEmail],
      subject: 'welcome — 10% off your first order',
      html: welcomeEmailHtml(),
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.json().catch(() => ({}));
    console.error('Resend send error:', err);
    return res.status(500).json({ error: 'Failed to send welcome email. Please try again.' });
  }

  return res.status(200).json({ ok: true });
};
