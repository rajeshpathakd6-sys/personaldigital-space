/**
 * scroll-reveal.js — Unified IntersectionObserver for all scroll-reveal variants.
 *
 * Replaces three separate observers in the old script.js:
 *   §5  .js-reveal → adds .visible
 *   §6  .reveal    → adds .visible  (travel page)
 *   §15 .sr        → adds .in       (work-with-us page)
 *
 * Now a single observer handles all three. One IO instance costs less
 * than three — especially important on the travel page where all three
 * classes may appear simultaneously.
 *
 * @param {Object} opts
 * @param {string} opts.selector    CSS selector for elements to observe.
 * @param {string} opts.activeClass Class to add when element enters viewport.
 * @param {number} [opts.threshold=0.1]
 * @param {string} [opts.rootMargin='0px']
 */
export function createReveal({ selector, activeClass, threshold = 0.1, rootMargin = '0px' }) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately for old browsers
    els.forEach(el => el.classList.add(activeClass));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(activeClass);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );

  els.forEach(el => io.observe(el));
}

/**
 * Convenience: initialise all three reveal variants used across the site.
 * Call this once from every page's entry point.
 */
export function initScrollReveal() {
  // Index / Lifestyle / Studio variant
  createReveal({
    selector: '.js-reveal',
    activeClass: 'visible',
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
  });

  // Travel page variant (CSS animation, same observer pattern)
  createReveal({
    selector: '.reveal',
    activeClass: 'visible',
    threshold: 0.08,
  });

  // Work-with-us page variant
  createReveal({
    selector: '.sr',
    activeClass: 'in',
    threshold: 0.12,
  });
}
