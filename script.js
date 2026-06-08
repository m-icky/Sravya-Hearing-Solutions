/* ========================================
   SRAVYA HEARING SOLUTIONS - script.js
   Premium Hearing Care Website
   ======================================== */

'use strict';

// ===== PAGE LOADER =====
const pageLoader = document.getElementById('pageLoader');
const loaderProgress = document.getElementById('loaderProgress');

let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 18 + 5;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      pageLoader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }, 300);
  }
  loaderProgress.style.width = loadProgress + '%';
}, 100);

document.body.style.overflow = 'hidden';

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== CUSTOM CURSOR =====
(function initCursor() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const outer = document.getElementById('cursorOuter');
  const inner = document.getElementById('cursorInner');
  if (!outer || !inner) return;

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = mouseX + 'px';
    inner.style.top = mouseY + 'px';
  });

  function animateCursor() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    outer.style.left = outerX + 'px';
    outer.style.top = outerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mousedown', () => outer.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => outer.classList.remove('cursor-click'));

  const hoverTargets = 'a, button, .service-card, .why-card, .pillar-card, .stat-card, .testimonial-card, .step-card, .nav-link';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => outer.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => outer.classList.remove('cursor-hover'));
  });
})();

// ===== HERO CANVAS PARTICLES =====
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const particleCount = window.matchMedia('(max-width: 768px)').matches ? 40 : 80;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6 ? '#1DB5E7' : '#FFFFFF';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(29, 181, 231, ' + (0.15 * (1 - dist / 100)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();

  // Parallax on mouse & touch
  let heroMouseX = 0, heroMouseY = 0;
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      heroMouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      heroMouseY = (e.clientY / window.innerHeight - 0.5) * 20;
      const vis = document.querySelector('.vis-container');
      if (vis) {
        vis.style.transform = `translate(${heroMouseX * 0.5}px, ${heroMouseY * 0.5}px)`;
      }
    });

    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        heroMouseX = (touch.clientX / window.innerWidth - 0.5) * 20;
        heroMouseY = (touch.clientY / window.innerHeight - 0.5) * 20;
        const vis = document.querySelector('.vis-container');
        if (vis) {
          vis.style.transform = `translate(${heroMouseX * 0.5}px, ${heroMouseY * 0.5}px)`;
        }
      }
    }, { passive: true });
  }
})();

// ===== NAVBAR =====
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
  }, { passive: true });

  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.classList.toggle('mobile-menu-open', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
      document.body.classList.remove('mobile-menu-open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOpts = { rootMargin: '-40% 0px -50% 0px' };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));
})();

// ===== BACK TO TOP =====
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ===== SCROLL REVEAL =====
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-left], [data-reveal-right]');
  const staggerEls = document.querySelectorAll('[data-reveal-stagger]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  // Staggered
  const staggerGroups = new Map();
  staggerEls.forEach(el => {
    const parent = el.parentElement;
    if (!parent) return;
    if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
    staggerGroups.get(parent).push(el);
  });

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = staggerGroups.get(entry.target) || [];
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s`;
            child.classList.add('revealed');
          }, i * 80);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  staggerGroups.forEach((children, parent) => staggerObserver.observe(parent));
})();

// ===== ANIMATED COUNTERS =====
(function initCounters() {
  const statCards = document.querySelectorAll('.stat-card');

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target) {
    const counter = el.querySelector('.counter');
    if (!counter) return;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => observer.observe(card));
})();

// ===== PARALLAX SECTION =====
(function initParallax() {
  const parallaxBg = document.getElementById('parallaxBg');
  if (!parallaxBg) return;

  window.addEventListener('scroll', () => {
    const section = parallaxBg.closest('.parallax-section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const offset = (progress - 0.5) * 120;
    parallaxBg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
})();

// ===== TESTIMONIALS SLIDER =====
(function initTestimonialsSlider() {
  const slider = document.getElementById('testimonialsSlider');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  if (!slider) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoSlideTimer;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;

  // Determine cards visible
  function getVisible() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function maxIndex() { return Math.max(0, cards.length - getVisible()); }

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === current);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(slider).gap || 24);
    slider.style.transform = `translateX(-${current * cardWidth}px)`;

    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current);
    });
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Touch support
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
    isDragging = false;
  });

  // Auto-slide
  function startAuto() {
    autoSlideTimer = setInterval(() => {
      goTo(current >= maxIndex() ? 0 : current + 1);
    }, 5000);
  }
  function resetAuto() { clearInterval(autoSlideTimer); startAuto(); }

  // Init
  createDots();
  startAuto();
  window.addEventListener('resize', () => { createDots(); goTo(current); }, { passive: true });
})();

// ===== MAGNETIC BUTTONS =====
(function initMagneticButtons() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// ===== PROCESS TIMELINE PROGRESS =====
(function initTimelineProgress() {
  const progressEl = document.getElementById('timelineProgress');
  if (!progressEl) return;

  const processSection = document.querySelector('.process-section');
  if (!processSection) return;

  window.addEventListener('scroll', () => {
    const rect = processSection.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.top > viewH || rect.bottom < 0) return;

    const progress = Math.max(0, Math.min(1,
      (viewH - rect.top) / (rect.height + viewH)
    ));
    progressEl.style.height = (progress * 100) + '%';
  }, { passive: true });
})();

// ===== GSAP ANIMATIONS =====
function initAnimations() {
  // Register plugins if GSAP is loaded
  if (typeof gsap === 'undefined') {
    // Fallback: simply show hero elements without GSAP
    const heroEls = document.querySelectorAll('.hero-label, .hero-title, .hero-subtitle, .hero-desc, .hero-actions, .hero-trust, .hero-visual');
    heroEls.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 150);
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-label', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
    .to('.hero-title', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .to('.hero-desc', { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-trust', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-visual', { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.8');

  // Floating elements animation
  gsap.to('.float-card-1', { y: -12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.float-card-2', { y: -10, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });
  gsap.to('.float-card-3', { y: -14, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });

  // Stats section
  gsap.from('.stat-card', {
    scrollTrigger: { trigger: '.stats-section', start: 'top 85%' },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out',
    clearProps: 'all',
    onComplete: function() {
      this.targets().forEach(el => el.classList.add('animation-complete'));
    }
  });

  // About section
  gsap.from('.about-img-frame', {
    scrollTrigger: { trigger: '.about-section', start: 'top 80%' },
    x: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
  gsap.from('.about-content > *', {
    scrollTrigger: { trigger: '.about-section', start: 'top 75%' },
    x: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Services cards
  gsap.from('.service-card', {
    scrollTrigger: { trigger: '.services-section', start: 'top 75%' },
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power2.out',
    clearProps: 'all',
    onComplete: function() {
      this.targets().forEach(el => el.classList.add('animation-complete'));
    }
  });

  // Why cards
  gsap.from('.why-card', {
    scrollTrigger: { trigger: '.why-section', start: 'top 75%' },
    y: 60,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Parallax section text
  gsap.from('.parallax-content > *', {
    scrollTrigger: { trigger: '.parallax-section', start: 'top 70%' },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Process steps
  gsap.from('.process-step', {
    scrollTrigger: { trigger: '.process-timeline', start: 'top 75%' },
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power2.out'
  });

  // Testimonials
  gsap.from('.testimonial-card', {
    scrollTrigger: { trigger: '.testimonials-section', start: 'top 75%' },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
    clearProps: 'all',
    onComplete: function() {
      this.targets().forEach(el => el.classList.add('animation-complete'));
    }
  });

  // CTA section
  gsap.from('.cta-container > *', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 75%' },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Contact
  gsap.from('.contact-map-wrap', {
    scrollTrigger: { trigger: '.contact-section', start: 'top 75%' },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
  gsap.from('.contact-info-wrap', {
    scrollTrigger: { trigger: '.contact-section', start: 'top 75%' },
    x: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Section titles
  document.querySelectorAll('.section-title').forEach(title => {
    if (title.closest('.about-content')) return;
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 90%' },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Parallax background
  gsap.to('#parallaxBg', {
    scrollTrigger: {
      trigger: '.parallax-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: 120,
    ease: 'none'
  });

  // Section number reveal for why cards
  gsap.from('.why-number', {
    scrollTrigger: { trigger: '.why-grid', start: 'top 80%' },
    scale: 0.5,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  });

  // Footer
  gsap.from('.footer-brand, .footer-col', {
    scrollTrigger: { trigger: '.footer', start: 'top 90%' },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });
}

// ===== SMOOTH ANCHOR SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SERVICE CARD HOVER ENHANCEMENT =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// ===== LAZY IMAGE LOADING =====
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading — already handled via loading="lazy"
} else {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImgs.forEach(img => imgObserver.observe(img));
}

// ===== WHATSAPP FLOAT VISIBILITY =====
(function initWaFloat() {
  const waBtn = document.getElementById('whatsappFloat');
  if (!waBtn) return;
  window.addEventListener('scroll', () => {
    waBtn.style.opacity = window.scrollY > 200 ? '1' : '0.7';
  }, { passive: true });
})();

// ===== PILLAR CARD KEYBOARD =====
document.querySelectorAll('.pillar-card, .why-card, .service-card, .step-card').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// ===== PERFORMANCE: Reduce motion if requested =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition', '0.01ms');
  document.documentElement.style.setProperty('--transition-slow', '0.01ms');

  // Disable soundwave animation
  document.querySelectorAll('.soundwave span, .p-bar').forEach(el => {
    el.style.animation = 'none';
    el.style.height = '50%';
  });

  // Disable ring animations
  document.querySelectorAll('.ring, .vis-ring, .wa-pulse').forEach(el => {
    el.style.animation = 'none';
  });
}

// ===== CONSOLE EASTER EGG =====
console.log(
  '%c 🎧 Sravya Hearing Solutions \n%c Because Every Sound Matters \n\nwebsite by sravyahearing.com',
  'color: #0A3B85; font-size: 1.2rem; font-weight: 800;',
  'color: #F58220; font-size: 0.85rem;'
);
