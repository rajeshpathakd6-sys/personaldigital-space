/**
 * slideshow.js — Crossfade + Ken Burns hero slideshow factory.
 *
 * Covers §12 (index hero) and §19 (travel dhv2 hero) in the old script.
 * A factory function so any page can instantiate its own slideshow
 * without conflicting state or class-name collisions.
 *
 * @param {Object} opts
 * @param {string} opts.slideSelector  CSS selector for slide elements.
 * @param {string} opts.dotSelector    CSS selector for dot indicators (optional).
 * @param {string} [opts.activeClass='active']  Class toggled on active slide/dot.
 * @param {number} [opts.interval=5500]  Auto-advance interval in ms.
 * @param {boolean} [opts.kenBurns=true] Whether to restart Ken Burns on each slide.
 */
export function createSlideshow({
  slideSelector,
  dotSelector = null,
  activeClass = 'active',
  interval = 5500,
  kenBurns = true,
}) {
  const slides = document.querySelectorAll(slideSelector);
  if (!slides.length) return;

  const dots  = dotSelector ? document.querySelectorAll(dotSelector) : [];
  const total = slides.length;
  let current = 0;
  let timer;

  function restartKenBurns(slide) {
    if (!kenBurns) return;
    const img = slide.querySelector('img');
    if (!img) return;
    img.style.animation = 'none';
    img.offsetHeight; // force reflow to restart animation
    img.style.animation = '';
  }

  function goTo(index) {
    slides[current].classList.remove(activeClass);
    if (dots[current]) dots[current].classList.remove(activeClass);
    current = (index + total) % total;
    slides[current].classList.add(activeClass);
    if (dots[current]) dots[current].classList.add(activeClass);
    restartKenBurns(slides[current]);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), interval);
  }

  // Wire dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startTimer();
    });
  });

  startTimer();

  return { goTo, startTimer };
}
