/* ═══════════════════════════════════════════
   YOUR BLOG — script.js
   Sticky header · Mobile menu · Search bar ·
   Scroll reveal · Reading bar · Back to top ·
   Newsletter micro-interaction
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── throttle helper ── */
  function throttle(fn, ms) {
    let t = 0;
    return function (...a) {
      const now = Date.now();
      if (now - t >= ms) { t = now; fn.apply(this, a); }
    };
  }

  /* ═══════════════════════════════════════
     1. STICKY HEADER — add .scrolled class
     (used for box-shadow tweak on scroll)
  ═══════════════════════════════════════ */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', throttle(() => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, 80), { passive: true });
  }


  /* ═══════════════════════════════════════
     2. MOBILE MENU
  ═══════════════════════════════════════ */
  const burger   = document.getElementById('burger');
  const mobMenu  = document.getElementById('mobMenu');
  const mobClose = document.getElementById('mobClose');
  let mobOpen = false;

  function openMob() {
    mobOpen = true;
    mobMenu.classList.add('open');
    burger && burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMob() {
    mobOpen = false;
    mobMenu && mobMenu.classList.remove('open');
    burger && burger.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeMob = closeMob; /* expose for inline onclick */

  burger  && burger.addEventListener('click',  () => mobOpen ? closeMob() : openMob());
  mobClose && mobClose.addEventListener('click', closeMob);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMob(); });


  /* ═══════════════════════════════════════
     3. SEARCH BAR
  ═══════════════════════════════════════ */
  const searchToggle = document.getElementById('searchToggle');
  const searchBar    = document.getElementById('searchBar');
  const searchClose  = document.getElementById('searchClose');
  const searchInput  = document.getElementById('searchInput');

  function openSearch() {
    searchBar && searchBar.classList.add('open');
    searchInput && setTimeout(() => searchInput.focus(), 200);
  }
  function closeSearch() {
    searchBar && searchBar.classList.remove('open');
  }

  searchToggle && searchToggle.addEventListener('click', openSearch);
  searchClose  && searchClose.addEventListener('click',  closeSearch);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });


  /* ═══════════════════════════════════════
     4. SCROLL REVEAL
  ═══════════════════════════════════════ */
  const reveals = document.querySelectorAll('.js-reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }


  /* ═══════════════════════════════════════
     5. READING PROGRESS BAR (post page)
  ═══════════════════════════════════════ */
  const readingBar = document.getElementById('readingBar');
  if (readingBar) {
    window.addEventListener('scroll', throttle(() => {
      const doc   = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total    = doc.scrollHeight - doc.clientHeight;
      readingBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    }, 30), { passive: true });
  }


  /* ═══════════════════════════════════════
     6. BACK TO TOP
  ═══════════════════════════════════════ */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', throttle(() => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, 100), { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ═══════════════════════════════════════
     7. SMOOTH SCROLL for anchor links
  ═══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        closeMob();
        const offset = (header ? header.offsetHeight : 0) + 16;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ═══════════════════════════════════════
     8. NEWSLETTER MICRO-INTERACTION
     Works for both sidebar and any inline
     subscribe buttons on the page.
  ═══════════════════════════════════════ */
  document.querySelectorAll('.widget-subscribe-btn, #sidebarSubBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const widget = btn.closest('.widget') || btn.closest('.nl-section');
      const input  = widget && widget.querySelector('input[type="email"], .widget-email-input');

      if (input && input.value.trim() && input.value.includes('@')) {
        const orig = btn.textContent;
        btn.textContent = '✓ You\'re subscribed!';
        btn.style.background = '#4a7c5c';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3500);
      } else {
        if (input) {
          input.style.borderColor = 'var(--accent)';
          input.focus();
          setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
      }
    });
  });


  /* ═══════════════════════════════════════
     9. ACTIVE NAV LINK based on scroll
     (highlights category nav on index page)
  ═══════════════════════════════════════ */
  const catLinks = document.querySelectorAll('.cat-nav-link');
  if (catLinks.length) {
    // On index page: highlight "All Posts" always (static).
    // You can extend this later for JS-filtered category views.
    catLinks.forEach(link => {
      link.addEventListener('click', () => {
        catLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

})();
