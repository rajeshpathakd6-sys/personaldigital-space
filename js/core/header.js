/**
 * header.js — Sticky header: adds .scrolled class on scroll.
 * Self-contained; safe to call on any page that has #siteHeader.
 */
import { throttle } from './utils.js';

export function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener(
    'scroll',
    throttle(() => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, 80),
    { passive: true }
  );
}
