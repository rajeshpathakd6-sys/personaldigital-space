/**
 * pages/index.js — Entry point for index.html.
 * Imports only what the homepage needs.
 */

// Core (runs on all pages)
import { initHeader }       from '../core/header.js';
import { initMobileMenu }   from '../core/mobile-menu.js';
import { initSearch }       from '../core/search.js';
import { initScrollReveal } from '../core/scroll-reveal.js';
import { initBackToTop }    from '../core/back-to-top.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initNewsletter }   from '../core/newsletter.js';

// Page-specific components
import { createSlideshow }  from '../components/slideshow.js';

// ── Shared init ──────────────────────────────────────────
initHeader();
initMobileMenu();
initSearch();
initScrollReveal();
initBackToTop();
initSmoothScroll();
initNewsletter();

// ── Hero slideshow ────────────────────────────────────────
createSlideshow({
  slideSelector: '.hero-slide',
  dotSelector:   '.hero-dot',
  interval:      5500,
  kenBurns:      true,
});

// ── Paginated posts grid ──────────────────────────────────
// ── Paginated posts grid ──────────────────────────────────
(function () {
  const grid          = document.getElementById('postsGrid');
  const paginationNav = document.getElementById('postsPagination');
  if (!grid || !paginationNav) return;

  const cards = Array.from(grid.querySelectorAll('.grid-post-card'));

  // Desktop: 3 articles per page
  // Mobile: 2 articles per page
  const getPerPage = () => window.innerWidth <= 620 ? 2 : 3;

  let perPage = getPerPage();
  let pages   = Math.ceil(cards.length / perPage);

  const WINDOW = 3;
  let current  = 1;

  function buildPagination() {
    paginationNav.innerHTML = '';

    const prev = document.createElement('button');
    prev.className = 'page-btn';
    prev.textContent = '← Prev';
    prev.disabled = current === 1;
    prev.onclick = () => showPage(current - 1);
    paginationNav.appendChild(prev);

    let start = Math.max(1, current - Math.floor(WINDOW / 2));
    let end   = Math.min(pages, start + WINDOW - 1);

    if (end > pages) {
      end = pages;
      start = Math.max(1, end - WINDOW + 1);
    }

    for (let p = start; p <= end; p++) {
      const btn = document.createElement('button');

      btn.className =
        'page-btn' +
        (p === current ? ' page-btn--active' : '');

      btn.textContent = p;
      btn.onclick = () => showPage(p);

      paginationNav.appendChild(btn);
    }

    if (end < pages) {
      const ell = document.createElement('span');
      ell.className = 'page-ellipsis';
      ell.textContent = '...';
      paginationNav.appendChild(ell);
    }

    const next = document.createElement('button');
    next.className = 'page-btn page-btn--next';
    next.textContent = 'Next →';
    next.disabled = current === pages;
    next.onclick = () => showPage(current + 1);
    paginationNav.appendChild(next);
  }

  function showPage(page) {
    current = Math.max(1, Math.min(page, pages));

    const start = (current - 1) * perPage;

    cards.forEach((card, i) => {
      card.style.display =
        (i >= start && i < start + perPage)
          ? 'flex'
          : 'none';
    });

    buildPagination();
  }

  function updatePaginationForViewport() {
    const newPerPage = getPerPage();

    if (newPerPage === perPage) return;

    // Keep the currently visible article range sensible
    const firstVisibleIndex = (current - 1) * perPage;

    perPage = newPerPage;
    pages = Math.ceil(cards.length / perPage);

    current = Math.floor(firstVisibleIndex / perPage) + 1;
    current = Math.min(current, pages);

    showPage(current);
  }

  // Recalculate if the user rotates the phone
  // or resizes the browser.
  window.addEventListener('resize', updatePaginationForViewport);

  showPage(1);
})();

// ── Active category nav ────────────────────────────────────
document.querySelectorAll('.cat-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.cat-nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
