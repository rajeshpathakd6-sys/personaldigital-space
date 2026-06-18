/**
 * forms/work-with-us.js — Work With Us page form submission.
 * Uses multipart FormData (file attachments possible).
 */
import { initForm } from './shared.js';

export function initWorkWithUsForm() {
  initForm({
    formId: 'wwuForm',
    submitSelector: '.btn-wwu-submit',
    successMsgId: 'wwuSuccessMsg',
    endpoint: '/api/workwithus',
    loadingText: 'Sending...',
    idleText: "Let's Collaborate →",
    // buildPayload defaults to new FormData(form)
  });
}
