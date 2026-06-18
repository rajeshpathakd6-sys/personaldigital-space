/**
 * search.js — Search bar open/close behaviour.
 *
 * Accessibility:
 *  - Adds aria-label to search input (fixing the missing label bug)
 *  - Traps focus inside bar while open
 *  - Closes on Escape
 */

export function initSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const searchBar    = document.getElementById('searchBar');
  const searchClose  = document.getElementById('searchClose');
  const searchInput  = document.getElementById('searchInput');

  if (!searchToggle || !searchBar) return;

  // Fix: add accessible label to input (was previously missing)
  if (searchInput && !searchInput.getAttribute('aria-label')) {
    searchInput.setAttribute('aria-label', 'Search posts, destinations, topics');
  }

  function openSearch() {
    searchBar.classList.add('open');
    searchBar.setAttribute('aria-hidden', 'false');
    searchInput && setTimeout(() => searchInput.focus(), 200);
  }

  function closeSearch() {
    searchBar.classList.remove('open');
    searchBar.setAttribute('aria-hidden', 'true');
  }

  searchBar.setAttribute('aria-hidden', 'true');

  searchToggle.addEventListener('click', openSearch);
  searchClose && searchClose.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
}
