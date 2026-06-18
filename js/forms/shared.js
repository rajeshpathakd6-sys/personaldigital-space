/**
 * forms/shared.js — Shared form submission pattern.
 *
 * Handles the identical submit → loading → success/error → reset
 * cycle used by both contact.js and work-with-us.js.
 */

const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://api.routesandreflections.in';

/**
 * @param {Object} opts
 * @param {string}   opts.formId         ID of the <form> element
 * @param {string}   opts.submitSelector CSS selector for the submit button (within form)
 * @param {string}   opts.successMsgId   ID of the success message element
 * @param {string}   opts.endpoint       API endpoint path (e.g. '/api/contact')
 * @param {string}   opts.loadingText    Button text while submitting
 * @param {string}   opts.idleText       Button text at rest
 * @param {Function} [opts.buildPayload] fn(form) → body for fetch. Defaults to FormData.
 * @param {Object}   [opts.headers]      Extra headers. Defaults to empty (uses FormData).
 */
export function initForm({
  formId,
  submitSelector,
  successMsgId,
  endpoint,
  loadingText = 'Sending...',
  idleText = 'Send',
  buildPayload = null,
  headers = {},
}) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector(submitSelector);
    const msg = document.getElementById(successMsgId);

    if (btn) { btn.textContent = loadingText; btn.disabled = true; }

    try {
      const body    = buildPayload ? buildPayload(form) : new FormData(form);
      const fetchOpts = { method: 'POST', headers, body };

      const res  = await fetch(`${BASE_URL}${endpoint}`, fetchOpts);
      const data = await res.json();

      if (res.ok) {
        if (msg) msg.style.display = 'flex';
        form.reset();
        setTimeout(() => { if (msg) msg.style.display = 'none'; }, 6000);
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Server error. Please try again later.');
    }

    if (btn) { btn.textContent = idleText; btn.disabled = false; }
  });
}
