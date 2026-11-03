# Hayes Detailing — hayes-detailing.com

A one-page site for Hayes Detailing, with a working contact form. Express serves it from `public/`.

## Run locally

```bash
npm install
npm start            # http://localhost:3000
```

If SMTP is not set up, the server prints contact form submissions to the console.

## Email delivery

Copy `.env.example` to `.env`, fill in your SMTP details, and start the server with:

```bash
node --env-file=.env server.js
```

Messages go to `CONTACT_TO` (default `info@hayes-detailing.com`). Reply-To is set to the visitor's address.

## Structure

- `server.js`: static file server and `POST /api/contact` (validation, honeypot, rate limit)
- `public/index.html`: landing page (hero, services, about, contact)
- `public/styles.css`: black and rose-gold theme taken from the business card
- `public/main.js`: submits the form without a page reload
- `public/logo.svg`: line-art car logo, also used as the favicon
