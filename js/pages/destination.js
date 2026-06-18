/**
 * pages/destination.js — Entry point for destination sub-pages.
 *
 * Covers: destinations/japan-kamikochi, destinations/kenya-diani,
 *         destinations/taiwan-east-rift-valley, destinations/thailand-koh-kradan
 *         and all future destination detail pages.
 *
 * Extra beyond shared-pages:
 *   - Hero background image: adds .loaded to #heroBg after 100ms
 *     (triggers CSS transition from `loading` → `loaded` state)
 *   - js-reveal with a tighter 0.06 threshold (matches original inline observer)
 */

import { initHeader }       from '../core/header.js';
import { initMobileMenu }   from '../core/mobile-menu.js';
import { initSearch }       from '../core/search.js';
import { initBackToTop }    from '../core/back-to-top.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initNewsletter }   from '../core/newsletter.js';
import { createReveal }     from '../core/scroll-reveal.js';

initHeader();
initMobileMenu();
initSearch();
initBackToTop();
initSmoothScroll();
initNewsletter();

// ── Hero background image load-in ─────────────────
// Adds .loaded class after a brief paint delay so the CSS
// `opacity: 0 → 1` transition fires correctly on first render.
document.addEventListener('DOMContentLoaded', () => {
  const heroBg = document.getElementById('heroBg');
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
});

// ── Scroll reveal (tighter threshold than global default) ─
createReveal({
  selector:    '.js-reveal',
  activeClass: 'visible',
  threshold:   0.06,
});
