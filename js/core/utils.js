/**
 * utils.js — Shared utility functions.
 * Pure helpers with no DOM side-effects; safe to import anywhere.
 */

/**
 * Throttle: limits how often `fn` fires during rapid events (scroll, resize).
 * @param {Function} fn
 * @param {number}   ms  Minimum milliseconds between calls.
 * @returns {Function}
 */
export function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce: delays `fn` until `ms` have passed since the last call.
 * @param {Function} fn
 * @param {number}   ms
 * @returns {Function}
 */
export function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}
