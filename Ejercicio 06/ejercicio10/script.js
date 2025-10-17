const carrito = [];

const obtenerDatosProductoDesdeNodo = (productoElemento) => {
  const nombre = productoElemento.querySelector('.nombre').textContent.trim();
  const precioTxt = productoElemento.querySelector('.valor').textContent.trim();
  const precio = parseFloat(precioTxt.replace(',', '.')) || 0;
  return { nombre, precio };
};

const listaCarrito = document.getElementById('listaCarrito');
const totalElem = document.getElementById('total');

document.querySelectorAll('.producto .añadir').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const productoNodo = e.target.closest('.producto');
    const { nombre, precio } = obtenerDatosProductoDesdeNodo(productoNodo);
    const index = carrito.findIndex(p => p.nombre === nombre);
    if (index >= 0) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }
    renderizarCarrito();
  });
});

function renderizarCarrito() {
  listaCarrito.innerHTML = '';
  carrito.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} (x${item.cantidad}) - ${item.precio.toFixed(2)} €`;
    listaCarrito.appendChild(li);
  });
  calcularTotal();
}

function calcularTotal() {
  const total = carrito.reduce((acc, cur) => acc + (cur.precio * cur.cantidad), 0);
  totalElem.textContent = total.toFixed(2) + ' €';
}
