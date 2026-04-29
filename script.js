document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  smoothScrollLinks();
  collapseNavOnLinkClick();
  initWordRotate();
  initScrollReveal();
  initCounters();
  initNavHighlight();
});

/* ─── Scroll progress bar ─── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
}

/* ─── Smooth scroll ─── */
function smoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─── Collapse nav on mobile link click ─── */
function collapseNavOnLinkClick() {
  const navEl = document.getElementById('mainNav');
  if (!navEl || !window.bootstrap?.Collapse) return;
  const bsc = bootstrap.Collapse.getOrCreateInstance(navEl, { toggle: false });
  navEl.querySelectorAll('a.nav-link').forEach(l => l.addEventListener('click', () => bsc.hide()));
}

/* ─── Word rotate with fade ─── */
function initWordRotate() {
  document.querySelectorAll('.word-rotate').forEach(el => {
    const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
    if (!words.length) return;
    let idx = 0;
    setInterval(() => {
      el.classList.add('fading');
      setTimeout(() => {
        idx = (idx + 1) % words.length;
        el.textContent = words[idx];
        el.classList.remove('fading');
      }, 260);
    }, 2400);
  });
}

/* ─── Scroll reveal ─── */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-animate]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el, i) => {
    el.dataset.delay = String((i % 5) * 90);
    obs.observe(el);
  });
}

/* ─── Animated number counters ─── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1400;
      const start = performance.now();
      const isFloat = String(target).includes('.');
      const step = now => {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
        el.textContent = prefix + val + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

/* ─── Active nav link highlight ─── */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id], main[id]');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => obs.observe(s));
}
