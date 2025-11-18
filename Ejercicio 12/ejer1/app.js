const DATA_PATH = './data/productos.json';

let productos = []; 
let productosMostrados = []; 

const mensajeEl = document.getElementById('mensaje');
const productosContainer = document.getElementById('productosContainer');
const categoriaSelect = document.getElementById('categoriaSelect');
const sortAscBtn = document.getElementById('sortAsc');
const sortDescBtn = document.getElementById('sortDesc');

async function cargarProductos() {
  try {
    mensajeEl.textContent = 'Cargando...';
    const res = await fetch(DATA_PATH);
    if (!res.ok) throw new Error('Error cargando datos: ' + res.status);
    const data = await res.json();
    productos = data;
    productosMostrados = [...productos];
    poblarCategorias(productos);
    mostrarProductos(productosMostrados);
    mensajeEl.textContent = '';
  } catch (err) {
    mensajeEl.textContent = 'Error al cargar productos: ' + err.message;
  }
}

function mostrarProductos(lista) {
  productosContainer.innerHTML = '';
  if (!lista || lista.length === 0) {
    productosContainer.innerHTML = '<p>No hay productos para mostrar.</p>';
    return;
  }
  for (const p of lista) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>Precio: €${Number(p.precio).toFixed(2)}</p>
      <p>Stock: ${p.stock}</p>
      <p>Categoría: ${p.categoria}</p>
      ${p.descripcion ? `<p>${p.descripcion}</p>` : ''}
    `;
    productosContainer.appendChild(card);
  }
}

function poblarCategorias(lista) {
  const categorias = Array.from(new Set(lista.map(p => p.categoria))).sort();
  categoriaSelect.innerHTML = '<option value="__todas">Todas</option>' + categorias.map(c => `<option value="${c}">${c}</option>`).join('');
  categoriaSelect.addEventListener('change', onCategoriaChange);
}

function onCategoriaChange() {
  const sel = categoriaSelect.value;
  if (sel === '__todas') {
    productosMostrados = [...productos];
  } else {
    productosMostrados = productos.filter(p => p.categoria === sel);
  }
  mostrarProductos(productosMostrados);
}

function ordenarPorPrecio(asc = true) {
  productosMostrados.sort((a,b) => asc ? a.precio - b.precio : b.precio - a.precio);
  mostrarProductos(productosMostrados);
}

sortAscBtn.addEventListener('click', () => ordenarPorPrecio(true));
sortDescBtn.addEventListener('click', () => ordenarPorPrecio(false));

cargarProductos();
