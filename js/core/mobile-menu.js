/**
 * mobile-menu.js — Mobile menu open/close with focus trap and ARIA.
 *
 * Replaces the old pattern of inline onclick="closeMob()" on nav links.
 * Instead, every <a> inside .mob-nav automatically closes the menu
 * via event delegation — no globals needed.
 *
 * Accessibility:
 *  - Sets role="dialog" + aria-modal="true" on the menu panel
 *  - Traps Tab focus inside the menu while open
 *  - Returns focus to burger on close
 *  - Closes on Escape
 */

let mobOpen = false;

export function initMobileMenu() {
  const burger  = document.getElementById('burger');
  const mobMenu = document.getElementById('mobMenu');
  const mobClose = document.getElementById('mobClose');

  if (!burger || !mobMenu) return;

  // ARIA setup
  mobMenu.setAttribute('role', 'dialog');
  mobMenu.setAttribute('aria-modal', 'true');
  mobMenu.setAttribute('aria-label', 'Site navigation');

  // Collect focusable elements inside the menu
  function getFocusable() {
    return Array.from(
      mobMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled);
  }

  function openMob() {
    mobOpen = true;
    mobMenu.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Move focus into menu
    const first = getFocusable()[0];
    if (first) first.focus();
  }

  function closeMob() {
    mobOpen = false;
    mobMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }

  // Focus trap
  mobMenu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  burger.addEventListener('click', () => (mobOpen ? closeMob() : openMob()));
  mobClose && mobClose.addEventListener('click', closeMob);

  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobOpen) closeMob(); });

  // Event delegation: any link inside mob-nav closes menu
  const mobNav = mobMenu.querySelector('.mob-nav');
  if (mobNav) {
    mobNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMob();
    });
  }
}
