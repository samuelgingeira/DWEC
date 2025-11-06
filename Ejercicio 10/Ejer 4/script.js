
document.addEventListener('DOMContentLoaded', () => {
  const btnEmpezar = document.getElementById('btn-empezar');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const textoFragmento = document.getElementById('texto-fragmento');
  const pistaFragmento = document.getElementById('pista-fragmento');
  const fragNombre = document.getElementById('frag-nombre');
  const mensajes = document.getElementById('mensajes');
  const alfabetoDiv = document.getElementById('alfabeto');
  const contadorSpan = document.getElementById('contador');

  let currentFragmentFile = null;     
  let currentSelector = null;         
  let letraClaveActual = null;        
  let letraSeleccionada = null;       
  let intentos = 0;

  function generarAlfabeto() {
    alfabetoDiv.innerHTML = '';
    for (let c = 65; c <= 90; c++) {
      const letra = String.fromCharCode(c);
      const div = document.createElement('div');
      div.className = 'letra';
      div.tabIndex = 0;
      div.textContent = letra;
      div.dataset.letra = letra;
      alfabetoDiv.appendChild(div);
    }
  }

  generarAlfabeto();

  function limpiarSeleccionLetra() {
    letraSeleccionada = null;
    document.querySelectorAll('.letra.selected').forEach(el => el.classList.remove('selected'));
  }

  function actualizarContador() {
    contadorSpan.textContent = intentos;
  }

  function mostrarMensaje(text, tipo = 'info', dur = 3000) {
    mensajes.innerHTML = `<div class="alert alert-${tipo}">${text}</div>`;
    if (dur) setTimeout(() => { mensajes.innerHTML = ''; }, dur);
  }

  function cargarFragmento(xmlFile) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', xmlFile, true);
      xhr.responseType = 'document';
      xhr.overrideMimeType('application/xml');

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
          reject({status: xhr.status, file: xmlFile});
        }
      };
      xhr.onerror = () => reject({status: xhr.status || 0, file: xmlFile});
      xhr.send();
    });
  }

  function procesarFragmento(xmlFile) {
    cargarFragmento(xmlFile)
      .then(xml => {
        const texto = xml.querySelector('texto')?.textContent ?? '';
        const pista = xml.querySelector('pista')?.textContent ?? '';
        const selector = xml.querySelector('selector_solucion')?.textContent ?? null;
        const siguiente = xml.querySelector('siguiente_fragmento')?.textContent ?? null;
        const letraClave = xml.querySelector('letra_clave')?.textContent ?? null;

        currentFragmentFile = xmlFile;
        currentSelector = selector;
        letraClaveActual = letraClave ? letraClave.toUpperCase() : null;

        textoFragmento.innerHTML = texto;
        pistaFragmento.textContent = pista;
        fragNombre.textContent = xmlFile;

        limpiarSeleccionLetra();

        if (!currentSelector) {
          mostrarMensaje('Fragmento inválido (no se encontró selector_solucion).', 'warning', 5000);
        }

        textoFragmento.dataset.siguiente = siguiente ?? 'null';

        console.log('Fragmento cargado', {xmlFile, selector: currentSelector, letraClaveActual, siguiente});
      })
      .catch(err => {
        if (err.status === 404) {
          mostrarMensaje(`Error 404: ${err.file} no encontrado.`, 'danger', 6000);
        } else {
          mostrarMensaje(`Error al cargar ${err.file} (status: ${err.status}).`, 'danger', 6000);
        }
      });
  }

  btnEmpezar.addEventListener('click', () => {
    intentos = 0;
    actualizarContador();
    procesarFragmento('fragmento1.xml');
    mostrarMensaje('Fragmento 1 cargado. Lee la pista y selecciona la letra correcta.', 'success', 2500);
  });

  btnReiniciar.addEventListener('click', () => {
    intentos = 0;
    actualizarContador();
    limpiarSeleccionLetra();
    textoFragmento.innerHTML = 'Pulsa <strong>Empezar</strong> para cargar el primer fragmento.';
    pistaFragmento.textContent = '';
    fragNombre.textContent = '—';
    currentFragmentFile = null;
    currentSelector = null;
    letraClaveActual = null;
    mostrarMensaje('Juego reiniciado.', 'info', 1500);
  });

  document.addEventListener('click', (ev) => {
    const target = ev.target;

    if (target.classList.contains('letra')) {
      document.querySelectorAll('.letra.selected').forEach(el => el.classList.remove('selected'));
      target.classList.add('selected');
      letraSeleccionada = target.dataset.letra;
      mostrarMensaje(`Letra seleccionada: ${letraSeleccionada}`, 'info', 1200);
      return;
    }

    if (target.matches('#btn-empezar, #btn-reiniciar, button')) {
      return;
    }

    if (!currentSelector) return;

    try {
      intentos += 1;
      actualizarContador();

      const esObjetivo = target.matches(currentSelector);

      if (letraClaveActual) {
        if (!letraSeleccionada) {
          falloVisual(target);
          mostrarMensaje(`Debes seleccionar la letra correcta (${letraClaveActual}) antes de clicar el objetivo.`, 'warning', 2500);
          return;
        }
        if (letraSeleccionada !== letraClaveActual) {
          falloVisual(target);
          mostrarMensaje(`Letra incorrecta (seleccionaste ${letraSeleccionada}). Intenta de nuevo.`, 'danger', 2500);
          return;
        }
        if (esObjetivo) {
          exitoAvanza(target);
        } else {
          falloVisual(target);
          mostrarMensaje('Elemento incorrecto. Sigue buscando.', 'danger', 2000);
        }
      } else {
        if (esObjetivo) {
          exitoAvanza(target);
        } else {
          falloVisual(target);
          mostrarMensaje('Elemento incorrecto. Sigue buscando.', 'danger', 2000);
        }
      }
    } catch (err) {
      console.error('Error durante la verificación:', err);
    }
  });

  function falloVisual(el) {
    el.classList.add('flash-fail');
    setTimeout(() => el.classList.remove('flash-fail'), 1600);
  }

  function exitoAvanza(el) {
    mostrarMensaje('¡Correcto! Cargando siguiente fragmento...', 'success', 2000);
    el.classList.add('border', 'border-success');
    setTimeout(() => el.classList.remove('border', 'border-success'), 1500);

    setTimeout(() => {
      const siguiente = textoFragmento.dataset.siguiente;
      if (!siguiente || siguiente === 'null') {
        mostrarMensaje('¡Has completado todos los fragmentos! Fin del juego.', 'success', 4000);
        currentSelector = null;
        letraClaveActual = null;
        limpiarSeleccionLetra();
        fragNombre.textContent = '—';
        textoFragmento.innerHTML = 'Has resuelto el manuscrito. ¡Enhorabuena!';
        pistaFragmento.textContent = '';
        return;
      }
      limpiarSeleccionLetra();
      procesarFragmento(siguiente);
    }, 800);
  }

  actualizarContador();
});
