# AdiRaj — Site Layout & Developer Notes

## File Structure

```
/
├── styles.css        ← ALL styles for every page (single source of truth)
├── script.js         ← ALL JavaScript for every page (single source of truth)
├── index.html        ← Homepage
├── lifestyle.html    ← Lifestyle category page
├── studio.html       ← Studio / artwork page
├── travel.html       ← Travel destinations page
├── assets/           ← Images, logo, etc.
│   ├── logo.png
│   ├── profilephoto.JPG
│   ├── taiwan.JPG, japan.JPG, kenya.JPG, maldives.jpg, thailand.JPG
│   ├── india.jpg
│   ├── worldmapbackground.jpg
│   ├── studio/       ← art1.jpeg … art18.jpeg, craft.jpg
│   ├── lifestyle/    ← hero.jpg, vipassana.jpg, featured.jpg, food1.jpg …
│   └── followalong1–6.JPG
└── destinations/     ← Individual country/city pages
    ├── asia-india.html
    ├── asia-japan.html
    ├── asia-taiwan.html
    ├── asia-thailand.html
    ├── asia-maldives.html
    └── africa-kenya.html
```

---

## CSS Architecture

**One file: `styles.css`**

All styles are in `styles.css`. No inline `<style>` blocks exist in any HTML file.
Each section is clearly labelled with a comment banner (grep for `══` to jump sections).

| Section | What it covers |
|---|---|
| §1–17 | Global: reset, variables, top bar, header, nav, search, mobile menu, page layout, post cards, pagination, sidebar, footer, back-to-top, newsletter, reading bar, post typography, scrollbar |
| §18–23 | Index page: hero slideshow, ticker, section headers, featured card, grid cards, LS-ST editorial panels, sidebar variants |
| §24–27 | Lifestyle page: page hero, sub-nav dropdowns, section layout/cards, dark cards/panels/themes |
| §28–30 | Studio page: variables (gold, parchment), hero, product grids, creations, process, coming-soon triptych |
| §31–33 | Travel page: hero banner, ornament, map canvas, polaroid pins, popular grid, countries grid |
| §34–37 | Shared utility pages: Contact, Work With Us, About, travel destination (country/city) pages |
| §38–42 | Responsive breakpoints: 1024px, 860/820px, 760px, 620px, 480/400px |

### CSS Variables (change brand colours here)
```css
:root {
  --accent:       #c0815a;   /* main brand colour — CTAs, links, highlights */
  --accent-lt:    #e8c4a8;   /* light tint — used on dark backgrounds */
  --accent-hover: #a86a45;   /* hover state */
  --ink:          #1a1a18;   /* near-black text + dark sections */
  --gold:         #b8924a;   /* Studio page accent */
}
```

### Studio page note
`studio.html` has `<body class="studio-page">`. This triggers `body.studio-page { background: var(--parchment); }` in the CSS, giving the Studio page its distinctive warm paper background without affecting other pages.

---

## JavaScript Architecture

**One file: `script.js`**

All JavaScript lives in `script.js`. Each page includes exactly one `<script src="script.js"></script>` tag before `</body>`. Functions that target page-specific elements (e.g. `#heroSlides`, `#lsPostsGrid`) safely no-op on pages where those elements don't exist — every function guards with `if (!element) return`.

| Section | Function | Pages |
|---|---|---|
| §1 | `throttle()` helper | all |
| §2 | Sticky header `.scrolled` | all |
| §3 | Mobile menu open/close | all |
| §4 | Search bar open/close | all |
| §5 | `.js-reveal` IntersectionObserver | index, lifestyle, studio |
| §6 | `.reveal` IntersectionObserver | travel |
| §7 | Reading progress bar | post templates |
| §8 | Back-to-top button | all |
| §9 | Smooth scroll for `href="#..."` links | all |
| §10 | Newsletter micro-interaction | all |
| §11 | Active cat-nav link | index |
| §12 | Hero crossfade + Ken Burns slideshow | index |
| §13 | Paginated posts grid (`#postsGrid`) | index |
| §14 | Paginated lifestyle grid (`#lsPostsGrid`) | lifestyle |
| §15 | Lifestyle sub-nav dropdowns | lifestyle |
| §16 | Destination map: filter + sidebar hover + accordion | travel |
| §17 | Destination map: geographic pin positioning | travel |
| §18 | `scrollRow()` — studio artwork row arrows | studio |

---

## Adding New Posts

### Index grid (`index.html`)
Add a new `.grid-post-card` `<a>` block inside `#postsGrid`. Pagination is auto-calculated — 2 cards per page. Put newest posts **first** in the markup.

### Lifestyle grid (`lifestyle.html`)
Add `.ls-card` blocks inside `#lsPostsGrid`. Shows 3 per page.

---

## Adding New Destinations

1. Create a new HTML file in `destinations/` (copy an existing one as template).
2. Add the flag to `travel.html` in two places:
   - Accordion sidebar (`.dest-accordion-item`)
   - Popular destinations grid (`.dest-pop-card`)
3. Add pin data to `script.js §17` (`PIN_COORDS` object) with the country's longitude/latitude.
4. Add the background image class to `styles.css §32`:
   ```css
   .bg-yourcountry { background-image: url("assets/yourcountry.jpg"); background-size: cover; background-color: #fallback; }
   ```

---

## Responsive Breakpoints

| Breakpoint | Key changes |
|---|---|
| `≤ 1024px` | Sidebar shrinks to 260px; studio product grid 4→2 col |
| `≤ 860px`  | Sidebar stacks below main; travel map goes full-width; lifestyle grids narrow |
| `≤ 820px`  | LS-ST editorial panels go single column |
| `≤ 620px`  | Mobile: top bar hidden, burger visible, all grids → 1 col, smaller hero |
| `≤ 480px`  | Further card reductions for very small phones |

---

## Known Gotchas / Debugging Tips

- **Sticky header offset**: If sticky sub-navs overlap content, check `--header-h` and `--nav-h` in `:root`. The lifestyle sub-nav uses `top: calc(var(--header-h) + var(--nav-h))`.
- **Map pins misaligned**: The pin positions are calculated from `MAP_LON_MIN/MAX` and `MAP_LAT_MIN/MAX` constants in `script.js §17`. Adjust those if you swap the map image.
- **Studio background**: If Studio page shows wrong background colour, check `<body class="studio-page">` and `body.studio-page { background: var(--parchment); }` in CSS.
- **Newsletter button not responding**: The selector in §10 of script.js targets `.nl-btn`. Make sure the subscribe button has that class.
- **Ken Burns not restarting**: The `restartKenBurns()` function in §12 works by briefly setting `animation: none` then reverting. If it stops working after a browser update, try adding a `will-change: transform` to the `.hero-slide img` rule.
- **Lifestyle dropdowns not closing**: The click-outside handler relies on `#lsOverlay`. Make sure that element exists in `lifestyle.html`.

---

*Last updated: March 2026*
