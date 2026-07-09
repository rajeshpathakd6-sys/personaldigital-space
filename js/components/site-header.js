/**
 * site-header.js — <site-header active="travel" depth=".."> Web Component.
 *
 * Attributes:
 *   active  — nav link name to highlight (e.g. "travel", "lifestyle", "about").
 *             Matched case-insensitively against link text.
 *   depth   — relative path prefix to reach the site root.
 *             "."  (default) → root-level page  (index.html, about.html…)
 *             ".." → one level deep            (destinations/, lifestyle/, itineraries/)
 *             "../.." → two levels deep        (lifestyle/articles/, travel/articles/)
 *
 * Usage:
 *   Root pages:     <site-header active="travel"></site-header>
 *   Sub-pages:      <site-header active="travel" depth=".."></site-header>
 *   Deep sub-pages: <site-header active="lifestyle" depth="../.."></site-header>
 */
class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = (this.getAttribute('active') || 'home').toLowerCase();
    const depth  = (this.getAttribute('depth') || '.').replace(/\/$/, '');

    const navLinks = [
      { label: 'Home',         href: `${depth}/index.html` },
      { label: 'Travel',       href: `${depth}/travel.html` },
      { label: 'Lifestyle',    href: `${depth}/lifestyle.html` },
      { label: 'Studio',       href: `${depth}/studio.html` },
      { label: 'About',        href: `${depth}/about.html` },
      { label: 'Work With Us', href: `${depth}/workwithus.html` },
    ];

    const navHTML = navLinks.map(({ label, href }) => {
      const isActive = label.toLowerCase() === active ||
                       (active === 'home' && label === 'Home');
      return `<a href="${href}" class="prem-nav-link${isActive ? ' active' : ''}"
                 ${isActive ? 'aria-current="page"' : ''}>${label}</a>`;
    }).join('');

    const mobileNavHTML = navLinks.map(({ label, href }) =>
      `<a href="${href}">${label}</a>`
    ).join('');

    const logoPath   = `${depth}/assets/logo.png`;
    const logoWPath  = `${depth}/assets/logo-white.png`;
    const contactURL = `${depth}/contact.html`;

    this.innerHTML = `
<header class="prem-header" id="siteHeader">
  <div class="prem-header-inner">
    <div class="logo-wrap">
      <a href="${depth}/index.html" class="logo" aria-label="AdiRaj Routes &amp; Reflections — home">
        <img src="${depth}/assets/AdiRaj.png" alt="AdiRaj Routes &amp; Reflections" class="site-logo-img"/>
      </a>
    </div>
    <nav class="prem-nav-center" aria-label="Main navigation">
      ${navHTML}
    </nav>
    <button class="prem-search-btn" id="searchToggle" aria-label="Open search" aria-expanded="false">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16.5" y1="16.5" x2="22" y2="22"/>
      </svg>
    </button>
    <button class="prem-burger" id="burger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="prem-header-divider" aria-hidden="true"></div>
</header>

<div class="search-bar" id="searchBar" role="search" aria-hidden="true">
  <div class="search-bar-inner">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
    <input type="search" placeholder="Search posts, destinations, topics…"
           id="searchInput" aria-label="Search posts, destinations, topics"/>
    <button class="search-close" id="searchClose" aria-label="Close search">✕</button>
  </div>
</div>

<div class="mob-menu" id="mobMenu" role="dialog" aria-modal="true" aria-label="Site navigation">
  <button class="mob-close" id="mobClose" aria-label="Close navigation menu">✕</button>
  <nav class="mob-nav" aria-label="Mobile navigation">
    ${mobileNavHTML}
    <div class="mob-divider" aria-hidden="true"></div>
    <a href="${contactURL}">Contact</a>
  </nav>
</div>`;
  }
}

customElements.define('site-header', SiteHeader);
