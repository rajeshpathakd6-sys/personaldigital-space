/**
 * about.js — About page: continuous Moments slideshow.
 *
 * A polaroid filmstrip that scrolls continuously and seamlessly (marquee
 * style). The slide set is cloned once so the loop never shows a seam.
 * Prev/next arrows nudge the reel a card at a time; auto-scroll pauses on
 * hover and briefly after manual navigation, and is disabled entirely for
 * visitors who prefer reduced motion.
 */
function initMomentsCarousel() {
  const track = document.getElementById('aboutMomentsTrack');
  if (!track) return;

  const prev = document.getElementById('aboutMomentsPrev');
  const next = document.getElementById('aboutMomentsNext');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Duplicate the slides so the strip can loop without a visible seam.
  // Clones inherit the inline onerror handler and any placeholder class.
  const originals = Array.from(track.children);
  originals.forEach((node) => track.appendChild(node.cloneNode(true)));

  // Width of the original (un-cloned) set — the seamless wrap point.
  function halfWidth() {
    return track.scrollWidth / 2;
  }

  // One card width + gap, for arrow nudges.
  function step() {
    const card = track.querySelector('.about-moment');
    if (!card) return 160;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 18;
    return card.getBoundingClientRect().width + gap;
  }

  // Keep scrollLeft inside [0, halfWidth) so the loop is invisible.
  function normalize() {
    const half = halfWidth();
    if (half <= 0) return;
    if (track.scrollLeft >= half) track.scrollLeft -= half;
    else if (track.scrollLeft < 0) track.scrollLeft += half;
  }

  const SPEED = 0.5; // px per frame — slow, ambient drift
  let running = !reducedMotion;
  let rafId = null;
  // Own position accumulator: reading back scrollLeft floors sub-pixel
  // values, so a JS accumulator is what actually makes the drift progress.
  let pos = track.scrollLeft;

  function frame() {
    if (running) {
      const half = halfWidth();
      pos += SPEED;
      if (half > 0 && pos >= half) pos -= half;
      track.scrollLeft = pos;
    }
    rafId = requestAnimationFrame(frame);
  }

  // Manual nudge: pause the drift, smooth-scroll one card, then resume in sync.
  let resumeTimeout = null;
  function nudge(dir) {
    running = false;
    clearTimeout(resumeTimeout);
    track.scrollBy({ left: dir * step(), behavior: 'smooth' });
    // Resync the accumulator once the smooth scroll settles.
    setTimeout(() => {
      normalize();
      pos = track.scrollLeft;
      if (!reducedMotion) running = true;
    }, 700);
  }

  prev && prev.addEventListener('click', () => nudge(-1));
  next && next.addEventListener('click', () => nudge(1));

  // Pause while the pointer is over the reel; resync on the way out.
  track.addEventListener('pointerenter', () => { running = false; });
  track.addEventListener('pointerleave', () => {
    pos = track.scrollLeft;
    if (!reducedMotion) { clearTimeout(resumeTimeout); running = true; }
  });

  rafId = requestAnimationFrame(frame);
}

initMomentsCarousel();
