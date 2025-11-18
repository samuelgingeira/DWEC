const PATH_USUARIOS = './data/usuarios.json';
const PATH_PEDIDOS = './data/pedidos.json';

const form = document.getElementById('buscarForm');
const emailInput = document.getElementById('emailInput');
const estadoEl = document.getElementById('estado');
const resultadosEl = document.getElementById('resultados');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!email) {
    mostrarEstado('El email no puede estar vacío.', true);
    return;
  }
  if (!email.includes('@')) {
    mostrarEstado('Formato de email inválido.', true);
    return;
  }
  mostrarEstado('Buscando usuario...');
  resultadosEl.innerHTML = '';
  try {
    const datos = await buscarUsuarioYPedidos(email);
    mostrarResultados(datos);
    mostrarEstado('');
  } catch (err) {
    mostrarEstado(err.message, true);
  }
});

function mostrarEstado(msg, esError=false) {
  estadoEl.textContent = msg;
  estadoEl.className = esError ? 'estado error' : 'estado';
}

async function buscarUsuarioYPedidos(email) {
  const resU = await fetch(PATH_USUARIOS);
  if (!resU.ok) throw new Error('Error cargando usuarios: ' + resU.status);
  const usuarios = await resU.json();
  const usuario = usuarios.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  if (!usuario) throw new Error('Usuario no encontrado');
  const resP = await fetch(PATH_PEDIDOS);
  if (!resP.ok) throw new Error('Error cargando pedidos: ' + resP.status);
  const pedidos = await resP.json();
  const pedidosUsuario = pedidos.filter(p => p.usuarioId === usuario.id);
  return { usuario, pedidos: pedidosUsuario };
}

function mostrarResultados({ usuario, pedidos }) {
  resultadosEl.innerHTML = '';
  const userHtml = document.createElement('div');
  userHtml.innerHTML = `
    <h2>Usuario encontrado</h2>
    <p><strong>Nombre:</strong> ${usuario.nombre}</p>
    <p><strong>Email:</strong> ${usuario.email}</p>
    <p><strong>Fecha de registro:</strong> ${usuario.fechaRegistro || '—'}</p>
  `;
  resultadosEl.appendChild(userHtml);
  const pedidosHeader = document.createElement('div');
  if (!pedidos || pedidos.length === 0) {
    pedidosHeader.innerHTML = '<p>Este usuario no tiene pedidos registrados.</p>';
    resultadosEl.appendChild(pedidosHeader);
    return;
  }
  pedidosHeader.innerHTML = '<h3>Pedidos del usuario</h3>';
  resultadosEl.appendChild(pedidosHeader);
  for (const p of pedidos) {
    const pedDiv = document.createElement('div');
    pedDiv.className = 'pedido';
    pedDiv.innerHTML = `
      <p><strong>ID:</strong> ${p.id}</p>
      <p><strong>Fecha:</strong> ${p.fecha}</p>
      <p><strong>Estado:</strong> ${p.estado}</p>
    `;
    resultadosEl.appendChild(pedDiv);
  }
}
