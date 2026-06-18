/**
 * pages/lifestyle-category.js — Entry point for lifestyle category listing pages.
 *
 * Covers: lifestyle-all, lifestyle-creativity, lifestyle-growth,
 *         lifestyle-life, lifestyle-wellness
 *
 * Extra: filterPosts() for the search/filter UI on lifestyle-all.html
 * The function is exposed on window so inline onclick attrs still work.
 */

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

// ── Post filter (lifestyle-all.html) ─────────────
// Exposed globally so onclick="filterPosts(this,'all')" still works.
window.filterPosts = function (btn, cat) {
  document.querySelectorAll('.sf-btn').forEach(b => b.classList.remove('sf-active'));
  btn.classList.add('sf-active');

  const cards = document.querySelectorAll('.sc');
  let visible = 0;
  cards.forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? 'flex' : 'none';
    if (show) visible++;
  });

  const countEl = document.getElementById('spCount');
  const emptyEl = document.getElementById('spEmpty');
  if (countEl) {
    countEl.textContent = visible === 0 ? '' :
      cat === 'all' ? `Showing all ${visible} posts` :
      `Showing ${visible} post${visible === 1 ? '' : 's'} in ${btn.textContent}`;
  }
  if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
};
