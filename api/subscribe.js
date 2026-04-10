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
  <title>welcome to the list</title>
</head>
<body style="margin:0;padding:0;background:#D9D9D9;font-family:'JetBrains Mono',Menlo,Monaco,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#D9D9D9;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">

          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:11px;color:#0000FF;text-transform:lowercase;letter-spacing:0.05em;">
                alchemy oliver
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #0000FF;">
              <h1 style="margin:0;font-size:13px;font-weight:400;font-style:italic;color:#0000FF;text-transform:lowercase;line-height:1.6;">
                welcome to the list
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 0;">
              <p style="margin:0 0 16px;font-size:11px;color:#0000FF;text-transform:lowercase;line-height:1.8;">
                thank you for subscribing. you'll be the first to hear about new prints, limited releases, and occasional notes from the studio.
              </p>
              <p style="margin:0 0 8px;font-size:11px;color:#0000FF;text-transform:lowercase;line-height:1.8;">
                as a welcome gift, here is 10% off your first order:
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 0 24px;">
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

          <tr>
            <td style="padding-bottom:32px;">
              <a href="https://www.alchemyoliver.com"
                 style="display:inline-block;font-size:11px;color:#0000FF;text-transform:lowercase;text-decoration:underline;">
                shop now &rarr;
              </a>
            </td>
          </tr>

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
