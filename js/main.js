/* ══════════════════════════════════════════
   MAIN.JS
   Fase 7: microinteracciones — stagger,
   scroll reveal, reduced-motion safe
══════════════════════════════════════════ */

/* ── TABS ── */
function showTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  document.getElementById('p-' + id).classList.add('on');
  btn.classList.add('on');
}

/* ── TABS — enlace desde data-tab (reemplaza onclick inline) ── */
function initTabs() {
  document.querySelectorAll('.tab[data-tab]').forEach(btn => {
    btn.addEventListener('click', function () {
      showTab(this.dataset.tab, this);
    });
  });
}

/* ── NAV MÓVIL ── */
function toggleMenu() {
  document.getElementById('navMobile').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navMobile').classList.remove('open');
}

/* ── RESPETAR prefers-reduced-motion ── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── SCROLL REVEAL — fade básico ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target); // dispara una sola vez
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade, .fade-left, .fade-right').forEach(el => {
  if (reducedMotion) {
    el.classList.add('in'); // mostrar todo de inmediato
  } else {
    observer.observe(el);
  }
});

/* ── MENÚ — renderizar cards y activar tabs ── */
// initMenu() y initTabs() vienen de menu-data.js + mcard.js
// Se llaman aquí para que el stagger se registre DESPUÉS de que
// las cards existan en el DOM.
if (typeof renderDestacados === 'function') renderDestacados();
if (typeof initMenu === 'function') initMenu();
if (typeof initTabs === 'function') initTabs();

/* ── STAGGER — cards menú ── */
// Se registra después de initMenu() para que los .mcard ya existan en el DOM
(function() {
  if (reducedMotion) return;

  const gridObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cards = entry.target.querySelectorAll('.mcard, .dest-card');
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px)';
        card.style.transition = `opacity 0.5s ease ${i * 70}ms, transform 0.5s ease ${i * 70}ms`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      });
      gridObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.mgrid, .dest-scroll').forEach(el => {
    gridObserver.observe(el);
  });
})();

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
/* ── MENÚ — tabs sticky ── */
(function() {
  var sentinel   = document.querySelector('.tabs-sentinel');
  var stickyWrap = document.querySelector('.tabs-sticky-wrap');
  var tabsWrap   = stickyWrap ? stickyWrap.querySelector('.tabs-wrap') : null;

  if (!sentinel || !stickyWrap) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      stickyWrap.classList.toggle('is-stuck', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  observer.observe(sentinel);

  if (tabsWrap) {
    var _originalShowTab = window.showTab;
    window.showTab = function(id, btn) {
      _originalShowTab(id, btn);
      var scrollTo = btn.offsetLeft - (tabsWrap.offsetWidth / 2) + (btn.offsetWidth / 2);
      tabsWrap.scrollTo({ left: scrollTo, behavior: 'smooth' });
    };

    tabsWrap.addEventListener('scroll', function() {
      var atEnd = tabsWrap.scrollLeft + tabsWrap.offsetWidth >= tabsWrap.scrollWidth - 4;
      stickyWrap.classList.toggle('scrolled-end', atEnd);
    });
  }
})();