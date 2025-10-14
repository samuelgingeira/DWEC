function filtrarPorPais(texto) {
  const ul = document.getElementById('ciudades');
  const items = ul.querySelectorAll('li');
  const t = texto.trim().toLowerCase();
  items.forEach(li => {
    const pais = (li.getAttribute('data-pais') || '').toLowerCase();
    if (pais.includes(t) && t !== '') {
      li.classList.remove('oculto');
    } else {
      li.classList.add('oculto');
    }
  });
}

document.getElementById('btn-filtro').addEventListener('click', () => {
  const texto = document.getElementById('filtro').value;
  filtrarPorPais(texto);
});
