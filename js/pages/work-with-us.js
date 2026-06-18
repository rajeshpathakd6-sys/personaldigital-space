/**
 * pages/work-with-us.js — Entry point for workwithus.html.
 */

// Core
import { initHeader }       from '../core/header.js';
import { initMobileMenu }   from '../core/mobile-menu.js';
import { initSearch }       from '../core/search.js';
import { initScrollReveal } from '../core/scroll-reveal.js';
import { initBackToTop }    from '../core/back-to-top.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initNewsletter }   from '../core/newsletter.js';

// Form handler
import { initWorkWithUsForm } from '../forms/work-with-us.js';

initHeader();
initMobileMenu();
initSearch();
initScrollReveal();
initBackToTop();
initSmoothScroll();
initNewsletter();
initWorkWithUsForm();

// ── Smooth scroll to #wwu-form CTA ────────────────────────
document.querySelectorAll('a[href="#wwu-form"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('wwu-form');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
