/**
 * back-to-top.js — Back-to-top button visibility and scroll behaviour.
 */
import { throttle } from './utils.js';

export function initBackToTop() {
  const btt = document.getElementById('backToTop');
  if (!btt) return;

  window.addEventListener(
    'scroll',
    throttle(() => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, 100),
    { passive: true }
  );

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
