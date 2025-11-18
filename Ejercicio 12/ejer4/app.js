const PATH_PEDIDOS = './data/pedidos.json';
const PATH_DETALLES = './data/detalles_pedido.json';
const PATH_PRODUCTOS = './data/productos.json';

const estadoEl = document.getElementById('estado');
const panelEl = document.getElementById('panel');

async function cargarPanel() {
  try {
    estadoEl.textContent = 'Cargando datos del panel...';
    const [resPedidos, resDetalles, resProductos] = await Promise.all([
      fetch(PATH_PEDIDOS),
      fetch(PATH_DETALLES),
      fetch(PATH_PRODUCTOS)
    ]);
    if (!resPedidos.ok || !resDetalles.ok || !resProductos.ok) {
      throw new Error('Error al cargar uno o más archivos.');
    }
    const [pedidos, detalles, productos] = await Promise.all([resPedidos.json(), resDetalles.json(), resProductos.json()]);
    const pedidosEnriquecidos = combinarDatos(pedidos, detalles, productos);
    mostrarPanel(pedidosEnriquecidos);
    estadoEl.textContent = '';
  } catch (err) {
    estadoEl.textContent = 'Error cargando datos: ' + err.message;
    panelEl.innerHTML = '';
  }
}

function combinarDatos(pedidos, detalles, productos) {
  const prodMap = productos.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
  return pedidos.map(pedido => {
    const dets = detalles.filter(d => d.pedidoId === pedido.id).map(d => {
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
    return Object.assign({}, pedido, { detalles: dets, totalPedido: Number(totalPedido.toFixed(2)) });
  });
}

function mostrarPanel(pedidosEnriquecidos) {
  panelEl.innerHTML = '';
  if (!pedidosEnriquecidos || pedidosEnriquecidos.length === 0) {
    panelEl.innerHTML = '<p>No hay pedidos para mostrar.</p>';
    return;
  }
  for (const ped of pedidosEnriquecidos) {
    const card = document.createElement('div');
    card.className = 'card';
    const fecha = ped.fecha || '—';
    const estado = ped.estado || '—';
    card.innerHTML = `
      <h3>Pedido ${ped.id} — ${fecha}</h3>
      <p>Estado: ${estado}</p>
      <p class="total">${ped.totalPedido.toFixed(2)} €</p>
      <div class="detalles">
        <strong>Detalle:</strong>
        ${renderDetalles(ped.detalles)}
      </div>
    `;
    panelEl.appendChild(card);
  }
}

function renderDetalles(detalles) {
  if (!detalles || detalles.length === 0) return '<p>No hay detalles.</p>';
  const items = detalles.map(d => `<li>${d.cantidad} x ${escapeHtml(d.nombreProducto)} - ${Number(d.precioUnitario).toFixed(2)} €</li>`).join('');
  return `<ul>${items}</ul>`;
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

cargarPanel();
