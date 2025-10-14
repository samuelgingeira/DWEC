const input = document.getElementById('tarea-input');
const btnAdd = document.getElementById('btn-add');
const ul = document.getElementById('lista');

btnAdd.addEventListener('click', () => {
  const texto = input.value.trim();
  if (!texto) return;
  const li = document.createElement('li');
  li.innerHTML = `<span>${texto}</span> <button class="eliminar">Eliminar</button>`;
  ul.appendChild(li);
  input.value = '';
});

ul.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('eliminar')) {
    const li = e.target.parentNode;
    li.remove();
  }
});
