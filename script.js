/**
 * ════════════════════════════════════════════════════════════════════
 * ADIRAJ — GLOBAL SCRIPT  (script.js)
 *
 * This is the LEGACY COMPATIBLE bundle.
 * It is included on pages that have NOT yet been migrated to the
 * new ES-module architecture (js/pages/*.js).
 *
 * On migrated pages this file should be REMOVED from the <script>
 * tag — those pages load js/pages/<page>.js instead, which imports
 * only what it needs from the modular js/ tree.
 *
 * TABLE OF CONTENTS
 * ─────────────────────────────────────────────────────────────────
 *  §1   Shared utility: throttle
 *  §2   Sticky header (.scrolled class on scroll)
 *  §3   Mobile menu (open/close/focus-trap/ARIA)
 *  §4   Search bar (open/close/ARIA)
 *  §5   Scroll reveal — .js-reveal → .visible
 *  §6   Scroll reveal — .reveal   → .visible  (travel page)
 *  §7   Reading progress bar (#readingBar + .reading-bar)
 *  §8   Back-to-top button
 *  §9   Smooth scroll (anchor links with header offset)
 *  §10  Newsletter form (all .nl-form instances)
 *  §11  Contact form (#contactForm)
 *  §12  Index hero slideshow (.hero-slide / .hero-dot)
 *  §13  Index paginated posts grid (#postsGrid)
 *  §14  Index category nav (.cat-nav-link)
 *  §15  Work-with-us scroll-reveal (.sr → .in)
 *  §16  Work-with-us form (#wwuForm)
 *  §17  Lifestyle sub-nav dropdowns (.ls-nav-item)
 *  §18  Lifestyle paginated posts grid (#lsPostsGrid)
 *  §19  Travel hero slideshow (.dhv2-slide)
 *  §20  Popular destinations slider (#destPopTrack)
 *  §21  Itinerary slider (#itinTrack)
 *  §22  Destination map: filter, hover, accordion, pin positioning
 *  §23  Studio scrollRow() (artwork rows)
 *  §24  Destination detail pages (#heroBg load trigger)
 *  §25  Lifestyle article reading progress (#readingProgress + #articleBody)
 *  §26  Lifestyle category filter (window.filterPosts)
 *  §27  Work-with-us CTA smooth scroll (a[href="#wwu-form"])
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     §1  THROTTLE UTILITY
  ────────────────────────────────────────── */
  function throttle(fn, ms) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= ms) { last = now; fn.apply(this, arguments); }
    };
  }


  /* ──────────────────────────────────────────
     §2  STICKY HEADER
     Adds/removes .scrolled on #siteHeader
     as the user scrolls past 10px.
  ────────────────────────────────────────── */
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', throttle(function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, 80), { passive: true });
  }


  /* ──────────────────────────────────────────
     §3  MOBILE MENU
     Fully ARIA-compliant: role="dialog",
     aria-modal, focus-trap, Escape key.
     Event delegation replaces onclick="closeMob()".
  ────────────────────────────────────────── */
  var burger   = document.getElementById('burger');
  var mobMenu  = document.getElementById('mobMenu');
  var mobClose = document.getElementById('mobClose');
  var mobOpen  = false;

  if (burger && mobMenu) {
    mobMenu.setAttribute('role', 'dialog');
    mobMenu.setAttribute('aria-modal', 'true');
    mobMenu.setAttribute('aria-label', 'Site navigation');

    function getFocusable() {
      return Array.from(mobMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')).filter(function (el) { return !el.disabled; });
    }

    function openMob() {
      mobOpen = true;
      mobMenu.classList.add('open');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = getFocusable()[0];
      if (first) first.focus();
    }

    function closeMob() {
      mobOpen = false;
      mobMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    }

    // Focus trap
    mobMenu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = getFocusable();
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });

    burger.addEventListener('click', function () { mobOpen ? closeMob() : openMob(); });
    if (mobClose) mobClose.addEventListener('click', closeMob);

    // Escape
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mobOpen) closeMob(); });

    // Event delegation — close on any nav link click (replaces onclick="closeMob()")
    var mobNav = mobMenu.querySelector('.mob-nav');
    if (mobNav) {
      mobNav.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMob();
      });
    }
  }


  /* ──────────────────────────────────────────
     §4  SEARCH BAR
     Adds aria-label to input (accessibility fix).
  ────────────────────────────────────────── */
  var searchToggle = document.getElementById('searchToggle');
  var searchBar    = document.getElementById('searchBar');
  var searchClose  = document.getElementById('searchClose');
  var searchInput  = document.getElementById('searchInput');

  if (searchToggle && searchBar) {
    if (searchInput && !searchInput.getAttribute('aria-label')) {
      searchInput.setAttribute('aria-label', 'Search posts, destinations, topics');
    }

    searchBar.setAttribute('aria-hidden', 'true');

    function openSearch() {
      searchBar.classList.add('open');
      searchBar.setAttribute('aria-hidden', 'false');
      if (searchInput) setTimeout(function () { searchInput.focus(); }, 200);
    }

    function closeSearch() {
      searchBar.classList.remove('open');
      searchBar.setAttribute('aria-hidden', 'true');
    }

    searchToggle.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });
  }


  /* ──────────────────────────────────────────
     §5  SCROLL REVEAL — .js-reveal → .visible
     Used on: index, about, studio, lifestyle
  ────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.js-reveal');
    if (revealEls.length) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(function (el) { revealIO.observe(el); });
    }

    /* ─ §6  .reveal → .visible (travel page) ─ */
    var travelRevealEls = document.querySelectorAll('.reveal');
    if (travelRevealEls.length) {
      var travelRevealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            travelRevealIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      travelRevealEls.forEach(function (el) { travelRevealIO.observe(el); });
    }
  } else {
    // Fallback for very old browsers
    document.querySelectorAll('.js-reveal, .reveal').forEach(function (el) { el.classList.add('visible'); });
  }


  /* ──────────────────────────────────────────
     §7  READING PROGRESS BAR
     Supports both #readingBar (id) and
     .reading-bar (class) variants.
  ────────────────────────────────────────── */
  var readingBar = document.getElementById('readingBar');
  if (readingBar) {
    window.addEventListener('scroll', throttle(function () {
      var doc      = document.documentElement;
      var scrolled = doc.scrollTop || document.body.scrollTop;
      var total    = doc.scrollHeight - doc.clientHeight;
      readingBar.style.width = total > 0 ? (scrolled / total) * 100 + '%' : '0%';
    }, 30), { passive: true });
  }


  /* ──────────────────────────────────────────
     §8  BACK-TO-TOP BUTTON
  ────────────────────────────────────────── */
  var btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', throttle(function () {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, 100), { passive: true });
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ──────────────────────────────────────────
     §9  SMOOTH SCROLL (anchor links)
     Offsets for sticky header height.
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 16;
      var top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────
     §10  NEWSLETTER FORM
     Handles ALL .nl-form instances on a page
     (sidebar, footer, standalone section).
  ────────────────────────────────────────── */
  var BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://api.routesandreflections.in';

  document.querySelectorAll('.nl-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var btn   = form.querySelector('button[type="submit"], .nl-btn');
      if (!input || !input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        if (input) { input.style.borderColor = 'var(--accent)'; input.focus(); setTimeout(function () { input.style.borderColor = ''; }, 2000); }
        return;
      }
      var email = input.value.trim();
      var orig  = btn ? btn.textContent : '';
      fetch(BASE_URL + '/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      }).then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (r) {
          if (!r.ok) {
            if (btn) { btn.textContent = r.data.message || 'Already subscribed'; btn.style.background = '#b94a48'; setTimeout(function () { btn.textContent = orig; btn.style.background = ''; }, 3000); }
            return;
          }
          if (btn) { btn.textContent = '✓ Subscribed!'; btn.style.background = '#4a7c5c'; btn.disabled = true; }
          input.value = '';
          setTimeout(function () { if (btn) { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; } }, 4000);
        }).catch(function () {
          if (btn) { btn.textContent = 'Error. Try again'; btn.style.background = '#b94a48'; }
        });
    });
  });


  /* ──────────────────────────────────────────
     §11  CONTACT FORM (#contactForm)
  ────────────────────────────────────────── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.btn-submit');
      var msg = document.getElementById('successMsg');
      var name    = (document.getElementById('name')    || {}).value;
      var email   = (document.getElementById('email')   || {}).value;
      var message = (document.getElementById('message') || {}).value;
      var orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      fetch(BASE_URL + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message })
      }).then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
        .then(function (r) {
          if (r.ok) { if (msg) msg.style.display = 'flex'; contactForm.reset(); setTimeout(function () { if (msg) msg.style.display = 'none'; }, 6000); }
          else alert(r.data.error || 'Something went wrong. Please try again.');
        }).catch(function () { alert('Server error. Please try again later.'); })
        .finally(function () { if (btn) { btn.textContent = orig; btn.disabled = false; } });
    });
  }


  /* ──────────────────────────────────────────
     §12  INDEX HERO SLIDESHOW
     .hero-slide (crossfade) + .hero-dot (nav)
     with Ken Burns animation restart.
  ────────────────────────────────────────── */
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDots   = document.querySelectorAll('.hero-dot');
  if (heroSlides.length) {
    var heroIdx   = 0;
    var heroTotal = heroSlides.length;
    var heroTimer;

    function restartKenBurns(slide) {
      var img = slide.querySelector('img');
      if (!img) return;
      img.style.animation = 'none';
      void img.offsetHeight;
      img.style.animation = '';
    }

    function goToHeroSlide(i) {
      heroSlides[heroIdx].classList.remove('active');
      if (heroDots[heroIdx]) heroDots[heroIdx].classList.remove('active');
      heroIdx = (i + heroTotal) % heroTotal;
      heroSlides[heroIdx].classList.add('active');
      if (heroDots[heroIdx]) heroDots[heroIdx].classList.add('active');
      restartKenBurns(heroSlides[heroIdx]);
    }

    function startHeroTimer() {
      clearInterval(heroTimer);
      heroTimer = setInterval(function () { goToHeroSlide(heroIdx + 1); }, 5500);
    }

    heroDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToHeroSlide(i); startHeroTimer(); });
    });

    startHeroTimer();
  }


  /* ──────────────────────────────────────────
     §13  INDEX PAGINATED POSTS GRID
     #postsGrid → paginate .grid-post-card
  ────────────────────────────────────────── */
  var postsGrid      = document.getElementById('postsGrid');
  var postsPagination = document.getElementById('postsPagination');
  if (postsGrid && postsPagination) {
    var postCards = Array.from(postsGrid.querySelectorAll('.grid-post-card'));
    var PER_PAGE  = 3;
    var PAGES     = Math.ceil(postCards.length / PER_PAGE);
    var WIN       = 3;
    var curPage   = 1;

    function buildPostPagination() {
      postsPagination.innerHTML = '';
      var prev = document.createElement('button');
      prev.className = 'page-btn'; prev.textContent = '← Prev'; prev.disabled = curPage === 1;
      prev.onclick = function () { showPostPage(curPage - 1); };
      postsPagination.appendChild(prev);

      var start = Math.max(1, curPage - Math.floor(WIN / 2));
      var end   = Math.min(PAGES, start + WIN - 1);
      if (end > PAGES) { end = PAGES; start = Math.max(1, end - WIN + 1); }
      for (var p = start; p <= end; p++) {
        (function (page) {
          var btn = document.createElement('button');
          btn.className = 'page-btn' + (page === curPage ? ' page-btn--active' : '');
          btn.textContent = page;
          btn.onclick = function () { showPostPage(page); };
          postsPagination.appendChild(btn);
        })(p);
      }
      if (end < PAGES) {
        var ell = document.createElement('span'); ell.className = 'page-ellipsis'; ell.textContent = '...';
        postsPagination.appendChild(ell);
      }
      var next = document.createElement('button');
      next.className = 'page-btn page-btn--next'; next.textContent = 'Next →'; next.disabled = curPage === PAGES;
      next.onclick = function () { showPostPage(curPage + 1); };
      postsPagination.appendChild(next);
    }

    function showPostPage(page) {
      curPage = Math.max(1, Math.min(page, PAGES));
      var s = (curPage - 1) * PER_PAGE;
      postCards.forEach(function (card, i) { card.style.display = (i >= s && i < s + PER_PAGE) ? 'flex' : 'none'; });
      buildPostPagination();
    }

    showPostPage(1);
  }


  /* ──────────────────────────────────────────
     §14  INDEX CATEGORY NAV
  ────────────────────────────────────────── */
  document.querySelectorAll('.cat-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      document.querySelectorAll('.cat-nav-link').forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });


  /* ──────────────────────────────────────────
     §15  WORK-WITH-US SCROLL REVEAL (.sr → .in)
  ────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var srEls = document.querySelectorAll('.sr');
    if (srEls.length) {
      var srIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); srIO.unobserve(entry.target); }
        });
      }, { threshold: 0.12 });
      srEls.forEach(function (el) { srIO.observe(el); });
    }
  } else {
    document.querySelectorAll('.sr').forEach(function (el) { el.classList.add('in'); });
  }


  /* ──────────────────────────────────────────
     §16  WORK-WITH-US FORM (#wwuForm)
  ────────────────────────────────────────── */
  var wwuForm = document.getElementById('wwuForm');
  if (wwuForm) {
    wwuForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = wwuForm.querySelector('.btn-wwu-submit');
      var msg = document.getElementById('wwuSuccessMsg');
      var orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      fetch(BASE_URL + '/api/workwithus', { method: 'POST', body: new FormData(wwuForm) })
        .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
        .then(function (r) {
          if (r.ok) { if (msg) msg.style.display = 'flex'; wwuForm.reset(); setTimeout(function () { if (msg) msg.style.display = 'none'; }, 6000); }
          else alert(r.data.error || 'Something went wrong. Please try again.');
        }).catch(function () { alert('Server error. Please try again later.'); })
        .finally(function () { if (btn) { btn.textContent = orig; btn.disabled = false; } });
    });
  }


  /* ──────────────────────────────────────────
     §17  LIFESTYLE SUB-NAV DROPDOWNS
  ────────────────────────────────────────── */
  var lsNavItems = document.querySelectorAll('.ls-nav-item');
  var lsOverlay  = document.getElementById('lsOverlay');
  if (lsNavItems.length && lsOverlay) {
    function lsCloseAll() {
      lsNavItems.forEach(function (item) {
        item.classList.remove('ls-open');
        var b = item.querySelector('button.ls-nav-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      lsOverlay.classList.remove('ls-open');
    }

    lsNavItems.forEach(function (item) {
      var btn  = item.querySelector('button.ls-nav-btn');
      var drop = item.querySelector('.ls-dropdown');
      if (!drop) {
        if (btn) btn.addEventListener('click', function () {
          document.querySelectorAll('.ls-nav-btn').forEach(function (b) { b.classList.remove('ls-active'); });
          btn.classList.add('ls-active');
          lsCloseAll();
        });
        return;
      }
      if (btn) btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = item.classList.contains('ls-open');
        lsCloseAll();
        if (!wasOpen) { item.classList.add('ls-open'); btn.setAttribute('aria-expanded', 'true'); lsOverlay.classList.add('ls-open'); }
      });
    });

    lsOverlay.addEventListener('click', lsCloseAll);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lsCloseAll(); });
    document.querySelectorAll('.ls-dd-link, .ls-dd-all').forEach(function (l) { l.addEventListener('click', lsCloseAll); });
    document.addEventListener('mousedown', function (e) { if (!e.target.closest('.ls-nav-item')) lsCloseAll(); });
  }


  /* ──────────────────────────────────────────
     §18  LIFESTYLE PAGINATED POSTS GRID
  ────────────────────────────────────────── */
  var lsGrid       = document.getElementById('lsPostsGrid');
  var lsPagination = document.getElementById('lsPostsPagination');
  if (lsGrid && lsPagination) {
    var lsCards  = Array.from(lsGrid.querySelectorAll('.ls-card'));
    var LS_PER   = 3;
    var LS_PAGES = Math.ceil(lsCards.length / LS_PER);
    var LS_WIN   = 2;
    var lsCur    = 1;

    function buildLsPagination() {
      lsPagination.innerHTML = '';
      var prev = document.createElement('button');
      prev.className = 'page-btn'; prev.textContent = '← Prev'; prev.disabled = lsCur === 1;
      prev.onclick = function () { showLsPage(lsCur - 1); };
      lsPagination.appendChild(prev);

      var start = Math.max(1, lsCur - Math.floor(LS_WIN / 2));
      var end   = Math.min(LS_PAGES, start + LS_WIN - 1);
      if (end > LS_PAGES) { end = LS_PAGES; start = Math.max(1, end - LS_WIN + 1); }
      for (var p = start; p <= end; p++) {
        (function (page) {
          var btn = document.createElement('button');
          btn.className = 'page-btn' + (page === lsCur ? ' page-btn--active' : '');
          btn.textContent = page;
          btn.onclick = function () { showLsPage(page); };
          lsPagination.appendChild(btn);
        })(p);
      }
      if (end < LS_PAGES) {
        var ell = document.createElement('span'); ell.className = 'page-ellipsis'; ell.textContent = '...';
        lsPagination.appendChild(ell);
      }
      var next = document.createElement('button');
      next.className = 'page-btn page-btn--next'; next.textContent = 'Next →'; next.disabled = lsCur === LS_PAGES;
      next.onclick = function () { showLsPage(lsCur + 1); };
      lsPagination.appendChild(next);
    }

    function showLsPage(page) {
      lsCur = Math.max(1, Math.min(page, LS_PAGES));
      var s = (lsCur - 1) * LS_PER;
      lsCards.forEach(function (c, i) { c.style.display = (i >= s && i < s + LS_PER) ? 'flex' : 'none'; });
      buildLsPagination();
    }

    showLsPage(1);
  }


  /* ──────────────────────────────────────────
     §19  TRAVEL HERO SLIDESHOW (.dhv2-slide)
  ────────────────────────────────────────── */
  var dhSlides = document.querySelectorAll('.dhv2-slide');
  if (dhSlides.length) {
    var dhIdx   = 0;
    var dhTotal = dhSlides.length;
    var dhTimer = setInterval(function () {
      dhSlides[dhIdx].classList.remove('dhv2-slide--active');
      dhIdx = (dhIdx + 1) % dhTotal;
      dhSlides[dhIdx].classList.add('dhv2-slide--active');
    }, 5000);
  }


  /* ──────────────────────────────────────────
     §20  POPULAR DESTINATIONS SLIDER
     Generic createSlider factory invocation.
  ────────────────────────────────────────── */
  function createSlider(opts) {
    var track    = document.getElementById(opts.trackId);
    var prevBtn  = document.getElementById(opts.prevId);
    var nextBtn  = document.getElementById(opts.nextId);
    var dotsWrap = document.getElementById(opts.dotsId);
    if (!track) return;

    var cards = Array.from(track.querySelectorAll(opts.cardSelector || ':scope > *'));
    if (!cards.length) return;

    var idx = 0;
    var gap = opts.gap || 24;
    var getVisible = opts.getVisible || function (w) {
      if (w <= 560) return 1;
      if (w <= 900) return 2;
      return 4;
    };

    function maxIdx() { return Math.max(0, cards.length - getVisible(window.innerWidth)); }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var total = maxIdx() + 1;
      for (var i = 0; i < total; i++) {
        (function (i) {
          var btn = document.createElement('button');
          btn.className = 'dest-pop-dot' + (i === idx ? ' active' : '');
          btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          btn.addEventListener('click', function () { goTo(i); });
          dotsWrap.appendChild(btn);
        })(i);
      }
    }

    function goTo(i) {
      idx = Math.max(0, Math.min(i, maxIdx()));
      var cardW = cards[0].getBoundingClientRect().width;
      track.style.transform = 'translateX(-' + idx * (cardW + gap) + 'px)';
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) nextBtn.disabled = idx >= maxIdx();
      if (dotsWrap) dotsWrap.querySelectorAll('[aria-label]').forEach(function (d, j) { d.classList.toggle('active', j === idx); });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(idx + 1); });
    window.addEventListener('resize', function () { buildDots(); goTo(idx); });

    var startX = 0, dragging = false;
    track.addEventListener('mousedown', function (e) { dragging = true; startX = e.clientX; });
    track.addEventListener('mousemove', function (e) { if (dragging) e.preventDefault(); });
    track.addEventListener('mouseup', function (e) { if (!dragging) return; dragging = false; var d = startX - e.clientX; if (Math.abs(d) > 50) goTo(d > 0 ? idx + 1 : idx - 1); });
    track.addEventListener('mouseleave', function () { dragging = false; });
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) { var d = startX - e.changedTouches[0].clientX; if (Math.abs(d) > 50) goTo(d > 0 ? idx + 1 : idx - 1); });

    buildDots();
    goTo(0);
  }

  createSlider({
    trackId: 'destPopTrack', prevId: 'destPopPrev', nextId: 'destPopNext', dotsId: 'destPopDots',
    cardSelector: '.dest-pop-card', gap: 24,
    getVisible: function (w) { if (w <= 560) return 1; if (w <= 900) return 2; return 4; }
  });


  /* ──────────────────────────────────────────
     §21  ITINERARY SLIDER
  ────────────────────────────────────────── */
  createSlider({
    trackId: 'itinTrack', prevId: 'itinPrev', nextId: 'itinNext', dotsId: 'itinDots',
    cardSelector: '.itin-card', gap: 24,
    getVisible: function (w) { if (w <= 580) return 1; if (w <= 900) return 2; return 3; }
  });


  /* ──────────────────────────────────────────
     §22  DESTINATION MAP
     Filter by region, hover highlights on
     sidebar items, accordion open/close,
     geographic pin positioning.
  ────────────────────────────────────────── */
  // Filter
  var filterSelect = document.getElementById('destFilterSelect');
  var mapPins      = document.querySelectorAll('.dest-pin');
  if (filterSelect && mapPins.length) {
    filterSelect.addEventListener('change', function () {
      var val = this.value;
      mapPins.forEach(function (pin) {
        var match = !val || pin.dataset.region === val;
        pin.style.opacity       = match ? '1' : '0.18';
        pin.style.pointerEvents = match ? 'auto' : 'none';
      });
    });
  }

  // Sidebar hover ↔ pin highlight
  var sidebarItems = document.querySelectorAll('.dest-sidebar-item');
  if (sidebarItems.length && mapPins.length) {
    sidebarItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        var region = item.dataset.region;
        mapPins.forEach(function (pin) {
          var active = pin.dataset.region === region;
          pin.style.transform = active ? 'translate(-50%,-100%) scale(1.12)' : 'translate(-50%,-100%) scale(0.92)';
          pin.style.opacity   = active ? '1' : '0.4';
        });
      });
      item.addEventListener('mouseleave', function () {
        mapPins.forEach(function (pin) { pin.style.transform = ''; pin.style.opacity = ''; });
      });
    });
  }

  // Accordion
  var accordionItems = document.querySelectorAll('.dest-accordion-item');
  if (accordionItems.length) {
    accordionItems.forEach(function (item) {
      var hdr = item.querySelector('.dest-sidebar-item');
      if (!hdr) return;
      hdr.addEventListener('click', function () {
        accordionItems.forEach(function (i) { if (i !== item) i.classList.remove('active'); });
        item.classList.toggle('active');
      });
    });
    document.addEventListener('click', function (e) {
      var wrap = document.querySelector('.dest-sidebar-items');
      if (wrap && !wrap.contains(e.target)) {
        accordionItems.forEach(function (item) { item.classList.remove('active'); });
      }
    });
  }

  // Geographic pin positioning
  (function () {
    var MAP_LON_MIN = -168, MAP_LON_MAX = 190;
    var MAP_LAT_MAX = 83,   MAP_LAT_MIN = -58;

    function geoToPercent(lon, lat) {
      return {
        x: ((lon - MAP_LON_MIN) / (MAP_LON_MAX - MAP_LON_MIN)) * 100,
        y: ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * 100
      };
    }

    var PIN_COORDS = {
      'pin-india':    { lon: 78,  lat: 22 },
      'pin-japan':    { lon: 138, lat: 36 },
      'pin-taiwan':   { lon: 121, lat: 24 },
      'pin-thailand': { lon: 101, lat: 13 },
      'pin-kenya':    { lon: 37,  lat: 0  },
      'pin-maldives': { lon: 73,  lat: 3  }
    };

    function positionPins() {
      var canvas   = document.querySelector('.dest-map-canvas');
      var pinLayer = document.querySelector('.dest-map-pin-layer');
      if (!canvas || !pinLayer || !canvas.offsetWidth) return;
      Object.keys(PIN_COORDS).forEach(function (id) {
        var pin = pinLayer.querySelector("[data-pin-id='" + id + "']");
        if (!pin) return;
        var p = geoToPercent(PIN_COORDS[id].lon, PIN_COORDS[id].lat);
        pin.style.left = p.x.toFixed(3) + '%';
        pin.style.top  = p.y.toFixed(3) + '%';
      });
    }

    function initPins() {
      positionPins();
      window.addEventListener('resize', positionPins);
      var mapImg = document.querySelector('.dest-map-img');
      if (mapImg) { mapImg.complete ? positionPins() : mapImg.addEventListener('load', positionPins); }
    }

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', initPins)
      : initPins();
  })();


  /* ──────────────────────────────────────────
     §23  STUDIO scrollRow()
     Called by onclick="scrollRow(this, ±1)"
     on studio.html row arrow buttons.
  ────────────────────────────────────────── */
  window.scrollRow = function (btn, dir) {
    var row  = btn.parentElement.querySelector('.st-creation-row');
    if (!row) return;
    var card = row.querySelector('.st-creation-card');
    var cardW = card ? card.offsetWidth + 24 : 234;
    row.scrollBy({ left: dir * cardW * 3, behavior: 'smooth' });
  };


  /* ──────────────────────────────────────────
     §24  DESTINATION DETAIL PAGES
     Adds .loaded to #heroBg 100ms after load
     to trigger the CSS fade-in transition.
  ────────────────────────────────────────── */
  var heroBg = document.getElementById('heroBg');
  if (heroBg) {
    setTimeout(function () { heroBg.classList.add('loaded'); }, 100);
  }


  /* ──────────────────────────────────────────
     §25  LIFESTYLE ARTICLE READING PROGRESS
     Uses #articleBody-relative scroll
     (not document scroll).
  ────────────────────────────────────────── */
  var lsReadingProg = document.getElementById('readingProgress');
  var lsArticleBody = document.getElementById('articleBody');
  if (lsReadingProg && lsArticleBody) {
    window.addEventListener('scroll', function () {
      var total    = lsArticleBody.offsetHeight - window.innerHeight;
      var scrolled = Math.max(0, -lsArticleBody.getBoundingClientRect().top);
      lsReadingProg.style.width = Math.min(100, (scrolled / total) * 100) + '%';
    }, { passive: true });
  }


  /* ──────────────────────────────────────────
     §26  LIFESTYLE CATEGORY FILTER
     window.filterPosts used by onclick attrs
     in lifestyle-all.html.
  ────────────────────────────────────────── */
  window.filterPosts = function (btn, cat) {
    document.querySelectorAll('.sf-btn').forEach(function (b) { b.classList.remove('sf-active'); });
    btn.classList.add('sf-active');

    var cards   = document.querySelectorAll('.sc');
    var visible = 0;
    cards.forEach(function (card) {
      var show = cat === 'all' || card.dataset.cat === cat;
      card.style.display = show ? 'flex' : 'none';
      if (show) visible++;
    });

    var countEl = document.getElementById('spCount');
    var emptyEl = document.getElementById('spEmpty');
    if (countEl) {
      countEl.textContent = visible === 0 ? '' :
        cat === 'all' ? 'Showing all ' + visible + ' posts' :
        'Showing ' + visible + ' post' + (visible === 1 ? '' : 's') + ' in ' + btn.textContent;
    }
    if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
  };


  /* ──────────────────────────────────────────
     §27  WORK-WITH-US CTA SMOOTH SCROLL
     a[href="#wwu-form"] → scrollIntoView
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href="#wwu-form"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('wwu-form');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})(); // end IIFE
