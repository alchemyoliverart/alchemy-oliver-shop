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
// Welcome email HTML — matches site aesthetic (grey bg, cobalt blue, mono font)
// ---------------------------------------------------------------------------
function welcomeEmailHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>welcome :,)</title>
</head>
<body style="margin:0;padding:0;background:#D9D9D9;font-family:'JetBrains Mono',Menlo,Monaco,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#D9D9D9;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:40px;" align="left">
              <img src="https://www.alchemyoliver.com/Logo.png"
                   alt="alchemy oliver"
                   width="180"
                   style="display:block;border:0;max-width:180px;" />
            </td>
          </tr>

          <!-- Welcome heading -->
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #0000FF;">
              <h1 style="margin:0;font-size:14px;font-weight:400;color:#0000FF;text-transform:lowercase;line-height:1.6;letter-spacing:0.02em;">
                welcome :,)
              </h1>
            </td>
          </tr>

          <!-- Poem -->
          <tr>
            <td style="padding:32px 0 24px;">
              <p style="margin:0 0 20px;font-size:11px;color:#0000FF;text-transform:lowercase;line-height:1.4;font-style:italic;">
                &lsquo;petals, pixels, and memory&rsquo;
              </p>
              <p style="margin:0 0 20px;font-size:11px;color:#0000FF;text-transform:lowercase;line-height:1.4;">
                a practice of preservation -
              </p>
              <p style="margin:0 0 20px;font-size:11px;color:#0000FF;text-transform:lowercase;line-height:2;">
                light,<br />
                memory,<br />
                grief.
              </p>
              <p style="margin:0 0 32px;font-size:11px;color:#0000FF;text-transform:lowercase;line-height:2;">
                flowers gathered<br />
                from moments already fading,<br />
                held in light<br />
                through scanning<br />
                and digital layering.<br />
                quiet records<br />
                of impermanence.
              </p>
            </td>
          </tr>

          <!-- Discount -->
          <tr>
            <td style="padding-bottom:8px;">
              <p style="margin:0 0 12px;font-size:11px;color:#0000FF;text-transform:lowercase;line-height:1.8;">
                as a welcome gift, here is 10% off your first order:
              </p>
              <table cellpadding="0" cellspacing="0" style="border:1px solid #0000FF;">
                <tr>
                  <td style="padding:12px 24px;text-align:center;">
                    <span style="font-size:18px;font-weight:700;color:#0000FF;text-transform:uppercase;letter-spacing:0.12em;">
                      WELCOME10
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:8px 0 0;font-size:10px;color:#0000FF;text-transform:lowercase;opacity:0.7;">
                enter at checkout &mdash; one use per customer
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:32px 0;">
              <a href="https://www.alchemyoliver.com"
                 style="display:inline-block;font-size:11px;color:#0000FF;text-transform:lowercase;text-decoration:underline;">
                shop now &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;border-top:1px solid #0000FF;">
              <p style="margin:0;font-size:10px;color:#0000FF;text-transform:lowercase;opacity:0.6;line-height:1.8;">
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
