const productos = document.getElementById('productos');
const carrito = document.getElementById('carrito');
const totalSpan = document.getElementById('total');

productos.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('add')) {
    const li = e.target.closest('.producto');
    if (!li) return;
    const clone = li.cloneNode(true);
    clone.querySelector('button').textContent = 'Quitar';
    clone.querySelector('button').classList.remove('add');
    clone.querySelector('button').classList.add('quitar');
    carrito.appendChild(clone);
    calcularTotal();
  }
});

carrito.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('quitar')) {
    const li = e.target.closest('li');
    if (li) {
      li.remove();
      calcularTotal();
    }
  }
});

function calcularTotal() {
  const items = carrito.querySelectorAll('li');
  let suma = 0;
  items.forEach(li => {
    const price = parseFloat(li.getAttribute('data-price')) || 0;
    suma += price;
  });
  totalSpan.textContent = suma.toFixed(2) + '€';
}
