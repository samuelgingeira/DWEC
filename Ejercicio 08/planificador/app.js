import { actividades } from './datos/actividades.js';

let itinerario = [];

document.addEventListener('DOMContentLoaded', () => {
  llenarFiltros();
  renderizarActividades();
  actualizarTotales();
  configurarFiltros();
  configurarFormularioReserva();
});

function llenarFiltros() {
  const selectDestino = document.getElementById('filtro-destino');
  const tiposUnicos = new Set();
  let maxPrecio = 0;

  actividades.forEach(a => {
    tiposUnicos.add(a.tipo);
    if(a.precio > maxPrecio) maxPrecio = a.precio;
  });

  const destinosUnicos = [...new Set(actividades.map(a => a.destino))];
  destinosUnicos.forEach(d => {
    const option = document.createElement('option');
    option.value = d;
    option.textContent = d;
    selectDestino.appendChild(option);
  });

  const contenedorTipo = document.getElementById('filtro-tipo');
  tiposUnicos.forEach(tipo => {
    const div = document.createElement('div');
    div.classList.add('form-check');
    div.innerHTML = `<input class="form-check-input" type="checkbox" value="${tipo}" id="tipo-${tipo}">
                     <label class="form-check-label" for="tipo-${tipo}">${tipo}</label>`;
    contenedorTipo.appendChild(div);
  });

  const inputPrecio = document.getElementById('filtro-precio');
  inputPrecio.max = maxPrecio;
  inputPrecio.value = maxPrecio;
  document.getElementById('precio-valor').textContent = maxPrecio;
}

function configurarFiltros() {
  const filtros = document.getElementById('form-filtros');
  filtros.addEventListener('input', renderizarActividades);

  const inputPrecio = document.getElementById('filtro-precio');
  inputPrecio.addEventListener('input', () => {
    document.getElementById('precio-valor').textContent = inputPrecio.value;
  });
}

function renderizarActividades() {
  const contenedor = document.getElementById('actividades-container');
  contenedor.innerHTML = '';

  const destino = document.getElementById('filtro-destino').value;
  const tiposChecked = Array.from(document.querySelectorAll('#filtro-tipo input:checked')).map(c => c.value);
  const precioMax = parseFloat(document.getElementById('filtro-precio').value);

  const filtradas = actividades.filter(a => {
    return (!destino || a.destino === destino)
           && (tiposChecked.length === 0 || tiposChecked.includes(a.tipo))
           && a.precio <= precioMax;
  });

  filtradas.forEach(a => {
    const card = document.createElement('div');
    card.className = "card col-md-6 col-lg-12";
    card.innerHTML = `
      <img src="${a.imagen}" class="card-img-top" alt="${a.nombre}">
      <div class="card-body">
        <h6 class="card-title">${a.nombre}</h6>
        <p class="card-text">Destino: ${a.destino}</p>
        <p class="card-text">Tipo: ${a.tipo}</p>
        <p class="card-text">Precio: ${a.precio} €</p>
        <button class="btn btn-sm btn-success">Añadir al Itinerario</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => agregarAlItinerario(a.id));
    contenedor.appendChild(card);
  });
}

function agregarAlItinerario(id) {
  const actividad = actividades.find(a => a.id === id);
  if (!itinerario.some(a => a.id === id)) {
    itinerario.push(actividad);
    actualizarItinerario();
  }
}

function quitarDelItinerario(id) {
  itinerario = itinerario.filter(a => a.id !== id);
  actualizarItinerario();
}

function actualizarItinerario() {
  const lista = document.getElementById('itinerario-list');
  lista.innerHTML = '';

  itinerario.forEach(a => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${a.nombre} - ${a.precio} €
      <button class="btn btn-sm btn-danger">Quitar</button>
    `;
    li.querySelector('button').addEventListener('click', () => quitarDelItinerario(a.id));
    lista.appendChild(li);
  });

  actualizarTotales();
}

function actualizarTotales() {
  const totalPrecio = itinerario.reduce((sum, a) => sum + a.precio, 0);
  const totalHoras = itinerario.reduce((sum, a) => sum + a.duracionHoras, 0);

  document.getElementById('total-precio').textContent = totalPrecio;
  document.getElementById('total-horas').textContent = totalHoras;
  document.getElementById('total-actividades').textContent = itinerario.length;

  const seguroContainer = document.getElementById('seguro-container');
  const seguroCheckbox = document.getElementById('seguro');
  if(totalPrecio > 1000) {
    seguroContainer.style.display = 'block';
    seguroCheckbox.required = true;
  } else {
    seguroContainer.style.display = 'none';
    seguroCheckbox.required = false;
    seguroCheckbox.checked = false;
  }
}

function configurarFormularioReserva() {
  const form = document.getElementById('form-reserva');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const errores = [];

    if(itinerario.length === 0) errores.push("El itinerario no puede estar vacío.");

    const fechaInput = document.getElementById('fecha');
    const hoy = new Date();
    const fechaSeleccionada = new Date(fechaInput.value);
    if(fechaInput.value === "" || fechaSeleccionada < hoy.setHours(0,0,0,0)) {
      errores.push("La fecha de inicio no puede ser pasada.");
    }

    const seguroCheckbox = document.getElementById('seguro');
    const totalPrecio = itinerario.reduce((sum, a) => sum + a.precio, 0);
    if(totalPrecio > 1000 && !seguroCheckbox.checked) {
      errores.push("Debe marcar el seguro de viaje ya que el coste total supera los 1000€.");
    }

    const codigo = document.getElementById('codigo').value.trim();
    if(codigo && !/^[A-Z]{4}\d{2}$/.test(codigo)) {
      errores.push("El código de descuento debe tener 4 letras mayúsculas seguidas de 2 números (ej: ABCD25).");
    }

    const erroresDiv = document.getElementById('errores');
    erroresDiv.innerHTML = errores.join('<br>');

    if(errores.length === 0) {
      alert("Reserva confirmada!");
      form.reset();
      itinerario = [];
      actualizarItinerario();
    }
  });
}
