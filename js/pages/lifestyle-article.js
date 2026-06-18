/**
 * pages/lifestyle-article.js — Entry point for lifestyle article pages.
 *
 * Covers all sub-pages in lifestyle/:
 *   life-*, wellness-*, creativity-*, growth-*
 *
 * Differences from article.js:
 *  - Reading progress tied to #articleBody scroll container (not document)
 *  - Uses .reading-progress class (not #readingBar)
 *  - Links are one level deep (../js/...) not two
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

// ── Reading progress bar (article-body-relative) ──
const prog    = document.getElementById('readingProgress');
const artBody = document.getElementById('articleBody');
if (prog && artBody) {
  window.addEventListener('scroll', function () {
    const total    = artBody.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -artBody.getBoundingClientRect().top);
    prog.style.width = Math.min(100, (scrolled / total) * 100) + '%';
  }, { passive: true });
}

// ── Hero image Ken Burns trigger ──────────────────
const heroEl  = document.querySelector('.art-hero');
const heroImg = heroEl?.querySelector('.art-hero-photo, .art-hero-img');
if (heroEl && heroImg) {
  const activate = () => heroEl.classList.add('loaded');
  heroImg.complete ? activate() : heroImg.addEventListener('load', activate);
}
