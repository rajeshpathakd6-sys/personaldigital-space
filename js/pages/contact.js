/**
 * pages/contact.js — Entry point for contact.html.
 */

// Core
import { initHeader }       from '../core/header.js';
import { initMobileMenu }   from '../core/mobile-menu.js';
import { initSearch }       from '../core/search.js';
import { initScrollReveal } from '../core/scroll-reveal.js';
import { initBackToTop }    from '../core/back-to-top.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initNewsletter }   from '../core/newsletter.js';

// Form handler
import { initContactForm } from '../forms/contact.js';

initHeader();
initMobileMenu();
initSearch();
initScrollReveal();
initBackToTop();
initSmoothScroll();
initNewsletter();
initContactForm();
