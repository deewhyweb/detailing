# Hayes Detailing — hayes-detailing.com

A one-page site for Hayes Detailing, with a working contact form. Express serves it from `public/`.

## Run locally

```bash
npm install
npm start            # http://localhost:3000
```

If SMTP is not set up, the server prints contact form submissions to the console.

## Email delivery (Resend)

Contact form messages are sent through Resend (`smtp.resend.com:465`) from `info@hayes-detailing.com` and delivered to `CONTACT_TO`, the Google Workspace inbox. Reply-To is set to the visitor's address.

Resend is used instead of signing in to Gmail. When the site signed in as the same Google account it was sending to, Gmail filed the messages under Sent instead of the Inbox.

On Fly.io, the non-secret settings are in `fly.toml` under `[env]`. The Resend API key is a Fly secret:

1. In Resend, verify `hayes-detailing.com` by adding its DNS records at IONOS.
2. Create an API key with "Sending access".
3. Run `fly secrets set SMTP_PASS='re_...'`. This redeploys the app.
4. Check `fly logs` for `SMTP ready` and, after a submission, `Contact email sent`.

To send real email locally, copy `.env.example` to `.env`, fill it in, and run `node --env-file=.env server.js`.

## Structure

- `server.js`: static file server and `POST /api/contact` (validation, honeypot, rate limit)
- `public/index.html`: landing page (hero, services, about, contact)
- `public/styles.css`: black and rose-gold theme taken from the business card
- `public/main.js`: submits the form without a page reload
- `public/logo.svg`: line-art car logo, also used as the favicon
