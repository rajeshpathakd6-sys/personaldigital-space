/* ═══════════════════════════════════════════════════════════════════
   ADIRAJ — script.js
   Shared interactive behaviour for all pages.

   TABLE OF CONTENTS
   1.  Throttle helper
   2.  Sticky header (.scrolled shadow tweak)
   3.  Mobile menu (open / close / Escape)
   4.  Search bar (open / close / Escape / autofocus)
   5.  Scroll reveal  — .js-reveal  (IntersectionObserver)
   6.  Scroll reveal  — .reveal     (Travel page variant)
   7.  Reading progress bar         (post template pages)
   8.  Back-to-top button
   9.  Smooth scroll for anchor links
   10. Newsletter micro-interaction  (sidebar + inline forms)
   11. Active category-nav link on click
   12. Hero slideshow — crossfade + Ken Burns (index only)
   13. Paginated posts grid          (index only)
   14. Lifestyle paginated grid      (lifestyle only)
   15. Lifestyle sub-nav dropdowns   (lifestyle only)
   16. Destination map — filter + sidebar hover + accordion (travel only)
   17. Destination map — geographic pin positioning        (travel only)
   18. Studio — horizontal row scroll arrows              (studio only)
═══════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────
     1. THROTTLE HELPER
     Limits how often a function fires during
     rapid events (scroll, resize).
  ────────────────────────────────────────── */
  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  /* ──────────────────────────────────────────
     2. STICKY HEADER
     Adds .scrolled class for shadow on scroll.
  ────────────────────────────────────────── */
  const header = document.getElementById("siteHeader");
  if (header) {
    window.addEventListener(
      "scroll",
      throttle(() => {
        header.classList.toggle("scrolled", window.scrollY > 10);
      }, 80),
      { passive: true },
    );
  }

  /* ──────────────────────────────────────────
     3. MOBILE MENU
  ────────────────────────────────────────── */
  const burger = document.getElementById("burger");
  const mobMenu = document.getElementById("mobMenu");
  const mobClose = document.getElementById("mobClose");
  let mobOpen = false;

  function openMob() {
    mobOpen = true;
    mobMenu && mobMenu.classList.add("open");
    burger && burger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMob() {
    mobOpen = false;
    mobMenu && mobMenu.classList.remove("open");
    burger && burger.classList.remove("open");
    document.body.style.overflow = "";
  }
  // Expose globally so inline onclick="closeMob()" in nav links works
  window.closeMob = closeMob;

  burger &&
    burger.addEventListener("click", () => (mobOpen ? closeMob() : openMob()));
  mobClose && mobClose.addEventListener("click", closeMob);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMob();
  });

  /* ──────────────────────────────────────────
     4. SEARCH BAR
  ────────────────────────────────────────── */
  const searchToggle = document.getElementById("searchToggle");
  const searchBar = document.getElementById("searchBar");
  const searchClose = document.getElementById("searchClose");
  const searchInput = document.getElementById("searchInput");

  function openSearch() {
    searchBar && searchBar.classList.add("open");
    searchInput && setTimeout(() => searchInput.focus(), 200);
  }
  function closeSearch() {
    searchBar && searchBar.classList.remove("open");
  }

  searchToggle && searchToggle.addEventListener("click", openSearch);
  searchClose && searchClose.addEventListener("click", closeSearch);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
  });

  /* ──────────────────────────────────────────
     5. SCROLL REVEAL — .js-reveal
     Used on index, lifestyle, studio pages.
     Adds .visible when element enters viewport.
  ────────────────────────────────────────── */
  const jsReveals = document.querySelectorAll(".js-reveal");
  if ("IntersectionObserver" in window && jsReveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );
    jsReveals.forEach((el) => io.observe(el));
  } else {
    jsReveals.forEach((el) => el.classList.add("visible"));
  }

  /* ──────────────────────────────────────────
     6. SCROLL REVEAL — .reveal
     Travel page variant using CSS animation.
  ────────────────────────────────────────── */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            ro.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    reveals.forEach((el) => ro.observe(el));
  }

  /* ──────────────────────────────────────────
     7. READING PROGRESS BAR
     Only renders on post-template pages that
     have #readingBar in the DOM.
  ────────────────────────────────────────── */
  const readingBar = document.getElementById("readingBar");
  if (readingBar) {
    window.addEventListener(
      "scroll",
      throttle(() => {
        const doc = document.documentElement;
        const scrolled = doc.scrollTop || document.body.scrollTop;
        const total = doc.scrollHeight - doc.clientHeight;
        readingBar.style.width =
          total > 0 ? (scrolled / total) * 100 + "%" : "0%";
      }, 30),
      { passive: true },
    );
  }

  /* ──────────────────────────────────────────
     8. BACK TO TOP BUTTON
  ────────────────────────────────────────── */
  const btt = document.getElementById("backToTop");
  if (btt) {
    window.addEventListener(
      "scroll",
      throttle(() => {
        btt.classList.toggle("visible", window.scrollY > 400);
      }, 100),
      { passive: true },
    );
    btt.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ──────────────────────────────────────────
     9. SMOOTH SCROLL — anchor links
     Offsets for sticky header height.
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        closeMob();
        const offset = (header ? header.offsetHeight : 0) + 16;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ──────────────────────────────────────────
     10. NEWSLETTER MICRO-INTERACTION
     Works for sidebar widget and any inline
     subscribe buttons on any page.
  ────────────────────────────────────────── */
  // Deferred to ensure DOM is ready
  function initNewsletter() {
    document
      .querySelectorAll(".widget-subscribe-btn, #sidebarSubBtn, .nl-btn")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const widget =
            btn.closest(".widget") ||
            btn.closest(".nl-section") ||
            btn.closest(".newsletter");
          const input =
            widget &&
            widget.querySelector(
              'input[type="email"], .widget-email-input, .nl-input',
            );

          if (
            input &&
            input.value.trim() &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
          ) {
            const orig = btn.textContent;
            btn.textContent = "\u2713 Subscribed!";
            btn.style.background = "#4a7c5c";
            btn.disabled = true;
            input.value = "";
            // Show success message if it exists in the newsletter section
            const successMsg = widget && widget.querySelector(".nl-success");
            const nlNote = widget && widget.querySelector(".nl-note");
            const nlForm = widget && widget.querySelector(".nl-form");
            if (successMsg) {
              successMsg.style.display = "block";
              if (nlNote) nlNote.style.display = "none";
              if (nlForm) nlForm.style.opacity = "0.4";
            }
            setTimeout(() => {
              btn.textContent = orig;
              btn.style.background = "";
              btn.disabled = false;
              if (successMsg) {
                successMsg.style.display = "none";
                if (nlNote) nlNote.style.display = "";
                if (nlForm) nlForm.style.opacity = "1";
              }
            }, 4000);
          } else if (input) {
            input.style.borderColor = "var(--accent)";
            input.focus();
            setTimeout(() => {
              input.style.borderColor = "";
            }, 2000);
          }
        });
      });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNewsletter);
  } else {
    initNewsletter();
  }

  /* ──────────────────────────────────────────
     11. ACTIVE CATEGORY NAV LINK
     Highlights link on click (index page).
  ────────────────────────────────────────── */
  const catLinks = document.querySelectorAll(".cat-nav-link");
  if (catLinks.length) {
    catLinks.forEach((link) => {
      link.addEventListener("click", () => {
        catLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }
})(); // end shared IIFE

/* ═══════════════════════════════════════════════════════════════════
   12. HERO SLIDESHOW — index page only
   Crossfade between slides with Ken Burns restart on each transition.
═══════════════════════════════════════════════════════════════════ */
(function () {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;

  const total = slides.length;
  let current = 0;
  let timer;

  /** Restart CSS animation on the active slide's image (Ken Burns). */
  function restartKenBurns(slide) {
    const img = slide.querySelector("img");
    if (!img) return;
    img.style.animation = "none";
    img.offsetHeight; // force reflow
    img.style.animation = "";
  }

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current] && dots[current].classList.remove("active");
    current = (index + total) % total;
    slides[current].classList.add("active");
    dots[current] && dots[current].classList.add("active");
    restartKenBurns(slides[current]);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.index, 10));
      startTimer();
    });
  });

  startTimer();
})();

/* ═══════════════════════════════════════════════════════════════════
   13. PAGINATED POSTS GRID — index page only
   Shows `perPage` cards at a time with Prev/Next controls.

   Page-number window logic:
   - Always shows up to WINDOW_SIZE consecutive page numbers
   - Window is anchored to `current` so clicking Next shows
     the next page number immediately (e.g. 1→2→3, never 1→3)
   - Ellipsis appears only when pages beyond the window exist
═══════════════════════════════════════════════════════════════════ */
(function () {
  const grid = document.getElementById("postsGrid");
  const paginationNav = document.getElementById("postsPagination");
  if (!grid || !paginationNav) return;

  const cards = Array.from(grid.querySelectorAll(".grid-post-card"));
  const perPage = 2;
  const pages = Math.ceil(cards.length / perPage);
  const WINDOW_SIZE = 2; // how many page-number buttons to show at once
  let current = 1;

  function buildPagination() {
    paginationNav.innerHTML = "";

    // ── Prev button ──────────────────────────────────────────────
    const prev = document.createElement("button");
    prev.className = "page-btn";
    prev.textContent = "← Prev";
    prev.disabled = current === 1;
    prev.onclick = () => showPage(current - 1);
    paginationNav.appendChild(prev);

    // ── Page-number window ───────────────────────────────────────
    // Center the window on `current`, clamped so it never goes
    // below 1 or above `pages`. This means:
    //   page 1 → shows [1, 2]
    //   page 2 → shows [1, 2]   (or [2, 3] if you want it forward-biased)
    //   page 3 → shows [2, 3]   (window follows current)
    //   page 4 → shows [3, 4]
    let startPage = Math.max(1, current - Math.floor(WINDOW_SIZE / 2));
    let endPage = startPage + WINDOW_SIZE - 1;
    // If window overshoots the end, shift it back
    if (endPage > pages) {
      endPage = pages;
      startPage = Math.max(1, endPage - WINDOW_SIZE + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      const btn = document.createElement("button");
      btn.className = "page-btn" + (p === current ? " page-btn--active" : "");
      btn.textContent = p;
      btn.onclick = () => showPage(p);
      paginationNav.appendChild(btn);
    }

    // ── Ellipsis — only when pages exist beyond the window ───────
    if (endPage < pages) {
      const ell = document.createElement("span");
      ell.className = "page-ellipsis";
      ell.textContent = "...";
      paginationNav.appendChild(ell);
    }
  }

  function showPage(page) {
    current = Math.max(1, Math.min(page, pages));
    const start = (current - 1) * perPage;
    const end = start + perPage;
    cards.forEach((card, i) => {
      card.style.display = i >= start && i < end ? "flex" : "none";
    });
    buildPagination();
  }

  showPage(1);
})();

/* ═══════════════════════════════════════════════════════════════════
   14. LIFESTYLE PAGINATED GRID — lifestyle page only
═══════════════════════════════════════════════════════════════════ */
(function () {
  const grid = document.getElementById("lsPostsGrid");
  const paginationNav = document.getElementById("lsPostsPagination");
  if (!grid || !paginationNav) return;

  const cards = Array.from(grid.querySelectorAll(".ls-card"));
  const perPage = 3;
  const pages = Math.ceil(cards.length / perPage);
  let current = 1;

  function buildPagination() {
    paginationNav.innerHTML = "";

    const prev = document.createElement("button");
    prev.className = "page-btn";
    prev.textContent = "← Prev";
    prev.disabled = current === 1;
    prev.onclick = () => showPage(current - 1);
    paginationNav.appendChild(prev);

    // Window centered on current, clamped to valid range
    const WINDOW_SIZE = 2;
    let startPage = Math.max(1, current - Math.floor(WINDOW_SIZE / 2));
    let endPage = startPage + WINDOW_SIZE - 1;
    if (endPage > pages) {
      endPage = pages;
      startPage = Math.max(1, endPage - WINDOW_SIZE + 1);
    }

    for (let p = startPage; p <= endPage; p++) {
      const btn = document.createElement("button");
      btn.className = "page-btn" + (p === current ? " page-btn--active" : "");
      btn.textContent = p;
      btn.onclick = () => showPage(p);
      paginationNav.appendChild(btn);
    }

    if (endPage < pages) {
      const ell = document.createElement("span");
      ell.className = "page-ellipsis";
      ell.textContent = "...";
      paginationNav.appendChild(ell);
    }
  }

  function showPage(page) {
    current = Math.max(1, Math.min(page, pages));
    const start = (current - 1) * perPage;
    const end = start + perPage;
    cards.forEach((card, i) => {
      card.style.display = i >= start && i < end ? "flex" : "none";
    });
    buildPagination();
  }

  showPage(1);
})();

/* ═══════════════════════════════════════════════════════════════════
   15. LIFESTYLE SUB-NAV DROPDOWNS — lifestyle page only
   Handles open/close of category dropdowns and click-outside overlay.
═══════════════════════════════════════════════════════════════════ */
(function () {
  const navItems = document.querySelectorAll(".ls-nav-item");
  const overlay = document.getElementById("lsOverlay");
  if (!navItems.length || !overlay) return;

  function closeAll() {
    navItems.forEach((item) => {
      item.classList.remove("ls-open");
      const btn = item.querySelector("button.ls-nav-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
    overlay.classList.remove("ls-open");
  }

  navItems.forEach((item) => {
    const btn = item.querySelector("button.ls-nav-btn");
    const drop = item.querySelector(".ls-dropdown");

    if (!drop) {
      // No dropdown — just set active state on click
      if (btn) {
        btn.addEventListener("click", () => {
          document
            .querySelectorAll(".ls-nav-btn")
            .forEach((b) => b.classList.remove("ls-active"));
          btn.classList.add("ls-active");
          closeAll();
        });
      }
      return;
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = item.classList.contains("ls-open");
      closeAll();
      if (!wasOpen) {
        item.classList.add("ls-open");
        btn.setAttribute("aria-expanded", "true");
        overlay.classList.add("ls-open");
      }
    });
  });

  overlay.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
  // Close when a dropdown link is clicked
  document.querySelectorAll(".ls-dd-link, .ls-dd-all").forEach((l) => {
    l.addEventListener("click", closeAll);
  });
  // Close on any click outside a nav item (use mousedown to avoid racing with btn click)
  document.addEventListener("mousedown", (e) => {
    if (!e.target.closest(".ls-nav-item")) closeAll();
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   16. DESTINATION MAP — filter, sidebar hover, accordion
       travel.html only
═══════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  /* MAP FILTER — dim pins by region */
  const filterSelect = document.getElementById("destFilterSelect");
  const pins = document.querySelectorAll(".dest-pin");
  if (filterSelect && pins.length) {
    filterSelect.addEventListener("change", function () {
      const val = this.value;
      pins.forEach((pin) => {
        const match = !val || pin.dataset.region === val;
        pin.style.opacity = match ? "1" : "0.18";
        pin.style.pointerEvents = match ? "auto" : "none";
      });
    });
  }

  /* SIDEBAR HOVER → MAP PIN HIGHLIGHT */
  const sidebarItems = document.querySelectorAll(".dest-sidebar-item");
  if (sidebarItems.length && pins.length) {
    sidebarItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const region = item.dataset.region;
        pins.forEach((pin) => {
          const active = pin.dataset.region === region;
          pin.style.transform = active
            ? "translate(-50%,-100%) scale(1.12)"
            : "translate(-50%,-100%) scale(0.92)";
          pin.style.opacity = active ? "1" : "0.4";
        });
      });
      item.addEventListener("mouseleave", () => {
        pins.forEach((pin) => {
          pin.style.transform = "";
          pin.style.opacity = "";
        });
      });
    });
  }

  /* ACCORDION SIDEBAR — expand / collapse continents */
  const accordions = document.querySelectorAll(".dest-accordion-item");
  if (accordions.length) {
    accordions.forEach((item) => {
      const hdr = item.querySelector(".dest-sidebar-item");
      if (!hdr) return;
      hdr.addEventListener("click", () => {
        // Collapse all others
        accordions.forEach((i) => {
          if (i !== item) i.classList.remove("active");
        });
        item.classList.toggle("active");
      });
    });
  }

  /* Click outside accordion → collapse all */
  document.addEventListener("click", (e) => {
    const accordionWrap = document.querySelector(".dest-sidebar-items");
    if (accordionWrap && !accordionWrap.contains(e.target)) {
      accordions.forEach((item) => item.classList.remove("active"));
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════
   17. DESTINATION MAP — geographic pin positioning
   Converts real lon/lat to percentage positions on the map image.
   Image: worldmapbackground.jpg (equirectangular, ~1920×960)
═══════════════════════════════════════════════════════════════════ */
(function () {
  // Calibrated bounding box for this specific map image
  const MAP_LON_MIN = -168;
  const MAP_LON_MAX = 190;
  const MAP_LAT_MAX = 83; // top of image
  const MAP_LAT_MIN = -58; // bottom of image

  /** Convert geographic coordinates to % positions on the map canvas. */
  function geoToPercent(lon, lat) {
    const x = ((lon - MAP_LON_MIN) / (MAP_LON_MAX - MAP_LON_MIN)) * 100;
    const y = ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * 100;
    return { x, y };
  }

  // Pin definitions — update coordinates here to move pins
  const PIN_COORDS = {
    "pin-india": { lon: 78, lat: 22 },
    "pin-japan": { lon: 138, lat: 36 },
    "pin-taiwan": { lon: 121, lat: 24 },
    "pin-thailand": { lon: 101, lat: 13 },
    "pin-kenya": { lon: 37, lat: 0 },
    "pin-maldives": { lon: 73, lat: 3 },
  };

  function positionPins() {
    const canvas = document.querySelector(".dest-map-canvas");
    const pinLayer = document.querySelector(".dest-map-pin-layer");
    if (!canvas || !pinLayer) return;

    // Only position if canvas has rendered dimensions
    if (!canvas.offsetWidth || !canvas.offsetHeight) return;

    Object.entries(PIN_COORDS).forEach(([id, { lon, lat }]) => {
      const pin = pinLayer.querySelector(`[data-pin-id='${id}']`);
      if (!pin) return;
      const pct = geoToPercent(lon, lat);
      pin.style.left = pct.x.toFixed(3) + "%";
      pin.style.top = pct.y.toFixed(3) + "%";
    });
  }

  function init() {
    positionPins();
    window.addEventListener("resize", positionPins);

    // Re-position after map image fully loads (height finalises)
    const mapImg = document.querySelector(".dest-map-img");
    if (mapImg) {
      mapImg.complete
        ? positionPins()
        : mapImg.addEventListener("load", positionPins);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ═══════════════════════════════════════════════════════════════════
   18. STUDIO — horizontal row scroll arrows
   Called by inline onclick="scrollRow(this, -1 | 1)" on arrow buttons.
═══════════════════════════════════════════════════════════════════ */
function scrollRow(btn, dir) {
  const row = btn.parentElement.querySelector(".st-creation-row");
  if (!row) return;
  // Scroll ~3 card-widths per click. Card is 210px + 1.5rem gap ≈ 234px each.
  const card = row.querySelector(".st-creation-card");
  const cardW = card ? card.offsetWidth + 24 : 234;
  row.scrollBy({ left: dir * cardW * 3, behavior: "smooth" });
}
