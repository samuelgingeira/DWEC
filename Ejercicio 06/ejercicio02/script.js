const form = document.getElementById('formFila');
const tbody = document.querySelector('#tabla tbody');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  if (!nombre || !apellido) return;
  const tr = document.createElement('tr');
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  td1.textContent = nombre;
  td2.textContent = apellido;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tbody.appendChild(tr);
  form.reset();
});
