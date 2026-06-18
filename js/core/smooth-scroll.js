/**
 * smooth-scroll.js — Smooth scroll for in-page anchor links.
 * Correctly offsets for the sticky header height.
 */

export function initSmoothScroll() {
  const header = document.getElementById('siteHeader');

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 16;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
