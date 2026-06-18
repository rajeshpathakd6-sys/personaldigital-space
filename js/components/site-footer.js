/**
 * site-footer.js — <site-footer depth=".."> Web Component.
 *
 * Attributes:
 *   depth — relative path prefix to reach the site root.
 *           "."  (default) → root-level page
 *           ".." → one level deep (destinations/, lifestyle/, itineraries/)
 *           "../.." → two levels deep
 */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    const depth = (this.getAttribute('depth') || '.').replace(/\/$/, '');
    const year  = new Date().getFullYear();

    this.innerHTML = `
<footer class="prem-footer">
  <div class="prem-footer-top">
    <div class="pf-brand">
      <div class="logo-wrap pf-logo-wrap">
        <a href="${depth}/index.html" class="logo" aria-label="AdiRaj Routes &amp; Reflections — home">
          <span class="logo-icon" aria-hidden="true">
            <img src="${depth}/assets/logo-white.png" alt="" class="logo-img" width="36" height="36" loading="lazy"/>
          </span>
          <span class="logo-text-wrap">
            <span class="logo-text">AdiRaj
              <span class="logo-tagline">Routes &amp; Reflections</span>
            </span>
          </span>
        </a>
      </div>
      <p class="pf-brand-desc">Slow travel, honest stories, and the meaning we carry forward.</p>
      <div class="pf-social">
        <a href="https://www.instagram.com/adiraj.routesandreflections/" class="pf-social-link" aria-label="Follow on Instagram" target="_blank" rel="noopener">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad-footer)" stroke-width="1.6" aria-hidden="true">
            <defs>
              <linearGradient id="ig-grad-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f09433"/>
                <stop offset="50%" stop-color="#dc2743"/>
                <stop offset="100%" stop-color="#bc1888"/>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="#bc1888" stroke="none"/>
          </svg>
        </a>
        <a href="https://in.pinterest.com/adirajroutesandreflections/" class="pf-social-link" aria-label="Follow on Pinterest" target="_blank" rel="noopener">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="#E60023" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
        </a>
        <a href="https://x.com/AdiRaj_RandR" class="pf-social-link" aria-label="Follow on X (Twitter)" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#888" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>
    </div>

    <div class="pf-col">
      <p class="pf-col-title">Explore</p>
      <ul class="pf-col-links">
        <li><a href="${depth}/travel.html">Travel</a></li>
        <li><a href="${depth}/lifestyle.html">Lifestyle</a></li>
        <li><a href="${depth}/studio.html">Studio</a></li>
        <li><a href="${depth}/about.html">About Us</a></li>
      </ul>
    </div>

    <div class="pf-col">
      <p class="pf-col-title">Connect</p>
      <ul class="pf-col-links">
        <li><a href="${depth}/workwithus.html">Work With Us</a></li>
        <li><a href="${depth}/contact.html">Contact</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
    </div>

    <div class="pf-newsletter">
      <p class="pf-col-title">Newsletter</p>
      <p class="pf-newsletter-desc">Quiet reflections and new stories, only when it matters.</p>
      <form class="nl-form" aria-label="Newsletter signup">
        <label for="footer-nl-email" class="visually-hidden">Your email address</label>
        <input type="email" id="footer-nl-email" class="nl-input"
               placeholder="youremailaddress@email.com" required autocomplete="email"/>
        <button type="submit" class="nl-btn">Subscribe</button>
      </form>
      <p class="pf-nl-note">No spam &nbsp;·&nbsp; Unsubscribe anytime</p>
    </div>
  </div>

  <div class="pf-footer-bottom">
    <p class="pf-copy">© ${year} AdiRaj- Routes &amp; Reflections &nbsp;|&nbsp; All rights reserved</p>
    <nav class="pf-bottom-links" aria-label="Footer links">
      <a href="${depth}/index.html">Home</a>
      <a href="#">Privacy</a>
      <a href="${depth}/contact.html">Contact</a>
    </nav>
  </div>
</footer>

<button class="back-to-top" id="backToTop" aria-label="Back to top">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>`;
  }
}

customElements.define('site-footer', SiteFooter);
