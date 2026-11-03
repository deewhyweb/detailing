'use strict';

const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;
const CONTACT_TO = process.env.CONTACT_TO || 'info@hayes-detailing.com';
const CONTACT_FROM = process.env.CONTACT_FROM || 'Hayes Detailing Website <no-reply@hayes-detailing.com>';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// Mail transport: configured via SMTP_* env vars. Without them, submissions are logged to the console.
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

// Very small in-memory rate limit: 5 submissions per IP per 15 minutes.
const hits = new Map();
const WINDOW_MS = 15 * 60 * 1000;
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v, max) => String(v ?? '').trim().slice(0, max);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', async (req, res) => {
  const body = req.body || {};

  // Honeypot: real visitors never fill this hidden field.
  if (body.company) return res.json({ ok: true });

  if (rateLimited(req.ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
  }

  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    vehicle: clean(body.vehicle, 120),
    service: clean(body.service, 60),
    message: clean(body.message, 4000),
  };

  if (!data.name || !EMAIL_RE.test(data.email) || !data.message) {
    return res.status(400).json({ ok: false, error: 'Please provide your name, a valid email, and a message.' });
  }

  const text = [
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone || '-'}`,
    `Vehicle: ${data.vehicle || '-'}`,
    `Service: ${data.service || '-'}`,
    '',
    data.message,
  ].join('\n');

  try {
    if (transporter) {
      await transporter.sendMail({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        replyTo: data.email,
        subject: `Website inquiry from ${data.name}`,
        text,
      });
    } else {
      console.log('--- New contact submission (SMTP not configured) ---\n' + text + '\n');
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to send contact email:', err);
    res.status(500).json({ ok: false, error: `Sorry, something went wrong. Please email us at ${CONTACT_TO}.` });
  }
});

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`Hayes Detailing running at http://localhost:${PORT}`);
  if (!transporter) console.log('SMTP not configured — contact submissions will be logged here.');
});
