/**
 * newsletter.js — Newsletter form submission with API call.
 * Handles all .nl-form instances on a page (sidebar + footer + inline).
 */

const BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://api.routesandreflections.in';

export function initNewsletter() {
  document.querySelectorAll('.nl-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"], .nl-btn');

      // Basic validation
      if (!input?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        if (input) {
          input.style.borderColor = 'var(--accent)';
          input.focus();
          setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
        return;
      }

      const email = input.value.trim();
      const orig  = btn ? btn.textContent : '';

      try {
        const response = await fetch(`${BASE_URL}/api/newsletter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (btn) {
            btn.textContent = data.message || 'Already subscribed';
            btn.style.background = '#b94a48';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
          }
          return;
        }

        // Success
        if (btn) {
          btn.textContent = '✓ Subscribed!';
          btn.style.background = '#4a7c5c';
          btn.disabled = true;
        }
        input.value = '';

        setTimeout(() => {
          if (btn) { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; }
        }, 4000);

      } catch (err) {
        console.error(err);
        if (btn) { btn.textContent = 'Error. Try again'; btn.style.background = '#b94a48'; }
      }
    });
  });
}
