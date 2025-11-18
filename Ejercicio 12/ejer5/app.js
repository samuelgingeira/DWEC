const PATH_USUARIOS = './data/usuarios.json';
const PATH_PRODUCTOS = './data/productos.json';
const PATH_PEDIDOS = './data/pedidos.json';
const PATH_DETALLES = './data/detalles_pedido.json';

let usuarios = [];
let productos = [];
let pedidos = [];
let detalles = [];

const estadoEl = document.getElementById('estado');
const usuarioSelect = document.getElementById('usuarioSelect');
const usuarioPanel = document.getElementById('usuarioPanel');
const resumenPanel = document.getElementById('resumenPanel');
const pedidosPanel = document.getElementById('pedidosPanel');

async function cargarDatosIniciales() {
  try {
    estadoEl.textContent = 'Cargando datos maestros...';
    const [rU, rP, rPed, rD] = await Promise.all([
      fetch(PATH_USUARIOS),
      fetch(PATH_PRODUCTOS),
      fetch(PATH_PEDIDOS),
      fetch(PATH_DETALLES)
    ]);
    if (!rU.ok || !rP.ok || !rPed.ok || !rD.ok) throw new Error('Error cargando archivos.');
    [usuarios, productos, pedidos, detalles] = await Promise.all([rU.json(), rP.json(), rPed.json(), rD.json()]);
    inicializarDashboard();
    estadoEl.textContent = '';
  } catch (err) {
    estadoEl.textContent = 'Error cargando datos: ' + err.message;
  }
}

function inicializarDashboard() {
  usuarioSelect.innerHTML = '<option value="">-- Selecciona --</option>' + usuarios.map(u => `<option value="${u.id}">${escapeHtml(u.nombre)}</option>`).join('');
  usuarioSelect.disabled = false;
  usuarioSelect.addEventListener('change', () => {
    const uid = usuarioSelect.value;
    if (!uid) {
      limpiarDashboard();
      return;
    }
    mostrarDashboardUsuario(uid);
  });
}

function limpiarDashboard() {
  usuarioPanel.innerHTML = '';
  resumenPanel.innerHTML = '';
  pedidosPanel.innerHTML = '<p class="empty">Selecciona un usuario para ver su actividad.</p>';
}

function mostrarDashboardUsuario(usuarioId) {
  const usuario = usuarios.find(u => u.id === usuarioId);
  if (!usuario) {
    usuarioPanel.innerHTML = '<p class="empty">Usuario no encontrado.</p>';
    resumenPanel.innerHTML = '';
    pedidosPanel.innerHTML = '';
    return;
  }
  renderizarInfoUsuario(usuario);
  const pedidosUsuario = pedidos.filter(p => p.usuarioId === usuarioId);
  if (!pedidosUsuario || pedidosUsuario.length === 0) {
    pedidosPanel.innerHTML = '<p class="empty">Este usuario no tiene pedidos.</p>';
    resumenPanel.innerHTML = renderResumen(0);
    return;
  }
  const prodMap = productos.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
  const pedidosEnriquecidos = pedidosUsuario.map(ped => {
    const dets = detalles.filter(d => d.pedidoId === ped.id).map(d => {
      const prod = prodMap[d.productoId] || {};
      return {
        id: d.id,
        productoId: d.productoId,
        nombreProducto: prod.nombre || 'Producto desconocido',
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      };
    });
    const totalPedido = dets.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);
    return Object.assign({}, ped, { detalles: dets, totalPedido: Number(totalPedido.toFixed(2)) });
  });
  pedidosPanel.innerHTML = '';
  pedidosEnriquecidos.forEach(ped => {
    pedidosPanel.appendChild(renderPedidoCard(ped));
  });
  const gastoTotal = pedidosEnriquecidos.reduce((s, p) => s + p.totalPedido, 0);
  resumenPanel.innerHTML = renderResumen(Number(gastoTotal.toFixed(2)));
}

function renderizarInfoUsuario(usuario) {
  usuarioPanel.innerHTML = `
    <h2>${escapeHtml(usuario.nombre)}</h2>
    <p><strong>Email:</strong> ${escapeHtml(usuario.email || '—')}</p>
    <p><strong>Fecha registro:</strong> ${escapeHtml(usuario.fechaRegistro || '—')}</p>
  `;
}

function renderPedidoCard(ped) {
  const div = document.createElement('div');
  div.className = 'pedido-card';
  const fecha = ped.fecha || '—';
  div.innerHTML = `
    <h4>Pedido ${escapeHtml(ped.id)} — ${escapeHtml(fecha)}</h4>
    <p>Estado: ${escapeHtml(ped.estado || '—')}</p>
    <div class="detalles"><strong>Productos:</strong> ${renderDetallesList(ped.detalles)}</div>
    <p class="total">Total: ${Number(ped.totalPedido).toFixed(2)} €</p>
  `;
  return div;
}

function renderDetallesList(detalles) {
  if (!detalles || detalles.length === 0) return '<p class="empty">No hay detalles.</p>';
  const items = detalles.map(d => `<li>${d.cantidad} x ${escapeHtml(d.nombreProducto)} - ${Number(d.precioUnitario).toFixed(2)} €</li>`).join('');
  return `<ul class="detalle-list">${items}</ul>`;
}

function renderResumen(gastoTotal) {
  return `<h3>Resumen</h3><p>Gasto total acumulado: <strong>${Number(gastoTotal).toFixed(2)} €</strong></p>`;
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

cargarDatosIniciales();
