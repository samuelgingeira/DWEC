
document.addEventListener('DOMContentLoaded', () => {
  const selectBase = document.getElementById('select-base');
  const selectMezcla = document.getElementById('select-mezcla');
  const btnSintetizar = document.getElementById('btn-sintetizar');
  const btnLimpiar = document.getElementById('btn-limpiar');
  const resTitulo = document.getElementById('res-titulo');
  const resResultado = document.getElementById('res-resultado');
  const resDescripcion = document.getElementById('res-descripcion');
  const mensajes = document.getElementById('mensajes');
  const historialUl = document.getElementById('historial');

  let xmlDoc = null;                
  let recetas = [];                  
  let historial = [];                

  function cargarRecetas() {
    return fetch('recetas.xml')
      .then(resp => {
        if (!resp.ok) throw {status: resp.status};
        return resp.text();
      })
      .then(txt => {
        const parser = new DOMParser();
        xmlDoc = parser.parseFromString(txt, 'application/xml');
        const err = xmlDoc.querySelector('parsererror');
        if (err) throw {status: 0, msg: 'XML inválido'};
        recetas = Array.from(xmlDoc.querySelectorAll('aleacion')).map(node => {
          return {
            base: node.querySelector('base')?.textContent.trim() ?? '',
            mezcla: node.querySelector('mezcla')?.textContent.trim() ?? '',
            resultado: node.querySelector('resultado')?.textContent.trim() ?? '',
            descripcion: node.querySelector('descripcion')?.textContent.trim() ?? ''
          };
        });
        return recetas;
      });
  }

  function poblarSelects(recetas) {
    const bases = new Set();
    const mezclas = new Set();
    recetas.forEach(r => {
      if (r.base) bases.add(r.base);
      if (r.mezcla) mezclas.add(r.mezcla);
    });

    function fill(selectEl, items) {
      selectEl.innerHTML = '';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = '-- Selecciona --';
      selectEl.appendChild(placeholder);
      Array.from(items).sort().forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        selectEl.appendChild(opt);
      });
    }

    fill(selectBase, bases);
    fill(selectMezcla, mezclas);
  }

  function mostrarMensaje(text, tipo = 'info', timeout = 3000) {
    mensajes.innerHTML = `<div class="alert alert-${tipo}">${text}</div>`;
    if (timeout) setTimeout(() => mensajes.innerHTML = '', timeout);
  }

  function buscarReceta(base, mezcla) {
    return recetas.find(r => r.base === base && r.mezcla === mezcla) || null;
  }

  function mostrarResultado(receta) {
    if (receta) {
      resTitulo.textContent = 'Resultado';
      resResultado.textContent = receta.resultado;
      resDescripcion.textContent = receta.descripcion;
    } else {
      resTitulo.textContent = 'Resultado';
      resResultado.textContent = 'Combinación no válida. No se ha producido ninguna aleación.';
      resDescripcion.textContent = '';
    }
  }

  function agregarHistorialEntrada(base, mezcla, resultado) {
    const existe = historial.some(h => h.base === base && h.mezcla === mezcla);
    if (existe) return;

    historial.push({base, mezcla, resultado});
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action';
    li.textContent = `${base} + ${mezcla} = ${resultado}`;
    li.dataset.base = base;
    li.dataset.mezcla = mezcla;

    li.addEventListener('click', () => {
      selectBase.value = li.dataset.base;
      selectMezcla.value = li.dataset.mezcla;
      const receta = buscarReceta(li.dataset.base, li.dataset.mezcla);
      mostrarResultado(receta);
      mostrarMensaje('Recuperado del historial (sin nueva petición).', 'info', 2000);
    });

    historialUl.prepend(li); 
  }

  btnSintetizar.addEventListener('click', () => {
    const base = selectBase.value;
    const mezcla = selectMezcla.value;

    if (!base || !mezcla) {
      mostrarMensaje('Selecciona ambos materiales.', 'warning', 2500);
      return;
    }

    const receta = buscarReceta(base, mezcla);

    if (receta) {
      mostrarResultado(receta);
      agregarHistorialEntrada(base, mezcla, receta.resultado);
      mostrarMensaje(`Aleación creada: ${receta.resultado}`, 'success', 2500);
    } else {
      mostrarResultado(null);
      mostrarMensaje('No existe receta para esa combinación.', 'danger', 3000);
    }
  });

  btnLimpiar.addEventListener('click', () => {
    selectBase.value = '';
    selectMezcla.value = '';
    resResultado.textContent = '—';
    resDescripcion.textContent = '';
  });

  cargarRecetas()
    .then(recetas => {
      if (!recetas || recetas.length === 0) {
        mostrarMensaje('No se encontraron recetas en recetas.xml', 'warning', 4000);
      } else {
        poblarSelects(recetas);
        mostrarMensaje('Recetas cargadas correctamente.', 'success', 1500);
      }
    })
    .catch(err => {
      if (err.status === 404) {
        mostrarMensaje('Error 404: recetas.xml no encontrado.', 'danger', 5000);
      } else {
        mostrarMensaje('Error al cargar recetas.xml.', 'danger', 5000);
        console.error(err);
      }
    });

});
