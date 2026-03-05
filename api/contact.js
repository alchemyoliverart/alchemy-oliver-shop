const nodemailer = require('nodemailer');

// ---------------------------------------------------------------------------
// Rate limiter — in-memory, per Vercel instance.
// Resets on cold start; fine for a low-traffic personal site.
// ---------------------------------------------------------------------------
const rateLimitMap = new Map();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

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

// ---------------------------------------------------------------------------
// Sanitisation helpers
// ---------------------------------------------------------------------------
const ALLOWED_SUBJECTS = new Set([
  'print enquiry',
  'commission',
  'framing',
  'collaboration',
  'returns/refunds',
  'other',
]);

// For header fields (name, email, subject) — strip newlines to prevent header injection
function sanitizeHeader(val, maxLen) {
  return String(val ?? '')
    .replace(/[\r\n\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
    .trim()
    .slice(0, maxLen);
}

// For body text — allow newlines but strip other control characters
function sanitizeBody(val, maxLen) {
  return String(val ?? '')
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
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

  const { name, email, subject, message } = req.body ?? {};

  const cleanName    = sanitizeHeader(name,    100);
  const cleanEmail   = sanitizeHeader(email,   254);
  const cleanSubject = sanitizeHeader(subject, 100);
  const cleanMessage = sanitizeBody(message,   2000);

  if (!cleanName)                           return res.status(400).json({ error: 'Name is required.' });
  if (!cleanEmail || !isValidEmail(cleanEmail)) return res.status(400).json({ error: 'A valid email address is required.' });
  if (!ALLOWED_SUBJECTS.has(cleanSubject))  return res.status(400).json({ error: 'Invalid subject.' });
  if (!cleanMessage)                        return res.status(400).json({ error: 'Message is required.' });

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from:    `"Alchemy Oliver" <${process.env.SMTP_USER}>`,
    to:      process.env.CONTACT_TO_EMAIL,
    replyTo: cleanEmail,
    subject: `[alchemyoliver.com] ${cleanSubject} — from ${cleanName}`,
    text:    `name: ${cleanName}\nemail: ${cleanEmail}\nsubject: ${cleanSubject}\n\n${cleanMessage}`,
  });

  return res.status(200).json({ ok: true });
};
