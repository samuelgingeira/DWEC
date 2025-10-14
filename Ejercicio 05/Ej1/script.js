function cambiarImagenPrincipal(indice) {
  const miniaturas = document.querySelectorAll('.miniatura');
  if (indice < 0 || indice >= miniaturas.length) return;
  const srcMini = miniaturas[indice].getAttribute('src');
  const principal = document.getElementById('imagen-principal');
  const srcPrincipal = srcMini.replace('/400/225','/800/450');
  principal.src = srcPrincipal;
}

function resaltarMiniatura(indice) {
  const miniaturas = document.querySelectorAll('.miniatura');
  miniaturas.forEach((m, i) => {
    if (i === indice) m.classList.add('activa');
    else m.classList.remove('activa');
  });
}

resaltarMiniatura(0);
