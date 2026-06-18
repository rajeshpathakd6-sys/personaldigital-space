/**
 * pages/studio.js — Entry point for studio.html.
 */

// Core
import { initHeader }       from '../core/header.js';
import { initMobileMenu }   from '../core/mobile-menu.js';
import { initSearch }       from '../core/search.js';
import { initScrollReveal } from '../core/scroll-reveal.js';
import { initBackToTop }    from '../core/back-to-top.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initNewsletter }   from '../core/newsletter.js';

initHeader();
initMobileMenu();
initSearch();
initScrollReveal();
initBackToTop();
initSmoothScroll();
initNewsletter();

// ── Artwork row scroll arrows ──────────────────────────────
// Called by inline onclick="scrollRow(this, -1)" in studio.html.
// Using a named export so studio.html can call window.scrollRow.
window.scrollRow = function scrollRow(btn, dir) {
  const row = btn.parentElement.querySelector('.st-creation-row');
  if (!row) return;
  const card = row.querySelector('.st-creation-card');
  const cardW = card ? card.offsetWidth + 24 : 234;
  row.scrollBy({ left: dir * cardW * 3, behavior: 'smooth' });
};
