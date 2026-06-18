/**
 * pages/lifestyle.js — Entry point for lifestyle.html.
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

// ── Paginated lifestyle grid ──────────────────────────────
(function () {
  const grid          = document.getElementById('lsPostsGrid');
  const paginationNav = document.getElementById('lsPostsPagination');
  if (!grid || !paginationNav) return;

  const cards   = Array.from(grid.querySelectorAll('.ls-card'));
  const perPage = 3;
  const pages   = Math.ceil(cards.length / perPage);
  const WINDOW  = 2;
  let current   = 1;

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
    if (end > pages) { end = pages; start = Math.max(1, end - WINDOW + 1); }

    for (let p = start; p <= end; p++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (p === current ? ' page-btn--active' : '');
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
    const s = (current - 1) * perPage;
    cards.forEach((c, i) => { c.style.display = (i >= s && i < s + perPage) ? 'flex' : 'none'; });
    buildPagination();
  }

  showPage(1);
})();

// ── Lifestyle sub-nav dropdowns ───────────────────────────
(function () {
  const navItems = document.querySelectorAll('.ls-nav-item');
  const overlay  = document.getElementById('lsOverlay');
  if (!navItems.length || !overlay) return;

  function closeAll() {
    navItems.forEach((item) => {
      item.classList.remove('ls-open');
      const btn = item.querySelector('button.ls-nav-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
    overlay.classList.remove('ls-open');
  }

  navItems.forEach((item) => {
    const btn  = item.querySelector('button.ls-nav-btn');
    const drop = item.querySelector('.ls-dropdown');

    if (!drop) {
      btn && btn.addEventListener('click', () => {
        document.querySelectorAll('.ls-nav-btn').forEach(b => b.classList.remove('ls-active'));
        btn.classList.add('ls-active');
        closeAll();
      });
      return;
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = item.classList.contains('ls-open');
      closeAll();
      if (!wasOpen) {
        item.classList.add('ls-open');
        btn.setAttribute('aria-expanded', 'true');
        overlay.classList.add('ls-open');
      }
    });
  });

  overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  document.querySelectorAll('.ls-dd-link, .ls-dd-all').forEach(l => l.addEventListener('click', closeAll));
  document.addEventListener('mousedown', (e) => { if (!e.target.closest('.ls-nav-item')) closeAll(); });
})();
