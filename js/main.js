function showTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  document.getElementById('p-' + id).classList.add('on');
  btn.classList.add('on');
}
function toggleMenu() {
  document.getElementById('navMobile').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navMobile').classList.remove('open');
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade').forEach(el => observer.observe(el));

// Agregar botón "Ordenar" a cada card del menú
document.querySelectorAll('.mcard').forEach(card => {
  const price = card.querySelector('.mcard-price');
  const name = card.querySelector('.mcard-name');
  if (price && name) {
    const itemName = encodeURIComponent('Hola! Me gustaría ordenar: ' + name.textContent.trim());
    const wrap = document.createElement('div');
    wrap.className = 'mcard-order';
    wrap.innerHTML = price.outerHTML +
      '<a href="https://wa.me/584247827899?text=' + itemName + '" target="_blank" class="btn-order">' +
      'Ordenar <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>';
    price.parentNode.insertBefore(wrap, price);
    price.remove();
  }
});