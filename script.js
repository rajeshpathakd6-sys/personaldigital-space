/* ═══════════════════════════════════════════
   YOUR BLOG — script.js
   Sticky header · Mobile menu · Search bar ·
   Scroll reveal · Reading bar · Back to top ·
   Newsletter micro-interaction
═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── throttle helper ── */
  function throttle(fn, ms) {
    let t = 0;
    return function (...a) {
      const now = Date.now();
      if (now - t >= ms) {
        t = now;
        fn.apply(this, a);
      }
    };
  }

  /* ═══════════════════════════════════════
     1. STICKY HEADER — add .scrolled class
     (used for box-shadow tweak on scroll)
  ═══════════════════════════════════════ */
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

  /* ═══════════════════════════════════════
     2. MOBILE MENU
  ═══════════════════════════════════════ */
  const burger = document.getElementById("burger");
  const mobMenu = document.getElementById("mobMenu");
  const mobClose = document.getElementById("mobClose");
  let mobOpen = false;

  function openMob() {
    mobOpen = true;
    mobMenu.classList.add("open");
    burger && burger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMob() {
    mobOpen = false;
    mobMenu && mobMenu.classList.remove("open");
    burger && burger.classList.remove("open");
    document.body.style.overflow = "";
  }
  window.closeMob = closeMob; /* expose for inline onclick */

  burger &&
    burger.addEventListener("click", () => (mobOpen ? closeMob() : openMob()));
  mobClose && mobClose.addEventListener("click", closeMob);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMob();
  });

  /* ═══════════════════════════════════════
     3. SEARCH BAR
  ═══════════════════════════════════════ */
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

  /* ═══════════════════════════════════════
     4. SCROLL REVEAL
  ═══════════════════════════════════════ */
  const reveals = document.querySelectorAll(".js-reveal");

  if ("IntersectionObserver" in window && reveals.length) {
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
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ═══════════════════════════════════════
     5. READING PROGRESS BAR (post page)
  ═══════════════════════════════════════ */
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

  /* ═══════════════════════════════════════
     6. BACK TO TOP
  ═══════════════════════════════════════ */
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

  /* ═══════════════════════════════════════
     7. SMOOTH SCROLL for anchor links
  ═══════════════════════════════════════ */
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

  /* ═══════════════════════════════════════
     8. NEWSLETTER MICRO-INTERACTION
     Works for both sidebar and any inline
     subscribe buttons on the page.
  ═══════════════════════════════════════ */
  document
    .querySelectorAll(".widget-subscribe-btn, #sidebarSubBtn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const widget = btn.closest(".widget") || btn.closest(".nl-section");
        const input =
          widget &&
          widget.querySelector('input[type="email"], .widget-email-input');

        if (input && input.value.trim() && input.value.includes("@")) {
          const orig = btn.textContent;
          btn.textContent = "✓ You're subscribed!";
          btn.style.background = "#4a7c5c";
          btn.disabled = true;
          input.value = "";
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = "";
            btn.disabled = false;
          }, 3500);
        } else {
          if (input) {
            input.style.borderColor = "var(--accent)";
            input.focus();
            setTimeout(() => {
              input.style.borderColor = "";
            }, 2000);
          }
        }
      });
    });

  /* ═══════════════════════════════════════
     9. ACTIVE NAV LINK based on scroll
     (highlights category nav on index page)
  ═══════════════════════════════════════ */
  const catLinks = document.querySelectorAll(".cat-nav-link");
  if (catLinks.length) {
    // On index page: highlight "All Posts" always (static).
    // You can extend this later for JS-filtered category views.
    catLinks.forEach((link) => {
      link.addEventListener("click", () => {
        catLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }
})();
document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     SCROLL REVEAL
  =============================== */
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ===============================
     MAP FILTER
  =============================== */
  const filterSelect = document.getElementById("destFilterSelect");
  const pins = document.querySelectorAll(".dest-pin");

  if (filterSelect && pins.length) {
    filterSelect.addEventListener("change", function () {
      const val = this.value;

      pins.forEach((pin) => {
        if (!val || pin.dataset.region === val) {
          pin.style.opacity = "1";
          pin.style.pointerEvents = "auto";
        } else {
          pin.style.opacity = "0.18";
          pin.style.pointerEvents = "none";
        }
      });
    });
  }

  /* ===============================
     SIDEBAR HOVER → MAP HIGHLIGHT
  =============================== */
  const sidebarItems = document.querySelectorAll(".dest-sidebar-item");

  if (sidebarItems.length && pins.length) {
    sidebarItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const region = item.dataset.region;

        pins.forEach((pin) => {
          pin.style.transform =
            pin.dataset.region === region
              ? "translate(-50%,-50%) scale(1.12)"
              : "translate(-50%,-50%) scale(0.92)";
          pin.style.opacity = pin.dataset.region === region ? "1" : "0.4";
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

  /* ===============================
     ACCORDION (SIDEBAR EXPAND)
  =============================== */
  const accordions = document.querySelectorAll(".dest-accordion-item");

  if (accordions.length) {
    accordions.forEach((item) => {
      const header = item.querySelector(".dest-sidebar-item");

      header.addEventListener("click", () => {
        accordions.forEach((i) => {
          if (i !== item) i.classList.remove("active");
        });

        item.classList.toggle("active");
      });
    });
  }
});

/* ===============================
   MAP PIN POSITIONING
   
   The worldmapbackground.jpg uses a Mercator-like projection.
   Image natural size: 1920 × 960 px (2:1 aspect).
   
   We use an <img> tag (width:100%, height:auto) so the rendered
   image ALWAYS fills the canvas width exactly — no letter-boxing.
   
   Geographic coordinates are converted to pixel fractions using
   the calibrated bounding box of the map image content:
     Longitude -180° → 180°  maps to  x: 0% → 100%  (full width)
     Latitude   83°  → -60°  maps to  y: 0% → 100%  (full height)
   
   Formula (Mercator):
     x = (lon + 180) / 360
     lat_rad = lat * π / 180
     y = (1 - ln(tan(lat_rad) + 1/cos(lat_rad)) / π) / 2
   
   Since the image uses a simple equirectangular projection (not
   true Mercator), we use a calibrated linear approximation that
   matches the actual pixel positions in the image.
=============================== */

(function () {
  // Equirectangular projection constants calibrated to this specific map image.
  // Adjust xOffset / yOffset if your image has different margins.
  const MAP_LON_MIN = -168;
  const MAP_LON_MAX = 190;
  const MAP_LAT_MAX = 83; // top
  const MAP_LAT_MIN = -58; // bottom

  function geoToPercent(lon, lat) {
    const x = ((lon - MAP_LON_MIN) / (MAP_LON_MAX - MAP_LON_MIN)) * 100;
    const y = ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * 100;
    return { x, y };
  }

  // Pin definitions — geographic coordinates
  // lon = longitude, lat = latitude
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

    const canvasW = canvas.offsetWidth;
    const canvasH = canvas.offsetHeight;
    if (!canvasW || !canvasH) return;

    Object.entries(PIN_COORDS).forEach(([id, { lon, lat }]) => {
      const pin = pinLayer.querySelector("[data-pin-id='" + id + "']");
      if (!pin) return;
      const pct = geoToPercent(lon, lat);
      pin.style.left = pct.x.toFixed(3) + "%";
      pin.style.top = pct.y.toFixed(3) + "%";
    });
  }

  function init() {
    // Position immediately and on every resize
    positionPins();
    window.addEventListener("resize", positionPins);

    // Also fire after image fully loads (height finalises)
    const mapImg = document.querySelector(".dest-map-img");
    if (mapImg) {
      if (mapImg.complete) {
        positionPins();
      } else {
        mapImg.addEventListener("load", positionPins);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
