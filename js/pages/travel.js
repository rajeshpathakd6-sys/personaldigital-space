/**
 * pages/travel.js — Entry point for travel.html.
 */

// Core
import { initHeader }       from '../core/header.js';
import { initMobileMenu }   from '../core/mobile-menu.js';
import { initSearch }       from '../core/search.js';
import { initScrollReveal } from '../core/scroll-reveal.js';
import { initBackToTop }    from '../core/back-to-top.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initNewsletter }   from '../core/newsletter.js';

// Components
import { createSlider }     from '../components/slider.js';
import { createSlideshow }  from '../components/slideshow.js';

// ── Shared init ──────────────────────────────────────────
initHeader();
initMobileMenu();
initSearch();
initScrollReveal();
initBackToTop();
initSmoothScroll();
initNewsletter();

// ── Travel hero slideshow (dhv2) ──────────────────────────
createSlideshow({
  slideSelector: '.dhv2-slide',
  activeClass: 'dhv2-slide--active',
  interval: 5000,
  kenBurns: false,
});

// ── Popular destinations slider ───────────────────────────
createSlider({
  trackId:      'destPopTrack',
  prevId:       'destPopPrev',
  nextId:       'destPopNext',
  dotsId:       'destPopDots',
  cardSelector: '.dest-pop-card',
  gap: 24,
  getVisible: (w) => {
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 4;
  },
});

// ── Itinerary slider ──────────────────────────────────────
createSlider({
  trackId:      'itinTrack',
  prevId:       'itinPrev',
  nextId:       'itinNext',
  dotsId:       'itinDots',
  cardSelector: '.itin-card',
  gap: 24,
  getVisible: (w) => {
    if (w <= 580) return 1;
    if (w <= 900) return 2;
    return 3;
  },
});

// ── Destination map: filter + sidebar hover + accordion ───
document.addEventListener('DOMContentLoaded', () => {
  const filterSelect = document.getElementById('destFilterSelect');
  const pins         = document.querySelectorAll('.dest-pin');

  if (filterSelect && pins.length) {
    filterSelect.addEventListener('change', function () {
      const val = this.value;
      pins.forEach((pin) => {
        const match = !val || pin.dataset.region === val;
        pin.style.opacity       = match ? '1' : '0.18';
        pin.style.pointerEvents = match ? 'auto' : 'none';
      });
    });
  }

  const sidebarItems = document.querySelectorAll('.dest-sidebar-item');
  if (sidebarItems.length && pins.length) {
    sidebarItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const region = item.dataset.region;
        pins.forEach((pin) => {
          const active = pin.dataset.region === region;
          pin.style.transform = active
            ? 'translate(-50%,-100%) scale(1.12)'
            : 'translate(-50%,-100%) scale(0.92)';
          pin.style.opacity = active ? '1' : '0.4';
        });
      });
      item.addEventListener('mouseleave', () => {
        pins.forEach((pin) => { pin.style.transform = ''; pin.style.opacity = ''; });
      });
    });
  }

  const accordions = document.querySelectorAll('.dest-accordion-item');
  if (accordions.length) {
    accordions.forEach((item) => {
      const hdr = item.querySelector('.dest-sidebar-item');
      if (!hdr) return;
      hdr.addEventListener('click', () => {
        accordions.forEach(i => { if (i !== item) i.classList.remove('active'); });
        item.classList.toggle('active');
      });
    });
    document.addEventListener('click', (e) => {
      const wrap = document.querySelector('.dest-sidebar-items');
      if (wrap && !wrap.contains(e.target)) {
        accordions.forEach(item => item.classList.remove('active'));
      }
    });
  }
});

// ── Geographic pin positioning ─────────────────────────────
(function () {
  const MAP_LON_MIN = -168, MAP_LON_MAX = 190;
  const MAP_LAT_MAX = 83,   MAP_LAT_MIN = -58;

  function geoToPercent(lon, lat) {
    return {
      x: ((lon - MAP_LON_MIN) / (MAP_LON_MAX - MAP_LON_MIN)) * 100,
      y: ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * 100,
    };
  }

  const PIN_COORDS = {
    'pin-india':    { lon: 78,  lat: 22 },
    'pin-japan':    { lon: 138, lat: 36 },
    'pin-taiwan':   { lon: 121, lat: 24 },
    'pin-thailand': { lon: 101, lat: 13 },
    'pin-kenya':    { lon: 37,  lat: 0  },
    'pin-maldives': { lon: 73,  lat: 3  },
    'pin-srilanka': { lon: 81,  lat: 8  },
  };

  function positionPins() {
    const canvas   = document.querySelector('.dest-map-canvas');
    const pinLayer = document.querySelector('.dest-map-pin-layer');
    if (!canvas || !pinLayer || !canvas.offsetWidth) return;
    Object.entries(PIN_COORDS).forEach(([id, { lon, lat }]) => {
      const pin = pinLayer.querySelector(`[data-pin-id='${id}']`);
      if (!pin) return;
      const p = geoToPercent(lon, lat);
      pin.style.left = p.x.toFixed(3) + '%';
      pin.style.top  = p.y.toFixed(3) + '%';
    });
  }

  function init() {
    positionPins();
    window.addEventListener('resize', positionPins);
    const mapImg = document.querySelector('.dest-map-img');
    if (mapImg) {
      mapImg.complete ? positionPins() : mapImg.addEventListener('load', positionPins);
    }
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
