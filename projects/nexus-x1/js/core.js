/* ================================================================
   NEXUS X1 — CORE JS
   Navigation · Cursor · Transitions · Utilities
   ================================================================ */

'use strict';

/* ── UTILITIES ────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const map = (v, a, b, c, d) => ((v - a) / (b - a)) * (d - c) + c;
const isMobile = () => window.innerWidth <= 768;
const isTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch { return false; }
}

/* ── SCROLL PROGRESS ──────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
}

/* ── NAVIGATION ───────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  /* Scroll effect */
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active link */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .nav-overlay-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (
      (href === '/' && (path === '/' || path === '/index.html')) ||
      (href !== '/' && href.length > 1 && path.startsWith(href))
    ) a.classList.add('active');
  });

  /* Mobile full-screen menu */
  const menuBtn = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.nav-overlay');
  if (!menuBtn || !overlay) return;

  let menuOpen = false;
  const links = overlay.querySelectorAll('a');

  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuBtn.classList.toggle('open', menuOpen);
    overlay.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    if (menuOpen) {
      links.forEach((link, i) => {
        link.style.clipPath = 'inset(0 100% 0 0)';
        link.style.transition = 'none';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            link.style.transition = `clip-path 0.55s ${0.05 + i * 0.055}s cubic-bezier(0.16,1,0.3,1)`;
            link.style.clipPath = 'inset(0 0% 0 0)';
          });
        });
      });
    } else {
      links.forEach(link => {
        link.style.clipPath = '';
        link.style.transition = '';
      });
    }
  });

  /* Close on nav link click */
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuOpen = false;
      menuBtn.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── CUSTOM CURSOR ────────────────────────────────── */
function initCursor() {
  if (isTouch()) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    if (label) {
      label.style.left = mx + 'px';
      label.style.top = my + 'px';
    }
  });

  document.addEventListener('mouseleave', () => dot.style.opacity = '0');
  document.addEventListener('mouseenter', () => dot.style.opacity = '1');

  const animate = () => {
    rx = lerp(rx, mx, 0.1);
    ry = lerp(ry, my, 0.1);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    rafId = requestAnimationFrame(animate);
  };
  animate();

  /* State helpers */
  const setState = (type, text = '') => {
    document.body.className = document.body.className.replace(/cursor-\w+/g, '').trim();
    if (type) document.body.classList.add('cursor-' + type);
    if (label) {
      label.textContent = text;
      label.classList.toggle('show', !!text);
    }
  };
  const clearState = () => setState('');

  /* Apply states to elements */
  document.querySelectorAll('a, button, .btn, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => setState('btn'));
    el.addEventListener('mouseleave', clearState);
  });
  document.querySelectorAll('[data-cursor="drag"]').forEach(el => {
    el.addEventListener('mouseenter', () => setState('drag', 'DRAG'));
    el.addEventListener('mouseleave', clearState);
  });
  document.querySelectorAll('[data-cursor="view"]').forEach(el => {
    el.addEventListener('mouseenter', () => setState('view', 'VIEW'));
    el.addEventListener('mouseleave', clearState);
  });
  document.querySelectorAll('[data-cursor="inspect"]').forEach(el => {
    el.addEventListener('mouseenter', () => setState('inspect', 'INSPECT'));
    el.addEventListener('mouseleave', clearState);
  });
}

/* ── PAGE TRANSITIONS ─────────────────────────────── */
function initTransitions() {
  const veil = document.getElementById('page-veil');
  if (!veil) return;

  /* Reveal on load */
  const reveal = () => {
    veil.classList.remove('covering');
    veil.classList.add('revealing');
    setTimeout(() => veil.classList.remove('revealing'), 700);
  };

  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal);

  /* Cover on leave */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (a.target === '_blank') return;
    e.preventDefault();
    veil.classList.remove('revealing');
    veil.classList.add('covering');
    setTimeout(() => { window.location.href = href; }, 500);
  });
}

/* ── REVEAL ON SCROLL ─────────────────────────────── */
function initReveal() {
  if (reducedMotion()) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── COUNTER ANIMATION ────────────────────────────── */
function animCounter(el, target, duration = 1800, suffix = '') {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const pct = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (pct < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count || 0);
        const suffix = el.dataset.suffix || '';
        animCounter(el, target, 1800, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ── PARALLAX ─────────────────────────────────────── */
function initParallax() {
  if (reducedMotion() || isMobile()) return;
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  window.addEventListener('scroll', () => {
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax || 0.3);
      const rect = el.getBoundingClientRect();
      const off = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${off}px)`;
    });
  }, { passive: true });
}

/* ── TELEMETRY SIMULATION ─────────────────────────── */
function startTelemetry(container) {
  if (!container) return;
  const fields = container.querySelectorAll('[data-tele]');
  const ranges = {
    speed:   { min: 220, max: 310, unit: '' },
    gforce:  { min: 1.2, max: 2.1, unit: '', dec: 1 },
    battery: { min: 68, max: 89, unit: '' },
    motor:   { min: 720, max: 880, unit: '' },
    rpm:     { min: 8200, max: 9800, unit: '' },
    temp:    { min: 42, max: 68, unit: '' },
  };
  let targets = {};
  fields.forEach(f => {
    const key = f.dataset.tele;
    if (ranges[key]) targets[key] = ranges[key].min;
  });
  let current = { ...targets };

  setInterval(() => {
    fields.forEach(f => {
      const key = f.dataset.tele;
      const r = ranges[key];
      if (!r) return;
      targets[key] = r.min + Math.random() * (r.max - r.min);
    });
  }, 800);

  const tick = () => {
    fields.forEach(f => {
      const key = f.dataset.tele;
      const r = ranges[key];
      if (!r) return;
      current[key] = lerp(current[key], targets[key], 0.08);
      const val = r.dec ? current[key].toFixed(r.dec) : Math.round(current[key]);
      f.textContent = val + r.unit;
    });
    requestAnimationFrame(tick);
  };
  tick();
}

/* ── INIT ALL ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNav();
  initCursor();
  initTransitions();
  initReveal();
  initCounters();
  initParallax();
});

window.NexusCore = { lerp, clamp, map, isMobile, isTouch, reducedMotion, hasWebGL, animCounter, startTelemetry };
