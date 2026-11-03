# Hayes Detailing — hayes-detailing.com

A one-page site for Hayes Detailing, with a working contact form. Express serves it from `public/`.

## Run locally

```bash
npm install
npm start            # http://localhost:3000
```

If SMTP is not set up, the server prints contact form submissions to the console.

## Email delivery (Google Workspace SMTP)

Contact form messages go through `smtp.gmail.com:465`, signed in as `SMTP_USER`, and are delivered to `CONTACT_TO`. Reply-To is set to the visitor's address.

On Fly.io, the non-secret settings are in `fly.toml` under `[env]`. The password is a Fly secret:

1. Turn on 2-Step Verification for the `SMTP_USER` Google account.
2. Create an App Password at https://myaccount.google.com/apppasswords.
3. Run `fly secrets set SMTP_PASS='xxxx xxxx xxxx xxxx'`. This redeploys the app.
4. Check `fly logs` for `SMTP ready`.

To send real email locally, copy `.env.example` to `.env`, fill it in, and run `node --env-file=.env server.js`.

## Structure

- `server.js`: static file server and `POST /api/contact` (validation, honeypot, rate limit)
- `public/index.html`: landing page (hero, services, about, contact)
- `public/styles.css`: black and rose-gold theme taken from the business card
- `public/main.js`: submits the form without a page reload
- `public/logo.svg`: line-art car logo, also used as the favicon
