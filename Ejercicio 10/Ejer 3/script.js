
document.addEventListener('DOMContentLoaded', () => {
  const codigoInput = document.getElementById('codigo');
  const claveInput = document.getElementById('clave');
  const feedbackCodigo = document.getElementById('feedback-codigo');
  const feedbackClave = document.getElementById('feedback-clave');
  const btnAcceder = document.getElementById('btn-acceder');
  const btnReset = document.getElementById('btn-reset');
  const mensajesDiv = document.getElementById('mensajes');

  let agenteValido = null; 
  let claveValida = false;

  function cargarPersonalXML() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'personal.xml', true);
      xhr.responseType = 'document';
      xhr.overrideMimeType('application/xml');

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
          reject({status: xhr.status});
        }
      };
      xhr.onerror = () => reject({status: xhr.status || 0});
      xhr.send();
    });
  }

  function limpiarMensajes() {
    mensajesDiv.innerHTML = '';
  }

  function mostrarErrorGeneral(text) {
    mensajesDiv.innerHTML = `<div class="alert alert-danger">${text}</div>`;
  }

  codigoInput.addEventListener('blur', () => {
    const codigo = codigoInput.value.trim();
    agenteValido = null;
    claveValida = false;
    claveInput.value = '';
    claveInput.disabled = true;
    btnAcceder.disabled = true;
    feedbackClave.textContent = 'La clave se valida después de validar el código.';
    feedbackClave.className = 'form-text text-muted';

    limpiarMensajes();

    if (codigo === '') {
      feedbackCodigo.textContent = 'Código vacío. Introduce un código.';
      feedbackCodigo.className = 'form-text text-muted text-warning';
      return;
    }

    cargarPersonalXML()
      .then(xml => {
        const safeCodigo = codigo.replace(/"/g, '\\"'); // escape dobles
        const selector = `agente[codigo="${safeCodigo}"]`;
        const agenteEl = xml.querySelector(selector);

        if (agenteEl) {
          const nombre = agenteEl.querySelector('nombre')?.textContent ?? 'Sin nombre';
          const claveXml = agenteEl.querySelector('clave')?.textContent ?? '';

          agenteValido = {codigo, nombre, clave: claveXml};

          feedbackCodigo.textContent = `Bienvenido, ${nombre}`;
          feedbackCodigo.className = 'form-text text-success';
          claveInput.disabled = false;
          claveInput.placeholder = 'Introduce tu clave';
          claveInput.focus(); 
          agenteValido = null;
          feedbackCodigo.textContent = 'Código de agente no reconocido.';
          feedbackCodigo.className = 'form-text text-danger';
        }
      })
      .catch(err => {
        if (err.status === 404) {
          mostrarErrorGeneral('Error 404: personal.xml no encontrado.');
        } else {
          mostrarErrorGeneral(`Error al cargar personal.xml (status: ${err.status}).`);
        }
      });
  });

  claveInput.addEventListener('blur', () => {
    limpiarMensajes();
    feedbackClave.className = 'form-text text-muted';

    if (!agenteValido) {
      feedbackClave.textContent = 'Valida primero el código de agente.';
      feedbackClave.className = 'form-text text-warning';
      claveValida = false;
      btnAcceder.disabled = true;
      return;
    }

    const claveIntroducida = claveInput.value;

    if (claveIntroducida === '') {
      feedbackClave.textContent = 'Clave vacía. Introduce la clave.';
      feedbackClave.className = 'form-text text-muted text-warning';
      claveValida = false;
      btnAcceder.disabled = true;
      return;
    }

    if (claveIntroducida === agenteValido.clave) {
      feedbackClave.textContent = 'Clave correcta.';
      feedbackClave.className = 'form-text text-success';
      claveValida = true;
      btnAcceder.disabled = false;
    } else {
      feedbackClave.textContent = 'Clave incorrecta.';
      feedbackClave.className = 'form-text text-danger';
      claveValida = false;
      btnAcceder.disabled = true;
    }
  });

  codigoInput.addEventListener('input', () => {
    if (agenteValido && codigoInput.value.trim() !== agenteValido.codigo) {
      agenteValido = null;
      claveValida = false;
      claveInput.value = '';
      claveInput.disabled = true;
      btnAcceder.disabled = true;
      feedbackCodigo.textContent = 'Cambia detectado: vuelve a validar el código.';
      feedbackCodigo.className = 'form-text text-muted text-warning';
      feedbackClave.textContent = 'La clave se ha reiniciado.';
      feedbackClave.className = 'form-text text-muted';
    }
  });

  btnAcceder.addEventListener('click', () => {
    limpiarMensajes();
    if (agenteValido && claveValida) {
      mensajesDiv.innerHTML = `<div class="alert alert-success">Acceso concedido. Bienvenido, ${agenteValido.nombre}.</div>`;
    } else {
      mensajesDiv.innerHTML = `<div class="alert alert-danger">No autorizado. Verifica código y clave.</div>`;
    }
  });

  btnReset.addEventListener('click', () => {
    agenteValido = null;
    claveValida = false;
    codigoInput.value = '';
    claveInput.value = '';
    claveInput.disabled = true;
    btnAcceder.disabled = true;
    feedbackCodigo.textContent = 'Introduce el código y sal del campo para validar.';
    feedbackCodigo.className = 'form-text text-muted';
    feedbackClave.textContent = 'La clave se valida después de validar el código.';
    feedbackClave.className = 'form-text text-muted';
    limpiarMensajes();
  });

});
