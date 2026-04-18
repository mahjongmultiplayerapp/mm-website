'use client';

import { useEffect } from 'react';
import { landingMarkup } from './landingMarkup';

export default function Home() {
  useEffect(() => {
    document.body.dataset.hero = 'default';
    document.body.dataset.accent = 'gold';
    document.body.style.setProperty('--felt-opacity', '0.55');

    const toggle = (id: string, on: boolean) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('on', on);
    };

    const showToast = (message?: string) => {
      const toast = document.getElementById('toast');
      if (!toast) return;
      const text = toast.querySelector('span:last-child');
      if (message && text) text.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3400);
    };

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const signupTrigger = target.closest('.nav-cta, [onclick*="openSignupModal"], a[href="#signup"]');
      if (signupTrigger) {
        event.preventDefault();
        toggle('signupModal', true);
        return;
      }

      const contactTrigger = target.closest('[onclick*="openContactModal"]');
      if (contactTrigger) {
        event.preventDefault();
        toggle('contactModal', true);
        return;
      }

      if (target.closest('#signupModal .modal-backdrop, #signupModal .modal-close')) {
        event.preventDefault();
        toggle('signupModal', false);
        return;
      }

      if (target.closest('#contactModal .modal-backdrop, #contactModal .modal-close')) {
        event.preventDefault();
        toggle('contactModal', false);
      }
    };

    const onSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form) return;

      const signupForm = form.matches('#signup, .final .capture, #signupModal .capture');
      const contactForm = form.matches('#contactModal .contact-form');
      if (!signupForm && !contactForm) return;

      event.preventDefault();
      form.reset();

      if (contactForm) {
        toggle('contactModal', false);
        showToast("Thanks! We'll be in touch as soon as possible.");
      } else {
        toggle('signupModal', false);
        showToast();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      toggle('signupModal', false);
      toggle('contactModal', false);
    };

    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('submit', onSubmit);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: landingMarkup }} />;
}
