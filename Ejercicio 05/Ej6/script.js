const contTabs = document.getElementById('tabs');
const contContenido = document.getElementById('contenido');

contTabs.addEventListener('click', (e) => {
  if (e.target && e.target.dataset && e.target.dataset.id) {
    const id = e.target.dataset.id;
    const panels = contContenido.querySelectorAll('div');
    panels.forEach(p => p.classList.add('oculto'));
    const seleccionado = document.getElementById(id);
    if (seleccionado) seleccionado.classList.remove('oculto');
  }
});
