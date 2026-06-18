/**
 * forms/contact.js — Contact page form submission.
 */
import { initForm } from './shared.js';

export function initContactForm() {
  initForm({
    formId: 'contactForm',
    submitSelector: '.btn-submit',
    successMsgId: 'successMsg',
    endpoint: '/api/contact',
    loadingText: 'Sending...',
    idleText: 'Send Message',
    buildPayload: (form) => {
      const name    = document.getElementById('name')?.value;
      const email   = document.getElementById('email')?.value;
      const message = document.getElementById('message')?.value;
      return JSON.stringify({ name, email, message });
    },
    headers: { 'Content-Type': 'application/json' },
  });
}
