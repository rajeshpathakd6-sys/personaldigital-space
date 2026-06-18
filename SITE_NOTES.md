# AdiRaj — Site Layout & Developer Notes (v2 — Modular Architecture)

## File Structure

```
/
├── styles.css              ← All styles (unchanged; split in Phase 2)
├── css/
│   ├── tokens/
│   │   └── tokens.css      ← Single source of truth for all design tokens
│   └── components/
│       └── inline-style-patch.css  ← Converts all former inline styles to named classes
├── js/
│   ├── core/               ← Shared utilities, run on every page
│   │   ├── utils.js          throttle, debounce
│   │   ├── header.js         sticky header scroll behaviour
│   │   ├── mobile-menu.js    mobile menu with focus trap + ARIA
│   │   ├── search.js         search bar open/close
│   │   ├── scroll-reveal.js  unified IntersectionObserver (replaces 3 duplicates)
│   │   ├── back-to-top.js    back-to-top button
│   │   ├── smooth-scroll.js  anchor link scroll with header offset
│   │   └── newsletter.js     newsletter form API call
│   ├── components/         ← Reusable UI factories and Web Components
│   │   ├── site-ribbon.js    <site-ribbon> Web Component
│   │   ├── site-header.js    <site-header active="travel"> Web Component
│   │   ├── site-footer.js    <site-footer> Web Component
│   │   ├── slider.js         createSlider() factory (replaces 3 duplicate IIFEs)
│   │   └── slideshow.js      createSlideshow() factory
│   ├── pages/              ← Page-specific entry points (each page loads only its own)
│   │   ├── index.js
│   │   ├── travel.js
│   │   ├── lifestyle.js
│   │   ├── studio.js
│   │   ├── contact.js
│   │   ├── work-with-us.js
│   │   └── shared-pages.js   ← for about, resources, accommodation (content-only pages)
│   └── forms/              ← Form handlers
│       ├── shared.js         common submit/feedback pattern
│       ├── contact.js        contact form
│       └── work-with-us.js   work-with-us form
├── index.html              ← Refactored: uses Web Components, ES modules, lazy images
├── travel.html             ← Refactored (template: copy index.html pattern)
├── lifestyle.html          ← Refactored
├── studio.html             ← Refactored
├── about.html              ← Refactored
├── contact.html            ← Refactored
├── workwithus.html         ← Refactored
└── assets/                 ← Images, logo, etc. (unchanged)
    └── …
```

---

## How to Update Every Page's Header, Footer, or Ribbon

**Before (old architecture):** Edit all 7 HTML files individually.

**After (new architecture):** Edit a single Web Component file:

| What to change | Edit this file |
|---|---|
| Top ribbon (social links, contact button) | `js/components/site-ribbon.js` |
| Header logo, navigation links | `js/components/site-header.js` |
| Footer columns, social links, newsletter, copyright | `js/components/site-footer.js` |

The copyright year in `site-footer.js` is dynamic (`new Date().getFullYear()`) — it never needs manual updating.

---

## HTML Page Template

Every page now follows this minimal shell pattern (see `index.html` for the full example):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title — AdiRaj</title>
    <meta name="description" content="…" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <site-ribbon></site-ribbon>
    <site-header active="about"></site-header>   <!-- change active= per page -->

    <main>
      <!-- page-specific content only -->
    </main>

    <site-footer></site-footer>

    <script type="module" src="js/components/site-ribbon.js"></script>
    <script type="module" src="js/components/site-header.js"></script>
    <script type="module" src="js/components/site-footer.js"></script>
    <script type="module" src="js/pages/shared-pages.js"></script>
    <!-- Use js/pages/travel.js, lifestyle.js, etc. for pages with interactive features -->
  </body>
</html>
```

The `active` attribute on `<site-header>` sets the active nav link. Valid values: `home`, `travel`, `lifestyle`, `studio`, `about`, `work with us`.

---

## JavaScript Architecture

### Core modules (run on every page)
All are pure ES modules with no global variables except `window.scrollRow` on studio.html (required for inline onclick compatibility until a full data-attribute refactor).

### createSlider() factory
Replaces three near-identical slider IIFEs. Usage:

```js
import { createSlider } from '../components/slider.js';

createSlider({
  trackId:      'destPopTrack',     // ID of scrolling track
  prevId:       'destPopPrev',      // ID of prev button
  nextId:       'destPopNext',      // ID of next button
  dotsId:       'destPopDots',      // ID of dots container
  cardSelector: '.dest-pop-card',   // card elements inside track
  gap: 24,                          // gap in px (match CSS gap)
  getVisible: (w) => {              // optional: override breakpoints
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 4;
  },
});
```

### createReveal() / initScrollReveal()
Replaces three IntersectionObserver instances (`.js-reveal`, `.reveal`, `.sr`). Call `initScrollReveal()` once per page and all three are handled.

### initForm() shared pattern
Both contact and work-with-us forms use the same `initForm()` base. To add a new form:

```js
import { initForm } from '../forms/shared.js';

initForm({
  formId:         'myForm',
  submitSelector: '.my-submit-btn',
  successMsgId:   'mySuccessMsg',
  endpoint:       '/api/my-endpoint',
  loadingText:    'Saving...',
  idleText:       'Save',
});
```

---

## Adding New Posts

Same as before — add `.grid-post-card` blocks inside `#postsGrid` in `index.html`. Pagination auto-calculates (3 cards per page). Put newest posts **first** in the markup.

## Adding New Destinations

1. Create a new HTML file in `destinations/` (copy an existing one, replace `<site-header active="travel">`).
2. Add to `travel.html` in:
   - Accordion sidebar (`.dest-accordion-item`)
   - Popular destinations grid (`.dest-pop-card`)
3. Add pin data to `js/pages/travel.js` in `PIN_COORDS`.
4. Add background image class to `styles.css`:
   ```css
   .bg-yourcountry { background-image: url("assets/yourcountry.jpg"); background-size: cover; background-color: #fallback; }
   ```

---

## CSS Variables — Rebrand Here

All design tokens are in `css/tokens/tokens.css`. To rebrand:

```css
:root {
  --accent:       #c0815a;   /* CTAs, links, highlights */
  --accent-lt:    #e8c4a8;   /* Light tint on dark backgrounds */
  --accent-hover: #a86a45;   /* Hover state */
  --gold:         #b8924a;   /* Studio page accent */
}
```

---

## Accessibility Improvements (v2)

| Issue | Fix |
|---|---|
| Missing `<label>` on search input | Added `aria-label` in `site-header.js` and `search.js` |
| Mobile menu has no focus trap | `mobile-menu.js` traps Tab, returns focus to burger on close |
| Mobile menu has no ARIA | Added `role="dialog"`, `aria-modal`, `aria-label` |
| `onclick="closeMob()"` global leak | Replaced with event delegation in `mobile-menu.js` |
| Footer newsletter input has no label | Added `<label for="footer-email">` with `.visually-hidden` in `site-footer.js` |
| Hero slides not lazy-loaded | Slides 2–5 now use `loading="lazy"` |
| Instagram grid links lack accessible names | Added `aria-label="Instagram post N"` |

---

## Responsive Breakpoints

Unchanged from v1 — all breakpoints remain in `styles.css`:

| Breakpoint | Key changes |
|---|---|
| `≤ 1024px` | Sidebar shrinks; studio grid 4→2 col |
| `≤ 860px`  | Sidebar stacks below main |
| `≤ 820px`  | LS-ST editorial panels go single column |
| `≤ 620px`  | Mobile: burger visible, all grids → 1 col |
| `≤ 480px`  | Further card reductions for small phones |

---

## Phase 2 Roadmap (next steps)

1. **Split `styles.css` into `@layer` files** using Vite:
   - `@layer reset, tokens, components, pages, utilities`
   - Each page `<link>`s only its own page CSS + shared components
   - Dead rules become detectable per page

2. **Add `srcset` and `<picture>` for images** — WebP sources at 1×/2× for hero images.

3. **Paginate from a data file** — move post metadata to `posts.json`, generate cards in JS to decouple content from markup.

4. **SSG migration** (optional) — Eleventy gives Nunjucks partials, sitemap, RSS, and a content pipeline. The JS module structure from Phase 1 carries over unchanged.

---

*Last updated: June 2026 — v2 modular architecture*
