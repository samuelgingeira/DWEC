function ocultarTodasLasRespuestas() {
  const respuestas = document.querySelectorAll('#faq p');
  respuestas.forEach(p => p.classList.add('oculto'));
}

function revelarRespuesta(h2element) {
  ocultarTodasLasRespuestas();
  const p = h2element.nextElementSibling;
  if (p && p.tagName.toLowerCase() === 'p') {
    p.classList.remove('oculto');
  }
}
