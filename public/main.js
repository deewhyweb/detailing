document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
const status = form.querySelector('.form-status');
const button = form.querySelector('button[type="submit"]');

function setStatus(msg, kind) {
  status.textContent = msg;
  status.className = 'form-status' + (kind ? ' ' + kind : '');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    setStatus('Please fill in your name, a valid email, and a message.', 'err');
    form.reportValidity();
    return;
  }

  button.disabled = true;
  setStatus('Sending…');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.');
    form.reset();
    setStatus('Thank you! We’ll be in touch soon.', 'ok');
  } catch (err) {
    setStatus(err.message + ' You can also email info@hayes-detailing.com.', 'err');
  } finally {
    button.disabled = false;
  }
});
