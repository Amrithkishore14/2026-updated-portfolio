document.addEventListener('DOMContentLoaded', () => {
  smoothScrollLinks();
  collapseNavOnLinkClick();
  initWordRotate();
});

function smoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function collapseNavOnLinkClick() {
  const navEl = document.getElementById('mainNav');
  if (!navEl || !window.bootstrap?.Collapse) return;
  const navLinks = navEl.querySelectorAll('a.nav-link');
  const navCollapse = bootstrap.Collapse.getOrCreateInstance(navEl, { toggle: false });
  navLinks.forEach((link) => {
    link.addEventListener('click', () => navCollapse.hide());
  });
}

function initWordRotate() {
  const rotators = document.querySelectorAll('.word-rotate');
  rotators.forEach((el) => {
    const words = (el.dataset.words || '').split(',').map((w) => w.trim()).filter(Boolean);
    if (!words.length) return;
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
    }, 1600);
  });
}
