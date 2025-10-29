const contenedor = document.getElementById("contenedorProductos");
const inputBusqueda = document.getElementById("inputBusqueda");
const selectCategoria = document.getElementById("selectCategoria");
const inputPrecio = document.getElementById("inputPrecio");
const precioValor = document.getElementById("precioValor");
const radiosOrden = document.getElementsByName("orden");

function cargarCategorias() {
  const categorias = ["Todas", ...new Set(productos.map(p => p.categoria))];
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    selectCategoria.appendChild(option);
  });
}

function mostrarProductos(lista) {
  contenedor.innerHTML = "";
  if (lista.length === 0) {
    contenedor.innerHTML = `<p class='text-center fw-bold'>No se encontraron productos</p>`;
    return;
  }
  lista.forEach(prod => {
    contenedor.innerHTML += `
      <div class="col-md-3">
        <div class="card h-100 shadow-sm">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">$${prod.precio}</p>
            <span class="badge bg-primary">${prod.categoria}</span>
          </div>
        </div>
      </div>`;
  });
}

function filtrarYOrdenar() {
  let resultado = [...productos];
  const texto = inputBusqueda.value.toLowerCase().trim();
  if (texto !== "") resultado = resultado.filter(p => p.nombre.toLowerCase().includes(texto));
  const categoria = selectCategoria.value;
  if (categoria !== "Todas") resultado = resultado.filter(p => p.categoria === categoria);
  const precioMax = parseInt(inputPrecio.value);
  resultado = resultado.filter(p => p.precio <= precioMax);
  const ordenSeleccionado = [...radiosOrden].find(r => r.checked)?.value;
  if (ordenSeleccionado) {
    if (ordenSeleccionado === "precio-asc") resultado.sort((a, b) => a.precio - b.precio);
    if (ordenSeleccionado === "precio-desc") resultado.sort((a, b) => b.precio - a.precio);
    if (ordenSeleccionado === "nombre") resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  mostrarProductos(resultado);
}

inputBusqueda.addEventListener("input", filtrarYOrdenar);
selectCategoria.addEventListener("change", filtrarYOrdenar);
inputPrecio.addEventListener("input", () => {
  precioValor.textContent = inputPrecio.value;
  filtrarYOrdenar();
});
radiosOrden.forEach(radio => radio.addEventListener("change", filtrarYOrdenar));

cargarCategorias();
mostrarProductos(productos);