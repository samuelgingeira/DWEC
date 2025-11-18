const DATA_PATH = './data/productos.json';

const form = document.getElementById('productoForm');
const nombreEl = document.getElementById('nombre');
const skuEl = document.getElementById('sku');
const precioEl = document.getElementById('precio');
const stockEl = document.getElementById('stock');
const categoriaEl = document.getElementById('categoria');
const guardarBtn = document.getElementById('guardarBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const mensajeEl = document.getElementById('mensaje');

const errors = {
  nombre: document.getElementById('error-nombre'),
  sku: document.getElementById('error-sku'),
  precio: document.getElementById('error-precio'),
  stock: document.getElementById('error-stock'),
  categoria: document.getElementById('error-categoria'),
};
const skuInfo = document.getElementById('sku-info');

let skuValido = false; 


function validarCampoNombre() {
  const v = nombreEl.value.trim();
  if (!v) { errors.nombre.textContent = 'El nombre es obligatorio.'; return false; }
  errors.nombre.textContent = ''; return true;
}
function validarCampoSKU_basic() {
  const v = skuEl.value.trim();
  if (!v) { errors.sku.textContent = 'El SKU es obligatorio.'; return false; }
  if (v.length < 5) { errors.sku.textContent = 'El SKU debe tener al menos 5 caracteres.'; return false; }
  errors.sku.textContent = ''; return true;
}
function validarCampoPrecio() {
  const v = parseFloat(precioEl.value);
  if (isNaN(v)) { errors.precio.textContent = 'El precio es obligatorio.'; return false; }
  if (v <= 0) { errors.precio.textContent = 'El precio debe ser mayor que 0.'; return false; }
  errors.precio.textContent = ''; return true;
}
function validarCampoStock() {
  const v = parseInt(stockEl.value, 10);
  if (isNaN(v)) { errors.stock.textContent = 'El stock es obligatorio.'; return false; }
  if (v < 0) { errors.stock.textContent = 'El stock no puede ser negativo.'; return false; }
  errors.stock.textContent = ''; return true;
}
function validarCampoCategoria() {
  const v = categoriaEl.value.trim();
  if (!v) { errors.categoria.textContent = 'La categoría es obligatoria.'; return false; }
  errors.categoria.textContent = ''; return true;
}

function validarFormularioBasico() {
  const ok = validarCampoNombre() && validarCampoSKU_basic() && validarCampoPrecio() && validarCampoStock() && validarCampoCategoria();
  guardarBtn.disabled = !(ok && skuValido);
  return ok;
}

[nombreEl, precioEl, stockEl, categoriaEl].forEach(el => {
  el.addEventListener('input', () => { validarFormularioBasico(); });
  el.addEventListener('blur', () => { validarFormularioBasico(); });
});

skuEl.addEventListener('input', () => {
  skuValido = false;
  skuInfo.textContent = '';
  validarFormularioBasico();
});

skuEl.addEventListener('blur', async () => {
  if (!validarCampoSKU_basic()) {
    skuValido = false; validarFormularioBasico(); return;
  }
  const sku = skuEl.value.trim();
  skuInfo.textContent = 'Validando SKU...';
  try {
    const existe = await validarSku(sku);
    if (existe) {
      errors.sku.textContent = 'El SKU ya existe.';
      skuValido = false;
      skuInfo.textContent = '';
    } else {
      errors.sku.textContent = '';
      skuValido = true;
      skuInfo.textContent = 'SKU disponible ✅';
    }
  } catch (err) {
    errors.sku.textContent = 'Error validando SKU.';
    skuValido = false;
    skuInfo.textContent = '';
  }
  validarFormularioBasico();
});

async function validarSku(sku) {
  const res = await fetch(DATA_PATH);
  if (!res.ok) throw new Error('No se pudieron cargar los productos');
  const productos = await res.json();
  return productos.some(p => (p.sku && String(p.sku).toLowerCase() === sku.toLowerCase()));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validarFormularioBasico()) {
    mostrarMensaje('Corrige los errores antes de guardar.', true);
    return;
  }
  const nombre = nombreEl.value.trim();
  mostrarMensaje(`Producto «${nombre}» guardado correctamente.`, false);
  form.reset();
  skuValido = false;
  skuInfo.textContent = '';
  guardarBtn.disabled = true;
});

limpiarBtn.addEventListener('click', () => {
  form.reset();
  Object.values(errors).forEach(el => el.textContent = '');
  skuInfo.textContent = '';
  skuValido = false;
  guardarBtn.disabled = true;
  mensajeEl.style.display = 'none';
});

function mostrarMensaje(text, esError=false) {
  mensajeEl.textContent = text;
  mensajeEl.className = 'mensaje' + (esError ? ' error' : ' success');
  mensajeEl.style.display = 'block';
  if (!esError) {
    setTimeout(() => { mensajeEl.style.display = 'none'; }, 4000);
  }
}
