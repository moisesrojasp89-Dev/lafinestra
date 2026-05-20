/* ══════════════════════════════════════════
   MAIN.JS — Punto de entrada principal
   ES Module: importa Cart, initMenu,
   renderDestacados desde sus módulos.
══════════════════════════════════════════ */

import { Cart }                        from './cart.js';
import { initMenu, renderDestacados }  from './mcard.js';

/* ── INICIALIZAR CARRITO ── */
Cart.init();

/* ── RENDERIZAR MENÚ Y DESTACADOS ── */
renderDestacados();
initMenu();

/* ── TABS ── */
function showTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  document.getElementById('p-' + id).classList.add('on');
  btn.classList.add('on');
}

function initTabs() {
  document.querySelectorAll('.tab[data-tab]').forEach(btn => {
    btn.addEventListener('click', function () {
      showTab(this.dataset.tab, this);
    });
  });
}

initTabs();

/* ── NAV MÓVIL ── */
// Expuestas en window porque los HTML usan onclick inline
window.toggleMenu = () => document.getElementById('navMobile').classList.toggle('open');
window.closeMenu  = () => document.getElementById('navMobile').classList.remove('open');

/* ── RESPETAR prefers-reduced-motion ── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade, .fade-left, .fade-right').forEach(el => {
  if (reducedMotion) el.classList.add('in');
  else observer.observe(el);
});

/* ── STAGGER — cards menú ── */
if (!reducedMotion) {
  const gridObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.mcard, .dest-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px)';
        card.style.transition = `opacity 0.5s ease ${i * 70}ms, transform 0.5s ease ${i * 70}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }));
      });
      gridObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.mgrid, .dest-scroll').forEach(el => gridObserver.observe(el));
}

/* ── NAV — highlight activo según scroll ── */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const secObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => secObserver.observe(s));
})();

/* ── DESTACADOS — dots de scroll ── */
(function() {
  const scroll = document.querySelector('.dest-scroll');
  const dots   = document.querySelectorAll('.dest-dot');
  if (!scroll || !dots.length) return;

  scroll.addEventListener('scroll', () => {
    const index = Math.round(scroll.scrollLeft / 226);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }, { passive: true });
})();

/* ── TABS STICKY ── */
(function() {
  const sentinel   = document.querySelector('.tabs-sentinel');
  const stickyWrap = document.querySelector('.tabs-sticky-wrap');
  const tabsWrap   = stickyWrap ? stickyWrap.querySelector('.tabs-wrap') : null;
  if (!sentinel || !stickyWrap) return;

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      stickyWrap.classList.toggle('is-stuck', !entry.isIntersecting);
    });
  }, { threshold: 0 }).observe(sentinel);

  if (tabsWrap) {
    const _orig = showTab;
    window.showTab = function(id, btn) {
      _orig(id, btn);
      tabsWrap.scrollTo({
        left: btn.offsetLeft - (tabsWrap.offsetWidth / 2) + (btn.offsetWidth / 2),
        behavior: 'smooth'
      });
    };

    tabsWrap.addEventListener('scroll', () => {
      const atEnd = tabsWrap.scrollLeft + tabsWrap.offsetWidth >= tabsWrap.scrollWidth - 4;
      stickyWrap.classList.toggle('scrolled-end', atEnd);
    });
  }
})();