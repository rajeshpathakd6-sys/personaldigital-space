/**
 * pages/article.js — Entry point for long-form article pages.
 * Same as shared-pages.js but also activates the reading progress bar.
 */

import { initHeader }       from '../core/header.js';
import { initMobileMenu }   from '../core/mobile-menu.js';
import { initSearch }       from '../core/search.js';
import { initScrollReveal } from '../core/scroll-reveal.js';
import { initBackToTop }    from '../core/back-to-top.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initNewsletter }   from '../core/newsletter.js';
import { throttle }         from '../core/utils.js';

initHeader();
initMobileMenu();
initSearch();
initScrollReveal();
initBackToTop();
initSmoothScroll();
initNewsletter();

// ── Reading progress bar ──────────────────────
const bar = document.getElementById('readingBar');
if (bar) {
  window.addEventListener('scroll', throttle(() => {
    const doc   = document.documentElement;
    const scrolled = doc.scrollTop || document.body.scrollTop;
    const total = doc.scrollHeight - doc.clientHeight;
    bar.style.width = total > 0 ? (scrolled / total) * 100 + '%' : '0%';
  }, 30), { passive: true });
}

// ── Hero image load → Ken Burns start ────────
const heroEl = document.querySelector('.art-hero');
const heroImg = heroEl?.querySelector('.art-hero-img');
if (heroEl && heroImg) {
  const activate = () => heroEl.classList.add('loaded');
  heroImg.complete ? activate() : heroImg.addEventListener('load', activate);
}
