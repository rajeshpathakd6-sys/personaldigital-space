/**
 * slider.js — Generic, reusable slider/carousel factory.
 *
 * Replaces three near-identical IIFEs in the old script.js:
 *   §20  Popular destinations slider  (#destPopTrack)
 *   §21  Itinerary slider             (#itinTrack)
 *   …and any future sliders on any page.
 *
 * Features:
 *  - Responsive: recalculates visible count on resize
 *  - Dot navigation with accessible aria-labels
 *  - Mouse drag support
 *  - Touch swipe support
 *  - Prev/Next buttons with disabled state
 *
 * @param {Object} opts
 * @param {string} opts.trackId      ID of the sliding track element
 * @param {string} opts.prevId       ID of the "previous" button
 * @param {string} opts.nextId       ID of the "next" button
 * @param {string} opts.dotsId       ID of the dots container element
 * @param {string} opts.cardSelector CSS selector for card elements (relative to track)
 * @param {number} [opts.gap=24]     Gap between cards in px (must match CSS gap)
 * @param {Function} [opts.getVisible] Function(windowWidth) → number of visible cards.
 *                                     Defaults to a standard breakpoint set.
 */
export function createSlider({
  trackId,
  prevId,
  nextId,
  dotsId,
  cardSelector = ':scope > *',
  gap = 24,
  getVisible,
}) {
  const track  = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsWrap = document.getElementById(dotsId);

  if (!track) return; // Safe no-op on pages that don't have this slider

  const cards = Array.from(track.querySelectorAll(cardSelector));
  if (!cards.length) return;

  let idx = 0;

  // Default responsive breakpoints — matches old behaviour exactly
  const defaultGetVisible = (w) => {
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 4;
  };
  const visibleCount = getVisible || defaultGetVisible;

  function maxIdx() {
    return Math.max(0, cards.length - visibleCount(window.innerWidth));
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const total = maxIdx() + 1;
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'dest-pop-dot' + (i === idx ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function goTo(i) {
    idx = Math.max(0, Math.min(i, maxIdx()));
    const cardW = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${idx * (cardW + gap)}px)`;

    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx >= maxIdx();

    dotsWrap && dotsWrap.querySelectorAll('[aria-label]').forEach((d, j) => {
      d.classList.toggle('active', j === idx);
    });
  }

  // Buttons
  prevBtn && prevBtn.addEventListener('click', () => goTo(idx - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(idx + 1));

  // Resize
  window.addEventListener('resize', () => { buildDots(); goTo(idx); });

  // Mouse drag
  let startX = 0, dragging = false;
  track.addEventListener('mousedown', (e) => { dragging = true; startX = e.clientX; });
  track.addEventListener('mousemove', (e) => { if (dragging) e.preventDefault(); });
  track.addEventListener('mouseup',   (e) => {
    if (!dragging) return;
    dragging = false;
    const d = startX - e.clientX;
    if (Math.abs(d) > 50) goTo(d > 0 ? idx + 1 : idx - 1);
  });
  track.addEventListener('mouseleave', () => { dragging = false; });

  // Touch swipe
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   (e) => {
    const d = startX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) goTo(d > 0 ? idx + 1 : idx - 1);
  });

  buildDots();
  goTo(0);
}
