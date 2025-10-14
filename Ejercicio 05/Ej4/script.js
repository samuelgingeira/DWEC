const usuarios = [
  { nombre: 'Ana', edad: 25, ciudad: 'Madrid' },
  { nombre: 'Luis', edad: 30, ciudad: 'Barcelona' },
  { nombre: 'María', edad: 22, ciudad: 'Valencia' }
];

function construirTabla(array) {
  const cont = document.getElementById('contenedor-tabla');
  cont.innerHTML = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');

  const keys = Object.keys(array[0] || {});
  keys.forEach(k => {
    const th = document.createElement('th');
    th.textContent = k;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const fragment = document.createDocumentFragment();

  array.forEach(obj => {
    const tr = document.createElement('tr');
    keys.forEach(k => {
      const td = document.createElement('td');
      td.textContent = obj[k];
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);
  table.appendChild(tbody);
  cont.appendChild(table);
}


construirTabla(usuarios);
