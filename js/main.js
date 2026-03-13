/**
 * Hotel Barlovento — Main JavaScript
 * Lightweight, no frameworks, no dependencies.
 *
 * Features:
 * 1. Sticky header scroll shadow
 * 2. Mobile menu toggle
 * 3. Smooth scroll for anchor links
 * 4. Scroll-reveal animation observer
 * 5. FAQ accordion
 * 6. Active nav link on scroll
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. STICKY HEADER — add shadow on scroll
  ------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');

  if (header) {
    const onHeaderScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll(); // run once on load
  }


  /* ------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
  ------------------------------------------------------------------ */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      // Prevent body scroll when menu open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu when a link is clicked
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }


  /* ------------------------------------------------------------------
     3. SMOOTH SCROLL for anchor links
     (CSS scroll-behavior handles basic cases, but this ensures
      the offset accounts for the sticky header height)
  ------------------------------------------------------------------ */
  const HEADER_OFFSET = 80; // px — adjust if header height changes

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ------------------------------------------------------------------
     4. SCROLL REVEAL — Intersection Observer
  ------------------------------------------------------------------ */
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once only
      }
    });
  }, revealObserverOptions);

  // Observe .reveal elements
  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // Observe .stagger containers
  document.querySelectorAll('.stagger').forEach((el) => {
    revealObserver.observe(el);
  });


  /* ------------------------------------------------------------------
     5. FAQ ACCORDION
  ------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const body = item.querySelector('.faq-item__body');

    if (!trigger || !body) return;

    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.faq-item__trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });


  /* ------------------------------------------------------------------
     6. ACTIVE NAV LINK on scroll (desktop nav highlight)
  ------------------------------------------------------------------ */
  const navLinks = document.querySelectorAll('.main-nav__link[href^="#"]');
  const sections = [];

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href');
    const section = document.querySelector(targetId);
    if (section) sections.push({ link, section });
  });

  if (sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            const activeLink = sections.find(
              (s) => s.section === entry.target
            );
            if (activeLink) activeLink.link.classList.add('active');
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach(({ section }) => navObserver.observe(section));
  }

  // Add active style via JS (add to CSS if preferred)
  const styleTag = document.createElement('style');
  styleTag.textContent = `.main-nav__link.active { color: var(--color-teal); }
  .main-nav__link.active::after { width: 100%; }`;
  document.head.appendChild(styleTag);

})();
